import { NextRequest, NextResponse } from "next/server";
import {
  createOrderLookupToken,
  getRazorpayClient,
  verifyRazorpaySignature,
  isRazorpayConfigured,
  resolveVerifiedCartItems,
  type VerifiedOrderItem,
} from "@/lib/razorpay";
import {
  getPendingOrderSummaryFromSanity,
  markOrderPaidInSanity,
  sendOrderConfirmationNotifications,
} from "@/lib/orders";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderReference,
      customer,
      items,
      giftNote,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          error: "Missing required Razorpay payment verification parameters.",
        },
        { status: 400 }
      );
    }

    if (!isRazorpayConfigured()) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          error: "Razorpay secret key not configured on server.",
        },
        { status: 500 }
      );
    }

    const isValid = verifyRazorpaySignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!isValid) {
      console.error("Razorpay signature verification failed for:", {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      });

      return NextResponse.json(
        {
          success: false,
          verified: false,
          error: "Payment verification failed. Invalid cryptographic signature.",
        },
        { status: 400 }
      );
    }

    if (items !== undefined && (!Array.isArray(items) || items.length === 0)) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          error: "Order verification requires valid catalog items.",
        },
        { status: 400 }
      );
    }

    const razorpay = getRazorpayClient();

    // Run catalog resolution, Sanity pending order lookup, and Razorpay order + payment fetches concurrently
    const [resolvedCart, pendingOrder, rzpOrder, rzpPayment] = await Promise.all([
      items !== undefined ? resolveVerifiedCartItems(items) : Promise.resolve(null),
      getPendingOrderSummaryFromSanity(razorpay_order_id),
      razorpay
        ? razorpay.orders.fetch(razorpay_order_id).catch((fetchErr: unknown) => {
            console.warn("[Verify] Could not fetch Razorpay order details:", fetchErr);
            return null;
          })
        : Promise.resolve(null),
      razorpay
        ? razorpay.payments.fetch(razorpay_payment_id).catch((fetchErr: unknown) => {
            console.warn("[Verify] Could not fetch Razorpay payment details:", fetchErr);
            return null;
          })
        : Promise.resolve(null),
    ]);

    let verifiedItems: VerifiedOrderItem[] | undefined;
    let clientResolvedAmountPaise: number | undefined;
    if (resolvedCart) {
      if (!resolvedCart.valid) {
        return NextResponse.json(
          {
            success: false,
            verified: false,
            error: resolvedCart.error,
          },
          { status: 400 }
        );
      }
      verifiedItems = resolvedCart.items;
      clientResolvedAmountPaise = resolvedCart.amountPaise;
    }

    if (
      pendingOrder?.amountPaise &&
      clientResolvedAmountPaise !== undefined &&
      pendingOrder.amountPaise !== clientResolvedAmountPaise
    ) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          error: "Verified cart items do not match the initiated order amount.",
        },
        { status: 400 }
      );
    }

    let expectedAmountPaise = pendingOrder?.amountPaise ?? clientResolvedAmountPaise;

    if (rzpOrder) {
      const rzpAmount = Number(rzpOrder?.amount);
      const rzpCurrency = (rzpOrder?.currency || "INR").toUpperCase();

      if (rzpCurrency !== "INR") {
        return NextResponse.json(
          {
            success: false,
            verified: false,
            error: "Invalid order currency.",
          },
          { status: 400 }
        );
      }

      if (
        Number.isFinite(rzpAmount) &&
        expectedAmountPaise !== undefined &&
        rzpAmount !== expectedAmountPaise
      ) {
        return NextResponse.json(
          {
            success: false,
            verified: false,
            error: "Captured Razorpay order amount does not match catalog total.",
          },
          { status: 400 }
        );
      }

      if (expectedAmountPaise === undefined && Number.isFinite(rzpAmount)) {
        expectedAmountPaise = rzpAmount;
      }
    }

    if (rzpPayment) {
      const paymentAmount = Number(rzpPayment?.amount);
      const paymentCurrency = (rzpPayment?.currency || "INR").toUpperCase();
      const paymentStatus = String(rzpPayment?.status || "").toLowerCase();

      if (rzpPayment.order_id && rzpPayment.order_id !== razorpay_order_id) {
        return NextResponse.json(
          {
            success: false,
            verified: false,
            error: "Payment does not belong to the verified order.",
          },
          { status: 400 }
        );
      }

      if (paymentCurrency !== "INR") {
        return NextResponse.json(
          {
            success: false,
            verified: false,
            error: "Invalid payment currency.",
          },
          { status: 400 }
        );
      }

      if (paymentStatus !== "captured" && paymentStatus !== "authorized") {
        return NextResponse.json(
          {
            success: false,
            verified: false,
            error: `Payment is not in a valid paid state (${paymentStatus || "unknown"}).`,
          },
          { status: 400 }
        );
      }

      if (
        Number.isFinite(paymentAmount) &&
        expectedAmountPaise !== undefined &&
        paymentAmount !== expectedAmountPaise
      ) {
        return NextResponse.json(
          {
            success: false,
            verified: false,
            error: "Captured payment amount does not match order total.",
          },
          { status: 400 }
        );
      }
    }

    if (!pendingOrder && (!verifiedItems || (!rzpOrder && !rzpPayment))) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          error: "Order record could not be verified against catalog items.",
        },
        { status: 400 }
      );
    }

    const finalOrderReference =
      pendingOrder?.orderReference || orderReference || razorpay_order_id;

    const persisted = await markOrderPaidInSanity({
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      orderReference: finalOrderReference,
      amountPaise: expectedAmountPaise,
      currency: "INR",
      customer: pendingOrder?.customer || customer,
      items: pendingOrder?.items || verifiedItems,
      giftNote: pendingOrder?.giftNote ?? giftNote,
    });

    if (!persisted) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          error:
            "Payment was verified, but the order ledger could not be updated. Please contact sales@ligeroparfums.com with your payment ID.",
        },
        { status: 500 }
      );
    }

    const emailResult = await sendOrderConfirmationNotifications(razorpay_order_id).catch(
      (err) => {
        console.error("[Verify] Order confirmation email error:", err);
        return null;
      }
    );

    const lookupToken = createOrderLookupToken({
      orderId: finalOrderReference,
      paymentId: razorpay_payment_id,
    });

    return NextResponse.json({
      success: true,
      verified: true,
      orderReference: finalOrderReference,
      paymentId: razorpay_payment_id,
      amountPaise: expectedAmountPaise,
      totalInr:
        expectedAmountPaise !== undefined ? Math.round(expectedAmountPaise / 100) : undefined,
      lookupToken,
      confirmationEmailSent: Boolean(emailResult?.sent),
      message: "Payment successfully verified.",
    });
  } catch (error) {
    console.error("Error during payment verification:", error);
    return NextResponse.json(
      {
        success: false,
        verified: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

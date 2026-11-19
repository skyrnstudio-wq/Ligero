import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpayWebhookSignature } from "@/lib/razorpay";
import {
  getPendingOrderSummaryFromSanity,
  markOrderFailedInSanity,
  markOrderPaidInSanity,
  markOrderRefundedInSanity,
  sendOrderConfirmationNotifications,
} from "@/lib/orders";

export const runtime = "nodejs";

interface RazorpayWebhookPayload {
  event?: string;
  payload?: {
    payment?: {
      entity?: {
        id?: string;
        order_id?: string;
        amount?: number;
        currency?: string;
        error_description?: string;
        notes?: Record<string, string>;
      };
    };
    order?: {
      entity?: {
        id?: string;
        amount?: number;
        currency?: string;
        receipt?: string;
        notes?: Record<string, string>;
      };
    };
    refund?: {
      entity?: {
        id?: string;
        payment_id?: string;
        amount?: number;
        currency?: string;
        status?: string;
      };
    };
  };
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature") || "";

    if (!rawBody || !signature) {
      return NextResponse.json(
        { success: false, error: "Missing webhook payload or signature header." },
        { status: 400 }
      );
    }

    if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
      return NextResponse.json(
        { success: false, error: "Razorpay webhook secret is not configured on server." },
        { status: 500 }
      );
    }

    const isValid = verifyRazorpayWebhookSignature({
      rawBody,
      signature,
    });

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid Razorpay webhook signature." },
        { status: 400 }
      );
    }

    const data = JSON.parse(rawBody) as RazorpayWebhookPayload;
    const event = data.event || "";
    const paymentEntity = data.payload?.payment?.entity;
    const orderEntity = data.payload?.order?.entity;
    const refundEntity = data.payload?.refund?.entity;

    const razorpayOrderId = paymentEntity?.order_id || orderEntity?.id || "";
    const razorpayPaymentId = paymentEntity?.id || refundEntity?.payment_id || "";
    const amountPaise =
      paymentEntity?.amount || orderEntity?.amount || refundEntity?.amount;
    const notes = paymentEntity?.notes || orderEntity?.notes || {};
    const orderReference = notes.orderReference || orderEntity?.receipt || razorpayOrderId;

    if (
      (event === "payment.captured" || event === "order.paid") &&
      razorpayOrderId &&
      razorpayPaymentId
    ) {
      const eventCurrency = (
        paymentEntity?.currency ||
        orderEntity?.currency ||
        "INR"
      ).toUpperCase();
      if (eventCurrency !== "INR") {
        console.error("[Razorpay Webhook] Rejected non-INR payment event:", {
          razorpayOrderId,
          razorpayPaymentId,
          eventCurrency,
        });
        return NextResponse.json(
          { success: false, error: "Unsupported payment currency." },
          { status: 400 }
        );
      }

      const pendingOrder = await getPendingOrderSummaryFromSanity(razorpayOrderId);
      if (
        pendingOrder?.amountPaise &&
        amountPaise !== undefined &&
        Number(amountPaise) !== pendingOrder.amountPaise
      ) {
        console.error("[Razorpay Webhook] Payment amount mismatch:", {
          razorpayOrderId,
          razorpayPaymentId,
          expectedPaise: pendingOrder.amountPaise,
          receivedPaise: amountPaise,
        });
        return NextResponse.json(
          { success: false, error: "Captured webhook amount does not match order total." },
          { status: 400 }
        );
      }

      const persisted = await markOrderPaidInSanity({
        razorpayOrderId,
        razorpayPaymentId,
        orderReference: pendingOrder?.orderReference || orderReference,
        amountPaise: pendingOrder?.amountPaise ?? amountPaise,
        currency: "INR",
        customer: notes.customerName
          ? {
              fullName: notes.customerName,
              email: notes.customerEmail,
              phone: notes.customerPhone,
              address: notes.shippingAddress,
              city: notes.city,
              state: notes.state,
              pincode: notes.pincode,
            }
          : undefined,
        giftNote: notes.giftNote,
      });

      if (!persisted) {
        return NextResponse.json(
          { success: false, error: "Failed to persist paid order state to Sanity." },
          { status: 500 }
        );
      }

      await sendOrderConfirmationNotifications(razorpayOrderId).catch((err) => {
        console.error("[Razorpay Webhook] Order confirmation email error:", err);
      });
    } else if (event === "payment.failed" && razorpayOrderId) {
      const persisted = await markOrderFailedInSanity({
        razorpayOrderId,
        razorpayPaymentId,
        reason: paymentEntity?.error_description,
      });

      if (!persisted) {
        return NextResponse.json(
          { success: false, error: "Failed to persist failed order state to Sanity." },
          { status: 500 }
        );
      }
    } else if (
      (event === "refund.processed" ||
        event === "payment.refunded" ||
        (event === "refund.created" && refundEntity?.status === "processed")) &&
      (razorpayOrderId || razorpayPaymentId)
    ) {
      const persisted = await markOrderRefundedInSanity({
        razorpayOrderId,
        razorpayPaymentId,
        razorpayRefundId: refundEntity?.id,
        amountPaise: refundEntity?.amount ?? amountPaise,
      });

      if (!persisted) {
        return NextResponse.json(
          { success: false, error: "Failed to persist refunded order state to Sanity." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      received: true,
      event,
    });
  } catch (error) {
    console.error("[Razorpay Webhook] Processing error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Webhook processing failed.",
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import {
  verifyRazorpaySignature,
  isRazorpayConfigured,
  resolveVerifiedCartItems,
} from "@/lib/razorpay";
import { markOrderPaidInSanity } from "@/lib/orders";

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

    let verifiedItems;
    let amountPaise: number | undefined;
    if (Array.isArray(items) && items.length > 0) {
      const resolved = await resolveVerifiedCartItems(items);
      if (resolved.valid) {
        verifiedItems = resolved.items;
        amountPaise = resolved.amountPaise;
      }
    }

    await markOrderPaidInSanity({
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      orderReference,
      amountPaise,
      currency: "INR",
      customer,
      items: verifiedItems,
      giftNote,
    });

    return NextResponse.json({
      success: true,
      verified: true,
      orderReference: orderReference || razorpay_order_id,
      paymentId: razorpay_payment_id,
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

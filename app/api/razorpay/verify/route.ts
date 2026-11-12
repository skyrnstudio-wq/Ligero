import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpaySignature, isRazorpayConfigured } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderReference,
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

import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpayWebhookSignature } from "@/lib/razorpay";
import { markOrderFailedInSanity, markOrderPaidInSanity } from "@/lib/orders";

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

    const razorpayOrderId = paymentEntity?.order_id || orderEntity?.id || "";
    const razorpayPaymentId = paymentEntity?.id || "";
    const amountPaise = paymentEntity?.amount || orderEntity?.amount;
    const currency = paymentEntity?.currency || orderEntity?.currency || "INR";
    const notes = paymentEntity?.notes || orderEntity?.notes || {};
    const orderReference = notes.orderReference || orderEntity?.receipt || razorpayOrderId;

    if ((event === "payment.captured" || event === "order.paid") && razorpayOrderId && razorpayPaymentId) {
      await markOrderPaidInSanity({
        razorpayOrderId,
        razorpayPaymentId,
        orderReference,
        amountPaise,
        currency,
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
    } else if (event === "payment.failed" && razorpayOrderId) {
      await markOrderFailedInSanity({
        razorpayOrderId,
        razorpayPaymentId,
        reason: paymentEntity?.error_description,
      });
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

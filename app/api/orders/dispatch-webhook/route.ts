import { NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { sendOrderDispatchNotification } from "@/lib/orders";

export const runtime = "nodejs";

interface SanityOrderWebhookPayload {
  _id?: string;
  _type?: string;
  razorpayOrderId?: string;
  orderReference?: string;
  fulfilmentStatus?: string;
}

export async function POST(req: NextRequest) {
  try {
    const webhookSecret = (
      process.env.SANITY_ORDER_WEBHOOK_SECRET ||
      process.env.SANITY_REVALIDATE_SECRET ||
      ""
    ).trim();

    if (!webhookSecret) {
      return NextResponse.json(
        { success: false, error: "Sanity order webhook secret is not configured." },
        { status: 503 }
      );
    }

    const { isValidSignature, body } = await parseBody<SanityOrderWebhookPayload>(
      req,
      webhookSecret
    );

    if (isValidSignature !== true) {
      return NextResponse.json(
        { success: false, error: "Invalid Sanity webhook signature." },
        { status: 401 }
      );
    }

    if (!body || body._type !== "order") {
      return NextResponse.json({
        success: true,
        skipped: "non_order_document",
      });
    }

    const result = await sendOrderDispatchNotification({
      orderDocId: body._id,
      razorpayOrderId: body.razorpayOrderId,
      orderReference: body.orderReference,
    });

    if (result.attempted && !result.sent) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Failed to send order dispatch email.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("[Order Dispatch Webhook] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Dispatch webhook processing failed.",
      },
      { status: 500 }
    );
  }
}

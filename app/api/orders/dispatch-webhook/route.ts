import { NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { sendOrderDispatchNotification } from "@/lib/orders";
import { NO_STORE_HEADERS } from "@/lib/razorpay";

export const runtime = "nodejs";

function jsonNoStore(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: NO_STORE_HEADERS });
}

interface SanityOrderWebhookPayload {
  _id?: string;
  _type?: string;
  razorpayOrderId?: string;
  orderReference?: string;
  fulfilmentStatus?: string;
}

export async function POST(req: NextRequest) {
  try {
    const contentLength = Number(req.headers.get("content-length") || "0");
    if (Number.isFinite(contentLength) && contentLength > 64 * 1024) {
      return jsonNoStore(
        { success: false, error: "Webhook payload exceeds maximum allowed size." },
        413
      );
    }

    const webhookSecret = (
      process.env.SANITY_ORDER_WEBHOOK_SECRET ||
      process.env.SANITY_REVALIDATE_SECRET ||
      ""
    ).trim();

    if (!webhookSecret) {
      return jsonNoStore(
        { success: false, error: "Sanity order webhook secret is not configured." },
        503
      );
    }

    const { isValidSignature, body } = await parseBody<SanityOrderWebhookPayload>(
      req,
      webhookSecret
    );

    if (isValidSignature !== true) {
      return jsonNoStore(
        { success: false, error: "Invalid Sanity webhook signature." },
        401
      );
    }

    if (!body || body._type !== "order") {
      return jsonNoStore({
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
      console.error("[Order Dispatch Webhook] Email send failed:", result.error);
      return jsonNoStore(
        {
          success: false,
          error: "Failed to send order dispatch email.",
        },
        500
      );
    }

    return jsonNoStore({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("[Order Dispatch Webhook] Error:", error);
    return jsonNoStore(
      {
        success: false,
        error: "Dispatch webhook processing failed.",
      },
      500
    );
  }
}

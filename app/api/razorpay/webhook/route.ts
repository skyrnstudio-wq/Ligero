import { NextRequest, NextResponse } from "next/server";
import { NO_STORE_HEADERS, verifyRazorpayWebhookSignature } from "@/lib/razorpay";
import { readBoundedText } from "@/lib/security";
import {
  getPendingOrderSummaryFromSanity,
  markOrderFailedInSanity,
  markOrderPaidInSanity,
  markOrderRefundedInSanity,
  sendOrderConfirmationNotifications,
} from "@/lib/orders";

export const runtime = "nodejs";

function jsonNoStore(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: NO_STORE_HEADERS });
}

interface RazorpayWebhookPayload {
  event?: string;
  payload?: {
    payment?: {
      entity?: {
        id?: string;
        order_id?: string;
        amount?: number;
        amount_refunded?: number;
        refund_status?: string | null;
        currency?: string;
        status?: string;
        captured?: boolean;
        error_description?: string;
        notes?: Record<string, string>;
      };
    };
    order?: {
      entity?: {
        id?: string;
        amount?: number;
        amount_paid?: number;
        amount_due?: number;
        status?: string;
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
    const bodyResult = await readBoundedText(req, 256 * 1024);
    if (!bodyResult.ok) {
      return jsonNoStore(
        { success: false, error: bodyResult.error },
        bodyResult.status
      );
    }
    const rawBody = bodyResult.text;
    const signature = req.headers.get("x-razorpay-signature") || "";

    if (!rawBody || !signature) {
      return jsonNoStore(
        { success: false, error: "Missing webhook payload or signature header." },
        400
      );
    }

    if (!(process.env.RAZORPAY_WEBHOOK_SECRET || "").trim()) {
      return jsonNoStore(
        { success: false, error: "Razorpay webhook secret is not configured on server." },
        503
      );
    }

    const isValid = verifyRazorpayWebhookSignature({
      rawBody,
      signature,
    });

    if (!isValid) {
      return jsonNoStore(
        { success: false, error: "Invalid Razorpay webhook signature." },
        400
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawBody);
    } catch {
      return jsonNoStore(
        { success: false, error: "Invalid JSON webhook payload." },
        400
      );
    }

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return jsonNoStore(
        { success: false, error: "Webhook payload must be a JSON object." },
        400
      );
    }

    const data = parsed as RazorpayWebhookPayload;
    const event = typeof data.event === "string" ? data.event : "";
    const paymentEntity = data.payload?.payment?.entity;
    const orderEntity = data.payload?.order?.entity;
    const refundEntity = data.payload?.refund?.entity;

    const razorpayOrderId = (paymentEntity?.order_id || orderEntity?.id || "").trim();
    const razorpayPaymentId = (paymentEntity?.id || refundEntity?.payment_id || "").trim();
    const amountPaise =
      paymentEntity?.amount ?? orderEntity?.amount ?? refundEntity?.amount;
    const notes = paymentEntity?.notes || orderEntity?.notes || {};
    const orderReference = (
      notes.orderReference ||
      orderEntity?.receipt ||
      razorpayOrderId
    ).trim();
    const isLigeroReference =
      typeof orderReference === "string" && orderReference.startsWith("LGP-");

    if (
      (event === "payment.captured" || event === "order.paid") &&
      razorpayOrderId &&
      razorpayPaymentId
    ) {
      if (
        paymentEntity?.order_id &&
        orderEntity?.id &&
        paymentEntity.order_id !== orderEntity.id
      ) {
        return jsonNoStore(
          { success: false, error: "Webhook payment and order identifiers do not match." },
          400
        );
      }

      if (
        paymentEntity?.status &&
        paymentEntity.status.toLowerCase() !== "captured"
      ) {
        return jsonNoStore({
          success: true,
          received: true,
          ignored: true,
          reason: `payment_status_${paymentEntity.status}`,
          event,
        });
      }

      if (event === "order.paid" && orderEntity) {
        const orderStatus = String(orderEntity.status || "").toLowerCase();
        const amountDue = Number(orderEntity.amount_due ?? 0);
        if ((orderStatus && orderStatus !== "paid") || amountDue > 0) {
          return jsonNoStore({
            success: true,
            received: true,
            ignored: true,
            reason: "order_not_fully_paid",
            event,
          });
        }
      }

      const eventCurrency = String(
        paymentEntity?.currency || orderEntity?.currency || ""
      ).toUpperCase();
      if (eventCurrency !== "INR") {
        console.error("[Razorpay Webhook] Rejected non-INR payment event:", {
          razorpayOrderId,
          razorpayPaymentId,
          eventCurrency,
        });
        return jsonNoStore(
          { success: false, error: "Unsupported payment currency." },
          400
        );
      }

      const pendingOrder = await getPendingOrderSummaryFromSanity(razorpayOrderId);

      // Ignore payments from unrelated apps/payment-links on the same Razorpay merchant account.
      if (!pendingOrder && !isLigeroReference) {
        return jsonNoStore({
          success: true,
          received: true,
          ignored: true,
          reason: "untracked_order",
          event,
        });
      }

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
        return jsonNoStore(
          { success: false, error: "Captured webhook amount does not match order total." },
          400
        );
      }

      const paidResult = await markOrderPaidInSanity({
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

      if (!paidResult.persisted) {
        return jsonNoStore(
          { success: false, error: "Failed to persist paid order state to Sanity." },
          500
        );
      }

      if (!paidResult.alreadyRefunded) {
        await sendOrderConfirmationNotifications(razorpayOrderId).catch((err) => {
          console.error("[Razorpay Webhook] Order confirmation email error:", err);
        });
      }
    } else if (event === "payment.failed" && razorpayOrderId) {
      const persisted = await markOrderFailedInSanity({
        razorpayOrderId,
        razorpayPaymentId,
        reason: paymentEntity?.error_description,
        allowCreate: isLigeroReference,
      });

      if (!persisted) {
        return jsonNoStore(
          { success: false, error: "Failed to persist failed order state to Sanity." },
          500
        );
      }
    } else if (
      (event === "refund.processed" ||
        event === "payment.refunded" ||
        (event === "refund.created" && refundEntity?.status === "processed")) &&
      (razorpayOrderId || razorpayPaymentId)
    ) {
      const isFullRefund =
        String(paymentEntity?.refund_status || "").toLowerCase() === "full" ||
        event === "payment.refunded";

      const refundResult = await markOrderRefundedInSanity({
        razorpayOrderId,
        razorpayPaymentId,
        razorpayRefundId: refundEntity?.id,
        amountPaise: refundEntity?.amount ?? amountPaise,
        totalRefundedPaise: paymentEntity?.amount_refunded,
        isFullRefund,
      });

      if (!refundResult.persisted) {
        return jsonNoStore(
          { success: false, error: "Failed to persist refunded order state to Sanity." },
          500
        );
      }

      if (refundResult.ignored) {
        return jsonNoStore({
          success: true,
          received: true,
          ignored: true,
          reason: "untracked_refund_order",
          event,
        });
      }
    }

    return jsonNoStore({
      success: true,
      received: true,
      event,
    });
  } catch (error) {
    console.error("[Razorpay Webhook] Processing error:", error);
    return jsonNoStore(
      {
        success: false,
        error: "Webhook processing failed.",
      },
      500
    );
  }
}

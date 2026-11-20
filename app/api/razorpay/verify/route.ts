import { NextRequest, NextResponse } from "next/server";
import {
  NO_STORE_HEADERS,
  createOrderLookupToken,
  getRazorpayClient,
  isRazorpayConfigured,
  isValidHexSignature,
  isValidRazorpayOrderId,
  isValidRazorpayPaymentId,
  resolveVerifiedCartItems,
  verifyRazorpaySignature,
  type VerifiedOrderItem,
} from "@/lib/razorpay";
import {
  getPendingOrderSummaryFromSanity,
  markOrderPaidInSanity,
  sendOrderConfirmationNotifications,
} from "@/lib/orders";
import {
  createRateLimiter,
  getClientIp,
  rateLimitHeaders,
  readBoundedJsonObject,
  sanitizeText,
} from "@/lib/security";

export const runtime = "nodejs";

const MAX_VERIFY_BYTES = 32 * 1024;
const verifyLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

function jsonNoStore(
  body: unknown,
  status = 200,
  extraHeaders?: Record<string, string>
) {
  return NextResponse.json(body, {
    status,
    headers: {
      ...NO_STORE_HEADERS,
      ...(extraHeaders || {}),
    },
  });
}

async function withOneRetry<T>(fn: () => Promise<T>, label: string): Promise<T | null> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === 0) {
        await new Promise((resolve) => setTimeout(resolve, 350));
      } else {
        console.warn(`[Verify] ${label} failed after retry:`, err);
      }
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const limit = verifyLimiter.check(getClientIp(req));
    if (!limit.allowed) {
      return jsonNoStore(
        {
          success: false,
          verified: false,
          retryable: true,
          error: "Too many verification attempts. Please wait a moment and try again.",
        },
        429,
        rateLimitHeaders(limit)
      );
    }

    const parsed = await readBoundedJsonObject(req, MAX_VERIFY_BYTES);
    if (!parsed.ok) {
      return jsonNoStore(
        {
          success: false,
          verified: false,
          error: parsed.error,
        },
        parsed.status,
        rateLimitHeaders(limit)
      );
    }
    const rawBody = parsed.data;

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customer,
      items,
      giftNote,
    } = rawBody as {
      razorpay_order_id?: unknown;
      razorpay_payment_id?: unknown;
      razorpay_signature?: unknown;
      customer?: Record<string, unknown>;
      items?: unknown;
      giftNote?: unknown;
    };

    if (
      !isValidRazorpayOrderId(razorpay_order_id) ||
      !isValidRazorpayPaymentId(razorpay_payment_id) ||
      !isValidHexSignature(razorpay_signature)
    ) {
      return jsonNoStore(
        {
          success: false,
          verified: false,
          error: "Missing or invalid Razorpay payment verification parameters.",
        },
        400
      );
    }

    const cleanOrderId = razorpay_order_id.trim();
    const cleanPaymentId = razorpay_payment_id.trim();
    const cleanSignature = razorpay_signature.trim().toLowerCase();

    if (!isRazorpayConfigured()) {
      return jsonNoStore(
        {
          success: false,
          verified: false,
          error: "Razorpay secret key not configured on server.",
        },
        503
      );
    }

    const isValid = verifyRazorpaySignature({
      orderId: cleanOrderId,
      paymentId: cleanPaymentId,
      signature: cleanSignature,
    });

    if (!isValid) {
      console.error("Razorpay signature verification failed for:", {
        orderId: cleanOrderId,
        paymentId: cleanPaymentId,
      });

      return jsonNoStore(
        {
          success: false,
          verified: false,
          error: "Payment verification failed. Invalid cryptographic signature.",
        },
        400
      );
    }

    if (items !== undefined && (!Array.isArray(items) || items.length === 0)) {
      return jsonNoStore(
        {
          success: false,
          verified: false,
          error: "Order verification requires valid catalog items.",
        },
        400
      );
    }

    const razorpay = getRazorpayClient();
    if (!razorpay) {
      return jsonNoStore(
        {
          success: false,
          verified: false,
          error: "Razorpay client unavailable on server.",
        },
        503
      );
    }

    // Run catalog resolution, Sanity pending order lookup, and Razorpay order + payment fetches concurrently
    const [resolvedCart, pendingOrder, rzpOrder, fetchedPayment] = await Promise.all([
      items !== undefined ? resolveVerifiedCartItems(items) : Promise.resolve(null),
      getPendingOrderSummaryFromSanity(cleanOrderId),
      withOneRetry(() => razorpay.orders.fetch(cleanOrderId), "orders.fetch"),
      withOneRetry(() => razorpay.payments.fetch(cleanPaymentId), "payments.fetch"),
    ]);

    let rzpPayment = fetchedPayment;

    // Block replay of an already refunded order.
    if (
      pendingOrder?.paymentStatus === "refunded" ||
      pendingOrder?.paymentStatus === "partially_refunded"
    ) {
      return jsonNoStore(
        {
          success: false,
          verified: false,
          error: "This order has already been refunded and cannot be re-verified.",
        },
        409
      );
    }

    let verifiedItems: VerifiedOrderItem[] | undefined;
    let clientResolvedAmountPaise: number | undefined;
    if (resolvedCart) {
      if (!resolvedCart.valid) {
        return jsonNoStore(
          {
            success: false,
            verified: false,
            error: resolvedCart.error,
          },
          400
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
      return jsonNoStore(
        {
          success: false,
          verified: false,
          error: "Verified cart items do not match the initiated order amount.",
        },
        400
      );
    }

    let expectedAmountPaise = pendingOrder?.amountPaise ?? clientResolvedAmountPaise;

    if (rzpOrder) {
      const rzpAmount = Number(rzpOrder?.amount);
      const rzpCurrency = String(rzpOrder?.currency || "").toUpperCase();

      if (rzpOrder.id && rzpOrder.id !== cleanOrderId) {
        return jsonNoStore(
          {
            success: false,
            verified: false,
            error: "Razorpay order identifier mismatch.",
          },
          400
        );
      }

      if (rzpCurrency !== "INR") {
        return jsonNoStore(
          {
            success: false,
            verified: false,
            error: "Invalid order currency.",
          },
          400
        );
      }

      if (
        Number.isFinite(rzpAmount) &&
        expectedAmountPaise !== undefined &&
        rzpAmount !== expectedAmountPaise
      ) {
        return jsonNoStore(
          {
            success: false,
            verified: false,
            error: "Captured Razorpay order amount does not match catalog total.",
          },
          400
        );
      }

      if (expectedAmountPaise === undefined && Number.isFinite(rzpAmount)) {
        expectedAmountPaise = rzpAmount;
      }
    }

    // Idempotent fast-path: if webhook or an earlier verify call already settled this exact payment in Sanity,
    // allow safe retry even if Razorpay's API is transiently slow, unless Razorpay now reports it refunded.
    const alreadySettledSamePayment =
      pendingOrder?.paymentStatus === "paid" &&
      pendingOrder?.razorpayPaymentId === cleanPaymentId;

    if (!rzpPayment && !alreadySettledSamePayment) {
      return jsonNoStore(
        {
          success: false,
          verified: false,
          retryable: true,
          error:
            "Unable to confirm payment status with Razorpay right now. Please wait while we retry.",
        },
        503
      );
    }

    if (rzpPayment) {
      const paymentAmount = Number(rzpPayment?.amount);
      const paymentCurrency = String(rzpPayment?.currency || "").toUpperCase();
      let paymentStatus = String(rzpPayment?.status || "").toLowerCase();
      const refundStatus = String(rzpPayment?.refund_status || "").toLowerCase();
      const amountRefunded = Number(rzpPayment?.amount_refunded || 0);

      if (rzpPayment.order_id !== cleanOrderId) {
        return jsonNoStore(
          {
            success: false,
            verified: false,
            error: "Payment does not belong to the verified order.",
          },
          400
        );
      }

      if (paymentCurrency !== "INR") {
        return jsonNoStore(
          {
            success: false,
            verified: false,
            error: "Invalid payment currency.",
          },
          400
        );
      }

      if (
        paymentStatus === "refunded" ||
        refundStatus === "full" ||
        (Number.isFinite(paymentAmount) && paymentAmount > 0 && amountRefunded >= paymentAmount)
      ) {
        return jsonNoStore(
          {
            success: false,
            verified: false,
            error: "This payment has already been refunded.",
          },
          409
        );
      }

      if (
        !Number.isFinite(paymentAmount) ||
        paymentAmount < 100 ||
        (expectedAmountPaise !== undefined && paymentAmount !== expectedAmountPaise)
      ) {
        return jsonNoStore(
          {
            success: false,
            verified: false,
            error: "Captured payment amount does not match order total.",
          },
          400
        );
      }

      if (expectedAmountPaise === undefined) {
        expectedAmountPaise = paymentAmount;
      }

      // If payment is authorized (manual capture or auto-capture transition), capture it server-side
      // so funds are never left uncaptured and auto-refunded after 5 days.
      if (paymentStatus === "authorized") {
        try {
          const captured = await razorpay.payments.capture(
            cleanPaymentId,
            paymentAmount,
            "INR"
          );
          rzpPayment = captured;
          paymentStatus = String(captured?.status || "").toLowerCase();
        } catch (captureErr: unknown) {
          const errMsg =
            (captureErr as { error?: { description?: string }; message?: string })?.error
              ?.description ||
            (captureErr instanceof Error ? captureErr.message : "");
          if (/already\s+been\s+captured/i.test(errMsg)) {
            const refreshed = await withOneRetry(
              () => razorpay.payments.fetch(cleanPaymentId),
              "payments.fetch(post-capture)"
            );
            if (refreshed) {
              rzpPayment = refreshed;
              paymentStatus = String(refreshed.status || "").toLowerCase();
            }
          } else {
            console.error("[Verify] Payment capture failed:", captureErr);
            return jsonNoStore(
              {
                success: false,
                verified: false,
                retryable: true,
                error: "Payment authorization could not be captured. Please contact concierge with your payment ID.",
              },
              502
            );
          }
        }
      }

      if (paymentStatus !== "captured") {
        return jsonNoStore(
          {
            success: false,
            verified: false,
            error: `Payment is not captured (${paymentStatus || "unknown"}).`,
          },
          400
        );
      }
    }

    if (!pendingOrder && (!verifiedItems || (!rzpOrder && !rzpPayment))) {
      return jsonNoStore(
        {
          success: false,
          verified: false,
          error: "Order record could not be verified against catalog items.",
        },
        400
      );
    }

    const rzpReceipt =
      typeof rzpOrder?.receipt === "string" && rzpOrder.receipt.trim()
        ? rzpOrder.receipt.trim()
        : "";
    const rzpNoteRef =
      typeof rzpOrder?.notes?.orderReference === "string" && rzpOrder.notes.orderReference.trim()
        ? rzpOrder.notes.orderReference.trim()
        : "";

    const finalOrderReference =
      pendingOrder?.orderReference || rzpReceipt || rzpNoteRef || cleanOrderId;

    const cleanGiftNote =
      typeof giftNote === "string" ? sanitizeText(giftNote, 500, true) : undefined;

    const paidResult = await markOrderPaidInSanity({
      razorpayOrderId: cleanOrderId,
      razorpayPaymentId: cleanPaymentId,
      razorpaySignature: cleanSignature,
      orderReference: finalOrderReference,
      amountPaise: expectedAmountPaise,
      currency: "INR",
      customer: pendingOrder?.customer || (customer as Record<string, string> | undefined),
      items: pendingOrder?.items || verifiedItems,
      giftNote: pendingOrder?.giftNote ?? cleanGiftNote,
    });

    if (paidResult.alreadyRefunded) {
      return jsonNoStore(
        {
          success: false,
          verified: false,
          error: "This order has already been refunded and cannot be re-verified.",
        },
        409
      );
    }

    if (!paidResult.persisted) {
      return jsonNoStore(
        {
          success: false,
          verified: false,
          retryable: true,
          error:
            "Payment was verified, but the order ledger could not be updated. Please contact sales@ligeroparfum.com with your payment ID.",
        },
        503
      );
    }

    const emailResult = await sendOrderConfirmationNotifications(cleanOrderId).catch((err) => {
      console.error("[Verify] Order confirmation email error:", err);
      return null;
    });

    const lookupToken = createOrderLookupToken({
      orderId: finalOrderReference,
      paymentId: cleanPaymentId,
    });

    return jsonNoStore({
      success: true,
      verified: true,
      orderReference: finalOrderReference,
      paymentId: cleanPaymentId,
      amountPaise: expectedAmountPaise,
      totalInr:
        expectedAmountPaise !== undefined ? Math.round(expectedAmountPaise / 100) : undefined,
      lookupToken,
      confirmationEmailSent: Boolean(emailResult?.sent),
      message: "Payment successfully verified.",
    });
  } catch (error) {
    console.error("Error during payment verification:", error);
    return jsonNoStore(
      {
        success: false,
        verified: false,
        retryable: true,
        error: "Internal error verifying payment. Please wait while we retry.",
      },
      500
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  NO_STORE_HEADERS,
  getRazorpayClient,
  getRazorpayKeyId,
  isRazorpayConfigured,
  resolveVerifiedCartItems,
} from "@/lib/razorpay";
import { validateCheckoutCustomer } from "@/lib/checkout-validation";
import { isOrderStorageConfigured, savePendingOrderToSanity } from "@/lib/orders";
import {
  createRateLimiter,
  getClientIp,
  rateLimitHeaders,
  readBoundedJsonObject,
  sanitizeText,
} from "@/lib/security";

export const runtime = "nodejs";

const MAX_CREATE_ORDER_BYTES = 32 * 1024;
const createOrderLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

interface RazorpayApiError {
  statusCode?: number;
  error?: {
    code?: string;
    description?: string;
  };
}

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

export async function POST(req: NextRequest) {
  try {
    const limit = createOrderLimiter.check(getClientIp(req));
    if (!limit.allowed) {
      return jsonNoStore(
        {
          success: false,
          error: "Too many checkout attempts. Please wait a few minutes and try again.",
        },
        429,
        rateLimitHeaders(limit)
      );
    }

    const parsed = await readBoundedJsonObject(req, MAX_CREATE_ORDER_BYTES);
    if (!parsed.ok) {
      return jsonNoStore(
        { success: false, error: parsed.error },
        parsed.status,
        rateLimitHeaders(limit)
      );
    }
    const rawBody = parsed.data;

    const { items, customer, giftNote, expectedAmountPaise } = rawBody as {
      items?: unknown;
      customer?: unknown;
      giftNote?: unknown;
      expectedAmountPaise?: unknown;
    };

    if (!Array.isArray(items) || items.length === 0) {
      return jsonNoStore(
        { success: false, error: "Your case is empty." },
        400
      );
    }

    const resolved = await resolveVerifiedCartItems(items);
    if (!resolved.valid) {
      return jsonNoStore(
        { success: false, error: resolved.error },
        400
      );
    }

    const customerCheck = validateCheckoutCustomer(
      customer && typeof customer === "object"
        ? (customer as Record<string, unknown>)
        : undefined
    );
    if (!customerCheck.valid) {
      return jsonNoStore(
        {
          success: false,
          error: customerCheck.error,
          fieldErrors: customerCheck.errors,
        },
        400
      );
    }

    const validatedCustomer = customerCheck.customer;
    const verifiedItems = resolved.items;
    const amountInPaise = resolved.amountPaise;

    if (!Number.isSafeInteger(amountInPaise) || amountInPaise < 100) {
      return jsonNoStore(
        { success: false, error: "Amount must be at least 100 paise." },
        400
      );
    }

    // If the client displayed a stale localStorage total that differs from live catalog pricing,
    // reject with 409 before creating a Razorpay order so the customer confirms the updated total.
    if (expectedAmountPaise !== undefined && expectedAmountPaise !== null) {
      const clientPaise = Number(expectedAmountPaise);
      if (!Number.isFinite(clientPaise) || Math.round(clientPaise) !== amountInPaise) {
        return jsonNoStore(
          {
            success: false,
            priceChanged: true,
            amountPaise: amountInPaise,
            totalInr: resolved.totalInr,
            items: verifiedItems,
            error:
              "Catalog pricing has been updated since you added items to your case. Please review the updated total and try again.",
          },
          409
        );
      }
    }

    if (!isRazorpayConfigured()) {
      return jsonNoStore(
        {
          success: false,
          configured: false,
          error: "Razorpay API credentials are not configured.",
        },
        503
      );
    }

    if (!isOrderStorageConfigured()) {
      return jsonNoStore(
        {
          success: false,
          configured: false,
          error: "Order ledger storage credentials are not configured on the server.",
        },
        503
      );
    }

    const razorpay = getRazorpayClient();
    if (!razorpay) {
      return jsonNoStore(
        {
          success: false,
          configured: false,
          error: "Razorpay API credentials are not configured.",
        },
        503
      );
    }

    // Always generate order reference on the server with cryptographic randomness
    const referenceId = `LGP-${crypto.randomBytes(3).toString("hex").toUpperCase()}-${crypto.randomInt(100, 1000)}`;

    // Catalog prices are strictly in INR; ignore any client-supplied currency
    const orderCurrency = "INR";
    const orderReceipt = referenceId.slice(0, 40);
    const cleanGiftNote = sanitizeText(giftNote, 500, true);

    const itemsSummary = verifiedItems
      .map((item) => `${item.name} (${item.volume}) × ${item.quantity}`)
      .join("; ")
      .slice(0, 240);

    const shippingAddress = [validatedCustomer.address, validatedCustomer.apartment]
      .filter(Boolean)
      .join(", ")
      .slice(0, 240);

    const orderOptions = {
      amount: amountInPaise,
      currency: orderCurrency,
      receipt: orderReceipt,
      partial_payment: false,
      notes: {
        orderReference: referenceId.slice(0, 60),
        itemsSummary,
        customerName: validatedCustomer.fullName.slice(0, 80),
        customerEmail: validatedCustomer.email.slice(0, 80),
        customerPhone: validatedCustomer.phone.slice(0, 20),
        shippingAddress,
        city: validatedCustomer.city.slice(0, 50),
        state: validatedCustomer.state.slice(0, 50),
        pincode: validatedCustomer.pincode.slice(0, 12),
        giftNote: cleanGiftNote.slice(0, 200),
      },
    };

    const razorpayOrder = await razorpay.orders.create(orderOptions);

    const persisted = await savePendingOrderToSanity({
      razorpayOrderId: razorpayOrder.id,
      orderReference: referenceId,
      amountPaise: Number(razorpayOrder.amount) || amountInPaise,
      currency: orderCurrency,
      customer: validatedCustomer,
      items: verifiedItems,
      giftNote: cleanGiftNote,
    });

    if (!persisted) {
      return jsonNoStore(
        {
          success: false,
          error: "Unable to record order in the atelier ledger. Please try again shortly.",
        },
        503
      );
    }

    return jsonNoStore({
      success: true,
      configured: true,
      order_id: razorpayOrder.id,
      razorpayOrderId: razorpayOrder.id,
      amount: Number(razorpayOrder.amount) || amountInPaise,
      totalInr: resolved.totalInr,
      currency: orderCurrency,
      keyId: getRazorpayKeyId(),
      orderReference: referenceId,
      items: verifiedItems,
    });
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    const rzpError = error as RazorpayApiError;

    if (rzpError?.statusCode === 401) {
      return jsonNoStore(
        {
          success: false,
          error: "Payment gateway authentication failed. Please contact concierge.",
        },
        503
      );
    }

    return jsonNoStore(
      {
        success: false,
        error:
          "Unable to initiate payment session right now. Please try again shortly.",
      },
      502
    );
  }
}

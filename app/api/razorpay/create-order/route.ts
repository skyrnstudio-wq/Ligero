import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  getRazorpayClient,
  isRazorpayConfigured,
  resolveVerifiedCartItems,
} from "@/lib/razorpay";
import { isOrderStorageConfigured, savePendingOrderToSanity } from "@/lib/orders";

interface RazorpayApiError {
  statusCode?: number;
  error?: {
    code?: string;
    description?: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, customer, giftNote } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Your case is empty." },
        { status: 400 }
      );
    }

    const resolved = await resolveVerifiedCartItems(items);
    if (!resolved.valid) {
      return NextResponse.json(
        { success: false, error: resolved.error },
        { status: 400 }
      );
    }

    const verifiedItems = resolved.items;
    const amountInPaise = resolved.amountPaise;

    if (!Number.isFinite(amountInPaise) || amountInPaise < 100) {
      return NextResponse.json(
        { success: false, error: "Amount must be at least 100 paise." },
        { status: 400 }
      );
    }

    // Always generate order reference on the server with cryptographic randomness
    const referenceId = `LGP-${crypto.randomBytes(3).toString("hex").toUpperCase()}-${crypto.randomInt(100, 1000)}`;

    if (!isRazorpayConfigured()) {
      return NextResponse.json(
        {
          success: false,
          configured: false,
          error: "Razorpay API credentials are not configured.",
        },
        { status: 401 }
      );
    }

    if (!isOrderStorageConfigured()) {
      return NextResponse.json(
        {
          success: false,
          configured: false,
          error: "Order ledger storage credentials are not configured on the server.",
        },
        { status: 503 }
      );
    }

    const razorpay = getRazorpayClient();
    if (!razorpay) {
      return NextResponse.json(
        {
          success: false,
          configured: false,
          error: "Razorpay API credentials are not configured.",
        },
        { status: 401 }
      );
    }

    // Catalog prices are strictly in INR; ignore any client-supplied currency
    const orderCurrency = "INR";
    const orderReceipt = referenceId.slice(0, 40);

    const itemsSummary = verifiedItems
      .map((item) => `${item.name} (${item.volume}) × ${item.quantity}`)
      .join("; ")
      .slice(0, 240);

    const shippingAddress = [customer?.address, customer?.apartment]
      .filter(Boolean)
      .join(", ")
      .slice(0, 240);

    const orderOptions = {
      amount: amountInPaise,
      currency: orderCurrency,
      receipt: orderReceipt,
      notes: {
        orderReference: String(referenceId).slice(0, 60),
        itemsSummary,
        customerName: String(customer?.fullName || "Guest").slice(0, 80),
        customerEmail: String(customer?.email || "").slice(0, 80),
        customerPhone: String(customer?.phone || "").slice(0, 20),
        shippingAddress,
        city: String(customer?.city || "").slice(0, 50),
        state: String(customer?.state || "").slice(0, 50),
        pincode: String(customer?.pincode || "").slice(0, 12),
        giftNote: String(giftNote || "").slice(0, 200),
      },
    };

    const razorpayOrder = await razorpay.orders.create(orderOptions);

    const persisted = await savePendingOrderToSanity({
      razorpayOrderId: razorpayOrder.id,
      orderReference: referenceId,
      amountPaise: Number(razorpayOrder.amount) || amountInPaise,
      currency: orderCurrency,
      customer,
      items: verifiedItems,
      giftNote,
    });

    if (!persisted) {
      return NextResponse.json(
        {
          success: false,
          error: "Unable to record order in the atelier ledger. Please try again shortly.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      configured: true,
      order_id: razorpayOrder.id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: orderCurrency,
      keyId: process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      orderReference: referenceId,
    });
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    const rzpError = error as RazorpayApiError;
    const errorDescription = rzpError?.error?.description;

    if (rzpError?.statusCode === 401) {
      return NextResponse.json(
        {
          success: false,
          error: errorDescription || "Razorpay authentication failed.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error:
          errorDescription ||
          (error instanceof Error ? error.message : "Failed to create Razorpay order."),
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import {
  getRazorpayClient,
  isRazorpayConfigured,
  resolveVerifiedCartItems,
  type VerifiedOrderItem,
} from "@/lib/razorpay";
import { savePendingOrderToSanity } from "@/lib/orders";

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
    const { items, customer, giftNote, customOrderId, amount, currency, receipt } = body;

    const hasItems = Array.isArray(items) && items.length > 0;
    const hasDirectAmount = amount !== undefined && amount !== null;

    if (!hasItems && !hasDirectAmount) {
      return NextResponse.json(
        { success: false, error: "Your case is empty." },
        { status: 400 }
      );
    }

    let verifiedItems: VerifiedOrderItem[] | undefined;
    let amountInPaise = 0;

    if (hasItems) {
      const resolved = await resolveVerifiedCartItems(items);
      if (!resolved.valid) {
        return NextResponse.json(
          { success: false, error: resolved.error },
          { status: 400 }
        );
      }
      verifiedItems = resolved.items;
      amountInPaise = resolved.amountPaise;
    } else {
      amountInPaise = Math.round(Number(amount));
    }

    if (!Number.isFinite(amountInPaise) || amountInPaise < 100) {
      return NextResponse.json(
        { success: false, error: "Amount must be at least 100 paise." },
        { status: 400 }
      );
    }

    const referenceId =
      customOrderId ||
      `LGP-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

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

    const orderCurrency =
      typeof currency === "string" && currency.trim()
        ? currency.trim().toUpperCase()
        : "INR";
    const orderReceipt = String(receipt || referenceId).slice(0, 40);

    const itemsSummary = verifiedItems
      ? verifiedItems
          .map((item) => `${item.name} (${item.volume}) × ${item.quantity}`)
          .join("; ")
          .slice(0, 240)
      : "Direct Order";

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

    await savePendingOrderToSanity({
      razorpayOrderId: razorpayOrder.id,
      orderReference: referenceId,
      amountPaise: Number(razorpayOrder.amount) || amountInPaise,
      currency: razorpayOrder.currency || orderCurrency,
      customer,
      items: verifiedItems,
      giftNote,
    });

    return NextResponse.json({
      success: true,
      configured: true,
      order_id: razorpayOrder.id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
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

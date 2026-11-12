import { NextRequest, NextResponse } from "next/server";
import {
  getRazorpayClient,
  isRazorpayConfigured,
  calculateVerifiedCartTotal,
} from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, customer, giftNote, customOrderId } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Your case is empty." },
        { status: 400 }
      );
    }

    // Authoritative total calculation from verified catalog
    const verifiedTotal = calculateVerifiedCartTotal(items);

    if (verifiedTotal <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid order amount." },
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
          orderId: referenceId,
          amount: verifiedTotal * 100,
          currency: "INR",
          message:
            "Razorpay API keys not configured. Set NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local",
        },
        { status: 200 }
      );
    }

    const razorpay = getRazorpayClient();
    if (!razorpay) {
      return NextResponse.json(
        { success: false, error: "Failed to initialize Razorpay client." },
        { status: 500 }
      );
    }

    const receipt = referenceId.slice(0, 40);

    const orderOptions = {
      amount: Math.round(verifiedTotal * 100), // paise
      currency: "INR",
      receipt,
      notes: {
        orderReference: referenceId,
        customerName: customer?.fullName?.slice(0, 50) || "Guest",
        customerEmail: customer?.email?.slice(0, 50) || "",
        customerPhone: customer?.phone?.slice(0, 20) || "",
        city: customer?.city?.slice(0, 40) || "",
        pincode: customer?.pincode?.slice(0, 10) || "",
        giftNote: (giftNote || "").slice(0, 200),
      },
    };

    const razorpayOrder = await razorpay.orders.create(orderOptions);

    return NextResponse.json({
      success: true,
      configured: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
      orderReference: referenceId,
    });
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

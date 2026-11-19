import { NextRequest, NextResponse } from "next/server";
import { getOrderFromSanity } from "@/lib/orders";
import { verifyOrderLookupToken } from "@/lib/razorpay";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const orderId = (searchParams.get("orderId") || "").trim();
  const paymentId = (searchParams.get("paymentId") || "").trim();
  const token = (searchParams.get("token") || "").trim();

  if (!orderId || !paymentId) {
    return NextResponse.json(
      { success: false, error: "Provide both orderId and paymentId." },
      { status: 400 }
    );
  }

  if (!token || !verifyOrderLookupToken({ orderId, paymentId, token })) {
    return NextResponse.json(
      { success: false, error: "Unauthorized order lookup request." },
      { status: 401 }
    );
  }

  const order = await getOrderFromSanity({ orderId, paymentId });
  if (
    !order ||
    order.paymentId !== paymentId ||
    (order.orderId !== orderId && order.razorpayOrderId !== orderId)
  ) {
    return NextResponse.json(
      { success: false, error: "Order not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    order,
  });
}

import { NextRequest, NextResponse } from "next/server";
import { getOrderFromSanity } from "@/lib/orders";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const orderId = searchParams.get("orderId");
  const paymentId = searchParams.get("paymentId");

  if (!orderId && !paymentId) {
    return NextResponse.json(
      { success: false, error: "Provide orderId or paymentId." },
      { status: 400 }
    );
  }

  const order = await getOrderFromSanity({ orderId, paymentId });
  if (!order) {
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

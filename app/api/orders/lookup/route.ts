import { NextRequest } from "next/server";
import { getOrderFromSanity } from "@/lib/orders";
import { verifyOrderLookupToken } from "@/lib/razorpay";
import {
  createRateLimiter,
  getClientIp,
  rateLimitHeaders,
  secureJson,
} from "@/lib/security";

export const runtime = "nodejs";

const lookupLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 120,
});

export async function GET(req: NextRequest) {
  const limit = lookupLimiter.check(getClientIp(req));
  if (!limit.allowed) {
    return secureJson(
      { success: false, error: "Too many lookup requests. Try again shortly." },
      429,
      rateLimitHeaders(limit)
    );
  }

  const { searchParams } = req.nextUrl;
  const orderId = (searchParams.get("orderId") || "").trim();
  const paymentId = (searchParams.get("paymentId") || "").trim();
  const token = (searchParams.get("token") || "").trim();

  if (!orderId || !paymentId || orderId.length > 64 || paymentId.length > 64) {
    return secureJson(
      { success: false, error: "Provide both orderId and paymentId." },
      400,
      rateLimitHeaders(limit)
    );
  }

  if (
    !token ||
    token.length > 128 ||
    !verifyOrderLookupToken({ orderId, paymentId, token })
  ) {
    return secureJson(
      { success: false, error: "Unauthorized order lookup request." },
      401,
      rateLimitHeaders(limit)
    );
  }

  const order = await getOrderFromSanity({ orderId, paymentId });
  if (
    !order ||
    order.paymentId !== paymentId ||
    (order.orderId !== orderId && order.razorpayOrderId !== orderId)
  ) {
    return secureJson(
      { success: false, error: "Order not found." },
      404,
      rateLimitHeaders(limit)
    );
  }

  return secureJson(
    {
      success: true,
      order,
    },
    200,
    rateLimitHeaders(limit)
  );
}

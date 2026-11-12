import Razorpay from "razorpay";
import crypto from "crypto";
import { PERFUMES, OBJECTS } from "./products";

export interface CartItemInput {
  slug: string;
  quantity: number;
  price?: number;
}

export function isRazorpayConfigured(): boolean {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  return Boolean(keyId && keySecret);
}

export function getRazorpayClient(): Razorpay | null {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return null;
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

/**
 * Validates cart items against the authoritative product catalog
 * to prevent client-side price tampering.
 */
export function calculateVerifiedCartTotal(items: CartItemInput[]): number {
  if (!Array.isArray(items) || items.length === 0) return 0;

  return items.reduce((total, item) => {
    const qty = Math.max(1, Math.floor(Number(item.quantity) || 1));
    const perfume = PERFUMES.find((p) => p.slug === item.slug);
    if (perfume) {
      return total + perfume.price * qty;
    }
    const object = OBJECTS.find((o) => o.slug === item.slug);
    if (object) {
      return total + object.price * qty;
    }
    // Fallback to provided price if dynamic or not in static list
    const fallbackPrice = typeof item.price === "number" && item.price > 0 ? item.price : 0;
    return total + fallbackPrice * qty;
  }, 0);
}

/**
 * Verifies Razorpay HMAC-SHA256 signature
 */
export function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret || !orderId || !paymentId || !signature) {
    return false;
  }

  try {
    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "utf-8"),
      Buffer.from(signature, "utf-8")
    );
  } catch (error) {
    console.error("Error verifying Razorpay signature:", error);
    return false;
  }
}

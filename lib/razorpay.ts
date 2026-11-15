import Razorpay from "razorpay";
import crypto from "crypto";
import {
  PERFUMES,
  OBJECTS,
  getPerfumeCutoutImage,
  type Product,
  type HouseObject,
} from "./products";
import { getLiveObjects, getLivePerfumes } from "./sanity/data";

export interface CartItemInput {
  slug: string;
  quantity: number;
  price?: number;
}

export interface VerifiedOrderItem {
  slug: string;
  name: string;
  volume: string;
  price: number;
  quantity: number;
  lineTotal: number;
  image?: string;
}

export type CartResolutionResult =
  | {
      valid: true;
      items: VerifiedOrderItem[];
      totalInr: number;
      amountPaise: number;
    }
  | {
      valid: false;
      error: string;
    };

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

function resolveCatalogItems(
  items: CartItemInput[],
  perfumes: Product[],
  objects: HouseObject[]
): CartResolutionResult {
  if (!Array.isArray(items) || items.length === 0) {
    return { valid: false, error: "Your case is empty." };
  }

  const resolvedItems: VerifiedOrderItem[] = [];
  let totalInr = 0;

  for (const item of items) {
    const slug = typeof item.slug === "string" ? item.slug.trim() : "";
    const qty = Math.floor(Number(item.quantity));

    if (!slug) {
      return { valid: false, error: "Order contains an item without a valid identifier." };
    }
    if (!Number.isFinite(qty) || qty < 1 || qty > 50) {
      return {
        valid: false,
        error: `Invalid quantity requested for "${slug}".`,
      };
    }

    const perfume = perfumes.find((p) => p.slug === slug);
    if (perfume && perfume.price > 0) {
      const lineTotal = perfume.price * qty;
      totalInr += lineTotal;
      resolvedItems.push({
        slug: perfume.slug,
        name: perfume.name,
        volume: perfume.volume || "50 ml · Eau de Parfum",
        price: perfume.price,
        quantity: qty,
        lineTotal,
        image: getPerfumeCutoutImage(perfume),
      });
      continue;
    }

    const houseObject = objects.find((o) => o.slug === slug);
    if (houseObject && houseObject.price > 0) {
      const lineTotal = houseObject.price * qty;
      totalInr += lineTotal;
      resolvedItems.push({
        slug: houseObject.slug,
        name: houseObject.name,
        volume: houseObject.volume || "House Object",
        price: houseObject.price,
        quantity: qty,
        lineTotal,
        image: houseObject.image,
      });
      continue;
    }

    return {
      valid: false,
      error: `Product "${slug}" could not be verified against the catalog.`,
    };
  }

  return {
    valid: true,
    items: resolvedItems,
    totalInr,
    amountPaise: Math.round(totalInr * 100),
  };
}

/**
 * Validates cart items against the static catalog without trusting client-supplied prices.
 */
export function calculateVerifiedCartTotal(items: CartItemInput[]): number {
  const result = resolveCatalogItems(items, PERFUMES, OBJECTS);
  return result.valid ? result.totalInr : 0;
}

/**
 * Resolves and validates cart items against the live Sanity catalog (with static fallback),
 * rejecting unknown slugs or invalid quantities rather than falling back to client prices.
 */
export async function resolveVerifiedCartItems(
  items: CartItemInput[]
): Promise<CartResolutionResult> {
  if (!Array.isArray(items) || items.length === 0) {
    return { valid: false, error: "Your case is empty." };
  }
  const [perfumes, objects] = await Promise.all([
    getLivePerfumes(),
    getLiveObjects(),
  ]);
  return resolveCatalogItems(items, perfumes, objects);
}

/**
 * Validates cart items against the live Sanity catalog (with static fallback).
 */
export async function calculateVerifiedCartTotalLive(
  items: CartItemInput[]
): Promise<number> {
  const result = await resolveVerifiedCartItems(items);
  return result.valid ? result.totalInr : 0;
}

function verifyHmacSha256Signature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  if (!secret || !payload || !signature) {
    return false;
  }

  try {
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    const expectedBuf = Buffer.from(expectedSignature, "utf-8");
    const signatureBuf = Buffer.from(signature.trim(), "utf-8");

    if (expectedBuf.length !== signatureBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuf, signatureBuf);
  } catch (error) {
    console.error("Error verifying Razorpay HMAC signature:", error);
    return false;
  }
}

/**
 * Verifies Razorpay Checkout payment HMAC-SHA256 signature (`order_id|payment_id`).
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
  const secret = process.env.RAZORPAY_KEY_SECRET || "";
  if (!orderId || !paymentId) return false;
  return verifyHmacSha256Signature(`${orderId}|${paymentId}`, signature, secret);
}

/**
 * Verifies Razorpay Webhook HMAC-SHA256 signature over the raw request body.
 */
export function verifyRazorpayWebhookSignature({
  rawBody,
  signature,
  secret,
}: {
  rawBody: string;
  signature: string;
  secret?: string;
}): boolean {
  const resolvedSecret =
    secret || process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET || "";
  return verifyHmacSha256Signature(rawBody, signature, resolvedSecret);
}

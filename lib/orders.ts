import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { PERFUMES, OBJECTS, getPerfumeCutoutImage } from "@/lib/products";
import type { VerifiedOrderItem } from "@/lib/razorpay";

export interface OrderCustomerInput {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  apartment?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface PersistedOrderRecord {
  orderId: string;
  paymentId?: string;
  razorpayOrderId?: string;
  date: string;
  customer: Required<OrderCustomerInput>;
  items: Array<{
    slug: string;
    name: string;
    price: number;
    volume: string;
    image: string;
    quantity: number;
  }>;
  subtotal: number;
  giftNote?: string;
  status: string;
  paymentStatus: string;
  fulfilmentStatus: string;
}

function getWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) return null;
  return createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });
}

function getReadClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  return createClient({
    projectId,
    dataset,
    apiVersion,
    token: token || undefined,
    useCdn: false,
  });
}

export function getOrderDocId(razorpayOrderId: string): string {
  return `order-${razorpayOrderId.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

function sanitizeCustomer(customer?: OrderCustomerInput) {
  if (!customer) return undefined;
  return {
    fullName: (customer.fullName || "").trim().slice(0, 120),
    email: (customer.email || "").trim().slice(0, 120),
    phone: (customer.phone || "").trim().slice(0, 20),
    address: (customer.address || "").trim().slice(0, 300),
    apartment: (customer.apartment || "").trim().slice(0, 150),
    city: (customer.city || "").trim().slice(0, 80),
    state: (customer.state || "").trim().slice(0, 80),
    pincode: (customer.pincode || "").trim().slice(0, 12),
  };
}

function sanitizeItems(items?: Array<Partial<VerifiedOrderItem>>) {
  if (!Array.isArray(items) || items.length === 0) return undefined;
  return items.map((item, idx) => {
    const qty = Math.max(1, Math.floor(Number(item.quantity) || 1));
    const unitPrice = Number(item.price) || 0;
    return {
      _key: `${item.slug || "item"}-${idx}`,
      slug: String(item.slug || ""),
      name: String(item.name || item.slug || "Item"),
      volume: String(item.volume || ""),
      quantity: qty,
      price: unitPrice,
      lineTotal: Number(item.lineTotal) || unitPrice * qty,
    };
  });
}

function resolveProductImage(slug: string): string {
  const perfume = PERFUMES.find((p) => p.slug === slug);
  if (perfume) return getPerfumeCutoutImage(perfume);
  const obj = OBJECTS.find((o) => o.slug === slug);
  if (obj) return obj.image;
  return "/images/objects/discovery-set-floating.webp";
}

export async function savePendingOrderToSanity(params: {
  razorpayOrderId: string;
  orderReference: string;
  amountPaise: number;
  currency: string;
  customer?: OrderCustomerInput;
  items?: VerifiedOrderItem[];
  giftNote?: string;
}): Promise<boolean> {
  const client = getWriteClient();
  if (!client || !params.razorpayOrderId) return false;

  const docId = getOrderDocId(params.razorpayOrderId);
  const now = new Date().toISOString();
  const sanitizedCustomer = sanitizeCustomer(params.customer);
  const sanitizedItems = sanitizeItems(params.items);

  try {
    await client.createIfNotExists({
      _id: docId,
      _type: "order",
      orderReference: params.orderReference,
      razorpayOrderId: params.razorpayOrderId,
      paymentStatus: "pending",
      fulfilmentStatus: "processing",
      totalAmount: Math.round(params.amountPaise / 100),
      amountPaise: params.amountPaise,
      currency: params.currency || "INR",
      createdAt: now,
      ...(sanitizedCustomer ? { customer: sanitizedCustomer } : {}),
      ...(sanitizedItems ? { items: sanitizedItems } : {}),
      ...(params.giftNote ? { giftNote: params.giftNote.trim().slice(0, 500) } : {}),
    });
    return true;
  } catch (error) {
    console.error("[Orders] Failed to save pending order to Sanity:", error);
    return false;
  }
}

export async function markOrderPaidInSanity(params: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature?: string;
  orderReference?: string;
  amountPaise?: number;
  currency?: string;
  customer?: OrderCustomerInput;
  items?: Array<Partial<VerifiedOrderItem>>;
  giftNote?: string;
}): Promise<boolean> {
  const client = getWriteClient();
  if (!client || !params.razorpayOrderId || !params.razorpayPaymentId) return false;

  const docId = getOrderDocId(params.razorpayOrderId);
  const now = new Date().toISOString();
  const sanitizedCustomer = sanitizeCustomer(params.customer);
  const sanitizedItems = sanitizeItems(params.items);

  try {
    await client.createIfNotExists({
      _id: docId,
      _type: "order",
      orderReference: params.orderReference || params.razorpayOrderId,
      razorpayOrderId: params.razorpayOrderId,
      paymentStatus: "paid",
      fulfilmentStatus: "processing",
      currency: params.currency || "INR",
      createdAt: now,
    });

    const patchFields: Record<string, unknown> = {
      paymentStatus: "paid",
      razorpayOrderId: params.razorpayOrderId,
      razorpayPaymentId: params.razorpayPaymentId,
      paidAt: now,
    };

    if (params.razorpaySignature) {
      patchFields.razorpaySignature = params.razorpaySignature;
    }
    if (params.amountPaise && params.amountPaise > 0) {
      patchFields.amountPaise = params.amountPaise;
      patchFields.totalAmount = Math.round(params.amountPaise / 100);
    }
    if (params.currency) {
      patchFields.currency = params.currency;
    }

    const setIfMissingFields: Record<string, unknown> = {
      fulfilmentStatus: "processing",
      orderReference: params.orderReference || params.razorpayOrderId,
    };
    if (sanitizedCustomer) {
      setIfMissingFields.customer = sanitizedCustomer;
    }
    if (sanitizedItems) {
      setIfMissingFields.items = sanitizedItems;
    }
    if (params.giftNote) {
      setIfMissingFields.giftNote = params.giftNote.trim().slice(0, 500);
    }

    await client
      .patch(docId)
      .setIfMissing(setIfMissingFields)
      .set(patchFields)
      .commit();

    return true;
  } catch (error) {
    console.error("[Orders] Failed to mark order as paid in Sanity:", error);
    return false;
  }
}

export async function markOrderFailedInSanity(params: {
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  reason?: string;
}): Promise<boolean> {
  const client = getWriteClient();
  if (!client || !params.razorpayOrderId) return false;

  const docId = getOrderDocId(params.razorpayOrderId);

  try {
    const existing = await client.fetch<{ paymentStatus?: string; internalNotes?: string } | null>(
      `*[_type == "order" && _id == $docId][0]{ paymentStatus, internalNotes }`,
      { docId }
    );

    // Never downgrade an order that was already captured/verified as paid.
    if (existing?.paymentStatus === "paid") {
      return true;
    }

    if (!existing) {
      await client.createIfNotExists({
        _id: docId,
        _type: "order",
        orderReference: params.razorpayOrderId,
        razorpayOrderId: params.razorpayOrderId,
        paymentStatus: "failed",
        fulfilmentStatus: "cancelled",
        createdAt: new Date().toISOString(),
        ...(params.razorpayPaymentId ? { razorpayPaymentId: params.razorpayPaymentId } : {}),
        ...(params.reason ? { internalNotes: `Payment failed: ${params.reason}` } : {}),
      });
      return true;
    }

    const patchFields: Record<string, unknown> = {
      paymentStatus: "failed",
    };
    if (params.razorpayPaymentId) {
      patchFields.razorpayPaymentId = params.razorpayPaymentId;
    }
    if (params.reason && !existing.internalNotes) {
      patchFields.internalNotes = `Payment failed: ${params.reason}`;
    }

    await client.patch(docId).set(patchFields).commit();
    return true;
  } catch (error) {
    console.error("[Orders] Failed to mark order as failed in Sanity:", error);
    return false;
  }
}

interface RawSanityOrder {
  orderReference?: string;
  paymentStatus?: string;
  fulfilmentStatus?: string;
  totalAmount?: number;
  amountPaise?: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  paidAt?: string;
  createdAt?: string;
  giftNote?: string;
  customer?: OrderCustomerInput;
  items?: Array<{
    slug?: string;
    name?: string;
    volume?: string;
    quantity?: number;
    price?: number;
  }>;
}

export async function getOrderFromSanity(params: {
  orderId?: string | null;
  paymentId?: string | null;
}): Promise<PersistedOrderRecord | null> {
  const orderId = (params.orderId || "").trim();
  const paymentId = (params.paymentId || "").trim();
  if (!orderId && !paymentId) return null;

  const client = getReadClient();

  try {
    const doc = await client.fetch<RawSanityOrder | null>(
      `*[_type == "order" && (
        ($orderId != "" && (orderReference == $orderId || razorpayOrderId == $orderId)) ||
        ($paymentId != "" && razorpayPaymentId == $paymentId)
      )] | order(createdAt desc)[0]`,
      { orderId, paymentId }
    );

    if (!doc) return null;

    const timestamp = doc.paidAt || doc.createdAt || new Date().toISOString();
    const formattedDate = new Date(timestamp).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const items = (doc.items || []).map((item) => ({
      slug: item.slug || "",
      name: item.name || item.slug || "Item",
      price: Number(item.price) || 0,
      volume: item.volume || "",
      image: resolveProductImage(item.slug || ""),
      quantity: Math.max(1, Number(item.quantity) || 1),
    }));

    const subtotal =
      typeof doc.totalAmount === "number" && doc.totalAmount > 0
        ? doc.totalAmount
        : typeof doc.amountPaise === "number" && doc.amountPaise > 0
          ? Math.round(doc.amountPaise / 100)
          : items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const statusLabel =
      doc.paymentStatus === "paid"
        ? "Verified (Razorpay)"
        : doc.paymentStatus === "failed"
          ? "Payment Failed"
          : "Pending Payment";

    return {
      orderId: doc.orderReference || doc.razorpayOrderId || orderId,
      paymentId: doc.razorpayPaymentId || paymentId || undefined,
      razorpayOrderId: doc.razorpayOrderId,
      date: formattedDate,
      customer: {
        fullName: doc.customer?.fullName || "",
        email: doc.customer?.email || "",
        phone: doc.customer?.phone || "",
        address: doc.customer?.address || "",
        apartment: doc.customer?.apartment || "",
        city: doc.customer?.city || "",
        state: doc.customer?.state || "",
        pincode: doc.customer?.pincode || "",
      },
      items,
      subtotal,
      giftNote: doc.giftNote,
      status: statusLabel,
      paymentStatus: doc.paymentStatus || "pending",
      fulfilmentStatus: doc.fulfilmentStatus || "processing",
    };
  } catch (error) {
    console.error("[Orders] Failed to query order from Sanity:", error);
    return null;
  }
}

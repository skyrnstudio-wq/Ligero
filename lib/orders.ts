import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { PERFUMES, OBJECTS, getPerfumeCutoutImage } from "@/lib/products";
import type { VerifiedOrderItem } from "@/lib/razorpay";
import {
  isEmailConfigured,
  isValidEmailAddress,
  sendOrderAtelierNotificationEmail,
  sendOrderConfirmationEmail,
  sendOrderDispatchEmail,
  type OrderEmailData,
} from "@/lib/email";

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

function getOrdersDataset(): string {
  return process.env.SANITY_ORDERS_DATASET || dataset;
}

export function isOrderStorageConfigured(): boolean {
  return Boolean(process.env.SANITY_API_WRITE_TOKEN);
}

function getWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) return null;
  return createClient({
    projectId,
    dataset: getOrdersDataset(),
    apiVersion,
    token,
    useCdn: false,
    perspective: "raw",
  });
}

function getReadClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) return null;
  return createClient({
    projectId,
    dataset: getOrdersDataset(),
    apiVersion,
    token,
    useCdn: false,
    perspective: "raw",
  });
}

export function getLegacyPublicOrderDocId(razorpayOrderId: string): string {
  return `order-${razorpayOrderId.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

/**
 * Uses a dot-prefixed (`drafts.order-...`) document ID so Sanity Content Lake
 * enforces private access control (blocking unauthenticated public GROQ queries)
 * while remaining natively visible and editable to authenticated team members in `/studio`.
 */
export function getOrderDocId(razorpayOrderId: string): string {
  return `drafts.${getLegacyPublicOrderDocId(razorpayOrderId)}`;
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

export interface StoredPendingOrderSummary {
  _id: string;
  orderReference?: string;
  paymentStatus?: string;
  fulfilmentStatus?: string;
  razorpayPaymentId?: string;
  amountPaise?: number;
  totalAmount?: number;
  currency?: string;
  customer?: OrderCustomerInput;
  items?: Array<{
    slug?: string;
    name?: string;
    volume?: string;
    quantity?: number;
    price?: number;
    lineTotal?: number;
  }>;
  giftNote?: string;
}

export async function getPendingOrderSummaryFromSanity(
  razorpayOrderId: string
): Promise<StoredPendingOrderSummary | null> {
  const client = getReadClient();
  if (!client || !razorpayOrderId) return null;

  const docId = getOrderDocId(razorpayOrderId);
  const legacyDocId = getLegacyPublicOrderDocId(razorpayOrderId);

  try {
    return await client.fetch<StoredPendingOrderSummary | null>(
      `*[_type == "order" && (_id == $docId || _id == $legacyDocId || razorpayOrderId == $razorpayOrderId)] | order(createdAt desc)[0]{
        _id,
        orderReference,
        paymentStatus,
        fulfilmentStatus,
        razorpayPaymentId,
        amountPaise,
        totalAmount,
        currency,
        customer,
        items,
        giftNote
      }`,
      { docId, legacyDocId, razorpayOrderId }
    );
  } catch (error) {
    console.error("[Orders] Failed to fetch pending order summary from Sanity:", error);
    return null;
  }
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
  const legacyDocId = getLegacyPublicOrderDocId(params.razorpayOrderId);
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
      currency: "INR",
      createdAt: now,
      ...(sanitizedCustomer ? { customer: sanitizedCustomer } : {}),
      ...(sanitizedItems ? { items: sanitizedItems } : {}),
      ...(params.giftNote ? { giftNote: params.giftNote.trim().slice(0, 500) } : {}),
    });
    // Ensure no legacy root-path duplicate exists
    await client.delete(legacyDocId).catch(() => undefined);
    return true;
  } catch (error) {
    console.error("[Orders] Failed to save pending order to Sanity:", error);
    return false;
  }
}

export interface MarkOrderPaidResult {
  persisted: boolean;
  alreadyRefunded?: boolean;
  alreadyPaid?: boolean;
  duplicatePayment?: boolean;
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
}): Promise<MarkOrderPaidResult> {
  const client = getWriteClient();
  if (!client || !params.razorpayOrderId || !params.razorpayPaymentId) {
    return { persisted: false };
  }

  const docId = getOrderDocId(params.razorpayOrderId);
  const legacyDocId = getLegacyPublicOrderDocId(params.razorpayOrderId);
  const now = new Date().toISOString();
  const sanitizedCustomer = sanitizeCustomer(params.customer);
  const sanitizedItems = sanitizeItems(params.items);

  try {
    const existingDocs = await client.fetch<
      Array<
        RawSanityOrder & {
          razorpaySignature?: string;
          internalNotes?: string;
        }
      >
    >(
      `*[_type == "order" && (_id == $docId || _id == $legacyDocId)]{
        _id,
        orderReference,
        paymentStatus,
        fulfilmentStatus,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        paidAt,
        createdAt,
        customer,
        items,
        giftNote,
        internalNotes
      }`,
      { docId, legacyDocId }
    );

    const primaryDoc = existingDocs.find((d) => d._id === docId) || null;
    const legacyDoc = existingDocs.find((d) => d._id === legacyDocId) || null;
    const currentDoc = primaryDoc || legacyDoc;

    // Never allow a replayed verify request or late webhook to overwrite a refunded state.
    if (
      currentDoc?.paymentStatus === "refunded" ||
      currentDoc?.paymentStatus === "partially_refunded"
    ) {
      return { persisted: true, alreadyRefunded: true };
    }

    // Idempotent handling when already marked paid.
    if (primaryDoc?.paymentStatus === "paid") {
      if (primaryDoc.razorpayPaymentId === params.razorpayPaymentId) {
        if (params.razorpaySignature && !primaryDoc.razorpaySignature) {
          await client
            .patch(docId)
            .setIfMissing({ razorpaySignature: params.razorpaySignature })
            .commit();
        }
        if (legacyDoc) {
          await client.delete(legacyDocId).catch(() => undefined);
        }
        return { persisted: true, alreadyPaid: true };
      }

      // Rare edge case: a second distinct payment ID was captured for the same Razorpay order.
      if (primaryDoc.razorpayPaymentId) {
        const duplicateNotice = `Duplicate captured payment detected (${params.razorpayPaymentId}); original payment ${primaryDoc.razorpayPaymentId} preserved — review for manual refund.`;
        const existingNotes = primaryDoc.internalNotes || "";
        if (!existingNotes.includes(params.razorpayPaymentId)) {
          await client
            .patch(docId)
            .set({
              internalNotes: existingNotes
                ? `${existingNotes}\n${duplicateNotice}`
                : duplicateNotice,
            })
            .commit();
        }
        console.warn("[Orders] Duplicate payment detected on already-paid order:", {
          razorpayOrderId: params.razorpayOrderId,
          originalPaymentId: primaryDoc.razorpayPaymentId,
          duplicatePaymentId: params.razorpayPaymentId,
        });
        return { persisted: true, alreadyPaid: true, duplicatePayment: true };
      }
    }

    await client.createIfNotExists({
      _id: docId,
      _type: "order",
      orderReference:
        params.orderReference || legacyDoc?.orderReference || params.razorpayOrderId,
      razorpayOrderId: params.razorpayOrderId,
      paymentStatus: "paid",
      fulfilmentStatus:
        legacyDoc?.fulfilmentStatus && legacyDoc.fulfilmentStatus !== "cancelled"
          ? legacyDoc.fulfilmentStatus
          : "processing",
      currency: "INR",
      createdAt: legacyDoc?.createdAt || now,
      paidAt: now,
      ...(legacyDoc?.customer ? { customer: legacyDoc.customer } : {}),
      ...(legacyDoc?.items ? { items: legacyDoc.items } : {}),
      ...(legacyDoc?.giftNote ? { giftNote: legacyDoc.giftNote } : {}),
    });

    const patchFields: Record<string, unknown> = {
      paymentStatus: "paid",
      razorpayOrderId: params.razorpayOrderId,
      razorpayPaymentId: params.razorpayPaymentId,
      currency: "INR",
    };

    // If an earlier failed payment attempt had marked fulfilment cancelled, restore to processing now that payment succeeded.
    if (currentDoc?.fulfilmentStatus === "cancelled") {
      patchFields.fulfilmentStatus = "processing";
    }

    if (params.razorpaySignature) {
      patchFields.razorpaySignature = params.razorpaySignature;
    }
    if (params.amountPaise && params.amountPaise > 0) {
      patchFields.amountPaise = params.amountPaise;
      patchFields.totalAmount = Math.round(params.amountPaise / 100);
    }

    const setIfMissingFields: Record<string, unknown> = {
      fulfilmentStatus: "processing",
      paidAt: now,
      orderReference:
        params.orderReference || legacyDoc?.orderReference || params.razorpayOrderId,
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

    if (legacyDoc) {
      await client.delete(legacyDocId).catch(() => undefined);
    }

    return { persisted: true };
  } catch (error) {
    console.error("[Orders] Failed to mark order as paid in Sanity:", error);
    return { persisted: false };
  }
}

export async function markOrderFailedInSanity(params: {
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  reason?: string;
  allowCreate?: boolean;
}): Promise<boolean> {
  const client = getWriteClient();
  if (!client || !params.razorpayOrderId) return false;

  const docId = getOrderDocId(params.razorpayOrderId);
  const legacyDocId = getLegacyPublicOrderDocId(params.razorpayOrderId);

  try {
    const existing = await client.fetch<{
      _id: string;
      paymentStatus?: string;
      internalNotes?: string;
    } | null>(
      `*[_type == "order" && (_id == $docId || _id == $legacyDocId)][0]{ _id, paymentStatus, internalNotes }`,
      { docId, legacyDocId }
    );

    // Never downgrade an order that was already captured/verified as paid or refunded.
    if (
      existing?.paymentStatus === "paid" ||
      existing?.paymentStatus === "partially_refunded" ||
      existing?.paymentStatus === "refunded"
    ) {
      return true;
    }

    if (!existing) {
      // Avoid creating orphan failed records for unrelated external Razorpay transactions.
      if (!params.allowCreate) {
        return true;
      }
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

    const targetId = existing._id === legacyDocId ? legacyDocId : docId;
    const patchFields: Record<string, unknown> = {
      paymentStatus: "failed",
    };
    if (params.razorpayPaymentId) {
      patchFields.razorpayPaymentId = params.razorpayPaymentId;
    }
    if (params.reason) {
      const failureNote = `Payment failed (${params.razorpayPaymentId || "attempt"}): ${params.reason}`;
      const prevNotes = existing.internalNotes || "";
      if (!prevNotes.includes(failureNote)) {
        patchFields.internalNotes = prevNotes ? `${prevNotes}\n${failureNote}` : failureNote;
      }
    }

    await client.patch(targetId).set(patchFields).commit();
    return true;
  } catch (error) {
    console.error("[Orders] Failed to mark order as failed in Sanity:", error);
    return false;
  }
}

export interface MarkOrderRefundedResult {
  persisted: boolean;
  ignored?: boolean;
  paymentStatus?: "refunded" | "partially_refunded";
}

export async function markOrderRefundedInSanity(params: {
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpayRefundId?: string;
  amountPaise?: number;
  totalRefundedPaise?: number;
  isFullRefund?: boolean;
}): Promise<MarkOrderRefundedResult> {
  const client = getWriteClient();
  if (!client || (!params.razorpayOrderId && !params.razorpayPaymentId)) {
    return { persisted: false };
  }

  const orderId = (params.razorpayOrderId || "").trim();
  const paymentId = (params.razorpayPaymentId || "").trim();
  const refundId = (params.razorpayRefundId || "").trim();
  const docId = orderId ? getOrderDocId(orderId) : "";
  const legacyDocId = orderId ? getLegacyPublicOrderDocId(orderId) : "";

  try {
    const existing = await client.fetch<{
      _id: string;
      paymentStatus?: string;
      fulfilmentStatus?: string;
      amountPaise?: number;
      totalAmount?: number;
      refundedAmountPaise?: number;
      processedRefundIds?: string[];
      internalNotes?: string;
    } | null>(
      `*[_type == "order" && (
        ($docId != "" && (_id == $docId || _id == $legacyDocId || razorpayOrderId == $orderId)) ||
        ($paymentId != "" && razorpayPaymentId == $paymentId)
      )] | order(createdAt desc)[0]{
        _id,
        paymentStatus,
        fulfilmentStatus,
        amountPaise,
        totalAmount,
        refundedAmountPaise,
        processedRefundIds,
        internalNotes
      }`,
      { docId, legacyDocId, orderId, paymentId }
    );

    if (!existing) {
      // Ignore refunds for external/untracked Razorpay payments rather than returning 500
      // (repeated 500s would cause Razorpay to disable the webhook endpoint).
      return { persisted: true, ignored: true };
    }

    const processedIds = Array.isArray(existing.processedRefundIds)
      ? existing.processedRefundIds
      : [];

    if (refundId && processedIds.includes(refundId)) {
      return {
        persisted: true,
        paymentStatus:
          existing.paymentStatus === "partially_refunded"
            ? "partially_refunded"
            : "refunded",
      };
    }

    const orderTotalPaise =
      typeof existing.amountPaise === "number" && existing.amountPaise > 0
        ? existing.amountPaise
        : typeof existing.totalAmount === "number" && existing.totalAmount > 0
          ? Math.round(existing.totalAmount * 100)
          : 0;

    const refundDeltaPaise =
      typeof params.amountPaise === "number" && Number.isFinite(params.amountPaise) && params.amountPaise > 0
        ? Math.round(params.amountPaise)
        : 0;

    const prevRefundedPaise =
      typeof existing.refundedAmountPaise === "number" && existing.refundedAmountPaise > 0
        ? existing.refundedAmountPaise
        : 0;

    const nextRefundedPaise =
      typeof params.totalRefundedPaise === "number" &&
      Number.isFinite(params.totalRefundedPaise) &&
      params.totalRefundedPaise > 0
        ? Math.max(prevRefundedPaise, Math.round(params.totalRefundedPaise))
        : prevRefundedPaise + refundDeltaPaise;

    const isFull =
      existing.paymentStatus === "refunded" ||
      Boolean(params.isFullRefund) ||
      (orderTotalPaise > 0 && nextRefundedPaise >= orderTotalPaise) ||
      (refundDeltaPaise === 0 && !params.totalRefundedPaise);

    const nextPaymentStatus: "refunded" | "partially_refunded" = isFull
      ? "refunded"
      : "partially_refunded";

    const refundSummary = [
      isFull ? "Refund processed" : "Partial refund processed",
      refundId ? `ID: ${refundId}` : "",
      refundDeltaPaise > 0 ? `₹${(refundDeltaPaise / 100).toLocaleString("en-IN")}` : "",
    ]
      .filter(Boolean)
      .join(" · ");

    const nextNotes = existing.internalNotes
      ? existing.internalNotes.includes(refundSummary)
        ? existing.internalNotes
        : `${existing.internalNotes}\n${refundSummary}`
      : refundSummary;

    const patchFields: Record<string, unknown> = {
      paymentStatus: nextPaymentStatus,
      internalNotes: nextNotes,
    };

    if (nextRefundedPaise > 0) {
      patchFields.refundedAmountPaise = nextRefundedPaise;
    }
    if (refundId) {
      patchFields.processedRefundIds = [...processedIds, refundId];
    }
    if (nextPaymentStatus === "refunded" && existing.fulfilmentStatus === "processing") {
      patchFields.fulfilmentStatus = "cancelled";
    }

    await client.patch(existing._id).set(patchFields).commit();

    return { persisted: true, paymentStatus: nextPaymentStatus };
  } catch (error) {
    console.error("[Orders] Failed to mark order as refunded in Sanity:", error);
    return { persisted: false };
  }
}

interface RawSanityOrder {
  _id?: string;
  _rev?: string;
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
  courierName?: string;
  trackingNumber?: string;
  confirmationEmailSentAt?: string;
  dispatchEmailSentAt?: string;
  customer?: OrderCustomerInput;
  items?: Array<{
    slug?: string;
    name?: string;
    volume?: string;
    quantity?: number;
    price?: number;
    lineTotal?: number;
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
  if (!client) return null;

  try {
    const query =
      orderId && paymentId
        ? `*[_type == "order" && (orderReference == $orderId || razorpayOrderId == $orderId) && razorpayPaymentId == $paymentId] | order(createdAt desc)[0]`
        : `*[_type == "order" && (
            ($orderId != "" && (orderReference == $orderId || razorpayOrderId == $orderId)) ||
            ($paymentId != "" && razorpayPaymentId == $paymentId)
          )] | order(createdAt desc)[0]`;

    const doc = await client.fetch<RawSanityOrder | null>(query, { orderId, paymentId });

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
        : doc.paymentStatus === "partially_refunded"
          ? "Partially Refunded"
          : doc.paymentStatus === "refunded"
            ? "Refunded"
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

export interface OrderNotificationResult {
  attempted: boolean;
  sent: boolean;
  skipped?: string;
  emailId?: string;
  error?: string;
}

async function fetchCanonicalOrderForNotification(params: {
  orderDocId?: string;
  razorpayOrderId?: string;
  orderReference?: string;
}): Promise<RawSanityOrder | null> {
  const client = getReadClient();
  if (!client) return null;

  const rawOrderDocId = (params.orderDocId || "").trim();
  const normalizedDraftId = rawOrderDocId
    ? rawOrderDocId.startsWith("drafts.")
      ? rawOrderDocId
      : `drafts.${rawOrderDocId}`
    : "";
  const normalizedPublishedId = rawOrderDocId
    ? rawOrderDocId.replace(/^drafts\./, "")
    : "";
  const razorpayOrderId = (params.razorpayOrderId || "").trim();
  const docId = razorpayOrderId ? getOrderDocId(razorpayOrderId) : "";
  const legacyDocId = razorpayOrderId ? getLegacyPublicOrderDocId(razorpayOrderId) : "";
  const orderReference = (params.orderReference || "").trim();

  if (!rawOrderDocId && !razorpayOrderId && !orderReference) return null;

  return client.fetch<RawSanityOrder | null>(
    `*[_type == "order" && (
      ($rawOrderDocId != "" && (_id == $rawOrderDocId || _id == $normalizedDraftId || _id == $normalizedPublishedId)) ||
      ($razorpayOrderId != "" && (_id == $docId || _id == $legacyDocId || razorpayOrderId == $razorpayOrderId)) ||
      ($orderReference != "" && orderReference == $orderReference)
    )] | order(createdAt desc)[0]{
      _id,
      _rev,
      orderReference,
      razorpayOrderId,
      razorpayPaymentId,
      paymentStatus,
      fulfilmentStatus,
      totalAmount,
      amountPaise,
      customer,
      items,
      giftNote,
      courierName,
      trackingNumber,
      paidAt,
      createdAt,
      confirmationEmailSentAt,
      dispatchEmailSentAt
    }`,
    {
      rawOrderDocId,
      normalizedDraftId,
      normalizedPublishedId,
      razorpayOrderId,
      docId,
      legacyDocId,
      orderReference,
    }
  );
}

function buildOrderEmailData(doc: RawSanityOrder): OrderEmailData {
  const items = (doc.items || []).map((item) => {
    const qty = Math.max(1, Number(item.quantity) || 1);
    const price = Number(item.price) || 0;
    return {
      name: item.name || item.slug || "Item",
      volume: item.volume || "",
      quantity: qty,
      price,
      lineTotal: Number(item.lineTotal) || price * qty,
    };
  });

  const totalInr =
    typeof doc.totalAmount === "number" && doc.totalAmount > 0
      ? doc.totalAmount
      : typeof doc.amountPaise === "number" && doc.amountPaise > 0
        ? Math.round(doc.amountPaise / 100)
        : items.reduce((sum, item) => sum + item.lineTotal, 0);

  const orderReference = doc.orderReference || doc.razorpayOrderId || doc._id || "Order";

  return {
    idempotencyId: doc.razorpayOrderId || doc._id || orderReference,
    orderReference,
    razorpayOrderId: doc.razorpayOrderId,
    razorpayPaymentId: doc.razorpayPaymentId,
    totalInr,
    createdAt: doc.createdAt,
    paidAt: doc.paidAt,
    customer: doc.customer || {},
    items,
    giftNote: doc.giftNote,
    courierName: doc.courierName,
    trackingNumber: doc.trackingNumber,
  };
}

async function claimAndSendOrderEmail(params: {
  lookup: { orderDocId?: string; razorpayOrderId?: string; orderReference?: string };
  claimField: "confirmationEmailSentAt" | "dispatchEmailSentAt";
  canSend: (doc: RawSanityOrder) => string | null;
  send: (data: OrderEmailData) => Promise<{ ok: boolean; id?: string; error?: string }>;
  onSuccess?: (data: OrderEmailData) => Promise<void>;
}): Promise<OrderNotificationResult> {
  if (!isEmailConfigured()) {
    return { attempted: false, sent: false, skipped: "email_not_configured" };
  }

  const writeClient = getWriteClient();
  if (!writeClient) {
    return { attempted: false, sent: false, skipped: "storage_not_configured" };
  }

  try {
    const maxClaimAttempts = 3;
    let claimedDoc: RawSanityOrder | null = null;

    for (let attempt = 0; attempt < maxClaimAttempts; attempt++) {
      const doc = await fetchCanonicalOrderForNotification(params.lookup);
      if (!doc || !doc._id || !doc._rev) {
        return { attempted: false, sent: false, skipped: "order_not_found" };
      }

      const skipReason = params.canSend(doc);
      if (skipReason) {
        return { attempted: false, sent: false, skipped: skipReason };
      }

      if (!isValidEmailAddress(doc.customer?.email)) {
        return { attempted: false, sent: false, skipped: "missing_customer_email" };
      }

      // Optimistic revision lock ensures concurrent verify + webhook requests never send duplicates,
      // while retrying on non-email revision bumps avoids dropping emails during concurrent patches.
      try {
        await writeClient
          .patch(doc._id)
          .ifRevisionId(doc._rev)
          .set({ [params.claimField]: new Date().toISOString() })
          .commit();
        claimedDoc = doc;
        break;
      } catch {
        if (attempt === maxClaimAttempts - 1) {
          return { attempted: false, sent: false, skipped: "already_claimed" };
        }
      }
    }

    if (!claimedDoc || !claimedDoc._id) {
      return { attempted: false, sent: false, skipped: "already_claimed" };
    }

    const emailData = buildOrderEmailData(claimedDoc);
    const result = await params.send(emailData);

    if (!result.ok) {
      await writeClient.patch(claimedDoc._id).unset([params.claimField]).commit().catch(() => undefined);
      console.error(`[Orders] Failed sending ${params.claimField} email:`, result.error);
      return { attempted: true, sent: false, error: result.error };
    }

    if (params.onSuccess) {
      await params.onSuccess(emailData);
    }

    return { attempted: true, sent: true, emailId: result.id };
  } catch (error) {
    console.error(`[Orders] Unexpected error in ${params.claimField}:`, error);
    return {
      attempted: true,
      sent: false,
      error: error instanceof Error ? error.message : "Email notification failed.",
    };
  }
}

export async function sendOrderConfirmationNotifications(
  razorpayOrderId: string
): Promise<OrderNotificationResult> {
  return claimAndSendOrderEmail({
    lookup: { razorpayOrderId },
    claimField: "confirmationEmailSentAt",
    canSend: (doc) => {
      if (doc.paymentStatus !== "paid") return "not_paid";
      if (doc.confirmationEmailSentAt) return "already_sent";
      return null;
    },
    send: sendOrderConfirmationEmail,
    onSuccess: async (emailData) => {
      const atelierResult = await sendOrderAtelierNotificationEmail(emailData);
      if (!atelierResult.ok && !atelierResult.skipped) {
        console.warn("[Orders] Atelier notification email failed:", atelierResult.error);
      }
    },
  });
}

export async function sendOrderDispatchNotification(params: {
  orderDocId?: string;
  razorpayOrderId?: string;
  orderReference?: string;
}): Promise<OrderNotificationResult> {
  return claimAndSendOrderEmail({
    lookup: params,
    claimField: "dispatchEmailSentAt",
    canSend: (doc) => {
      if (doc.paymentStatus !== "paid" && doc.paymentStatus !== "partially_refunded") {
        return "not_paid";
      }
      if (doc.fulfilmentStatus !== "dispatched") return "not_dispatched";
      if (doc.dispatchEmailSentAt) return "already_sent";
      return null;
    },
    send: sendOrderDispatchEmail,
  });
}

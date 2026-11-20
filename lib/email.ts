import { Resend } from "resend";
import { stripHeaderNewlines } from "@/lib/security";

export interface OrderEmailItem {
  name: string;
  volume?: string;
  quantity: number;
  price: number;
  lineTotal: number;
}

export interface OrderEmailCustomer {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  apartment?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface OrderEmailData {
  idempotencyId: string;
  orderReference: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  totalInr: number;
  createdAt?: string;
  paidAt?: string;
  customer: OrderEmailCustomer;
  items: OrderEmailItem[];
  giftNote?: string;
  courierName?: string;
  trackingNumber?: string;
}

export interface EmailSendResult {
  ok: boolean;
  skipped?: boolean;
  id?: string;
  error?: string;
}

const DEFAULT_FROM = "Ligero Parfum <sales@ligeroparfum.com>";
const DEFAULT_SUPPORT_EMAIL = "sales@ligeroparfum.com";
const DEFAULT_SITE_URL = "https://ligeroparfum.com";

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export function isValidEmailAddress(email?: string | null): email is string {
  if (!email) return false;
  const trimmed = email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

function getFromAddress(): string {
  return process.env.RESEND_FROM_EMAIL?.trim() || DEFAULT_FROM;
}

function getAtelierNotificationEmail(): string | null {
  const configured = process.env.ORDER_NOTIFICATION_EMAIL;
  if (configured === undefined) {
    return DEFAULT_SUPPORT_EMAIL;
  }
  const trimmed = configured.trim();
  if (!trimmed || /^(off|none|disabled|false)$/i.test(trimmed)) {
    return null;
  }
  return isValidEmailAddress(trimmed) ? trimmed : null;
}

function getSupportEmail(): string {
  return getAtelierNotificationEmail() || DEFAULT_SUPPORT_EMAIL;
}

function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL).replace(/\/$/, "");
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatInr(amount: number): string {
  const safe = Number.isFinite(amount) ? Math.max(0, Math.round(amount)) : 0;
  return `₹${safe.toLocaleString("en-IN")}`;
}

function formatDateIst(iso?: string): string {
  const parsed = iso ? new Date(iso) : new Date();
  const date = Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

function formatAddressLines(customer: OrderEmailCustomer): string[] {
  const cityStatePin = [
    [customer.city, customer.state].filter(Boolean).join(", "),
    customer.pincode,
  ]
    .filter(Boolean)
    .join(" — ");

  return [
    customer.fullName,
    customer.address,
    customer.apartment,
    cityStatePin,
    customer.phone ? `Phone: +91 ${customer.phone}` : "",
  ]
    .map((line) => (line || "").trim())
    .filter(Boolean);
}

function renderBrandedEmailShell(params: {
  preheader: string;
  eyebrow: string;
  heading: string;
  intro: string;
  bodyHtml: string;
  footerNote: string;
}): string {
  const siteUrl = escapeHtml(getSiteUrl());
  const supportEmail = escapeHtml(DEFAULT_SUPPORT_EMAIL);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(params.heading)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f3ede3;color:#2b2118;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <span style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(params.preheader)}</span>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f3ede3;">
    <tr>
      <td align="center" style="padding:36px 16px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background-color:#fbf8f2;border:1px solid #e0d7c7;">
          <tr>
            <td style="padding:28px 32px 22px;border-bottom:1px solid #e0d7c7;">
              <a href="${siteUrl}" style="text-decoration:none;color:#2b2118;font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:400;letter-spacing:0.04em;">
                Ligero Parfum
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 10px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#a64b24;font-weight:600;">
                ${escapeHtml(params.eyebrow)}
              </p>
              <h1 style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:1.2;font-weight:400;font-style:italic;color:#2b2118;">
                ${escapeHtml(params.heading)}
              </h1>
              <p style="margin:0 0 24px;font-size:14px;line-height:1.65;color:#6f6154;">
                ${escapeHtml(params.intro)}
              </p>
              ${params.bodyHtml}
              <p style="margin:26px 0 0;padding-top:20px;border-top:1px solid #e0d7c7;font-size:12px;line-height:1.65;color:#6f6154;">
                ${escapeHtml(params.footerNote)} For assistance, reply to this email or write to
                <a href="mailto:${supportEmail}" style="color:#a64b24;text-decoration:underline;">${supportEmail}</a>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 32px;background-color:#ece3d3;border-top:1px solid #e0d7c7;font-size:11px;line-height:1.6;color:#6f6154;">
              <strong style="color:#2b2118;font-weight:500;">Ligero Parfum Private Limited</strong> · Mumbai, India ·
              <a href="${siteUrl}" style="color:#6f6154;text-decoration:underline;">${escapeHtml(getSiteUrl().replace(/^https?:\/\//, ""))}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function renderItemsHtml(items: OrderEmailItem[], totalInr: number): string {
  const rows =
    items.length > 0
      ? items
          .map(
            (item) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #ece3d3;font-size:13px;color:#2b2118;">
            <strong style="font-weight:500;">${escapeHtml(item.name)}</strong>
            ${
              item.volume
                ? `<div style="font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#6f6154;margin-top:2px;">${escapeHtml(item.volume)} · Qty ${item.quantity}</div>`
                : `<div style="font-size:11px;color:#6f6154;margin-top:2px;">Qty ${item.quantity}</div>`
            }
          </td>
          <td align="right" style="padding:10px 0;border-bottom:1px solid #ece3d3;font-size:13px;color:#2b2118;white-space:nowrap;vertical-align:top;">
            ${escapeHtml(formatInr(item.lineTotal || item.price * item.quantity))}
          </td>
        </tr>`
          )
          .join("")
      : `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #ece3d3;font-size:13px;color:#2b2118;">
            Ligero Parfum Acquisition
          </td>
          <td align="right" style="padding:10px 0;border-bottom:1px solid #ece3d3;font-size:13px;color:#2b2118;">
            ${escapeHtml(formatInr(totalInr))}
          </td>
        </tr>`;

  return `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:20px 0 0;">
    <tr>
      <td colspan="2" style="padding-bottom:8px;border-bottom:1px solid #e0d7c7;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#6f6154;">
        Acquisition Summary
      </td>
    </tr>
    ${rows}
    <tr>
      <td style="padding:10px 0 4px;font-size:12px;color:#6f6154;">Domestic Shipping</td>
      <td align="right" style="padding:10px 0 4px;font-size:12px;color:#a64b24;font-weight:500;">Complimentary</td>
    </tr>
    <tr>
      <td style="padding:4px 0 12px;font-size:12px;color:#6f6154;border-bottom:1px solid #e0d7c7;">Applicable Taxes</td>
      <td align="right" style="padding:4px 0 12px;font-size:12px;color:#6f6154;border-bottom:1px solid #e0d7c7;">Included in price</td>
    </tr>
    <tr>
      <td style="padding:14px 0 0;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#2b2118;font-weight:600;">Total Paid</td>
      <td align="right" style="padding:14px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:22px;color:#2b2118;">${escapeHtml(formatInr(totalInr))}</td>
    </tr>
  </table>`;
}

function renderAddressHtml(customer: OrderEmailCustomer): string {
  const lines = formatAddressLines(customer);
  if (lines.length === 0) return "";
  return `
  <div style="margin:22px 0 0;padding-top:18px;border-top:1px solid #e0d7c7;">
    <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#6f6154;font-weight:600;">
      Shipping Destination
    </p>
    <p style="margin:0;font-size:13px;line-height:1.65;color:#2b2118;">
      ${lines.map((line) => escapeHtml(line)).join("<br />")}
    </p>
  </div>`;
}

function delayMs(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRetryDelayMs(
  attempt: number,
  headers?: Record<string, string> | null
): number {
  const retryAfterHeader = headers?.["retry-after"] || headers?.["Retry-After"];
  const retryAfterSeconds = retryAfterHeader ? Number(retryAfterHeader) : NaN;
  if (Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0) {
    return Math.min(retryAfterSeconds * 1000, 10_000);
  }
  return Math.min(400 * Math.pow(2, attempt), 3_200);
}

async function sendResendEmail(params: {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  idempotencyKey?: string;
}): Promise<EmailSendResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return {
      ok: false,
      skipped: true,
      error: "RESEND_API_KEY is not configured.",
    };
  }

  const resend = new Resend(apiKey);
  const safeTo = (Array.isArray(params.to) ? params.to : [params.to]).map(
    stripHeaderNewlines
  );
  const payload = {
    from: stripHeaderNewlines(getFromAddress()),
    to: safeTo,
    subject: stripHeaderNewlines(params.subject),
    html: params.html,
    text: params.text,
    ...(params.replyTo ? { replyTo: stripHeaderNewlines(params.replyTo) } : {}),
  };
  const requestOptions = params.idempotencyKey
    ? { idempotencyKey: params.idempotencyKey.slice(0, 256) }
    : undefined;

  const maxAttempts = 3;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const { data, error, headers } = await resend.emails.send(
        payload,
        requestOptions
      );

      if (!error) {
        if (data?.id) {
          console.info("[Email] Sent via Resend:", {
            id: data.id,
            subject: params.subject,
          });
        }
        return { ok: true, id: data?.id };
      }

      const status = error.statusCode ?? null;
      const isRetryable = status === 429 || (status !== null && status >= 500);
      if (!isRetryable || attempt === maxAttempts - 1) {
        return {
          ok: false,
          error: error.message || error.name || "Resend email send failed.",
        };
      }

      await delayMs(getRetryDelayMs(attempt, headers));
    } catch (error) {
      if (attempt === maxAttempts - 1) {
        return {
          ok: false,
          error: error instanceof Error ? error.message : "Failed to call Resend SDK.",
        };
      }
      await delayMs(getRetryDelayMs(attempt));
    }
  }

  return { ok: false, error: "Failed to send email via Resend." };
}

export async function sendOrderConfirmationEmail(
  order: OrderEmailData
): Promise<EmailSendResult> {
  if (!isValidEmailAddress(order.customer.email)) {
    return { ok: false, skipped: true, error: "Customer email address is missing or invalid." };
  }

  const formattedDate = formatDateIst(order.paidAt || order.createdAt);
  const customerName = order.customer.fullName?.trim() || "Guest";
  const addressLines = formatAddressLines(order.customer);

  const metaHtml = `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f3ede3;border:1px solid #e0d7c7;">
    <tr>
      <td style="padding:14px 16px;font-size:12px;line-height:1.6;">
        <div style="margin-bottom:6px;"><span style="color:#6f6154;text-transform:uppercase;font-size:10px;letter-spacing:0.14em;">Reference:</span> <strong style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;color:#2b2118;">${escapeHtml(order.orderReference)}</strong></div>
        ${order.razorpayPaymentId ? `<div style="margin-bottom:6px;"><span style="color:#6f6154;text-transform:uppercase;font-size:10px;letter-spacing:0.14em;">Payment ID:</span> <span style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;color:#2b2118;">${escapeHtml(order.razorpayPaymentId)}</span></div>` : ""}
        <div style="margin-bottom:6px;"><span style="color:#6f6154;text-transform:uppercase;font-size:10px;letter-spacing:0.14em;">Date:</span> <span style="color:#2b2118;">${escapeHtml(formattedDate)}</span></div>
        <div><span style="color:#6f6154;text-transform:uppercase;font-size:10px;letter-spacing:0.14em;">Status:</span> <span style="color:#3b5238;font-weight:600;">Verified (Razorpay)</span></div>
      </td>
    </tr>
  </table>`;

  const giftNoteHtml = order.giftNote?.trim()
    ? `
    <div style="margin:20px 0 0;padding:14px 16px;background-color:#f3ede3;border-left:2px solid #a64b24;">
      <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:#6f6154;font-weight:600;">
        Archival Gift Card Note
      </p>
      <p style="margin:0;font-size:13px;line-height:1.6;font-style:italic;color:#2b2118;">
        “${escapeHtml(order.giftNote.trim())}”
      </p>
    </div>`
    : "";

  const html = renderBrandedEmailShell({
    preheader: `Order ${order.orderReference} confirmed (${formatInr(order.totalInr)}). Dispatched within 2 business days.`,
    eyebrow: "Order Confirmed",
    heading: "Scent, set in motion.",
    intro: `Thank you, ${customerName}. Your payment has been verified and we have begun careful preparation at our Mumbai atelier. Parcels are dispatched within 2 business days, and a separate update will be sent to this email when your parcel ships.`,
    bodyHtml: `${metaHtml}${renderItemsHtml(order.items, order.totalInr)}${giftNoteHtml}${renderAddressHtml(order.customer)}`,
    footerNote: "Keep your order reference for any concierge inquiries.",
  });

  const itemLines =
    order.items.length > 0
      ? order.items.map(
          (i) =>
            `- ${i.name}${i.volume ? ` (${i.volume})` : ""} x ${i.quantity}: ${formatInr(i.lineTotal || i.price * i.quantity)}`
        )
      : [`- Ligero Parfum Acquisition: ${formatInr(order.totalInr)}`];

  const text = [
    `LIGERO PARFUM — ORDER CONFIRMED`,
    ``,
    `Thank you, ${customerName}. Your payment has been verified and preparation has begun at our Mumbai atelier.`,
    ``,
    `Order Reference: ${order.orderReference}`,
    order.razorpayPaymentId ? `Payment ID: ${order.razorpayPaymentId}` : "",
    `Date: ${formattedDate}`,
    `Status: Verified (Razorpay)`,
    ``,
    `Items:`,
    ...itemLines,
    `Domestic Shipping: Complimentary`,
    `Total Paid: ${formatInr(order.totalInr)}`,
    order.giftNote?.trim() ? `\nGift Note: "${order.giftNote.trim()}"` : "",
    addressLines.length > 0 ? `\nShipping Destination:\n${addressLines.join("\n")}` : "",
    ``,
    `Parcels ship within 2 business days. You will receive another email once dispatched.`,
    `Inquiries: ${DEFAULT_SUPPORT_EMAIL}`,
  ]
    .filter(Boolean)
    .join("\n");

  return sendResendEmail({
    to: order.customer.email.trim(),
    subject: `Order Confirmed — ${order.orderReference} | Ligero Parfum`,
    html,
    text,
    replyTo: getSupportEmail(),
    idempotencyKey: `order-confirmation/${order.idempotencyId}`,
  });
}

export async function sendOrderAtelierNotificationEmail(
  order: OrderEmailData
): Promise<EmailSendResult> {
  const adminEmail = getAtelierNotificationEmail();
  if (!adminEmail) {
    return { ok: false, skipped: true, error: "Atelier order notifications are disabled." };
  }

  const studioUrl = `${getSiteUrl()}/studio`;
  const addressLines = formatAddressLines(order.customer);
  const itemLines =
    order.items.length > 0
      ? order.items.map(
          (i) =>
            `<li>${escapeHtml(i.name)}${i.volume ? ` (${escapeHtml(i.volume)})` : ""} × ${i.quantity} — ${escapeHtml(formatInr(i.lineTotal || i.price * i.quantity))}</li>`
        )
      : [`<li>Order total: ${escapeHtml(formatInr(order.totalInr))}</li>`];

  const html = `<!DOCTYPE html>
<html lang="en">
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#2b2118;line-height:1.55;">
  <h2 style="margin:0 0 12px;">New Paid Order: ${escapeHtml(order.orderReference)}</h2>
  <p style="margin:0 0 12px;"><strong>Total:</strong> ${escapeHtml(formatInr(order.totalInr))} · <strong>Payment ID:</strong> ${escapeHtml(order.razorpayPaymentId || "N/A")}</p>
  <p style="margin:0 0 6px;"><strong>Customer:</strong> ${escapeHtml(order.customer.fullName || "Guest")} (${escapeHtml(order.customer.email || "No email")})</p>
  <p style="margin:0 0 14px;"><strong>Shipping:</strong><br />${addressLines.map((l) => escapeHtml(l)).join("<br />")}</p>
  ${order.giftNote?.trim() ? `<p style="margin:0 0 14px;"><strong>Gift Note:</strong> ${escapeHtml(order.giftNote.trim())}</p>` : ""}
  <p style="margin:0 0 6px;"><strong>Items:</strong></p>
  <ul style="margin:0 0 18px;padding-left:18px;">${itemLines.join("")}</ul>
  <p style="margin:0;"><a href="${escapeHtml(studioUrl)}">Open Sanity Studio Orders</a></p>
</body>
</html>`;

  const text = [
    `New Paid Order: ${order.orderReference}`,
    `Total: ${formatInr(order.totalInr)}`,
    `Payment ID: ${order.razorpayPaymentId || "N/A"}`,
    `Customer: ${order.customer.fullName || "Guest"} (${order.customer.email || "No email"})`,
    addressLines.length > 0 ? `Shipping:\n${addressLines.join("\n")}` : "",
    order.giftNote?.trim() ? `Gift Note: ${order.giftNote.trim()}` : "",
    `Studio: ${studioUrl}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  return sendResendEmail({
    to: adminEmail,
    subject: `[New Order] ${order.orderReference} — ${formatInr(order.totalInr)}`,
    html,
    text,
    replyTo: isValidEmailAddress(order.customer.email) ? order.customer.email.trim() : undefined,
    idempotencyKey: `order-atelier-alert/${order.idempotencyId}`,
  });
}

export async function sendOrderDispatchEmail(
  order: OrderEmailData
): Promise<EmailSendResult> {
  if (!isValidEmailAddress(order.customer.email)) {
    return { ok: false, skipped: true, error: "Customer email address is missing or invalid." };
  }

  const customerName = order.customer.fullName?.trim() || "Guest";
  const courier = order.courierName?.trim();
  const tracking = order.trackingNumber?.trim();
  const addressLines = formatAddressLines(order.customer);

  const trackingHtml = `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f3ede3;border:1px solid #e0d7c7;">
    <tr>
      <td style="padding:14px 16px;font-size:12px;line-height:1.65;">
        <div style="margin-bottom:6px;"><span style="color:#6f6154;text-transform:uppercase;font-size:10px;letter-spacing:0.14em;">Order Reference:</span> <strong style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;color:#2b2118;">${escapeHtml(order.orderReference)}</strong></div>
        <div style="margin-bottom:6px;"><span style="color:#6f6154;text-transform:uppercase;font-size:10px;letter-spacing:0.14em;">Status:</span> <span style="color:#a64b24;font-weight:600;">Dispatched / In Transit</span></div>
        ${courier ? `<div style="margin-bottom:6px;"><span style="color:#6f6154;text-transform:uppercase;font-size:10px;letter-spacing:0.14em;">Courier Partner:</span> <span style="color:#2b2118;">${escapeHtml(courier)}</span></div>` : ""}
        ${tracking ? `<div><span style="color:#6f6154;text-transform:uppercase;font-size:10px;letter-spacing:0.14em;">Tracking / AWB:</span> <strong style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;color:#2b2118;">${escapeHtml(tracking)}</strong></div>` : ""}
      </td>
    </tr>
  </table>`;

  const html = renderBrandedEmailShell({
    preheader: `Your Ligero Parfum parcel (${order.orderReference}) has been dispatched.${tracking ? ` Tracking: ${tracking}` : ""}`,
    eyebrow: "Parcel Dispatched",
    heading: "Your parcel is on its way.",
    intro: `Dear ${customerName}, your Ligero Parfum acquisition has left our Mumbai atelier and is now in transit to your address.`,
    bodyHtml: `${trackingHtml}${renderItemsHtml(order.items, order.totalInr)}${renderAddressHtml(order.customer)}`,
    footerNote: "Our courier partner may contact your delivery phone number prior to arrival.",
  });

  const text = [
    `LIGERO PARFUM — PARCEL DISPATCHED`,
    ``,
    `Dear ${customerName}, your Ligero Parfum acquisition has left our Mumbai atelier and is now in transit.`,
    ``,
    `Order Reference: ${order.orderReference}`,
    `Status: Dispatched / In Transit`,
    courier ? `Courier Partner: ${courier}` : "",
    tracking ? `Tracking / AWB: ${tracking}` : "",
    addressLines.length > 0 ? `\nShipping Destination:\n${addressLines.join("\n")}` : "",
    ``,
    `Inquiries: ${DEFAULT_SUPPORT_EMAIL}`,
  ]
    .filter(Boolean)
    .join("\n");

  return sendResendEmail({
    to: order.customer.email.trim(),
    subject: `Dispatched — ${order.orderReference} | Ligero Parfum`,
    html,
    text,
    replyTo: getSupportEmail(),
    idempotencyKey: `order-dispatch/${order.idempotencyId}`,
  });
}

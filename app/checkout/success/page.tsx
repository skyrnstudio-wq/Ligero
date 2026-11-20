"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, Suspense } from "react";
import { CaseItem, useCase } from "@/context/case-context";
import SuccessConfetti from "@/components/success-confetti";
import { sanitizeReferenceParam } from "@/lib/checkout-validation";

interface OrderCustomer {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  pincode: string;
}

interface StoredOrder {
  orderId: string;
  paymentId?: string;
  razorpayOrderId?: string;
  date: string;
  customer: OrderCustomer;
  items: CaseItem[];
  subtotal: number;
  giftNote?: string;
  status?: string;
  paymentStatus?: string;
}

function SuccessContent({
  onReplayConfetti,
  onOrderVerified,
}: {
  onReplayConfetti: () => void;
  onOrderVerified: () => void;
}) {
  const searchParams = useSearchParams();
  const { clearCase } = useCase();
  const orderIdParam = sanitizeReferenceParam(searchParams.get("orderId"));
  const paymentIdParam = sanitizeReferenceParam(searchParams.get("paymentId"));
  const tokenParam = sanitizeReferenceParam(searchParams.get("token"), 128);
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "verified" | "unverified">("loading");

  useEffect(() => {
    let active = true;

    async function loadOrder() {
      try {
        const stored = sessionStorage.getItem("ligero_last_order");
        if (stored) {
          const parsed = JSON.parse(stored) as StoredOrder;
          const matchesRequestedOrder =
            (!orderIdParam ||
              parsed.orderId === orderIdParam ||
              parsed.razorpayOrderId === orderIdParam) &&
            (!paymentIdParam || parsed.paymentId === paymentIdParam);

          if (parsed && parsed.orderId && matchesRequestedOrder) {
            if (active) {
              setOrder(parsed);
              setLoadState("verified");
              clearCase();
              onOrderVerified();
            }
            return;
          }
        }
      } catch {
        // Ignore sessionStorage unavailable
      }

      if (!orderIdParam || !paymentIdParam || !tokenParam) {
        if (active) setLoadState("unverified");
        return;
      }

      try {
        const params = new URLSearchParams({
          orderId: orderIdParam,
          paymentId: paymentIdParam,
          token: tokenParam,
        });

        const res = await fetch(`/api/orders/lookup?${params.toString()}`, {
          cache: "no-store",
        });
        if (!res.ok) {
          if (active) setLoadState("unverified");
          return;
        }
        const data = await res.json();
        if (active && data.success && data.order) {
          setOrder(data.order);
          setLoadState("verified");
          clearCase();
          if (data.order.paymentStatus !== "refunded") {
            onOrderVerified();
          }
          return;
        }
        if (active) setLoadState("unverified");
      } catch {
        if (active) setLoadState("unverified");
      }
    }

    loadOrder();
    return () => {
      active = false;
    };
  }, [orderIdParam, paymentIdParam, tokenParam, clearCase, onOrderVerified]);

  if (loadState === "loading") {
    return (
      <main className="relative z-10 flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#86c99a] bg-[#e2f3e7]">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#14532d] border-t-transparent" />
        </div>
        <p className="mt-5 font-display text-2xl font-light italic text-[#113320]">
          Verifying your order confirmation...
        </p>
      </main>
    );
  }

  if (loadState === "unverified" || !order) {
    return (
      <main className="relative z-10 mx-auto max-w-xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="overflow-hidden border border-[#cfe5d5] bg-[#fcfefb] p-8 text-center shadow-[0_20px_54px_rgba(16,66,38,0.08)] sm:p-10">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#3d5e4b]">
            Order Confirmation
          </p>
          <h1 className="mt-3 font-display text-3xl font-light italic text-[#113320] sm:text-4xl">
            No verified order found for this session.
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#3d5e4b]">
            Open the link from your confirmation email, or contact concierge with your
            Razorpay Payment ID.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/collection"
              className="inline-flex min-h-12 flex-1 items-center justify-center border border-[#14532d] bg-[#14532d] px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[#f4fbf6] transition-colors hover:border-[#166534] hover:bg-[#166534] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14532d]"
            >
              Explore The Collection
            </Link>
            <a
              href="mailto:sales@ligeroparfum.com"
              className="inline-flex min-h-12 items-center justify-center border border-[#a9cfb3] px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-[#14532d] transition-colors hover:border-[#14532d] hover:bg-[#e7f4eb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14532d]"
            >
              Contact Concierge
            </a>
          </div>
        </div>
      </main>
    );
  }

  const displayId = order.orderId;
  const displayPaymentId = order.paymentId || paymentIdParam;
  const displayDate =
    order.date ||
    new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  const isRefunded = order.paymentStatus === "refunded";
  const isPartiallyRefunded = order.paymentStatus === "partially_refunded";

  return (
    <main className="relative z-10 mx-auto max-w-xl px-5 py-12 sm:px-8 sm:py-20">
      <div className="checkout-status-card checkout-status-surface overflow-hidden border border-[#bad7c2] bg-[#fcfefb] shadow-[0_20px_54px_rgba(16,66,38,0.10)]">
        {/* Emerald Hero Band */}
        <div
          className="checkout-status-hero relative overflow-hidden px-6 py-10 text-center sm:px-10 sm:py-12"
          style={{
            background:
              "linear-gradient(145deg, #0f3a24 0%, #165435 52%, #1d6b43 100%)",
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 0%, rgba(134, 239, 172, 0.22) 0%, transparent 62%)",
            }}
          />

          <div className="relative z-10">
            <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
              <span
                aria-hidden="true"
                className="checkout-status-ripple absolute inset-0 rounded-full border-2 border-[#86efac]/70"
              />
              <div className="checkout-status-badge flex h-14 w-14 items-center justify-center rounded-full border border-[#86efac]/60 bg-[#22c55e]/20 text-[#ecfdf3]">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" className="checkout-icon-stroke" />
                </svg>
              </div>
            </div>

            <div className="checkout-status-pill mt-5 inline-flex items-center gap-2 rounded-full border border-[#86efac]/45 bg-[#0b2a1a]/55 px-3.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-[#dcfce7]">
              <span>
                {isRefunded
                  ? "Order Refunded"
                  : isPartiallyRefunded
                    ? "Partially Refunded"
                    : "Payment Confirmed"}
              </span>
            </div>

            <h1 className="mt-4 font-display text-3xl font-light italic tracking-tight text-[#f4fbf6] sm:text-4xl">
              {isRefunded ? "Refund processed." : "Scent, set in motion."}
            </h1>

            <p className="mx-auto mt-2.5 max-w-md text-sm leading-relaxed text-[#d3ebd9]">
              {isRefunded
                ? "A full refund has been recorded and will reflect in 5–7 business days."
                : "Thank you. Your order is confirmed and a receipt has been emailed to you."}
            </p>

            {typeof order.subtotal === "number" && (
              <p className="mt-4 font-display text-2xl font-normal tabular-nums text-[#f4fbf6]">
                ₹{order.subtotal.toLocaleString("en-IN")}
              </p>
            )}
          </div>
        </div>

        {/* Concise Essential Details — zero inner boxes */}
        <div className="px-6 py-7 sm:px-10 sm:py-8">
          <dl className="divide-y divide-[#e3efe6] text-xs">
            <div className="flex items-baseline justify-between gap-4 py-2.5">
              <dt className="uppercase tracking-[0.16em] text-[#3d5e4b]">Order</dt>
              <dd className="font-mono font-semibold text-[#113320]">{displayId}</dd>
            </div>

            {displayPaymentId && (
              <div className="flex items-baseline justify-between gap-4 py-2.5">
                <dt className="uppercase tracking-[0.16em] text-[#3d5e4b]">Payment ID</dt>
                <dd className="break-all font-mono text-[#113320]">{displayPaymentId}</dd>
              </div>
            )}

            <div className="flex items-baseline justify-between gap-4 py-2.5">
              <dt className="uppercase tracking-[0.16em] text-[#3d5e4b]">Date</dt>
              <dd className="text-[#113320]">{displayDate}</dd>
            </div>

            {order.items && order.items.length > 0 && (
              <div className="py-3">
                <dt className="mb-2 uppercase tracking-[0.16em] text-[#3d5e4b]">Items</dt>
                <dd>
                  <ul className="space-y-1.5">
                    {order.items.map((item) => (
                      <li
                        key={item.slug}
                        className="flex items-baseline justify-between gap-4 text-sm text-[#113320]"
                      >
                        <span className="font-display text-base">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="shrink-0 font-body text-xs font-medium tabular-nums">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}

            {order.customer && (
              <div className="py-3">
                <dt className="mb-1 uppercase tracking-[0.16em] text-[#3d5e4b]">
                  Delivering To
                </dt>
                <dd className="leading-relaxed text-[#113320]">
                  <span className="font-medium">{order.customer.fullName}</span>
                  {" · "}
                  {[
                    order.customer.address,
                    order.customer.apartment,
                    order.customer.city,
                    order.customer.state,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                  {order.customer.pincode ? ` — ${order.customer.pincode}` : ""}
                </dd>
              </div>
            )}

            {order.giftNote && order.giftNote.trim() !== "" && (
              <div className="py-3">
                <dt className="mb-1 uppercase tracking-[0.16em] text-[#3d5e4b]">Gift Note</dt>
                <dd className="font-display text-base italic text-[#173d28]">
                  &ldquo;{order.giftNote}&rdquo;
                </dd>
              </div>
            )}
          </dl>

          {/* Actions */}
          <div className="no-print mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/collection"
              className="checkout-status-cta inline-flex min-h-12 flex-1 items-center justify-center border border-[#14532d] bg-[#14532d] px-6 py-3 text-center text-xs font-medium uppercase tracking-[0.2em] text-[#f4fbf6] transition-colors hover:border-[#166534] hover:bg-[#166534] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14532d]"
            >
              Explore The Collection
            </Link>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex min-h-12 items-center justify-center border border-[#a9cfb3] px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-[#14532d] transition-colors hover:border-[#14532d] hover:bg-[#e7f4eb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14532d]"
            >
              Print Receipt
            </button>
          </div>

          <div className="no-print mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#3d5e4b]">
            {!isRefunded && (
              <button
                type="button"
                onClick={onReplayConfetti}
                className="inline-flex min-h-11 items-center text-[11px] font-medium uppercase tracking-[0.16em] text-[#1d633c] transition-colors hover:text-[#113d25] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14532d]"
              >
                Celebrate Again
              </button>
            )}
            <a
              href="mailto:sales@ligeroparfum.com"
              className="inline-flex min-h-11 items-center text-[#3d5e4b] underline underline-offset-4 transition-colors hover:text-[#14532d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14532d]"
            >
              sales@ligeroparfum.com
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  const [confettiKey, setConfettiKey] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const handleReplayConfetti = useCallback(() => setConfettiKey((prev) => prev + 1), []);
  const handleOrderVerified = useCallback(() => setIsVerified(true), []);

  return (
    <div
      className="relative min-h-screen text-[#113320]"
      style={{
        background:
          "radial-gradient(circle at 50% -10%, #d8eedf 0%, #edf5ef 42%, #f4f9f5 100%)",
      }}
    >
      {isVerified && <SuccessConfetti triggerKey={confettiKey} />}

      <header className="no-print relative z-20 border-b border-[#c2dcc9] bg-[#e3f0e7]/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-10">
          <Link
            href="/"
            className="font-display text-2xl font-light tracking-wide text-[#113320] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14532d]"
          >
            Ligero Parfum
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center text-xs uppercase tracking-[0.2em] text-[#2c523c] transition-colors hover:text-[#0f3a24] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14532d]"
          >
            Return Home
          </Link>
        </div>
      </header>

      <Suspense
        fallback={
          <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#86c99a] bg-[#e2f3e7]">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#14532d] border-t-transparent" />
            </div>
            <p className="mt-5 font-display text-2xl font-light italic text-[#113320]">
              Preparing your order confirmation...
            </p>
          </main>
        }
      >
        <SuccessContent
          onReplayConfetti={handleReplayConfetti}
          onOrderVerified={handleOrderVerified}
        />
      </Suspense>
    </div>
  );
}

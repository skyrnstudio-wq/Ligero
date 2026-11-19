"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { CaseItem, useCase } from "@/context/case-context";
import SuccessConfetti from "@/components/success-confetti";

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
}

function SuccessContent({
  onReplayConfetti,
}: {
  onReplayConfetti: () => void;
}) {
  const searchParams = useSearchParams();
  const { clearCase } = useCase();
  const orderIdParam = searchParams.get("orderId");
  const paymentIdParam = searchParams.get("paymentId");
  const tokenParam = searchParams.get("token");
  const [order, setOrder] = useState<StoredOrder | null>(null);

  useEffect(() => {
    let active = true;

    async function loadOrder() {
      try {
        const stored = sessionStorage.getItem("ligero_last_order");
        if (stored) {
          if (active) {
            setOrder(JSON.parse(stored));
            clearCase();
          }
          return;
        }
      } catch {
        // Ignore sessionStorage unavailable
      }

      if (!orderIdParam || !paymentIdParam || !tokenParam) return;

      try {
        const params = new URLSearchParams({
          orderId: orderIdParam,
          paymentId: paymentIdParam,
          token: tokenParam,
        });

        const res = await fetch(`/api/orders/lookup?${params.toString()}`);
        if (!res.ok) return;
        const data = await res.json();
        if (active && data.success && data.order) {
          setOrder(data.order);
          clearCase();
        }
      } catch {
        // Ignore lookup failures
      }
    }

    loadOrder();
    return () => {
      active = false;
    };
  }, [orderIdParam, paymentIdParam, tokenParam, clearCase]);

  const displayId = order?.orderId || orderIdParam || "LGP-2026-9481";
  const displayPaymentId = order?.paymentId || paymentIdParam;
  const displayDate =
    order?.date ||
    new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <main className="relative z-10 mx-auto max-w-3xl px-5 py-10 sm:px-10 sm:py-16 lg:py-20">
      <div className="checkout-status-card checkout-status-surface overflow-hidden border border-[#bad7c2] bg-[#fcfefb] shadow-[0_24px_64px_rgba(16,66,38,0.10)]">
        {/* Rich Botanical Emerald Hero Band */}
        <div
          className="checkout-status-hero relative overflow-hidden px-6 py-10 text-center sm:px-12 sm:py-14"
          style={{
            background:
              "linear-gradient(145deg, #0f3a24 0%, #165435 52%, #1d6b43 100%)",
          }}
        >
          {/* Decorative soft botanical sheen */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 0%, rgba(134, 239, 172, 0.22) 0%, transparent 62%)",
            }}
          />

          <div className="relative z-10">
            {/* Animated Emerald Checkmark Crest */}
            <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
              <span
                aria-hidden="true"
                className="checkout-status-ripple absolute inset-0 rounded-full border-2 border-[#86efac]/70"
              />
              <div className="checkout-status-badge flex h-16 w-16 items-center justify-center rounded-full border border-[#86efac]/60 bg-[#22c55e]/20 text-[#ecfdf3] shadow-[0_0_32px_rgba(74,222,128,0.28)]">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline
                    points="20 6 9 17 4 12"
                    className="checkout-icon-stroke"
                  />
                </svg>
              </div>
            </div>

            {/* Explicit Icon + Text Status Pill (WCAG 1.4.1) */}
            <div className="checkout-status-pill mt-6 inline-flex items-center gap-2 rounded-full border border-[#86efac]/45 bg-[#0b2a1a]/55 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[#dcfce7]">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Payment Confirmed</span>
            </div>

            <h1 className="mt-5 font-display text-4xl font-light italic tracking-tight text-[#f4fbf6] sm:text-5xl">
              Scent, set in motion.
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#d3ebd9]">
              Thank you for your acquisition. Your payment has been verified and
              our atelier has begun preparing your parcel with care.
            </p>

            {typeof order?.subtotal === "number" && (
              <div className="mt-6 inline-flex items-baseline gap-2.5 border border-[#86efac]/35 bg-[#0c2d1c]/45 px-5 py-2 text-[#f4fbf6]">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#b7e4c7]">
                  Amount Paid
                </span>
                <span className="font-display text-2xl font-normal tabular-nums">
                  ₹{order.subtotal.toLocaleString("en-IN")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Confirmation Body */}
        <div className="p-6 sm:p-10">
          {/* Order Details Strip */}
          <div className="grid grid-cols-2 gap-4 border border-[#cfe5d5] bg-[#f2f9f4] p-5 text-xs sm:grid-cols-4">
            <div>
              <span className="block text-[10px] uppercase tracking-[0.18em] text-[#3d5e4b]">
                Order Reference
              </span>
              <span className="mt-1.5 block font-mono text-xs font-semibold text-[#113320]">
                {displayId}
              </span>
            </div>

            <div>
              <span className="block text-[10px] uppercase tracking-[0.18em] text-[#3d5e4b]">
                Order Date
              </span>
              <span className="mt-1.5 block font-medium text-[#113320]">
                {displayDate}
              </span>
            </div>

            <div>
              <span className="block text-[10px] uppercase tracking-[0.18em] text-[#3d5e4b]">
                Payment Status
              </span>
              <span className="mt-1.5 inline-flex items-center gap-1.5 font-semibold text-[#156237]">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="16 9 10.5 15 8 12.5" />
                </svg>
                <span>{order?.status || "Verified (Razorpay)"}</span>
              </span>
              {displayPaymentId && (
                <span className="mt-0.5 block break-all font-mono text-[10px] text-[#3d5e4b]">
                  {displayPaymentId}
                </span>
              )}
            </div>

            <div>
              <span className="block text-[10px] uppercase tracking-[0.18em] text-[#3d5e4b]">
                Domestic Freight
              </span>
              <span className="mt-1.5 block font-semibold text-[#156237]">
                Complimentary
              </span>
            </div>
          </div>

          {/* Atelier Fulfilment Journey */}
          <section aria-labelledby="fulfilment-heading" className="mt-8">
            <h2
              id="fulfilment-heading"
              className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#3d5e4b]"
            >
              Atelier Fulfilment Journey
            </h2>
            <ol className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <li className="border border-[#9fd3ae] bg-[#edf8f0] p-4">
                <div className="flex items-center gap-2 text-[#14532d]">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#15803d] text-[#f4fbf6]">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">
                    1. Verified
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[#2c4a38]">
                  Payment captured securely and recorded in the atelier ledger.
                </p>
              </li>

              <li className="border border-[#d8e8dc] bg-[#f8fcf9] p-4">
                <div className="flex items-center gap-2 text-[#1d452e]">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#88bc98] bg-[#e3f3e8] font-mono text-[11px] font-semibold text-[#14532d]">
                    2
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">
                    2. Atelier Packing
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[#3d5e4b]">
                  Flacons inspected, sealed, and nestled in protective luxury
                  boxing.
                </p>
              </li>

              <li className="border border-[#d8e8dc] bg-[#f8fcf9] p-4">
                <div className="flex items-center gap-2 text-[#1d452e]">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#88bc98] bg-[#e3f3e8] font-mono text-[11px] font-semibold text-[#14532d]">
                    3
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">
                    3. Express Dispatch
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[#3d5e4b]">
                  Dispatched within 2 business days with email tracking updates.
                </p>
              </li>
            </ol>
          </section>

          {/* Items Summary */}
          {order?.items && order.items.length > 0 && (
            <section
              aria-labelledby="acquisition-summary-heading"
              className="mt-8 border-t border-[#d8e8dc] pt-7"
            >
              <h2
                id="acquisition-summary-heading"
                className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#3d5e4b]"
              >
                Acquisition Summary
              </h2>
              <ul className="mt-4 divide-y divide-[#e0ede3]">
                {order.items.map((item) => (
                  <li
                    key={item.slug}
                    className="flex items-center justify-between gap-4 py-3.5 text-sm"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="relative h-14 w-12 flex-shrink-0 border border-[#cfe3d4] bg-[#f3f9f5]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="48px"
                          className="object-contain p-1.5"
                        />
                      </div>
                      <div>
                        <p className="font-display text-lg font-normal text-[#113320]">
                          {item.name}
                        </p>
                        <p className="text-[11px] uppercase tracking-[0.14em] text-[#3d5e4b]">
                          Qty: {item.quantity} · {item.volume}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 font-body text-sm font-medium tabular-nums text-[#113320]">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex items-baseline justify-between border border-[#bad7c2] bg-[#edf7f0] px-5 py-4">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#14532d]">
                  Total Paid
                </span>
                <span className="font-display text-3xl font-normal tabular-nums text-[#113320]">
                  ₹{order.subtotal.toLocaleString("en-IN")}
                </span>
              </div>
            </section>
          )}

          {/* Delivery Address & Gift Note */}
          {order?.customer && (
            <section
              aria-labelledby="shipping-heading"
              className="mt-8 grid grid-cols-1 gap-6 border-t border-[#d8e8dc] pt-7 text-xs leading-relaxed text-[#3d5e4b] sm:grid-cols-2"
            >
              <div>
                <h2
                  id="shipping-heading"
                  className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#14532d]"
                >
                  Shipping Destination
                </h2>
                <p className="mt-2 font-medium text-[#113320]">
                  {order.customer.fullName}
                </p>
                <p>{order.customer.address}</p>
                {order.customer.apartment && <p>{order.customer.apartment}</p>}
                <p>
                  {order.customer.city}, {order.customer.state} —{" "}
                  {order.customer.pincode}
                </p>
                <p className="mt-2.5 text-[11px]">
                  Confirmation and dispatch updates will be sent to{" "}
                  <span className="font-medium text-[#113320]">
                    {order.customer.email}
                  </span>{" "}
                  (courier contact:{" "}
                  <span className="font-medium text-[#113320]">
                    +91 {order.customer.phone}
                  </span>
                  ).
                </p>
              </div>

              {order.giftNote && order.giftNote.trim() !== "" && (
                <div className="border border-[#cfe3d4] bg-[#f4faf6] p-4">
                  <h3 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#14532d]">
                    Handwritten Gift Card
                  </h3>
                  <p className="mt-2 font-display text-base italic text-[#173d28]">
                    &ldquo;{order.giftNote}&rdquo;
                  </p>
                </div>
              )}
            </section>
          )}

          {/* Primary & Utility Actions */}
          <div className="no-print mt-9 border-t border-[#d8e8dc] pt-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/collection"
                className="checkout-status-cta inline-flex min-h-12 flex-1 items-center justify-center border border-[#14532d] bg-[#14532d] px-8 py-3.5 text-center text-xs font-medium uppercase tracking-[0.2em] text-[#f4fbf6] transition-colors hover:border-[#166534] hover:bg-[#166534] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14532d]"
              >
                Explore The Collection
              </Link>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#a9cfb3] bg-[#f4faf6] px-6 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-[#14532d] transition-colors hover:border-[#14532d] hover:bg-[#e7f4eb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14532d]"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
                <span>Print Receipt</span>
              </button>
            </div>

            <div className="mt-5 flex flex-col items-center justify-between gap-2 border-t border-[#e5f0e8] pt-4 sm:flex-row">
              <button
                type="button"
                onClick={onReplayConfetti}
                className="inline-flex min-h-11 items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-[#1d633c] transition-colors hover:text-[#113d25] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14532d]"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3z" />
                  <path d="M5 17l.9 2.1L8 20l-2.1.9L5 23l-.9-2.1L2 20l2.1-.9L5 17z" />
                  <path d="M19 14l.7 1.6L21.3 16l-1.6.7L19 18.3l-.7-1.6L16.7 16l1.6-.7L19 14z" />
                </svg>
                <span>Celebrate Again</span>
              </button>

              <a
                href="mailto:sales@ligeroparfums.com"
                className="inline-flex min-h-11 items-center text-xs uppercase tracking-[0.16em] text-[#3d5e4b] transition-colors hover:text-[#14532d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14532d]"
              >
                Inquiries: sales@ligeroparfums.com →
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  const [confettiKey, setConfettiKey] = useState(0);

  return (
    <div
      className="relative min-h-screen text-[#113320]"
      style={{
        background:
          "radial-gradient(circle at 50% -10%, #d8eedf 0%, #edf5ef 42%, #f4f9f5 100%)",
      }}
    >
      <SuccessConfetti triggerKey={confettiKey} />

      {/* Header */}
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
          <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#86c99a] bg-[#e2f3e7]">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#14532d] border-t-transparent" />
            </div>
            <p className="mt-5 font-display text-2xl font-light italic text-[#113320]">
              Preparing your order confirmation...
            </p>
          </div>
        }
      >
        <SuccessContent
          onReplayConfetti={() => setConfettiKey((prev) => prev + 1)}
        />
      </Suspense>
    </div>
  );
}

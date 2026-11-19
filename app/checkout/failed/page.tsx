"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useCase } from "@/context/case-context";

interface StoredFailure {
  reason?: string;
  code?: string;
  step?: string;
  source?: string;
  cancelled?: boolean;
  orderReference?: string;
  amount?: number;
  itemCount?: number;
  timestamp?: string;
}

function FailedContent() {
  const searchParams = useSearchParams();
  const { items, subtotal, totalCount } = useCase();

  const reasonParam = searchParams.get("reason");
  const codeParam = searchParams.get("code");
  const orderIdParam = searchParams.get("orderId");
  const cancelledParam = searchParams.get("cancelled") === "1";

  const [storedFailure, setStoredFailure] = useState<StoredFailure | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("ligero_last_payment_failure");
      if (raw) {
        setStoredFailure(JSON.parse(raw));
      }
    } catch {
      // Ignore sessionStorage unavailable
    }
  }, []);

  const isCancelled = cancelledParam || Boolean(storedFailure?.cancelled);
  const displayReason =
    storedFailure?.reason ||
    reasonParam ||
    (isCancelled
      ? "You closed the Razorpay checkout window before completing authorization."
      : "Your payment could not be authorized by the bank or payment provider. Please verify your card, UPI, or bank details and try again.");
  const displayOrderId = storedFailure?.orderReference || orderIdParam;
  const displayCode = storedFailure?.code || codeParam;
  const displayAmount =
    subtotal > 0 ? subtotal : storedFailure?.amount;

  return (
    <main className="relative z-10 mx-auto max-w-3xl px-5 py-10 sm:px-10 sm:py-16 lg:py-20">
      <div className="checkout-status-card checkout-status-surface overflow-hidden border border-[#e5bbb5] bg-[#fffcfb] shadow-[0_24px_64px_rgba(115,24,30,0.10)]">
        {/* Rich Venetian Crimson Hero Band */}
        <div
          className="checkout-status-hero relative overflow-hidden px-6 py-10 text-center sm:px-12 sm:py-14"
          style={{
            background:
              "linear-gradient(145deg, #581117 0%, #7d1a21 52%, #991f28 100%)",
          }}
        >
          {/* Decorative soft crimson radial highlight */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 0%, rgba(254, 178, 178, 0.22) 0%, transparent 62%)",
            }}
          />

          <div className="relative z-10">
            {/* Animated Crimson Cross Crest */}
            <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
              <span
                aria-hidden="true"
                className="checkout-status-ripple absolute inset-0 rounded-full border-2 border-[#fca5a5]/70"
              />
              <div className="checkout-status-badge flex h-16 w-16 items-center justify-center rounded-full border border-[#fca5a5]/60 bg-[#ef4444]/20 text-[#fef2f2] shadow-[0_0_32px_rgba(248,113,113,0.28)]">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line
                    x1="18"
                    y1="6"
                    x2="6"
                    y2="18"
                    className="checkout-icon-stroke"
                  />
                  <line
                    x1="6"
                    y1="6"
                    x2="18"
                    y2="18"
                    className="checkout-icon-stroke"
                  />
                </svg>
              </div>
            </div>

            {/* Explicit Icon + Text Status Pill (WCAG 1.4.1) */}
            <div className="checkout-status-pill mt-6 inline-flex items-center gap-2 rounded-full border border-[#fca5a5]/45 bg-[#3c0a0e]/60 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[#fee2e2]">
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
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>
                {isCancelled ? "Payment Cancelled" : "Payment Unsuccessful"}
              </span>
            </div>

            <h1 className="mt-5 font-display text-4xl font-light italic tracking-tight text-[#fff7f6] sm:text-5xl">
              {isCancelled
                ? "Payment was cancelled."
                : "Transaction could not be completed."}
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#f5d5d2]">
              No order has been placed. Your fragrances and checkout details
              remain safely saved so you can return and complete your purchase
              whenever you are ready.
            </p>

            {typeof displayAmount === "number" && displayAmount > 0 && (
              <div className="mt-6 inline-flex items-baseline gap-2.5 border border-[#fca5a5]/35 bg-[#3f0b10]/45 px-5 py-2 text-[#fff7f6]">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#f5c2be]">
                  Pending Case Total
                </span>
                <span className="font-display text-2xl font-normal tabular-nums">
                  ₹{displayAmount.toLocaleString("en-IN")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Failure Details Body */}
        <div className="p-6 sm:p-10">
          {/* Primary Failure Reason Callout */}
          <div
            role="alert"
            className="checkout-status-callout border border-[#edb8b2] border-l-4 border-l-[#b91c1c] bg-[#fef2f2] p-5"
          >
            <div className="flex items-start gap-3.5">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-[#991b1b]"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>

              <div className="min-w-0 flex-1">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7f1d1d]">
                  What Happened
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-[#5c1518]">
                  {displayReason}
                </p>

                {(displayOrderId || displayCode) && (
                  <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 border-t border-[#f0c7c2] pt-3 text-[11px] text-[#7a3033]">
                    {displayOrderId && (
                      <span>
                        Reference:{" "}
                        <span className="font-mono font-semibold text-[#581117]">
                          {displayOrderId}
                        </span>
                      </span>
                    )}
                    {displayCode && (
                      <span>
                        Code:{" "}
                        <span className="font-mono font-semibold text-[#581117]">
                          {displayCode}
                        </span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Primary Back to Checkout CTA Band (above the fold on mobile & desktop) */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/checkout"
              className="checkout-status-cta inline-flex min-h-12 flex-1 items-center justify-center gap-2 border border-[#991b22] bg-[#991b22] px-8 py-3.5 text-center text-xs font-medium uppercase tracking-[0.2em] text-[#fff8f7] transition-colors hover:border-[#7f151b] hover:bg-[#7f151b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#991b22]"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span>Go Back to Checkout</span>
            </Link>

            <Link
              href="/collection"
              className="inline-flex min-h-12 items-center justify-center border border-[#dfb5ae] bg-[#fff5f4] px-6 py-3.5 text-center text-xs font-medium uppercase tracking-[0.18em] text-[#6e171c] transition-colors hover:border-[#991b22] hover:bg-[#fde9e7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#991b22]"
            >
              Continue Exploring
            </Link>
          </div>

          {/* Reassurance & Recovery Cards */}
          <section aria-labelledby="reassurance-heading" className="mt-8">
            <h2
              id="reassurance-heading"
              className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#7a3b3e]"
            >
              Good to Know Before Retrying
            </h2>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <li className="border border-[#edd0cb] bg-[#fdf7f6] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7f1d1d]">
                  Case Preserved
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-[#6b3a3c]">
                  Your selected fragrances and delivery details are still saved
                  at checkout.
                </p>
              </li>

              <li className="border border-[#edd0cb] bg-[#fdf7f6] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7f1d1d]">
                  Auto-Refund Guarantee
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-[#6b3a3c]">
                  If your account was debited, banks automatically reverse
                  failed attempts in 5–7 business days.
                </p>
              </li>

              <li className="border border-[#edd0cb] bg-[#fdf7f6] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7f1d1d]">
                  Switch Payment Method
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-[#6b3a3c]">
                  Try another UPI app, card, or NetBanking directly inside the
                  Razorpay window.
                </p>
              </li>
            </ul>
          </section>

          {/* Saved Case Preview */}
          {items.length > 0 && (
            <section
              aria-labelledby="saved-case-heading"
              className="mt-8 border-t border-[#ecd1cc] pt-7"
            >
              <div className="flex items-baseline justify-between">
                <h2
                  id="saved-case-heading"
                  className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#7a3b3e]"
                >
                  Waiting In Your Case
                </h2>
                <span className="text-[11px] uppercase tracking-[0.16em] text-[#7a3b3e] tabular-nums">
                  {totalCount} {totalCount === 1 ? "Item" : "Items"}
                </span>
              </div>

              <ul className="mt-4 divide-y divide-[#f2ddda]">
                {items.map((item) => (
                  <li
                    key={item.slug}
                    className="flex items-center justify-between gap-4 py-3 text-sm"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="relative h-14 w-12 flex-shrink-0 border border-[#ebd0cb] bg-[#fdf5f4]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="48px"
                          className="object-contain p-1.5"
                        />
                      </div>
                      <div>
                        <p className="font-display text-lg font-normal text-[#4c1116]">
                          {item.name}
                        </p>
                        <p className="text-[11px] uppercase tracking-[0.14em] text-[#7a3b3e]">
                          Qty: {item.quantity} · {item.volume}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 font-body text-sm font-medium tabular-nums text-[#4c1116]">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex items-baseline justify-between border border-[#e7c1bb] bg-[#fdf2f0] px-5 py-4">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7f1d1d]">
                  Case Total
                </span>
                <span className="font-display text-3xl font-normal tabular-nums text-[#4c1116]">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>
            </section>
          )}

          {/* Concierge Footer */}
          <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-[#ecd1cc] pt-6 text-center sm:flex-row sm:text-left">
            <p className="text-xs text-[#6b3a3c]">
              Still facing trouble completing your order? Our atelier concierge
              can assist right away.
            </p>
            <a
              href="mailto:sales@ligeroparfums.com"
              className="inline-flex min-h-11 shrink-0 items-center text-xs font-medium uppercase tracking-[0.16em] text-[#8b1a20] transition-colors hover:text-[#581117] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#991b22]"
            >
              sales@ligeroparfums.com →
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function PaymentFailedPage() {
  return (
    <div
      className="relative min-h-screen text-[#4c1116]"
      style={{
        background:
          "radial-gradient(circle at 50% -10%, #f7d9d6 0%, #fbf0ee 42%, #fdf7f6 100%)",
      }}
    >
      {/* Header */}
      <header className="relative z-20 border-b border-[#e6c2bc] bg-[#f6e4e1]/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-10">
          <Link
            href="/"
            className="font-display text-2xl font-light tracking-wide text-[#4c1116] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#991b22]"
          >
            Ligero Parfum
          </Link>
          <Link
            href="/checkout"
            className="inline-flex min-h-11 items-center text-xs font-medium uppercase tracking-[0.18em] text-[#7f1d1d] transition-colors hover:text-[#4c1116] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#991b22]"
          >
            ← Back to Checkout
          </Link>
        </div>
      </header>

      <Suspense
        fallback={
          <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#e7b4ae] bg-[#fce8e6]">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#991b22] border-t-transparent" />
            </div>
            <p className="mt-5 font-display text-2xl font-light italic text-[#4c1116]">
              Loading transaction details...
            </p>
          </div>
        }
      >
        <FailedContent />
      </Suspense>
    </div>
  );
}

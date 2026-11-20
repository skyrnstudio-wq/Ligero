"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useCase } from "@/context/case-context";
import { sanitizeReferenceParam } from "@/lib/checkout-validation";

interface StoredFailure {
  reason?: string;
  code?: string;
  cancelled?: boolean;
  verificationPending?: boolean;
  orderReference?: string;
  paymentId?: string;
  amount?: number;
}

function FailedContent() {
  const searchParams = useSearchParams();
  const { subtotal } = useCase();

  // Sanitize URL reference params and ignore any reflected ?reason= query string (anti-spoofing).
  const codeParam = sanitizeReferenceParam(searchParams.get("code"));
  const orderIdParam = sanitizeReferenceParam(searchParams.get("orderId"));
  const paymentIdParam = sanitizeReferenceParam(searchParams.get("paymentId"));
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

  const displayOrderId = sanitizeReferenceParam(storedFailure?.orderReference) || orderIdParam;
  const displayPaymentId = sanitizeReferenceParam(storedFailure?.paymentId) || paymentIdParam;
  const displayCode = sanitizeReferenceParam(storedFailure?.code) || codeParam;
  const isVerificationPending =
    displayCode === "VERIFICATION_PENDING" || Boolean(storedFailure?.verificationPending);
  const isCancelled = !isVerificationPending && (cancelledParam || Boolean(storedFailure?.cancelled));

  const displayMessage = isVerificationPending
    ? "Do not double-pay — Razorpay received your payment and our server will finish confirming your order and email your receipt shortly."
    : isCancelled
      ? "No order was placed. Your case and checkout details remain saved."
      : storedFailure?.reason ||
        "Your payment could not be authorized. Your case remains saved so you can retry whenever you are ready.";

  const displayAmount = subtotal > 0 ? subtotal : storedFailure?.amount;

  const conciergeMailto = (() => {
    const subject = encodeURIComponent(
      `Payment Assistance${displayOrderId ? ` — ${displayOrderId}` : ""}`
    );
    const body = encodeURIComponent(
      [
        "Hello Ligero Parfum Concierge,",
        "",
        displayOrderId ? `Order Reference: ${displayOrderId}` : "",
        displayPaymentId ? `Razorpay Payment ID: ${displayPaymentId}` : "",
        displayCode ? `Status Code: ${displayCode}` : "",
        "",
        "Please help verify the status of my order.",
      ]
        .filter(Boolean)
        .join("\n")
    );
    return `mailto:sales@ligeroparfum.com?subject=${subject}&body=${body}`;
  })();

  return (
    <main className="relative z-10 mx-auto max-w-xl px-5 py-12 sm:px-8 sm:py-20">
      <div className="checkout-status-card checkout-status-surface overflow-hidden border border-[#e5bbb5] bg-[#fffcfb] shadow-[0_20px_54px_rgba(115,24,30,0.10)]">
        {/* Crimson (or Amber when pending) Hero Band */}
        <div
          className="checkout-status-hero relative overflow-hidden px-6 py-10 text-center sm:px-10 sm:py-12"
          style={{
            background: isVerificationPending
              ? "linear-gradient(145deg, #4b3112 0%, #6f4719 52%, #8a5a20 100%)"
              : "linear-gradient(145deg, #581117 0%, #7d1a21 52%, #991f28 100%)",
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: isVerificationPending
                ? "radial-gradient(circle at 50% 0%, rgba(253, 230, 138, 0.22) 0%, transparent 62%)"
                : "radial-gradient(circle at 50% 0%, rgba(254, 178, 178, 0.22) 0%, transparent 62%)",
            }}
          />

          <div className="relative z-10">
            <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
              <span
                aria-hidden="true"
                className={`checkout-status-ripple absolute inset-0 rounded-full border-2 ${
                  isVerificationPending ? "border-[#fcd34d]/70" : "border-[#fca5a5]/70"
                }`}
              />
              <div
                className={`checkout-status-badge flex h-14 w-14 items-center justify-center rounded-full border ${
                  isVerificationPending
                    ? "border-[#fcd34d]/60 bg-[#f59e0b]/20 text-[#fffbeb]"
                    : "border-[#fca5a5]/60 bg-[#ef4444]/20 text-[#fef2f2]"
                }`}
              >
                {isVerificationPending ? (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                ) : (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" className="checkout-icon-stroke" />
                    <line x1="6" y1="6" x2="18" y2="18" className="checkout-icon-stroke" />
                  </svg>
                )}
              </div>
            </div>

            <div className="checkout-status-pill mt-5 inline-flex items-center gap-2 rounded-full border border-[#fca5a5]/45 bg-[#3c0a0e]/55 px-3.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-[#fee2e2]">
              <span>
                {isVerificationPending
                  ? "Verification In Progress"
                  : isCancelled
                    ? "Payment Cancelled"
                    : "Payment Unsuccessful"}
              </span>
            </div>

            <h1 className="mt-4 font-display text-3xl font-light italic tracking-tight text-[#fff7f6] sm:text-4xl">
              {isVerificationPending
                ? "Payment received — confirming."
                : isCancelled
                  ? "Payment was cancelled."
                  : "Payment could not be completed."}
            </h1>

            <p
              role={isCancelled ? undefined : "alert"}
              className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#f5d5d2]"
            >
              {displayMessage}
            </p>

            {typeof displayAmount === "number" && displayAmount > 0 && (
              <p className="mt-4 font-display text-2xl font-normal tabular-nums text-[#fff7f6]">
                ₹{displayAmount.toLocaleString("en-IN")}
              </p>
            )}
          </div>
        </div>

        {/* Minimal White Footer Band — no inner boxes */}
        <div className="px-6 py-7 sm:px-10 sm:py-8">
          {(displayOrderId || displayPaymentId) && (
            <div className="mb-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-center text-xs text-[#7a3033]">
              {displayOrderId && (
                <span>
                  Reference:{" "}
                  <span className="font-mono font-semibold text-[#581117]">
                    {displayOrderId}
                  </span>
                </span>
              )}
              {displayPaymentId && (
                <span>
                  Payment ID:{" "}
                  <span className="font-mono font-semibold text-[#581117]">
                    {displayPaymentId}
                  </span>
                </span>
              )}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            {isVerificationPending ? (
              <>
                <a
                  href={conciergeMailto}
                  className="checkout-status-cta inline-flex min-h-12 flex-1 items-center justify-center border border-[#6f4719] bg-[#6f4719] px-6 py-3 text-center text-xs font-medium uppercase tracking-[0.2em] text-[#fffbeb] transition-colors hover:border-[#553511] hover:bg-[#553511] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f4719]"
                >
                  Email Concierge
                </a>
                <Link
                  href="/collection"
                  className="inline-flex min-h-12 items-center justify-center border border-[#dfb5ae] px-6 py-3 text-center text-xs font-medium uppercase tracking-[0.18em] text-[#6e171c] transition-colors hover:border-[#991b22] hover:bg-[#fde9e7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#991b22]"
                >
                  Continue Exploring
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/checkout"
                  className="checkout-status-cta inline-flex min-h-12 flex-1 items-center justify-center gap-2 border border-[#991b22] bg-[#991b22] px-6 py-3 text-center text-xs font-medium uppercase tracking-[0.2em] text-[#fff8f7] transition-colors hover:border-[#7f151b] hover:bg-[#7f151b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#991b22]"
                >
                  <span>← Go Back to Checkout</span>
                </Link>
                <Link
                  href="/collection"
                  className="inline-flex min-h-12 items-center justify-center border border-[#dfb5ae] px-6 py-3 text-center text-xs font-medium uppercase tracking-[0.18em] text-[#6e171c] transition-colors hover:border-[#991b22] hover:bg-[#fde9e7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#991b22]"
                >
                  Continue Exploring
                </Link>
              </>
            )}
          </div>

          <p className="mt-5 text-center text-xs text-[#7a3b3e]">
            Need help?{" "}
            <a
              href={conciergeMailto}
              className="font-medium text-[#8b1a20] underline underline-offset-4 transition-colors hover:text-[#581117] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#991b22]"
            >
              sales@ligeroparfum.com
            </a>
          </p>
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
          <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#e7b4ae] bg-[#fce8e6]">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#991b22] border-t-transparent" />
            </div>
            <p className="mt-5 font-display text-2xl font-light italic text-[#4c1116]">
              Loading transaction details...
            </p>
          </main>
        }
      >
        <FailedContent />
      </Suspense>
    </div>
  );
}

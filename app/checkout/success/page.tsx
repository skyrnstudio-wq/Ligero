"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { CaseItem } from "@/context/case-context";

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
  status?: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get("orderId");
  const paymentIdParam = searchParams.get("paymentId");
  const [order, setOrder] = useState<StoredOrder | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("ligero_last_order");
      if (stored) {
        setOrder(JSON.parse(stored));
      }
    } catch {
      // Ignore
    }
  }, []);

  const displayId = order?.orderId || orderIdParam || "LGP-2026-9481";
  const displayPaymentId = order?.paymentId || paymentIdParam;

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 sm:px-10 sm:py-24">
      <div className="border border-aube-hairline bg-aube-surface p-8 sm:p-12 shadow-[0_4px_32px_rgba(43,33,24,0.04)]">
        {/* Badge & Confirmation Title */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-aube-accent/30 bg-aube-accent/10 text-aube-accent">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1 className="mt-6 font-display text-4xl font-light italic text-aube-text sm:text-5xl">
            Scent, set in motion.
          </h1>

          <p className="mt-3 text-sm text-aube-text-muted">
            Thank you for your acquisition. We have received your order and begun careful preparation at the atelier.
          </p>
        </div>

        {/* Order Details Header */}
        <div className="mt-10 grid grid-cols-2 gap-4 border-y border-aube-hairline/80 py-5 text-xs sm:grid-cols-4">
          <div>
            <span className="block text-[10px] uppercase tracking-[0.18em] text-aube-text-muted">
              Reference
            </span>
            <span className="mt-1 block font-mono text-xs font-semibold text-aube-text">
              {displayId}
            </span>
          </div>

          <div>
            <span className="block text-[10px] uppercase tracking-[0.18em] text-aube-text-muted">
              Dispatch Date
            </span>
            <span className="mt-1 block font-medium text-aube-text">
              Within 2 Days
            </span>
          </div>

          <div>
            <span className="block text-[10px] uppercase tracking-[0.18em] text-aube-text-muted">
              Payment Status
            </span>
            <span className="mt-1 block font-medium text-aube-success">
              {order?.status || "Verified (Razorpay)"}
            </span>
            {displayPaymentId && (
              <span className="mt-0.5 block font-mono text-[10px] text-aube-text-muted">
                {displayPaymentId}
              </span>
            )}
          </div>

          <div>
            <span className="block text-[10px] uppercase tracking-[0.18em] text-aube-text-muted">
              Domestic Freight
            </span>
            <span className="mt-1 block font-medium text-aube-accent">
              Complimentary
            </span>
          </div>
        </div>

        {/* Items Summary */}
        {order?.items && order.items.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xs uppercase tracking-[0.2em] text-aube-text-muted">
              Acquisition Summary
            </h2>
            <ul className="mt-4 divide-y divide-aube-hairline/50">
              {order.items.map((item) => (
                <li key={item.slug} className="flex items-center justify-between py-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-10 flex-shrink-0 border border-aube-hairline bg-aube-base/50">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="40px"
                        className="object-contain p-1"
                      />
                    </div>
                    <div>
                      <p className="font-display text-base font-light text-aube-text">
                        {item.name}
                      </p>
                      <p className="text-[10px] uppercase tracking-[0.14em] text-aube-text-muted">
                        Qty: {item.quantity} · {item.volume}
                      </p>
                    </div>
                  </div>
                  <span className="font-body text-xs text-aube-text">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-baseline justify-between border-t border-aube-hairline pt-4 text-sm font-medium">
              <span className="text-xs uppercase tracking-[0.18em] text-aube-text-muted">Total Paid</span>
              <span className="font-display text-2xl font-light text-aube-text">
                ₹{order.subtotal.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        )}

        {/* Delivery Address */}
        {order?.customer && (
          <div className="mt-8 border-t border-aube-hairline/80 pt-6 text-xs leading-relaxed text-aube-text-muted">
            <h3 className="text-[10px] uppercase tracking-[0.18em] font-semibold text-aube-text">
              Shipping Destination
            </h3>
            <p className="mt-2 text-aube-text font-medium">{order.customer.fullName}</p>
            <p>{order.customer.address}</p>
            {order.customer.apartment && <p>{order.customer.apartment}</p>}
            <p>
              {order.customer.city}, {order.customer.state} — {order.customer.pincode}
            </p>
            <p className="mt-2 text-[11px] text-aube-text-muted">
              Updates will be sent to <span className="text-aube-text">{order.customer.email}</span> and{" "}
              <span className="text-aube-text">+91 {order.customer.phone}</span>.
            </p>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-aube-hairline/80 pt-8">
          <Link
            href="/collection"
            className="border border-aube-text bg-aube-text px-8 py-3.5 text-center text-xs uppercase tracking-[0.22em] text-aube-base transition-all hover:border-aube-accent hover:bg-aube-accent"
          >
            Explore The Collection
          </Link>

          <a
            href="mailto:sales@ligeroparfum.com"
            className="text-center text-xs uppercase tracking-[0.2em] text-aube-text-muted hover:text-aube-accent"
          >
            Inquiries: sales@ligeroparfum.com →
          </a>
        </div>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-aube-base text-aube-text">
      {/* Header */}
      <header className="border-b border-aube-hairline bg-nav-silk/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-10">
          <Link href="/" className="font-display text-2xl font-light tracking-wide text-aube-text">
            Ligero Parfum
          </Link>
          <Link
            href="/"
            className="text-xs uppercase tracking-[0.2em] text-aube-text-muted hover:text-aube-accent"
          >
            Return Home
          </Link>
        </div>
      </header>

      <Suspense fallback={<div className="py-24 text-center text-sm text-aube-text-muted">Loading order confirmation...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}

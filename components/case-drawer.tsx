"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCase } from "@/context/case-context";

export default function CaseDrawer() {
  const { items, removeFromCase, updateQuantity, totalCount, subtotal, isCaseOpen, setIsCaseOpen } = useCase();
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Close on Escape & body scroll lock
  useEffect(() => {
    if (!isCaseOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsCaseOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    closeBtnRef.current?.focus();

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCaseOpen, setIsCaseOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-visibility duration-300 ${
        isCaseOpen ? "visible pointer-events-auto" : "invisible pointer-events-none delay-300"
      }`}
      aria-hidden={!isCaseOpen}
    >
      {/* Backdrop overlay */}
      <div
        onClick={() => setIsCaseOpen(false)}
        className={`absolute inset-0 bg-[#100b0a]/50 backdrop-blur-[3px] transition-opacity duration-300 ${
          isCaseOpen ? "opacity-100" : "opacity-0"
        }`}
        aria-label="Close Case overlay"
      />

      {/* Slide-over sheet */}
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Your Case"
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col justify-between overflow-y-auto border-l border-[#100b0a]/15 bg-[#f7f3ee] px-6 py-6 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-10 sm:py-8 ${
          isCaseOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#100b0a]/10 pb-5">
          <div className="flex items-baseline gap-3">
            <span
              className="text-2xl sm:text-3xl font-normal text-[#100b0a]"
              style={{ fontFamily: "var(--font-cormorant), 'Adamina', Georgia, serif" }}
            >
              Your Case
            </span>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#5a240a]">
              ({totalCount} {totalCount === 1 ? "object" : "objects"})
            </span>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={() => setIsCaseOpen(false)}
            aria-label="Close Case drawer"
            className="group flex items-center gap-2 text-[#100b0a] transition-colors hover:text-[#5a240a] cursor-pointer"
          >
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#3b3530] group-hover:text-[#5a240a]">
              Close
            </span>
            <span className="flex h-8 w-8 items-center justify-center border border-[#100b0a]/15 transition-colors group-hover:border-[#5a240a]">
              <svg
                width="12"
                height="12"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="1" y1="1" x2="13" y2="13" />
                <line x1="13" y1="1" x2="1" y2="13" />
              </svg>
            </span>
          </button>
        </div>

        {/* Items List */}
        <div className="my-6 flex-1 overflow-y-auto pr-1">
          {items.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <p
                className="text-2xl font-light text-[#100b0a]"
                style={{ fontFamily: "var(--font-cormorant), 'Adamina', Georgia, serif" }}
              >
                Your case is empty.
              </p>
              <p className="mt-2 text-sm text-[#3b3530] font-light">
                Seven perfumes await your choice.
              </p>
              <Link
                href="/#collection"
                onClick={() => setIsCaseOpen(false)}
                className="mt-6 inline-block border border-[#100b0a] bg-[#100b0a] px-6 py-2.5 text-[11px] uppercase tracking-[0.22em] text-[#f1ebe4] transition-all hover:bg-[#5a240a] hover:border-[#5a240a]"
              >
                Explore the Collection
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col divide-y divide-[#100b0a]/10">
              {items.map((item) => (
                <li key={item.slug} className="flex gap-4 py-6 first:pt-2 last:pb-2">
                  <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden border border-[#100b0a]/10 bg-[#f1ebe4]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/collection/${item.slug}`}
                          onClick={() => setIsCaseOpen(false)}
                          className="font-normal text-lg text-[#100b0a] transition-colors hover:text-[#5a240a]"
                          style={{ fontFamily: "var(--font-cormorant), 'Adamina', Georgia, serif" }}
                        >
                          {item.name}
                        </Link>
                        <span className="text-sm font-normal text-[#5a240a]">₹{item.price}</span>
                      </div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[#3b3530]">
                        {item.volume}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      {/* Quantity controls */}
                      <div className="flex items-center border border-[#100b0a]/20">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.slug, -1)}
                          aria-label={`Decrease ${item.name} quantity`}
                          className="flex h-7 w-7 items-center justify-center text-[#100b0a] transition-colors hover:text-[#5a240a] cursor-pointer"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-xs font-medium text-[#100b0a]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.slug, 1)}
                          aria-label={`Increase ${item.name} quantity`}
                          className="flex h-7 w-7 items-center justify-center text-[#100b0a] transition-colors hover:text-[#5a240a] cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCase(item.slug)}
                        className="text-[10px] uppercase tracking-[0.18em] text-[#3b3530] transition-colors hover:text-[#5a240a] cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer with Subtotal & Dispatch */}
        {items.length > 0 && (
          <div className="border-t border-[#100b0a]/10 pt-5">
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-xs uppercase tracking-[0.2em] text-[#3b3530]">Subtotal</span>
              <span
                className="text-2xl font-normal text-[#100b0a]"
                style={{ fontFamily: "var(--font-cormorant), 'Adamina', Georgia, serif" }}
              >
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-[#3b3530]/80">
              Prices in rupees, inclusive of all taxes. Free domestic shipping.
            </p>
            <button
              type="button"
              className="mt-6 flex w-full items-center justify-center border border-[#100b0a] bg-[#100b0a] py-3.5 text-xs uppercase tracking-[0.24em] text-[#f1ebe4] transition-all hover:border-[#5a240a] hover:bg-[#5a240a] cursor-pointer"
            >
              Complete Order
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCase } from "@/context/case-context";

function itemHref(slug: string) {
  if (slug === "discovery-set") return "/discovery-set";
  if (slug === "en-route") return "/objects/en-route";
  return `/collection/${slug}`;
}

export default function CaseDrawer() {
  const {
    items,
    removeFromCase,
    updateQuantity,
    giftNote,
    setGiftNote,
    totalCount,
    subtotal,
    isCaseOpen,
    setIsCaseOpen,
  } = useCase();
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const triggerElRef = useRef<HTMLElement | null>(null);
  const [noteOpen, setNoteOpen] = useState(false);

  useEffect(() => {
    if (!isCaseOpen) return;

    triggerElRef.current = document.activeElement as HTMLElement;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    lenis?.stop();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsCaseOpen(false);
        return;
      }

      if (e.key === "Tab") {
        const focusableElements = drawerRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements || focusableElements.length === 0) return;

        const firstEl = focusableElements[0];
        const lastEl = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    closeBtnRef.current?.focus();

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      lenis?.start();
      triggerElRef.current?.focus();
    };
  }, [isCaseOpen, setIsCaseOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-visibility duration-300 ${
        isCaseOpen ? "visible pointer-events-auto" : "invisible pointer-events-none delay-300"
      }`}
      aria-hidden={!isCaseOpen}
    >
      <div
        onClick={() => setIsCaseOpen(false)}
        className={`absolute inset-0 bg-[#101418]/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          isCaseOpen ? "opacity-100" : "opacity-0"
        }`}
        aria-label="Close Case overlay"
      />

      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Your Case"
        data-lenis-prevent
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col justify-between overflow-y-auto border-l border-aube-hairline bg-aube-surface px-6 pt-6 pb-[max(1.5rem,calc(env(safe-area-inset-bottom)+1rem))] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-10 sm:pt-8 sm:pb-[max(2rem,calc(env(safe-area-inset-bottom)+1.5rem))] ${
          isCaseOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-aube-hairline/60 pb-5">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-2xl font-light italic text-aube-text">Your Case</span>
            <span className="text-[11px] uppercase tracking-[0.2em] text-aube-text-muted">
              ({totalCount})
            </span>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={() => setIsCaseOpen(false)}
            aria-label="Close Case drawer"
            className="group flex min-h-11 items-center gap-2 text-aube-text transition-colors hover:text-aube-accent"
          >
            <span className="text-[11px] uppercase tracking-[0.2em] text-aube-text-muted group-hover:text-aube-accent">
              Close
            </span>
            <span className="flex h-8 w-8 items-center justify-center border border-aube-hairline transition-colors group-hover:border-aube-accent">
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
              <p className="font-display text-2xl font-light italic text-aube-text">Your case is empty.</p>
              <p className="mt-2 text-sm text-aube-text-muted">Seven perfumes await your choice.</p>
              <Link
                href="/collection"
                onClick={() => setIsCaseOpen(false)}
                className="mt-6 inline-flex min-h-11 items-center border-b border-aube-accent pb-1 text-xs uppercase tracking-[0.2em] text-aube-accent transition-opacity hover:opacity-80"
              >
                Explore the Collection
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col divide-y divide-aube-hairline/50">
              {items.map((item) => (
                <li key={item.slug} className="flex gap-4 py-6 first:pt-2 last:pb-2">
                  <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden border border-aube-hairline/60 bg-aube-base/40">
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
                          href={itemHref(item.slug)}
                          onClick={() => setIsCaseOpen(false)}
                          className="font-display text-xl font-normal italic text-aube-text transition-colors hover:text-aube-accent"
                        >
                          {item.name}
                        </Link>
                        <span className="font-display text-lg font-light text-aube-text tabular-nums">
                          {item.price}
                        </span>
                      </div>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-aube-text-muted">
                        {item.volume}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border border-aube-hairline">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.slug, -1)}
                          aria-label={`Decrease ${item.name} quantity`}
                          className="flex h-11 w-11 items-center justify-center text-aube-text transition-colors hover:text-aube-accent"
                        >
                          −
                        </button>
                        <span className="w-10 text-center text-xs font-medium text-aube-text tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.slug, 1)}
                          aria-label={`Increase ${item.name} quantity`}
                          className="flex h-11 w-11 items-center justify-center text-aube-text transition-colors hover:text-aube-accent"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCase(item.slug)}
                        className="inline-flex min-h-11 items-center px-2 text-[11px] uppercase tracking-[0.18em] text-aube-text-muted transition-colors hover:text-aube-accent"
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

        {/* Footer with Gift Note, Subtotal & Checkout */}
        {items.length > 0 && (
          <div className="border-t border-aube-hairline/60 pt-5">
            <div className="mb-4 border-b border-aube-hairline/50 pb-4">
              <button
                type="button"
                onClick={() => setNoteOpen((v) => !v)}
                aria-expanded={noteOpen || Boolean(giftNote)}
                className="flex min-h-11 w-full items-center justify-between py-2 text-left text-xs uppercase tracking-[0.18em] text-aube-text-muted hover:text-aube-text"
              >
                <span>{giftNote ? "Gift note added" : "Add a gift note (optional)"}</span>
                <span aria-hidden="true">{noteOpen || giftNote ? "−" : "+"}</span>
              </button>
              {(noteOpen || Boolean(giftNote)) && (
                <div className="mt-3">
                  <label htmlFor="case-gift-note" className="sr-only">
                    Gift note
                  </label>
                  <textarea
                    id="case-gift-note"
                    rows={2}
                    maxLength={240}
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    placeholder="Written by hand on an archival card inside the parcel."
                    className="w-full border border-aube-hairline bg-aube-base/50 px-3 py-2 text-base text-aube-text placeholder:text-aube-text-muted focus:border-aube-accent focus:outline-none sm:text-xs"
                  />
                </div>
              )}
            </div>

            <div className="flex items-baseline justify-between text-sm">
              <span className="text-xs uppercase tracking-[0.2em] text-aube-text-muted">Subtotal</span>
              <span className="font-display text-2xl font-light text-aube-text tabular-nums">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-aube-text-muted">
              Prices in rupees, inclusive of all taxes.
            </p>
            <Link
              href="/checkout"
              onClick={() => setIsCaseOpen(false)}
              className="mt-6 flex w-full items-center justify-center border border-aube-text bg-aube-text py-3.5 text-center text-xs uppercase tracking-[0.24em] text-aube-base transition-all hover:border-aube-accent hover:bg-aube-accent active:scale-[0.99]"
            >
              Proceed to Checkout
            </Link>
            <div className="mt-3 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.16em] text-aube-text-muted">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Razorpay Secure · UPI · Cards · NetBanking</span>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

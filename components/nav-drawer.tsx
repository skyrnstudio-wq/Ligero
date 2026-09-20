"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { PERFUMES } from "@/lib/products";

interface NavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const HOUSE_LINKS = [
  { label: "The Maison", href: "/maison", desc: "Story, craft, sourcing" },
  { label: "The Journal", href: "/journal", desc: "Long pieces, no SKUs" },
  { label: "Objects", href: "/objects", desc: "Discovery Set & En Route" },
  { label: "Concierge", href: "/contact", desc: "Private appointments" },
];

export default function NavDrawer({ isOpen, onClose }: NavDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Close on Escape key press & body scroll locking
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    closeBtnRef.current?.focus();

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-visibility duration-300 ${
        isOpen ? "visible pointer-events-auto" : "invisible pointer-events-none delay-300"
      }`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-[#101418]/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        aria-label="Close navigation overlay"
      />

      {/* Slide-over sheet */}
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site Navigation"
        className={`absolute inset-y-0 left-0 flex w-full max-w-md flex-col justify-between overflow-y-auto border-r border-aube-hairline bg-aube-surface px-6 py-6 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-10 sm:py-8 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-aube-hairline/60 pb-5">
          <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-aube-text-muted">
            Ligero Parfum
          </span>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close navigation drawer"
            className="group flex items-center gap-2 text-aube-text transition-colors hover:text-aube-accent"
          >
            <span className="text-[11px] uppercase tracking-[0.2em] text-aube-text-muted group-hover:text-aube-accent">
              Close
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-aube-hairline transition-colors group-hover:border-aube-accent">
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

        {/* Drawer Navigation Links */}
        <div className="my-8 flex flex-col gap-10">
          {/* Main Collection Link */}
          <div>
            <div className="flex items-baseline justify-between">
              <Link
                href="/collection"
                onClick={onClose}
                className="font-display text-3xl font-light tracking-[-0.01em] text-aube-text transition-colors hover:text-aube-accent sm:text-4xl"
              >
                The Collection
              </Link>
              <Link
                href="/collection"
                onClick={onClose}
                className="text-[11px] uppercase tracking-[0.2em] text-aube-accent transition-opacity hover:opacity-80"
              >
                View All →
              </Link>
            </div>

            {/* The 7 Perfumes */}
            <div className="mt-5">
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-aube-text-muted/80">
                Seven Perfumes
              </p>
              <ul className="mt-3 flex flex-col gap-3">
                {PERFUMES.map((perfume) => (
                  <li key={perfume.slug}>
                    <Link
                      href={`/collection/${perfume.slug}`}
                      onClick={onClose}
                      className="group flex items-baseline justify-between transition-colors"
                    >
                      <div>
                        <span className="font-display text-xl font-normal text-aube-text transition-colors group-hover:text-aube-accent">
                          {perfume.name}
                        </span>
                        <span className="ml-3 font-display text-xs italic text-aube-text-muted/80 transition-colors group-hover:text-aube-text">
                          {perfume.oneLiner}
                        </span>
                      </div>
                      <span className="font-body text-xs text-aube-text-muted group-hover:text-aube-text">
                        {perfume.price}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Maison & Other Routes */}
          <div className="border-t border-aube-hairline/60 pt-6">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-aube-text-muted/80">
              The House
            </p>
            <ul className="mt-3 grid grid-cols-1 gap-4">
              {HOUSE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="group flex items-baseline justify-between transition-colors"
                  >
                    <span className="font-display text-2xl font-light text-aube-text transition-colors group-hover:text-aube-accent">
                      {link.label}
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.16em] text-aube-text-muted transition-colors group-hover:text-aube-accent">
                      {link.desc}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="border-t border-aube-hairline/60 pt-6">
          <p className="font-display text-sm italic text-aube-text-muted">
            Seven perfumes, all permanent.
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-aube-text-muted">
            <span>Rested ninety days</span>
            <Link
              href="/contact"
              onClick={onClose}
              className="text-aube-accent hover:underline"
            >
              Private Appointment
            </Link>
          </div>
          <div className="mt-4 pt-3 border-t border-aube-hairline/40">
            <a
              href="https://www.instagram.com/ligeroparfums"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-aube-text-muted transition-colors hover:text-aube-accent"
            >
              <span>Instagram</span>
              <span className="text-aube-accent">@ligeroparfums ↗</span>
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
}

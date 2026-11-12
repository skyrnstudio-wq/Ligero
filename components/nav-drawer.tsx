"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { PERFUMES } from "@/lib/products";

declare global {
  interface Window {
    __lenis?: {
      stop: () => void;
      start: () => void;
    };
  }
}

interface NavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isDark?: boolean;
}

const HOUSE_LINKS = [
  { label: "The Collection", href: "/collection" },
  { label: "The Discovery Set", href: "/discovery-set" },
  { label: "Car Perfume", href: "/objects/en-route" },
  { label: "Objects", href: "/objects" },
  { label: "Help", href: "/help" },
];

export default function NavDrawer({ isOpen, onClose, isDark = false }: NavDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const triggerElRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    triggerElRef.current = document.activeElement as HTMLElement;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.__lenis?.stop();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab") {
        const focusableElements = drawerRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements || focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const firstEl = focusableElements[0];
        const lastEl = focusableElements[focusableElements.length - 1];

        // Guard against background leakage: pull focus into the drawer if currently outside
        if (!drawerRef.current?.contains(document.activeElement)) {
          e.preventDefault();
          if (e.shiftKey) {
            lastEl.focus();
          } else {
            firstEl.focus();
          }
          return;
        }

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

    // Initial focus: immediate attempt + rAF + timeout fallback after style recalculation
    const focusTarget = () => {
      if (closeBtnRef.current) {
        closeBtnRef.current.focus();
      } else {
        const firstFocusable = drawerRef.current?.querySelector<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        firstFocusable?.focus();
      }
    };

    focusTarget();
    const rafId = requestAnimationFrame(focusTarget);
    const timerId = setTimeout(focusTarget, 50);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timerId);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      window.__lenis?.start();
      triggerElRef.current?.focus();
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 ${
        isOpen
          ? "visible pointer-events-auto"
          : "invisible pointer-events-none transition-[visibility] duration-0 delay-500"
      }`}
      aria-hidden={!isOpen}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-[#0d1013]/55 backdrop-blur-sm transition-opacity duration-400 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        aria-label="Close navigation overlay"
      />

      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
        data-lenis-prevent
        className={`absolute inset-y-0 left-0 flex w-full max-w-md flex-col justify-between overflow-y-auto border-r border-[#382a20] bg-[#1c140e] px-6 pt-6 pb-[max(1.5rem,calc(env(safe-area-inset-bottom)+1rem))] text-[#f3ede3] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-10 sm:pt-10 sm:pb-[max(2.5rem,calc(env(safe-area-inset-bottom)+1.5rem))] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#382a20] pb-6">
          <Link href="/" onClick={onClose} className="flex flex-col transition-opacity hover:opacity-85">
            <span className="font-display text-lg font-medium uppercase leading-tight tracking-[0.24em] pl-[0.24em] text-[#FDFBF7]">
              Ligéro
            </span>
            <span className="mt-0.5 font-display text-[11px] font-semibold uppercase leading-none tracking-[0.36em] pl-[0.36em] text-[#d89f68]">
              Parfums
            </span>
          </Link>

          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close navigation drawer"
            className="group flex min-h-11 items-center gap-2 text-[#FDFBF7] transition-colors hover:text-[#d89f68]"
          >
            <span className="text-[12px] uppercase tracking-[0.22em] text-[#E6DDD0] group-hover:text-[#d89f68]">
              Close
            </span>
            <span className="flex h-8 w-8 items-center justify-center border border-[#382a20] text-xs transition-colors group-hover:border-[#d89f68]">
              ✕
            </span>
          </button>
        </div>

        <div className="my-8 flex flex-col gap-10">
          <nav aria-label="House Directory" className="flex flex-col gap-3">
            {HOUSE_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="inline-flex min-h-11 items-center font-display text-3xl font-light italic tracking-tight text-[#f3ede3] transition-colors hover:text-[#d89f68] sm:text-4xl"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-[#382a20] pt-8">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#b09f8f]">
              Seven Perfumes
            </p>

            <ul className="mt-4 flex flex-col gap-2">
              {PERFUMES.map((perfume) => (
                <li key={perfume.slug}>
                  <Link
                    href={`/collection/${perfume.slug}`}
                    onClick={onClose}
                    className="group flex min-h-11 items-center justify-between py-2 transition-colors"
                  >
                    <span className="font-display text-xl font-normal italic text-[#f3ede3] transition-colors group-hover:text-[#d89f68]">
                      {perfume.name}
                    </span>
                    <span className="text-[11px] text-[#b09f8f] transition-colors group-hover:text-[#f3ede3]">
                      {perfume.scentProfile.family}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#382a20] pt-6">
          <p className="text-xs leading-relaxed text-[#b09f8f]">
            Handcrafted with pure botanical extraits.
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[#b09f8f]">
            <Link href="/help" onClick={onClose} className="inline-flex min-h-11 items-center hover:text-[#d89f68]">
              Help
            </Link>
            <a
              href="https://www.instagram.com/ligeroparfums"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center text-[#d89f68] transition-opacity hover:opacity-80"
            >
              @ligeroparfums ↗
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
}

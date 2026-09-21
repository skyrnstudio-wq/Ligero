"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useCase } from "@/context/case-context";
import NavDrawer from "./nav-drawer";

interface SiteHeaderProps {
  isDark?: boolean;
}

/**
 * Fixed strip header. Hides on scroll down, returns on scroll up.
 * Logo sits at the exact horizontal center of the viewport and is
 * the largest element in the bar.
 */
export default function SiteHeader({ isDark = false }: SiteHeaderProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { totalCount, setIsCaseOpen } = useCase();
  const lastY = useRef(0);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = lastY.current;
    const delta = y - prev;
    lastY.current = y;
    setScrolled(y > 8);
    // Scrolling down past the bar hides it; any upward scroll reveals it.
    if (y < 80) {
      setHidden(false);
    } else if (delta > 4) {
      setHidden(true);
    } else if (delta < -4) {
      setHidden(false);
    }
  });

  // Intro loader is only displayed on the home page ('/').
  // On all other routes, header elements are immediately visible.
  const [introDone, setIntroDone] = useState(() => {
    if (typeof window !== "undefined") {
      if (window.location.pathname !== "/") return true;
      if (window.__ligeroIntroDone || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return true;
      }
    }
    return !isHome;
  });

  useEffect(() => {
    if (!isHome) {
      setIntroDone(true);
      return;
    }

    // If intro already finished or reduced motion is active
    if (typeof window !== "undefined" && (window.__ligeroIntroDone || window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
      setIntroDone(true);
      return;
    }

    const onIntroDone = () => setIntroDone(true);
    window.addEventListener("ligero:intro-done", onIntroDone);
    return () => window.removeEventListener("ligero:intro-done", onIntroDone);
  }, [isHome]);

  const textColor = isDark ? "text-[#EAE6DC]" : "text-aube-text";
  const hoverColor = isDark ? "hover:text-noctis-accent" : "hover:text-aube-accent";
  const badgeBg = isDark ? "bg-noctis-accent" : "bg-aube-text";
  const badgeText = isDark ? "text-noctis-base" : "text-aube-base";
  const stripBg = isDark
    ? scrolled
      ? "border-b border-[#3A3F45] bg-nav-soot/95 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
      : "border-b border-white/[0.08] bg-nav-soot/85 backdrop-blur-md"
    : scrolled      ? "border-b border-aube-hairline bg-nav-silk/95 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(43,33,24,0.08)]"
      : "border-b border-aube-text/[0.08] bg-nav-silk/85 backdrop-blur-md";

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${stripBg}`}
      >
        <div className="relative mx-auto flex h-16 w-full max-w-[112rem] items-center justify-between px-6 sm:h-20 sm:px-10 lg:px-16">
          {/* Left: Drawer Trigger */}
          <div
            className={`flex flex-1 items-center transition-opacity duration-700 ${
              introDone ? "opacity-100" : "opacity-0"
            }`}
          >
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
              className={`group flex items-center gap-2.5 py-2 ${textColor} transition-colors ${hoverColor} focus:outline-none focus-visible:ring-1`}
            >
              <span className="flex h-4 w-5 flex-col justify-center gap-[5px]">
                <span className="h-[1px] w-5 bg-current transition-all duration-300 group-hover:w-5" />
                <span className="h-[1px] w-3.5 bg-current transition-all duration-300 group-hover:w-5" />
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.24em] sm:text-xs">
                Menu
              </span>
            </button>
          </div>

          {/* Center: Logo — true viewport center, gracefully proportioned luxury mark */}
          <Link
            href="/"
            id="site-header-logo-target"
            aria-label="Ligero Parfum, home"
            className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center ${
              isDark ? "brightness-125 invert" : ""
            } ${introDone ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <Image
              src="/images/ligero-logo.png"
              alt="Ligero Parfum"
              width={1017}
              height={273}
              priority
              className="h-6 w-auto object-contain sm:h-7 md:h-8 lg:h-[34px] aspect-[1017/273] transition-opacity duration-300 hover:opacity-75"
            />
          </Link>

          {/* Right: Cart / Case */}
          <div
            className={`flex flex-1 items-center justify-end transition-opacity duration-700 ${
              introDone ? "opacity-100" : "opacity-0"
            }`}
          >
            <button
              type="button"
              onClick={() => setIsCaseOpen(true)}
              aria-label={`Case (${totalCount} items)`}
              className={`group flex items-center gap-2.5 py-2 ${textColor} transition-colors ${hoverColor} focus:outline-none focus-visible:ring-1`}
            >
              <span className="text-[11px] font-medium uppercase tracking-[0.24em] sm:text-xs">
                Case
              </span>
              <span className="relative flex items-center justify-center">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-[18px] w-[18px] transition-transform duration-300 group-hover:scale-105"
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                <span
                  className={`absolute -right-2 -top-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full ${badgeBg} ${badgeText} px-1 text-[8.5px] font-semibold leading-none transition-transform ${
                    totalCount > 0 ? "scale-100" : "scale-90 opacity-70"
                  }`}
                >
                  {totalCount}
                </span>
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Slide-out Navigation Drawer */}
      <NavDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}

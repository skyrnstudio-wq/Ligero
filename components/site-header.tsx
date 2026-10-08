"use client";

import Link from "next/link";
import { useState } from "react";
import { useCase } from "@/context/case-context";
import NavDrawer from "./nav-drawer";

interface SiteHeaderProps {
  isDark?: boolean;
}

/**
 * SiteHeader — The Silk Emporium Navigation
 * Spec Box: x 0%, y 0%, w 100%, h 11.07% (1376x85px)
 * - nav-logo: x 3.49%, y 3.26%, w 15.99%, h 5.99% (px: 48, 25, 220, 46) -> inkBox { x: 6, y: 0, w: 205, h: 46 }
 * - nav-links: x 62.5%, y 3.91%, w 34.16%, h 4.69% (px: 860, 30, 470, 36) -> inkBox { x: 29, y: 7, w: 434, h: 21 }
 */
export default function SiteHeader({ isDark = false }: SiteHeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { totalCount, setIsCaseOpen } = useCase();

  return (
    <>
      <header
        data-region="nav-bar"
        className="absolute top-0 left-0 w-full z-40 h-[85px] pointer-events-auto"
      >
        <div className="relative w-full h-full">
          {/* Region 2: nav-logo (px: 48, 25, 220, 46) */}
          <div
            data-region="nav-logo"
            className="absolute left-[3.49%] top-[25px] w-[220px] h-[46px] flex items-center justify-start max-md:left-6 max-md:top-4"
          >
            <Link
              href="/"
              aria-label="Ligero Parfum, home"
              className="block font-serif text-[50px] leading-none tracking-[0.12em] font-normal text-[#0a0a09] select-none hover:opacity-85 transition-opacity max-md:text-[32px]"
              style={{
                fontFamily: "var(--font-cormorant), 'Didot', serif",
                marginLeft: "5px",
              }}
            >
              LIGÉRO
            </Link>
          </div>

          {/* Region 3: nav-links (px: 860, 30, 470, 36) */}
          <nav
            data-region="nav-links"
            aria-label="Primary navigation"
            className="absolute left-[62.5%] top-[30px] w-[470px] h-[36px] hidden md:flex items-center whitespace-nowrap text-[20px] leading-[20px] text-[#0e0f0e] font-normal select-none"
            style={{
              paddingLeft: "29px",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
            }}
          >
            <Link
              href="#collection"
              className="hover:text-[#5a240a] transition-colors shrink-0"
              style={{ marginRight: "44px" }}
            >
              Collection
            </Link>
            <Link
              href="#maison"
              className="hover:text-[#5a240a] transition-colors shrink-0"
              style={{ marginRight: "44px" }}
            >
              Maison
            </Link>
            <Link
              href="#journal"
              className="hover:text-[#5a240a] transition-colors shrink-0"
              style={{ marginRight: "45px" }}
            >
              Journal
            </Link>
            <button
              type="button"
              onClick={() => setIsCaseOpen(true)}
              aria-label={`Case (${totalCount} items)`}
              className="hover:text-[#5a240a] transition-colors flex items-center gap-[11px] shrink-0 focus:outline-none cursor-pointer whitespace-nowrap"
            >
              <svg
                width="18"
                height="21"
                viewBox="0 0 18 21"
                fill="none"
                stroke="#0e0f0e"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
                aria-hidden="true"
              >
                <path d="M5 6.5V4.5C5 2.567 6.79 1 9 1s4 1.567 4 3.5v2" />
                <rect x="1" y="6.5" width="16" height="13.5" rx="2.5" />
              </svg>
              <span className="whitespace-nowrap">Case ({totalCount})</span>
            </button>
          </nav>

          {/* Mobile menu trigger */}
          <div className="absolute right-6 top-5 flex md:hidden items-center gap-4">
            <button
              type="button"
              onClick={() => setIsCaseOpen(true)}
              className="text-[12px] uppercase tracking-[0.2em] text-[#0a0a09]"
            >
              Case ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              className="text-[12px] uppercase tracking-[0.2em] text-[#0a0a09] p-1"
            >
              Menu
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Navigation Drawer for mobile */}
      <NavDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}

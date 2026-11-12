"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useCase } from "@/context/case-context";
import { PERFUMES, OBJECTS } from "@/lib/products";
import NavDrawer from "./nav-drawer";

interface SiteHeaderProps {
  isDark?: boolean;
}

/**
 * Single-line maison header (max 72px).
 * Left: Collection (opens the seven-bottle cutout panel on hover/focus), Discovery Set.
 * Center: Ligero Parfums crest.
 * Right: Maison, Concierge, Search, Case.
 */
export default function SiteHeader({ isDark = false }: SiteHeaderProps) {
  const pathname = usePathname();

  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { totalCount, setIsCaseOpen } = useCase();
  const lastY = useRef(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = lastY.current;
    const delta = y - prev;
    lastY.current = y;
    setScrolled(y > 8);

    if (y < 96) {
      setHidden(false);
    } else if (delta > 5 && !searchOpen && !collectionOpen) {
      setHidden(true);
    } else if (delta < -4) {
      setHidden(false);
    }
  });

  useEffect(() => {
    if (searchOpen) {
      const timer = setTimeout(() => searchInputRef.current?.focus(), 60);
      return () => clearTimeout(timer);
    }
  }, [searchOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setCollectionOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const openCollection = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setSearchOpen(false);
    setCollectionOpen(true);
  };

  const scheduleCloseCollection = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setCollectionOpen(false), 140);
  };

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const allItems = [
      ...PERFUMES.map((p) => ({
        name: p.name,
        subtitle: p.scentProfile.family,
        notes: p.notesUppercase,
        href: `/collection/${p.slug}`,
        image: `/images/perfumes/cutouts/${p.slug}.webp?v=2`,
      })),
      ...OBJECTS.map((o) => ({
        name: o.name,
        subtitle: o.spec,
        notes: o.description,
        href: o.slug === "discovery-set" ? "/discovery-set" : "/objects/en-route",
        image: o.image,
      })),
    ];
    if (!q) return allItems.slice(0, 5);
    return allItems.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.notes.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const headerBg = "bg-[#1c140e]/95 text-[#f3ede3]";
  const borderRule = "border-b border-[#382a20]/90";
  const shadowRule = scrolled
    ? "shadow-[0_4px_24px_rgba(28,20,14,0.45)]"
    : "shadow-none";
  const blurRule = "backdrop-blur-md";

  const textPrimary = "text-[#FDFBF7]";
  const textMuted = "text-[#E6DDD0]";
  const hoverAccent = "hover:text-[#E5B285] transition-colors";
  const badgeClasses = "bg-[#d89f68] text-[#1c140e] font-bold";
  const panelSurface = "border-t border-[#382a20]/90 bg-[#1c140e]/98 text-[#f3ede3] backdrop-blur-lg";

  const navLinkClass = (href: string) => {
    const active =
      href === "/collection"
        ? pathname.startsWith("/collection")
        : pathname === href || pathname.startsWith(`${href}/`);
    return `relative inline-flex min-h-11 items-center text-[12px] font-medium uppercase tracking-[0.22em] whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d89f68] ${
      active
        ? "text-[#FDFBF7] font-semibold"
        : "text-[#E6DDD0] hover:text-[#E5B285]"
    }`;
  };

  return (
    <>
      <motion.header
        ref={headerRef}
        initial={false}
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.42, ease: [0.32, 0.72, 0, 1] }}
        onMouseLeave={scheduleCloseCollection}
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${headerBg} ${borderRule} ${shadowRule} ${blurRule}`}
      >
        <div className="relative mx-auto flex h-16 w-full max-w-[112rem] items-center justify-between px-2.5 sm:h-[70px] sm:px-10 lg:h-[72px] lg:px-14 xl:px-20">
          {/* Left: Mobile Menu trigger OR Desktop "Collection · Discovery Set" */}
          <div className="flex flex-1 items-center gap-6 lg:gap-9">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
              className={`group inline-flex min-h-11 min-w-11 items-center justify-center gap-2.5 py-2 lg:hidden text-[#FDFBF7] ${hoverAccent}`}
            >
              <span className="flex h-4 w-5 flex-col justify-center gap-[5px]" aria-hidden="true">
                <span className="h-[2px] w-5 bg-current transition-all duration-300" />
                <span className="h-[2px] w-3.5 bg-current transition-all duration-300 group-hover:w-5" />
              </span>
              <span className="text-[12px] font-semibold uppercase tracking-[0.2em]">
                Menu
              </span>
            </button>

            <nav aria-label="Primary left" className="hidden lg:flex items-center gap-8 xl:gap-10">
              <div
                onMouseEnter={openCollection}
                onFocus={openCollection}
                className="relative flex items-center"
              >
                <Link
                  href="/collection"
                  aria-expanded={collectionOpen}
                  aria-controls="collection-cutout-panel"
                  onClick={() => setCollectionOpen(false)}
                  className={navLinkClass("/collection")}
                >
                  Collection
                </Link>
              </div>

              <Link
                href="/discovery-set"
                onMouseEnter={() => setCollectionOpen(false)}
                className={navLinkClass("/discovery-set")}
              >
                Discovery Set
              </Link>
            </nav>
          </div>

          {/* Center: Maison Crest */}
          <Link
            href="/"
            aria-label="Ligero Parfum, home"
            onClick={() => {
              setCollectionOpen(false);
              setSearchOpen(false);
            }}
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center transition-opacity duration-300 hover:opacity-85"
          >
            <div
              id="site-header-logo-target"
              className="flex flex-col items-center justify-center text-center select-none"
            >
              <span
                className="font-display text-lg font-medium uppercase leading-tight tracking-[0.24em] pl-[0.24em] sm:text-xl sm:tracking-[0.28em] sm:pl-[0.28em] lg:text-[23px] text-[#FDFBF7]"
              >
                Ligéro
              </span>
              <span
                aria-hidden="true"
                className="mt-0.5 font-display text-[11px] font-semibold uppercase leading-none tracking-[0.36em] pl-[0.36em] sm:text-[12px] sm:tracking-[0.40em] sm:pl-[0.40em] text-[#d89f68]"
              >
                Parfums
              </span>
            </div>
          </Link>

          {/* Right: Search + Case */}
          <div className="flex flex-1 items-center justify-end gap-1 sm:gap-6 lg:gap-8">
            <button
              type="button"
              onClick={() => {
                setCollectionOpen(false);
                setSearchOpen((prev) => !prev);
              }}
              aria-expanded={searchOpen}
              aria-controls="maison-search-panel"
              aria-label="Search fragrances and objects"
              className={`group inline-flex min-h-11 min-w-11 items-center justify-center gap-2 px-1.5 sm:px-2 text-[#E6DDD0] hover:text-[#E5B285] transition-colors`}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7.5" />
                <line x1="20" y1="20" x2="16.35" y2="16.35" />
              </svg>
              <span className="hidden text-[12px] font-medium uppercase tracking-[0.2em] sm:inline">
                Search
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsCaseOpen(true)}
              aria-label={`Open Case (${totalCount} items)`}
              className={`group relative inline-flex min-h-11 min-w-11 items-center justify-center gap-2 px-1.5 sm:px-2 text-[#E6DDD0] hover:text-[#E5B285] transition-colors`}
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 7h14l-1 13H6L5 7Z" />
                <path d="M9 7V5a3 3 0 0 1 6 0v2" />
              </svg>
              <span className="hidden text-[12px] font-medium uppercase tracking-[0.2em] sm:inline">
                Case
              </span>
              {totalCount > 0 && (
                <span
                  aria-hidden="true"
                  className={`absolute -top-1 -right-1 sm:static sm:top-auto sm:right-auto flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9.5px] font-bold leading-none tabular-nums ${badgeClasses}`}
                >
                  {totalCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Collection Hover Panel: Seven bottle cutouts, name under each, no prices */}
        {collectionOpen && (
          <div
            id="collection-cutout-panel"
            role="region"
            aria-label="The seven perfumes"
            onMouseEnter={openCollection}
            onMouseLeave={scheduleCloseCollection}
            className={`hidden lg:block px-10 py-8 xl:px-20 ${panelSurface}`}
          >
            <div className="mx-auto max-w-[112rem]">
              <ul className="grid grid-cols-7 gap-6">
                {PERFUMES.map((perfume) => {
                  const cutout = `/images/perfumes/cutouts/${perfume.slug}.webp?v=2`;
                  return (
                    <li key={perfume.slug}>
                      <Link
                        href={`/collection/${perfume.slug}`}
                        onClick={() => setCollectionOpen(false)}
                        className="group flex flex-col items-center text-center"
                      >
                        <div className="relative aspect-[3/4] w-full max-w-[130px] overflow-hidden">
                          <Image
                            src={cutout}
                            alt={`${perfume.name} bottle`}
                            fill
                            sizes="130px"
                            className="object-contain p-2 [filter:drop-shadow(-8px_12px_16px_rgba(0,0,0,0.55))_drop-shadow(0_4px_8px_rgba(0,0,0,0.35))] transition-transform duration-500 group-hover:-translate-y-1"
                          />
                        </div>
                        <span className="mt-2 font-display text-xl font-light italic transition-colors group-hover:text-[#d89f68]">
                          {perfume.name}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

        {/* Search Panel */}
        {searchOpen && (
          <div
            id="maison-search-panel"
            role="region"
            aria-label="Search Ligero creations"
            className={`px-6 py-6 sm:px-10 lg:px-20 ${panelSurface}`}
          >
            <div className="mx-auto max-w-4xl">
              <div className="flex items-center gap-3 border-b border-[#382a20] pb-3">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                  className={textMuted}
                >
                  <circle cx="11" cy="11" r="7.5" />
                  <line x1="20" y1="20" x2="16.35" y2="16.35" />
                </svg>
                <label htmlFor="maison-search-input" className="sr-only">
                  Search perfumes, notes, or objects
                </label>
                <input
                  id="maison-search-input"
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by perfume, note (jasmine, cacao, bergamot), or object..."
                  className={`w-full bg-transparent text-base ${textPrimary} placeholder:text-[#b09f8f]/60 focus:outline-none sm:text-sm`}
                />
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className={`min-h-11 px-2 text-[11px] uppercase tracking-[0.18em] ${textMuted} ${hoverAccent}`}
                >
                  Close
                </button>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {searchResults.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSearchOpen(false)}
                    className="group flex items-center gap-3 border border-[#382a20] bg-[#251b14]/70 p-2.5 transition-colors hover:border-[#d89f68]"
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-display text-lg font-light italic">
                        {item.name}
                      </p>
                      <p className={`truncate text-[10px] uppercase tracking-[0.14em] ${textMuted}`}>
                        {item.subtitle}
                      </p>
                    </div>
                  </Link>
                ))}
                {searchResults.length === 0 && (
                  <p className={`col-span-full py-2 text-xs ${textMuted}`}>
                    Nothing matched &ldquo;{searchQuery}&rdquo;. Try Noctis, AUBE, Fleur, or the Discovery Set.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.header>

      <NavDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} isDark={true} />
    </>
  );
}

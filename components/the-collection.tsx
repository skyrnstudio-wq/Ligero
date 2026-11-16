"use client";

import Image from "next/image";
import Link from "next/link";
import { useCase } from "@/context/case-context";
import {
  useRef,
  useState,
  useEffect,
  useCallback,
  type MouseEvent,
  type KeyboardEvent,
} from "react";

import {
  DEFAULT_FRAGRANCES,
  type FragranceItem,
} from "@/lib/products";
export type { FragranceItem };

export default function TheCollection({ items }: { items?: FragranceItem[] }) {
  const fragranceList = items && items.length > 0 ? items : DEFAULT_FRAGRANCES;
  const ledgerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [addedSlug, setAddedSlug] = useState<string | null>(null);
  const [revealedSlug, setRevealedSlug] = useState<string | null>(null);
  const { addToCase, setIsCaseOpen } = useCase();

  const updateScrollMetrics = useCallback(() => {
    const el = ledgerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 2) {
      setScrollProgress(0);
      setCanScrollPrev(false);
      setCanScrollNext(false);
      return;
    }
    const current = el.scrollLeft;
    setScrollProgress(Math.min(1, Math.max(0, current / maxScroll)));
    setCanScrollPrev(current > 8);
    setCanScrollNext(current < maxScroll - 8);
  }, []);

  useEffect(() => {
    updateScrollMetrics();
    const el = ledgerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollMetrics, { passive: true });
    window.addEventListener("resize", updateScrollMetrics);
    return () => {
      el.removeEventListener("scroll", updateScrollMetrics);
      window.removeEventListener("resize", updateScrollMetrics);
    };
  }, [updateScrollMetrics]);

  const scrollByCard = (direction: -1 | 1) => {
    const el = ledgerRef.current;
    if (!el) return;
    const firstCol = el.querySelector<HTMLElement>("[data-ledger-column]");
    const step = firstCol ? firstCol.offsetWidth : el.clientWidth * 0.75;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
    window.setTimeout(updateScrollMetrics, 350);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollByCard(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollByCard(1);
    }
  };

  const handleQuickAdd = (e: MouseEvent, fragrance: FragranceItem) => {
    e.preventDefault();
    e.stopPropagation();
    addToCase({
      slug: fragrance.slug,
      name: fragrance.name,
      price: fragrance.price,
      volume: fragrance.volume || "50 ml · Eau de Parfum",
      image: fragrance.image,
    });
    setAddedSlug(fragrance.slug);
    setIsCaseOpen(true);
    window.setTimeout(() => {
      setAddedSlug((curr) => (curr === fragrance.slug ? null : curr));
    }, 1600);
  };

  return (
    <section
      id="collection"
      aria-labelledby="collection-heading"
      className="relative overflow-hidden border-b border-aube-hairline bg-[#FAFAF7] py-10 sm:py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[104rem] px-4 sm:px-8 lg:px-12">
        {/* Serge Lutens-Inspired Compact Architectural Heading Stack */}
        <div className="mb-5 flex flex-col items-center text-center sm:mb-10">
          <div className="inline-block border-b border-aube-text pb-1.5">
            <h2
              id="collection-heading"
              className="font-display text-xl font-normal uppercase tracking-[0.24em] text-aube-text sm:text-2xl lg:text-[1.75rem]"
            >
              {fragranceList.length === 7 ? "The Seven Perfumes" : "The Collection"}
            </h2>
          </div>
          <p className="mt-2 font-body text-[11px] uppercase tracking-[0.18em] text-aube-text-muted">
            Eau de Parfum · Small-Batch Creations
          </p>

          {/* Minimalist Carousel Control Strip */}
          <div className="mt-4 flex w-full items-center justify-between border-b border-aube-hairline pb-2.5 text-xs">
            <span className="font-body text-[10px] uppercase tracking-[0.16em] text-aube-text-muted">
              <span className="sm:hidden">
                {String(fragranceList.length).padStart(2, "0")} Flacons
              </span>
              <span className="hidden sm:inline">
                Olfactive Ledger · {String(fragranceList.length).padStart(2, "0")} Flacons
              </span>
            </span>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/collection"
                className="inline-flex min-h-11 items-center font-body text-[10.5px] uppercase tracking-[0.16em] text-aube-text underline underline-offset-4 transition-colors hover:text-aube-accent"
              >
                <span className="sm:hidden">Catalog</span>
                <span className="hidden sm:inline">View Full Catalog</span>
              </Link>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollByCard(-1)}
                  disabled={!canScrollPrev}
                  aria-label="Previous fragrances"
                  className="flex h-11 w-11 min-h-11 min-w-11 items-center justify-center border border-aube-hairline bg-[#F1F0EB] text-aube-text transition-colors hover:border-aube-text disabled:opacity-25 focus-visible:outline-2 focus-visible:outline-aube-text"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.25"
                  >
                    <path
                      d="M10 3.5L5.5 8l4.5 4.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => scrollByCard(1)}
                  disabled={!canScrollNext}
                  aria-label="Next fragrances"
                  className="flex h-11 w-11 min-h-11 min-w-11 items-center justify-center border border-aube-hairline bg-[#F1F0EB] text-aube-text transition-colors hover:border-aube-text disabled:opacity-25 focus-visible:outline-2 focus-visible:outline-aube-text"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.25"
                  >
                    <path
                      d="M6 3.5l4.5 4.5-4.5 4.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Architectural Divided Ledger Columns */}
        <div
          ref={ledgerRef}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          aria-label="Fragrances ledger carousel, use left and right arrow keys to navigate"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          className="flex snap-x snap-mandatory overflow-x-auto touch-pan-x border-t border-b border-aube-hairline divide-x divide-aube-hairline no-scrollbar focus-visible:outline-1 focus-visible:outline-aube-text"
        >
          {fragranceList.map((fragrance, index) => {
            const isTouchRevealed = revealedSlug === fragrance.slug;
            const isAdded = addedSlug === fragrance.slug;

            return (
              <article
                key={fragrance.slug}
                data-ledger-column
                className="group relative flex w-[74vw] shrink-0 snap-start flex-col bg-transparent p-4 transition-colors duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-black/[0.015] sm:w-[44vw] sm:p-6 md:w-[32vw] lg:w-1/3 lg:p-7"
              >
                {/* Generous Flacon Plinth + Top-to-Down Ingredient Curtain Reveal */}
                <div className="relative h-[220px] w-full overflow-hidden bg-transparent transition-all duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] sm:h-[360px] md:h-[400px] lg:h-[440px]">
                  <Link
                    href={`/collection/${fragrance.slug}`}
                    aria-label={`Inspect ${fragrance.name}, 50 ml Eau de Parfum`}
                    className="relative block h-full w-full focus-visible:outline-2 focus-visible:outline-aube-text"
                  >
                    {/* Layer 1 (Base): Front-Facing Perfume Flacon with Grounding Plinth & Studio Cast Shadow */}
                    <div className="relative z-10 flex h-full w-full items-center justify-center">
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute bottom-5 left-1/2 h-4.5 w-[48%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(28,20,14,0.30)_0%,rgba(28,20,14,0.12)_50%,transparent_76%)] transition-all duration-700 group-hover:scale-x-95 group-hover:opacity-60"
                      />
                      <div className="relative h-[86%] w-[86%]">
                        <Image
                          src={fragrance.image}
                          alt={`${fragrance.name} 50 ml Eau de Parfum`}
                          fill
                          loading="eager"
                          decoding="async"
                          quality={80}
                          sizes="(max-width: 640px) 220px, (max-width: 1024px) 300px, 340px"
                          className="object-contain p-5 md:[filter:drop-shadow(-12px_18px_20px_rgba(28,20,14,0.22))] sm:p-7 lg:p-8"
                        />
                      </div>
                    </div>

                    {/* Layer 2 (Curtain): Raw Botanicals — Pure Top-to-Down Reveal Over Bottle */}
                    {fragrance.notesImage && (
                      <div
                        className={`pointer-events-none absolute inset-0 z-20 overflow-hidden bg-transparent transition-[clip-path] duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                          isTouchRevealed
                            ? "[clip-path:inset(0_0_0%_0)]"
                            : "[clip-path:inset(0_0_100%_0)] group-hover:[clip-path:inset(0_0_0%_0)] group-focus-within:[clip-path:inset(0_0_0%_0)]"
                        }`}
                      >
                        <Image
                          src={fragrance.notesImage}
                          alt={`Raw botanicals of ${fragrance.name}`}
                          fill
                          loading="lazy"
                          quality={75}
                          sizes="(max-width: 640px) 260px, (max-width: 1024px) 380px, 440px"
                          className={`object-cover object-center transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            isTouchRevealed
                              ? "translate-y-0 scale-100"
                              : "-translate-y-4 scale-105 group-hover:translate-y-0 group-hover:scale-100 group-focus-within:translate-y-0 group-focus-within:scale-100"
                          }`}
                        />
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 bg-black/[0.04]"
                        />
                      </div>
                    )}
                  </Link>

                  {/* Touch reveal toggle pill (< lg) */}
                  {fragrance.notesImage && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setRevealedSlug((curr) =>
                          curr === fragrance.slug ? null : fragrance.slug
                        );
                      }}
                      aria-pressed={isTouchRevealed}
                      aria-label={`Toggle ingredients view for ${fragrance.name}`}
                      className="group/pill absolute right-0 bottom-0 z-30 flex min-h-11 min-w-11 items-end justify-end p-1.5 lg:hidden focus-visible:outline-none"
                    >
                      <span className="inline-flex items-center border border-aube-hairline/80 bg-[#FAFAF7]/90 px-2 py-1 font-body text-[8px] uppercase tracking-[0.12em] leading-none text-aube-text backdrop-blur-xs transition-colors group-focus-visible/pill:outline-2 group-focus-visible/pill:outline-aube-text sm:px-2.5 sm:py-1.5 sm:text-[9px]">
                        {isTouchRevealed ? "Bottle" : "Ingredients"}
                      </span>
                    </button>
                  )}
                </div>

                {/* Olfactory / Review & Acquire Action Row */}
                <div className="mt-2 flex items-center justify-between gap-2 text-xs">
                  {typeof fragrance.rating === "number" &&
                  typeof fragrance.reviewCount === "number" &&
                  fragrance.reviewCount > 0 ? (
                    <Link
                      href={`/collection/${fragrance.slug}#reviews-section`}
                      aria-label={`${fragrance.name}: rated ${(fragrance.rating ?? 0).toFixed(1)} out of 5 stars based on ${fragrance.reviewCount} verified collector reviews`}
                      className="group/rating inline-flex min-h-11 min-w-11 items-center gap-1.5 text-aube-text transition-opacity hover:opacity-75 focus-visible:outline-1 focus-visible:outline-aube-text"
                    >
                      <span
                        aria-hidden="true"
                        className="text-[11px] tracking-[-0.05em] text-[#C6A15B]"
                      >
                        {"★".repeat(Math.round(fragrance.rating ?? 0))}
                      </span>
                      <span className="font-display text-xs tabular-nums text-aube-text/90">
                        {(fragrance.rating ?? 0).toFixed(1)}
                      </span>
                      <span className="font-body text-[10px] text-aube-text-muted tabular-nums group-hover/rating:text-aube-text">
                        ({fragrance.reviewCount})
                      </span>
                    </Link>
                  ) : (
                    <span className="font-body text-[10px] uppercase tracking-[0.16em] text-aube-text-muted">
                      {fragrance.family}
                    </span>
                  )}

                  {/* Quick Add / Acquire Bookmark Button */}
                  <button
                    type="button"
                    onClick={(e) => handleQuickAdd(e, fragrance)}
                    aria-label={
                      isAdded
                        ? `${fragrance.name} in Case`
                        : `Acquire ${fragrance.name}`
                    }
                    className="group/btn inline-flex min-h-11 min-w-11 items-center justify-end gap-1.5 font-body text-[10.5px] uppercase tracking-[0.14em] text-aube-text transition-colors duration-500 hover:text-aube-accent focus-visible:outline-1 focus-visible:outline-aube-text"
                  >
                    <span>{isAdded ? "In Case" : "Acquire"}</span>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 16 16"
                      className="h-3 w-3 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.25"
                    >
                      <path
                        d="M3 8h10M9 4l4 4-4 4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                {/* Architectural Title & Ledger Price Row */}
                <div className="mt-1 flex items-baseline justify-between gap-2 border-t border-aube-hairline pt-2">
                  <div className="min-w-0">
                    <Link
                      href={`/collection/${fragrance.slug}`}
                      className="inline-flex min-h-11 items-center font-display text-base font-medium uppercase tracking-[0.16em] text-aube-text transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-aube-accent focus-visible:outline-1 focus-visible:outline-aube-text"
                    >
                      {fragrance.name}
                    </Link>
                    <p className="mt-0.5 font-body text-[9.5px] uppercase tracking-[0.18em] text-aube-text-muted">
                      {fragrance.concentration}
                    </p>
                  </div>

                  <p className="font-display text-sm font-normal tabular-nums text-aube-text whitespace-nowrap">
                    ₹{fragrance.price.toLocaleString("en-IN")}
                  </p>
                </div>

                {/* Hairline Separator */}
                <div className="my-2.5 h-px w-full bg-aube-hairline/80" />

                {/* Sillage & Olfactive Atmosphere Paragraph */}
                <p className="font-body line-clamp-2 text-xs font-light leading-relaxed text-aube-text text-pretty">
                  {fragrance.atmosphere}
                </p>

                {fragrance.occasions && fragrance.occasions.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap items-center gap-1 pt-2 border-t border-aube-hairline/60">
                    <span className="mr-1 font-body text-[9px] uppercase tracking-[0.16em] text-aube-text-muted">
                      Occasions:
                    </span>
                    <span className="font-body text-[10px] uppercase tracking-[0.12em] text-aube-text/85">
                      {fragrance.occasions.slice(0, 4).join(" · ")}
                    </span>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Bottom Ledger Scroller Progress Line */}
        <div
          aria-hidden="true"
          className="relative mt-6 h-[1px] w-full overflow-hidden bg-aube-hairline"
        >
          <div
            className="absolute inset-y-0 left-0 bg-aube-text transition-transform duration-150 ease-out"
            style={{
              width: "25%",
              transform: `translateX(${scrollProgress * 300}%)`,
            }}
          />
        </div>
      </div>
    </section>
  );
}

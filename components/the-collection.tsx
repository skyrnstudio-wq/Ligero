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

export interface FragranceItem {
  name: string;
  slug: string;
  price: number;
  badge?: string;
  rating?: number;
  reviewCount?: number;
  concentration: string;
  atmosphere: string;
  family: string;
  notesSummary: string;
  image: string;
  notesImage: string;
}

const FRAGRANCES: FragranceItem[] = [
  {
    name: "Aubé",
    slug: "aube",
    price: 1099,
    badge: "EAU DE PARFUM",
    concentration: "EAU DE PARFUM · 50 ML",
    atmosphere:
      "Warm skin, citrus peel, first light. Wild mountain mint and water jasmine hydro-distilled before sunrise.",
    family: "Crisp Green Aquatic",
    notesSummary: "Wild Garden Mint · Water Jasmine · Green Cedar",
    image: "/images/perfumes/cutouts/aube.webp?v=2",
    notesImage: "/images/perfumes/notes/aube.webp",
  },
  {
    name: "Fleur",
    slug: "fleur",
    price: 1299,
    badge: "BEST-SELLER",
    concentration: "EAU DE PARFUM · 50 ML",
    atmosphere:
      "Jasmine, sambac, the courtyard after rain. Three million hand-harvested rose petals in silken musk.",
    family: "Velvet Floral Oriental",
    notesSummary: "Star Magnolia · Velvet Rose · Luxury Musk",
    image: "/images/perfumes/cutouts/fleur.webp?v=2",
    notesImage: "/images/perfumes/notes/fleur.webp",
  },
  {
    name: "Ambre Doux",
    slug: "ambre-doux",
    price: 1699,
    badge: "PRIVATE RESERVE",
    concentration: "EAU DE PARFUM · 50 ML",
    atmosphere:
      "Amber, tobacco leaf, a closing door. Crystalline tree resin and rich saffron stigmas cured one full year.",
    family: "Warm Amber Resin",
    notesSummary: "Saffron Threads · Amber Resin · Polished Cedar",
    image: "/images/perfumes/cutouts/ambre-doux.webp?v=2",
    notesImage: "/images/perfumes/notes/ambre-doux.webp",
  },
  {
    name: "Noctis",
    slug: "noctis",
    price: 1299,
    badge: "BEST-SELLER",
    concentration: "EAU DE PARFUM · 50 ML",
    atmosphere:
      "Smoke, leather, the hour after midnight. Damson plum and coastal grey ambergris over salt-cured driftwood.",
    family: "Smoked Oceanic Noir",
    notesSummary: "Dark Plum · Grey Ambergris · Sea Driftwood",
    image: "/images/perfumes/cutouts/noctis.webp?v=2",
    notesImage: "/images/perfumes/notes/noctis.webp",
  },
  {
    name: "Blanc",
    slug: "blanc",
    price: 1099,
    badge: "RESTOCKED",
    concentration: "EAU DE PARFUM · 50 ML",
    atmosphere:
      "Linen, iris, the pause before speech. Wild strawberry and rich vanilla melting into bare skin.",
    family: "Lactonic Gourmand Amber",
    notesSummary: "Wild Strawberry · Whipped Cream · Rich Vanilla",
    image: "/images/perfumes/cutouts/blanc.webp?v=2",
    notesImage: "/images/perfumes/notes/blanc.webp",
  },
  {
    name: "Marée",
    slug: "maree",
    price: 1699,
    badge: "SINGLE HARVEST",
    concentration: "EAU DE PARFUM · 50 ML",
    atmosphere:
      "Salt, kelp, the sea at dusk. Saline marine distillation and coastal rosemary cut at low tide.",
    family: "Oceanic Mineral Aromatic",
    notesSummary: "Saline Ocean Mist · Coastal Rosemary · Wild Vetiver",
    image: "/images/perfumes/cutouts/maree.webp?v=2",
    notesImage: "/images/perfumes/notes/maree.webp",
  },
  {
    name: "Noir Cacao",
    slug: "noir-cacao",
    price: 1599,
    badge: "ATELIER EDITION",
    concentration: "EAU DE PARFUM · 50 ML",
    atmosphere:
      "Coconut, toasted, at the last hour. Roasted cacao absolute and aged patchouli with sandalwood.",
    family: "Amber Gourmand Woody",
    notesSummary: "Raw Cacao 85% · Dark Chocolate · Rich Vanilla",
    image: "/images/perfumes/cutouts/noir-cacao.webp?v=2",
    notesImage: "/images/perfumes/notes/noir-cacao.webp",
  },
];

export default function TheCollection({ items }: { items?: FragranceItem[] }) {
  const fragranceList = items && items.length > 0 ? items : FRAGRANCES;
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
      volume: "50 ml · Eau de Parfum",
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
      className="relative overflow-hidden border-b border-aube-hairline bg-[#FAFAF7] py-16 sm:py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[104rem] px-4 sm:px-8 lg:px-12">
        {/* Serge Lutens-Inspired Compact Architectural Heading Stack */}
        <div className="mb-8 flex flex-col items-center text-center sm:mb-10">
          <div className="inline-block border-b border-aube-text pb-1.5">
            <h2
              id="collection-heading"
              className="font-display text-xl font-normal uppercase tracking-[0.24em] text-aube-text sm:text-2xl lg:text-[1.75rem]"
            >
              The Seven Perfumes
            </h2>
          </div>
          <p className="mt-2 font-body text-[11px] uppercase tracking-[0.18em] text-aube-text-muted">
            Eau de Parfum · Small-Batch Creations
          </p>

          {/* Minimalist Carousel Control Strip */}
          <div className="mt-4 flex w-full items-center justify-between border-b border-aube-hairline pb-3 text-xs">
            <span className="font-body text-[10px] uppercase tracking-[0.16em] text-aube-text-muted">
              Olfactive Ledger · 07 Flacons
            </span>

            <div className="flex items-center gap-3">
              <Link
                href="/collection"
                className="hidden font-body text-[10.5px] uppercase tracking-[0.18em] text-aube-text underline underline-offset-4 transition-colors hover:text-aube-accent sm:inline"
              >
                View Full Catalog
              </Link>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollByCard(-1)}
                  disabled={!canScrollPrev}
                  aria-label="Previous fragrances"
                  className="flex h-7 w-7 items-center justify-center border border-aube-hairline bg-[#F1F0EB] text-aube-text transition-colors hover:border-aube-text disabled:opacity-25 focus-visible:outline-2 focus-visible:outline-aube-text"
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
                  className="flex h-7 w-7 items-center justify-center border border-aube-hairline bg-[#F1F0EB] text-aube-text transition-colors hover:border-aube-text disabled:opacity-25 focus-visible:outline-2 focus-visible:outline-aube-text"
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
          className="flex snap-x snap-mandatory overflow-x-auto border-t border-b border-aube-hairline divide-x divide-aube-hairline no-scrollbar focus-visible:outline-1 focus-visible:outline-aube-text"
        >
          {fragranceList.map((fragrance, index) => {
            const isTouchRevealed = revealedSlug === fragrance.slug;
            const isAdded = addedSlug === fragrance.slug;

            return (
              <article
                key={fragrance.slug}
                data-ledger-column
                className="group relative flex w-[78vw] shrink-0 snap-start flex-col bg-transparent p-5 transition-colors duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-black/[0.015] sm:w-[44vw] sm:p-6 md:w-[32vw] lg:w-1/3 lg:p-7"
              >
                {/* Generous Flacon Plinth + Top-to-Down Ingredient Curtain Reveal */}
                <div className="relative h-[310px] w-full overflow-hidden bg-transparent transition-all duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] sm:h-[360px] md:h-[400px] lg:h-[440px]">
                  <Link
                    href={`/collection/${fragrance.slug}`}
                    aria-label={`Inspect ${fragrance.name}, 50 ml Extrait de Parfum`}
                    className="relative block h-full w-full focus-visible:outline-2 focus-visible:outline-aube-text"
                  >
                    {/* Layer 1 (Base): Front-Facing Perfume Flacon with Grounding Plinth & Studio Cast Shadow */}
                    <div className="relative z-10 flex h-full w-full items-center justify-center">
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute bottom-5 left-1/2 h-4.5 w-[46%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(28,20,14,0.30)_0%,rgba(28,20,14,0.12)_52%,transparent_78%)] blur-[3px] transition-all duration-700 group-hover:scale-x-95 group-hover:opacity-60"
                      />
                      <div className="relative h-[86%] w-[86%]">
                        <Image
                          src={fragrance.image}
                          alt={`${fragrance.name} 50 ml Extrait de Parfum`}
                          fill
                          priority={index < 3}
                          sizes="(max-width: 640px) 70vw, (max-width: 1024px) 38vw, 28vw"
                          className="object-contain p-5 [filter:drop-shadow(-14px_20px_22px_rgba(28,20,14,0.25))_drop-shadow(0_8px_12px_rgba(28,20,14,0.15))] sm:p-7 lg:p-8"
                        />
                      </div>
                    </div>

                    {/* Layer 2 (Curtain): Raw Botanicals — Pure Top-to-Down Reveal Over Bottle */}
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
                        sizes="(max-width: 640px) 78vw, (max-width: 1024px) 44vw, 33vw"
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
                  </Link>

                  {/* Touch reveal toggle pill (< lg) */}
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
                    className="absolute bottom-2 right-2 z-30 border border-aube-hairline bg-white/95 px-2 py-0.5 font-body text-[8.5px] uppercase tracking-[0.14em] text-aube-text shadow-sm lg:hidden"
                  >
                    {isTouchRevealed ? "Bottle" : "Ingredients"}
                  </button>
                </div>

                {/* Olfactory / Review & Acquire Action Row */}
                <div className="mt-3.5 flex items-center justify-between text-xs">
                  {typeof fragrance.rating === "number" &&
                  typeof fragrance.reviewCount === "number" &&
                  fragrance.reviewCount > 0 ? (
                    <Link
                      href={`/collection/${fragrance.slug}#reviews-section`}
                      aria-label={`${fragrance.name}: rated ${(fragrance.rating ?? 0).toFixed(1)} out of 5 stars based on ${fragrance.reviewCount} verified collector reviews`}
                      className="group/rating flex items-center gap-1.5 text-aube-text transition-opacity hover:opacity-75 focus-visible:outline-1 focus-visible:outline-aube-text"
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
                    className="group/btn inline-flex items-center gap-1.5 font-body text-[10.5px] uppercase tracking-[0.14em] text-aube-text transition-colors duration-500 hover:text-aube-accent focus-visible:outline-1 focus-visible:outline-aube-text"
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
                <div className="mt-2.5 flex items-baseline justify-between gap-2 border-t border-aube-hairline pt-2.5">
                  <div className="min-w-0">
                    <Link
                      href={`/collection/${fragrance.slug}`}
                      className="font-display text-base font-medium uppercase tracking-[0.16em] text-aube-text transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-aube-accent focus-visible:outline-1 focus-visible:outline-aube-text"
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

"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import SmartImage from "@/components/smart-image";
import { warmImage } from "@/lib/image-delivery";
import { useCase } from "@/context/case-context";
import { useCatalog } from "@/context/catalog-context";
import {
  getPerfumeCutoutImage,
  type Product,
  type HouseObject,
} from "@/lib/products";

export type CatalogCategory =
  | "all"
  | "edp"
  | "sets"
  | "fresh"
  | "floral"
  | "amber"
  | "gourmand";

export type SortOption =
  | "featured"
  | "bestsellers"
  | "price-asc"
  | "price-desc"
  | "alpha";

interface CatalogItem {
  id: string;
  slug: string;
  href: string;
  name: string;
  typeLabel: string;
  notesLine: string;
  price: number;
  compareAtPrice?: number;
  volume: string;
  primaryImage: string;
  isPhotoCard?: boolean;
  badge?: string;
  badgeVariant?: "solid" | "outline";
  categories: CatalogCategory[];
  occasions?: string[];
  featuredRank: number;
  bestsellerRank: number;
}

const FILTER_TABS: { id: CatalogCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "edp", label: "Eau de Parfum" },
  { id: "sets", label: "Discovery & Objects" },
  { id: "fresh", label: "Fresh & Marine" },
  { id: "floral", label: "Floral" },
  { id: "amber", label: "Amber & Woods" },
  { id: "gourmand", label: "Gourmand & Noir" },
];

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "bestsellers", label: "Best Sellers" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "alpha", label: "Alphabetical (A–Z)" },
];

const PERFUME_CATALOG_META: Record<
  string,
  {
    notesLine: string;
    badge?: string;
    badgeVariant?: "solid" | "outline";
    categories: CatalogCategory[];
    featuredRank: number;
    bestsellerRank: number;
  }
> = {
  aube: {
    notesLine: "crisp mint, water jasmine, green cedar",
    badge: "Best Seller",
    badgeVariant: "solid",
    categories: ["all", "edp", "fresh"],
    featuredRank: 1,
    bestsellerRank: 2,
  },
  fleur: {
    notesLine: "star magnolia, velvet rose, luxury musk",
    categories: ["all", "edp", "floral"],
    featuredRank: 2,
    bestsellerRank: 3,
  },
  noctis: {
    notesLine: "dark plum, coastal grey amber, sea driftwood",
    categories: ["all", "edp", "amber", "gourmand"],
    featuredRank: 3,
    bestsellerRank: 4,
  },
  blanc: {
    notesLine: "wild strawberry, whipped cream, rich vanilla",
    categories: ["all", "edp", "gourmand"],
    featuredRank: 4,
    bestsellerRank: 8,
  },
  "ambre-doux": {
    notesLine: "saffron threads, crystalline amber, silken woods",
    badge: "Best Seller",
    badgeVariant: "solid",
    categories: ["all", "edp", "amber"],
    featuredRank: 5,
    bestsellerRank: 5,
  },
  maree: {
    notesLine: "saline marine accord, wild rosemary, mineral woods",
    categories: ["all", "edp", "fresh"],
    featuredRank: 6,
    bestsellerRank: 7,
  },
  "noir-cacao": {
    notesLine: "raw cacao 85%, dark chocolate, smoked patchouli",
    badge: "New",
    badgeVariant: "solid",
    categories: ["all", "edp", "gourmand", "amber"],
    featuredRank: 7,
    bestsellerRank: 6,
  },
};

function derivePerfumeCategories(p: Product): CatalogCategory[] {
  const cats = new Set<CatalogCategory>(["all", "edp"]);
  const text = `${p.scentProfile?.family || ""} ${p.notesUppercase || ""} ${p.scentProfile?.top || ""} ${p.scentProfile?.heart || ""} ${p.scentProfile?.base || ""}`.toLowerCase();
  if (/fresh|mint|marine|aquatic|green|citrus|bergamot|sea|neroli/.test(text)) {
    cats.add("fresh");
  }
  if (/floral|rose|jasmine|magnolia|neroli|tuberose|iris|bloom/.test(text)) {
    cats.add("floral");
  }
  if (/amber|wood|cedar|sandal|oud|musk|vetiver|incense|saffron/.test(text)) {
    cats.add("amber");
  }
  if (/gourmand|cacao|chocolate|vanilla|plum|cream|caramel|honey|noir/.test(text)) {
    cats.add("gourmand");
  }
  return Array.from(cats);
}

/**
 * Builds the maison catalog dynamically from Sanity perfumes and house objects,
 * keeping curated ranks/metadata for the 7 signature creations while including
 * any newly added Sanity perfumes or house objects automatically.
 */
function buildCatalogItems(
  perfumes: Product[],
  objects: HouseObject[]
): CatalogItem[] {
  let nextRank = 10;

  const perfumeItems: CatalogItem[] = perfumes.map((p) => {
    const meta = PERFUME_CATALOG_META[p.slug];
    const fallbackNotes = (p.notesUppercase || p.scentProfile?.top || p.oneLiner || "")
      .toLowerCase()
      .replace(/\s*·\s*/g, ", ");

    const featuredRank = meta?.featuredRank ?? nextRank++;
    const bestsellerRank = meta?.bestsellerRank ?? featuredRank + 10;
    const rawBadge = p.badge && !/extrait|eau de parfum/i.test(p.badge) ? p.badge : undefined;
    const badge = rawBadge || meta?.badge;

    return {
      id: p.slug,
      slug: p.slug,
      href: `/collection/${p.slug}`,
      name: p.name,
      typeLabel: "Eau de Parfum",
      notesLine: meta?.notesLine || fallbackNotes,
      price: p.price,
      volume: p.volume || "50 ml · Eau de Parfum",
      primaryImage: getPerfumeCutoutImage(p),
      badge,
      badgeVariant: badge ? (meta?.badgeVariant ?? "solid") : undefined,
      categories: meta?.categories ?? derivePerfumeCategories(p),
      occasions: p.occasions,
      featuredRank,
      bestsellerRank,
    };
  });

  const objectItems: CatalogItem[] = objects.map((o, index) => {
    if (o.slug === "discovery-set") {
      return {
        id: o.slug,
        slug: o.slug,
        href: "/discovery-set",
        name: o.name,
        typeLabel: o.volume ? `Coffret · ${o.volume}` : "Coffret · 7 × 10 ml",
        notesLine:
          o.description.toLowerCase().replace(/\.$/, "") ||
          "every perfume the house makes, ten millilitres each",
        price: o.price,
        compareAtPrice: 1399,
        volume: o.volume ? `${o.volume} Coffret` : "7 × 10 ml Coffret",
        primaryImage: o.image || "/images/objects/discovery-set-floating.webp",
        isPhotoCard: false,
        badge: o.badge && !/redeemable/i.test(o.badge) ? o.badge : undefined,
        badgeVariant: "outline",
        categories: ["all", "sets"],
        occasions: o.occasions,
        featuredRank: 100 + index,
        bestsellerRank: 1,
      };
    }

    if (o.slug === "en-route") {
      return {
        id: o.slug,
        slug: o.slug,
        href: "/objects/en-route",
        name: o.name,
        typeLabel: "Car Perfume · Cabin Diffuser",
        notesLine: "cedarwood, crisp bergamot, sun-warmed amber",
        price: o.price,
        volume: o.volume || "Car Perfume · Cabin Diffuser",
        primaryImage: o.image || "/images/objects/car-perfume-floating.webp",
        isPhotoCard: false,
        badge: o.badge || "Car Perfume",
        badgeVariant: "outline",
        categories: ["all", "sets", "amber", "fresh"],
        occasions: o.occasions,
        featuredRank: 100 + index,
        bestsellerRank: 9,
      };
    }

    return {
      id: o.slug,
      slug: o.slug,
      href: `/objects#${o.slug}`,
      name: o.name,
      typeLabel: o.volume || "House Object",
      notesLine: o.description.toLowerCase().replace(/\.$/, ""),
      price: o.price,
      volume: o.volume || "House Object",
      primaryImage: o.image,
      isPhotoCard: false,
      badge: o.badge || "House Object",
      badgeVariant: "outline",
      categories: ["all", "sets"],
      occasions: o.occasions,
      featuredRank: 100 + index,
      bestsellerRank: 100 + index,
    };
  });

  return [...perfumeItems, ...objectItems];
}

export default function CollectionCatalog({
  perfumes,
  objects,
}: {
  perfumes: Product[];
  objects?: HouseObject[];
}) {
  const { addToCase, setIsCaseOpen } = useCase();
  const catalog = useCatalog();
  const liveObjects = objects && objects.length > 0 ? objects : catalog.objects;
  const [activeCategory, setActiveCategory] = useState<CatalogCategory>("all");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);
  const sortRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sortMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSortMenuOpen(false);
    };
    const onPointerDown = (e: globalThis.MouseEvent | TouchEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [sortMenuOpen]);

  const allItems = useMemo(
    () => buildCatalogItems(perfumes, liveObjects),
    [perfumes, liveObjects]
  );

  const filteredItems = useMemo(() => {
    const base = allItems.filter((item) =>
      item.categories.includes(activeCategory)
    );
    const copy = [...base];
    switch (sortBy) {
      case "bestsellers":
        copy.sort((a, b) => a.bestsellerRank - b.bestsellerRank);
        break;
      case "price-asc":
        copy.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        copy.sort((a, b) => b.price - a.price);
        break;
      case "alpha":
        copy.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "featured":
      default:
        copy.sort((a, b) => a.featuredRank - b.featuredRank);
        break;
    }
    return copy;
  }, [allItems, activeCategory, sortBy]);

  const handleQuickAdd = (
    e: MouseEvent,
    item: CatalogItem,
    customOption?: { volume: string; price: number; nameSuffix?: string }
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const volume = customOption ? customOption.volume : item.volume;
    const price = customOption ? customOption.price : item.price;
    const name = customOption?.nameSuffix
      ? `${item.name} (${customOption.nameSuffix})`
      : item.name;

    addToCase({
      slug: item.slug,
      name,
      price,
      volume,
      image: item.primaryImage,
    });
    setAddedId(item.id);
    setIsCaseOpen(true);
    window.setTimeout(() => {
      setAddedId((curr) => (curr === item.id ? null : curr));
    }, 1500);
  };

  const renderProductCard = (item: CatalogItem, index: number) => {
    const isAdded = addedId === item.id;
    const isSingleBottle = !item.isPhotoCard;

    return (
      <article
        key={item.id}
        className="group relative flex flex-col justify-between transition-colors duration-300"
      >
        {/* Compact Square Image Surface (Cutout BG Removed) */}
        <div className="relative aspect-[1/1] w-full overflow-hidden bg-transparent">
          {/* Minimal badge (e.g., NEW, BEST SELLER, SAVE ₹400) */}
          {item.badge && (
            <div className="pointer-events-none absolute left-2.5 top-2.5 z-20">
              {item.badgeVariant === "outline" ? (
                <span className="inline-block border border-[#1c140e]/60 bg-[#FBF8F2]/90 px-2 py-0.5 font-body text-[8.5px] font-medium uppercase tracking-[0.16em] text-[#1c140e]">
                  {item.badge}
                </span>
              ) : (
                <span className="inline-block bg-[#1c140e] px-2 py-0.5 font-body text-[8.5px] font-medium uppercase tracking-[0.16em] text-[#f3ede3]">
                  {item.badge}
                </span>
              )}
            </div>
          )}

          <Link
            href={item.href}
            aria-label={`${item.name} — ${item.typeLabel}, ₹${item.price.toLocaleString("en-IN")}`}
            onPointerEnter={() => warmImage(item.primaryImage, window.innerWidth <= 640 ? 220 : 275, 82)}
            onTouchStart={() => warmImage(item.primaryImage, window.innerWidth <= 640 ? 220 : 275, 82)}
            className="relative flex h-full w-full items-center justify-center p-4 pb-12 sm:p-7 [@media(hover:none)]:pb-12 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#1c140e]"
          >
            {/* Clean Upright Flacon Cutout with instant grounded studio plinth & desktop drop shadow */}
            <div className="relative h-full w-full max-w-[150px] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:scale-[1.03]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-1/2 h-3.5 w-[58%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(28,20,14,0.24)_0%,rgba(28,20,14,0.09)_52%,transparent_76%)]"
              />
              <SmartImage
                src={item.primaryImage}
                alt={`${item.name} ${item.typeLabel}`}
                fill
                priority={index < 2}
                fetchPriority={index < 2 ? "high" : undefined}
                loading={index < 2 ? undefined : "lazy"}
                quality={78}
                sizes="150px"
                className="object-contain object-center md:[filter:drop-shadow(-10px_14px_16px_rgba(28,20,14,0.18))]"
              />
            </div>
          </Link>

          {/* Hover / Touch Quick-Add Bar */}
          <div className="hover-reveal-touch absolute inset-x-1.5 bottom-1.5 z-20 flex translate-y-2 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 sm:inset-x-2 sm:bottom-2">
            {isSingleBottle && item.id !== "discovery-set" && item.id !== "en-route" ? (
              <>
                <button
                  type="button"
                  onClick={(e) => handleQuickAdd(e, item)}
                  className="flex min-h-11 w-full items-center justify-between bg-[#1c140e] px-3 py-2 text-[9.5px] font-medium uppercase tracking-[0.14em] text-[#f3ede3] shadow-md transition-colors hover:bg-[#32241b] sm:hidden"
                >
                  <span>50 ml</span>
                  <span className="text-[#d89f68]">
                    {isAdded ? "Added" : "+ Add"}
                  </span>
                </button>
                <div className="hidden w-full grid-cols-2 divide-x divide-[#f3ede3]/20 bg-[#1c140e] text-[#f3ede3] shadow-md sm:grid">
                  <button
                    type="button"
                    onClick={(e) =>
                      handleQuickAdd(e, item, {
                        volume: "50 ml · Eau de Parfum",
                        price: item.price,
                      })
                    }
                    className="flex min-h-11 flex-col items-center justify-center px-2 py-2 text-center transition-colors hover:bg-[#32241b]"
                  >
                    <span className="text-[9px] font-medium uppercase tracking-[0.14em]">
                      50 ml · ₹{item.price.toLocaleString("en-IN")}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleQuickAdd(e, item)}
                    className="flex min-h-11 items-center justify-center px-2 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#d89f68] transition-colors hover:bg-[#32241b]"
                  >
                    {isAdded ? "Added" : "+ Add to Case"}
                  </button>
                </div>
              </>
            ) : (
              <button
                type="button"
                onClick={(e) => handleQuickAdd(e, item)}
                className="flex min-h-11 w-full items-center justify-between bg-[#1c140e] px-3 py-2 text-[9.5px] font-medium uppercase tracking-[0.14em] text-[#f3ede3] shadow-md transition-colors hover:bg-[#32241b] sm:px-3.5 sm:tracking-[0.18em]"
              >
                <span className="truncate">{item.volume}</span>
                <span className="shrink-0 pl-2 text-[#d89f68]">
                  {isAdded
                    ? "Added"
                    : `+ Add · ₹${item.price.toLocaleString("en-IN")}`}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Compact Centered Editorial Caption */}
        <div className="flex flex-1 flex-col items-center justify-between px-2 pb-4 pt-2.5 text-center sm:px-3 sm:pb-5 sm:pt-3.5">
          <div className="flex flex-col items-center">
            <p className="font-body text-[8.5px] uppercase tracking-[0.2em] text-aube-text-muted">
              {item.typeLabel}
            </p>

            <h3 className="mt-0.5 font-body text-xs font-semibold uppercase tracking-[0.16em] text-[#1c140e] sm:text-[13px]">
              <Link
                href={item.href}
                className="inline-flex min-h-11 items-center px-1 transition-colors hover:text-aube-accent"
              >
                {item.name}
              </Link>
            </h3>

            <p className="mt-1 max-w-[26ch] font-body text-[11px] leading-snug text-aube-text-muted">
              {item.notesLine}
            </p>
            {item.occasions && item.occasions.length > 0 && (
              <p className="mt-1 font-body text-[9.5px] uppercase tracking-[0.14em] text-[#8C5A32]">
                {item.occasions.slice(0, 3).join(" · ")}
              </p>
            )}
          </div>

          <div className="mt-2 flex items-center justify-center gap-2 font-body text-xs tabular-nums">
            {item.compareAtPrice && (
              <span className="text-aube-text-muted/70 line-through">
                ₹{item.compareAtPrice.toLocaleString("en-IN")}
              </span>
            )}
            <span
              className={
                item.compareAtPrice
                  ? "font-medium text-[#8C2D19]"
                  : "text-[#1c140e]"
              }
            >
              ₹{item.price.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div>
      {/* Sticky Filter & Sort Sub-bar */}
      <div className="sticky top-[var(--sticky-top,var(--header-offset))] z-30 border-y border-aube-hairline bg-[#FBF8F2]/95 backdrop-blur-md transition-[top] duration-300">
        <div className="mx-auto flex max-w-[112rem] flex-wrap items-center justify-between gap-2 px-4 py-1.5 sm:gap-3 sm:px-8 sm:py-2.5 lg:px-14">
          {/* Left: Count / Filter status */}
          <div className="flex items-center gap-3">
            <span className="font-body text-[10px] font-medium uppercase tracking-[0.2em] text-[#1c140e]">
              Filter
            </span>
            <span aria-hidden="true" className="h-3 w-px bg-aube-hairline" />
            <span className="font-body text-[10px] uppercase tracking-[0.16em] text-aube-text-muted tabular-nums">
              {filteredItems.length}{" "}
              {filteredItems.length === 1 ? "Creation" : "Creations"}
            </span>
          </div>

          {/* Center: Horizontal Category Filter Tabs */}
          <nav
            aria-label="Filter collection by olfactive family or format"
            className="order-3 flex w-full items-center gap-4 overflow-x-auto border-t border-aube-hairline/60 pt-1 no-scrollbar touch-pan-x sm:gap-5 lg:order-2 lg:w-auto lg:border-t-0 lg:pt-0"
          >
            {FILTER_TABS.map((tab) => {
              const active = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id)}
                  aria-pressed={active}
                  className={`inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center whitespace-nowrap px-1 font-body text-[10px] uppercase tracking-[0.18em] transition-colors ${
                    active
                      ? "border-b-2 border-[#1c140e] font-semibold text-[#1c140e]"
                      : "text-aube-text-muted hover:text-[#1c140e]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Right: Sort By Dropdown */}
          <div ref={sortRef} className="relative order-2 lg:order-3">
            <button
              type="button"
              onClick={() => setSortMenuOpen((prev) => !prev)}
              aria-expanded={sortMenuOpen}
              aria-haspopup="listbox"
              className="inline-flex min-h-11 min-w-11 items-center gap-1.5 px-1 font-body text-[10px] font-medium uppercase tracking-[0.2em] text-[#1c140e] transition-colors hover:text-aube-accent"
            >
              <span>
                Sort By:{" "}
                <span className="font-normal text-aube-text-muted">
                  {SORT_OPTIONS.find((s) => s.id === sortBy)?.label}
                </span>
              </span>
              <span aria-hidden="true" className="text-xs leading-none">
                {sortMenuOpen ? "−" : "+"}
              </span>
            </button>

            {sortMenuOpen && (
              <ul
                role="listbox"
                aria-label="Sort products"
                className="absolute right-0 top-full z-40 mt-2 w-48 border border-aube-hairline bg-[#FBF8F2] py-1.5 shadow-lg"
              >
                {SORT_OPTIONS.map((option) => (
                  <li key={option.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={sortBy === option.id}
                      onClick={() => {
                        setSortBy(option.id);
                        setSortMenuOpen(false);
                      }}
                      className={`flex min-h-11 w-full items-center justify-between px-3.5 py-2.5 text-left font-body text-[10.5px] uppercase tracking-[0.15em] transition-colors hover:bg-[#F3EDE3] ${
                        sortBy === option.id
                          ? "font-semibold text-[#1c140e]"
                          : "text-aube-text-muted"
                      }`}
                    >
                      <span>{option.label}</span>
                      {sortBy === option.id && (
                        <span aria-hidden="true">✓</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Clean Compact 3-Column / 4-Column Architectural Product Grid */}
      <section
        aria-labelledby="catalog-grid-heading"
        className="mx-auto max-w-[112rem] px-4 pt-6 pb-20 sm:px-8 sm:pt-8 lg:px-14"
      >
        <h2 id="catalog-grid-heading" className="sr-only">
          Perfumes and Scented Objects
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item, idx) => renderProductCard(item, idx))}
        </div>
      </section>
    </div>
  );
}

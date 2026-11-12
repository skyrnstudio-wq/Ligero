"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type MouseEvent } from "react";
import { useCase } from "@/context/case-context";
import type { Product } from "@/lib/products";

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

/**
 * Builds the authentic maison catalog:
 * The 7 Eau de Parfum creations + The Discovery Set + En Route (Car Perfume).
 * Zero duplicates, zero fake duos.
 */
function buildCatalogItems(perfumes: Product[]): CatalogItem[] {
  const bySlug = new Map(perfumes.map((p) => [p.slug, p]));

  const getPerfume = (slug: string) => bySlug.get(slug) ?? perfumes[0];

  const aube = getPerfume("aube");
  const fleur = getPerfume("fleur");
  const noctis = getPerfume("noctis");
  const ambreDoux = getPerfume("ambre-doux");
  const blanc = getPerfume("blanc");
  const maree = getPerfume("maree");
  const noirCacao = getPerfume("noir-cacao");

  return [
    {
      id: "aube",
      slug: aube.slug,
      href: `/collection/${aube.slug}`,
      name: aube.name,
      typeLabel: "Eau de Parfum",
      notesLine: "crisp mint, water jasmine, green cedar",
      price: aube.price,
      volume: "50 ml · Eau de Parfum",
      primaryImage: `/images/perfumes/cutouts/${aube.slug}.webp?v=2`,
      badge: "Best Seller",
      badgeVariant: "solid",
      categories: ["all", "edp", "fresh"],
      featuredRank: 1,
      bestsellerRank: 2,
    },
    {
      id: "fleur",
      slug: fleur.slug,
      href: `/collection/${fleur.slug}`,
      name: fleur.name,
      typeLabel: "Eau de Parfum",
      notesLine: "star magnolia, velvet rose, luxury musk",
      price: fleur.price,
      volume: "50 ml · Eau de Parfum",
      primaryImage: `/images/perfumes/cutouts/${fleur.slug}.webp?v=2`,
      categories: ["all", "edp", "floral"],
      featuredRank: 2,
      bestsellerRank: 3,
    },
    {
      id: "noctis",
      slug: noctis.slug,
      href: `/collection/${noctis.slug}`,
      name: noctis.name,
      typeLabel: "Eau de Parfum",
      notesLine: "dark plum, coastal grey amber, sea driftwood",
      price: noctis.price,
      volume: "50 ml · Eau de Parfum",
      primaryImage: `/images/perfumes/cutouts/${noctis.slug}.webp?v=2`,
      categories: ["all", "edp", "amber", "gourmand"],
      featuredRank: 3,
      bestsellerRank: 4,
    },
    {
      id: "blanc",
      slug: blanc.slug,
      href: `/collection/${blanc.slug}`,
      name: blanc.name,
      typeLabel: "Eau de Parfum",
      notesLine: "wild strawberry, whipped cream, rich vanilla",
      price: blanc.price,
      volume: "50 ml · Eau de Parfum",
      primaryImage: `/images/perfumes/cutouts/${blanc.slug}.webp?v=2`,
      categories: ["all", "edp", "gourmand"],
      featuredRank: 4,
      bestsellerRank: 8,
    },
    {
      id: "ambre-doux",
      slug: ambreDoux.slug,
      href: `/collection/${ambreDoux.slug}`,
      name: ambreDoux.name,
      typeLabel: "Eau de Parfum",
      notesLine: "saffron threads, crystalline amber, silken woods",
      price: ambreDoux.price,
      volume: "50 ml · Eau de Parfum",
      primaryImage: `/images/perfumes/cutouts/${ambreDoux.slug}.webp?v=2`,
      badge: "Best Seller",
      badgeVariant: "solid",
      categories: ["all", "edp", "amber"],
      featuredRank: 5,
      bestsellerRank: 5,
    },
    {
      id: "maree",
      slug: maree.slug,
      href: `/collection/${maree.slug}`,
      name: maree.name,
      typeLabel: "Eau de Parfum",
      notesLine: "saline marine accord, wild rosemary, mineral woods",
      price: maree.price,
      volume: "50 ml · Eau de Parfum",
      primaryImage: `/images/perfumes/cutouts/${maree.slug}.webp?v=2`,
      categories: ["all", "edp", "fresh"],
      featuredRank: 6,
      bestsellerRank: 7,
    },
    {
      id: "noir-cacao",
      slug: noirCacao.slug,
      href: `/collection/${noirCacao.slug}`,
      name: noirCacao.name,
      typeLabel: "Eau de Parfum",
      notesLine: "raw cacao 85%, dark chocolate, smoked patchouli",
      price: noirCacao.price,
      volume: "50 ml · Eau de Parfum",
      primaryImage: `/images/perfumes/cutouts/${noirCacao.slug}.webp?v=2`,
      badge: "New",
      badgeVariant: "solid",
      categories: ["all", "edp", "gourmand", "amber"],
      featuredRank: 7,
      bestsellerRank: 6,
    },
    {
      id: "discovery-set",
      slug: "discovery-set",
      href: "/discovery-set",
      name: "The Discovery Set",
      typeLabel: "Coffret · 7 × 10 ml",
      notesLine: "every perfume the house makes, ten millilitres each",
      price: 999,
      compareAtPrice: 1399,
      volume: "7 × 10 ml Coffret",
      primaryImage: "/images/objects/discovery-set-floating.webp",
      isPhotoCard: false,
      badge: "Save ₹400",
      badgeVariant: "outline",
      categories: ["all", "sets"],
      featuredRank: 8,
      bestsellerRank: 1,
    },
    {
      id: "en-route",
      slug: "en-route",
      href: "/objects/en-route",
      name: "En Route",
      typeLabel: "Car Perfume · Cabin Diffuser",
      notesLine: "cedarwood, crisp bergamot, sun-warmed amber",
      price: 499,
      volume: "Car Perfume · Cabin Diffuser",
      primaryImage: "/images/objects/car-perfume-floating.webp",
      isPhotoCard: false,
      badge: "Car Perfume",
      badgeVariant: "outline",
      categories: ["all", "sets", "amber", "fresh"],
      featuredRank: 9,
      bestsellerRank: 9,
    },
  ];
}

export default function CollectionCatalog({
  perfumes,
}: {
  perfumes: Product[];
}) {
  const { addToCase, setIsCaseOpen } = useCase();
  const [activeCategory, setActiveCategory] = useState<CatalogCategory>("all");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);

  const allItems = useMemo(() => buildCatalogItems(perfumes), [perfumes]);

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
            className="relative flex h-full w-full items-center justify-center p-5 sm:p-7 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#1c140e]"
          >
            {/* Clean Upright Flacon Cutout with gentle natural drop shadow */}
            <div className="relative h-full w-full max-w-[150px] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:scale-[1.03]">
              <Image
                src={item.primaryImage}
                alt={`${item.name}`}
                fill
                priority={index < 4}
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
                className="object-contain object-center [filter:drop-shadow(-10px_14px_16px_rgba(28,20,14,0.18))_drop-shadow(0_4px_8px_rgba(28,20,14,0.10))]"
              />
            </div>
          </Link>

          {/* Hover Quick-Add Bar */}
          <div className="absolute inset-x-2 bottom-2 z-20 flex translate-y-2 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
            {isSingleBottle && item.id !== "discovery-set" && item.id !== "en-route" ? (
              <div className="grid w-full grid-cols-2 divide-x divide-[#f3ede3]/20 bg-[#1c140e] text-[#f3ede3] shadow-md">
                <button
                  type="button"
                  onClick={(e) =>
                    handleQuickAdd(e, item, {
                      volume: "50 ml · Eau de Parfum",
                      price: item.price,
                    })
                  }
                  className="flex flex-col items-center justify-center px-2 py-2 text-center transition-colors hover:bg-[#32241b]"
                >
                  <span className="text-[9px] font-medium uppercase tracking-[0.14em]">
                    50 ml · ₹{item.price.toLocaleString("en-IN")}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={(e) => handleQuickAdd(e, item)}
                  className="flex items-center justify-center px-2 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#d89f68] transition-colors hover:bg-[#32241b]"
                >
                  {isAdded ? "Added" : "+ Add to Case"}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={(e) => handleQuickAdd(e, item)}
                className="flex w-full items-center justify-between bg-[#1c140e] px-3.5 py-2 text-[9.5px] font-medium uppercase tracking-[0.18em] text-[#f3ede3] shadow-md transition-colors hover:bg-[#32241b]"
              >
                <span>{item.volume}</span>
                <span className="text-[#d89f68]">
                  {isAdded
                    ? "Added"
                    : `+ Add · ₹${item.price.toLocaleString("en-IN")}`}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Compact Centered Editorial Caption */}
        <div className="flex flex-1 flex-col items-center justify-between px-2.5 pb-4 pt-3 text-center sm:px-3 sm:pb-5 sm:pt-3.5">
          <div className="flex flex-col items-center">
            <p className="font-body text-[8.5px] uppercase tracking-[0.2em] text-aube-text-muted">
              {item.typeLabel}
            </p>

            <h2 className="mt-1 font-body text-xs font-semibold uppercase tracking-[0.16em] text-[#1c140e] sm:text-[13px]">
              <Link
                href={item.href}
                className="transition-colors hover:text-aube-accent"
              >
                {item.name}
              </Link>
            </h2>

            <p className="mt-1 max-w-[26ch] font-body text-[11px] leading-snug text-aube-text-muted">
              {item.notesLine}
            </p>
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
      <div className="sticky top-[var(--header-offset)] z-30 border-y border-aube-hairline bg-[#FBF8F2]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[112rem] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-8 lg:px-14">
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
            className="order-3 flex w-full items-center gap-5 overflow-x-auto border-t border-aube-hairline/60 pt-2.5 no-scrollbar lg:order-2 lg:w-auto lg:border-t-0 lg:pt-0"
          >
            {FILTER_TABS.map((tab) => {
              const active = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id)}
                  aria-pressed={active}
                  className={`whitespace-nowrap pb-0.5 font-body text-[10px] uppercase tracking-[0.18em] transition-colors ${
                    active
                      ? "border-b border-[#1c140e] font-semibold text-[#1c140e]"
                      : "text-aube-text-muted hover:text-[#1c140e]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Right: Sort By Dropdown */}
          <div className="relative order-2 lg:order-3">
            <button
              type="button"
              onClick={() => setSortMenuOpen((prev) => !prev)}
              aria-expanded={sortMenuOpen}
              aria-haspopup="listbox"
              className="inline-flex items-center gap-1.5 font-body text-[10px] font-medium uppercase tracking-[0.2em] text-[#1c140e] transition-colors hover:text-aube-accent"
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
                      className={`flex w-full items-center justify-between px-3.5 py-2 text-left font-body text-[10.5px] uppercase tracking-[0.15em] transition-colors hover:bg-[#F3EDE3] ${
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
        aria-label="Perfume catalog"
        className="mx-auto max-w-[112rem] px-4 pt-6 pb-20 sm:px-8 sm:pt-8 lg:px-14"
      >
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item, idx) => renderProductCard(item, idx))}
        </div>
      </section>
    </div>
  );
}

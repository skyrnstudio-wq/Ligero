"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCase } from "@/context/case-context";
import { useCatalog } from "@/context/catalog-context";
import type { HouseObject } from "@/lib/products";

export const DISCOVERY_FLOATING_IMAGE =
  "/images/objects/discovery-set-floating.webp";
export const EN_ROUTE_FLOATING_IMAGE =
  "/images/objects/car-perfume-floating.webp";

// Distinct luxury backgrounds for each object
export const DISCOVERY_BG_IMAGE =
  "/images/objects/travertine-raw-silk-bg.webp"; // Warm Roman Travertine & Raw Silk
export const EN_ROUTE_BG_IMAGE =
  "/images/objects/en-route-oak-linen-bg.webp"; // Pale European Oak & Oatmeal Flax Linen

/**
 * Objects of Scent — Two-column presentation for The Discovery Set & En Route Car Perfume.
 * Pairs both house objects side-by-side on desktop (md:grid-cols-2).
 * - Discovery Set: Honed Roman Travertine Stone & Raw Silk background.
 * - En Route: Pale European White Oak & Oatmeal Flax Linen background.
 * - Font: Cormorant Garamond display serif (font-display) across both headings.
 */
export default function ObjectsDuo({ objects }: { objects?: HouseObject[] }) {
  const { addToCase, setIsCaseOpen } = useCase();
  const catalog = useCatalog();
  const list = objects && objects.length > 0 ? objects : catalog.objects;
  const discovery = list.find((o) => o.slug === "discovery-set");
  const enRoute = list.find((o) => o.slug === "en-route");

  const discoveryName = discovery?.name || "The Discovery Set";
  const discoveryPrice = discovery?.price ?? 999;
  const discoveryVolume = discovery?.volume || "7 × 10 ml";
  const discoveryImage = discovery?.image || DISCOVERY_FLOATING_IMAGE;
  const discoveryDescription =
    discovery?.description &&
    discovery.description !== "Every perfume the house makes, ten millilitres each."
      ? discovery.description
      : "Seven perfumes, ten millilitres each. The way in before you choose one.";

  const enRouteName = enRoute?.name || "En Route";
  const enRoutePrice = enRoute?.price ?? 499;
  const enRouteVolume = enRoute?.volume || "Cabin Diffuser";
  const enRouteImage = enRoute?.image || EN_ROUTE_FLOATING_IMAGE;
  const enRouteDescription =
    enRoute?.description && enRoute.description !== "For the drive."
      ? enRoute.description
      : "Cedarwood and dried bergamot peel, hung where you drive.";

  const [discoveryAdded, setDiscoveryAdded] = useState(false);
  const [enRouteAdded, setEnRouteAdded] = useState(false);

  const handleOrderDiscovery = () => {
    addToCase({
      slug: "discovery-set",
      name: discoveryName,
      price: discoveryPrice,
      volume: discoveryVolume,
      image: discoveryImage,
    });
    setDiscoveryAdded(true);
    setIsCaseOpen(true);
    window.setTimeout(() => setDiscoveryAdded(false), 1800);
  };

  const handleOrderEnRoute = () => {
    addToCase({
      slug: "en-route",
      name: enRouteName,
      price: enRoutePrice,
      volume: enRouteVolume.includes("Car Perfume")
        ? enRouteVolume
        : `Car Perfume · ${enRouteVolume}`,
      image: enRouteImage,
    });
    setEnRouteAdded(true);
    setIsCaseOpen(true);
    window.setTimeout(() => setEnRouteAdded(false), 1800);
  };

  return (
    <section
      id="objects-of-scent"
      aria-label="Objects of Scent"
      className="relative overflow-hidden border-b border-aube-hairline bg-aube-base py-6 md:py-0"
    >
      <div className="mx-auto flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 no-scrollbar touch-pan-x md:grid md:max-w-[108rem] md:grid-cols-2 md:gap-0 md:divide-x md:divide-aube-hairline md:overflow-visible md:px-0">
        {/* Column 1: The Discovery Set */}
        <article
          id="discovery-set"
          aria-labelledby="discovery-set-heading"
          className="relative flex w-[84vw] shrink-0 snap-start flex-col justify-between overflow-hidden border border-aube-hairline bg-[#F7F2E9] md:w-auto md:border-0 md:bg-transparent"
        >
          {/* Background 1: Roman Travertine & Raw Silk (Desktop/Tablet) */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 hidden md:block">
            <Image
              src={DISCOVERY_BG_IMAGE}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center opacity-70"
            />
            {/* Luminous Warm Silk Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#FBF8F2]/50 via-[#F7F2E9]/65 to-[#F3EDE3]/90" />
          </div>

          {/* Foreground Content */}
          <div className="relative z-10 flex h-full flex-col justify-between">
            {/* Product Cutout Surface */}
            <Link
              href="/discovery-set"
              aria-label="Explore The Discovery Set, seven 10 ml vials"
              className="group relative flex h-[200px] w-full items-center justify-center sm:h-[320px] md:h-[420px] lg:h-[460px] xl:h-[500px]"
            >
              <Image
                src={discoveryImage}
                alt="Ligero Parfums Floating Signature Collection, seven 10 ml pocket perfume sprays: Aube, Maree, Blanc, Ambre Doux, Noctis, Fleur, and Noir Cacao"
                fill
                sizes="(max-width: 768px) 84vw, 50vw"
                className="relative z-10 object-contain object-center p-4 sm:p-8 lg:p-12 [filter:drop-shadow(0_20px_28px_rgba(28,20,14,0.22))_drop-shadow(0_6px_10px_rgba(28,20,14,0.12))] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
              />
            </Link>

            {/* Typographic & Order Panel */}
            <div className="flex flex-1 flex-col justify-between px-5 pb-6 pt-1 sm:px-8 sm:pb-12 md:px-8 md:pb-14 md:pt-2 lg:px-12 lg:pb-16 xl:px-16">
              <div>
                <h2
                  id="discovery-set-heading"
                  className="font-display text-3xl font-light leading-[1.05] tracking-[-0.01em] text-aube-text sm:text-5xl md:text-[2.85rem] lg:text-[3.75rem] xl:text-[4.25rem]"
                >
                  The
                  <span className="mt-1 block italic font-light text-aube-text">Discovery Set</span>
                </h2>

                <p className="mt-2.5 max-w-md font-body text-sm leading-relaxed text-aube-text/90 sm:mt-4 sm:text-base">
                  {discoveryDescription}
                </p>

                <p className="mt-2.5 font-body text-xs uppercase tracking-[0.18em] text-aube-text-muted sm:mt-3.5">
                  {discoveryVolume} · ₹{discoveryPrice.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 pt-1 sm:mt-8 sm:gap-x-8 sm:pt-2">
                <button
                  type="button"
                  onClick={handleOrderDiscovery}
                  className="min-h-11 bg-aube-text px-6 py-3 font-body text-[11px] font-medium uppercase tracking-[0.22em] text-aube-base shadow-sm transition-all duration-300 hover:bg-aube-accent active:scale-[0.98] sm:px-8 sm:py-3.5"
                >
                  {discoveryAdded ? "Added to Case" : "Shop 7 × 10 ml"}
                </button>

                <Link
                  href="/discovery-set"
                  className="inline-flex min-h-11 items-center border-b border-aube-accent py-2 font-body text-[11px] uppercase tracking-[0.22em] text-aube-text transition-colors hover:text-aube-accent"
                >
                  Explore the Coffret
                </Link>
              </div>
            </div>
          </div>
        </article>

        {/* Column 2: En Route Car Perfume */}
        <article
          id="car-perfume"
          aria-labelledby="car-perfume-heading"
          className="relative flex w-[84vw] shrink-0 snap-start flex-col justify-between overflow-hidden border border-aube-hairline bg-[#F7F2E9] md:w-auto md:border-0 md:bg-transparent"
        >
          {/* Background 2: Pale European Oak & Oatmeal Linen (Desktop/Tablet) */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 hidden md:block">
            <Image
              src={EN_ROUTE_BG_IMAGE}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center opacity-70"
            />
            {/* Luminous Warm Silk Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#FBF8F2]/50 via-[#F7F2E9]/65 to-[#F3EDE3]/90" />
          </div>

          {/* Foreground Content */}
          <div className="relative z-10 flex h-full flex-col justify-between">
            {/* Product Cutout Surface */}
            <Link
              href="/objects/en-route"
              aria-label="Explore En Route, Car Perfume Cabin Diffuser"
              className="group relative flex h-[200px] w-full items-center justify-center sm:h-[320px] md:h-[420px] lg:h-[460px] xl:h-[500px]"
            >
              <Image
                src={enRouteImage}
                alt="Ligero En Route Car Perfume, luxury diffuser flat-lay with cedarwood and dried bergamot peel"
                fill
                sizes="(max-width: 768px) 84vw, 50vw"
                className="relative z-10 object-contain object-center p-4 sm:p-8 lg:p-12 [filter:drop-shadow(0_18px_24px_rgba(28,20,14,0.18))] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
              />
            </Link>

            {/* Typographic & Order Panel */}
            <div className="flex flex-1 flex-col justify-between px-5 pb-6 pt-1 sm:px-8 sm:pb-12 md:px-8 md:pb-14 md:pt-2 lg:px-12 lg:pb-16 xl:px-16">
              <div>
                <h2
                  id="car-perfume-heading"
                  className="font-display text-3xl font-light leading-[1.05] tracking-[-0.01em] text-aube-text sm:text-5xl md:text-[2.85rem] lg:text-[3.75rem] xl:text-[4.25rem]"
                >
                  {enRouteName}
                  <span className="mt-1 block italic font-light text-aube-text">Car Perfume</span>
                </h2>

                <p className="mt-2.5 max-w-md font-body text-sm leading-relaxed text-aube-text/90 sm:mt-4 sm:text-base">
                  {enRouteDescription}
                </p>

                <p className="mt-2.5 font-body text-xs uppercase tracking-[0.18em] text-aube-text-muted sm:mt-3.5">
                  {enRouteVolume} · ₹{enRoutePrice.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 pt-1 sm:mt-8 sm:gap-x-8 sm:pt-2">
                <button
                  type="button"
                  onClick={handleOrderEnRoute}
                  className="min-h-11 bg-aube-text px-6 py-3 font-body text-[11px] font-medium uppercase tracking-[0.22em] text-aube-base shadow-sm transition-all duration-300 hover:bg-aube-accent active:scale-[0.98] sm:px-8 sm:py-3.5"
                >
                  {enRouteAdded ? "Added to Case" : "Shop En Route"}
                </button>

                <Link
                  href="/objects/en-route"
                  className="inline-flex min-h-11 items-center border-b border-aube-accent py-2 font-body text-[11px] uppercase tracking-[0.22em] text-aube-text transition-colors hover:text-aube-accent"
                >
                  Explore the Diffuser
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

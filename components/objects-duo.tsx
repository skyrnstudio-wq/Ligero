"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCase } from "@/context/case-context";

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
export default function ObjectsDuo() {
  const { addToCase, setIsCaseOpen } = useCase();
  const [discoveryAdded, setDiscoveryAdded] = useState(false);
  const [enRouteAdded, setEnRouteAdded] = useState(false);

  const handleOrderDiscovery = () => {
    addToCase({
      slug: "discovery-set",
      name: "The Discovery Set",
      price: 999,
      volume: "7 × 10 ml",
      image: DISCOVERY_FLOATING_IMAGE,
    });
    setDiscoveryAdded(true);
    setIsCaseOpen(true);
    window.setTimeout(() => setDiscoveryAdded(false), 1800);
  };

  const handleOrderEnRoute = () => {
    addToCase({
      slug: "en-route",
      name: "En Route",
      price: 499,
      volume: "Car Perfume · Cabin Diffuser",
      image: EN_ROUTE_FLOATING_IMAGE,
    });
    setEnRouteAdded(true);
    setIsCaseOpen(true);
    window.setTimeout(() => setEnRouteAdded(false), 1800);
  };

  return (
    <section
      id="objects-of-scent"
      aria-label="Objects of Scent"
      className="relative overflow-hidden border-b border-aube-hairline bg-aube-base"
    >
      <div className="mx-auto grid max-w-[108rem] grid-cols-1 divide-y divide-aube-hairline md:grid-cols-2 md:divide-x md:divide-y-0">
        {/* Column 1: The Discovery Set */}
        <article
          id="discovery-set"
          aria-labelledby="discovery-set-heading"
          className="relative flex flex-col justify-between overflow-hidden"
        >
          {/* Background 1: Roman Travertine & Raw Silk (Spans entire card) */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
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
              className="group relative flex h-[340px] w-full items-center justify-center sm:h-[400px] md:h-[420px] lg:h-[460px] xl:h-[500px]"
            >
              <Image
                src={DISCOVERY_FLOATING_IMAGE}
                alt="Ligero Parfums Floating Signature Collection, seven 10 ml pocket perfume sprays: Aube, Maree, Blanc, Ambre Doux, Noctis, Fleur, and Noir Cacao"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="relative z-10 object-contain object-center p-6 sm:p-8 lg:p-12 [filter:drop-shadow(0_20px_28px_rgba(28,20,14,0.22))_drop-shadow(0_6px_10px_rgba(28,20,14,0.12))] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
              />
            </Link>

            {/* Typographic & Order Panel */}
            <div className="flex flex-1 flex-col justify-between px-6 pb-12 pt-2 sm:px-8 sm:pb-14 md:px-8 md:pb-14 lg:px-12 lg:pb-16 xl:px-16">
              <div>
                <h2
                  id="discovery-set-heading"
                  className="font-display text-4xl font-light leading-[1.05] tracking-[-0.01em] text-aube-text sm:text-5xl md:text-[2.85rem] lg:text-[3.75rem] xl:text-[4.25rem]"
                >
                  The
                  <span className="mt-1 block italic font-light text-aube-text">Discovery Set</span>
                </h2>

                <p className="mt-4 max-w-md font-body text-sm leading-relaxed text-aube-text/90 sm:text-base">
                  Seven perfumes, ten millilitres each. The way in before you choose one.
                </p>

                <p className="mt-3.5 font-body text-xs uppercase tracking-[0.18em] text-aube-text-muted">
                  7 × 10 ml · ₹999
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 pt-2 sm:gap-x-8">
                <button
                  type="button"
                  onClick={handleOrderDiscovery}
                  className="bg-aube-text px-7 py-3.5 font-body text-[11px] font-medium uppercase tracking-[0.22em] text-aube-base shadow-sm transition-all duration-300 hover:bg-aube-accent active:scale-[0.98] sm:px-8"
                >
                  {discoveryAdded ? "Added to Case" : "Shop 7 × 10 ml"}
                </button>

                <Link
                  href="/discovery-set"
                  className="border-b border-aube-accent pb-1 font-body text-[11px] uppercase tracking-[0.22em] text-aube-text transition-colors hover:text-aube-accent"
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
          className="relative flex flex-col justify-between overflow-hidden"
        >
          {/* Background 2: Pale European Oak & Oatmeal Linen (Spans entire card) */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
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
              className="group relative flex h-[340px] w-full items-center justify-center sm:h-[400px] md:h-[420px] lg:h-[460px] xl:h-[500px]"
            >
              <Image
                src={EN_ROUTE_FLOATING_IMAGE}
                alt="Ligero En Route Car Perfume, luxury diffuser flat-lay with cedarwood and dried bergamot peel"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="relative z-10 object-contain object-center p-6 sm:p-8 lg:p-12 [filter:drop-shadow(0_18px_24px_rgba(28,20,14,0.18))] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
              />
            </Link>

            {/* Typographic & Order Panel */}
            <div className="flex flex-1 flex-col justify-between px-6 pb-12 pt-2 sm:px-8 sm:pb-14 md:px-8 md:pb-14 lg:px-12 lg:pb-16 xl:px-16">
              <div>
                <h2
                  id="car-perfume-heading"
                  className="font-display text-4xl font-light leading-[1.05] tracking-[-0.01em] text-aube-text sm:text-5xl md:text-[2.85rem] lg:text-[3.75rem] xl:text-[4.25rem]"
                >
                  En Route
                  <span className="mt-1 block italic font-light text-aube-text">Car Perfume</span>
                </h2>

                <p className="mt-4 max-w-md font-body text-sm leading-relaxed text-aube-text/90 sm:text-base">
                  Cedarwood and dried bergamot peel, hung where you drive.
                </p>

                <p className="mt-3.5 font-body text-xs uppercase tracking-[0.18em] text-aube-text-muted">
                  Cabin Diffuser · ₹499
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 pt-2 sm:gap-x-8">
                <button
                  type="button"
                  onClick={handleOrderEnRoute}
                  className="bg-aube-text px-8 py-3.5 font-body text-[11px] font-medium uppercase tracking-[0.22em] text-aube-base shadow-sm transition-all duration-300 hover:bg-aube-accent active:scale-[0.98]"
                >
                  {enRouteAdded ? "Added to Case" : "Shop En Route"}
                </button>

                <Link
                  href="/objects/en-route"
                  className="border-b border-aube-accent pb-1 font-body text-[11px] uppercase tracking-[0.22em] text-aube-text transition-colors hover:text-aube-accent"
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

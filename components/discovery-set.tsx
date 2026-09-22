"use client";

import Image from "next/image";
import { useCase } from "@/context/case-context";

const DISCOVERY_IMAGE = "/images/objects/discovery-set.webp";

/**
 * Home section: The Discovery Set (site-blueprint.md §10).
 * One wide row, shelf-not-shop. House tokens only: raw silk, Cormorant
 * display, espresso CTA. One CTA intent on the page: ordering the set.
 */
function useOrderDiscoverySet() {
  const { addToCase, setIsCaseOpen } = useCase();

  return () => {
    addToCase({
      slug: "discovery-set",
      name: "The Discovery Set",
      price: 999,
      volume: "7 × 10 ml",
      image: DISCOVERY_IMAGE,
    });
    setIsCaseOpen(true);
  };
}

/**
 * The one "order the set" action, shared by the home section and the
 * collection page band. Client component; adds to the case and opens it.
 */
export function OrderDiscoverySetButton({ className = "" }: { className?: string }) {
  const handleOrder = useOrderDiscoverySet();

  return (
    <button
      type="button"
      onClick={handleOrder}
      className={`border border-aube-text bg-aube-text px-8 py-3.5 text-xs uppercase tracking-[0.22em] text-aube-base transition-all hover:border-aube-accent hover:bg-aube-accent active:scale-[0.98] ${className}`}
    >
      Order the Discovery Set
    </button>
  );
}

export default function DiscoverySet() {

  return (
    <section
      aria-label="The Discovery Set"
      className="relative overflow-hidden bg-aube-surface border-y border-aube-hairline/70 py-16 sm:py-20 lg:py-28"
    >
      <div className="relative mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left column: the set, seated on its surface card per the light-theme rule */}
          <div className="relative lg:col-span-7">
            <div className="relative overflow-hidden border border-aube-hairline/70 bg-aube-base">
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={DISCOVERY_IMAGE}
                  alt="The Discovery Set presentation with seven ten-millilitre vials"
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover object-center"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Right column: name, one line, price in display type, one CTA */}
          <div className="flex flex-col items-start justify-center lg:col-span-5 lg:pl-4">
            <h2 className="font-display text-4xl font-light italic tracking-[-0.01em] text-aube-text sm:text-5xl">
              The Discovery Set
            </h2>

            <p className="mt-4 max-w-md text-base leading-relaxed text-aube-text-muted sm:text-lg">
              Every perfume the house makes, ten millilitres each. Seven vials, one box, rested ninety days.
            </p>

            <div className="mt-6 flex items-baseline gap-4">
              <span className="font-display text-3xl font-light text-aube-text">999</span>
              <span className="text-[11px] uppercase tracking-[0.18em] text-aube-text-muted">
                7 × 10 ml
              </span>
            </div>

            <OrderDiscoverySetButton className="mt-8" />

            <p className="mt-4 text-xs text-aube-text-muted">
              Prices in rupees, inclusive of all taxes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useCase } from "@/context/case-context";

export const DISCOVERY_FLOATING_IMAGE =
  "/images/objects/discovery-set-floating.webp";

/**
 * Shared client button for adding The Discovery Set directly to the Case
 * on /discovery-set and /objects.
 */
export function OrderDiscoverySetButton({
  className = "",
  label = "Add to Case",
}: {
  className?: string;
  label?: string;
}) {
  const { addToCase, setIsCaseOpen } = useCase();

  const handleOrder = () => {
    addToCase({
      slug: "discovery-set",
      name: "The Discovery Set",
      price: 999,
      volume: "7 × 10 ml",
      image: DISCOVERY_FLOATING_IMAGE,
    });
    setIsCaseOpen(true);
  };

  return (
    <button
      type="button"
      onClick={handleOrder}
      className={`border border-aube-text bg-aube-text px-8 py-3.5 font-body text-[11px] font-medium uppercase tracking-[0.22em] text-aube-base transition-all hover:border-aube-accent hover:bg-aube-accent active:scale-[0.98] ${className}`}
    >
      {label}
    </button>
  );
}

/**
 * Home Discovery Set Section — modeled after the editorial floating vials reference (image.png).
 * Left column: stacked 3-line display title + solid dark rectangular CTA button.
 * Right column: the 7 floating Ligéro 10 ml glass atomisers cutout.
 */
export default function DiscoverySet() {
  const { addToCase, setIsCaseOpen } = useCase();

  const handleOrderDiscovery = () => {
    addToCase({
      slug: "discovery-set",
      name: "The Discovery Set",
      price: 999,
      volume: "7 × 10 ml",
      image: DISCOVERY_FLOATING_IMAGE,
    });
    setIsCaseOpen(true);
  };

  return (
    <section
      id="discovery-set"
      aria-labelledby="discovery-set-heading"
      className="relative overflow-hidden border-b border-aube-hairline bg-aube-base"
    >
      <div className="mx-auto grid max-w-[108rem] grid-cols-1 lg:grid-cols-2">
        {/* Image panel: seamless surface */}
        <Link
          href="/discovery-set"
          aria-label="Explore The Discovery Set, seven 10 ml vials"
          className="group relative block h-[300px] bg-transparent sm:h-[400px] lg:h-auto lg:min-h-[560px] lg:border-r lg:border-aube-hairline"
        >
          <Image
            src={DISCOVERY_FLOATING_IMAGE}
            alt="Ligéro Parfums Floating Signature Collection, seven 10 ml pocket perfume sprays: Aubé, Marée, Blanc, Ambre Doux, Noctis, Fleur, and Noir Cacao"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain object-center p-6 sm:p-10 lg:p-14 [filter:drop-shadow(0_22px_28px_rgba(28,20,14,0.22))_drop-shadow(0_8px_12px_rgba(28,20,14,0.14))] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
          />
        </Link>

        {/* Text panel: left-aligned, vertically centered */}
        <div className="flex flex-col justify-center px-6 py-14 sm:px-10 sm:py-16 lg:px-16 lg:py-24 xl:px-24">
          <h2
            id="discovery-set-heading"
            className="font-editorial text-5xl font-normal leading-[0.98] tracking-[-0.01em] text-aube-text sm:text-6xl lg:text-[4.25rem] xl:text-[5rem]"
          >
            The
            <span className="mt-1 block italic">Discovery Set</span>
          </h2>

          <p className="mt-6 max-w-sm font-body text-base leading-relaxed text-aube-text/85">
            Seven perfumes, ten millilitres each. The way in before you choose one.
          </p>

          <p className="mt-5 font-body text-xs uppercase tracking-[0.18em] text-aube-text-muted">
            7 × 10 ml · ₹999
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <button
              type="button"
              onClick={handleOrderDiscovery}
              className="bg-aube-text px-8 py-3.5 font-body text-[11px] font-medium uppercase tracking-[0.22em] text-aube-base transition-all duration-300 hover:bg-aube-accent active:scale-[0.98]"
            >
              Shop 7 × 10 ml
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
    </section>
  );
}

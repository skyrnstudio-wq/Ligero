"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCase } from "@/context/case-context";

export const EN_ROUTE_FLOATING_IMAGE =
  "/images/objects/car-perfume-floating.webp";
export const EN_ROUTE_FLATLAY_IMAGE =
  "/images/objects/car-perfume-flatlay.webp";

/**
 * Home Car Perfume Section — modeled to match the exact floating cutout aesthetic
 * and thin strip footprint of the Discovery Set section (py-8 sm:py-10 lg:py-12, h-[230px..320px]).
 * Left column: Floating En Route flat-lay diffuser with natural cedarwood and bergamot peel.
 * Right column: stacked 3-line display title + solid rectangular CTA button.
 */
export default function CarPerfume() {
  const { addToCase, setIsCaseOpen } = useCase();
  const [added, setAdded] = useState(false);

  const handleOrderEnRoute = () => {
    addToCase({
      slug: "en-route",
      name: "En Route",
      price: 499,
      volume: "Car Perfume · Cabin Diffuser",
      image: EN_ROUTE_FLOATING_IMAGE,
    });
    setAdded(true);
    setIsCaseOpen(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <section
      id="car-perfume"
      aria-labelledby="car-perfume-heading"
      className="relative overflow-hidden border-b border-aube-hairline bg-aube-base"
    >
      <div className="mx-auto grid max-w-[108rem] grid-cols-1 lg:grid-cols-2">
        {/* Text panel: left-aligned, vertically centered */}
        <div className="order-2 flex flex-col justify-center px-6 py-14 sm:px-10 sm:py-16 lg:order-1 lg:px-16 lg:py-24 xl:px-24">
          <h2
            id="car-perfume-heading"
            className="font-editorial text-5xl font-normal leading-[0.98] tracking-[-0.01em] text-aube-text sm:text-6xl lg:text-[4.25rem] xl:text-[5rem]"
          >
            En Route
            <span className="mt-1 block italic">Car Perfume</span>
          </h2>

          <p className="mt-6 max-w-sm font-body text-base leading-relaxed text-aube-text/85">
            Cedarwood and dried bergamot peel, hung where you drive.
          </p>

          <p className="mt-5 font-body text-xs uppercase tracking-[0.18em] text-aube-text-muted">
            Cabin Diffuser · ₹499
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <button
              type="button"
              onClick={handleOrderEnRoute}
              className="bg-aube-text px-8 py-3.5 font-body text-[11px] font-medium uppercase tracking-[0.22em] text-aube-base transition-all duration-300 hover:bg-aube-accent active:scale-[0.98]"
            >
              {added ? "Added to Case" : "Shop En Route"}
            </button>

            <Link
              href="/objects/en-route"
              className="border-b border-aube-accent pb-1 font-body text-[11px] uppercase tracking-[0.22em] text-aube-text transition-colors hover:text-aube-accent"
            >
              Explore the Diffuser
            </Link>
          </div>
        </div>

        {/* Image panel: seamless surface */}
        <Link
          href="/objects/en-route"
          aria-label="Explore En Route, Car Perfume Cabin Diffuser"
          className="group relative order-1 block h-[340px] bg-transparent sm:h-[440px] lg:order-2 lg:h-auto lg:min-h-[560px] lg:border-l lg:border-aube-hairline"
        >
          <Image
            src={EN_ROUTE_FLOATING_IMAGE}
            alt="Ligéro En Route Car Perfume, luxury diffuser flat-lay with cedarwood and dried bergamot peel"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain object-center p-8 sm:p-12 lg:p-16 [filter:drop-shadow(0_16px_22px_rgba(28,20,14,0.16))] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
          />
        </Link>
      </div>
    </section>
  );
}

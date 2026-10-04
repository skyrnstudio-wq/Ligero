"use client";

import Image from "next/image";
import { useCase } from "@/context/case-context";

const DISCOVERY_IMAGE = "/images/objects/discovery-set.webp";
const EN_ROUTE_IMAGE = "/images/perfumes/en-route.jpeg";

export default function ObjectsOfScent() {
  const { addToCase, setIsCaseOpen } = useCase();

  const handleOrderDiscovery = () => {
    addToCase({
      slug: "discovery-set",
      name: "The Discovery Set",
      price: 999,
      volume: "7 × 10 ml",
      image: DISCOVERY_IMAGE,
    });
    setIsCaseOpen(true);
  };

  const handleOrderEnRoute = () => {
    addToCase({
      slug: "en-route",
      name: "En Route",
      price: 499,
      volume: "Car Diffuser",
      image: EN_ROUTE_IMAGE,
    });
    setIsCaseOpen(true);
  };

  return (
    <section
      aria-label="Objects of Scent"
      className="relative overflow-hidden bg-aube-surface py-20 sm:py-24 lg:py-32 border-y border-aube-hairline/70"
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.85) 0%, rgba(251, 248, 242, 0) 75%),
          url('/images/textures/raw-silk-canvas.webp')
        `,
        backgroundRepeat: "no-repeat, repeat",
        backgroundSize: "100% 100%, 360px 360px",
      }}
    >
      <div className="relative mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16 sm:mb-20">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-aube-accent">
            Objects of Scent // Ritual & Travel
          </p>
          <h2 className="mt-3 font-display text-3xl font-light italic tracking-[-0.01em] text-aube-text sm:text-4xl lg:text-5xl">
            The Rituals Beyond the Flacon.
          </h2>
          <p className="mt-4 text-base text-aube-text-muted sm:text-lg max-w-xl mx-auto leading-relaxed">
            Before committing to a signature. The complete olfactory coffret and the evocative drive.
          </p>
        </div>

        {/* Dual Objects Grid */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14 items-stretch">
          {/* Card 1: The Discovery Set (Hero Object - 7 columns) */}
          <div className="lg:col-span-7 flex flex-col justify-between border border-aube-hairline/80 bg-aube-base/85 backdrop-blur-xs p-6 sm:p-8 lg:p-10 shadow-[0_8px_30px_rgba(43,33,24,0.04)]">
            <div>
              {/* Card Metadata */}
              <div className="flex items-center justify-between border-b border-aube-hairline/60 pb-4 mb-6">
                <span className="text-[10px] uppercase tracking-[0.22em] text-aube-accent font-medium">
                  Apothecary No. 01
                </span>
                <span className="text-[11px] uppercase tracking-[0.18em] text-aube-text-muted">
                  7 × 10 ml Coffret
                </span>
              </div>

              {/* Framed Image */}
              <div className="group relative aspect-[16/10] w-full overflow-hidden border border-aube-hairline/70 bg-[#161413]">
                <Image
                  src={DISCOVERY_IMAGE}
                  alt="The Discovery Set presentation box containing seven ten-millilitre vials"
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10"
                />
              </div>

              {/* Copy */}
              <div className="mt-7">
                <h3 className="font-display text-3xl font-light italic text-aube-text sm:text-4xl">
                  The Discovery Set
                </h3>
                <p className="mt-3 text-base leading-relaxed text-aube-text/85">
                  Every perfume the house makes, ten millilitres each. Seven vials, one presentation box, rested ninety days. An intimate way to live with each fragrance across day and night before choosing your permanent signature.
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-6 border-t border-aube-hairline/60 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-3xl font-light text-aube-text">999</span>
                  <span className="text-xs uppercase tracking-[0.16em] text-aube-text-muted">
                    INR · All taxes incl.
                  </span>
                </div>
                <p className="text-[11px] text-aube-text-muted mt-0.5">
                  Complimentary shipping across India.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOrderDiscovery}
                className="border border-aube-text bg-aube-text px-8 py-3.5 text-xs uppercase tracking-[0.22em] text-aube-base transition-all hover:border-aube-accent hover:bg-aube-accent active:scale-[0.98] text-center"
              >
                Order Discovery Set
              </button>
            </div>
          </div>

          {/* Card 2: En Route (Ambient Object - 5 columns) */}
          <div className="lg:col-span-5 flex flex-col justify-between border border-aube-hairline/80 bg-aube-base/85 backdrop-blur-xs p-6 sm:p-8 lg:p-10 shadow-[0_8px_30px_rgba(43,33,24,0.04)]">
            <div>
              {/* Card Metadata */}
              <div className="flex items-center justify-between border-b border-aube-hairline/60 pb-4 mb-6">
                <span className="text-[10px] uppercase tracking-[0.22em] text-aube-accent font-medium">
                  Object No. 02
                </span>
                <span className="text-[11px] uppercase tracking-[0.18em] text-aube-text-muted">
                  Cabin Diffuser
                </span>
              </div>

              {/* Framed Image */}
              <div className="group relative aspect-[16/10] w-full overflow-hidden border border-aube-hairline/70 bg-[#161413]">
                <Image
                  src={EN_ROUTE_IMAGE}
                  alt="En Route cabin diffuser with cedar, bergamot, and sun-warmed amber"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10"
                />
              </div>

              {/* Copy */}
              <div className="mt-7">
                <h3 className="font-display text-3xl font-light italic text-aube-text sm:text-4xl">
                  En Route
                </h3>
                <p className="mt-3 text-base leading-relaxed text-aube-text/85">
                  An evocative atmosphere for the private cabin. Hand-finished car diffuser charged with pure atlas cedar, bergamot, and sun-warmed amber. Designed to accompany the journey.
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-6 border-t border-aube-hairline/60 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-3xl font-light text-aube-text">499</span>
                  <span className="text-xs uppercase tracking-[0.16em] text-aube-text-muted">
                    INR · All taxes incl.
                  </span>
                </div>
                <p className="text-[11px] text-aube-text-muted mt-0.5">
                  Refillable cartridge included.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOrderEnRoute}
                className="border border-aube-text/40 bg-transparent px-7 py-3.5 text-xs uppercase tracking-[0.22em] text-aube-text transition-all hover:border-aube-text hover:bg-aube-text hover:text-aube-base active:scale-[0.98] text-center"
              >
                Add En Route
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

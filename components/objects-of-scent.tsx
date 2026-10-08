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
      id="objects"
      aria-label="Objects of Scent"
      className="relative overflow-hidden bg-[#f7f3ee] py-20 sm:py-24 lg:py-28 border-b border-[#100b0a]/10"
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.8) 0%, rgba(247, 243, 238, 0) 75%),
          url('/assets/plates/cotton-canvas-texture.png')
        `,
        backgroundRepeat: "no-repeat, repeat",
        backgroundSize: "100% 100%, 360px 120px",
      }}
    >
      <div className="relative mx-auto max-w-6xl px-6 sm:px-10 lg:px-12">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16 sm:mb-20">
          <p className="text-[11px] font-normal uppercase tracking-[0.28em] text-[#5a240a]">
            02 / Objects of Scent · Ritual & Travel
          </p>
          <h2
            className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-normal tracking-[0.02em] text-[#100b0a]"
            style={{ fontFamily: "var(--font-cormorant), 'Adamina', Georgia, serif" }}
          >
            The Rituals Beyond the Flacon
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#3b3530] font-light tracking-wide max-w-xl mx-auto leading-relaxed">
            Before committing to a signature. The complete olfactory coffret and the evocative drive.
          </p>
        </div>

        {/* Dual Objects Grid */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 items-stretch">
          {/* Card 1: The Discovery Set (7 columns) */}
          <div className="lg:col-span-7 flex flex-col justify-between border border-[#100b0a]/15 bg-[#f1ebe4] p-7 sm:p-9 shadow-[0_4px_24px_rgba(16,11,10,0.04)]">
            <div>
              {/* Card Metadata */}
              <div className="flex items-center justify-between border-b border-[#100b0a]/10 pb-4 mb-6">
                <span className="text-[10px] uppercase tracking-[0.24em] text-[#5a240a] font-medium">
                  Apothecary No. 01
                </span>
                <span className="text-[11px] uppercase tracking-[0.18em] text-[#3b3530]">
                  7 × 10 ml Coffret
                </span>
              </div>

              {/* Framed Image */}
              <div className="group relative aspect-[16/10] w-full overflow-hidden border border-[#100b0a]/10 bg-[#171210]">
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
                <div className="flex items-baseline justify-between">
                  <h3
                    className="text-2xl sm:text-3xl font-normal text-[#100b0a]"
                    style={{ fontFamily: "var(--font-cormorant), 'Adamina', Georgia, serif" }}
                  >
                    The Discovery Set
                  </h3>
                  <span className="text-base font-normal text-[#5a240a] tracking-[0.08em]">
                    ₹999
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#3b3530] font-light">
                  Every perfume the house makes, ten millilitres each. Seven vials, one presentation box, rested ninety days in small batches. An intimate way to live with each fragrance across day and night before choosing your permanent signature.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#100b0a]/10 flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#3b3530]">
                Ships in custom mulmul wrap
              </span>
              <button
                type="button"
                onClick={handleOrderDiscovery}
                className="border border-[#100b0a] bg-[#100b0a] px-6 py-2.5 text-[11px] uppercase tracking-[0.22em] text-[#f1ebe4] transition-all hover:border-[#5a240a] hover:bg-[#5a240a] cursor-pointer"
              >
                Add to Case · ₹999
              </button>
            </div>
          </div>

          {/* Card 2: En Route (5 columns) */}
          <div className="lg:col-span-5 flex flex-col justify-between border border-[#100b0a]/15 bg-[#f1ebe4] p-7 sm:p-9 shadow-[0_4px_24px_rgba(16,11,10,0.04)]">
            <div>
              {/* Card Metadata */}
              <div className="flex items-center justify-between border-b border-[#100b0a]/10 pb-4 mb-6">
                <span className="text-[10px] uppercase tracking-[0.24em] text-[#5a240a] font-medium">
                  Apothecary No. 02
                </span>
                <span className="text-[11px] uppercase tracking-[0.18em] text-[#3b3530]">
                  Car Diffuser
                </span>
              </div>

              {/* Framed Image */}
              <div className="group relative aspect-[16/10] w-full overflow-hidden border border-[#100b0a]/10 bg-[#171210]">
                <Image
                  src={EN_ROUTE_IMAGE}
                  alt="En Route refillable brass car diffuser"
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
                <div className="flex items-baseline justify-between">
                  <h3
                    className="text-2xl sm:text-3xl font-normal text-[#100b0a]"
                    style={{ fontFamily: "var(--font-cormorant), 'Adamina', Georgia, serif" }}
                  >
                    En Route
                  </h3>
                  <span className="text-base font-normal text-[#5a240a] tracking-[0.08em]">
                    ₹499
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#3b3530] font-light">
                  For the drive. Refillable solid brass flacon clip. Pure cedarwood and cold-pressed citrus diffused in the moving air of the journey.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#100b0a]/10 flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#3b3530]">
                Refillable solid brass
              </span>
              <button
                type="button"
                onClick={handleOrderEnRoute}
                className="border border-[#100b0a] bg-[#100b0a] px-6 py-2.5 text-[11px] uppercase tracking-[0.22em] text-[#f1ebe4] transition-all hover:border-[#5a240a] hover:bg-[#5a240a] cursor-pointer"
              >
                Add to Case · ₹499
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

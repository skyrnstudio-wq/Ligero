"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCase } from "@/context/case-context";

interface ProductDiscoveryBannerProps {
  fragranceName: string;
}

export default function ProductDiscoveryBanner({
  fragranceName,
}: ProductDiscoveryBannerProps) {
  const [added, setAdded] = useState(false);
  const { addToCase, setIsCaseOpen } = useCase();

  const handleAddDiscovery = () => {
    addToCase({
      slug: "discovery-set",
      name: `The Discovery Set (Includes ${fragranceName})`,
      price: 999,
      volume: "7 × 10 ml Coffret",
      image: "/images/objects/discovery-set-floating.webp",
    });
    setAdded(true);
    setIsCaseOpen(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="group relative mt-6 overflow-hidden border border-pdp-hairline bg-gradient-to-br from-pdp-surface via-pdp-surface2 to-pdp-base p-5 transition-all duration-300 hover:border-pdp-accent/40">
      {/* Ambient gradient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-pdp-accent/15 to-transparent blur-2xl"
      />

      <div className="relative flex items-center justify-between gap-4">
        <div className="flex-1">
          <span className="font-body text-[9px] font-semibold uppercase tracking-[0.22em] text-pdp-accent">
            Try Before You Commit
          </span>
          <h4 className="mt-1 font-display text-base font-normal text-pdp-text">
            Sample {fragranceName} in the Coffret
          </h4>
          <p className="mt-1 text-[11px] leading-relaxed text-pdp-muted">
            Receive all seven 10 ml flacons for ₹999 with 100% redeemable credit toward your 50 ml flacon.
          </p>
        </div>

        <div className="relative h-16 w-16 flex-none overflow-hidden rounded bg-pdp-surface2/60 p-1">
          <Image
            src="/images/objects/discovery-set-floating.webp"
            alt="The Discovery Set"
            fill
            sizes="64px"
            className="object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-pdp-hairline/80 pt-3">
        <span className="font-body text-xs font-semibold tabular-nums text-pdp-text">
          ₹999{" "}
          <span className="font-normal text-[10px] text-pdp-muted">
            (Complimentary shipping)
          </span>
        </span>

        <button
          type="button"
          onClick={handleAddDiscovery}
          className="inline-flex min-h-9 items-center justify-center bg-pdp-btn px-4 py-1.5 font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-pdp-btn-text transition-colors hover:bg-pdp-btn-hover"
        >
          {added ? "Added to Case" : "Add Discovery Set"}
        </button>
      </div>
    </div>
  );
}

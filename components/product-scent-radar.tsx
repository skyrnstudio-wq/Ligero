"use client";

import { Product } from "@/lib/products";

interface ProductScentRadarProps {
  product: Product;
}

export default function ProductScentRadar({ product }: ProductScentRadarProps) {
  const metrics = [
    {
      label: "Parfum Concentration",
      value: "Eau de Parfum",
      sub: "Artisanal botanical formulation",
      level: 95,
    },
    {
      label: "Skin Longevity",
      value: "12+ Hours",
      sub: "Botanical lipid bonding",
      level: 90,
    },
    {
      label: "Sillage & Projection",
      value: "6 Ft Aura",
      sub: "Intimate, radiant trail",
      level: 78,
    },
    {
      label: "Artisanal Blending",
      value: "Small Batch",
      sub: "Crafted with botanical extracts",
      level: 92,
    },
  ];

  return (
    <div className="mt-8 overflow-hidden border border-pdp-hairline bg-gradient-to-b from-pdp-surface/60 via-pdp-surface2/40 to-pdp-surface/80 p-5 sm:p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-pdp-hairline/80 pb-3">
        <div>
          <p className="font-body text-[9px] font-semibold uppercase tracking-[0.22em] text-pdp-muted">
            Technical Architecture
          </p>
          <h3 className="mt-0.5 font-display text-lg font-normal tracking-wide text-pdp-text">
            Performance &amp; Longevity
          </h3>
        </div>
        <span className="font-body text-[10px] uppercase tracking-[0.2em] text-pdp-accent">
          Extrait Rating
        </span>
      </div>

      <div className="mt-4 space-y-4">
        {metrics.map((m) => (
          <div key={m.label} className="space-y-1.5">
            <div className="flex items-baseline justify-between font-body text-xs">
              <span className="font-medium text-pdp-text">{m.label}</span>
              <span className="tabular-nums font-semibold text-pdp-text">
                {m.value}
              </span>
            </div>
            {/* Minimalistic luxury progress track with gradient fill */}
            <div className="relative h-1 w-full overflow-hidden bg-pdp-hairline/60">
              <div
                className="h-full bg-gradient-to-r from-pdp-text/40 via-pdp-accent to-pdp-accent transition-all duration-1000 ease-out"
                style={{ width: `${m.level}%` }}
              />
            </div>
            <p className="font-body text-[10px] text-pdp-muted">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Maison Craftsmanship Highlights */}
      <div className="mt-5 grid grid-cols-2 gap-2 border-t border-pdp-hairline/80 pt-4 font-body text-[10.5px]">
        <div className="flex items-center gap-2 text-pdp-text/90">
          <span className="h-1.5 w-1.5 rounded-full bg-pdp-accent" />
          <span>Zero synthetic dyes</span>
        </div>
        <div className="flex items-center gap-2 text-pdp-text/90">
          <span className="h-1.5 w-1.5 rounded-full bg-pdp-accent" />
          <span>Zero phthalate fixatives</span>
        </div>
        <div className="flex items-center gap-2 text-pdp-text/90">
          <span className="h-1.5 w-1.5 rounded-full bg-pdp-accent" />
          <span>Hand-numbered batch</span>
        </div>
        <div className="flex items-center gap-2 text-pdp-text/90">
          <span className="h-1.5 w-1.5 rounded-full bg-pdp-accent" />
          <span>Cruelty-free botanicals</span>
        </div>
      </div>
    </div>
  );
}

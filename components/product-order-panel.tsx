"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPerfumeCutoutImage, type Product } from "@/lib/products";
import { useCase } from "@/context/case-context";
import type { ReviewSummary } from "@/lib/reviews";
import ProductDiscoveryBanner from "./product-discovery-banner";
import ProductScentRadar from "./product-scent-radar";

interface ProductOrderPanelProps {
  product: Product;
  reviewSummary?: ReviewSummary | null;
  isDark?: boolean;
}

export default function ProductOrderPanel({
  product,
  reviewSummary = null,
}: ProductOrderPanelProps) {
  const [added, setAdded] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<"flacon" | "discovery">(
    "flacon"
  );
  const [descOpen, setDescOpen] = useState(false);
  const { addToCase, setIsCaseOpen } = useCase();

  useEffect(() => {
    if (window.matchMedia("(min-width: 1024px)").matches) {
      setDescOpen(true);
    }
  }, []);

  const handleAdd = () => {
    if (selectedFormat === "discovery") {
      addToCase(
        {
          slug: "discovery-set",
          name: `The Discovery Set (Includes ${product.name})`,
          price: 999,
          volume: "7 × 10 ml Coffret",
          image: "/images/objects/discovery-set-floating.webp",
        },
        1
      );
    } else {
      addToCase(
        {
          slug: product.slug,
          name: product.name,
          price: product.price,
          volume: product.volume,
          image: getPerfumeCutoutImage(product),
        },
        1
      );
    }
    setAdded(true);
    setIsCaseOpen(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const activePrice = selectedFormat === "discovery" ? 999 : product.price;

  const notesLower = product.notesUppercase
    .toLowerCase()
    .replace(/\s*·\s*/g, ", ");

  const botanicals = [
    product.scentProfile.top,
    product.scentProfile.heart,
    product.scentProfile.base,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="mx-auto flex w-full max-w-[430px] flex-col">
      {/* 1. Centered Header Block */}
      <div className="flex flex-col items-center text-center">
        <p className="font-body text-[9.5px] font-medium uppercase tracking-[0.22em] text-pdp-muted">
          Eau de Parfum
        </p>

        <h1 className="mt-1.5 font-display text-3xl font-normal tracking-[-0.01em] text-pdp-text sm:text-4xl lg:text-[2.6rem] leading-[1.06]">
          {product.name}
        </h1>

        <p className="mt-1.5 font-body text-xs text-pdp-muted">
          {notesLower}
        </p>

        <p className="mt-2 font-body text-xs font-medium tabular-nums text-pdp-text sm:mt-2.5">
          ₹{activePrice.toLocaleString("en-IN")}
        </p>

        {reviewSummary && reviewSummary.count > 0 ? (
          <a
            href="#reviews-section"
            className="mt-2 inline-flex min-h-11 items-center gap-1.5 font-body text-xs text-pdp-text transition-opacity hover:opacity-75 sm:mt-3"
          >
            <span aria-hidden="true" className="tracking-[0.12em] text-[11px] text-amber-700/80 dark:text-amber-400/80">
              {"★".repeat(Math.round(reviewSummary.average))}
            </span>
            <span className="text-[11px] text-pdp-muted tabular-nums">
              ({reviewSummary.count})
            </span>
          </a>
        ) : (
          <a
            href="#reviews-section"
            className="mt-2 inline-flex min-h-11 items-center font-body text-[11px] text-pdp-muted underline-offset-4 hover:underline hover:text-pdp-text sm:mt-3"
          >
            Write a review
          </a>
        )}
      </div>

      {/* 2. Left-Aligned Description & Purchase Controls */}
      <div className="mt-4 flex flex-col gap-3 sm:mt-6 sm:gap-3.5">
        <p className="font-body text-xs leading-relaxed text-pdp-text/90">
          {product.oneLiner} {product.material}
        </p>

        {product.occasions && product.occasions.length > 0 && (
          <div className="border-y border-pdp-hairline/80 py-2.5">
            <p className="font-body text-[9.5px] font-semibold uppercase tracking-[0.2em] text-pdp-muted">
              Wear Occasions
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {product.occasions.map((occasion) => (
                <span
                  key={occasion}
                  className="inline-flex items-center border border-pdp-hairline bg-pdp-surface/60 px-2.5 py-1 font-body text-[10px] uppercase tracking-[0.14em] text-pdp-text"
                >
                  {occasion}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Format Toggle (50 ml Flacon vs 7 × 10 ml Coffret) */}
        <div
          role="group"
          aria-label="Select flacon format"
          className="grid grid-cols-2 gap-2"
        >
          <button
            type="button"
            onClick={() => setSelectedFormat("flacon")}
            aria-pressed={selectedFormat === "flacon"}
            className={`flex min-h-11 flex-col items-start justify-center border px-3.5 py-2 text-left transition-colors ${
              selectedFormat === "flacon"
                ? "border-pdp-text bg-pdp-chip text-pdp-text"
                : "border-pdp-text/20 bg-pdp-surface/50 text-pdp-muted hover:border-pdp-text/50 hover:text-pdp-text"
            }`}
          >
            <span className="font-body text-[10.5px] font-semibold uppercase tracking-[0.16em]">
              50 ml
            </span>
            <span className="font-body text-[10px] opacity-80">
              Full Flacon · ₹{product.price.toLocaleString("en-IN")}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedFormat("discovery")}
            aria-pressed={selectedFormat === "discovery"}
            className={`flex min-h-11 flex-col items-start justify-center border px-3.5 py-2 text-left transition-colors ${
              selectedFormat === "discovery"
                ? "border-pdp-text bg-pdp-chip text-pdp-text"
                : "border-pdp-text/20 bg-pdp-surface/50 text-pdp-muted hover:border-pdp-text/50 hover:text-pdp-text"
            }`}
          >
            <span className="font-body text-[10.5px] font-semibold uppercase tracking-[0.16em]">
              7 × 10 ml
            </span>
            <span className="font-body text-[10px] opacity-80">
              Discovery Set · ₹999
            </span>
          </button>
        </div>

        {/* Primary Add to Case Button */}
        <button
          type="button"
          onClick={handleAdd}
          className="flex min-h-11 w-full items-center justify-center bg-pdp-btn px-6 py-3.5 font-body text-[10.5px] font-semibold uppercase tracking-[0.22em] text-pdp-btn-text transition-colors hover:bg-pdp-btn-hover active:scale-[0.99]"
        >
          {added
            ? "Added to Case"
            : selectedFormat === "discovery"
            ? "Add Discovery Set to Case"
            : "Add to Case"}
        </button>

        {/* Sub-CTA Utility Links */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 font-body text-[10.5px] text-pdp-muted">
          <span>Complimentary tracked shipping</span>
          <span>Handcrafted in small batches</span>
        </div>
      </div>

      {/* 3. Minimal Accordions (Description, Ingredients, Shipping & Returns, Declarations) */}
      <div className="mt-5 divide-y divide-pdp-text/15 border-t border-b border-pdp-text/15 sm:mt-8">
        <details
          className="group py-1"
          open={descOpen}
          onToggle={(e) => setDescOpen((e.currentTarget as HTMLDetailsElement).open)}
        >
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-body text-xs font-normal text-pdp-text">
            <span>Description</span>
            <span
              aria-hidden="true"
              className="text-sm text-pdp-muted transition-transform duration-200 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <div className="mt-1 mb-3 space-y-2.5 font-body text-xs leading-relaxed text-pdp-muted">
            <p>{product.ritual}</p>
            <p>
              {product.scentProfile.concentration || "Eau de Parfum"} · Handcrafted in Small Batches.
            </p>
          </div>
        </details>

        <details className="group py-1">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-body text-xs font-normal text-pdp-text">
            <span>Ingredients</span>
            <span
              aria-hidden="true"
              className="text-sm text-pdp-muted transition-transform duration-200 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <div className="mt-1 mb-3 space-y-2 font-body text-xs leading-relaxed text-pdp-muted">
            <p>
              Alcohol Denat. (Food-Grade Grain), Parfum (Fragrance), Aqua (Demineralised Water), and natural botanical extracts: {botanicals}.
            </p>
            <p>
              Zero synthetic preservatives, zero artificial dyes, zero phthalate fixatives. Handcrafted with natural botanical extracts before bottling.
            </p>
          </div>
        </details>

        <details className="group py-1">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-body text-xs font-normal text-pdp-text">
            <span>Shipping &amp; Returns</span>
            <span
              aria-hidden="true"
              className="text-sm text-pdp-muted transition-transform duration-200 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <div className="mt-1 mb-3 space-y-2 font-body text-xs leading-relaxed text-pdp-muted">
            <p>
              Shipped by tracked surface freight across all serviceable pincodes. Dispatched within two working days; delivery takes three to seven working days.
            </p>
            <p>
              Unopened, factory-sealed bottles may be returned within seven days of delivery.{" "}
              <Link
                href="/legal/shipping-returns"
                className="text-pdp-text underline underline-offset-2"
              >
                Read the full policy
              </Link>
              .
            </p>
          </div>
        </details>

        <details className="group py-1">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-body text-xs font-normal text-pdp-text">
            <span>Declarations</span>
            <span
              aria-hidden="true"
              className="text-sm text-pdp-muted transition-transform duration-200 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <dl className="mt-1 mb-3 grid grid-cols-1 gap-1.5 font-body text-xs leading-relaxed text-pdp-muted">
            <div>
              <dt className="inline font-medium text-pdp-text">Commodity:</dt>{" "}
              <dd className="inline">Eau de Parfum ({product.name})</dd>
            </div>
            <div>
              <dt className="inline font-medium text-pdp-text">Net quantity:</dt>{" "}
              <dd className="inline">50 ml</dd>
            </div>
            <div>
              <dt className="inline font-medium text-pdp-text">MRP:</dt>{" "}
              <dd className="inline">
                ₹{product.price.toLocaleString("en-IN")}, inclusive of all taxes
              </dd>
            </div>
            <div>
              <dt className="inline font-medium text-pdp-text">
                Marketed and customer care by:
              </dt>{" "}
              <dd className="inline">
                Ligero Parfum Private Limited · sales@ligeroparfums.com
              </dd>
            </div>
          </dl>
        </details>
      </div>

      {/* 4. Scent Performance Architecture & Longevity Radar */}
      <ProductScentRadar product={product} />

      {/* 5. Discovery Set Upsell Banner */}
      <ProductDiscoveryBanner fragranceName={product.name} />
    </div>
  );
}

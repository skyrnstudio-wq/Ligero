"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  getPerfumeCutoutImage,
  getPerfumeNotesImage,
  isStaticPerfumeSlug,
  type Product,
} from "@/lib/products";

interface ProductScentArchitectureProps {
  product: Product;
  isDark?: boolean;
}

/**
 * Full-width "Olfactory Notes" showcase (matching D.S. & DURGA PDP middle band).
 * Centered display heading followed by a 3-column horizontal botanical gallery where
 * each card pairs a tall portrait botanical plate with a vertical hairline divider
 * and a bottom-aligned ingredient note.
 */
export default function ProductScentArchitecture({
  product,
}: ProductScentArchitectureProps) {
  const ingredients =
    product.keyIngredients && product.keyIngredients.length > 0
      ? product.keyIngredients.slice(0, 3)
      : [
          {
            name: product.notesPoem[0] || "Opening Note",
            note: "Top / Head",
            description: product.scentProfile.top,
          },
          {
            name: product.notesPoem[1] || "Heart Note",
            note: "Heart",
            description: product.scentProfile.heart,
          },
          {
            name: product.notesPoem[2] || "Base Note",
            note: "Base / Anchor",
            description: product.scentProfile.base,
          },
        ];

  const isStatic = isStaticPerfumeSlug(product.slug);
  const primaryBotanical =
    getPerfumeNotesImage(product) || getPerfumeCutoutImage(product);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleTrackScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(
      track.querySelectorAll<HTMLElement>("[data-note-card]")
    );
    if (cards.length === 0) return;
    const left = track.scrollLeft;
    let closest = 0;
    let minDiff = Infinity;
    cards.forEach((card, i) => {
      const diff = Math.abs(card.offsetLeft - left);
      if (diff < minDiff) {
        minDiff = diff;
        closest = i;
      }
    });
    setActiveIndex(closest);
  };

  const scrollCard = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = track.querySelectorAll<HTMLElement>("[data-note-card]");
    const clamped = Math.max(0, Math.min(cards.length - 1, index));
    const target = cards[clamped];
    if (target) {
      track.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
      setActiveIndex(clamped);
    }
  };

  return (
    <section
      aria-labelledby="olfactory-notes-heading"
      className="relative overflow-hidden border-y border-pdp-hairline bg-gradient-to-b from-pdp-surface via-pdp-surface2/40 to-pdp-surface py-10 text-pdp-text sm:py-24"
    >
      {/* Soft atmospheric gradient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_15%,var(--pdp-glow)_0%,transparent_75%)] opacity-60"
      />

      <div className="relative mx-auto max-w-[104rem] px-6 sm:px-10 lg:px-16">
        <p className="text-center font-body text-[9.5px] font-semibold uppercase tracking-[0.24em] text-pdp-accent">
          Three-Tier Olfactory Architecture
        </p>

        <h2
          id="olfactory-notes-heading"
          className="mt-1.5 text-center font-display text-3xl font-normal tracking-[-0.01em] text-pdp-text sm:mt-2 sm:text-5xl lg:text-[3.5rem]"
        >
          Olfactory Notes
        </h2>

        <div
          ref={trackRef}
          onScroll={handleTrackScroll}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          className="-mx-6 mt-7 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 no-scrollbar touch-pan-x md:mx-0 md:mt-12 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0 md:pb-0 lg:gap-12"
        >
          {ingredients.map((item, idx) => {
            const tierSuffix = idx === 0 ? "top" : idx === 1 ? "mid" : "base";
            const dedicatedNoteImage = isStatic
              ? `/images/perfumes/notes/${product.slug}-${tierSuffix}.webp`
              : undefined;
            const imgSrc = item.image || dedicatedNoteImage || primaryBotanical;

            return (
              <article
                key={item.name}
                data-note-card
                className="grid w-[82vw] shrink-0 snap-start grid-cols-[1.05fr_1fr] items-stretch gap-3.5 sm:gap-5 md:w-auto md:grid-cols-[1.15fr_1fr]"
              >
                {/* Left Portrait Botanical Plate + Vertical Black Hairline Rule */}
                <div className="relative border-r border-pdp-text/40 pr-3 sm:pr-4">
                  <div className="relative aspect-[4/4.5] w-full overflow-hidden bg-pdp-surface2 md:aspect-[3/4]">
                    <Image
                      src={imgSrc}
                      alt={`${item.name} (${item.note}) — ${product.name} olfactory note`}
                      fill
                      sizes="(max-width: 768px) 52vw, 20vw"
                      className="object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
                    />
                  </div>
                </div>

                {/* Right Bottom-Aligned Note Title & Description */}
                <div className="flex flex-col justify-end pb-1">
                  <p className="font-body text-[9px] uppercase tracking-[0.2em] text-pdp-muted">
                    {item.note}
                  </p>
                  <h3 className="mt-1 font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-pdp-text sm:text-xs">
                    {item.name}
                  </h3>
                  <p className="mt-2 font-body text-[11px] leading-relaxed text-pdp-muted sm:text-xs">
                    {item.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom-left subtle plate index indicator + mobile arrows */}
        <div className="mt-5 flex items-center justify-between font-body text-[10px] uppercase tracking-[0.2em] text-pdp-muted sm:mt-8">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollCard(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="Previous note tier"
              className="inline-flex h-11 w-11 min-h-11 min-w-11 items-center justify-center border border-pdp-hairline text-pdp-text disabled:opacity-25 md:hidden"
            >
              ←
            </button>
            <span className="tabular-nums">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(ingredients.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => scrollCard(activeIndex + 1)}
              disabled={activeIndex >= ingredients.length - 1}
              aria-label="Next note tier"
              className="inline-flex h-11 w-11 min-h-11 min-w-11 items-center justify-center border border-pdp-hairline text-pdp-text disabled:opacity-25 md:hidden"
            >
              →
            </button>
            <span className="ml-2 text-pdp-text/75">
              {product.scentProfile.family} · Eau de Parfum
            </span>
          </div>
          <p className="hidden text-[10px] tracking-[0.14em] text-pdp-muted lg:block">
            {product.scentProfile.top} · {product.scentProfile.heart} · {product.scentProfile.base}
          </p>
        </div>
      </div>
    </section>
  );
}

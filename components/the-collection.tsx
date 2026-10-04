"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

interface FragranceItem {
  name: string;
  slug: string;
  chapter: string;
  oneLiner: string;
  notes: string;
  notesImage: string;
  cutoutImage: string;
}

const FRAGRANCES: FragranceItem[] = [
  {
    name: "Aubé",
    slug: "aube",
    chapter: "Ch. I",
    oneLiner: "A crisp, awakening breeze of fresh mint and water jasmine.",
    notes: "Crisp Mint · Water Jasmine · Green Cedar",
    notesImage: "/images/perfumes/notes/aube.webp",
    cutoutImage: "/images/perfumes/cutouts/aube.webp",
  },
  {
    name: "Fleur",
    slug: "fleur",
    chapter: "Ch. II",
    oneLiner: "A timeless floral harmony of magnolia, Bulgarian rose, and luxury musk.",
    notes: "Magnolia · Bulgarian Rose · Luxury Musk",
    notesImage: "/images/perfumes/notes/fleur.webp",
    cutoutImage: "/images/perfumes/cutouts/fleur.webp",
  },
  {
    name: "Ambre Doux",
    slug: "ambre-doux",
    chapter: "Ch. III",
    oneLiner: "An addictive, radiant aura of saffron, crystalline amber, and silken woods.",
    notes: "Radiant Saffron · Crystalline Amber · Silken Woods",
    notesImage: "/images/perfumes/notes/ambre-doux.webp",
    cutoutImage: "/images/perfumes/cutouts/ambre-doux.webp",
  },
  {
    name: "Noctis",
    slug: "noctis",
    chapter: "Ch. IV",
    oneLiner: "A deep, intense journey of dark plum, grey amber, and driftwood.",
    notes: "Dark Plum · Grey Amber · Driftwood",
    notesImage: "/images/perfumes/notes/noctis.webp",
    cutoutImage: "/images/perfumes/cutouts/noctis.webp",
  },
  {
    name: "Blanc",
    slug: "blanc",
    chapter: "Ch. V",
    oneLiner: "A creamy indulgence of wild strawberry, whipped cream, and Madagascar vanilla.",
    notes: "Wild Strawberry · Whipped Cream · Madagascar Vanilla",
    notesImage: "/images/perfumes/notes/blanc.webp",
    cutoutImage: "/images/perfumes/cutouts/blanc.webp",
  },
  {
    name: "Marée",
    slug: "maree",
    chapter: "Ch. VI",
    oneLiner: "An oceanic surge of marine accord, wild rosemary, and mineral woods.",
    notes: "Marine Accord · Rosemary · Mineral Woods",
    notesImage: "/images/perfumes/notes/maree.webp",
    cutoutImage: "/images/perfumes/cutouts/maree.webp",
  },
  {
    name: "Noir Cacao",
    slug: "noir-cacao",
    chapter: "Ch. VII",
    oneLiner: "A decadent fusion of deep cacao, velvety vanilla, and smoked woods.",
    notes: "Cacao Absolute · Dark Chocolate · Madagascar Vanilla",
    notesImage: "/images/perfumes/notes/noir-cacao.webp",
    cutoutImage: "/images/perfumes/cutouts/noir-cacao.webp",
  },
];

export default function TheCollection() {
  const [activeIndex, setActiveIndex] = useState(0); // Start with Aubé (Ch. I)

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? FRAGRANCES.length - 1 : prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev === FRAGRANCES.length - 1 ? 0 : prev + 1));
  }, []);

  // Keyboard arrow navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handlePrev, handleNext]);

  const activeFragrance = FRAGRANCES[activeIndex];

  return (
    <section
      aria-label="The seven fragrances"
      className="relative overflow-hidden bg-aube-base py-16 sm:py-20 md:py-24 border-b border-aube-hairline/70"
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.75) 0%, rgba(243, 237, 227, 0.3) 65%, rgba(243, 237, 227, 0) 85%),
          url('/images/textures/raw-silk-canvas.webp')
        `,
        backgroundRepeat: "no-repeat, repeat",
        backgroundSize: "100% 100%, 360px 360px",
      }}
    >
      {/* Editorial Title Stack */}
      <div className="mx-auto max-w-4xl px-6 pb-8 text-center sm:px-10 sm:pb-12">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-aube-accent">
          The Collection // 50 ml Extrait de Parfum
        </p>
        <h2 className="mt-3 font-display text-3xl font-light uppercase tracking-wider text-aube-text sm:text-4xl lg:text-5xl">
          Seven Olfactive Emotions.
        </h2>
        <p className="mt-3 text-sm sm:text-base text-aube-text-muted tracking-wide max-w-lg mx-auto">
          Raw single-origin botanicals in natural light. Blended in India, rested ninety days.
        </p>
      </div>

      {/* 3D Showcase Carousel Stage */}
      <div className="relative mx-auto flex w-full max-w-[96rem] items-center justify-center px-4 sm:px-8">
        {/* Left Arrow Navigation Button */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous fragrance"
          className="group absolute left-3 sm:left-6 md:left-10 lg:left-14 z-30 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-aube-text/25 bg-aube-surface/90 text-aube-text backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-105 hover:border-aube-text hover:bg-aube-text hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-aube-accent"
        >
          <span className="text-sm sm:text-base transition-transform duration-300 group-hover:-translate-x-0.5">
            ←
          </span>
        </button>

        {/* Carousel Visuals Track */}
        <div className="relative flex h-[260px] sm:h-[300px] md:h-[340px] lg:h-[380px] w-full items-center justify-center overflow-visible">
          {FRAGRANCES.map((item, idx) => {
            // Cyclic distance from active index (-3 to +3)
            let offset = idx - activeIndex;
            const half = Math.floor(FRAGRANCES.length / 2);
            if (offset > half) offset -= FRAGRANCES.length;
            if (offset < -half) offset += FRAGRANCES.length;

            const isCenter = offset === 0;
            const isVisible = Math.abs(offset) <= 2;

            if (!isVisible) return null;

            // Spacing percentage so cards sit cleanly beside each other
            const xPercent = offset * 118;

            return (
              <motion.div
                key={item.slug}
                onClick={() => setActiveIndex(idx)}
                initial={false}
                animate={{
                  x: `${xPercent}%`,
                  scale: isCenter ? 1 : Math.abs(offset) === 1 ? 0.86 : 0.72,
                  opacity: isCenter ? 1 : Math.abs(offset) === 1 ? 0.8 : 0.35,
                  zIndex: isCenter ? 20 : 10 - Math.abs(offset),
                }}
                transition={{
                  duration: 0.6,
                  ease: [0.32, 0.72, 0, 1],
                }}
                className={`absolute flex cursor-pointer flex-col items-center justify-center transition-opacity duration-300 ${
                  !isCenter ? "hover:opacity-95" : ""
                }`}
              >
                {/* Visual Unit: Tall Portrait Editorial Card (3:4 ratio) + Side-Breaking 3D Bottle */}
                <div className="relative h-[210px] w-[158px] sm:h-[250px] sm:w-[188px] md:h-[285px] md:w-[214px] lg:h-[320px] lg:w-[240px]">
                  {/* Background Card with Raw Botanical Notes Art (Tall 3:4 Portrait, completely uncovered on the left) */}
                  <div className="relative h-full w-full overflow-hidden rounded-[2px] bg-[#1a1715] shadow-[0_16px_36px_rgba(43,33,24,0.16)] ring-1 ring-black/15 transition-shadow duration-300">
                    <Image
                      src={item.notesImage}
                      alt={`${item.name} olfactory notes`}
                      fill
                      sizes="(max-width: 640px) 158px, (max-width: 768px) 188px, (max-width: 1024px) 214px, 240px"
                      className="object-cover"
                      priority={isCenter}
                    />
                    {/* Subtle delicate luxury rim highlight */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/15"
                    />
                  </div>

                  {/* 3D Ground Contact Shadow beneath the breaking bottle */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-4 -right-5 sm:-bottom-5 sm:-right-7 z-10 h-5 w-24 sm:w-30 rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.55)_0%,_transparent_72%)] blur-md"
                  />

                  {/* 3D Perfume Bottle Cutout — anchored to the right, breaking out of the card edge */}
                  {/* Leaves 75% of the tall botanical art on the left completely open and clear */}
                  <div
                    className="pointer-events-none absolute -bottom-4 -right-6 sm:-bottom-5 sm:-right-8 md:-bottom-6 md:-right-9 z-20 h-[92%] w-[50%] sm:h-[95%] sm:w-[52%] transition-transform duration-300"
                    style={{
                      filter:
                        "drop-shadow(-12px 14px 16px rgba(0, 0, 0, 0.42)) drop-shadow(-3px 6px 8px rgba(0, 0, 0, 0.25)) drop-shadow(0 2px 3px rgba(0, 0, 0, 0.15))",
                    }}
                  >
                    <Image
                      src={item.cutoutImage}
                      alt={`${item.name} perfume bottle`}
                      fill
                      sizes="(max-width: 640px) 90px, (max-width: 768px) 120px, 140px"
                      className="object-contain object-bottom select-none"
                      priority={isCenter}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right Arrow Navigation Button */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next fragrance"
          className="group absolute right-3 sm:right-6 md:right-10 lg:right-14 z-30 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-aube-text/25 bg-aube-surface/90 text-aube-text backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-105 hover:border-aube-text hover:bg-aube-text hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-aube-accent"
        >
          <span className="text-sm sm:text-base transition-transform duration-300 group-hover:translate-x-0.5">
            →
          </span>
        </button>
      </div>

      {/* Active Fragrance Detail Block Below */}
      <div className="relative mx-auto mt-4 sm:mt-5 max-w-xl px-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFragrance.slug}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            {/* Title */}
            <h3 className="font-display text-xl sm:text-2xl font-light uppercase tracking-wider text-aube-text">
              {activeFragrance.name}
            </h3>

            {/* Chapter & Botanical Notes */}
            <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-aube-accent font-medium">
              {activeFragrance.chapter} · {activeFragrance.notes}
            </p>

            {/* Poetic One-Liner */}
            <p className="mt-1 text-xs text-aube-text/80 italic">
              "{activeFragrance.oneLiner}"
            </p>

            {/* CTA Link */}
            <Link
              href={`/collection/${activeFragrance.slug}`}
              className="group mt-2.5 inline-flex items-center gap-2 border-b border-aube-accent/60 pb-0.5 text-[11px] uppercase tracking-[0.2em] text-aube-text transition-all hover:border-aube-text hover:text-aube-accent"
            >
              <span>Explore {activeFragrance.name}</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Slide Indicator Dots */}
        <div className="mt-3 sm:mt-3.5 flex items-center justify-center gap-2">
          {FRAGRANCES.map((f, i) => (
            <button
              key={f.slug}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to ${f.name}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "w-6 bg-aube-accent"
                  : "w-1.5 bg-aube-text/20 hover:bg-aube-text/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

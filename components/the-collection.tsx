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
      className="relative overflow-hidden bg-aube-base py-24 sm:py-32 border-y border-aube-hairline/60"
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 45%, rgba(255, 255, 255, 0.65) 0%, rgba(243, 237, 227, 0) 72%),
          url('/images/textures/raw-silk-canvas.webp')
        `,
        backgroundRepeat: "no-repeat, repeat",
        backgroundSize: "100% 100%, 360px 360px",
      }}
    >
      {/* Editorial Title Stack */}
      <div className="mx-auto max-w-4xl px-6 pb-14 text-center sm:px-10">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-aube-accent">
          The Collection
        </p>
        <h2 className="mt-3 font-display text-3xl font-light uppercase tracking-wider text-aube-text sm:text-4xl lg:text-[2.75rem]">
          Seven Olfactive Emotions.
        </h2>
        <p className="mt-3 text-sm text-aube-text-muted tracking-wide">
          Raw botanicals in natural light. Blended in India, rested ninety days.
        </p>
      </div>

      {/* 3D Showcase Carousel Stage */}
      <div className="relative mx-auto flex w-full max-w-[96rem] items-center justify-center px-4 sm:px-8">
        {/* Left Arrow Navigation Button */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous fragrance"
          className="group absolute left-3 sm:left-6 md:left-10 lg:left-14 z-30 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-aube-text/25 bg-aube-surface/90 text-aube-text backdrop-blur-md shadow-xl transition-all duration-300 hover:scale-105 hover:border-aube-text hover:bg-aube-text hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-aube-accent"
        >
          <span className="text-lg sm:text-xl transition-transform duration-300 group-hover:-translate-x-0.5">
            ←
          </span>
        </button>

        {/* Carousel Visuals Track */}
        <div className="relative flex h-[440px] sm:h-[510px] md:h-[560px] lg:h-[600px] w-full items-center justify-center overflow-visible">
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
                <div className="relative h-[340px] w-[255px] sm:h-[420px] sm:w-[315px] md:h-[480px] md:w-[360px] lg:h-[520px] lg:w-[390px]">
                  {/* Background Card with Raw Botanical Notes Art (Tall 3:4 Portrait, completely uncovered on the left) */}
                  <div className="relative h-full w-full overflow-hidden rounded-[2px] bg-[#1a1715] shadow-[0_25px_55px_rgba(43,33,24,0.2)] ring-1 ring-black/15 transition-shadow duration-300">
                    <Image
                      src={item.notesImage}
                      alt={`${item.name} olfactory notes`}
                      fill
                      sizes="(max-width: 640px) 255px, (max-width: 768px) 315px, (max-width: 1024px) 360px, 390px"
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
                    className="pointer-events-none absolute -bottom-7 -right-8 sm:-bottom-9 sm:-right-12 z-10 h-8 w-36 sm:w-48 rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.55)_0%,_transparent_72%)] blur-md"
                  />

                  {/* 3D Perfume Bottle Cutout — anchored to the right, breaking out of the card edge */}
                  {/* Leaves 75% of the tall botanical art on the left completely open and clear */}
                  <div
                    className="pointer-events-none absolute -bottom-6 -right-10 sm:-bottom-8 sm:-right-14 md:-bottom-10 md:-right-16 z-20 h-[92%] w-[50%] sm:h-[95%] sm:w-[52%] transition-transform duration-300"
                    style={{
                      filter:
                        "drop-shadow(-18px 24px 26px rgba(0, 0, 0, 0.48)) drop-shadow(-6px 10px 12px rgba(0, 0, 0, 0.3)) drop-shadow(0 2px 5px rgba(0, 0, 0, 0.18))",
                    }}
                  >
                    <Image
                      src={item.cutoutImage}
                      alt={`${item.name} perfume bottle`}
                      fill
                      sizes="(max-width: 640px) 140px, (max-width: 768px) 180px, 220px"
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
          className="group absolute right-3 sm:right-6 md:right-10 lg:right-14 z-30 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-aube-text/25 bg-aube-surface/90 text-aube-text backdrop-blur-md shadow-xl transition-all duration-300 hover:scale-105 hover:border-aube-text hover:bg-aube-text hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-aube-accent"
        >
          <span className="text-lg sm:text-xl transition-transform duration-300 group-hover:translate-x-0.5">
            →
          </span>
        </button>
      </div>

      {/* Active Fragrance Detail Block Below */}
      <div className="relative mx-auto mt-12 max-w-xl px-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFragrance.slug}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            {/* Title */}
            <h3 className="font-display text-3xl sm:text-4xl font-light uppercase tracking-wider text-aube-text">
              {activeFragrance.name}
            </h3>

            {/* Chapter & Botanical Notes */}
            <p className="mt-2 text-xs uppercase tracking-[0.24em] text-aube-accent font-medium">
              {activeFragrance.chapter} · {activeFragrance.notes}
            </p>

            {/* Poetic One-Liner */}
            <p className="mt-2.5 text-sm sm:text-base italic text-aube-text/80">
              "{activeFragrance.oneLiner}"
            </p>

            {/* CTA Link */}
            <Link
              href={`/collection/${activeFragrance.slug}`}
              className="group mt-5 inline-flex items-center gap-2.5 border-b border-aube-accent/60 pb-1 text-xs uppercase tracking-[0.22em] text-aube-text transition-all hover:border-aube-text hover:text-aube-accent"
            >
              <span>Explore {activeFragrance.name}</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Slide Indicator Dots */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {FRAGRANCES.map((f, i) => (
            <button
              key={f.slug}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to ${f.name}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "w-7 bg-aube-accent"
                  : "w-2 bg-aube-text/20 hover:bg-aube-text/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

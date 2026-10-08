"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useCase } from "@/context/case-context";

interface FragranceItem {
  name: string;
  slug: string;
  chapter: string;
  subtitle: string;
  price: number;
  oneLiner: string;
  notes: string;
  notesImage: string;
  cutoutImage: string;
  image: string;
}

const FRAGRANCES: FragranceItem[] = [
  {
    name: "Aubé",
    slug: "aube",
    chapter: "Ch. I",
    subtitle: "Fresh. Vibrant. Awakening.",
    price: 1099,
    oneLiner: "A crisp, awakening breeze of fresh mint and water jasmine.",
    notes: "Crisp Mint · Water Jasmine · Green Cedar",
    notesImage: "/images/perfumes/notes/aube.webp",
    cutoutImage: "/images/perfumes/cutouts/aube.webp",
    image: "/images/perfumes/aube.jpeg",
  },
  {
    name: "Fleur",
    slug: "fleur",
    chapter: "Ch. II",
    subtitle: "Pure. Elegant. Timeless.",
    price: 1299,
    oneLiner: "A timeless floral harmony of magnolia, Bulgarian rose, and luxury musk.",
    notes: "Magnolia · Bulgarian Rose · Luxury Musk",
    notesImage: "/images/perfumes/notes/fleur.webp",
    cutoutImage: "/images/perfumes/cutouts/fleur.webp",
    image: "/images/perfumes/fleur.jpeg",
  },
  {
    name: "Ambre Doux",
    slug: "ambre-doux",
    chapter: "Ch. III",
    subtitle: "Warm. Radiant. Addictive.",
    price: 1699,
    oneLiner: "An addictive, radiant aura of saffron, crystalline amber, and silken woods.",
    notes: "Radiant Saffron · Crystalline Amber · Silken Woods",
    notesImage: "/images/perfumes/notes/ambre-doux.webp",
    cutoutImage: "/images/perfumes/cutouts/ambre-doux.webp",
    image: "/images/perfumes/ambre-doux.jpeg",
  },
  {
    name: "Noctis",
    slug: "noctis",
    chapter: "Ch. IV",
    subtitle: "Deep. Intense. Mysterious.",
    price: 1299,
    oneLiner: "A deep, intense journey of dark plum, grey amber, and driftwood.",
    notes: "Dark Plum · Grey Amber · Driftwood",
    notesImage: "/images/perfumes/notes/noctis.webp",
    cutoutImage: "/images/perfumes/cutouts/noctis.webp",
    image: "/images/perfumes/noctis.jpeg",
  },
  {
    name: "Blanc",
    slug: "blanc",
    chapter: "Ch. V",
    subtitle: "Soft. Creamy. Indulgent.",
    price: 1099,
    oneLiner: "A creamy indulgence of wild strawberry, whipped cream, and Madagascar vanilla.",
    notes: "Wild Strawberry · Whipped Cream · Madagascar Vanilla",
    notesImage: "/images/perfumes/notes/blanc.webp",
    cutoutImage: "/images/perfumes/cutouts/blanc.webp",
    image: "/images/perfumes/blanc.jpeg",
  },
  {
    name: "Marée",
    slug: "maree",
    chapter: "Ch. VI",
    subtitle: "Marine. Fresh. Deep.",
    price: 1699,
    oneLiner: "An oceanic surge of marine accord, wild rosemary, and mineral woods.",
    notes: "Marine Accord · Rosemary · Mineral Woods",
    notesImage: "/images/perfumes/notes/maree.webp",
    cutoutImage: "/images/perfumes/cutouts/maree.webp",
    image: "/images/perfumes/maree.jpeg",
  },
  {
    name: "Noir Cacao",
    slug: "noir-cacao",
    chapter: "Ch. VII",
    subtitle: "Dark. Warm. Addictive.",
    price: 1599,
    oneLiner: "A decadent fusion of deep cacao, velvety vanilla, and smoked woods.",
    notes: "Cacao Absolute · Dark Chocolate · Madagascar Vanilla",
    notesImage: "/images/perfumes/notes/noir-cacao.webp",
    cutoutImage: "/images/perfumes/cutouts/noir-cacao.webp",
    image: "/images/perfumes/noir-cacao.jpeg",
  },
];

export default function TheCollection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { addToCase, setIsCaseOpen } = useCase();

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? FRAGRANCES.length - 1 : prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev === FRAGRANCES.length - 1 ? 0 : prev + 1));
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handlePrev, handleNext]);

  const activeFragrance = FRAGRANCES[activeIndex];

  const handleAddToCart = () => {
    addToCase({
      slug: activeFragrance.slug,
      name: activeFragrance.name,
      price: activeFragrance.price,
      volume: "50 ml",
      image: activeFragrance.image,
    });
    setIsCaseOpen(true);
  };

  return (
    <section
      id="collection"
      aria-label="The seven fragrances"
      className="relative overflow-hidden bg-[#f1ebe4] py-20 sm:py-24 md:py-28 border-b border-[#100b0a]/10"
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.7) 0%, rgba(241, 235, 228, 0.2) 65%, transparent 90%),
          url('/assets/plates/cotton-canvas-texture.png')
        `,
        backgroundRepeat: "no-repeat, repeat",
        backgroundSize: "100% 100%, 360px 120px",
      }}
    >
      {/* Editorial Title Stack */}
      <div className="mx-auto max-w-4xl px-6 pb-10 text-center sm:px-10 sm:pb-14">
        <p className="text-[11px] font-normal uppercase tracking-[0.28em] text-[#5a240a]">
          01 / The Collection · 50 ml Extrait de Parfum
        </p>
        <h2
          className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-normal tracking-[0.02em] text-[#100b0a]"
          style={{ fontFamily: "var(--font-cormorant), 'Adamina', Georgia, serif" }}
        >
          Seven Olfactive Emotions
        </h2>
        <p className="mt-3 text-sm sm:text-base text-[#3b3530] tracking-wide max-w-lg mx-auto font-light leading-relaxed">
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
          className="group absolute left-3 sm:left-6 md:left-10 lg:left-14 z-30 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-none border border-[#100b0a]/20 bg-[#f7f3ee]/95 text-[#100b0a] shadow-[0_4px_16px_rgba(16,11,10,0.08)] transition-all duration-300 hover:border-[#5a240a] hover:bg-[#5a240a] hover:text-[#f1ebe4] focus:outline-none cursor-pointer"
        >
          <span className="text-sm sm:text-base transition-transform duration-300 group-hover:-translate-x-0.5">
            ←
          </span>
        </button>

        {/* Carousel Visuals Track */}
        <div className="relative flex h-[280px] sm:h-[320px] md:h-[360px] lg:h-[400px] w-full items-center justify-center overflow-visible">
          {FRAGRANCES.map((item, idx) => {
            let offset = idx - activeIndex;
            const half = Math.floor(FRAGRANCES.length / 2);
            if (offset > half) offset -= FRAGRANCES.length;
            if (offset < -half) offset += FRAGRANCES.length;

            const isCenter = offset === 0;
            const isVisible = Math.abs(offset) <= 2;

            if (!isVisible) return null;

            const xPercent = offset * 118;

            return (
              <motion.div
                key={item.slug}
                onClick={() => setActiveIndex(idx)}
                initial={false}
                animate={{
                  x: `${xPercent}%`,
                  scale: isCenter ? 1 : Math.abs(offset) === 1 ? 0.88 : 0.74,
                  opacity: isCenter ? 1 : Math.abs(offset) === 1 ? 0.75 : 0.35,
                  zIndex: isCenter ? 20 : 10 - Math.abs(offset),
                }}
                transition={{
                  duration: 0.6,
                  ease: [0.32, 0.72, 0, 1],
                }}
                className={`absolute flex cursor-pointer flex-col items-center justify-center transition-opacity duration-300 ${
                  !isCenter ? "hover:opacity-90" : ""
                }`}
              >
                {/* Visual Unit: Tall Portrait Editorial Card (3:4 ratio) + Side-Breaking 3D Bottle */}
                <div className="relative h-[220px] w-[165px] sm:h-[260px] sm:w-[195px] md:h-[300px] md:w-[225px] lg:h-[340px] lg:w-[255px]">
                  {/* Background Card with Raw Botanical Notes Art */}
                  <div className="relative h-full w-full overflow-hidden border border-[#100b0a]/15 bg-[#171210] shadow-[0_16px_36px_rgba(16,11,10,0.12)]">
                    <Image
                      src={item.notesImage}
                      alt={`${item.name} olfactory notes`}
                      fill
                      sizes="(max-width: 640px) 165px, (max-width: 768px) 195px, (max-width: 1024px) 225px, 255px"
                      className="object-cover"
                      priority={isCenter}
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10"
                    />
                  </div>

                  {/* 3D Ground Contact Shadow */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-4 -right-5 sm:-bottom-5 sm:-right-7 z-10 h-5 w-24 sm:w-32 rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.45)_0%,_transparent_72%)] blur-md"
                  />

                  {/* 3D Perfume Bottle Cutout */}
                  <div
                    className="pointer-events-none absolute -bottom-4 -right-6 sm:-bottom-5 sm:-right-8 md:-bottom-6 md:-right-9 z-20 h-[92%] w-[50%] sm:h-[95%] sm:w-[52%] transition-transform duration-300"
                    style={{
                      filter:
                        "drop-shadow(-12px 14px 16px rgba(0, 0, 0, 0.42)) drop-shadow(-3px 6px 8px rgba(0, 0, 0, 0.25)) drop-shadow(0 2px 3px rgba(0, 0, 0, 0.15))",
                    }}
                  >
                    <Image
                      src={item.cutoutImage}
                      alt={`${item.name} perfume flacon`}
                      fill
                      sizes="(max-width: 640px) 95px, (max-width: 768px) 125px, 145px"
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
          className="group absolute right-3 sm:right-6 md:right-10 lg:right-14 z-30 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-none border border-[#100b0a]/20 bg-[#f7f3ee]/95 text-[#100b0a] shadow-[0_4px_16px_rgba(16,11,10,0.08)] transition-all duration-300 hover:border-[#5a240a] hover:bg-[#5a240a] hover:text-[#f1ebe4] focus:outline-none cursor-pointer"
        >
          <span className="text-sm sm:text-base transition-transform duration-300 group-hover:translate-x-0.5">
            →
          </span>
        </button>
      </div>

      {/* Active Fragrance Detail Block Below */}
      <div className="relative mx-auto mt-6 sm:mt-8 max-w-xl px-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFragrance.slug}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            {/* Title & Price */}
            <div className="flex items-baseline gap-3">
              <h3
                className="text-2xl sm:text-3xl font-normal tracking-[0.04em] text-[#100b0a]"
                style={{ fontFamily: "var(--font-cormorant), 'Adamina', Georgia, serif" }}
              >
                {activeFragrance.name}
              </h3>
              <span className="text-sm font-normal text-[#5a240a] tracking-[0.1em]">
                ₹{activeFragrance.price.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Chapter & Botanical Notes */}
            <p className="mt-1.5 text-[11px] uppercase tracking-[0.22em] text-[#5a240a] font-normal">
              {activeFragrance.chapter} · {activeFragrance.notes}
            </p>

            {/* Poetic One-Liner */}
            <p className="mt-2 text-sm text-[#3b3530] font-light italic leading-relaxed">
              "{activeFragrance.oneLiner}"
            </p>

            {/* Actions: Add to Case & Explore */}
            <div className="mt-5 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={handleAddToCart}
                className="border border-[#100b0a] bg-[#100b0a] px-6 py-2.5 text-[11px] uppercase tracking-[0.22em] text-[#f1ebe4] transition-all duration-200 hover:border-[#5a240a] hover:bg-[#5a240a] cursor-pointer"
              >
                Add to Case · ₹{activeFragrance.price.toLocaleString("en-IN")}
              </button>
              <Link
                href={`/collection/${activeFragrance.slug}`}
                className="border border-[#100b0a]/30 px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-[#100b0a] transition-all duration-200 hover:border-[#100b0a] hover:text-[#5a240a]"
              >
                Explore Details →
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Tactile Swatch Bar / Quick Jump */}
        <div className="mt-8 flex items-center justify-center gap-1.5 sm:gap-2">
          {FRAGRANCES.map((f, i) => (
            <button
              key={f.slug}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`View ${f.name}`}
              className={`group flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] transition-all duration-200 cursor-pointer ${
                i === activeIndex
                  ? "border border-[#5a240a] bg-[#5a240a] text-[#f1ebe4]"
                  : "border border-[#100b0a]/15 text-[#3b3530] hover:border-[#100b0a]/40"
              }`}
            >
              <span>{f.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

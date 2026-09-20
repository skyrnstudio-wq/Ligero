"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion, useMotionValueEvent, useScroll, type MotionValue } from "motion/react";

/**
 * Home section 3 (site-blueprint.md §4, layout family: horizontal scroll).
 * Seven fragrances in a snap carousel. Exactly three are visible at a time;
 * the centered card scales up while its neighbors scale down, driven by
 * each card's distance from the viewport center (scroll-linked transforms,
 * interrupted-safe). Collapses to static under prefers-reduced-motion.
 */

const FRAGRANCES: { name: string; slug: string; image: string }[] = [
  { name: "AUBE", slug: "aube", image: "/images/perfumes/aube.jpeg" },
  { name: "Noctis", slug: "noctis", image: "/images/perfumes/noctis.jpeg" },
  { name: "Marée", slug: "maree", image: "/images/perfumes/maree.jpeg" },
  { name: "Ambre Doux", slug: "ambre-doux", image: "/images/perfumes/ambre-doux.jpeg" },
  { name: "Blanc", slug: "blanc", image: "/images/perfumes/blanc.jpeg" },
  { name: "Fleur", slug: "fleur", image: "/images/perfumes/fleur.jpeg" },
  { name: "Noir Cacao", slug: "noir-cacao", image: "/images/perfumes/noir-cacao.jpeg" },
];

const CENTER_SCALE = 1.08;
const SIDE_SCALE = 0.86;

/** Maps a card's distance-from-center (in card widths) to a scale. */
function scaleFor(distance: number): number {
  const d = Math.abs(distance);
  // 0 → center scale; 1 card away → side scale; further → clamp at side scale
  const t = Math.min(d, 1);
  return SIDE_SCALE + (CENTER_SCALE - SIDE_SCALE) * (1 - t);
}

function Card({
  fragrance,
  trackRef,
}: {
  fragrance: (typeof FRAGRANCES)[number];
  trackRef: React.RefObject<HTMLDivElement | null>;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const track = trackRef.current;
    if (!card || !track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const cardRect = card.getBoundingClientRect();
      const trackRect = track.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const trackCenter = trackRect.left + trackRect.width / 2;
      const distance = (cardCenter - trackCenter) / cardRect.width; // in card widths
      const s = scaleFor(distance);
      card.style.transform = `scale(${s})`;
      card.style.opacity = s > (CENTER_SCALE + SIDE_SCALE) / 2 ? "1" : "0.75";
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [trackRef]);

  return (
    <a
      ref={cardRef}
      href={`/collection/${fragrance.slug}`}
      className="group w-[72vw] flex-none snap-center sm:w-[44vw] lg:w-[30rem] will-change-transform"
      style={{ transform: `scale(${SIDE_SCALE})`, transition: "opacity 0.3s ease" }}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-aube-surface">
        <Image
          src={fragrance.image}
          alt={`Ligero Parfum ${fragrance.name} bottle`}
          fill
          sizes="(max-width: 640px) 72vw, (max-width: 1024px) 44vw, 30rem"
          className="object-cover"
        />
      </div>
      <p className="mt-4 text-center font-display text-2xl font-light italic text-aube-text transition-colors group-hover:text-aube-accent sm:text-[1.7rem]">
        {fragrance.name}
      </p>
    </a>
  );
}

export default function TheCollection() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Start centered on the middle card so the composition opens focused.
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children) as HTMLElement[];
    const middle = cards[Math.floor(cards.length / 2)];
    if (middle) {
      track.scrollLeft =
        middle.offsetLeft - (track.clientWidth - middle.clientWidth) / 2;
    }
  }, []);

  return (
    <section aria-label="The seven fragrances" className="bg-aube-base pb-28 lg:pb-36">
      <div className="mx-auto max-w-4xl px-6 pb-12 text-center sm:px-10">
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-aube-accent">
          The Collection
        </p>
        <h2 className="mt-3 font-display text-3xl font-light italic text-aube-text sm:text-4xl">
          Seven Compositions. One Defining Presence.
        </h2>
      </div>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory items-center gap-6 overflow-x-auto px-[14vw] pb-6 sm:px-[18vw] lg:px-[calc(50%-15rem)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {FRAGRANCES.map((fragrance) => (
          <Card key={fragrance.slug} fragrance={fragrance} trackRef={trackRef} />
        ))}
      </div>
    </section>
  );
}

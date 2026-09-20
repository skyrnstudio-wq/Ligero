"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type ParallaxImageProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  /** Overrides the default full-bleed absolute positioning of the wrapper. */
  wrapperClassName?: string;
};

/**
 * Hero image with a subtle vertical parallax on scroll.
 * Collapses to a static image under prefers-reduced-motion.
 */
export default function ParallaxImage({
  src,
  alt,
  sizes,
  className,
  wrapperClassName,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const viewportHeight = window.innerHeight || 1;
      const progress = Math.min(Math.max(window.scrollY / viewportHeight, 0), 1);
      const shift = (progress - 0.5) * 32; // ±16px smooth parallax
      el.style.transform = `translate3d(0, ${shift}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={wrapperClassName ?? "absolute -inset-y-4 inset-x-0 will-change-transform"}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes={sizes}
        className={className ?? "object-cover"}
      />
    </div>
  );
}

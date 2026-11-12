"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const HERO_IMAGE = "/images/hero/ligero-parfum-cutout.webp";

/**
 * Home hero featuring the Ligéro Parfums signature amber bottle cutout
 * with multi-plane scroll & pointer parallax across the monumental wordmark,
 * the centered flacon, and the diagonal editorial typography blocks.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const wordmarkBackRef = useRef<HTMLSpanElement>(null);
  const wordmarkGlassRef = useRef<HTMLSpanElement>(null);
  const bottleRef = useRef<HTMLDivElement>(null);
  const topRightRef = useRef<HTMLDivElement>(null);
  const bottomLeftRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rafId = 0;
    let targetPointerX = 0;
    let targetPointerY = 0;
    let currentPointerX = 0;
    let currentPointerY = 0;
    let scrollProgress = 0;

    const readScroll = () => {
      const vh = window.innerHeight || 1;
      // Normalized scroll progress (0 at top, 1 when next section fully covers stationary hero)
      scrollProgress = Math.min(Math.max(window.scrollY / vh, 0), 1);
    };

    const tick = () => {
      const dx = targetPointerX - currentPointerX;
      const dy = targetPointerY - currentPointerY;
      currentPointerX += dx * 0.08;
      currentPointerY += dy * 0.08;

      // Subtle depth recession while stationary hero is covered by the rising next section
      const wordY = scrollProgress * 28 + currentPointerY * -12;
      const wordX = currentPointerX * -16;
      const wordScale = 1 - scrollProgress * 0.03;

      const bottleY = scrollProgress * -18 + currentPointerY * 18;
      const bottleX = currentPointerX * 22;
      const bottleRotate = scrollProgress * -1.8 + currentPointerX * 2.2;
      const bottleScale = 1 - scrollProgress * 0.04;

      const topRightY = scrollProgress * -16 + currentPointerY * 8;
      const topRightX = currentPointerX * 10;

      const bottomLeftY = scrollProgress * -12 + currentPointerY * 10;
      const bottomLeftX = currentPointerX * 12;

      const wordTransform = `translate3d(${wordX.toFixed(2)}px, ${wordY.toFixed(2)}px, 0) scale(${wordScale.toFixed(4)})`;
      if (wordmarkBackRef.current) {
        wordmarkBackRef.current.style.transform = wordTransform;
      }
      if (wordmarkGlassRef.current) {
        wordmarkGlassRef.current.style.transform = wordTransform;
      }
      if (bottleRef.current) {
        bottleRef.current.style.transform = `translate3d(${bottleX.toFixed(2)}px, ${bottleY.toFixed(2)}px, 0) rotate(${bottleRotate.toFixed(2)}deg) scale(${bottleScale.toFixed(4)})`;
      }
      if (topRightRef.current) {
        topRightRef.current.style.transform = `translate3d(${topRightX.toFixed(2)}px, ${topRightY.toFixed(2)}px, 0)`;
      }
      if (bottomLeftRef.current) {
        bottomLeftRef.current.style.transform = `translate3d(${bottomLeftX.toFixed(2)}px, ${bottomLeftY.toFixed(2)}px, 0)`;
      }
      if (veilRef.current) {
        veilRef.current.style.opacity = (scrollProgress * 0.32).toFixed(3);
      }

      if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = 0;
      }
    };

    const scheduleTick = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const onScroll = () => {
      readScroll();
      scheduleTick();
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      targetPointerX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetPointerY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      scheduleTick();
    };

    const onPointerLeave = () => {
      targetPointerX = 0;
      targetPointerY = 0;
      scheduleTick();
    };

    readScroll();
    scheduleTick();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    section.addEventListener("pointermove", onPointerMove, { passive: true });
    section.addEventListener("pointerleave", onPointerLeave, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      section.removeEventListener("pointermove", onPointerMove);
      section.removeEventListener("pointerleave", onPointerLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Ligero Parfum Campaign"
      className="relative flex min-h-svh flex-col justify-between overflow-hidden bg-aube-base"
      style={{
        backgroundImage: `
          radial-gradient(circle at 25% 75%, rgba(255, 255, 255, 0.72) 0%, rgba(243, 237, 227, 0.45) 55%, rgba(243, 237, 227, 0) 85%),
          radial-gradient(circle at 75% 28%, rgba(255, 255, 255, 0.65) 0%, rgba(243, 237, 227, 0) 60%),
          radial-gradient(circle at 50% 52%, rgba(212, 148, 74, 0.18) 0%, rgba(243, 237, 227, 0) 50%),
          url('/images/textures/raw-silk-canvas.webp')
        `,
        backgroundRepeat: "no-repeat, no-repeat, no-repeat, repeat",
        backgroundSize: "100% 100%, 100% 100%, 100% 100%, 360px 360px",
      }}
    >
      {/* Monumental LIGÉRO wordmark behind the flacon */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center overflow-hidden select-none"
      >
        <span
          ref={wordmarkBackRef}
          className="font-editorial text-[clamp(6.5rem,22vw,23rem)] font-normal uppercase leading-none tracking-[0.06em] text-transparent bg-gradient-to-b from-[#2B2118]/[0.18] via-[#6F6154]/[0.12] to-[#C6A15B]/[0.05] bg-clip-text will-change-transform"
        >
          LIGÉRO
        </span>
      </div>

      {/* Centered Ligéro Parfum Cutout */}
      <div className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center px-6 pt-16 pb-8 sm:pt-20 lg:py-16">
        <div
          ref={bottleRef}
          className="relative h-[52%] w-full max-w-[400px] sm:h-[60%] sm:max-w-[460px] lg:h-[70%] lg:max-h-[600px] lg:max-w-[520px] will-change-transform"
        >
          <Image
            src={HERO_IMAGE}
            alt="Ligéro Parfums signature amber flacon"
            fill
            priority
            sizes="(max-width: 1024px) 85vw, 50vw"
            className="object-contain object-center select-none [filter:drop-shadow(-22px_32px_42px_rgba(44,30,18,0.28))_drop-shadow(0_10px_18px_rgba(44,30,18,0.16))]"
          />
        </div>
      </div>

      {/* Subtle amber-glass refraction pass so the bottle catches the monumental type behind it */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[6] flex items-center justify-center overflow-hidden select-none mix-blend-overlay opacity-35"
      >
        <span
          ref={wordmarkGlassRef}
          className="font-editorial text-[clamp(6.5rem,22vw,23rem)] font-normal uppercase leading-none tracking-[0.06em] text-[#FBF8F2]/50 will-change-transform"
        >
          LIGÉRO
        </span>
      </div>

      {/* Top atmospheric scrim ensuring the navbar text is crisp and readable */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-aube-base/90 via-aube-base/45 to-transparent"
      />

      {/* Diagonal editorial layout: Top-Right & Bottom-Left framing the centered flacon */}
      <div className="relative z-10 flex flex-1 flex-col justify-between px-6 pb-12 pt-28 sm:px-10 sm:pt-32 lg:px-16 lg:pb-16 lg:pt-32 xl:px-24">
        {/* Top-Right Text Block */}
        <div
          ref={topRightRef}
          className="ml-auto max-w-[19rem] text-right sm:max-w-[23rem] lg:max-w-[25rem] xl:max-w-[27rem] will-change-transform"
        >
          <p className="font-body text-sm leading-relaxed text-aube-text/85 sm:text-base lg:text-[1.05rem]">
            Rare botanicals, slow-cured resins, and an intoxicating sillage designed to become your second skin. Indulge in an olfactory statement that lingers long after you leave.
          </p>
        </div>

        {/* Bottom-Left Text Block */}
        <div
          ref={bottomLeftRef}
          className="mr-auto mt-auto max-w-[21rem] text-left sm:max-w-[28rem] lg:max-w-[31rem] xl:max-w-[35rem] will-change-transform"
        >
          <h1 className="font-display text-4xl font-light leading-[1.1] tracking-[-0.01em] text-aube-text sm:text-5xl lg:text-[3.5rem] xl:text-[4rem]">
            An intimate obsession.
            <span className="mt-1.5 block italic font-light text-aube-text">
              Crafted to be unforgettable.
            </span>
          </h1>

          <div className="mt-7 flex flex-wrap items-center gap-6">
            <a
              href="/collection"
              className="group font-body inline-flex items-center gap-3 border-b border-aube-accent pb-1.5 text-xs font-medium uppercase tracking-[0.22em] text-aube-text transition-all hover:text-aube-accent hover:border-aube-text"
            >
              <span>Discover Your Signature</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Depth veil that darkens gently as the next section slides up over the stationary hero */}
      <div
        ref={veilRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 bg-[#1c140e] opacity-0 will-change-[opacity]"
      />
    </section>
  );
}

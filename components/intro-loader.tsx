"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    __ligeroIntroDone?: boolean;
  }
}

/**
 * Editorial entrance loader.
 * Renders immediately on frame 0 with zero flash of the webpage.
 * Displays the house mark and tagline gracefully in the center.
 * Then smoothly scales down and glides into the navbar logo target,
 * handing off with zero blink and pixel-perfect accuracy.
 */
export default function IntroLoader() {
  const [stage, setStage] = useState<"center" | "flying" | "done">("center");
  const [flightData, setFlightData] = useState<{
    deltaX: number;
    deltaY: number;
    scale: number;
  } | null>(null);

  const centerLogoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If intro was already executed in this session or reduced motion is preferred, skip immediately
    if (
      typeof window !== "undefined" &&
      (window.__ligeroIntroDone ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    ) {
      window.__ligeroIntroDone = true;
      window.dispatchEvent(new CustomEvent("ligero:intro-done"));
      setStage("done");
      return;
    }

    // Lock page scroll during entrance
    document.body.style.overflow = "hidden";

    // Pause gracefully in the center (450ms), then measure exact target & launch flight
    const flightTimer = setTimeout(() => {
      const targetEl = document.getElementById("site-header-logo-target");
      const centerEl = centerLogoRef.current;

      let deltaX = 0;
      let deltaY = 0;
      let scale = 0.58;

      if (targetEl && centerEl) {
        const tRect = targetEl.getBoundingClientRect();
        const cRect = centerEl.getBoundingClientRect();

        if (tRect.height > 0 && cRect.height > 0) {
          const tCenterX = tRect.left + tRect.width / 2;
          const tCenterY = tRect.top + tRect.height / 2;
          const cCenterX = cRect.left + cRect.width / 2;
          const cCenterY = cRect.top + cRect.height / 2;

          deltaX = tCenterX - cCenterX;
          deltaY = tCenterY - cCenterY;
          scale = tRect.height / cRect.height;
        }
      } else {
        const vpCenterY = window.innerHeight / 2;
        const targetCenterY = window.innerWidth >= 640 ? 40 : 32;
        deltaY = targetCenterY - vpCenterY;
        const isLg = window.innerWidth >= 1024;
        const isMd = window.innerWidth >= 768;
        const isSm = window.innerWidth >= 640;
        const targetH = isLg ? 34 : isMd ? 32 : isSm ? 28 : 24;
        const centerH = isLg ? 80 : isMd ? 64 : isSm ? 56 : 48;
        scale = targetH / centerH;
      }

      setFlightData({ deltaX, deltaY, scale });
      setStage("flying");
    }, 450);

    // Flight takes 850ms (finishes at t = 450 + 850 = 1300ms).
    // At t = 1300ms, hand off to navbar logo instantly:
    const handoffTimer = setTimeout(() => {
      window.__ligeroIntroDone = true;
      window.dispatchEvent(new CustomEvent("ligero:intro-done"));
    }, 1300);

    // At t = 1350ms (50ms overlap so there is zero gap or flicker), unmount loader & unlock scroll:
    const doneTimer = setTimeout(() => {
      document.body.style.overflow = "";
      setStage("done");
    }, 1350);

    // Safety fallback
    const safetyTimer = setTimeout(() => {
      window.__ligeroIntroDone = true;
      window.dispatchEvent(new CustomEvent("ligero:intro-done"));
      document.body.style.overflow = "";
      setStage("done");
    }, 2500);

    return () => {
      clearTimeout(flightTimer);
      clearTimeout(handoffTimer);
      clearTimeout(doneTimer);
      clearTimeout(safetyTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (stage === "done") {
    return null;
  }

  const isFlying = stage === "flying";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
    >
      {/* Veil background curtain that dissolves to reveal the page */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isFlying ? 0 : 1 }}
        transition={{
          duration: 0.65,
          delay: isFlying ? 0.35 : 0,
          ease: [0.65, 0, 0.35, 1],
        }}
        className="pointer-events-auto absolute inset-0 bg-[#F0E2D6]"
      />

      {/* Centered logo container with fixed aspect ratio matching the logo perfectly */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <motion.div
          ref={centerLogoRef}
          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          animate={
            isFlying && flightData
              ? {
                  x: flightData.deltaX,
                  y: flightData.deltaY,
                  scale: flightData.scale,
                  opacity: 1,
                }
              : {
                  x: 0,
                  y: 0,
                  scale: 1,
                  opacity: 1,
                }
          }
          transition={{
            duration: 0.85,
            ease: [0.76, 0, 0.24, 1],
          }}
          style={{
            transformOrigin: "center center",
          }}
          className="relative flex items-center justify-center h-12 sm:h-14 md:h-16 lg:h-20 aspect-[1017/273]"
        >
          <Image
            src="/images/ligero-logo.png"
            alt="Ligero Parfum"
            width={1017}
            height={273}
            priority
            className="h-full w-full object-contain"
          />
        </motion.div>

        {/* Quiet house tagline that dissolves as flight commences */}
        <motion.p
          initial={{ opacity: 0.65, y: 0 }}
          animate={{
            opacity: isFlying ? 0 : 0.65,
            y: isFlying ? -6 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="pointer-events-none absolute -bottom-8 whitespace-nowrap text-[10px] uppercase tracking-[0.26em] text-aube-text-muted"
        >
          Seven perfumes, all permanent.
        </motion.p>
      </div>
    </div>
  );
}

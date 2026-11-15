"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, TransitionEvent } from "react";

declare global {
  interface Window {
    __ligeroIntroDone?: boolean;
  }
}

/**
 * Editorial entrance loader.
 * Renders only on the home page ('/').
 * Veil palette matches navbar (#1c140e).
 * Holds the house mark at its CSS-breakpoint scale from first paint (no initial grow/pop),
 * then smoothly shrinks the veil and glides the logo directly into the navbar crest target,
 * handing off seamlessly with zero flash, jump, or blink.
 */
export default function IntroLoader() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [stage, setStage] = useState<"center" | "flying" | "done">("center");
  const [flightData, setFlightData] = useState<{
    deltaX: number;
    deltaY: number;
    targetHeight: number;
  } | null>(null);

  const veilRef = useRef<HTMLDivElement>(null);
  const centerLogoRef = useRef<HTMLDivElement>(null);
  const prevOverflowRef = useRef<string>("");
  const handoffStartedRef = useRef<boolean>(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const finishHandoff = useCallback(() => {
    if (handoffStartedRef.current) return;
    handoffStartedRef.current = true;

    // 1. Reveal navbar logo immediately underneath:
    window.__ligeroIntroDone = true;
    window.dispatchEvent(new CustomEvent("ligero:intro-done"));

    // 2. Unmount loader after double rAF + buffer so handoff has zero blink:
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const unmountTimer = setTimeout(() => {
          document.body.style.overflow = prevOverflowRef.current || "";
          setStage("done");
        }, 60);
        timersRef.current.push(unmountTimer);
      });
    });
  }, []);

  useEffect(() => {
    if (!isHome) {
      window.__ligeroIntroDone = true;
      setStage("done");
      return;
    }

    // Skip immediately if intro already played in this session/window or reduced motion is active
    let alreadySeenInSession = false;
    try {
      alreadySeenInSession = sessionStorage.getItem("ligero_intro_seen") === "1";
    } catch {
      // sessionStorage unavailable
    }

    if (
      typeof window !== "undefined" &&
      (window.__ligeroIntroDone ||
        alreadySeenInSession ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    ) {
      window.__ligeroIntroDone = true;
      window.dispatchEvent(new CustomEvent("ligero:intro-done"));
      setStage("done");
      return;
    }

    try {
      sessionStorage.setItem("ligero_intro_seen", "1");
    } catch {
      // sessionStorage unavailable
    }

    // Ensure page starts at top and lock scrolling during the intro
    window.scrollTo(0, 0);
    prevOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Brief center hold (140ms) at steady initial scale, then compute target & begin flight
    const flightTimer = setTimeout(() => {
      const targetEl = document.getElementById("site-header-logo-target");
      const centerEl = centerLogoRef.current;
      const headerEl = document.querySelector("header");

      const isLg = window.innerWidth >= 1024;
      const isSm = window.innerWidth >= 640;
      const navH = headerEl
        ? headerEl.getBoundingClientRect().height
        : isLg
          ? 72
          : isSm
            ? 70
            : 64;

      let deltaX = 0;
      let deltaY = 0;

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
        }
      } else {
        const vpCenterY = window.innerHeight / 2;
        const targetCenterY = navH / 2;
        deltaY = targetCenterY - vpCenterY;
      }

      setFlightData({ deltaX, deltaY, targetHeight: navH });
      setStage("flying");
    }, 140);

    // Safety fallback: if anything hangs, unlock scroll and complete
    const safetyTimer = setTimeout(() => {
      finishHandoff();
    }, 1400);

    return () => {
      clearTimeout(flightTimer);
      clearTimeout(safetyTimer);
      for (const timer of timersRef.current) {
        clearTimeout(timer);
      }
      timersRef.current = [];
      document.body.style.overflow = prevOverflowRef.current || "";
    };
  }, [isHome, finishHandoff]);

  useEffect(() => {
    if (stage !== "flying") return;

    const veilEl = veilRef.current;
    let innerRafId = 0;
    let fallbackTimer: ReturnType<typeof setTimeout> | undefined;

    // Wait two frames so CSS transitions have started before checking getAnimations()
    const outerRafId = requestAnimationFrame(() => {
      innerRafId = requestAnimationFrame(() => {
        if (veilEl && veilEl.getAnimations().length === 0) {
          finishHandoff();
          return;
        }
        fallbackTimer = setTimeout(finishHandoff, 550);
      });
    });

    return () => {
      cancelAnimationFrame(outerRafId);
      cancelAnimationFrame(innerRafId);
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  }, [stage, finishHandoff]);

  const handleVeilTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (stage !== "flying") return;
    if (event.target !== veilRef.current || event.propertyName !== "transform") return;
    finishHandoff();
  };

  if (!isHome || stage === "done") {
    return null;
  }

  const isFlying = stage === "flying" && flightData !== null;

  return (
    <div
      aria-hidden="true"
      className="intro-loader-root pointer-events-none fixed inset-0 z-50 overflow-hidden"
    >
      {/* Veil background curtain:
          Starts full screen in exact navbar color (#1c140e).
          Slides upward until only navbar height remains, revealing the page hero beneath. */}
      <div
        ref={veilRef}
        data-flying={isFlying ? "true" : undefined}
        style={
          isFlying
            ? ({
                "--intro-veil-ty": `calc(-100% + ${flightData.targetHeight}px)`,
              } as CSSProperties)
            : undefined
        }
        onTransitionEnd={handleVeilTransitionEnd}
        className="intro-loader-veil pointer-events-auto fixed inset-0 bg-[#1c140e] border-b border-[#382a20]/90"
      />

      {/* Centered logo container:
          Starts at its responsive CSS scale from first paint (no initial grow/pop),
          then glides & scales into the exact navbar crest coordinates. */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
        <div
          ref={centerLogoRef}
          data-flying={isFlying ? "true" : undefined}
          style={
            isFlying
              ? ({
                  "--intro-tx": `${flightData.deltaX}px`,
                  "--intro-ty": `${flightData.deltaY}px`,
                } as CSSProperties)
              : undefined
          }
          className="intro-loader-logo relative flex flex-col items-center justify-center text-center select-none"
        >
          <span className="font-display text-lg font-medium uppercase leading-tight tracking-[0.24em] pl-[0.24em] sm:text-xl sm:tracking-[0.28em] sm:pl-[0.28em] lg:text-[23px] text-[#FDFBF7]">
            Ligéro
          </span>
          <span
            aria-hidden="true"
            className="mt-0.5 font-display text-[11px] font-semibold uppercase leading-none tracking-[0.36em] pl-[0.36em] sm:text-[12px] sm:tracking-[0.40em] sm:pl-[0.40em] text-[#d89f68]"
          >
            Parfums
          </span>

          {/* House tagline: dissolves as flight commences */}
          <p
            data-flying={isFlying ? "true" : undefined}
            className="intro-loader-tagline pointer-events-none absolute -bottom-7 whitespace-nowrap text-[9px] sm:text-[10px] uppercase tracking-[0.28em] text-[#E6DDD0]/75"
          >
            An intimate obsession.
          </p>
        </div>
      </div>
    </div>
  );
}

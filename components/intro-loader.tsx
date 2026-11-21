"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AnimationEvent } from "react";

declare global {
  interface Window {
    __ligeroIntroDone?: boolean;
  }
}

/**
 * Editorial entrance loader.
 * Runs entirely via GPU-composited CSS keyframes from first paint (no JS hydration wait,
 * no getBoundingClientRect() forced reflow, no body overflow thrashing), then hands off
 * cleanly to the navbar crest and unmounts once the veil reaches `--header-offset`.
 */
export default function IntroLoader() {
  const [done, setDone] = useState<boolean>(() => {
    if (typeof window !== "undefined" && window.__ligeroIntroDone) {
      return true;
    }
    return false;
  });

  const veilRef = useRef<HTMLDivElement>(null);
  const handoffStartedRef = useRef<boolean>(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const finishHandoff = useCallback((immediate = false) => {
    if (handoffStartedRef.current) return;
    handoffStartedRef.current = true;

    window.__ligeroIntroDone = true;
    try {
      sessionStorage.setItem("ligero_intro_seen", "1");
    } catch {
      // sessionStorage unavailable
    }
    window.dispatchEvent(new CustomEvent("ligero:intro-done"));

    if (immediate) {
      setDone(true);
      return;
    }

    requestAnimationFrame(() => {
      const unmountTimer = setTimeout(() => {
        setDone(true);
      }, 40);
      timersRef.current.push(unmountTimer);
    });
  }, []);

  useEffect(() => {
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
      finishHandoff(true);
      return;
    }

    // Safety fallback matching 100ms delay + 550ms CSS animation duration
    const safetyTimer = setTimeout(() => {
      finishHandoff(false);
    }, 750);

    return () => {
      clearTimeout(safetyTimer);
      for (const timer of timersRef.current) {
        clearTimeout(timer);
      }
      timersRef.current = [];
    };
  }, [finishHandoff]);

  const handleVeilAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target !== veilRef.current) return;
    finishHandoff(false);
  };

  if (done) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="intro-loader-root pointer-events-none fixed inset-0 z-50 overflow-hidden"
    >
      {/* Veil background curtain: lifts via pure CSS keyframes straight to navbar height */}
      <div
        ref={veilRef}
        onAnimationEnd={handleVeilAnimationEnd}
        className="intro-loader-veil pointer-events-none fixed inset-0 bg-[#1c140e] border-b border-[#382a20]/90"
      />

      {/* Centered logo container: glides via pure CSS keyframes directly into navbar crest */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
        <div className="intro-loader-logo relative flex flex-col items-center justify-center text-center select-none">
          <span className="font-display text-lg font-medium uppercase leading-tight tracking-[0.24em] pl-[0.24em] sm:text-xl sm:tracking-[0.28em] sm:pl-[0.28em] lg:text-[23px] text-[#FDFBF7]">
            Ligéro
          </span>
          <span
            aria-hidden="true"
            className="mt-0.5 font-display text-[11px] font-semibold uppercase leading-none tracking-[0.36em] pl-[0.36em] sm:text-[12px] sm:tracking-[0.40em] sm:pl-[0.40em] text-[#d89f68]"
          >
            Parfums
          </span>

          <p className="intro-loader-tagline pointer-events-none absolute -bottom-7 whitespace-nowrap text-[9px] sm:text-[10px] uppercase tracking-[0.28em] text-[#E6DDD0]/75">
            An intimate obsession.
          </p>
        </div>
      </div>
    </div>
  );
}

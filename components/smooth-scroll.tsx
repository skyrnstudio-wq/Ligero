"use client";

import { useEffect, useRef, createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

/**
 * SmoothScrollProvider:
 * Lazily imports and initializes Lenis smooth inertial scrolling ONLY on desktop
 * fine-pointer devices (zero Lenis JS downloaded on mobile/touch or reduced-motion).
 */
export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    // Skip smooth scrolling inside Sanity Studio, on touch devices, and when reduced motion is preferred
    if (
      pathname?.startsWith("/studio") ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(hover: none), (pointer: coarse)").matches ||
      navigator.maxTouchPoints > 0 ||
      !window.matchMedia("(pointer: fine)").matches
    ) {
      return;
    }

    let cancelled = false;
    let instance: Lenis | null = null;

    void import("lenis").then(({ default: LenisCtor }) => {
      if (cancelled) return;
      instance = new LenisCtor({
        autoRaf: true,
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 1,
        touchMultiplier: 1.2,
        anchors: {
          offset: -70,
          duration: 1.2,
        },
      });

      lenisRef.current = instance;
      (window as unknown as { __lenis?: Lenis }).__lenis = instance;
    });

    return () => {
      cancelled = true;
      if (instance) {
        instance.destroy();
        instance = null;
      }
      lenisRef.current = null;
      (window as unknown as { __lenis?: unknown }).__lenis = undefined;
    };
  }, [pathname]);

  // Reset scroll to top only on actual client route changes
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      }
    }
  }, [pathname]);

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  );
}

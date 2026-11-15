"use client";

import { useEffect, useRef, createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

/**
 * SmoothScrollProvider:
 * Integrates Lenis smooth inertial scrolling across the entire application.
 * Utilizes Lenis native autoRaf, built-in anchor navigation offset, and
 * instantaneous scroll restoration on route changes.
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

    const lenis = new Lenis({
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

    lenisRef.current = lenis;

    // Expose lenis instance globally on window
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      lenis.destroy();
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

"use client";

import Link from "next/link";

/**
 * Movement 1: The Silk Emporium Hero
 * 
 * Spec Measurements & Layout (Comp 1376x768):
 * - hero-silk-flacon: left 0%, top 10.42%, width 59.59%, height 82.03% (820x630px)
 * - cotton-canvas-texture: tiled ground texture (360x120px region)
 * - hero-headline: left 61.05%, top 32.55%, width 32.70%, height 20.83% (450x160px, inkBox x 16, y 19, w 362, h 128)
 * - hero-subline: left 61.05%, top 54.69%, width 30.52%, height 6.51% (420x50px, inkBox x 16, y 3, w 307, h 38)
 * - hero-cta: left 61.05%, top 63.80%, width 15.26%, height 6.51% (210x50px, inkBox x 14, y 2, w 196, h 41)
 * - silk-swatches-strip: left 0%, top 92.45%, width 100%, height 7.55% (1376x58px)
 */

export default function Hero() {
  return (
    <section
      aria-label="Ligero Parfum — The Silk Emporium"
      className="relative w-full overflow-hidden bg-[#f1ebe4] text-[#100b0a] aspect-[1376/768] min-h-[768px] max-lg:h-auto max-lg:aspect-auto max-lg:min-h-0 max-lg:pb-12"
      style={{
        backgroundImage: "url('/assets/plates/cotton-canvas-texture.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "720px 360px",
      }}
    >
      {/* Container matching comp aspect ratio */}
      <div className="relative w-full h-full max-lg:h-auto">
        {/* Region 4: hero-silk-flacon plate (820x630px, x: 0, y: 80) */}
        <div
          data-region="hero-silk-flacon"
          className="absolute left-0 top-[10.42%] w-[59.59%] h-[82.03%] z-10 pointer-events-none select-none max-lg:relative max-lg:top-0 max-lg:w-full max-lg:h-[460px]"
        >
          <img
            src="/assets/plates/hero-silk-flacon.png"
            alt="Ligero flacon nestled in folds of raw amber and soot silk"
            className="w-full h-full object-cover object-left-top block"
            loading="eager"
          />
        </div>

        {/* Region 5: cotton-canvas-texture reference */}
        <div
          data-region="cotton-canvas-texture"
          className="sr-only"
          aria-hidden="true"
        >
          <img src="/assets/plates/cotton-canvas-texture.png" alt="" />
        </div>

        {/* Region 6: hero-headline (450x160px, x: 840, y: 250) */}
        <div
          data-region="hero-headline"
          className="absolute left-[61.05%] top-[32.55%] w-[32.70%] h-[20.83%] z-20 flex flex-col justify-start max-lg:relative max-lg:left-0 max-lg:top-0 max-lg:w-full max-lg:px-8 max-lg:pt-6"
          style={{ paddingLeft: "16px", paddingTop: "18px" }}
        >
          <h1
            className="font-serif text-[66px] leading-[1.05] tracking-[-0.02em] text-[#0a0a0a] font-normal select-none max-xl:text-[54px] max-lg:text-[40px]"
            style={{ fontFamily: "'Adamina', var(--font-cormorant), 'Didot', serif" }}
          >
            Scent, worn<br />like silk.
          </h1>
        </div>

        {/* Region 7: hero-subline (420x50px, x: 840, y: 420) */}
        <div
          data-region="hero-subline"
          className="absolute left-[61.05%] top-[54.69%] w-[30.52%] h-[6.51%] z-20 flex flex-col justify-start max-lg:relative max-lg:left-0 max-lg:top-0 max-lg:w-full max-lg:px-8 max-lg:mt-4"
          style={{ paddingLeft: "16px", paddingTop: "3px" }}
        >
          <p className="text-[21px] leading-[1.25] text-[#100f0e] font-normal tracking-[-0.01em] select-none max-lg:text-[17px]">
            Seven perfumes. Rested ninety days<br />in small batches.
          </p>
        </div>

        {/* Region 8: hero-cta (210x50px, x: 840, y: 490, inkBox x 14, y 2, w 196, h 41) */}
        <div
          data-region="hero-cta"
          className="absolute left-[61.05%] top-[63.80%] w-[15.26%] h-[6.51%] z-20 flex items-start justify-start max-lg:relative max-lg:left-0 max-lg:top-0 max-lg:w-auto max-lg:px-8 max-lg:mt-6"
        >
          <Link
            href="#collection"
            style={{
              marginLeft: "23px",
              marginTop: "2px",
              width: "196px",
              height: "41px",
            }}
            className="border border-[#0d0b0a] flex items-center justify-center text-[13px] tracking-[0.06em] text-[#0d0b0a] font-normal transition-all duration-300 hover:bg-[#0d0b0a] hover:text-[#f1ebe4] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#0d0b0a]"
          >
            Explore the Collection
          </Link>
        </div>

        {/* Region 9: silk-swatches-strip plate (1376x58px, x: 0, y: 710) */}
        <div
          data-region="silk-swatches-strip"
          className="absolute left-0 top-[92.45%] w-full h-[7.55%] z-30 overflow-hidden max-lg:relative max-lg:h-14"
        >
          <img
            src="/assets/plates/silk-swatches-strip.png"
            alt="Seven raw silk swatches preview"
            className="w-full h-full object-cover object-top block select-none"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
}

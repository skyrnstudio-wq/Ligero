"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import type { Product } from "@/lib/products";

interface ProductGalleryProps {
  product?: Product;
  images?: string[];
  productName?: string;
  name?: string;
  primaryImage?: string;
  galleryImages?: string[];
  isDark?: boolean;
}

function splitNotesList(raw?: string): string[] {
  if (!raw) return [];
  return raw
    .split("·")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);
}

export default function ProductGallery({
  product,
  images,
  productName,
  name,
  primaryImage,
  galleryImages,
}: ProductGalleryProps) {
  const displayName = product?.name || productName || name || "Perfume";
  const slug = product?.slug || "aube";

  const cutoutImage = `/images/perfumes/cutouts/${slug}.webp?v=2`;
  const botanicalImage = `/images/perfumes/notes/${slug}.webp`;
  const editorialImage = product?.image || `/images/perfumes/${slug}-scene.webp`;
  const inHandImage = `/images/perfumes/${slug}-in-hand.webp`;
  const boxImage = "/images/perfumes/box.webp";

  const initialList =
    images && images.length > 0
      ? images
      : (product?.gallery && product.gallery.length > 0)
      ? product.gallery
      : [
          cutoutImage,
          editorialImage,
          inHandImage,
          botanicalImage,
          boxImage,
          primaryImage,
          ...(galleryImages || []),
        ].filter(Boolean) as string[];

  const allImages = Array.from(new Set(initialList));

  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const openLightboxAt = (imgUrl: string) => {
    const idx = allImages.indexOf(imgUrl);
    setActiveIndex(idx >= 0 ? idx : 0);
    setIsLightboxOpen(true);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowRight") {
        setActiveIndex((prev) => (prev + 1) % allImages.length);
      }
      if (e.key === "ArrowLeft") {
        setActiveIndex(
          (prev) => (prev - 1 + allImages.length) % allImages.length
        );
      }
    },
    [isLightboxOpen, allImages.length]
  );

  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen, handleKeyDown]);

  const topNotes = splitNotesList(product?.scentProfile?.top);
  const heartNotes = splitNotesList(product?.scentProfile?.heart);
  const baseNotes = splitNotesList(product?.scentProfile?.base);

  const currentLightboxImage = allImages[activeIndex] || cutoutImage;

  return (
    <div className="flex flex-col">
      {/* 1. Primary Studio Plinth with Upright Bottle Cutout & Soft Left-Cast Shadow */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => openLightboxAt(cutoutImage)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openLightboxAt(cutoutImage);
          }
        }}
        aria-label={`Inspect ${displayName} studio flacon`}
        className="group relative aspect-[5/5.2] w-full cursor-zoom-in overflow-hidden bg-pdp-surface2 focus-visible:outline-2 focus-visible:outline-pdp-text"
      >
        {/* Warm studio radial vignette */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_52%_54%,var(--pdp-glow)_0%,transparent_75%)]"
        />

        <div className="relative flex h-full w-full items-center justify-center p-12 sm:p-18 lg:p-22">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-11 left-1/2 h-5.5 w-[42%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(28,20,14,0.34)_0%,rgba(28,20,14,0.14)_54%,transparent_80%)] blur-[4px] transition-all duration-700 group-hover:scale-x-95"
          />
          <div className="relative h-full w-full max-w-[275px] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]">
            <Image
              src={cutoutImage}
              alt={`${displayName} Extrait de Parfum bottle`}
              fill
              priority
              sizes="(max-width: 1024px) 85vw, 42vw"
              className="object-contain object-center [filter:drop-shadow(-20px_26px_26px_rgba(28,20,14,0.28))_drop-shadow(0_8px_14px_rgba(28,20,14,0.16))]"
            />
          </div>
        </div>
      </div>

      {/* 2. Staggered 2-Column Editorial Collage Grid (matching D.S. & DURGA left column) */}
      <div className="mx-auto w-full max-w-[640px] px-4 pt-4 sm:px-8">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 items-start">
          {/* Left Sub-Column: In-Hand Tactile Scale (3:4) + Editorial Mood Portrait (3:4) */}
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Tile 1: In-Hand Tactile Scale Plate with subtle video-style HUD */}
            <button
              type="button"
              onClick={() => openLightboxAt(inHandImage)}
              className="group relative aspect-[3/4] w-full overflow-hidden bg-pdp-surface2 text-left focus-visible:outline-2 focus-visible:outline-pdp-text"
              aria-label={`View ${displayName} tactile scale in hand`}
            >
              <Image
                src={inHandImage}
                alt={`${displayName} 50ml flacon held in hand`}
                fill
                sizes="(max-width: 1024px) 45vw, 24vw"
                className="object-cover object-center opacity-90 transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#101418]/85 via-[#101418]/20 to-transparent"
              />
              <div className="absolute inset-x-3 bottom-3 z-10 flex flex-col gap-2 text-[#EAE6DC]">
                <p className="font-display text-sm italic leading-snug text-[#EAE6DC] sm:text-base">
                  &ldquo;Handcrafted with rare botanical extracts.&rdquo;
                </p>
                <div className="flex items-center justify-between border-t border-[#EAE6DC]/25 pt-1.5 font-body text-[9.5px] uppercase tracking-[0.16em] text-[#EAE6DC]/80">
                  <span className="inline-flex items-center gap-1.5">
                    <span aria-hidden="true" className="text-[8px]">▶</span>
                    <span>In-Hand Scale</span>
                  </span>
                  <span>50 ml Flacon</span>
                </div>
              </div>
            </button>

            {/* Tile 2: Editorial Bottle / Mood Portrait (3:4) */}
            <button
              type="button"
              onClick={() => openLightboxAt(editorialImage)}
              className="group relative aspect-[3/4] w-full overflow-hidden bg-pdp-surface2 focus-visible:outline-2 focus-visible:outline-pdp-text"
              aria-label={`View ${displayName} campaign portrait`}
            >
              <Image
                src={editorialImage}
                alt={`${displayName} editorial campaign photograph`}
                fill
                sizes="(max-width: 1024px) 45vw, 24vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            </button>
          </div>

          {/* Right Sub-Column: Raw Botanical Landscape (1:1) + Presentation Box (1:1) */}
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Tile 3: Botanical Field / Raw Ingredients (1:1) */}
            <button
              type="button"
              onClick={() => openLightboxAt(botanicalImage)}
              className="group relative aspect-square w-full overflow-hidden bg-pdp-surface2 focus-visible:outline-2 focus-visible:outline-pdp-text"
              aria-label={`View raw botanicals of ${displayName}`}
            >
              <Image
                src={botanicalImage}
                alt={`Raw botanicals for ${displayName}`}
                fill
                sizes="(max-width: 1024px) 45vw, 24vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            </button>

            {/* Tile 4: Presentation Rigid Box (1:1) */}
            <button
              type="button"
              onClick={() => openLightboxAt(boxImage)}
              className="group relative aspect-square w-full overflow-hidden bg-pdp-surface2 focus-visible:outline-2 focus-visible:outline-pdp-text"
              aria-label={`View ${displayName} presentation box`}
            >
              <Image
                src={boxImage}
                alt={`Ligéro rigid presentation box, 50ml case`}
                fill
                sizes="(max-width: 1024px) 45vw, 24vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#101418]/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
              <div className="absolute inset-x-3 bottom-3 z-10 hidden font-body text-[9.5px] uppercase tracking-[0.16em] text-[#EAE6DC] transition-all group-hover:block">
                Presentation Box
              </div>
            </button>
          </div>
        </div>

        {/* 3. Three-Column Divided Top / Heart / Base Notes Summary Table */}
        {(topNotes.length > 0 || heartNotes.length > 0 || baseNotes.length > 0) && (
          <div
            aria-label="Olfactory pyramid summary"
            className="mt-10 mb-4 grid grid-cols-3 divide-x divide-pdp-text/25 py-3 text-center"
          >
            <div className="px-2 sm:px-4">
              <p className="font-body text-[9px] font-medium uppercase tracking-[0.2em] text-pdp-muted">
                Top Notes
              </p>
              <ul className="mt-3 space-y-1 font-body text-xs font-medium leading-snug text-pdp-text sm:text-[13px]">
                {topNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>

            <div className="px-2 sm:px-4">
              <p className="font-body text-[9px] font-medium uppercase tracking-[0.2em] text-pdp-muted">
                Heart Notes
              </p>
              <ul className="mt-3 space-y-1 font-body text-xs font-medium leading-snug text-pdp-text sm:text-[13px]">
                {heartNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>

            <div className="px-2 sm:px-4">
              <p className="font-body text-[9px] font-medium uppercase tracking-[0.2em] text-pdp-muted">
                Base Notes
              </p>
              <ul className="mt-3 space-y-1 font-body text-xs font-medium leading-snug text-pdp-text sm:text-[13px]">
                {baseNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Full-Screen Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex flex-col justify-between bg-pdp-base/96 p-6 text-pdp-text backdrop-blur-md sm:p-10"
            onClick={() => setIsLightboxOpen(false)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-2xl font-normal sm:text-3xl">
                  {displayName}
                </h3>
                <p className="mt-0.5 font-body text-[10px] uppercase tracking-[0.22em] text-pdp-muted">
                  Plate {activeIndex + 1} of {allImages.length}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="border border-pdp-hairline px-4 py-2 font-body text-xs uppercase tracking-[0.2em] text-pdp-text transition-colors hover:border-pdp-text"
                aria-label="Close enlarged view"
              >
                Close [Esc] ✕
              </button>
            </div>

            <div
              className="relative mx-auto my-auto h-[68vh] w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={currentLightboxImage}
                alt={`${displayName} enlarged view`}
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
            </div>

            <div
              className="flex items-center justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex(
                      (prev) =>
                        (prev - 1 + allImages.length) % allImages.length
                    )
                  }
                  className="border border-pdp-hairline px-3 py-1.5 font-body text-xs uppercase tracking-[0.18em] text-pdp-text transition-colors hover:border-pdp-text"
                >
                  ← Previous
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex((prev) => (prev + 1) % allImages.length)
                  }
                  className="border border-pdp-hairline px-3 py-1.5 font-body text-xs uppercase tracking-[0.18em] text-pdp-text transition-colors hover:border-pdp-text"
                >
                  Next →
                </button>
              </div>

              <p className="font-body text-[10px] uppercase tracking-[0.2em] text-pdp-muted">
                Press Esc to return
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

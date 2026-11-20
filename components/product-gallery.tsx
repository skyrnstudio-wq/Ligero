"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  getPerfumeCutoutImage,
  getPerfumeNotesImage,
  isStaticPerfumeSlug,
  type Product,
} from "@/lib/products";

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
  const isStatic = isStaticPerfumeSlug(slug);

  const cutoutImage = getPerfumeCutoutImage(
    product || { slug, image: primaryImage || "" }
  );
  const notesImage = getPerfumeNotesImage(product || { slug });

  const sanityGallery = (
    product?.gallery && product.gallery.length > 0
      ? product.gallery
      : galleryImages || []
  ).filter((url) => Boolean(url) && url !== cutoutImage);
  const hasRemoteGallery = sanityGallery.some((u) => u.startsWith("http"));

  const defaultBoxImage = "/images/perfumes/box.webp";
  const defaultTrayImage =
    slug === "fleur"
      ? "/images/perfumes/fleur-tray.webp"
      : "/images/perfumes/tray.webp";

  let inHandImage: string;
  let editorialImage: string;
  let botanicalImage: string;
  let boxImage: string;
  let collectionTrayImage: string;

  if (!isStatic) {
    inHandImage = sanityGallery[0] || cutoutImage;
    editorialImage = sanityGallery[1] || sanityGallery[0] || cutoutImage;
    botanicalImage = notesImage || sanityGallery[2] || cutoutImage;
    boxImage = sanityGallery[3] || defaultBoxImage;
    collectionTrayImage = sanityGallery[4] || defaultTrayImage;
  } else if (hasRemoteGallery) {
    const startIdx = sanityGallery.length >= 6 ? 1 : 0;
    editorialImage =
      sanityGallery[startIdx] || `/images/perfumes/${slug}-scene.webp`;
    inHandImage =
      sanityGallery[startIdx + 1] || `/images/perfumes/${slug}-in-hand.webp`;
    botanicalImage =
      notesImage ||
      sanityGallery[startIdx + 2] ||
      `/images/perfumes/notes/${slug}.webp`;
    boxImage = sanityGallery[startIdx + 3] || defaultBoxImage;
    collectionTrayImage = sanityGallery[startIdx + 4] || defaultTrayImage;
  } else {
    inHandImage = `/images/perfumes/${slug}-in-hand.webp`;
    editorialImage = product?.image || `/images/perfumes/${slug}-scene.webp`;
    botanicalImage = notesImage || `/images/perfumes/notes/${slug}.webp`;
    boxImage = defaultBoxImage;
    collectionTrayImage = defaultTrayImage;
  }

  const initialList =
    images && images.length > 0
      ? images
      : ([
          cutoutImage,
          inHandImage,
          editorialImage,
          botanicalImage,
          boxImage,
          collectionTrayImage,
          primaryImage,
          ...sanityGallery,
        ].filter(Boolean) as string[]);

  const allImages = Array.from(new Set(initialList));

  const primaryTileSet = new Set([
    cutoutImage,
    inHandImage,
    editorialImage,
    botanicalImage,
    boxImage,
    collectionTrayImage,
  ]);
  const galleryCandidates =
    isStatic && hasRemoteGallery && sanityGallery.length >= 6
      ? sanityGallery.slice(1)
      : sanityGallery;
  const extraGalleryImages = Array.from(
    new Set(galleryCandidates.filter((url) => !primaryTileSet.has(url)))
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const mobileTrackRef = useRef<HTMLDivElement | null>(null);
  const lightboxTouchStartX = useRef<number | null>(null);

  const handleMobileScroll = () => {
    const track = mobileTrackRef.current;
    if (!track) return;
    const slides = Array.from(
      track.querySelectorAll<HTMLElement>("[data-gallery-slide]")
    );
    if (slides.length === 0) return;
    const scrollLeft = track.scrollLeft;
    let closest = 0;
    let minDiff = Infinity;
    slides.forEach((slide, idx) => {
      const diff = Math.abs(slide.offsetLeft - scrollLeft);
      if (diff < minDiff) {
        minDiff = diff;
        closest = idx;
      }
    });
    setMobileIndex(closest);
  };

  const scrollMobileTo = (index: number) => {
    const track = mobileTrackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(allImages.length - 1, index));
    const slides = track.querySelectorAll<HTMLElement>("[data-gallery-slide]");
    const target = slides[clamped];
    if (target) {
      track.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
      setMobileIndex(clamped);
    }
  };

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
      {/* Mobile / Tablet: Unified Horizontal Swipe Gallery (Starts with Studio Flacon Cutout) */}
      <div className="flex flex-col lg:hidden">
        <div
          ref={mobileTrackRef}
          onScroll={handleMobileScroll}
          role="region"
          aria-roledescription="carousel"
          aria-label={`${displayName} image gallery`}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          className="flex snap-x snap-mandatory overflow-x-auto border-b border-pdp-hairline/60 bg-pdp-surface2 no-scrollbar touch-pan-x"
        >
          {allImages.map((imgUrl, idx) => {
            const isPrimaryFlacon = idx === 0 && imgUrl === cutoutImage;

            return (
              <div
                key={`${imgUrl}-${idx}`}
                data-gallery-slide
                className="relative aspect-[4/3.8] max-h-[44svh] w-full shrink-0 snap-center snap-always overflow-hidden bg-pdp-surface2"
              >
                <button
                  type="button"
                  onClick={() => openLightboxAt(imgUrl)}
                  aria-label={`Inspect ${displayName} view ${idx + 1} of ${allImages.length}`}
                  className="relative flex h-full w-full items-center justify-center focus-visible:outline-2 focus-visible:outline-pdp-text"
                >
                  {isPrimaryFlacon ? (
                    <>
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_52%_54%,var(--pdp-glow)_0%,transparent_75%)]"
                      />
                      <div className="relative flex h-full w-full items-center justify-center p-7 sm:p-10">
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute bottom-5 left-1/2 h-4 w-[42%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(28,20,14,0.32)_0%,rgba(28,20,14,0.12)_52%,transparent_76%)]"
                        />
                        <div className="relative h-full w-full max-w-[220px]">
                          <Image
                            src={imgUrl}
                            alt={`${displayName} Eau de Parfum bottle`}
                            fill
                            priority
                            fetchPriority="high"
                            decoding="sync"
                            quality={82}
                            sizes="(max-width: 640px) 220px, 50vw"
                            className="object-contain object-center md:[filter:drop-shadow(-14px_20px_20px_rgba(28,20,14,0.22))]"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <Image
                      src={imgUrl}
                      alt={`${displayName} gallery view ${idx + 1}`}
                      fill
                      loading="lazy"
                      fetchPriority="low"
                      quality={82}
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover object-center"
                    />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Mobile Gallery Controls: Slide Counter + Progress Bars + 44x44 Nav Buttons */}
        {allImages.length > 1 && (
          <div className="flex items-center justify-between border-b border-pdp-hairline/60 px-4 py-1.5">
            <span className="font-body text-[10px] uppercase tracking-[0.18em] text-pdp-muted tabular-nums">
              {String(mobileIndex + 1).padStart(2, "0")} /{" "}
              {String(allImages.length).padStart(2, "0")}
            </span>

            <div
              aria-hidden="true"
              className="flex items-center gap-1.5"
            >
              {allImages.slice(0, 8).map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    mobileIndex === idx
                      ? "w-4 bg-pdp-text"
                      : "w-1.5 bg-pdp-text/25"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => scrollMobileTo(mobileIndex - 1)}
                disabled={mobileIndex === 0}
                aria-label="Previous gallery image"
                className="flex h-11 w-11 min-h-11 min-w-11 items-center justify-center border border-pdp-hairline text-pdp-text transition-colors disabled:opacity-25"
              >
                <span aria-hidden="true" className="text-xs">←</span>
              </button>
              <button
                type="button"
                onClick={() => scrollMobileTo(mobileIndex + 1)}
                disabled={mobileIndex >= allImages.length - 1}
                aria-label="Next gallery image"
                className="flex h-11 w-11 min-h-11 min-w-11 items-center justify-center border border-pdp-hairline text-pdp-text transition-colors disabled:opacity-25"
              >
                <span aria-hidden="true" className="text-xs">→</span>
              </button>
            </div>
          </div>
        )}

        {/* Compact Mobile Olfactory Pyramid Summary */}
        {(topNotes.length > 0 || heartNotes.length > 0 || baseNotes.length > 0) && (
          <div
            aria-label="Olfactory pyramid summary"
            className="grid grid-cols-3 divide-x divide-pdp-text/20 border-b border-pdp-hairline/60 px-2 py-2.5 text-center"
          >
            <div className="px-1.5">
              <p className="font-body text-[8.5px] font-medium uppercase tracking-[0.18em] text-pdp-muted">
                Top
              </p>
              <ul className="mt-1 space-y-0.5 font-body text-[11px] font-medium leading-tight text-pdp-text">
                {topNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>

            <div className="px-1.5">
              <p className="font-body text-[8.5px] font-medium uppercase tracking-[0.18em] text-pdp-muted">
                Heart
              </p>
              <ul className="mt-1 space-y-0.5 font-body text-[11px] font-medium leading-tight text-pdp-text">
                {heartNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>

            <div className="px-1.5">
              <p className="font-body text-[8.5px] font-medium uppercase tracking-[0.18em] text-pdp-muted">
                Base
              </p>
              <ul className="mt-1 space-y-0.5 font-body text-[11px] font-medium leading-tight text-pdp-text">
                {baseNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Desktop: Primary Studio Plinth + Staggered 2-Column Editorial Collage */}
      <div className="hidden lg:flex lg:flex-col">
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
            className="pointer-events-none absolute bottom-11 left-1/2 h-5.5 w-[44%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(28,20,14,0.34)_0%,rgba(28,20,14,0.13)_52%,transparent_76%)] transition-all duration-700 group-hover:scale-x-95"
          />
          <div className="relative h-full w-full max-w-[275px] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]">
            <Image
              src={cutoutImage}
              alt={`${displayName} Eau de Parfum bottle`}
              fill
              priority
              fetchPriority="high"
              decoding="sync"
              quality={85}
              sizes="275px"
              className="object-contain object-center md:[filter:drop-shadow(-18px_24px_24px_rgba(28,20,14,0.24))]"
            />
          </div>
        </div>
      </div>

      {/* 2. Staggered 2-Column Editorial Collage Grid (matching D.S. & DURGA left column) */}
      <div className="mx-auto w-full max-w-[640px] px-4 pt-4 sm:px-8">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 items-start">
          {/* Left Sub-Column: In-Hand Tactile Scale (3:4) + Editorial Mood Portrait (3:4) */}
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Tile 1: In-Hand Tactile Scale Plate */}
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
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
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

          {/* Right Sub-Column: Raw Botanicals (1:1) + Presentation Box (1:1) + Marble Tray (1:1) */}
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
            </button>

            {/* Tile 5: Carved Marble Display Tray (1:1) */}
            <button
              type="button"
              onClick={() => openLightboxAt(collectionTrayImage)}
              className="group relative aspect-square w-full overflow-hidden bg-pdp-surface2 focus-visible:outline-2 focus-visible:outline-pdp-text"
              aria-label={`View ${displayName} flacon arranged on stone tray`}
            >
              <Image
                src={collectionTrayImage}
                alt={`${displayName} arranged on stone tray`}
                fill
                sizes="(max-width: 1024px) 45vw, 24vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            </button>
          </div>
        </div>

        {/* Additional Sanity Gallery Images */}
        {extraGalleryImages.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:mt-4 sm:gap-4">
            {extraGalleryImages.map((imgUrl, idx) => (
              <button
                key={imgUrl}
                type="button"
                onClick={() => openLightboxAt(imgUrl)}
                className="group relative aspect-[3/4] w-full overflow-hidden bg-pdp-surface2 focus-visible:outline-2 focus-visible:outline-pdp-text"
                aria-label={`View ${displayName} gallery image ${idx + 1}`}
              >
                <Image
                  src={imgUrl}
                  alt={`${displayName} editorial gallery photograph ${idx + 1}`}
                  fill
                  sizes="(max-width: 1024px) 45vw, 24vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              </button>
            ))}
          </div>
        )}

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
                className="inline-flex min-h-11 min-w-11 items-center justify-center border border-pdp-hairline px-4 py-2 font-body text-xs uppercase tracking-[0.2em] text-pdp-text transition-colors hover:border-pdp-text"
                aria-label="Close enlarged view"
              >
                Close [Esc] ✕
              </button>
            </div>

            <div
              className="relative mx-auto my-auto h-[68dvh] w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={(e) => {
                lightboxTouchStartX.current = e.touches[0]?.clientX ?? null;
              }}
              onTouchEnd={(e) => {
                const startX = lightboxTouchStartX.current;
                const endX = e.changedTouches[0]?.clientX;
                if (startX !== null && typeof endX === "number") {
                  const delta = endX - startX;
                  if (delta < -40) {
                    setActiveIndex((prev) => (prev + 1) % allImages.length);
                  } else if (delta > 40) {
                    setActiveIndex(
                      (prev) => (prev - 1 + allImages.length) % allImages.length
                    );
                  }
                }
                lightboxTouchStartX.current = null;
              }}
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
                  className="inline-flex min-h-11 min-w-11 items-center justify-center border border-pdp-hairline px-3.5 py-2 font-body text-xs uppercase tracking-[0.18em] text-pdp-text transition-colors hover:border-pdp-text"
                >
                  ← Previous
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex((prev) => (prev + 1) % allImages.length)
                  }
                  className="inline-flex min-h-11 min-w-11 items-center justify-center border border-pdp-hairline px-3.5 py-2 font-body text-xs uppercase tracking-[0.18em] text-pdp-text transition-colors hover:border-pdp-text"
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

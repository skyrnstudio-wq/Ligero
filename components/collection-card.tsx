"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Product } from "@/lib/products";
import { useCase } from "@/context/case-context";

/**
 * Catalog card for the collection grid (site-blueprint.md §4, gallery layout).
 * Botanical plate portrait + numeral price + one CTA. Enter on scroll only;
 * hover is confined to the plate and the underline (skill: one orchestrated
 * moment, no scattered micro-motion).
 */
export default function CollectionCard({ product, index }: { product: Product; index: number }) {
  const { addToCase } = useCase();

  const handleAdd = () => {
    addToCase({
      slug: product.slug,
      name: product.name,
      price: product.price,
      volume: product.volume,
      image: product.image,
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1], delay: (index % 3) * 0.08 }}
      className="flex h-full flex-col"
    >
      {/* Botanical plate (3:4 portrait) */}
      <Link
        href={`/collection/${product.slug}`}
        className="group relative block aspect-[3/4] w-full overflow-hidden border border-aube-hairline/60 bg-aube-surface"
        aria-label={`${product.name} — ${product.oneLiner}`}
      >
        <Image
          src={`/images/perfumes/notes/${product.slug}.webp`}
          alt={`${product.name} botanicals`}
          fill
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 44vw, 30vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-aube-base/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      </Link>

      {/* Caption block */}
      <div className="mt-5 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-2xl font-light italic tracking-[-0.01em] text-aube-text sm:text-3xl">
          <Link
            href={`/collection/${product.slug}`}
            className="decoration-aube-accent decoration-1 underline-offset-8 transition-colors hover:text-aube-accent hover:underline"
          >
            {product.name}
          </Link>
        </h3>
        <span className="flex-none font-display text-xl font-light text-aube-text sm:text-2xl">
          {product.price}
        </span>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-aube-text-muted">
        {product.oneLiner}
      </p>

      <div className="mt-auto flex flex-wrap items-baseline gap-x-4 pt-3">
        <span className="text-[11px] uppercase tracking-[0.18em] text-aube-text-muted">
          {product.volume}
        </span>
        <button
          type="button"
          onClick={handleAdd}
          className="text-[11px] font-medium uppercase tracking-[0.18em] text-aube-accent underline-offset-4 transition-colors hover:text-aube-text hover:underline active:scale-[0.98]"
        >
          Add to Case
        </button>
      </div>
    </motion.article>
  );
}

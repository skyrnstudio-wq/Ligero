"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/products";
import { useCase } from "@/context/case-context";

interface CollectionRowProps {
  product: Product;
  index: number;
}

export default function CollectionRow({ product, index }: CollectionRowProps) {
  const { addToCase } = useCase();
  const isImageRight = index % 2 === 1;

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
    <article className="border-b border-aube-hairline/70 py-20 lg:py-28">
      <div className={`mx-auto flex max-w-[112rem] flex-col gap-12 px-6 sm:px-10 lg:flex-row lg:items-center lg:gap-20 lg:px-16 ${
        isImageRight ? "lg:flex-row-reverse" : ""
      }`}>
        {/* Product Image Column (60% on desktop) */}
        <div className="relative aspect-[4/5] w-full overflow-hidden border border-aube-hairline/60 bg-aube-surface lg:w-7/12">
          <Link href={`/collection/${product.slug}`} className="group block h-full w-full">
            <Image
              src={product.image}
              alt={`${product.name} perfume bottle`}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-contain p-8 transition-transform duration-700 ease-out group-hover:scale-105 sm:p-12 lg:p-16"
            />
          </Link>
        </div>

        {/* Product Copy Column (40% on desktop) */}
        <div className="flex flex-col justify-center lg:w-5/12">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-aube-text-muted">
            {product.notesUppercase}
          </p>

          <h2 className="mt-4 font-display text-5xl font-light italic tracking-[-0.01em] text-aube-text sm:text-6xl lg:text-7xl">
            <Link href={`/collection/${product.slug}`} className="transition-colors hover:text-aube-accent">
              {product.name}
            </Link>
          </h2>

          <p className="mt-4 text-base font-normal text-aube-text-muted sm:text-lg">
            {product.oneLiner}
          </p>

          <div className="mt-4 flex items-baseline gap-4">
            <span className="font-display text-3xl font-light text-aube-text">
              {product.price}
            </span>
            <span className="text-[11px] uppercase tracking-[0.18em] text-aube-text-muted">
              {product.volume}
            </span>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={handleAdd}
              className="border border-aube-text bg-aube-text px-8 py-3.5 text-xs uppercase tracking-[0.22em] text-aube-base transition-all hover:border-aube-accent hover:bg-aube-accent"
            >
              Add to Case
            </button>
            <Link
              href={`/collection/${product.slug}`}
              className="border-b border-aube-hairline pb-1 text-xs uppercase tracking-[0.2em] text-aube-text transition-colors hover:border-aube-accent hover:text-aube-accent"
            >
              Open {product.name}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

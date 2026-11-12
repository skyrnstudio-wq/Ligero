"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Product } from "@/lib/products";
import { useCase } from "@/context/case-context";

interface ProductStickyBarProps {
  product: Product;
  isDark?: boolean;
}

export default function ProductStickyBar({
  product,
}: ProductStickyBarProps) {
  const [visible, setVisible] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCase, setIsCaseOpen } = useCase();

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 650);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cutout = `/images/perfumes/cutouts/${product.slug}.webp?v=2`;

  const handleAdd = () => {
    addToCase({
      slug: product.slug,
      name: product.name,
      price: product.price,
      volume: product.volume,
      image: cutout,
    });
    setAdded(true);
    setIsCaseOpen(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Sticky purchase bar"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-pdp-hairline bg-pdp-base/95 text-pdp-text backdrop-blur-md transition-all duration-300 lg:hidden"
    >
      <div className="mx-auto flex h-16 max-w-[112rem] items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-10 flex-none overflow-hidden bg-pdp-surface2">
            <Image
              src={cutout}
              alt={product.name}
              fill
              sizes="40px"
              className="object-contain p-1"
            />
          </div>
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-pdp-text">
              {product.name}
            </p>
            <p className="font-body text-xs text-pdp-muted tabular-nums">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="min-h-10 bg-pdp-btn px-5 py-2.5 font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-pdp-btn-text transition-colors hover:bg-pdp-btn-hover"
        >
          {added ? "Added" : "Add to Case"}
        </button>
      </div>
    </div>
  );
}

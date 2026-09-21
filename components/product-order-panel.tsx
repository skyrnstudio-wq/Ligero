"use client";

import { useState } from "react";
import { Product } from "@/lib/products";
import { useCase } from "@/context/case-context";

interface ProductOrderPanelProps {
  product: Product;
  isDark?: boolean;
}

export default function ProductOrderPanel({ product, isDark = false }: ProductOrderPanelProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCase } = useCase();

  const handleAdd = () => {
    addToCase(
      {
        slug: product.slug,
        name: product.name,
        price: product.price,
        volume: product.volume,
        image: product.image,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const btnBg = isDark
    ? "bg-noctis-accent text-noctis-base hover:bg-[#c9a76b] border-noctis-accent"
    : "bg-aube-text text-aube-base hover:bg-aube-accent hover:border-aube-accent border-aube-text";

  const borderColor = isDark ? "border-[#3A3F45]" : "border-aube-hairline";
  const textColor = isDark ? "text-[#EAE6DC]" : "text-aube-text";

  return (
    <div className="mt-8 flex flex-col gap-6">
      {/* Price and Volume */}
      <div className="flex items-baseline justify-between border-b pb-4 border-current/15">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-4xl font-light">{product.price}</span>
          <span className="text-xs uppercase tracking-[0.18em] opacity-70">
            {product.volume}
          </span>
        </div>
        <span className="text-[11px] uppercase tracking-[0.16em] opacity-60">
          In stock
        </span>
      </div>

      {/* Quantity Selector and CTA */}
      <div className="flex items-center gap-4">
        {/* Quantity */}
        <div className={`flex items-center border ${borderColor}`}>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className={`flex h-12 w-10 items-center justify-center text-sm ${textColor} transition-colors hover:opacity-70`}
          >
            −
          </button>
          <span className={`w-10 text-center text-xs font-medium ${textColor}`}>
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            aria-label="Increase quantity"
            className={`flex h-12 w-10 items-center justify-center text-sm ${textColor} transition-colors hover:opacity-70`}
          >
            +
          </button>
        </div>

        {/* Add to Case */}
        <button
          type="button"
          onClick={handleAdd}
          className={`flex-1 border py-3.5 text-xs uppercase tracking-[0.24em] transition-all ${btnBg}`}
        >
          {added ? "Added to Case" : "Add to Case"}
        </button>
      </div>

      <p className="text-[11px] leading-relaxed opacity-70">
        Prices in rupees, inclusive of all taxes. Free domestic delivery in four business days.
      </p>
    </div>
  );
}

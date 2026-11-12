"use client";

import { useState } from "react";
import { useCase } from "@/context/case-context";

export default function AddEnRouteButton({ className = "" }: { className?: string }) {
  const [added, setAdded] = useState(false);
  const { addToCase, setIsCaseOpen } = useCase();

  const handleAdd = () => {
    addToCase({
      slug: "en-route",
      name: "En Route",
      price: 499,
      volume: "Car Perfume · Cabin Diffuser",
      image: "/images/objects/car-perfume-floating.webp",
    });
    setIsCaseOpen(true);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      className={`border border-aube-text bg-aube-text px-8 py-4 text-xs uppercase tracking-[0.24em] text-aube-base transition-colors hover:border-aube-accent hover:bg-aube-accent active:scale-[0.98] ${className}`}
    >
      {added ? "Added to Case" : "Add to Case"}
    </button>
  );
}

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface CaseItem {
  slug: string;
  name: string;
  price: number;
  volume: string;
  image: string;
  quantity: number;
}

interface CaseContextType {
  items: CaseItem[];
  addToCase: (item: Omit<CaseItem, "quantity">, qty?: number) => void;
  removeFromCase: (slug: string) => void;
  updateQuantity: (slug: string, delta: number) => void;
  totalCount: number;
  subtotal: number;
  isCaseOpen: boolean;
  setIsCaseOpen: (open: boolean) => void;
}

const CaseContext = createContext<CaseContextType | undefined>(undefined);

export function CaseProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CaseItem[]>([]);
  const [isCaseOpen, setIsCaseOpen] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ligero_case");
      if (saved) setItems(JSON.parse(saved));
    } catch {
      // LocalStorage unavailable
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("ligero_case", JSON.stringify(items));
    } catch {
      // Ignore
    }
  }, [items]);

  const addToCase = (item: Omit<CaseItem, "quantity">, qty: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === item.slug);
      if (existing) {
        return prev.map((i) =>
          i.slug === item.slug ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { ...item, quantity: qty }];
    });
    setIsCaseOpen(true);
  };

  const removeFromCase = (slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  };

  const updateQuantity = (slug: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => {
          if (i.slug === slug) {
            const next = i.quantity + delta;
            return next > 0 ? { ...i, quantity: next } : null;
          }
          return i;
        })
        .filter(Boolean) as CaseItem[]
    );
  };

  const totalCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    <CaseContext.Provider
      value={{
        items,
        addToCase,
        removeFromCase,
        updateQuantity,
        totalCount,
        subtotal,
        isCaseOpen,
        setIsCaseOpen,
      }}
    >
      {children}
    </CaseContext.Provider>
  );
}

export function useCase() {
  const context = useContext(CaseContext);
  if (!context) {
    throw new Error("useCase must be used within a CaseProvider");
  }
  return context;
}

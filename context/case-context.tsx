"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useCatalog } from "@/context/catalog-context";
import { getPerfumeCutoutImage } from "@/lib/products";
import { MAX_DISTINCT_ITEMS, MAX_QUANTITY_PER_SKU } from "@/lib/checkout-validation";

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
  reconcileItems: (nextItems: CaseItem[]) => void;
  clearCase: () => void;
  giftNote: string;
  setGiftNote: (note: string) => void;
  totalCount: number;
  subtotal: number;
  isCaseOpen: boolean;
  setIsCaseOpen: (open: boolean) => void;
}

const CaseContext = createContext<CaseContextType | undefined>(undefined);

function isSafeCatalogImageUrl(value: unknown): value is string {
  if (typeof value !== "string" || !value.trim()) return false;
  const trimmed = value.trim();
  return (
    (trimmed.startsWith("/images/") && !trimmed.includes("..")) ||
    trimmed.startsWith("https://cdn.sanity.io/")
  );
}

function clampQuantity(qty: unknown): number {
  const n = Math.floor(Number(qty));
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(MAX_QUANTITY_PER_SKU, n);
}

export function CaseProvider({ children }: { children: React.ReactNode }) {
  const { perfumes, objects } = useCatalog();
  const [items, setItems] = useState<CaseItem[]>([]);
  const [giftNote, setGiftNoteState] = useState("");
  const [isCaseOpen, setIsCaseOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const normalizeWithCatalog = useCallback(
    (rawItems: unknown): CaseItem[] => {
      if (!Array.isArray(rawItems)) return [];
      const merged = new Map<string, CaseItem>();

      for (const entry of rawItems) {
        if (!entry || typeof entry !== "object") continue;
        const candidate = entry as Partial<CaseItem>;
        const slug = typeof candidate.slug === "string" ? candidate.slug.trim() : "";
        if (!slug) continue;

        const qty = clampQuantity(candidate.quantity);
        const perfume = perfumes.find((p) => p.slug === slug);
        const houseObj = !perfume ? objects.find((o) => o.slug === slug) : undefined;

        let resolvedItem: CaseItem | null = null;
        if (perfume && Number.isFinite(perfume.price) && perfume.price > 0) {
          resolvedItem = {
            slug: perfume.slug,
            name: perfume.name,
            price: perfume.price,
            volume: perfume.volume || "50 ml · Eau de Parfum",
            image: getPerfumeCutoutImage(perfume),
            quantity: qty,
          };
        } else if (houseObj && Number.isFinite(houseObj.price) && houseObj.price > 0) {
          resolvedItem = {
            slug: houseObj.slug,
            name: houseObj.name,
            price: houseObj.price,
            volume: houseObj.volume || "House Object",
            image: houseObj.image,
            quantity: qty,
          };
        } else if (
          typeof candidate.name === "string" &&
          Number.isFinite(Number(candidate.price)) &&
          Number(candidate.price) > 0
        ) {
          resolvedItem = {
            slug,
            name: candidate.name,
            price: Number(candidate.price),
            volume: typeof candidate.volume === "string" ? candidate.volume : "",
            image: isSafeCatalogImageUrl(candidate.image)
              ? candidate.image
              : "/images/objects/discovery-set-floating.webp",
            quantity: qty,
          };
        }

        if (!resolvedItem) continue;
        const existing = merged.get(slug);
        if (existing) {
          existing.quantity = Math.min(MAX_QUANTITY_PER_SKU, existing.quantity + qty);
        } else if (merged.size < MAX_DISTINCT_ITEMS) {
          merged.set(slug, resolvedItem);
        }
      }

      return Array.from(merged.values());
    },
    [perfumes, objects]
  );

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ligero_case");
      if (saved) {
        setItems(normalizeWithCatalog(JSON.parse(saved)));
      }
      const savedNote = localStorage.getItem("ligero_case_gift_note");
      if (savedNote) setGiftNoteState(savedNote.slice(0, 500));
    } catch {
      // LocalStorage unavailable or corrupted
    } finally {
      setHydrated(true);
    }
  }, [normalizeWithCatalog]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem("ligero_case", JSON.stringify(items));
    } catch {
      // Ignore
    }
  }, [items, hydrated]);

  const setGiftNote = useCallback((note: string) => {
    const clean = note.slice(0, 500);
    setGiftNoteState(clean);
    try {
      localStorage.setItem("ligero_case_gift_note", clean);
    } catch {
      // Ignore
    }
  }, []);

  const addToCase = useCallback(
    (item: Omit<CaseItem, "quantity">, qty: number = 1) => {
      const safeQty = clampQuantity(qty);
      setItems((prev) => {
        const existing = prev.find((i) => i.slug === item.slug);
        if (existing) {
          return prev.map((i) =>
            i.slug === item.slug
              ? { ...i, quantity: Math.min(MAX_QUANTITY_PER_SKU, i.quantity + safeQty) }
              : i
          );
        }
        if (prev.length >= MAX_DISTINCT_ITEMS) {
          return prev;
        }
        const normalized = normalizeWithCatalog([{ ...item, quantity: safeQty }]);
        return normalized.length > 0 ? [...prev, normalized[0]] : prev;
      });
      setIsCaseOpen(true);
    },
    [normalizeWithCatalog]
  );

  const removeFromCase = useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }, []);

  const updateQuantity = useCallback((slug: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => {
          if (i.slug === slug) {
            const next = Math.min(MAX_QUANTITY_PER_SKU, i.quantity + delta);
            return next > 0 ? { ...i, quantity: next } : null;
          }
          return i;
        })
        .filter(Boolean) as CaseItem[]
    );
  }, []);

  const reconcileItems = useCallback(
    (nextItems: CaseItem[]) => {
      setItems(normalizeWithCatalog(nextItems));
    },
    [normalizeWithCatalog]
  );

  const clearCase = useCallback(() => {
    setItems([]);
    setGiftNoteState("");
    try {
      localStorage.removeItem("ligero_case");
      localStorage.removeItem("ligero_case_gift_note");
    } catch {
      // Ignore
    }
  }, []);

  const totalCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    <CaseContext.Provider
      value={{
        items,
        addToCase,
        removeFromCase,
        updateQuantity,
        reconcileItems,
        clearCase,
        giftNote,
        setGiftNote,
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

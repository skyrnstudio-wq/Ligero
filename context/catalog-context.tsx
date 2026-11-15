"use client";

import { createContext, useContext, type ReactNode } from "react";
import { PERFUMES, OBJECTS, type Product, type HouseObject } from "@/lib/products";

interface CatalogContextValue {
  perfumes: Product[];
  objects: HouseObject[];
}

const CatalogContext = createContext<CatalogContextValue>({
  perfumes: PERFUMES,
  objects: OBJECTS,
});

export function CatalogProvider({
  perfumes = PERFUMES,
  objects = OBJECTS,
  children,
}: {
  perfumes?: Product[];
  objects?: HouseObject[];
  children: ReactNode;
}) {
  return (
    <CatalogContext.Provider value={{ perfumes, objects }}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog(): CatalogContextValue {
  return useContext(CatalogContext);
}

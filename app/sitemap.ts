import type { MetadataRoute } from "next";
import { PERFUMES } from "@/lib/products";

const BASE_URL = "https://ligeroparfums.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    "",
    "/collection",
    "/discovery-set",
    "/objects",
    "/objects/en-route",
    "/help",
    "/legal/privacy",
    "/legal/terms",
    "/legal/shipping-returns",
    "/legal/grievance",
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: now,
  }));

  const perfumeRoutes = PERFUMES.map((p) => ({
    url: `${BASE_URL}/collection/${p.slug}`,
    lastModified: now,
  }));

  return [...staticRoutes, ...perfumeRoutes];
}

import type { MetadataRoute } from "next";
import { getLivePerfumes } from "@/lib/sanity/data";

const BASE_URL = "https://ligeroparfums.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const perfumes = await getLivePerfumes();

  const staticRoutes: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }> = [
    { path: "", changeFrequency: "weekly", priority: 1.0 },
    { path: "/collection", changeFrequency: "weekly", priority: 0.9 },
    { path: "/discovery-set", changeFrequency: "monthly", priority: 0.9 },
    { path: "/objects", changeFrequency: "monthly", priority: 0.7 },
    { path: "/objects/en-route", changeFrequency: "monthly", priority: 0.8 },
    { path: "/help", changeFrequency: "monthly", priority: 0.7 },
    { path: "/legal", changeFrequency: "yearly", priority: 0.3 },
    { path: "/legal/privacy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/legal/terms", changeFrequency: "yearly", priority: 0.3 },
    { path: "/legal/shipping-returns", changeFrequency: "yearly", priority: 0.3 },
    { path: "/legal/compliance-checklist", changeFrequency: "yearly", priority: 0.3 },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const perfumeEntries: MetadataRoute.Sitemap = perfumes.map((p) => ({
    url: `${BASE_URL}/collection/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticEntries, ...perfumeEntries];
}

import type { MetadataRoute } from "next";
import { getLiveHomepage, getLiveObjects, getLivePerfumes } from "@/lib/sanity/data";
import { getPerfumeCutoutImage } from "@/lib/products";
import { BASE_URL, toAbsoluteUrl } from "@/lib/seo/schema";

const STATIC_LAST_MODIFIED = new Date("2026-11-16T00:00:00.000Z");

function toValidDate(iso?: string, fallback: Date = STATIC_LAST_MODIFIED): Date {
  if (!iso) return fallback;
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

function latestDate(dates: Array<string | undefined>, fallback: Date = STATIC_LAST_MODIFIED): Date {
  let latest = fallback.getTime();
  for (const iso of dates) {
    if (!iso) continue;
    const ms = new Date(iso).getTime();
    if (Number.isFinite(ms) && ms > latest) {
      latest = ms;
    }
  }
  return new Date(latest);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [perfumes, objects, homepage] = await Promise.all([
    getLivePerfumes(),
    getLiveObjects(),
    getLiveHomepage(),
  ]);

  const indexablePerfumes = perfumes.filter((p) => p.seo?.noIndex !== true);
  const discoveryObj = objects.find((o) => o.slug === "discovery-set");
  const enRouteObj = objects.find((o) => o.slug === "en-route");

  const catalogLastModified = latestDate([
    ...indexablePerfumes.map((p) => p.updatedAt),
    ...objects.map((o) => o.updatedAt),
  ]);
  const homeLastModified = latestDate([homepage?.updatedAt, catalogLastModified.toISOString()]);

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: homeLastModified,
      changeFrequency: "weekly",
      priority: 1.0,
      images: [toAbsoluteUrl("/images/hero/ligero-parfum-cutout.webp")],
    },
    {
      url: `${BASE_URL}/collection`,
      lastModified: catalogLastModified,
      changeFrequency: "weekly",
      priority: 0.9,
      images: indexablePerfumes.map((p) => toAbsoluteUrl(getPerfumeCutoutImage(p))),
    },
    ...(discoveryObj?.seo?.noIndex !== true
      ? [
          {
            url: `${BASE_URL}/discovery-set`,
            lastModified: toValidDate(discoveryObj?.updatedAt, catalogLastModified),
            changeFrequency: "monthly" as const,
            priority: 0.9,
            images: [
              toAbsoluteUrl(
                discoveryObj?.image || "/images/objects/discovery-set-floating.webp"
              ),
            ],
          },
        ]
      : []),
    {
      url: `${BASE_URL}/objects`,
      lastModified: latestDate(objects.map((o) => o.updatedAt)),
      changeFrequency: "monthly",
      priority: 0.75,
      images: objects.map((o) => toAbsoluteUrl(o.image)),
    },
    ...(enRouteObj?.seo?.noIndex !== true
      ? [
          {
            url: `${BASE_URL}/objects/en-route`,
            lastModified: toValidDate(enRouteObj?.updatedAt, catalogLastModified),
            changeFrequency: "monthly" as const,
            priority: 0.8,
            images: [
              toAbsoluteUrl(enRouteObj?.image || "/images/objects/car-perfume-floating.webp"),
            ],
          },
        ]
      : []),
    {
      url: `${BASE_URL}/help`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/legal`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/legal/privacy`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/legal/terms`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/legal/shipping-returns`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/legal/compliance-checklist`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const perfumeEntries: MetadataRoute.Sitemap = indexablePerfumes.map((p) => {
    const productImages = Array.from(
      new Set(
        [
          getPerfumeCutoutImage(p),
          p.image,
          ...(p.gallery || []),
        ]
          .filter(Boolean)
          .map(toAbsoluteUrl)
      )
    );

    return {
      url: `${BASE_URL}/collection/${p.slug}`,
      lastModified: toValidDate(p.updatedAt, catalogLastModified),
      changeFrequency: "weekly",
      priority: 0.85,
      images: productImages,
    };
  });

  return [...staticEntries, ...perfumeEntries];
}

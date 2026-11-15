import type { Metadata } from "next";
import { preload } from "react-dom";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import Hero from "@/components/hero";
import TheCollection from "@/components/the-collection";
import EditorialQuote from "@/components/editorial-quote";
import ObjectsDuo from "@/components/objects-duo";
import PrivateSalon from "@/components/private-salon";
import { getLiveHomepage, getLiveObjects, getLivePerfumes } from "@/lib/sanity/data";
import {
  DEFAULT_FRAGRANCES,
  getPerfumeCutoutImage,
  getPerfumeNotesImage,
  type FragranceItem,
} from "@/lib/products";
import {
  buildGraph,
  buildOrganizationSchema,
  buildWebsiteSchema,
} from "@/lib/seo/schema";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  preload("/images/textures/raw-silk-canvas.webp", {
    as: "image",
    type: "image/webp",
  });

  const [homepageData, perfumes, objects] = await Promise.all([
    getLiveHomepage(),
    getLivePerfumes(),
    getLiveObjects(),
  ]);

  const jsonLd = buildGraph([
    buildOrganizationSchema(),
    buildWebsiteSchema(),
  ]);

  const collectionItems: FragranceItem[] = perfumes.map((p) => {
    const fallback = DEFAULT_FRAGRANCES.find((f) => f.slug === p.slug);
    return {
      name: p.name,
      slug: p.slug,
      price: p.price,
      volume: p.volume,
      badge: p.badge || fallback?.badge || "EAU DE PARFUM",
      rating: fallback?.rating,
      reviewCount: fallback?.reviewCount,
      concentration:
        p.volume?.toUpperCase() || fallback?.concentration || "EAU DE PARFUM · 50 ML",
      atmosphere: fallback?.atmosphere || p.oneLiner || p.subtitle,
      family: p.scentProfile.family || fallback?.family || "Eau de Parfum",
      notesSummary:
        fallback?.notesSummary ||
        p.notesUppercase
          .split("·")
          .map((s) => s.trim().toLowerCase().replace(/^\w/, (c) => c.toUpperCase()))
          .join(" · ") ||
        p.scentProfile.top,
      image: getPerfumeCutoutImage(p),
      notesImage: getPerfumeNotesImage(p),
    };
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main className="relative">
        {/* Movement 1: Stationary Sticky Campaign Hero */}
        <div className="sticky top-0 z-0">
          <Hero />
        </div>

        {/* Elevated Curtain Layer: Slides smoothly on top of the stationary Hero */}
        <div className="relative z-10 border-t border-aube-hairline bg-[#FAFAF7] shadow-[0_-8px_24px_rgba(28,20,14,0.14)] md:shadow-[0_-24px_64px_rgba(28,20,14,0.20)]">
          {/* Movement 2: The Seven Fragrances */}
          <TheCollection items={collectionItems} />

          {/* Movement 3: Maison Philosophy / Editorial Quote */}
          <EditorialQuote />

          {/* Movement 4: Objects of Scent (Two Columns: The Discovery Set & En Route) */}
          <ObjectsDuo objects={objects} />

          {/* Movement 5: The Private Salon / The Correspondence */}
          <PrivateSalon data={homepageData} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

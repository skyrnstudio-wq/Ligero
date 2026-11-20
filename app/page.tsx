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
  buildCollectionListSchema,
  buildGraph,
  buildOrganizationSchema,
  buildWebPageSchema,
  buildWebsiteSchema,
  formatMetaDescription,
  safeJsonLd,
} from "@/lib/seo/schema";

const DEFAULT_HOME_TITLE = "Ligero Parfum | Independent Indian Perfume House";
const DEFAULT_HOME_DESCRIPTION =
  "Seven permanent Eau de Parfum creations formulated in India with botanical absolutes and resins. 50 ml flacons, The Discovery Set, and En Route.";

export async function generateMetadata(): Promise<Metadata> {
  const homepage = await getLiveHomepage();
  const title = homepage?.seo?.title || DEFAULT_HOME_TITLE;
  const description = formatMetaDescription(
    homepage?.seo?.description || DEFAULT_HOME_DESCRIPTION
  );

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: "/",
      siteName: "Ligero Parfum",
      title,
      description,
      ...(homepage?.seo?.image
        ? {
            images: [
              {
                url: homepage.seo.image,
                width: 1200,
                height: 630,
                alt: "Ligero Parfum permanent collection",
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(homepage?.seo?.image ? { images: [homepage.seo.image] } : {}),
    },
    ...(homepage?.seo?.noIndex
      ? { robots: { index: false, follow: false } }
      : {}),
  };
}

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
    buildWebPageSchema({
      path: "/",
      name: homepageData?.seo?.title || DEFAULT_HOME_TITLE,
      description: formatMetaDescription(
        homepageData?.seo?.description || DEFAULT_HOME_DESCRIPTION
      ),
      dateModified: homepageData?.updatedAt,
      primaryImage: "/images/hero/ligero-parfum-cutout.webp",
    }),
    buildCollectionListSchema(perfumes, objects, "Ligero Parfum Permanent Collection"),
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
      occasions:
        p.occasions && p.occasions.length > 0
          ? p.occasions
          : fallback?.occasions,
    };
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
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

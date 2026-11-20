import type { Metadata } from "next";
import Image from "next/image";
import { preload } from "react-dom";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import PrivateSalon from "@/components/private-salon";
import CollectionCatalog from "@/components/collection-catalog";
import { getLiveObjects, getLivePerfumes } from "@/lib/sanity/data";
import {
  buildBreadcrumbSchema,
  buildCollectionListSchema,
  buildGraph,
  buildOrganizationSchema,
  buildWebPageSchema,
  safeJsonLd,
} from "@/lib/seo/schema";

const COLLECTION_DESCRIPTION =
  "Seven permanent Eau de Parfum flacons (50 ml) alongside The Discovery Set and En Route car perfume. Direct INR pricing with free shipping across India.";

export const metadata: Metadata = {
  title: "Eau de Parfum Collection",
  description: COLLECTION_DESCRIPTION,
  alternates: {
    canonical: "/collection",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    title: "Eau de Parfum Collection | Ligero Parfum",
    description: COLLECTION_DESCRIPTION,
    url: "/collection",
    images: [
      {
        url: "/images/perfumes/aube-scene.webp",
        width: 1440,
        height: 1075,
        alt: "Ligero Parfum Eau de Parfum collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eau de Parfum Collection | Ligero Parfum",
    description: COLLECTION_DESCRIPTION,
    images: ["/images/perfumes/aube-scene.webp"],
  },
};

export default async function CollectionPage() {
  preload("/images/textures/raw-silk-canvas.webp", {
    as: "image",
    type: "image/webp",
  });

  const [perfumes, objects] = await Promise.all([
    getLivePerfumes(),
    getLiveObjects(),
  ]);

  const jsonLd = buildGraph([
    buildOrganizationSchema(),
    buildWebPageSchema({
      path: "/collection",
      name: "Eau de Parfum Collection | Ligero Parfum",
      description: COLLECTION_DESCRIPTION,
      type: "CollectionPage",
      primaryImage: "/images/perfumes/aube-scene.webp",
      mainEntityId: "https://www.ligeroparfum.com/collection#itemlist",
    }),
    buildCollectionListSchema(perfumes, objects),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Perfume Collection", path: "/collection" },
    ]),
  ]);

  return (
    <div className="min-h-screen bg-[#FBF8F2] text-aube-text">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <SiteHeader />

      <main className="pt-[var(--header-offset)]">
        {/* 1. Tactile Macro Glass & Raw Silk Hero Banner ("Perfume") */}
        <section
          aria-label="Perfume Collection Header"
          className="relative flex h-[110px] w-full items-center justify-center overflow-hidden border-b border-aube-hairline bg-[#EAE0CE] sm:h-[200px] lg:h-[240px]"
          style={{
            backgroundImage: `
              radial-gradient(ellipse at 50% 45%, rgba(255, 252, 245, 0.72) 0%, rgba(234, 224, 206, 0.4) 60%, rgba(212, 198, 174, 0.55) 100%),
              url('/images/textures/raw-silk-canvas.webp')
            `,
            backgroundRepeat: "no-repeat, repeat",
            backgroundSize: "100% 100%, 360px 360px",
          }}
        >
          {/* Macro glass rim detail framing the banner */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden overflow-hidden opacity-40 mix-blend-multiply sm:block"
          >
            <div className="absolute -left-[8%] -top-[185%] h-[460%] w-[78%] rotate-[-82deg]">
              <Image
                src="/images/hero/ligero-parfum-cutout.webp"
                alt=""
                fill
                fetchPriority="low"
                sizes="100vw"
                className="object-contain scale-125"
              />
            </div>
            <div className="absolute -right-[18%] -top-[140%] h-[380%] w-[52%] rotate-[-18deg]">
              <Image
                src="/images/perfumes/cutouts/aube.webp?v=2"
                alt=""
                fill
                fetchPriority="low"
                sizes="60vw"
                className="object-contain"
              />
            </div>
          </div>

          <div className="relative z-10 px-6 text-center">
            <h1 className="font-display text-3xl font-normal tracking-[-0.01em] text-[#1c140e] sm:text-5xl lg:text-[3.5rem]">
              Perfume
            </h1>
          </div>
        </section>

        {/* 2. Interactive Filter/Sort Bar + Clean Catalog Grid */}
        <CollectionCatalog perfumes={perfumes} objects={objects} />

        {/* 3. Horizontal Correspondence Strip */}
        <PrivateSalon variant="strip" />
      </main>

      <SiteFooter />
    </div>
  );
}

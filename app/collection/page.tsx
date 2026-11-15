import Link from "next/link";
import Image from "next/image";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import PrivateSalon from "@/components/private-salon";
import CollectionCatalog from "@/components/collection-catalog";
import { getLiveObjects, getLivePerfumes } from "@/lib/sanity/data";

import {
  buildBreadcrumbSchema,
  buildCollectionListSchema,
  buildGraph,
} from "@/lib/seo/schema";

export const metadata = {
  title: "Perfume Collection",
  description:
    "Explore seven permanent Eau de Parfum bottles in 50 ml flacons alongside The Discovery Set and En Route. Direct INR pricing from Ligero Parfum.",
  alternates: {
    canonical: "/collection",
  },
  openGraph: {
    title: "Perfume Collection | Ligero Parfum",
    description:
      "Seven permanent Eau de Parfum creations in 50 ml flacons alongside The Discovery Set and En Route.",
    url: "/collection",
    images: ["/images/perfumes/cutouts/aube.webp"],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Perfume Collection | Ligero Parfum",
    description:
      "Seven permanent Eau de Parfum creations in 50 ml flacons alongside The Discovery Set and En Route.",
  },
};

export default async function CollectionPage() {
  const [perfumes, objects] = await Promise.all([
    getLivePerfumes(),
    getLiveObjects(),
  ]);

  const jsonLd = buildGraph([
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
                priority
                sizes="100vw"
                className="object-contain scale-125"
              />
            </div>
            <div className="absolute -right-[18%] -top-[140%] h-[380%] w-[52%] rotate-[-18deg]">
              <Image
                src="/images/perfumes/cutouts/aube.webp?v=2"
                alt=""
                fill
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

        {/* 3. Semantic Olfactive Index Table for Direct Comparison & Machine Extractability */}
        <section
          aria-labelledby="olfactive-index-heading"
          className="border-t border-aube-hairline bg-[#FBF8F2] px-6 py-16 sm:px-10 sm:py-20 lg:px-16"
        >
          <div className="mx-auto max-w-[112rem]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-aube-text-muted">
                  Permanent Index
                </p>
                <h2
                  id="olfactive-index-heading"
                  className="mt-2 font-display text-3xl font-light italic text-aube-text sm:text-4xl"
                >
                  The Olfactive Ledger.
                </h2>
              </div>
              <p className="max-w-md text-xs leading-relaxed text-aube-text-muted">
                Every permanent 50 ml Eau de Parfum bottled with food-grade grain alcohol, aged in small batches, and shipped free across India.
              </p>
            </div>

            <div className="mt-8 overflow-x-auto border border-aube-hairline bg-[#FAF7F0]">
              <table className="w-full min-w-[680px] border-collapse text-left text-xs text-aube-text">
                <thead>
                  <tr className="border-b border-aube-hairline text-[10px] uppercase tracking-[0.2em] text-aube-text-muted">
                    <th scope="col" className="px-5 py-4 font-normal">Perfume</th>
                    <th scope="col" className="px-5 py-4 font-normal">Olfactive Family</th>
                    <th scope="col" className="px-5 py-4 font-normal">Primary Notes</th>
                    <th scope="col" className="px-5 py-4 font-normal">Wear & Longevity</th>
                    <th scope="col" className="px-5 py-4 text-right font-normal">50 ml INR</th>
                  </tr>
                </thead>
                <tbody>
                  {perfumes.map((p) => (
                    <tr
                      key={p.slug}
                      className="border-b border-aube-hairline/70 last:border-b-0 transition-colors hover:bg-[#F3EDE2]"
                    >
                      <td className="px-5 py-4 font-display text-lg font-light italic">
                        <Link href={`/collection/${p.slug}`} className="hover:text-aube-accent">
                          {p.name}
                        </Link>
                      </td>
                      <td className="px-5 py-4 text-aube-text-muted">
                        {p.scentProfile.family}
                      </td>
                      <td className="px-5 py-4 text-aube-text-muted">
                        {p.scentProfile.top} · {p.scentProfile.heart} · {p.scentProfile.base}
                      </td>
                      <td className="px-5 py-4 text-aube-text-muted">
                        {p.scentProfile.longevity || "12+ hours"}
                      </td>
                      <td className="px-5 py-4 text-right font-medium tabular-nums">
                        INR {p.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 4. Horizontal Correspondence Strip */}
        <PrivateSalon variant="strip" />
      </main>

      <SiteFooter />
    </div>
  );
}

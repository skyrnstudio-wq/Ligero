import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import ProductGallery from "@/components/product-gallery";
import ProductOrderPanel from "@/components/product-order-panel";
import ProductScentArchitecture from "@/components/product-scent-architecture";
import ProductManifestoBand from "@/components/product-manifesto-band";
import ProductRitual from "@/components/product-ritual";
import ProductReviews from "@/components/product-reviews";
import ProductStickyBar from "@/components/product-sticky-bar";
import PrivateSalon from "@/components/private-salon";
import {
  getLivePerfumes,
  getLivePerfumeBySlug,
  getApprovedReviews,
} from "@/lib/sanity/data";
import { summarizeReviews } from "@/lib/reviews";
import { getPerfumeCutoutImage, isStaticPerfumeSlug, type Product } from "@/lib/products";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const perfumes = await getLivePerfumes();
  return perfumes.map((p) => ({
    slug: p.slug,
  }));
}

import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildGraph,
  buildProductSchema,
} from "@/lib/seo/schema";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getLivePerfumeBySlug(slug);

  if (!product) return { title: "Not Found" };

  const description = `${product.oneLiner} ${product.scentProfile.family} (${product.volume}). Notes of ${product.scentProfile.top}, ${product.scentProfile.heart}, and ${product.scentProfile.base}. INR ${product.price}.`;
  const canonicalPath = `/collection/${product.slug}`;
  const ogImage = getPerfumeCutoutImage(product);

  return {
    title: `${product.name} Eau de Parfum`,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "website",
      title: `${product.name} Eau de Parfum | Ligero Parfum`,
      description,
      url: canonicalPath,
      images: [
        {
          url: ogImage,
          alt: `${product.name} 50 ml flacon by Ligero Parfum`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} Eau de Parfum | Ligero Parfum`,
      description,
      images: [ogImage],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [product, allPerfumes, reviews] = await Promise.all([
    getLivePerfumeBySlug(slug),
    getLivePerfumes(),
    getApprovedReviews(slug),
  ]);

  if (!product) {
    notFound();
  }

  const reviewSummary = summarizeReviews(reviews);

  // Build 3 companion bottles for the "You Might Also Like" row
  const relatedSet = new Set<string>(product.relatedSlugs || []);
  for (const p of allPerfumes) {
    if (p.slug !== product.slug && relatedSet.size < 3) {
      relatedSet.add(p.slug);
    }
  }
  const relatedProducts: Product[] = Array.from(relatedSet)
    .map((s) => allPerfumes.find((p) => p.slug === s))
    .filter((p): p is Product => Boolean(p))
    .slice(0, 3);

  const galleryImages =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : [getPerfumeCutoutImage(product)];

  const faqs = [
    {
      question: `What is ${product.name}'s concentration and formulation?`,
      answer: `${product.name} is bottled in small lots as a 50 ml Eau de Parfum using food-grade grain alcohol, cold-pressed essential oils, botanical absolutes, and resins without artificial dyes. Maceration before bottling allows volatile top notes and heavier fixatives to bind cleanly on skin.`,
    },
    {
      question: `How long does ${product.name} last on skin and fabric?`,
      answer: `${product.name} provides ${
        product.scentProfile.longevity ||
        "over 12 hours of wear on warm skin and more than 24 hours on natural fabrics"
      }. Its sillage profile holds ${
        product.scentProfile.sillage
          ? product.scentProfile.sillage.toLowerCase()
          : "a steady, measured presence through opening, heart, and dry-down"
      } across humid and temperate conditions.`,
    },
    {
      question: `Which occasions is ${product.name} best suited for?`,
      answer: `${product.name} is formulated for ${(product.occasions && product.occasions.length > 0 ? product.occasions : ["Daily Wear", "Evening"]).join(", ")}. ${product.ritual}`,
    },
    {
      question: `Can I sample ${product.name} before ordering the 50 ml flacon?`,
      answer: `Yes. The Discovery Set pairs 10 ml travel atomizers of ${product.name} and every other permanent perfume in a single rigid box for INR 999 with complimentary domestic shipping, allowing extended skin testing across seasons before committing to a full 50 ml flacon.`,
    },
    {
      question: `Which fragrance pairs best when layering with ${product.name}?`,
      answer: `${product.name} is balanced for solo signature wear or structured layering alongside ${
        relatedProducts[0]?.name || "Blanc"
      }. Apply two sprays of the deeper base to warm pulse points first, let settle for thirty seconds, then mist the brighter accord above the collar.`,
    },
    {
      question: `How is ${product.name} shipped across India and how long does delivery take?`,
      answer: `Orders dispatch from our Mumbai studio within one to two working days across all serviceable Indian postal codes. Because alcohol-based parfum travels strictly by domestic surface freight rather than air cargo, transit typically concludes in three to seven working days at zero shipping charge.`,
    },
    {
      question: `What is the return policy for ${product.name} and why can batch tint vary slightly?`,
      answer: `Unopened, factory-sealed bottles of ${product.name} qualify for return within seven days of delivery, while opened bottles remain non-returnable. Because batches exclude synthetic dyes and colour stabilisers, liquid tint varies subtly according to seasonal harvest variations.`,
    },
  ];

  const jsonLd = buildGraph([
    buildProductSchema({
      name: product.name,
      slug: product.slug,
      path: `/collection/${product.slug}`,
      description: `${product.oneLiner} ${product.volume}.`,
      images: galleryImages,
      price: product.price,
      category: product.scentProfile.family || "Eau de Parfum",
      size: product.volume,
      material: product.material,
      reviewSummary,
      reviews,
    }),
    buildFaqSchema(faqs),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Perfume Collection", path: "/collection" },
      { name: product.name, path: `/collection/${product.slug}` },
    ]),
  ]);

  return (
    <div
      data-pdp-theme={
        isStaticPerfumeSlug(product.slug)
          ? product.slug
          : product.isDark
            ? "noctis"
            : "aube"
      }
      className="relative min-h-screen overflow-x-clip bg-pdp-base text-pdp-text transition-colors duration-300"
    >
      {/* Ambient background mesh gradients for atmospheric depth */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_75%_50%_at_50%_-10%,var(--pdp-glow)_0%,transparent_75%)] opacity-70"
        />
        <div
          className="absolute -bottom-32 -right-32 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,var(--pdp-accent)_0%,transparent_72%)] opacity-[0.06]"
        />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SiteHeader />

      <main className="relative z-10 pt-[var(--header-offset)]">
        {/* 1. Top 50/50 Split Fold: Left Studio Plinth & Staggered Collage, Right Sticky Order Panel */}
        <section
          aria-label={`${product.name} overview`}
          className="mx-auto max-w-[112rem] pb-10 lg:pb-24"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left 6 Columns: Flush Studio Bottle Plinth + 2-Col Staggered Collage + 3-Col Notes Table */}
            <div className="min-w-0 lg:col-span-6">
              <ProductGallery
                product={product}
                images={galleryImages}
                productName={product.name}
              />
            </div>

            {/* Right 6 Columns: Sticky Centered Order Panel */}
            <div className="relative min-w-0 px-5 pt-4 sm:px-12 sm:pt-6 lg:col-span-6 lg:px-16 lg:pt-0 xl:px-24">
              <div className="lg:sticky lg:top-[calc(var(--header-offset)+1.5rem)] lg:max-h-[calc(100vh-var(--header-offset)-2.5rem)] lg:overflow-y-auto lg:py-6 no-scrollbar">
                <ProductOrderPanel
                  product={product}
                  reviewSummary={reviewSummary}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2. Transitional Atelier Manifesto Band with Atmospheric Horizon Gradient */}
        <ProductManifestoBand product={product} />

        {/* 3. Full-Width "Olfactory Notes" Horizontal Showcase */}
        <ProductScentArchitecture product={product} />

        {/* 4. The Sensory Ritual (How to Wear Eau de Parfum) */}
        <ProductRitual product={product} />

        {/* 5. "You Might Also Like" 3-Column Studio Cutout Bottles Row */}
        {relatedProducts.length > 0 && (
          <section
            aria-labelledby="you-might-also-like-heading"
            className="mx-auto max-w-[96rem] px-4 pt-8 pb-6 sm:px-10 sm:pt-14 sm:pb-10 lg:px-16"
          >
            <h2
              id="you-might-also-like-heading"
              className="font-body text-[10px] font-semibold uppercase tracking-[0.22em] text-pdp-text"
            >
              You Might Also Like
            </h2>

            <div className="mt-4 grid grid-cols-3 gap-2.5 sm:mt-5 sm:gap-5 lg:gap-8">
              {relatedProducts.map((rel) => {
                const relNotes = rel.notesUppercase
                  .toLowerCase()
                  .replace(/\s*·\s*/g, ", ");
                return (
                  <article
                    key={rel.slug}
                    className="group flex flex-col justify-between bg-transparent"
                  >
                    <Link
                      href={`/collection/${rel.slug}`}
                      className="relative block aspect-[1/1] w-full focus-visible:outline-2 focus-visible:outline-pdp-text"
                    >
                      <div className="relative flex h-full w-full items-center justify-center p-2 sm:p-5">
                        <div className="relative h-full w-full max-w-[110px] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:scale-[1.03] sm:max-w-[190px]">
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute bottom-0 left-1/2 h-3 w-[60%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(28,20,14,0.22)_0%,rgba(28,20,14,0.08)_52%,transparent_76%)]"
                          />
                          <Image
                            src={getPerfumeCutoutImage(rel)}
                            alt={`${rel.name} bottle`}
                            fill
                            loading="eager"
                            quality={80}
                            sizes="(max-width: 640px) 110px, 190px"
                            className="object-contain object-center md:[filter:drop-shadow(-10px_14px_16px_rgba(28,20,14,0.18))]"
                          />
                        </div>
                      </div>
                    </Link>

                    <div className="flex flex-col items-center px-1 pt-1.5 pb-1 text-center sm:px-2 sm:pt-2.5 sm:pb-2">
                      <p className="hidden font-body text-[8.5px] uppercase tracking-[0.2em] text-pdp-muted sm:block">
                        Eau de Parfum
                      </p>
                      <h3 className="font-body text-[11px] font-semibold uppercase tracking-[0.12em] text-pdp-text sm:mt-0.5 sm:text-xs sm:tracking-[0.16em]">
                        <Link
                          href={`/collection/${rel.slug}`}
                          className="inline-flex min-h-11 items-center justify-center transition-colors hover:text-pdp-accent"
                        >
                          {rel.name}
                        </Link>
                      </h3>
                      <p className="mt-0.5 hidden max-w-[26ch] font-body text-[11px] leading-snug text-pdp-muted sm:block">
                        {relNotes}
                      </p>
                      {rel.occasions && rel.occasions.length > 0 && (
                        <p className="mt-1 hidden font-body text-[9.5px] uppercase tracking-[0.14em] text-pdp-accent sm:block">
                          {rel.occasions.slice(0, 3).join(" · ")}
                        </p>
                      )}
                      <p className="mt-0.5 font-body text-[11px] tabular-nums text-pdp-text sm:mt-1.5 sm:text-xs">
                        ₹{rel.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* 4. "Frequently Asked Questions" 2-Column Split Accordion Section */}
        <section
          aria-labelledby="faq-heading"
          className="mx-auto max-w-[96rem] px-6 py-10 sm:px-10 sm:py-20 lg:px-16"
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <h2
                id="faq-heading"
                className="font-display text-2xl font-normal tracking-[-0.01em] text-pdp-text sm:text-4xl lg:text-[2.65rem] leading-[1.08]"
              >
                Frequently Asked Questions
              </h2>
            </div>

            <div className="divide-y divide-pdp-text/20 border-t border-b border-pdp-text/20 lg:col-span-7">
              {faqs.map((faq) => (
                <details key={faq.question} className="group py-1 sm:py-3">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-2 font-body text-xs font-normal text-pdp-text sm:text-[13px]">
                    <span>{faq.question}</span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-sm text-pdp-muted transition-transform duration-200 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-2 mb-3 max-w-[62ch] font-body text-xs leading-relaxed text-pdp-muted">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Verified Collector Reviews */}
        <div className="mx-auto max-w-[96rem] border-t border-pdp-hairline px-6 pb-24 sm:px-10 sm:pb-20 lg:px-16">
          <ProductReviews
            productSlug={product.slug}
            productName={product.name}
            reviews={reviews}
            isDark={false}
          />
        </div>

        {/* 6. Horizontal Correspondence Strip */}
        <PrivateSalon variant="strip" />
      </main>

      <ProductStickyBar product={product} isDark={false} />

      <SiteFooter />
    </div>
  );
}

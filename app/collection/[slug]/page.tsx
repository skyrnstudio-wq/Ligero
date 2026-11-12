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
import type { Product } from "@/lib/products";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const perfumes = await getLivePerfumes();
  return perfumes.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getLivePerfumeBySlug(slug);

  if (!product) return { title: "Not Found | Ligero Parfum" };

  return {
    title: `${product.name} | Eau de Parfum — Ligero Parfum`,
    description: `${product.oneLiner} ${product.volume}.`,
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
      : [product.image];

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: `${product.oneLiner} ${product.volume}.`,
    image: galleryImages,
    brand: {
      "@type": "Brand",
      name: "Ligero Parfum",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability: "https://schema.org/InStock",
      url: `https://ligeroparfums.com/collection/${product.slug}`,
    },
  };

  if (reviewSummary && typeof reviewSummary.average === "number") {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number((reviewSummary.average ?? 0).toFixed(2)),
      reviewCount: reviewSummary.count,
    };
  }

  const faqs = [
    {
      question: `What is ${product.name}'s concentration and formulation?`,
      answer: `${product.name} is bottled as an Eau de Parfum using food-grade grain alcohol and natural botanical extracts. Handcrafted in small batches before a single bottle is filled.`,
    },
    {
      question: `How long does ${product.name} last on skin and fabric?`,
      answer: `${
        product.scentProfile.longevity ||
        "12+ hours on warm skin and over 24 hours on natural fibres"
      }. Sillage profile: ${
        product.scentProfile.sillage ||
        "Refined, enduring aura that unfolds across top, heart, and base notes"
      }.`,
    },
    {
      question: `Can I sample ${product.name} before ordering the 50 ml flacon?`,
      answer: `The house presents The Discovery Set containing ten-millilitre travel atomizers of all seven perfumes in the collection, available on our Objects shelf.`,
    },
    {
      question: `Which fragrance pairs best when layering with ${product.name}?`,
      answer: `${product.name} is formulated to wear alone as a signature or layered with ${
        relatedProducts[0]?.name || "Blanc"
      } — apply two presses of the deeper base to pulse points first, then mist the brighter top across the collar.`,
    },
  ];

  return (
    <div
      data-pdp-theme={product.slug}
      className="relative min-h-screen bg-pdp-base text-pdp-text transition-colors duration-300"
    >
      {/* Ambient background mesh gradients for atmospheric depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_75%_50%_at_50%_-10%,var(--pdp-glow)_0%,transparent_75%)] opacity-70"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -bottom-32 -right-32 z-0 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,var(--pdp-accent)_0%,transparent_75%)] opacity-[0.06] blur-3xl"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SiteHeader />

      <main className="relative z-10 pt-[var(--header-offset)]">
        {/* 1. Top 50/50 Split Fold: Left Studio Plinth & Staggered Collage, Right Sticky Order Panel */}
        <section
          aria-label={`${product.name} overview`}
          className="mx-auto max-w-[112rem] pb-16 lg:pb-24"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left 6 Columns: Flush Studio Bottle Plinth + 2-Col Staggered Collage + 3-Col Notes Table */}
            <div className="lg:col-span-6">
              <ProductGallery
                product={product}
                images={galleryImages}
                productName={product.name}
              />
            </div>

            {/* Right 6 Columns: Sticky Centered Order Panel */}
            <div className="relative px-6 pt-8 sm:px-12 lg:col-span-6 lg:px-16 lg:pt-0 xl:px-24">
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

        {/* 4. The Sensory Ritual (How to Wear Extrait de Parfum) */}
        <ProductRitual product={product} />

        {/* 5. "You Might Also Like" 3-Column Studio Cutout Bottles Row */}
        {relatedProducts.length > 0 && (
          <section
            aria-labelledby="you-might-also-like-heading"
            className="mx-auto max-w-[96rem] px-6 pt-10 pb-8 sm:px-10 sm:pt-14 sm:pb-10 lg:px-16"
          >
            <h2
              id="you-might-also-like-heading"
              className="font-body text-[10px] font-semibold uppercase tracking-[0.22em] text-pdp-text"
            >
              You Might Also Like
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3 lg:gap-8">
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
                      <div className="relative flex h-full w-full items-center justify-center p-4 sm:p-5">
                        <div className="relative h-full w-full max-w-[190px] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:scale-[1.03]">
                          <Image
                            src={`/images/perfumes/cutouts/${rel.slug}.webp?v=2`}
                            alt={`${rel.name} bottle`}
                            fill
                            sizes="(max-width: 640px) 70vw, 24vw"
                            className="object-contain object-center [filter:drop-shadow(-10px_14px_16px_rgba(28,20,14,0.18))_drop-shadow(0_4px_8px_rgba(28,20,14,0.10))]"
                          />
                        </div>
                      </div>
                    </Link>

                    <div className="flex flex-col items-center px-2 pt-2.5 pb-2 text-center">
                      <p className="font-body text-[8.5px] uppercase tracking-[0.2em] text-pdp-muted">
                        Eau de Parfum
                      </p>
                      <h3 className="mt-0.5 font-body text-xs font-semibold uppercase tracking-[0.16em] text-pdp-text">
                        <Link
                          href={`/collection/${rel.slug}`}
                          className="transition-colors hover:text-pdp-accent"
                        >
                          {rel.name}
                        </Link>
                      </h3>
                      <p className="mt-0.5 max-w-[26ch] font-body text-[11px] leading-snug text-pdp-muted">
                        {relNotes}
                      </p>
                      <p className="mt-1.5 font-body text-xs tabular-nums text-pdp-text">
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
          className="mx-auto max-w-[96rem] px-6 py-16 sm:px-10 sm:py-20 lg:px-16"
        >
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <h2
                id="faq-heading"
                className="font-display text-3xl font-normal tracking-[-0.01em] text-pdp-text sm:text-4xl lg:text-[2.65rem] leading-[1.08]"
              >
                Frequently Asked Questions
              </h2>
            </div>

            <div className="divide-y divide-pdp-text/20 border-t border-b border-pdp-text/20 lg:col-span-7">
              {faqs.map((faq) => (
                <details key={faq.question} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-body text-xs font-normal text-pdp-text sm:text-[13px]">
                    <span>{faq.question}</span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-sm text-pdp-muted transition-transform duration-200 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-[62ch] font-body text-xs leading-relaxed text-pdp-muted">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Verified Collector Reviews */}
        <div className="mx-auto max-w-[96rem] border-t border-pdp-hairline px-6 pb-20 sm:px-10 lg:px-16">
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

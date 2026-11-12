import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import AddEnRouteButton from "@/components/add-en-route-button";
import ProductReviews from "@/components/product-reviews";
import { getApprovedReviews } from "@/lib/sanity/data";
import { summarizeReviews } from "@/lib/reviews";

export const metadata = {
  title: "En Route | Ligero Parfum",
  description: "For the drive.",
};

/**
 * En Route single-product page (site-blueprint.md §10).
 * Photo, one line ("For the drive."), price 499, "Add to Case", Declarations accordion,
 * and verified collector reviews.
 */
export default async function EnRoutePage() {
  const reviews = await getApprovedReviews("en-route");
  const reviewSummary = summarizeReviews(reviews);

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "En Route",
    description: "For the drive.",
    image: ["/images/objects/car-perfume-floating.webp"],
    brand: {
      "@type": "Brand",
      name: "Ligero Parfum",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: 499,
      availability: "https://schema.org/InStock",
      url: "https://ligeroparfums.com/objects/en-route",
    },
  };

  if (reviewSummary) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(reviewSummary.average.toFixed(2)),
      reviewCount: reviewSummary.count,
    };
  }

  return (
    <div className="min-h-screen bg-aube-base text-aube-text">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SiteHeader />

      <main className="pt-[var(--header-offset)]">
        <div className="mx-auto max-w-[112rem] px-6 pb-28 pt-8 sm:px-10 sm:pt-12 lg:px-16">
          <nav aria-label="Breadcrumb" className="pb-8">
            <Link
              href="/objects"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-aube-text-muted transition-colors hover:text-aube-accent"
            >
              <span aria-hidden="true">←</span>
              <span>Objects</span>
            </Link>
          </nav>

          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <div className="relative aspect-[16/10] w-full overflow-hidden border border-aube-hairline bg-gradient-to-br from-[#ece8e0] via-[#f6f4ef] to-[#fdfcfa] p-6 sm:p-10">
                <Image
                  src="/images/objects/car-perfume-floating.webp"
                  alt="En Route car perfume"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-contain object-center drop-shadow-[0_20px_30px_rgba(28,20,14,0.16)]"
                />
              </div>
            </div>

            <div className="flex flex-col items-start lg:col-span-5">
              <h1 className="font-display text-6xl font-light italic leading-[0.98] text-aube-text sm:text-7xl">
                En Route
              </h1>

              <p className="mt-4 font-display text-2xl font-light italic text-aube-text">
                For the drive.
              </p>

              <div className="mt-6 flex w-full items-baseline gap-3 border-t border-b border-aube-hairline py-4">
                <span className="font-display text-4xl font-light tabular-nums">
                  499
                </span>
                <span className="text-xs text-aube-text-muted">
                  Inclusive of all taxes.
                </span>
              </div>

              {reviewSummary && reviewSummary.count > 0 ? (
                <a
                  href="#reviews-section"
                  className="mt-3 inline-flex items-center gap-1.5 font-body text-xs text-aube-text transition-opacity hover:opacity-75"
                >
                  <span aria-hidden="true" className="tracking-[0.12em] text-[11px] text-[#C6A15B]">
                    {"★".repeat(Math.round(reviewSummary.average))}
                  </span>
                  <span className="text-[11px] text-aube-text-muted tabular-nums">
                    ({reviewSummary.count})
                  </span>
                </a>
              ) : (
                <a
                  href="#reviews-section"
                  className="mt-3 inline-block font-body text-[11px] text-aube-text-muted underline-offset-4 hover:underline"
                >
                  Write a review
                </a>
              )}

              <AddEnRouteButton className="mt-6 w-full text-center" />

              <div className="mt-8 w-full divide-y divide-aube-hairline border-t border-b border-aube-hairline">
                <details className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-xs uppercase tracking-[0.2em]">
                    <span>Declarations</span>
                    <span aria-hidden="true" className="text-aube-text-muted transition-transform duration-200 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <dl className="mt-3 grid grid-cols-1 gap-1.5 text-xs leading-relaxed text-aube-text-muted">
                    <div>
                      <dt className="inline font-medium">Commodity:</dt>{" "}
                      <dd className="inline">Car Perfume (En Route)</dd>
                    </div>
                    <div>
                      <dt className="inline font-medium">Net quantity:</dt>{" "}
                      <dd className="inline">1 unit</dd>
                    </div>
                    <div>
                      <dt className="inline font-medium">MRP:</dt>{" "}
                      <dd className="inline">₹499, inclusive of all taxes</dd>
                    </div>
                    <div>
                      <dt className="inline font-medium">Marketed and customer care by:</dt>{" "}
                      <dd className="inline">
                        Ligero Parfum Private Limited · sales@ligeroparfums.com
                      </dd>
                    </div>
                  </dl>
                </details>
              </div>
            </div>
          </div>

          {/* Verified Collector Reviews */}
          <div className="mt-16 border-t border-aube-hairline pt-8">
            <ProductReviews
              productSlug="en-route"
              productName="En Route Car Perfume"
              reviews={reviews}
              isDark={false}
            />
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

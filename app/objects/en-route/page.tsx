import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import AddEnRouteButton from "@/components/add-en-route-button";
import ProductReviews from "@/components/product-reviews";
import { getApprovedReviews, getLiveObjectBySlug } from "@/lib/sanity/data";
import { summarizeReviews } from "@/lib/reviews";

import {
  buildBreadcrumbSchema,
  buildGraph,
  buildProductSchema,
} from "@/lib/seo/schema";

export const metadata = {
  title: "En Route Car Perfume",
  description:
    "En Route cabin diffuser by Ligero Parfum, formulated for the drive at INR 499 with complimentary domestic surface shipping across India.",
  alternates: {
    canonical: "/objects/en-route",
  },
  openGraph: {
    title: "En Route Car Perfume | Ligero Parfum",
    description:
      "En Route cabin diffuser formulated for the drive at INR 499.",
    url: "/objects/en-route",
    images: ["/images/objects/car-perfume-floating.webp"],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "En Route Car Perfume | Ligero Parfum",
    description:
      "En Route cabin diffuser formulated for the drive at INR 499.",
    images: ["/images/objects/car-perfume-floating.webp"],
  },
};

/**
 * En Route single-product page (site-blueprint.md §10).
 * Photo, one line ("For the drive."), price 499, "Add to Case", Declarations accordion,
 * and verified collector reviews.
 */
export default async function EnRoutePage() {
  const [reviews, enRoute] = await Promise.all([
    getApprovedReviews("en-route"),
    getLiveObjectBySlug("en-route"),
  ]);
  const reviewSummary = summarizeReviews(reviews);

  const objectName = enRoute?.name || "En Route";
  const objectDescription = enRoute?.description || "For the drive.";
  const objectPrice = enRoute?.price ?? 499;
  const objectVolume = enRoute?.volume || "Car Perfume · Cabin Diffuser";
  const objectImage =
    enRoute?.image || "/images/objects/car-perfume-floating.webp";

  const jsonLd = buildGraph([
    buildProductSchema({
      name: objectName,
      slug: "en-route",
      path: "/objects/en-route",
      description: `${objectDescription} ${objectVolume}.`,
      images: [objectImage],
      price: objectPrice,
      category: "Car Fragrance Diffuser",
      size: objectVolume,
      reviewSummary,
      reviews,
    }),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Objects", path: "/objects" },
      { name: objectName, path: "/objects/en-route" },
    ]),
  ]);

  return (
    <div className="min-h-screen bg-aube-base text-aube-text">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SiteHeader />

      <main className="pt-[var(--header-offset)]">
        <div className="mx-auto max-w-[112rem] px-5 pb-16 pt-4 sm:px-10 sm:pb-28 sm:pt-12 lg:px-16">
          <nav aria-label="Breadcrumb" className="pb-4 sm:pb-8">
            <Link
              href="/objects"
              className="inline-flex min-h-11 items-center gap-2 text-xs uppercase tracking-[0.22em] text-aube-text-muted transition-colors hover:text-aube-accent"
            >
              <span aria-hidden="true">←</span>
              <span>Objects</span>
            </Link>
          </nav>

          <div className="grid grid-cols-1 items-start gap-6 sm:gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <div className="relative aspect-[16/10] max-h-[240px] w-full overflow-hidden border border-aube-hairline bg-gradient-to-br from-[#ece8e0] via-[#f6f4ef] to-[#fdfcfa] p-4 sm:max-h-none sm:p-10">
                <Image
                  src={objectImage}
                  alt={`${objectName} car perfume`}
                  fill
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-contain object-center drop-shadow-[0_20px_30px_rgba(28,20,14,0.16)]"
                />
              </div>
            </div>

            <div className="flex flex-col items-start lg:col-span-5">
              <h1 className="font-display text-4xl font-light italic leading-[1.02] text-aube-text sm:text-6xl lg:text-7xl">
                {objectName}
              </h1>

              <p className="mt-2.5 font-display text-lg font-light italic text-aube-text sm:mt-4 sm:text-2xl">
                {objectDescription}
              </p>

              <div className="mt-4 flex w-full items-baseline gap-3 border-t border-b border-aube-hairline py-3 sm:mt-6 sm:py-4">
                <span className="font-display text-3xl font-light tabular-nums sm:text-4xl">
                  {objectPrice}
                </span>
                <span className="text-xs text-aube-text-muted">
                  Inclusive of all taxes.
                </span>
              </div>

              {reviewSummary && reviewSummary.count > 0 ? (
                <a
                  href="#reviews-section"
                  className="mt-2 inline-flex min-h-11 items-center gap-1.5 font-body text-xs text-aube-text transition-opacity hover:opacity-75 sm:mt-3"
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
                  className="mt-2 inline-flex min-h-11 items-center font-body text-[11px] text-aube-text-muted underline-offset-4 hover:underline sm:mt-3"
                >
                  Write a review
                </a>
              )}

              <AddEnRouteButton
                className="mt-4 min-h-11 w-full text-center sm:mt-6"
                slug="en-route"
                name={objectName}
                price={objectPrice}
                volume={objectVolume}
                image={objectImage}
              />

              <div className="mt-5 w-full divide-y divide-aube-hairline border-t border-b border-aube-hairline sm:mt-8">
                <details className="group py-2 sm:py-4">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-xs uppercase tracking-[0.2em]">
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
                      <dd className="inline">₹{objectPrice}, inclusive of all taxes</dd>
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

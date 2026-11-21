import type { Metadata } from "next";
import Link from "next/link";
import SmartImage from "@/components/smart-image";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import PrivateSalon from "@/components/private-salon";
import AddEnRouteButton from "@/components/add-en-route-button";
import { getLiveObjects } from "@/lib/sanity/data";
import {
  BASE_URL,
  buildBreadcrumbSchema,
  buildCollectionListSchema,
  buildGraph,
  buildOrganizationSchema,
  buildWebPageSchema,
  safeJsonLd,
} from "@/lib/seo/schema";

const OBJECTS_DESCRIPTION =
  "Scented objects from Ligero Parfum: The Discovery Set of seven 10 ml vials and En Route car perfume diffuser. Free domestic shipping across India.";

export const metadata: Metadata = {
  title: "Objects of Scent: Discovery Set & Car Perfume",
  description: OBJECTS_DESCRIPTION,
  alternates: {
    canonical: "/objects",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    title: "Objects of Scent | Ligero Parfum",
    description: OBJECTS_DESCRIPTION,
    url: "/objects",
    images: [
      {
        url: "/images/objects/discovery-set-floating.webp",
        alt: "The Discovery Set and En Route by Ligero Parfum",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Objects of Scent | Ligero Parfum",
    description: OBJECTS_DESCRIPTION,
    images: ["/images/objects/discovery-set-floating.webp"],
  },
};

/**
 * Objects page (site-blueprint.md §10).
 * Two rows, no card grid. Objects is a shelf, not a shop.
 * 1. Type-only hero: "Objects."
 * 2. The Discovery Set row.
 * 3. En Route row.
 * 4. Any additional House Objects from Sanity.
 * 5. The Correspondence & Footer.
 */
export default async function ObjectsPage() {
  const objects = await getLiveObjects();
  const discovery = objects.find((o) => o.slug === "discovery-set");
  const enRoute = objects.find((o) => o.slug === "en-route");
  const extraObjects = objects.filter(
    (o) => o.slug !== "discovery-set" && o.slug !== "en-route"
  );

  const discoveryName = discovery?.name || "The Discovery Set";
  const discoveryPrice = discovery?.price ?? 999;
  const discoveryImage =
    discovery?.image || "/images/objects/discovery-set-floating.webp";
  const discoveryCopy =
    discovery?.description &&
    discovery.description !== "Every perfume the house makes, ten millilitres each."
      ? `${discovery.description} ${discoveryPrice}.`
      : `Every perfume the house makes, ten millilitres each. Seven vials, one box. ${discoveryPrice}.`;

  const enRouteName = enRoute?.name || "En Route";
  const enRoutePrice = enRoute?.price ?? 499;
  const enRouteImage =
    enRoute?.image || "/images/objects/car-perfume-floating.webp";
  const enRouteCopy = `${enRoute?.description || "For the drive."} ${enRoutePrice}.`;

  const jsonLd = buildGraph([
    buildOrganizationSchema(),
    buildWebPageSchema({
      path: "/objects",
      name: "Objects of Scent | Ligero Parfum",
      description: OBJECTS_DESCRIPTION,
      type: "CollectionPage",
      primaryImage: discoveryImage,
      mainEntityId: `${BASE_URL}/collection#itemlist`,
    }),
    buildCollectionListSchema([], objects, "Ligero Parfum Objects of Scent"),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Objects", path: "/objects" },
    ]),
  ]);

  return (
    <div className="min-h-screen bg-aube-base text-aube-text">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <SiteHeader />

      <main className="pt-[var(--header-offset)]">
        {/* 1. Type-only hero */}
        <section className="mx-auto max-w-[112rem] px-6 pb-8 pt-6 sm:px-10 sm:pb-20 sm:pt-16 lg:px-16">
          <h1 className="font-display text-4xl font-light italic tracking-[-0.01em] text-aube-text sm:text-7xl lg:text-[6rem]">
            Objects.
          </h1>
        </section>

        {/* 2. The Discovery Set wide row */}
        <section className="mx-auto max-w-[112rem] px-6 sm:px-10 lg:px-16">
          <article className="grid grid-cols-1 items-center gap-5 border-t border-aube-hairline py-8 sm:gap-8 sm:py-20 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <Link
                href="/discovery-set"
                className="group relative block aspect-[1417/1024] max-h-[240px] w-full overflow-hidden border border-aube-hairline bg-gradient-to-br from-[#ece8e0] via-[#f6f4ef] to-[#fdfcfa] sm:max-h-none"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-3 left-1/2 h-5 w-[64%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(28,20,14,0.20)_0%,rgba(28,20,14,0.08)_50%,transparent_76%)] sm:bottom-6"
                />
                <SmartImage
                  src={discoveryImage}
                  alt="The seven vials of the Discovery Set"
                  fill
                  priority
                  blurDataURL={discovery?.imageLqip}
                  fetchPriority="high"
                  decoding="sync"
                  quality={82}
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 100vw, 58vw"
                  className="relative z-10 object-contain p-4 md:[filter:drop-shadow(0_18px_26px_rgba(28,20,14,0.16))] transition-transform duration-700 ease-out group-hover:scale-[1.02] sm:p-6"
                />
              </Link>
            </div>

            <div className="flex flex-col items-start lg:col-span-5">
              <h2 className="font-display text-3xl font-light italic text-aube-text sm:text-6xl">
                <Link href="/discovery-set" className="hover:text-aube-accent">
                  {discoveryName}
                </Link>
              </h2>
              <p className="mt-2.5 font-display text-lg font-light italic text-aube-text sm:mt-4 sm:text-2xl">
                {discoveryCopy}
              </p>
              <Link
                href="/discovery-set"
                className="mt-4 inline-flex min-h-11 items-center border-b border-aube-accent py-2 text-xs uppercase tracking-[0.22em] text-aube-text transition-colors hover:border-aube-text hover:text-aube-accent sm:mt-7"
              >
                Open the Discovery Set
              </Link>
            </div>
          </article>

          {/* 3. En Route wide row */}
          <article className="grid grid-cols-1 items-center gap-5 border-t border-b border-aube-hairline py-8 sm:gap-8 sm:py-20 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7 lg:order-2">
              <Link
                href="/objects/en-route"
                className="group relative block aspect-[1417/1024] max-h-[240px] w-full overflow-hidden border border-aube-hairline bg-gradient-to-br from-[#ece8e0] via-[#f6f4ef] to-[#fdfcfa] sm:max-h-none"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-3 left-1/2 h-5 w-[64%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(28,20,14,0.20)_0%,rgba(28,20,14,0.08)_50%,transparent_76%)] sm:bottom-6"
                />
                <SmartImage
                  src={enRouteImage}
                  alt={`${enRouteName} car perfume`}
                  fill
                  loading="lazy"
                  blurDataURL={enRoute?.imageLqip}
                  quality={82}
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 100vw, 58vw"
                  className="relative z-10 object-contain p-4 md:[filter:drop-shadow(0_18px_26px_rgba(28,20,14,0.16))] transition-transform duration-700 ease-out group-hover:scale-[1.02] sm:p-6"
                />
              </Link>
            </div>

            <div className="flex flex-col items-start lg:col-span-5 lg:order-1">
              <h2 className="font-display text-3xl font-light italic text-aube-text sm:text-6xl">
                <Link href="/objects/en-route" className="hover:text-aube-accent">
                  {enRouteName}
                </Link>
              </h2>
              <p className="mt-2.5 font-display text-lg font-light italic text-aube-text sm:mt-4 sm:text-2xl">
                {enRouteCopy}
              </p>
              <Link
                href="/objects/en-route"
                className="mt-4 inline-flex min-h-11 items-center border-b border-aube-accent py-2 text-xs uppercase tracking-[0.22em] text-aube-text transition-colors hover:border-aube-text hover:text-aube-accent sm:mt-7"
              >
                Open En Route
              </Link>
            </div>
          </article>

          {/* 4. Additional House Objects from Sanity */}
          {extraObjects.map((obj, idx) => (
            <article
              key={obj.slug}
              id={obj.slug}
              className="grid grid-cols-1 items-center gap-8 border-b border-aube-hairline py-14 sm:py-20 lg:grid-cols-12 lg:gap-14"
            >
              <div
                className={`lg:col-span-7 ${idx % 2 === 1 ? "lg:order-2" : ""}`}
              >
                <div className="relative block aspect-[1417/1024] w-full overflow-hidden border border-aube-hairline bg-gradient-to-br from-[#ece8e0] via-[#f6f4ef] to-[#fdfcfa]">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-4 left-1/2 h-5 w-[60%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(28,20,14,0.20)_0%,rgba(28,20,14,0.08)_50%,transparent_76%)] sm:bottom-6"
                  />
                  <SmartImage
                    src={obj.image}
                    alt={obj.name}
                    fill
                    loading="lazy"
                    blurDataURL={obj.imageLqip}
                    quality={80}
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 100vw, 58vw"
                    className="relative z-10 object-contain p-6 md:[filter:drop-shadow(0_18px_26px_rgba(28,20,14,0.16))]"
                  />
                </div>
              </div>

              <div
                className={`flex flex-col items-start lg:col-span-5 ${
                  idx % 2 === 1 ? "lg:order-1" : ""
                }`}
              >
                <h2 className="font-display text-5xl font-light italic text-aube-text sm:text-6xl">
                  {obj.name}
                </h2>
                <p className="mt-4 font-display text-xl font-light italic text-aube-text sm:text-2xl">
                  {obj.description} {obj.price}.
                </p>
                {obj.volume && (
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-aube-text-muted">
                    {obj.volume}
                  </p>
                )}
                <AddEnRouteButton
                  className="mt-7"
                  slug={obj.slug}
                  name={obj.name}
                  price={obj.price}
                  volume={obj.volume || "House Object"}
                  image={obj.image}
                />
              </div>
            </article>
          ))}
        </section>

        {/* 4. The Correspondence */}
        <div className="mt-20">
          <PrivateSalon />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import PrivateSalon from "@/components/private-salon";
import AddEnRouteButton from "@/components/add-en-route-button";
import { getLiveObjects } from "@/lib/sanity/data";

import {
  buildBreadcrumbSchema,
  buildCollectionListSchema,
  buildGraph,
} from "@/lib/seo/schema";

export const metadata = {
  title: "Objects",
  description:
    "Scented objects from Ligero Parfum: The Discovery Set of seven 10 ml vials and En Route for the drive. Delivered free across serviceable Indian pin codes.",
  alternates: {
    canonical: "/objects",
  },
  openGraph: {
    title: "Objects | Ligero Parfum",
    description:
      "The Discovery Set of seven 10 ml vials and En Route car perfume.",
    url: "/objects",
    images: ["/images/objects/discovery-set-floating.webp"],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Objects | Ligero Parfum",
    description:
      "The Discovery Set of seven 10 ml vials and En Route car perfume.",
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
    buildCollectionListSchema([], objects),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Objects", path: "/objects" },
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
                <Image
                  src={discoveryImage}
                  alt="The seven vials of the Discovery Set"
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-contain p-4 drop-shadow-[0_20px_30px_rgba(28,20,14,0.14)] transition-transform duration-700 ease-out group-hover:scale-[1.02] sm:p-6"
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
                <Image
                  src={enRouteImage}
                  alt={`${enRouteName} car perfume`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-contain p-4 [filter:drop-shadow(0_18px_26px_rgba(28,20,14,0.16))] transition-transform duration-700 ease-out group-hover:scale-[1.02] sm:p-6"
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
                  <Image
                    src={obj.image}
                    alt={obj.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-contain p-6 drop-shadow-[0_18px_26px_rgba(28,20,14,0.16)]"
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

import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import PrivateSalon from "@/components/private-salon";
import { OrderDiscoverySetButton } from "@/components/discovery-set";
import { getLiveObjectBySlug, getLivePerfumes } from "@/lib/sanity/data";
import { getPerfumeCutoutImage } from "@/lib/products";

import {
  buildBreadcrumbSchema,
  buildGraph,
  buildProductSchema,
} from "@/lib/seo/schema";

export const metadata = {
  title: "The Discovery Set",
  description:
    "Sample every permanent Ligero Parfum creation in seven 10 ml travel atomizers. INR 999 with complimentary domestic surface shipping across India.",
  alternates: {
    canonical: "/discovery-set",
  },
  openGraph: {
    title: "The Discovery Set | Ligero Parfum",
    description:
      "Seven 10 ml travel atomizers from the permanent collection. INR 999 with free domestic shipping across India.",
    url: "/discovery-set",
    images: ["/images/objects/discovery-set-floating.webp"],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "The Discovery Set | Ligero Parfum",
    description:
      "Seven 10 ml travel atomizers from the permanent collection. INR 999 with free domestic shipping.",
    images: ["/images/objects/discovery-set-floating.webp"],
  },
};

/**
 * The Discovery Set page (site-blueprint.md §11a).
 * 1. Product-first hero: "The Discovery Set", price 999, "Add to Case", flat-lay of the seven vials.
 * 2. What is inside: the seven vials as a horizontal strip, name and one line each.
 * 3. The Correspondence.
 * 4. Footer.
 */
export default async function DiscoverySetPage() {
  const [perfumes, discoveryObj] = await Promise.all([
    getLivePerfumes(),
    getLiveObjectBySlug("discovery-set"),
  ]);

  const setName = discoveryObj?.name || "The Discovery Set";
  const setPrice = discoveryObj?.price ?? 999;
  const setVolume = discoveryObj?.volume || `${perfumes.length} × 10 ml`;
  const setDescription =
    discoveryObj?.description ||
    "Every perfume the house makes, ten millilitres each.";
  const setImage =
    discoveryObj?.image || "/images/objects/discovery-set-floating.webp";

  const jsonLd = buildGraph([
    buildProductSchema({
      name: setName,
      slug: "discovery-set",
      path: "/discovery-set",
      description: `${setDescription} ${setVolume}.`,
      images: [setImage],
      price: setPrice,
      category: "Perfume Discovery Set",
      size: setVolume,
    }),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Objects", path: "/objects" },
      { name: setName, path: "/discovery-set" },
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
        {/* 1. Product-first hero */}
        <section className="mx-auto max-w-[112rem] px-5 pb-12 pt-6 sm:px-10 sm:pb-20 sm:pt-16 lg:px-16">
          <div className="grid grid-cols-1 items-start gap-6 sm:gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <div className="relative aspect-[1417/1024] max-h-[240px] w-full overflow-hidden border border-aube-hairline bg-gradient-to-br from-[#ece8e0] via-[#f6f4ef] to-[#fdfcfa] p-4 sm:max-h-none sm:p-10">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-3 left-1/2 h-5 w-[64%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(28,20,14,0.20)_0%,rgba(28,20,14,0.08)_50%,transparent_76%)] sm:bottom-6"
                />
                <Image
                  src={setImage}
                  alt={`The ${perfumes.length} ten-millilitre vials of the Discovery Set`}
                  fill
                  priority
                  fetchPriority="high"
                  decoding="sync"
                  quality={82}
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 100vw, 58vw"
                  className="relative z-10 object-contain object-center p-2 md:[filter:drop-shadow(0_18px_26px_rgba(28,20,14,0.16))] sm:p-4"
                />
              </div>
            </div>

            <div className="flex flex-col items-start lg:col-span-5">
              <h1 className="font-display text-4xl font-light italic leading-[1.02] tracking-[-0.02em] text-aube-text sm:text-6xl lg:text-7xl">
                {setName}
              </h1>

              <p className="mt-2.5 font-display text-lg font-light italic text-aube-text sm:mt-4 sm:text-2xl">
                {setDescription}
              </p>

              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-aube-text-muted">
                {perfumes.length === 7 ? "Seven" : perfumes.length} vials, one box · {setVolume}
              </p>

              <div className="mt-4 flex w-full items-baseline gap-3 border-t border-b border-aube-hairline py-3 sm:mt-6 sm:py-4">
                <span className="font-display text-3xl font-light tabular-nums sm:text-4xl">
                  {setPrice}
                </span>
                <span className="text-xs text-aube-text-muted">
                  Inclusive of all taxes.
                </span>
              </div>

              <OrderDiscoverySetButton
                className="mt-4 min-h-11 w-full text-center sm:mt-6"
                name={setName}
                price={setPrice}
                volume={setVolume}
                image={setImage}
              />

              <p className="mt-4 text-xs leading-relaxed text-aube-text-muted sm:mt-5">
                Dispatched within two working days. Sealed boxes can be returned within seven days.
              </p>

              <div className="mt-5 w-full divide-y divide-aube-hairline border-t border-b border-aube-hairline sm:mt-6">
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
                      <dd className="inline">Eau de Parfum Discovery Set (7 vials)</dd>
                    </div>
                    <div>
                      <dt className="inline font-medium">Net quantity:</dt>{" "}
                      <dd className="inline">7 × 10 ml (70 ml total)</dd>
                    </div>
                    <div>
                      <dt className="inline font-medium">MRP:</dt>{" "}
                      <dd className="inline">₹999, inclusive of all taxes</dd>
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
        </section>

        {/* 2. What is inside */}
        <section
          aria-labelledby="inside-heading"
          className="border-t border-aube-hairline py-12 sm:py-24"
        >
          <div className="mx-auto max-w-[112rem] px-5 sm:px-10 lg:px-16">
            <h2
              id="inside-heading"
              className="font-display text-3xl font-light italic text-aube-text sm:text-5xl"
            >
              {perfumes.length === 7 ? "Seven" : perfumes.length} vials, ten millilitres each.
            </h2>

            <div className="mt-6 flex snap-x snap-mandatory overflow-x-auto border-t border-b border-aube-hairline divide-x divide-aube-hairline no-scrollbar touch-pan-x sm:mt-10">
              {perfumes.map((p) => {
                const cutout = getPerfumeCutoutImage(p);
                return (
                  <Link
                    key={p.slug}
                    href={`/collection/${p.slug}`}
                    className="group flex w-[46vw] shrink-0 snap-start flex-col justify-between bg-aube-surface p-4 sm:w-[42vw] sm:p-6 md:w-[30vw] lg:w-[22%]"
                  >
                    <div className="relative aspect-[3/4] w-full overflow-hidden">
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute bottom-2 left-1/2 h-4 w-[54%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(28,20,14,0.28)_0%,rgba(28,20,14,0.11)_52%,transparent_76%)] transition-all duration-500 group-hover:scale-x-90 group-hover:opacity-75"
                      />
                      <Image
                        src={cutout}
                        alt={`${p.name} bottle`}
                        fill
                        loading="eager"
                        quality={78}
                        sizes="180px"
                        className="object-contain p-2 sm:p-3 md:[filter:drop-shadow(-10px_14px_16px_rgba(28,20,14,0.22))] transition-transform duration-500 group-hover:-translate-y-1"
                      />
                    </div>
                    <div className="mt-3 border-t border-aube-hairline pt-3 sm:mt-4 sm:pt-4">
                      <p className="font-display text-lg font-light italic text-aube-text group-hover:text-aube-accent sm:text-2xl">
                        {p.name}
                      </p>
                      <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-aube-text-muted sm:line-clamp-none sm:text-xs">
                        {p.oneLiner}
                      </p>
                      {p.occasions && p.occasions.length > 0 && (
                        <p className="mt-2 font-body text-[9.5px] uppercase tracking-[0.14em] text-aube-accent">
                          {p.occasions.slice(0, 3).join(" · ")}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. The Correspondence */}
        <PrivateSalon />
      </main>

      <SiteFooter />
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import PrivateSalon from "@/components/private-salon";
import { OrderDiscoverySetButton } from "@/components/discovery-set";
import { getLivePerfumes } from "@/lib/sanity/data";

export const metadata = {
  title: "The Discovery Set | Ligero Parfum",
  description: "Every perfume the house makes, ten millilitres each. Seven vials, one box.",
};

const STEPS = [
  "Wear one a day.",
  "Note where it settles on your skin.",
  "Choose one.",
];

/**
 * The Discovery Set page (site-blueprint.md §11a).
 * 1. Product-first hero: "The Discovery Set", price 999, "Add to Case", flat-lay of the seven vials.
 * 2. What is inside: the seven vials as a horizontal strip, name and one line each.
 * 3. How to use it: three steps, one line each.
 * 4. The Correspondence.
 * 5. Footer.
 */
export default async function DiscoverySetPage() {
  const perfumes = await getLivePerfumes();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "The Discovery Set",
    description: "Every perfume the house makes, ten millilitres each. Seven vials, one box.",
    image: ["/images/objects/discovery-set-floating.webp"],
    brand: {
      "@type": "Brand",
      name: "Ligero Parfum",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: 999,
      availability: "https://schema.org/InStock",
      url: "https://ligeroparfums.com/discovery-set",
    },
  };

  return (
    <div className="min-h-screen bg-aube-base text-aube-text">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SiteHeader />

      <main className="pt-[var(--header-offset)]">
        {/* 1. Product-first hero */}
        <section className="mx-auto max-w-[112rem] px-6 pb-20 pt-12 sm:px-10 sm:pt-16 lg:px-16">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <div className="relative aspect-[1417/1024] w-full overflow-hidden border border-aube-hairline bg-gradient-to-br from-[#ece8e0] via-[#f6f4ef] to-[#fdfcfa] p-6 sm:p-10">
                <Image
                  src="/images/objects/discovery-set-floating.webp"
                  alt="The seven ten-millilitre vials of the Discovery Set"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-contain object-center p-4 drop-shadow-[0_20px_30px_rgba(28,20,14,0.14)]"
                />
              </div>
            </div>

            <div className="flex flex-col items-start lg:col-span-5">
              <h1 className="font-display text-6xl font-light italic leading-[0.98] tracking-[-0.02em] text-aube-text sm:text-7xl">
                The Discovery Set
              </h1>

              <p className="mt-4 font-display text-xl font-light italic text-aube-text sm:text-2xl">
                Every perfume the house makes, ten millilitres each.
              </p>

              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-aube-text-muted">
                Seven vials, one box · 7 × 10 ml
              </p>

              <div className="mt-6 flex w-full items-baseline gap-3 border-t border-b border-aube-hairline py-4">
                <span className="font-display text-4xl font-light tabular-nums">
                  999
                </span>
                <span className="text-xs text-aube-text-muted">
                  Inclusive of all taxes.
                </span>
              </div>

              <OrderDiscoverySetButton className="mt-6 w-full text-center" />

              <p className="mt-5 text-xs leading-relaxed text-aube-text-muted">
                Dispatched within two working days. Sealed boxes can be returned within seven days.
              </p>

              <div className="mt-6 w-full divide-y divide-aube-hairline border-t border-b border-aube-hairline">
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
                      <dd className="inline">Extrait de Parfum Discovery Set (7 vials)</dd>
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
          className="border-t border-aube-hairline py-20 sm:py-24"
        >
          <div className="mx-auto max-w-[112rem] px-6 sm:px-10 lg:px-16">
            <h2
              id="inside-heading"
              className="font-display text-4xl font-light italic text-aube-text sm:text-5xl"
            >
              Seven vials, ten millilitres each.
            </h2>

            <div className="mt-10 flex snap-x snap-mandatory overflow-x-auto border-t border-b border-aube-hairline divide-x divide-aube-hairline no-scrollbar">
              {perfumes.map((p) => {
                const cutout = `/images/perfumes/cutouts/${p.slug}.webp?v=2`;
                return (
                  <Link
                    key={p.slug}
                    href={`/collection/${p.slug}`}
                    className="group flex w-[74vw] shrink-0 snap-start flex-col justify-between bg-aube-surface p-6 sm:w-[42vw] md:w-[30vw] lg:w-[22%]"
                  >
                    <div className="relative aspect-[3/4] w-full overflow-hidden">
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute bottom-2 left-1/2 h-4 w-[52%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(28,20,14,0.30)_0%,rgba(28,20,14,0.12)_52%,transparent_78%)] blur-[3px] transition-all duration-500 group-hover:scale-x-90 group-hover:opacity-75"
                      />
                      <Image
                        src={cutout}
                        alt={`${p.name} bottle`}
                        fill
                        sizes="(max-width: 640px) 74vw, 22vw"
                        className="object-contain p-3 [filter:drop-shadow(-12px_16px_18px_rgba(28,20,14,0.25))_drop-shadow(0_5px_9px_rgba(28,20,14,0.15))] transition-transform duration-500 group-hover:-translate-y-1"
                      />
                    </div>
                    <div className="mt-4 border-t border-aube-hairline pt-4">
                      <p className="font-display text-2xl font-light italic text-aube-text group-hover:text-aube-accent">
                        {p.name}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-aube-text-muted">
                        {p.oneLiner}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. How to use it */}
        <section
          aria-labelledby="how-to-use-heading"
          className="border-t border-aube-hairline py-20 sm:py-24"
        >
          <div className="mx-auto max-w-4xl px-6 sm:px-10">
            <h2
              id="how-to-use-heading"
              className="font-display text-3xl font-light italic text-aube-text sm:text-4xl"
            >
              How to use it
            </h2>
            <ol className="mt-8 flex flex-col divide-y divide-aube-hairline border-t border-b border-aube-hairline">
              {STEPS.map((step) => (
                <li
                  key={step}
                  className="py-6 font-display text-2xl font-light italic text-aube-text sm:text-3xl"
                >
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 4. The Correspondence */}
        <PrivateSalon />
      </main>

      <SiteFooter />
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import CollectionRow from "@/components/collection-row";
import { OrderDiscoverySetButton } from "@/components/discovery-set";
import { PERFUMES, OBJECTS } from "@/lib/products";

export const metadata = {
  title: "The Collection — Ligero Parfum",
  description: "Seven perfumes. Blended in India, rested ninety days.",
};

export default function CollectionPage() {
  const firstBatch = PERFUMES.slice(0, 3);
  const secondBatch = PERFUMES.slice(3);
  const discoverySet = OBJECTS.find((o) => o.slug === "discovery-set");

  return (
    <div className="min-h-screen bg-aube-base text-aube-text">
      <SiteHeader />

      <main className="pt-28 sm:pt-36">
        {/* Type-only Hero */}
        <section className="mx-auto max-w-[112rem] px-6 pb-16 pt-8 sm:px-10 sm:pb-24 sm:pt-12 lg:px-16">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-aube-text-muted">
            The Catalog
          </p>
          <h1 className="mt-4 font-display text-6xl font-light italic tracking-[-0.01em] text-aube-text sm:text-7xl lg:text-8xl xl:text-9xl">
            The Collection
          </h1>
          <p className="mt-6 max-w-xl text-lg text-aube-text-muted sm:text-xl">
            Seven perfumes, each one rested ninety days before a single bottle is filled.
          </p>
          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-aube-text-muted">
            Prices in rupees, inclusive of all taxes.
          </p>
        </section>

        {/* First Batch of Perfumes */}
        <section aria-label="Permanent Lineup Part One">
          {firstBatch.map((product, idx) => (
            <CollectionRow key={product.slug} product={product} index={idx} />
          ))}
        </section>

        {/* Full-bleed Editorial Atmosphere Break */}
        <section className="relative my-12 overflow-hidden border-y border-aube-hairline bg-[#101418] text-[#EAE6DC]">
          <div className="relative h-[65vh] min-h-[440px] w-full">
            <Image
              src="/images/perfumes/all-perfumes.jpeg"
              alt="Ligero Parfum flacons in natural atelier setting"
              fill
              sizes="100vw"
              className="object-cover opacity-65"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#101418] via-transparent to-black/40" />
            <div className="relative z-10 flex h-full items-end p-8 sm:p-14 lg:p-20">
              <div className="max-w-2xl">
                <p className="font-display text-3xl font-light italic leading-tight text-[#EAE6DC] sm:text-4xl lg:text-5xl">
                  Each blend rests ninety days before a single bottle is filled.
                </p>
                <p className="mt-4 text-xs uppercase tracking-[0.22em] text-noctis-accent">
                  Single-origin harvests, named estates
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Second Batch of Perfumes */}
        <section aria-label="Permanent Lineup Part Two">
          {secondBatch.map((product, idx) => (
            <CollectionRow key={product.slug} product={product} index={idx + 3} />
          ))}
        </section>

        {/* The Discovery Set Band */}
        {discoverySet && (
          <section className="mx-auto max-w-[112rem] px-6 py-20 sm:px-10 lg:px-16">
            <div className="flex flex-col items-start justify-between gap-8 border border-aube-hairline bg-aube-surface p-8 sm:p-12 lg:flex-row lg:items-center lg:p-16">
              <div className="max-w-2xl">
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-aube-text-muted">
                  New to Ligero?
                </p>
                <h3 className="mt-2 font-display text-3xl font-light italic text-aube-text sm:text-4xl">
                  The Discovery Set
                </h3>
                <p className="mt-3 text-base text-aube-text-muted sm:text-lg">
                  Every perfume the house makes, ten millilitres each. Seven vials, one box. Rested ninety days.
                </p>
                <p className="mt-2 font-display text-2xl font-light text-aube-text">
                  {discoverySet.price}
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <OrderDiscoverySetButton />
              </div>
            </div>
          </section>
        )}

        {/* Bespoke Commissions Band */}
        <section className="mx-auto max-w-[112rem] px-6 pb-24 sm:px-10 lg:px-16">
          <div className="border border-aube-hairline bg-transparent p-8 text-center sm:p-12">
            <p className="font-display text-2xl font-light italic text-aube-text sm:text-3xl">
              Private commissions are accepted twice a year. Write to the maison.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-block border-b border-aube-accent pb-1 text-xs uppercase tracking-[0.22em] text-aube-accent transition-opacity hover:opacity-80"
            >
              Arrange a Private Appointment
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

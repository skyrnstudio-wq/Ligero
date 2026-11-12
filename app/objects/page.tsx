import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import PrivateSalon from "@/components/private-salon";

export const metadata = {
  title: "Objects | Ligero Parfum",
  description: "The Discovery Set and En Route.",
};

/**
 * Objects page (site-blueprint.md §10).
 * Two rows, no card grid. Objects is a shelf, not a shop.
 * 1. Type-only hero: "Objects."
 * 2. The Discovery Set row.
 * 3. En Route row.
 * 4. The Correspondence.
 * 5. Footer.
 */
export default function ObjectsPage() {
  return (
    <div className="min-h-screen bg-aube-base text-aube-text">
      <SiteHeader />

      <main className="pt-[var(--header-offset)]">
        {/* 1. Type-only hero */}
        <section className="mx-auto max-w-[112rem] px-6 pb-14 pt-12 sm:px-10 sm:pb-20 sm:pt-16 lg:px-16">
          <h1 className="font-display text-6xl font-light italic tracking-[-0.01em] text-aube-text sm:text-7xl lg:text-[6rem]">
            Objects.
          </h1>
        </section>

        {/* 2. The Discovery Set wide row */}
        <section className="mx-auto max-w-[112rem] px-6 sm:px-10 lg:px-16">
          <article className="grid grid-cols-1 items-center gap-8 border-t border-aube-hairline py-14 sm:py-20 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <Link
                href="/discovery-set"
                className="group relative block aspect-[1417/1024] w-full overflow-hidden border border-aube-hairline bg-gradient-to-br from-[#ece8e0] via-[#f6f4ef] to-[#fdfcfa]"
              >
                <Image
                  src="/images/objects/discovery-set-floating.webp"
                  alt="The seven vials of the Discovery Set"
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-contain p-6 drop-shadow-[0_20px_30px_rgba(28,20,14,0.14)] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
              </Link>
            </div>

            <div className="flex flex-col items-start lg:col-span-5">
              <h2 className="font-display text-5xl font-light italic text-aube-text sm:text-6xl">
                <Link href="/discovery-set" className="hover:text-aube-accent">
                  The Discovery Set
                </Link>
              </h2>
              <p className="mt-4 font-display text-xl font-light italic text-aube-text sm:text-2xl">
                Every perfume the house makes, ten millilitres each. Seven vials, one box. 999.
              </p>
              <Link
                href="/discovery-set"
                className="mt-7 inline-block border-b border-aube-accent pb-1 text-xs uppercase tracking-[0.22em] text-aube-text transition-colors hover:border-aube-text hover:text-aube-accent"
              >
                Open the Discovery Set
              </Link>
            </div>
          </article>

          {/* 3. En Route wide row */}
          <article className="grid grid-cols-1 items-center gap-8 border-t border-b border-aube-hairline py-14 sm:py-20 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7 lg:order-2">
              <Link
                href="/objects/en-route"
                className="group relative block aspect-[1417/1024] w-full overflow-hidden border border-aube-hairline bg-gradient-to-br from-[#ece8e0] via-[#f6f4ef] to-[#fdfcfa]"
              >
                <Image
                  src="/images/objects/car-perfume-floating.webp"
                  alt="En Route car perfume"
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-contain p-6 [filter:drop-shadow(0_18px_26px_rgba(28,20,14,0.16))] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
              </Link>
            </div>

            <div className="flex flex-col items-start lg:col-span-5 lg:order-1">
              <h2 className="font-display text-5xl font-light italic text-aube-text sm:text-6xl">
                <Link href="/objects/en-route" className="hover:text-aube-accent">
                  En Route
                </Link>
              </h2>
              <p className="mt-4 font-display text-xl font-light italic text-aube-text sm:text-2xl">
                For the drive. 499.
              </p>
              <Link
                href="/objects/en-route"
                className="mt-7 inline-block border-b border-aube-accent pb-1 text-xs uppercase tracking-[0.22em] text-aube-text transition-colors hover:border-aube-text hover:text-aube-accent"
              >
                Open En Route
              </Link>
            </div>
          </article>
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

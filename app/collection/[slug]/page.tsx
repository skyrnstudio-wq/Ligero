import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import ProductOrderPanel from "@/components/product-order-panel";
import { PERFUMES, getProductBySlug } from "@/lib/products";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PERFUMES.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) return { title: "Product Not Found — Ligero Parfum" };

  return {
    title: `${product.name} — Ligero Parfum`,
    description: `${product.oneLiner} ${product.volume}. Rested ninety days.`,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const isDark = Boolean(product.isDark);
  const relatedProducts = product.relatedSlugs
    .map((s) => getProductBySlug(s))
    .filter(Boolean);

  const containerBg = isDark ? "bg-[#101418] text-[#EAE6DC]" : "bg-aube-base text-aube-text";
  const mutedText = isDark ? "text-[#A9A69C]" : "text-aube-text-muted";
  const hairlineBorder = isDark ? "border-[#3A3F45]" : "border-aube-hairline";
  const accentColor = isDark ? "text-[#B9975B]" : "text-aube-accent";
  const surfaceBg = isDark ? "bg-[#1A1F24]" : "bg-aube-surface";

  return (
    <div className={`min-h-screen transition-colors duration-500 ${containerBg}`}>
      <SiteHeader isDark={isDark} />

      <main className="pt-28 sm:pt-36">
        <div className="mx-auto max-w-[112rem] px-6 pb-24 sm:px-10 lg:px-16">
          {/* Breadcrumb link */}
          <nav aria-label="Breadcrumb" className="pb-8">
            <Link
              href="/collection"
              className={`text-xs uppercase tracking-[0.2em] ${mutedText} transition-colors hover:${accentColor}`}
            >
              ← The Collection
            </Link>
          </nav>

          {/* Two-Column Asymmetric Layout (Blueprint §7) */}
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-20">
            {/* Left Column: Sticky Product Presentation & Ordering */}
            <div className="lg:col-span-6 xl:col-span-5">
              <div className="lg:sticky lg:top-28">
                <p className={`text-xs font-medium uppercase tracking-[0.22em] ${mutedText}`}>
                  {product.subtitle}
                </p>

                <h1 className={`mt-3 font-display text-6xl font-light italic tracking-[-0.01em] sm:text-7xl lg:text-8xl ${isDark ? "font-bodoni" : ""}`}>
                  {product.name}
                </h1>

                <p className="mt-3 text-base italic opacity-85 sm:text-lg">
                  {product.oneLiner}
                </p>

                {/* Bottle Photography Panel */}
                <div className={`relative mt-8 aspect-[4/5] w-full overflow-hidden border ${hairlineBorder} ${surfaceBg}`}>
                  <Image
                    src={product.image}
                    alt={`${product.name} flacon`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-contain p-8 sm:p-12"
                  />
                </div>

                {/* Interactive Order & Case Controls */}
                <ProductOrderPanel product={product} isDark={isDark} />
              </div>
            </div>

            {/* Right Column: Scent Story, Material & Provenance */}
            <div className="lg:col-span-6 xl:col-span-7 lg:pt-16">
              <div className="max-w-2xl flex flex-col gap-16 lg:gap-20">
                {/* 1. Scent Notes as Poem */}
                <section aria-labelledby="notes-heading" className={`border-b ${hairlineBorder}/60 pb-12`}>
                  <h2 id="notes-heading" className={`text-xs font-medium uppercase tracking-[0.24em] ${accentColor}`}>
                    The Scent Notes
                  </h2>
                  <div className="mt-6 font-display text-3xl font-light italic leading-relaxed sm:text-4xl">
                    {product.notesPoem.map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>
                  <p className={`mt-6 text-xs uppercase tracking-[0.2em] ${mutedText}`}>
                    {product.notesUppercase}
                  </p>
                </section>

                {/* 2. The Ritual */}
                <section aria-labelledby="ritual-heading" className={`border-b ${hairlineBorder}/60 pb-12`}>
                  <h2 id="ritual-heading" className={`text-xs font-medium uppercase tracking-[0.24em] ${accentColor}`}>
                    The Ritual
                  </h2>
                  <p className="mt-4 text-lg leading-relaxed sm:text-xl font-normal opacity-90">
                    {product.ritual}
                  </p>
                </section>

                {/* 3. The Material */}
                <section aria-labelledby="material-heading" className={`border-b ${hairlineBorder}/60 pb-12`}>
                  <h2 id="material-heading" className={`text-xs font-medium uppercase tracking-[0.24em] ${accentColor}`}>
                    The Material
                  </h2>
                  <p className="mt-4 text-lg leading-relaxed sm:text-xl font-normal opacity-90">
                    {product.material}
                  </p>
                </section>

                {/* 4. Provenance & Batch */}
                <section aria-labelledby="provenance-heading" className={`border-b ${hairlineBorder}/60 pb-12`}>
                  <h2 id="provenance-heading" className={`text-xs font-medium uppercase tracking-[0.24em] ${accentColor}`}>
                    Provenance
                  </h2>
                  <p className="mt-4 text-2xl font-display font-light italic">
                    {product.provenance}
                  </p>
                  <p className={`mt-2 text-xs uppercase tracking-[0.18em] ${mutedText}`}>
                    Pure alcohol from French beet sugar. Zero synthetic fixatives.
                  </p>
                </section>

                {/* 5. Continue the Story */}
                <section aria-labelledby="related-heading" className="pt-2">
                  <h2 id="related-heading" className={`text-xs font-medium uppercase tracking-[0.24em] ${accentColor}`}>
                    Continue the Story
                  </h2>
                  <div className="mt-6 flex flex-col divide-y divide-current/15">
                    {relatedProducts.map((rel) => (
                      <Link
                        key={rel!.slug}
                        href={`/collection/${rel!.slug}`}
                        className="group flex items-center justify-between py-6 transition-colors"
                      >
                        <div>
                          <p className="font-display text-3xl font-light italic transition-colors group-hover:opacity-75">
                            {rel!.name}
                          </p>
                          <p className={`mt-1 text-sm ${mutedText}`}>
                            {rel!.oneLiner}
                          </p>
                        </div>
                        <span className={`text-xs uppercase tracking-[0.2em] ${accentColor} transition-transform group-hover:translate-x-1`}>
                          Open {rel!.name} →
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

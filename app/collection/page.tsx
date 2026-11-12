import Link from "next/link";
import Image from "next/image";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import PrivateSalon from "@/components/private-salon";
import CollectionCatalog from "@/components/collection-catalog";
import { getLivePerfumes } from "@/lib/sanity/data";

export const metadata = {
  title: "Perfume | The Collection — Ligero Parfum",
  description:
    "Seven eau de parfum creations and the Discovery Set.",
};

export default async function CollectionPage() {
  const perfumes = await getLivePerfumes();

  return (
    <div className="min-h-screen bg-[#FBF8F2] text-aube-text">
      <SiteHeader />

      <main className="pt-[var(--header-offset)]">
        {/* 1. Tactile Macro Glass & Raw Silk Hero Banner ("Perfume") */}
        <section
          aria-label="Perfume Collection Header"
          className="relative flex h-[170px] w-full items-center justify-center overflow-hidden border-b border-aube-hairline bg-[#EAE0CE] sm:h-[210px] lg:h-[240px]"
          style={{
            backgroundImage: `
              radial-gradient(ellipse at 50% 45%, rgba(255, 252, 245, 0.72) 0%, rgba(234, 224, 206, 0.4) 60%, rgba(212, 198, 174, 0.55) 100%),
              url('/images/textures/raw-silk-canvas.webp')
            `,
            backgroundRepeat: "no-repeat, repeat",
            backgroundSize: "100% 100%, 360px 360px",
          }}
        >
          {/* Macro glass rim detail framing the banner */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden opacity-40 mix-blend-multiply"
          >
            <div className="absolute -left-[8%] -top-[185%] h-[460%] w-[78%] rotate-[-82deg]">
              <Image
                src="/images/hero/ligero-parfum-cutout.webp"
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-contain scale-125"
              />
            </div>
            <div className="absolute -right-[18%] -top-[140%] h-[380%] w-[52%] rotate-[-18deg]">
              <Image
                src="/images/perfumes/cutouts/aube.webp?v=2"
                alt=""
                fill
                sizes="60vw"
                className="object-contain"
              />
            </div>
          </div>

          <div className="relative z-10 px-6 text-center">
            <h1 className="font-display text-4xl font-normal tracking-[-0.01em] text-[#1c140e] sm:text-5xl lg:text-[3.5rem]">
              Perfume
            </h1>
          </div>
        </section>

        {/* 2. Interactive Filter/Sort Bar + Clean Catalog Grid */}
        <CollectionCatalog perfumes={perfumes} />

        {/* 3. Horizontal Correspondence Strip */}
        <PrivateSalon variant="strip" />
      </main>

      <SiteFooter />
    </div>
  );
}

import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import Hero from "@/components/hero";
import TheCollection from "@/components/the-collection";
import EditorialQuote from "@/components/editorial-quote";
import ObjectsDuo from "@/components/objects-duo";
import PrivateSalon from "@/components/private-salon";
import { getLiveHomepage } from "@/lib/sanity/data";

export default async function Home() {
  const homepageData = await getLiveHomepage();

  return (
    <>
      <SiteHeader />
      <main className="relative">
        {/* Movement 1: Stationary Sticky Campaign Hero */}
        <div className="sticky top-0 z-0">
          <Hero />
        </div>

        {/* Elevated Curtain Layer: Slides smoothly on top of the stationary Hero */}
        <div className="relative z-10 border-t border-aube-hairline bg-[#FAFAF7] shadow-[0_-24px_64px_rgba(28,20,14,0.20)]">
          {/* Movement 2: The Seven Extraits */}
          <TheCollection />

          {/* Movement 3: Maison Philosophy / Editorial Quote */}
          <EditorialQuote />

          {/* Movement 4: Objects of Scent (Two Columns: The Discovery Set & En Route) */}
          <ObjectsDuo />

          {/* Movement 5: The Private Salon / The Correspondence */}
          <PrivateSalon data={homepageData} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

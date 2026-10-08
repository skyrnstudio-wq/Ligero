import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import Hero from "@/components/hero";
import TheCollection from "@/components/the-collection";
import ObjectsOfScent from "@/components/objects-of-scent";
import PrivateSalon from "@/components/private-salon";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* Movement 1: The Campaign Hero — The Silk Emporium */}
        <Hero />

        {/* Movement 2: The Seven Olfactive Emotions */}
        <TheCollection />

        {/* Movement 3: The Objects of Scent (Discovery Set & En Route) */}
        <ObjectsOfScent />

        {/* Movement 4: The Private Salon */}
        <PrivateSalon />
      </main>
      <SiteFooter />
    </>
  );
}

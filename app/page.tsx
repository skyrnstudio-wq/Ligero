import IntroLoader from "@/components/intro-loader";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import Hero from "@/components/hero";
import Manifesto from "@/components/manifesto";
import TheCollection from "@/components/the-collection";
import DiscoverySet from "@/components/discovery-set";
import ObjectsStrip from "@/components/objects-strip";
import CraftStrip from "@/components/craft-strip";
import EditorialBreak from "@/components/editorial-break";
import Correspondence from "@/components/correspondence";

export default function Home() {
  return (
    <>
      <IntroLoader />
      <SiteHeader />
      <main>
        <Hero />
        <Manifesto />
        <TheCollection />
        <DiscoverySet />
        <ObjectsStrip />
        <CraftStrip />
        <EditorialBreak />
        <Correspondence />
      </main>
      <SiteFooter />
    </>
  );
}

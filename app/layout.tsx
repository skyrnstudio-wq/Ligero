import type { Metadata, Viewport } from "next";
import { preconnect } from "react-dom";
import { Cormorant_Garamond, Schibsted_Grotesk, Bodoni_Moda } from "next/font/google";
import "./globals.css";
import { CaseProvider } from "@/context/case-context";
import { CatalogProvider } from "@/context/catalog-context";
import CaseDrawer from "@/components/lazy-case-drawer";
import SmoothScrollProvider from "@/components/smooth-scroll";
import SpeculationRules from "@/components/speculation-rules";
import { getLiveObjects, getLivePerfumes } from "@/lib/sanity/data";
import { BASE_URL } from "@/lib/seo/schema";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bodoni",
  display: "swap",
});

const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-schibsted",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Ligero Parfum | Independent Indian Perfume House",
    template: "%s | Ligero Parfum",
  },
  description:
    "Seven permanent Eau de Parfum creations formulated in India with botanical absolutes and resins. 50 ml flacons, The Discovery Set, and En Route.",
  applicationName: "Ligero Parfum",
  authors: [{ name: "Ligero Parfum", url: BASE_URL }],
  creator: "Ligero Parfum Private Limited",
  publisher: "Ligero Parfum Private Limited",
  alternates: {
    types: {
      "text/plain": "/llms.txt",
      "text/markdown": "/pricing.md",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "Ligero Parfum",
    title: "Ligero Parfum | Independent Indian Perfume House",
    description:
      "Seven permanent Eau de Parfum creations formulated in India with botanical absolutes and resins.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ligero Parfum | Independent Indian Perfume House",
    description:
      "Seven permanent Eau de Parfum creations formulated in India with botanical absolutes and resins.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#f3ede3",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  preconnect("https://cdn.sanity.io");

  const [perfumes, objects] = await Promise.all([
    getLivePerfumes(),
    getLiveObjects(),
  ]);

  // Keep global CatalogProvider payload ultra-lean (only fields needed by Header/Search/Case)
  const lightPerfumes = perfumes.map((p) => ({
    slug: p.slug,
    name: p.name,
    subtitle: p.subtitle,
    volume: p.volume,
    price: p.price,
    badge: p.badge,
    oneLiner: p.oneLiner,
    notesUppercase: p.notesUppercase,
    notesPoem: ["", "", ""] as [string, string, string],
    ritual: "",
    material: "",
    provenance: "",
    image: p.image,
    gallery: [],
    relatedSlugs: [],
    occasions: p.occasions,
    isDark: p.isDark,
    scentProfile: {
      top: p.scentProfile.top,
      heart: p.scentProfile.heart,
      base: p.scentProfile.base,
      family: p.scentProfile.family,
    },
    keyIngredients: [],
  }));
  const lightObjects = objects.map(({ imageLqip: _i, seo: _s, updatedAt: _u, ...rest }) => rest);

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${bodoni.variable} ${schibsted.variable}`}
      suppressHydrationWarning
    >
      <body
        className="font-body antialiased selection:bg-aube-accent selection:text-aube-base"
        suppressHydrationWarning
      >
        <SmoothScrollProvider>
          <CatalogProvider perfumes={lightPerfumes} objects={lightObjects}>
            <CaseProvider>
              {children}
              <CaseDrawer />
            </CaseProvider>
          </CatalogProvider>
        </SmoothScrollProvider>
        <SpeculationRules />
      </body>
    </html>
  );
}

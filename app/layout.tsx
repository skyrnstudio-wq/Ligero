import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Schibsted_Grotesk, Bodoni_Moda } from "next/font/google";
import "./globals.css";
import { CaseProvider } from "@/context/case-context";
import { CatalogProvider } from "@/context/catalog-context";
import CaseDrawer from "@/components/lazy-case-drawer";
import SmoothScrollProvider from "@/components/smooth-scroll";
import IntroLoader from "@/components/intro-loader";
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
  variable: "--font-bodoni",
  display: "swap",
  preload: false,
});

const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-schibsted",
  display: "swap",
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
  const [perfumes, objects] = await Promise.all([
    getLivePerfumes(),
    getLiveObjects(),
  ]);

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
          <CatalogProvider perfumes={perfumes} objects={objects}>
            <CaseProvider>
              <IntroLoader />
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

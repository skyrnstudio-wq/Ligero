import type { Metadata } from "next";
import { Cormorant_Garamond, Schibsted_Grotesk, Bodoni_Moda } from "next/font/google";
import "./globals.css";
import { CaseProvider } from "@/context/case-context";
import CaseDrawer from "@/components/case-drawer";
import IntroLoader from "@/components/intro-loader";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-bodoni",
  display: "swap",
});

const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-schibsted",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ligero Parfum",
  description: "Seven perfumes, all permanent.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${bodoni.variable} ${schibsted.variable}`}>
      <body className="font-body antialiased selection:bg-aube-accent selection:text-white">
        <CaseProvider>
          <IntroLoader />
          {children}
          <CaseDrawer />
        </CaseProvider>
      </body>
    </html>
  );
}

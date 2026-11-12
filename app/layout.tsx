import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Schibsted_Grotesk, Bodoni_Moda } from "next/font/google";
import "./globals.css";
import { CaseProvider } from "@/context/case-context";
import CaseDrawer from "@/components/case-drawer";
import SmoothScrollProvider from "@/components/smooth-scroll";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
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
  description: "Seven permanent extraits de parfum, crafted with natural botanical extracts.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3ede3" },
    { media: "(prefers-color-scheme: dark)", color: "#101418" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${bodoni.variable} ${schibsted.variable}`}>
      <body className="font-body antialiased selection:bg-aube-accent selection:text-aube-base">
        <SmoothScrollProvider>
          <CaseProvider>
            {children}
            <CaseDrawer />
          </CaseProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}

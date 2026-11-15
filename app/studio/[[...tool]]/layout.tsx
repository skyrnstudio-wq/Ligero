import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studio",
  alternates: {
    canonical: "/studio",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

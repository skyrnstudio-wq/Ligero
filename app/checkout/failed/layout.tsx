import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Failed",
  description: "Your Ligero Parfum payment could not be completed. Return to checkout to retry.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function CheckoutFailedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

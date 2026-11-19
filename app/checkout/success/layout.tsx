import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Your Ligero Parfum order has been confirmed and verified.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function CheckoutSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

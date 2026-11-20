import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import {
  buildBreadcrumbSchema,
  buildGraph,
  buildOrganizationSchema,
  buildWebPageSchema,
  safeJsonLd,
} from "@/lib/seo/schema";

const SHIPPING_DESC =
  "Complimentary domestic surface delivery in 3 to 7 working days across India and seven-day returns for unopened, factory-sealed Ligero Parfum bottles.";

export const metadata: Metadata = {
  title: "Shipping & Sealed Bottle Returns",
  description: SHIPPING_DESC,
  alternates: {
    canonical: "/legal/shipping-returns",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    title: "Shipping & Sealed Bottle Returns | Ligero Parfum",
    description: SHIPPING_DESC,
    url: "/legal/shipping-returns",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shipping & Sealed Bottle Returns | Ligero Parfum",
    description: SHIPPING_DESC,
  },
};

export default function ShippingReturnsPage() {
  const jsonLd = buildGraph([
    buildOrganizationSchema(),
    buildWebPageSchema({
      path: "/legal/shipping-returns",
      name: "Shipping and Returns | Ligero Parfum",
      description: SHIPPING_DESC,
    }),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Legal Policies", path: "/legal" },
      { name: "Shipping and Returns", path: "/legal/shipping-returns" },
    ]),
  ]);

  return (
    <div className="min-h-screen bg-aube-base text-aube-text">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-6 pb-28 pt-[calc(var(--header-offset)+2rem)] sm:px-10 sm:pt-[calc(var(--header-offset)+3rem)]">
        <Link
          href="/legal"
          className="inline-flex min-h-11 items-center text-xs uppercase tracking-[0.2em] text-aube-text-muted transition-colors hover:text-aube-accent"
        >
          ← Legal Policies
        </Link>

        <h1 className="mt-8 font-display text-5xl font-light italic tracking-[-0.01em] text-aube-text sm:text-6xl">
          Shipping and Returns
        </h1>
        <p className="mt-4 text-sm text-aube-text-muted">
          The short version, as the law requires us to publish it.
        </p>

        <div className="mt-12 flex flex-col gap-12 text-base leading-relaxed text-aube-text/90">
          <section>
            <h2 className="font-display text-2xl font-light italic text-aube-text sm:text-3xl">
              1. Shipping
            </h2>
            <ul className="mt-4 flex flex-col gap-3 pl-4 list-disc marker:text-aube-accent">
              <li>We ship to all serviceable postal codes.</li>
              <li>Orders dispatch within two working days of placement.</li>
              <li>Delivery takes three to seven working days depending on distance and regional logistics.</li>
              <li>Free standard domestic shipping on every case order.</li>
              <li>Every parcel is fully tracked. The tracking link arrives by email the moment your order leaves our atelier.</li>
              <li>Alcohol-based fine fragrance cannot travel by air. Parcels travel by dedicated surface transport. Slow is safe.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light italic text-aube-text sm:text-3xl">
              2. Before you order
            </h2>
            <p className="mt-4">
              Please provide a delivery address where someone is available to receive parcels during daytime hours. Couriers make three attempts before returning the shipment to us.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light italic text-aube-text sm:text-3xl">
              3. Returns
            </h2>
            <ul className="mt-4 flex flex-col gap-3 pl-4 list-disc marker:text-aube-accent">
              <li>
                <strong>Unopened, sealed bottles:</strong> Returned within seven days of receipt, eligible for refund minus two-way courier freight.
              </li>
              <li>
                <strong>Opened bottles:</strong> Not returnable. Break the seal only when the nose has decided.
              </li>
              <li>
                <strong>Damaged in transit:</strong> Photograph the outer packaging and bottle within 48 hours of delivery and email sales@ligeroparfum.com. We replace or refund immediately, freight covered by us.
              </li>
              <li>
                <strong>Refund processing:</strong> Credited to your original payment method within seven working days of the inspected return reaching us.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light italic text-aube-text sm:text-3xl">
              4. The alternative
            </h2>
            <p className="mt-4">
              Unsure between two bottles? Write to the Concierge at{" "}
              <a href="mailto:sales@ligeroparfum.com" className="text-aube-accent underline">
                sales@ligeroparfum.com
              </a>
              . Describe what you wear now and when you wear it. A person answers within a day with an honest recommendation, including the advice to sample first with the Discovery Set.
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export const metadata = {
  title: "Shipping and Returns — Ligero Parfum",
  description: "Guidelines on domestic surface delivery, transit timelines, and sealed bottle returns.",
};

export default function ShippingReturnsPage() {
  return (
    <div className="min-h-screen bg-aube-base text-aube-text">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-6 pb-28 pt-36 sm:px-10 sm:pt-44">
        <Link
          href="/legal"
          className="text-xs uppercase tracking-[0.2em] text-aube-text-muted transition-colors hover:text-aube-accent"
        >
          ← Legal Policies
        </Link>

        <p className="mt-8 text-xs font-medium uppercase tracking-[0.24em] text-aube-text-muted">
          Logistics & Policy
        </p>
        <h1 className="mt-3 font-display text-5xl font-light italic tracking-[-0.01em] text-aube-text sm:text-6xl">
          Shipping and Returns
        </h1>
        <p className="mt-4 text-sm text-aube-text-muted">
          The short version, as the law requires us to publish it.
        </p>

        <div className="mt-12 flex flex-col gap-12 text-base leading-relaxed text-aube-text/90">
          <section>
            <h2 className="font-display text-2xl font-light italic text-aube-text sm:text-3xl">
              1. Shipping across India
            </h2>
            <ul className="mt-4 flex flex-col gap-3 pl-4 list-disc marker:text-aube-accent">
              <li>We ship to all serviceable postal codes across India.</li>
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
                <strong>Damaged in transit:</strong> Photograph the outer packaging and bottle within 48 hours of delivery and email concierge@ligeroparfums.com. We replace or refund immediately, freight covered by us.
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
              <a href="mailto:concierge@ligeroparfums.com" className="text-aube-accent underline">
                concierge@ligeroparfums.com
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

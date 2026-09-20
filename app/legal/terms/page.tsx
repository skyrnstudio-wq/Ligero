import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export const metadata = {
  title: "Terms of Sale and Use — Ligero Parfum",
  description: "Terms governing orders and website usage for Ligero Parfum.",
};

export default function TermsPage() {
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
          Terms & Conditions
        </p>
        <h1 className="mt-3 font-display text-5xl font-light italic tracking-[-0.01em] text-aube-text sm:text-6xl">
          Terms of Sale and Use
        </h1>
        <p className="mt-4 text-sm text-aube-text-muted">
          Ligero Parfum. Effective date: September 2026.
        </p>

        <p className="mt-8 text-lg font-normal leading-relaxed text-aube-text">
          These terms govern orders through this website and use of it. Plain language, complete sentences, no tricks. Ordering means you accept them.
        </p>

        <div className="mt-12 flex flex-col gap-12 text-base leading-relaxed text-aube-text/90">
          <section>
            <h2 className="font-display text-2xl font-light italic text-aube-text sm:text-3xl">
              1. Who we are
            </h2>
            <p className="mt-4">
              Ligero Parfum, a niche fragrance house registered in India. Registered office in Mumbai, Maharashtra. Contact: concierge@ligeroparfums.com. Instagram: @ligeroparfums.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light italic text-aube-text sm:text-3xl">
              2. The house collection
            </h2>
            <p className="mt-4">
              The house presents seven permanent perfumes: Aube, Noctis, Marée, Ambre Doux, Blanc, Fleur, and Noir Cacao. Objects include the Discovery Set and En Route car diffuser. Formulations may be refined within the bounds of international safety and IFRA standards. The character, provenance, and flacons do not change.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light italic text-aube-text sm:text-3xl">
              3. Orders and acceptance
            </h2>
            <p className="mt-4">
              An order is an offer to buy. The sale contract exists once dispatch is confirmed and tracking is issued, not before. We may decline an order in cases of address unavailability or suspected fraud, with immediate full refund.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light italic text-aube-text sm:text-3xl">
              4. Prices and payment
            </h2>
            <ul className="mt-4 flex flex-col gap-2 pl-4 list-disc marker:text-aube-accent">
              <li>Prices are in Indian Rupees, inclusive of GST and all applicable taxes.</li>
              <li>Prepaid online orders only. We do not offer cash on delivery.</li>
              <li>In the event of an obvious pricing error, we will state the fact plainly, decline the order, and refund in full.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light italic text-aube-text sm:text-3xl">
              5. Delivery across India
            </h2>
            <p className="mt-4">
              Parcels dispatch within two working days of order confirmation. Delivery occurs in three to seven working days depending on pincode. Because alcohol-based fine fragrances cannot be transported by passenger aircraft, parcels travel via dedicated surface logistics.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light italic text-aube-text sm:text-3xl">
              6. Returns and sealed condition
            </h2>
            <p className="mt-4">
              Unopened, sealed bottles returned within seven days of delivery receive a full refund minus two-way freight. Because perfume is a hygienic cosmetic formulation that degrades once exposed to air and light, opened bottles cannot be returned. The nose must decide before the seal breaks: that is what the Discovery Set is for.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light italic text-aube-text sm:text-3xl">
              7. Guest checkout
            </h2>
            <p className="mt-4">
              There are no customer accounts or passwords on this site. Orders are placed as a guest. Fewer databases mean fewer security risks.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light italic text-aube-text sm:text-3xl">
              8. Governing law
            </h2>
            <p className="mt-4">
              These terms are governed by Indian law. Any disputes that cannot be settled amicably fall under the exclusive jurisdiction of the competent courts of India.
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

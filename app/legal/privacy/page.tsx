import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export const metadata = {
  title: "Privacy Policy — Ligero Parfum",
  description: "Privacy policy under the Digital Personal Data Protection Act, 2023.",
};

export default function PrivacyPolicyPage() {
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
          DPDP Act, 2023 Compliance
        </p>
        <h1 className="mt-3 font-display text-5xl font-light italic tracking-[-0.01em] text-aube-text sm:text-6xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-aube-text-muted">
          Ligero Parfum. Effective date: September 2026.
        </p>

        <p className="mt-8 text-lg font-normal leading-relaxed text-aube-text">
          This policy explains what we collect, why, and what you can do about it. It is written to be read.
        </p>

        <div className="mt-12 flex flex-col gap-12 text-base leading-relaxed text-aube-text/90">
          <section>
            <h2 className="font-display text-2xl font-light italic text-aube-text sm:text-3xl">
              1. What we collect
            </h2>
            <ul className="mt-4 flex flex-col gap-3 pl-4 list-disc marker:text-aube-accent">
              <li>
                <strong>What you give us:</strong> Name, email, phone, and delivery address when you order or write to the Concierge. Message contents when you write to us.
              </li>
              <li>
                <strong>What your visit generates:</strong> Order and payment records, correspondence history, and standard server records of the pages served. No advertising profiles. No cross-site tracking. We do not run third-party analytics that identifies you.
              </li>
              <li>
                <strong>What we never collect:</strong> Sensitive personal data under the DPDP Act. Do not send health or confidential financial details by email.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light italic text-aube-text sm:text-3xl">
              2. Why we collect it
            </h2>
            <ul className="mt-4 flex flex-col gap-3 pl-4 list-disc marker:text-aube-accent">
              <li>
                <strong>To fulfill your orders:</strong> Invoices, secure payment verification, and tracked domestic delivery.
              </li>
              <li>
                <strong>To answer you:</strong> Concierge correspondence, private appointments, and custom requests.
              </li>
              <li>
                <strong>With your consent:</strong> The Correspondence, our newsletter. Four letters a year. Nothing else. Consent is a specific opt-in, not a pre-ticked box. Withdrawing consent takes one click or one direct reply.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light italic text-aube-text sm:text-3xl">
              3. Legal basis (DPDP Act, 2023)
            </h2>
            <p className="mt-4">
              We process personal data on two grounds only: your explicit consent, and a legitimate use permitted by the Act Section 7 (delivery of goods, provision of service, processing payment). Nothing else. We are data fiduciary for data we collect directly. When you pay through a payment gateway, the gateway acts as its own data fiduciary for data provided to it.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light italic text-aube-text sm:text-3xl">
              4. What we do not do
            </h2>
            <ul className="mt-4 flex flex-col gap-2 pl-4 list-disc marker:text-aube-accent">
              <li>No sale or rental of personal data. Ever.</li>
              <li>No advertising pixels, no behavioral retargeting, no data broker enrichment.</li>
              <li>No automated algorithmic decisions about you, no profiling.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light italic text-aube-text sm:text-3xl">
              5. Who processes data with us
            </h2>
            <ul className="mt-4 flex flex-col gap-2 pl-4 list-disc marker:text-aube-accent">
              <li>Our payment gateway (processing charges and refunds).</li>
              <li>Our courier partner (delivery, where the address is required).</li>
              <li>Our email service (order confirmations and the Correspondence).</li>
            </ul>
            <p className="mt-3 text-sm text-aube-text-muted">
              Each entity processes only what the specific task requires. We do not sell data onward.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light italic text-aube-text sm:text-3xl">
              6. Data retention
            </h2>
            <ul className="mt-4 flex flex-col gap-2 pl-4 list-disc marker:text-aube-accent">
              <li>Invoices and order records: Eight years, as Indian tax law requires.</li>
              <li>Correspondence: Up to three years after the last exchange.</li>
              <li>The Correspondence list: Until you unsubscribe, deleted within thirty days.</li>
              <li>Everything else: Deleted or anonymized when the purpose concludes.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light italic text-aube-text sm:text-3xl">
              7. Your rights
            </h2>
            <p className="mt-4">
              Under Sections 11 and 13 of the DPDP Act, you may request a summary of the data we hold, ask for corrections, or request erasure (unless retaining the record is required by tax law). You may withdraw consent at any time.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light italic text-aube-text sm:text-3xl">
              8. Grievance Officer
            </h2>
            <div className="mt-4 border border-aube-hairline bg-aube-surface p-6 sm:p-8">
              <p className="font-display text-xl font-normal text-aube-text">
                Grievance Officer, Ligero Parfum
              </p>
              <p className="mt-2 text-sm text-aube-text-muted">
                Email: grievance@ligeroparfums.com
              </p>
              <p className="text-sm text-aube-text-muted">
                Hours: Monday to Friday, 10:00 to 18:00 IST
              </p>
              <p className="mt-3 text-xs uppercase tracking-[0.16em] text-aube-accent">
                Acknowledged within 72 hours. Resolved within 30 days.
              </p>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

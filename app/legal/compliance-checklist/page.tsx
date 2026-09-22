import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export const metadata = {
  title: "Statutory Disclosures & Grievance Redressal — Ligero Parfum",
  description: "Statutory disclosures under the DPDP Act 2023 and Consumer Protection E-commerce Rules 2020.",
};

export default function ComplianceGrievancePage() {
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
          Statutory Disclosures
        </p>
        <h1 className="mt-3 font-display text-5xl font-light italic tracking-[-0.01em] text-aube-text sm:text-6xl">
          Grievance Officer & Compliance
        </h1>
        <p className="mt-4 text-sm text-aube-text-muted">
          Mandatory statutory declarations under Indian law.
        </p>

        <div className="mt-12 flex flex-col gap-12 text-base leading-relaxed text-aube-text/90">
          {/* Grievance Officer Details */}
          <section>
            <h2 className="font-display text-2xl font-light italic text-aube-text sm:text-3xl">
              1. Grievance Redressal Mechanism
            </h2>
            <p className="mt-4">
              As required under the Digital Personal Data Protection Act, 2023 and the Consumer Protection (E-commerce) Rules, 2020, we designate a dedicated Grievance Officer:
            </p>

            <div className="mt-6 border border-aube-hairline bg-aube-surface p-6 sm:p-8">
              <p className="font-display text-xl font-normal text-aube-text">
                Grievance Officer
              </p>
              <p className="mt-2 text-sm text-aube-text">
                Ligero Parfum Private Limited
              </p>
              <p className="mt-1 text-sm text-aube-text-muted">
                Email:{" "}
                <a href="mailto:grievance@ligeroparfums.com" className="text-aube-accent underline">
                  grievance@ligeroparfums.com
                </a>
              </p>
              <p className="text-sm text-aube-text-muted">
                Operating Hours: Monday to Friday, 10:00 to 18:00 IST
              </p>
              <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-aube-accent">
                Timelines: Acknowledged within 72 hours. Resolved within 30 days.
              </p>
            </div>
          </section>

          {/* Legal Metrology */}
          <section>
            <h2 className="font-display text-2xl font-light italic text-aube-text sm:text-3xl">
              2. Legal Metrology Declarations
            </h2>
            <p className="mt-4">
              In accordance with the Legal Metrology (Packaged Commodities) Rules, 2011, every perfume bottle sold by Ligero Parfum displays:
            </p>
            <ul className="mt-4 flex flex-col gap-2 pl-4 list-disc marker:text-aube-accent text-sm">
              <li>Name of the commodity: Eau de Parfum / Extrait de Parfum.</li>
              <li>Net quantity: 50 ml per flacon (10 ml per vial for the Discovery Set).</li>
              <li>Maximum Retail Price (MRP): Inclusive of all taxes, clearly stated on each product page and carton.</li>
              <li>Country of origin: Made in India with single-origin Indian estates and imported botanicals.</li>
              <li>Consumer care details: concierge@ligeroparfums.com.</li>
            </ul>
          </section>

          {/* Privacy & E-Commerce Compliance */}
          <section>
            <h2 className="font-display text-2xl font-light italic text-aube-text sm:text-3xl">
              3. Data Protection & Consumer Safeguards
            </h2>
            <p className="mt-4">
              We process data strictly on legitimate purpose grounds (fulfillment and direct correspondence). We run no advertising tracking cookies, no cross-site pixels, and no automated profiling algorithms. Any dispute that cannot be resolved through our Grievance Officer may be escalated to the Data Protection Board of India or the National Consumer Helpline.
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

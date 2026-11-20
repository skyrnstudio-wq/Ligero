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

const COMPLIANCE_DESC =
  "Statutory Legal Metrology declarations, DPDP Act 2023 data safeguards, and Consumer Protection E-Commerce Rules disclosures for Ligero Parfum.";

export const metadata: Metadata = {
  title: "Statutory Disclosures & Legal Metrology",
  description: COMPLIANCE_DESC,
  alternates: {
    canonical: "/legal/compliance-checklist",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    title: "Statutory Disclosures & Compliance | Ligero Parfum",
    description: COMPLIANCE_DESC,
    url: "/legal/compliance-checklist",
  },
  twitter: {
    card: "summary_large_image",
    title: "Statutory Disclosures & Compliance | Ligero Parfum",
    description: COMPLIANCE_DESC,
  },
};

export default function CompliancePage() {
  const jsonLd = buildGraph([
    buildOrganizationSchema(),
    buildWebPageSchema({
      path: "/legal/compliance-checklist",
      name: "Statutory Disclosures & Compliance | Ligero Parfum",
      description: COMPLIANCE_DESC,
    }),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Legal Policies", path: "/legal" },
      { name: "Statutory Disclosures", path: "/legal/compliance-checklist" },
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
          Statutory Disclosures & Compliance
        </h1>
        <p className="mt-4 text-sm text-aube-text-muted">
          Mandatory statutory declarations.
        </p>

        <div className="mt-12 flex flex-col gap-12 text-base leading-relaxed text-aube-text/90">
          {/* Legal Metrology */}
          <section>
            <h2 className="font-display text-2xl font-light italic text-aube-text sm:text-3xl">
              1. Legal Metrology Declarations
            </h2>
            <p className="mt-4">
              In accordance with the Legal Metrology (Packaged Commodities) Rules, 2011, every perfume bottle sold by Ligero Parfum displays:
            </p>
            <ul className="mt-4 flex flex-col gap-2 pl-4 list-disc marker:text-aube-accent text-sm">
              <li>Name of the commodity: Eau de Parfum.</li>
              <li>Net quantity: 50 ml per flacon (10 ml per vial for the Discovery Set).</li>
              <li>Maximum Retail Price (MRP): Inclusive of all taxes, clearly stated on each product page and carton.</li>
              <li>Country of origin: Declared on product carton in compliance with statutory rules.</li>
              <li>Consumer care details: sales@ligeroparfum.com.</li>
            </ul>
          </section>

          {/* Privacy & E-Commerce Compliance */}
          <section>
            <h2 className="font-display text-2xl font-light italic text-aube-text sm:text-3xl">
              2. Data Protection & Consumer Safeguards
            </h2>
            <p className="mt-4">
              We process data strictly on legitimate purpose grounds (fulfillment and direct correspondence). We run no advertising tracking cookies, no cross-site pixels, and no automated profiling algorithms. Any questions or concerns regarding your personal data or orders may be directed to sales@ligeroparfum.com, or escalated to the Data Protection Board or the National Consumer Helpline.
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

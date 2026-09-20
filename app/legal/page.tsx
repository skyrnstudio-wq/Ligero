import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export const metadata = {
  title: "Legal & House Policies — Ligero Parfum",
  description: "Statutory disclosures, terms of sale, privacy policy, and shipping guidelines.",
};

const POLICIES = [
  {
    title: "Privacy Policy",
    href: "/legal/privacy",
    desc: "How we collect, protect, and handle your data under the DPDP Act 2023. No advertising trackers, no sale of data.",
  },
  {
    title: "Terms of Sale and Use",
    href: "/legal/terms",
    desc: "Order terms, guest checkout, formulation standards, and intellectual property.",
  },
  {
    title: "Shipping and Returns",
    href: "/legal/shipping-returns",
    desc: "Domestic surface courier logistics, delivery timelines, and return conditions for sealed bottles.",
  },
  {
    title: "Grievance Redressal & Statutory Disclosures",
    href: "/legal/compliance-checklist",
    desc: "Grievance Officer contact details, statutory compliance, and Consumer Protection disclosures.",
  },
];

export default function LegalIndexPage() {
  return (
    <div className="min-h-screen bg-aube-base text-aube-text">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-6 pb-28 pt-36 sm:px-10 sm:pt-44">
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-aube-text-muted">
          Statutory Disclosures
        </p>
        <h1 className="mt-4 font-display text-5xl font-light italic tracking-[-0.01em] text-aube-text sm:text-6xl lg:text-7xl">
          Legal Policies
        </h1>
        <p className="mt-4 text-base text-aube-text-muted sm:text-lg">
          Plain language, complete sentences, no tricks. All policies are written to be read.
        </p>

        <div className="mt-16 divide-y divide-aube-hairline border-y border-aube-hairline">
          {POLICIES.map((policy) => (
            <Link
              key={policy.href}
              href={policy.href}
              className="group flex flex-col justify-between gap-4 py-8 transition-colors hover:bg-aube-surface/50 sm:flex-row sm:items-baseline sm:px-4"
            >
              <div className="max-w-xl">
                <h2 className="font-display text-2xl font-light italic text-aube-text transition-colors group-hover:text-aube-accent sm:text-3xl">
                  {policy.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-aube-text-muted">
                  {policy.desc}
                </p>
              </div>
              <span className="text-xs uppercase tracking-[0.2em] text-aube-accent transition-transform group-hover:translate-x-1">
                Read Policy →
              </span>
            </Link>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

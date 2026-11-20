import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import PrivateSalon from "@/components/private-salon";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildGraph,
  buildOrganizationSchema,
  buildWebPageSchema,
  safeJsonLd,
} from "@/lib/seo/schema";

const HELP_DESCRIPTION =
  "Answers on domestic surface shipping, seven-day sealed bottle returns, batch authenticity, parfum application, storage, and accepted payment methods.";

export const metadata: Metadata = {
  title: "Help, Shipping & Return Policies",
  description: HELP_DESCRIPTION,
  alternates: {
    canonical: "/help",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    title: "Help, Shipping & Return Policies | Ligero Parfum",
    description: HELP_DESCRIPTION,
    url: "/help",
  },
  twitter: {
    card: "summary_large_image",
    title: "Help, Shipping & Return Policies | Ligero Parfum",
    description: HELP_DESCRIPTION,
  },
};

const GROUPS = [
  {
    title: "Shipping",
    items: [
      {
        q: "Where do you ship?",
        a: "We ship to all serviceable postal codes.",
      },
      {
        q: "How long does delivery take?",
        a: "Orders leave the studio within two working days. Delivery takes three to seven working days depending on your postal code. Alcohol-based fragrance travels by surface freight, never by air.",
      },
      {
        q: "How is my parcel tracked?",
        a: "Every parcel is tracked. The tracking link arrives by email the moment the parcel leaves the studio.",
      },
    ],
  },
  {
    title: "Returns (opened and sealed)",
    items: [
      {
        q: "Can I return an unopened bottle?",
        a: "Unopened, factory-sealed bottles may be returned within seven days of delivery. Refunds reach the original payment method within seven working days of the return arriving.",
      },
      {
        q: "Can I return an opened bottle?",
        a: "Opened bottles are not returnable. Break the seal only when the nose has decided. If you have not worn the perfume before, start with the Discovery Set.",
      },
      {
        q: "What if a bottle arrives damaged?",
        a: "Photograph the outer carton and the bottle within forty-eight hours of delivery and write to sales@ligeroparfum.com. We replace or refund at our cost.",
      },
    ],
  },
  {
    title: "Authenticity",
    items: [
      {
        q: "Where are genuine Ligero perfumes sold?",
        a: "Directly through this website and private appointments arranged with the maison. We never discount, never issue coupon codes, and never sell through unverified third-party marketplaces.",
      },
      {
        q: "Why does the colour of a perfume vary slightly between batches?",
        a: "We formulate exclusively with pure botanical extracts and absolutes, adding zero artificial dyes or stabilisers. Natural extracts vary subtly across batches just as seasonal vintages do.",
      },
    ],
  },
  {
    title: "How to wear and store",
    items: [
      {
        q: "How should I apply an eau de parfum?",
        a: "Two sprays on warm skin: wrists, throat, or coat collar. Let the mist settle on its own. Do not rub your wrists together.",
      },
      {
        q: "How should I store the bottle?",
        a: "Keep the bottle in its box or in a cool, dark drawer away from direct sunlight and bathroom steam.",
      },
    ],
  },
  {
    title: "Payments",
    items: [
      {
        q: "Which payment methods are accepted?",
        a: "UPI, major credit and debit cards, and netbanking. All prices shown on the site include GST.",
      },
    ],
  },
];

const FAQ_ENTRIES = GROUPS.flatMap((group) =>
  group.items.map((item) => ({
    question: item.q,
    answer: item.a,
  }))
);

/**
 * Help page (site-blueprint.md §11b).
 * Type-only hero: "Help." One word. Accordions start directly below.
 * Grouped accordions written in the house voice: Shipping, Returns, Authenticity, How to wear and store, Payments.
 */
export default function HelpPage() {
  const jsonLd = buildGraph([
    buildOrganizationSchema(),
    buildWebPageSchema({
      path: "/help",
      name: "Help, Shipping & Return Policies | Ligero Parfum",
      description: HELP_DESCRIPTION,
    }),
    buildFaqSchema(FAQ_ENTRIES),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Help", path: "/help" },
    ]),
  ]);

  return (
    <div className="min-h-screen bg-aube-base text-aube-text">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <SiteHeader />

      <main className="pt-[var(--header-offset)]">
        <div className="mx-auto max-w-3xl px-6 pb-24 pt-12 sm:px-10 sm:pt-16">
          <h1 className="font-display text-6xl font-light italic tracking-[-0.02em] text-aube-text sm:text-7xl lg:text-[6.5rem]">
            Help.
          </h1>

          <div className="mt-14 flex flex-col gap-14">
            {GROUPS.map((group) => (
              <section key={group.title} aria-label={group.title}>
                <h2 className="font-display text-3xl font-light italic text-aube-text sm:text-4xl">
                  {group.title}
                </h2>
                <div className="mt-4 divide-y divide-aube-hairline border-t border-b border-aube-hairline">
                  {group.items.map((item) => (
                    <details key={item.q} className="group py-5">
                      <summary className="flex cursor-pointer list-none items-baseline justify-between gap-4 font-display text-xl font-normal text-aube-text sm:text-2xl">
                        <span>{item.q}</span>
                        <span
                          aria-hidden="true"
                          className="text-base text-aube-text-muted transition-transform duration-200 group-open:rotate-45"
                        >
                          +
                        </span>
                      </summary>
                      <p className="mt-3 max-w-[65ch] text-base leading-relaxed text-aube-text-muted">
                        {item.a}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-16 border-t border-aube-hairline pt-10">
            <p className="font-display text-2xl font-light italic text-aube-text">
              Need an answer a page cannot give?{" "}
              <a
                href="mailto:sales@ligeroparfum.com"
                className="text-aube-accent underline underline-offset-4"
              >
                sales@ligeroparfum.com
              </a>
            </p>
            <nav aria-label="Related house policies" className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-[0.18em] text-aube-text-muted">
              <Link href="/discovery-set" className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-aube-accent">
                The Discovery Set
              </Link>
              <Link href="/legal/shipping-returns" className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-aube-accent">
                Shipping &amp; Returns
              </Link>
              <Link href="/legal/privacy" className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-aube-accent">
                Privacy Policy
              </Link>
              <Link href="/legal" className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-aube-accent">
                All Legal Policies
              </Link>
            </nav>
          </div>
        </div>

        <PrivateSalon />
      </main>

      <SiteFooter />
    </div>
  );
}

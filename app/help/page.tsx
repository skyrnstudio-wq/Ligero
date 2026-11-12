import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import PrivateSalon from "@/components/private-salon";

export const metadata = {
  title: "Help | Ligero Parfum",
  description: "Shipping, returns, authenticity, how to wear and store, and payments.",
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
        a: "Photograph the outer carton and the bottle within forty-eight hours of delivery and write to sales@ligeroparfums.com. We replace or refund at our cost.",
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
        a: "We use single-origin botanicals and add zero artificial dyes or stabilisers. A harvest after heavy rain has a slightly different tint from a dry-season harvest, just as wine does.",
      },
    ],
  },
  {
    title: "How to wear and store",
    items: [
      {
        q: "How should I apply an extrait de parfum?",
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

/**
 * Help page (site-blueprint.md §11b).
 * Type-only hero: "Help." One word. Accordions start directly below.
 * Grouped accordions written in the house voice: Shipping, Returns, Authenticity, How to wear and store, Payments.
 */
export default function HelpPage() {
  return (
    <div className="min-h-screen bg-aube-base text-aube-text">
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
                href="mailto:sales@ligeroparfums.com"
                className="text-aube-accent underline underline-offset-4"
              >
                sales@ligeroparfums.com
              </a>
            </p>
          </div>
        </div>

        <PrivateSalon />
      </main>

      <SiteFooter />
    </div>
  );
}

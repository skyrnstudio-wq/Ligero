import { NextResponse } from "next/server";
import { getLiveObjects, getLivePerfumes } from "@/lib/sanity/data";
import { BASE_URL, CONTACT_EMAIL } from "@/lib/seo/schema";

export const revalidate = 3600;

function getLatestUpdatedDate(dates: Array<string | undefined>): Date {
  let latest = new Date("2026-11-16T00:00:00.000Z").getTime();
  for (const iso of dates) {
    if (!iso) continue;
    const ms = new Date(iso).getTime();
    if (Number.isFinite(ms) && ms > latest) latest = ms;
  }
  return new Date(latest);
}

export async function GET() {
  const [perfumes, objects] = await Promise.all([
    getLivePerfumes(),
    getLiveObjects(),
  ]);

  const lastUpdated = getLatestUpdatedDate([
    ...perfumes.map((p) => p.updatedAt),
    ...objects.map((o) => o.updatedAt),
  ]);

  const comparisonRows = perfumes
    .map(
      (p) =>
        `| ${p.name} | INR ${p.price} | ${p.scentProfile.family} | ${p.notesUppercase} | ${(p.occasions || []).slice(0, 4).join(", ")} |`
    )
    .join("\n");

  const perfumeSections = perfumes
    .map((p) => {
      const sp = p.scentProfile;
      const metaSpecs = [
        `URL: ${BASE_URL}/collection/${p.slug}`,
        `SKU: LP-${p.slug.toUpperCase()}`,
        `Price: INR ${p.price} (inclusive of GST)`,
        `Format: ${p.volume}`,
        `Olfactive Family: ${sp.family}`,
        sp.concentration ? `Concentration: ${sp.concentration}` : null,
        sp.longevity ? `Longevity: ${sp.longevity}` : null,
        sp.sillage ? `Sillage: ${sp.sillage}` : null,
        sp.maceration ? `Maceration: ${sp.maceration}` : null,
        p.occasions && p.occasions.length > 0
          ? `Wear Occasions: ${p.occasions.join(", ")}`
          : null,
      ]
        .filter(Boolean)
        .map((line) => `- ${line}`)
        .join("\n");

      const ingredients =
        p.keyIngredients && p.keyIngredients.length > 0
          ? p.keyIngredients
              .map((ing) => `  - ${ing.name} (${ing.note}): ${ing.description}`)
              .join("\n")
          : "";

      return `### ${p.name}
${p.subtitle}

${p.oneLiner}

${metaSpecs}
- Top Notes: ${sp.top}
- Heart Notes: ${sp.heart}
- Base Notes: ${sp.base}
- Key Botanicals & Raw Materials:
${ingredients}
- Application Ritual: ${p.ritual}
- Vessel & Packaging: ${p.material}
- Provenance: ${p.provenance}
- Layering Companions: ${p.relatedSlugs.join(", ")}`;
    })
    .join("\n\n");

  const objectSections = objects
    .map((o) => {
      const href =
        o.slug === "discovery-set"
          ? `${BASE_URL}/discovery-set`
          : o.slug === "en-route"
            ? `${BASE_URL}/objects/en-route`
            : `${BASE_URL}/objects#${o.slug}`;

      return `### ${o.name}
- URL: ${href}
- SKU: LP-${o.slug.toUpperCase()}
- Price: INR ${o.price} (inclusive of GST)
${o.volume ? `- Volume / Format: ${o.volume}\n` : ""}- Summary: ${o.description}
- Specifications: ${o.spec}`;
    })
    .join("\n\n");

  const body = `# Ligero Parfum: Complete House Reference

Last updated: ${lastUpdated.toISOString().slice(0, 10)}

## About the House

Ligero Parfum is an independent Indian perfume house based in Mumbai, Maharashtra (Ligero Parfum Private Limited). The house maintains a permanent collection of seven Eau de Parfum creations in 50 ml flacons alongside two scented objects: The Discovery Set (seven 10 ml vials) and En Route (car cabin diffuser).

Formulations use food-grade grain alcohol, cold-pressed essential oils, botanical absolutes, and aged resins without artificial dyes, synthetic preservatives, or phthalate fixatives. Every batch is handcrafted in small lots. Ligero Parfum sells directly through ${BASE_URL} without third-party discounting or seasonal coupon codes.

- Legal Entity: Ligero Parfum Private Limited
- Location: Mumbai, Maharashtra, India
- Contact: ${CONTACT_EMAIL}
- Website: ${BASE_URL}
- Instagram: https://www.instagram.com/ligeroparfums

## Quick Comparison Matrix (50 ml Eau de Parfum)

| Perfume | Price | Olfactive Family | Signature Notes | Key Occasions |
| :--- | :--- | :--- | :--- | :--- |
${comparisonRows}

## Permanent Eau de Parfum Collection

${perfumeSections}

## Objects of Scent

${objectSections}

## Shipping, Returns & Wear Policies

- Delivery Coverage: All serviceable Indian postal codes.
- Dispatch Time: Within 1 to 2 working days from the Mumbai studio.
- Transit Time: 3 to 7 working days via domestic surface freight (alcohol-based fragrance ships strictly by ground transport, never by air).
- Shipping Fee: Free across India on every order.
- Return Policy: Unopened, factory-sealed bottles may be returned within 7 days of delivery. Refunds issue to the original payment method within 7 working days of receipt. Opened bottles cannot be returned.
- Damaged in Transit: Send photographs of the outer carton and bottle to ${CONTACT_EMAIL} within 48 hours of delivery for complimentary replacement or refund.
- Payment Methods: Prepaid via UPI, major credit and debit cards, and netbanking through Razorpay. No cash on delivery.
- Guest Checkout & Privacy: No customer accounts, no advertising trackers, no cross-site cookies, compliant with India's DPDP Act 2023.
- Storage & Application: Apply two sprays to warm pulse points (wrists, throat, collar) and allow the parfum to settle without rubbing. Store closed away from direct light and humidity.

## Frequently Asked Questions

- Q: Can I sample Ligero perfumes before ordering a 50 ml bottle?
  A: Yes. The Discovery Set (${BASE_URL}/discovery-set) includes 10 ml atomizers of all seven permanent perfumes for INR 999 with free domestic shipping across India.
- Q: Are all Ligero perfumes unisex?
  A: Yes. Every Eau de Parfum in the collection is formulated for any wearer based on skin chemistry, weather, and occasion rather than gender labels.
- Q: Why does perfume ship by surface freight instead of air?
  A: Alcohol-based fine fragrance is classified as flammable cargo and travels exclusively by dedicated domestic surface logistics for safety compliance.
- Q: Why can liquid tint vary slightly between batches?
  A: Formulations contain zero artificial dyes or colour stabilisers, so natural botanical extracts show subtle seasonal variation across batches.
`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Last-Modified": lastUpdated.toUTCString(),
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

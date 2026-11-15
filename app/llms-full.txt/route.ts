import { NextResponse } from "next/server";
import { getLiveObjects, getLivePerfumes } from "@/lib/sanity/data";

export const revalidate = 3600;

const BASE_URL = "https://ligeroparfums.com";

export async function GET() {
  const [perfumes, objects] = await Promise.all([
    getLivePerfumes(),
    getLiveObjects(),
  ]);

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
- Price: INR ${o.price} (inclusive of GST)
${o.volume ? `- Volume / Format: ${o.volume}\n` : ""}- Summary: ${o.description}
- Specifications: ${o.spec}`;
    })
    .join("\n\n");

  const body = `# Ligero Parfum: Complete House Reference

## About the House

Ligero Parfum is an independent Indian perfume house based in Mumbai, Maharashtra (Ligero Parfum Private Limited). The house maintains a permanent collection of seven Eau de Parfum creations in 50 ml flacons alongside two scented objects: The Discovery Set (seven 10 ml vials) and En Route (car cabin diffuser).

Formulations use food-grade grain alcohol, cold-pressed essential oils, botanical absolutes, and aged resins without artificial dyes or colour stabilisers. Every batch undergoes cold maceration prior to manual small-batch filling. Ligero Parfum sells directly through https://ligeroparfums.com without third-party discounting or seasonal coupon codes.

Contact: sales@ligeroparfums.com
Website: ${BASE_URL}

## Permanent Eau de Parfum Collection

${perfumeSections}

## Objects of Scent

${objectSections}

## Shipping, Returns & Wear Policies

- Delivery Coverage: All serviceable Indian postal codes.
- Dispatch Time: Within 1 to 2 working days from the studio.
- Transit Time: 3 to 7 working days via domestic surface freight (alcohol-based fragrance ships strictly by ground transport, never by air).
- Shipping Fee: Complimentary across India.
- Return Policy: Unopened, factory-sealed bottles may be returned within 7 days of delivery. Refunds issue to the original payment method within 7 working days of receipt. Opened bottles cannot be returned.
- Damaged in Transit: Send photographs of the outer carton and bottle to sales@ligeroparfums.com within 48 hours of delivery for complimentary replacement or refund.
- Payment Methods: UPI, major credit and debit cards, and netbanking.
- Storage & Application: Apply two sprays to warm pulse points (wrists, throat, collar) and allow the extrait to settle without rubbing. Store closed away from direct light and humidity.
`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

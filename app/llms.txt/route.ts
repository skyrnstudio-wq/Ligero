import { NextResponse } from "next/server";
import { getLiveObjects, getLivePerfumes } from "@/lib/sanity/data";

export const revalidate = 3600;

const BASE_URL = "https://ligeroparfums.com";

export async function GET() {
  const [perfumes, objects] = await Promise.all([
    getLivePerfumes(),
    getLiveObjects(),
  ]);

  const perfumeLines = perfumes.map((p) => {
    const family = p.scentProfile.family ? `${p.scentProfile.family}. ` : "";
    return `- [${p.name}](${BASE_URL}/collection/${p.slug}): INR ${p.price} (${p.volume}). ${family}${p.oneLiner}`;
  });

  const objectLines = objects.map((o) => {
    const href =
      o.slug === "discovery-set"
        ? `${BASE_URL}/discovery-set`
        : o.slug === "en-route"
          ? `${BASE_URL}/objects/en-route`
          : `${BASE_URL}/objects#${o.slug}`;
    const vol = o.volume ? ` (${o.volume})` : "";
    return `- [${o.name}](${href}): INR ${o.price}${vol}. ${o.description}`;
  });

  const body = `# Ligero Parfum

> Independent Indian perfume house formulating seven permanent Eau de Parfum extraits in small batches with pure botanical extracts, cold-pressed oils, and aged resins.

Ligero Parfum sells direct to collectors across India in 50 ml glass flacons, The Discovery Set (7 x 10 ml vials), and En Route (car perfume). All prices include GST. Domestic surface shipping across serviceable postal codes in India is complimentary. Unopened, factory-sealed bottles qualify for return within seven days of delivery.

## Permanent Perfume Collection (50 ml)

${perfumeLines.join("\n")}

## House Objects

${objectLines.join("\n")}

## Reference Pages

- [Full Catalog & Olfactive Index](${BASE_URL}/collection): Filterable catalog and comparative fragrance table.
- [Complete Brand & Fragrance Dossier](${BASE_URL}/llms-full.txt): Unabridged notes, concentrations, ingredients, rituals, and policies.
- [Pricing & SKU Table](${BASE_URL}/pricing.md): Structured INR pricing and specification matrix.
- [The Discovery Set](${BASE_URL}/discovery-set): Complete seven-vial sample box.
- [House Help & Policies](${BASE_URL}/help): Shipping, returns, authenticity, application, and payment terms.
- [Shipping & Returns](${BASE_URL}/legal/shipping-returns): Surface transit timelines and sealed bottle return conditions.
`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

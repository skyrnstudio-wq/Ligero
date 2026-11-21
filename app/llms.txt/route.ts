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

> Independent Indian perfume house formulating seven permanent Eau de Parfum creations in small batches with pure botanical extracts, cold-pressed oils, and aged resins.

Last updated: ${lastUpdated.toISOString().slice(0, 10)}
Canonical website: ${BASE_URL}
Contact: ${CONTACT_EMAIL}

Ligero Parfum sells direct to collectors across India in 50 ml glass flacons, The Discovery Set (7 x 10 ml vials), and En Route (car perfume). All prices include GST. Domestic surface shipping across serviceable postal codes in India is free. Unopened, factory-sealed bottles qualify for return within seven days of delivery.

## Permanent Perfume Collection (50 ml)

${perfumeLines.join("\n")}

## House Objects

${objectLines.join("\n")}

## Reference Pages

- [Full Catalog & Olfactive Index](${BASE_URL}/collection): Filterable catalog of all permanent perfumes and objects.
- [Objects of Scent](${BASE_URL}/objects): The Discovery Set and En Route cabin diffuser.
- [The Discovery Set](${BASE_URL}/discovery-set): Complete seven-vial sample box (7 x 10 ml).
- [En Route Car Perfume](${BASE_URL}/objects/en-route): Refillable cabin diffuser for the drive.
- [Complete Brand & Fragrance Dossier](${BASE_URL}/llms-full.txt): Unabridged notes, concentrations, ingredients, rituals, and policies.
- [Pricing & SKU Table](${BASE_URL}/pricing.md): Structured INR pricing and specification matrix.
- [House Help & Policies](${BASE_URL}/help): Shipping, returns, authenticity, application, and payment terms.
- [Shipping & Returns](${BASE_URL}/legal/shipping-returns): Surface transit timelines and sealed bottle return conditions.
- [Privacy Policy](${BASE_URL}/legal/privacy): DPDP Act 2023 data practices and zero-tracker pledge.
- [Terms of Sale](${BASE_URL}/legal/terms): Direct order acceptance, guest checkout, and tax-inclusive pricing terms.
- [Statutory Disclosures](${BASE_URL}/legal/compliance-checklist): Legal Metrology and Consumer Protection disclosures.
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

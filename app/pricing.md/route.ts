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

  const perfumeRows = perfumes
    .map(
      (p) =>
        `| [${p.name}](${BASE_URL}/collection/${p.slug}) | LP-${p.slug.toUpperCase()} | ${p.volume} | INR ${p.price} | ${p.scentProfile.family} | ${p.scentProfile.top}; ${p.scentProfile.heart}; ${p.scentProfile.base} | ${p.scentProfile.longevity || "12+ hours"} |`
    )
    .join("\n");

  const objectRows = objects
    .map((o) => {
      const href =
        o.slug === "discovery-set"
          ? `${BASE_URL}/discovery-set`
          : o.slug === "en-route"
            ? `${BASE_URL}/objects/en-route`
            : `${BASE_URL}/objects#${o.slug}`;
      return `| [${o.name}](${href}) | LP-${o.slug.toUpperCase()} | ${o.volume || "House Object"} | INR ${o.price} | ${o.description} |`;
    })
    .join("\n");

  const body = `# Ligero Parfum: Official Pricing & Catalog Specification

Last updated: ${lastUpdated.toISOString().slice(0, 10)}

All prices are listed in Indian Rupees (INR), inclusive of GST, with free domestic surface shipping across serviceable Indian postal codes. Ligero Parfum does not run seasonal sales or issue promo codes.

## Permanent Perfumes (50 ml Flacons)

| Perfume | SKU | Format | Price (INR) | Olfactive Family | Notes Architecture (Top / Heart / Base) | Longevity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
${perfumeRows}

## Objects of Scent

| Object | SKU | Format | Price (INR) | Description |
| :--- | :--- | :--- | :--- | :--- |
${objectRows}

## Commercial & Return Terms

- Currency: Indian Rupee (INR), inclusive of applicable GST.
- Direct Channel: [www.ligeroparfum.com](${BASE_URL})
- Concierge: ${CONTACT_EMAIL}
- Payment Methods: UPI, Credit & Debit Cards, Netbanking (Razorpay prepaid; no cash on delivery).
- Dispatch & Surface Freight: Dispatched in 1 to 2 working days; delivered in 3 to 7 working days across India at INR 0 shipping fee.
- Sealed Returns: 7 days from delivery on unopened, factory-sealed boxes. Opened bottles are non-returnable.
`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Last-Modified": lastUpdated.toUTCString(),
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

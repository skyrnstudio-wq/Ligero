import { NextResponse } from "next/server";
import { getLiveObjects, getLivePerfumes } from "@/lib/sanity/data";

export const revalidate = 3600;

const BASE_URL = "https://ligeroparfums.com";

export async function GET() {
  const [perfumes, objects] = await Promise.all([
    getLivePerfumes(),
    getLiveObjects(),
  ]);

  const perfumeRows = perfumes
    .map(
      (p) =>
        `| [${p.name}](${BASE_URL}/collection/${p.slug}) | ${p.volume} | INR ${p.price} | ${p.scentProfile.family} | ${p.scentProfile.top}; ${p.scentProfile.heart}; ${p.scentProfile.base} | ${p.scentProfile.longevity || "12+ hours"} |`
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
      return `| [${o.name}](${href}) | ${o.volume || "House Object"} | INR ${o.price} | ${o.description} |`;
    })
    .join("\n");

  const body = `# Ligero Parfum: Official Pricing & Catalog Specification

All prices are listed in Indian Rupees (INR), inclusive of GST, with complimentary domestic surface shipping across serviceable Indian postal codes. Ligero Parfum does not run seasonal sales or issue promo codes.

## Permanent Perfumes (50 ml Flacons)

| Perfume | Format | Price (INR) | Olfactive Family | Notes Architecture (Top / Heart / Base) | Longevity |
| :--- | :--- | :--- | :--- | :--- | :--- |
${perfumeRows}

## Objects of Scent

| Object | Format | Price (INR) | Description |
| :--- | :--- | :--- | :--- |
${objectRows}

## Commercial & Return Terms

- Currency: Indian Rupee (INR), inclusive of applicable taxes.
- Direct Channel: [ligeroparfums.com](${BASE_URL})
- Payment Methods: UPI, Credit & Debit Cards, Netbanking.
- Dispatch & Surface Freight: Dispatched in 1 to 2 working days; delivered in 3 to 7 working days across India.
- Sealed Returns: 7 days from delivery on unopened, factory-sealed boxes.
`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

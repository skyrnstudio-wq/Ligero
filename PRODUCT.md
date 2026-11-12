# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Design-conscious urban Indians, roughly 22 to 38, buying a signature scent for themselves and as gifts. They follow global fashion and beauty, recognise niche-house codes, and dislike being sold to. They arrive mostly on mobile, often from Instagram (@ligeroparfums).

## Product Purpose

Ligero Parfum is an Indian perfume house selling seven perfumes and two Objects direct to the wearer. The home page does the desiring; the collection and product pages do the selling. Success: a visitor feels the house is worth more than its price, opens a perfume, and adds it (or the Discovery Set) to their Case.

## Positioning

An Indian house with niche-perfumery restraint at an accessible price (499 to 1699 rupees). Seven perfumes, each rested ninety days, blended in India. Seven distinct worlds (dawn, night, sea, amber, cream, flower, cacao) under one quiet house. Never claim French or Grasse provenance.

## Operating Context

Next.js 15 App Router, Tailwind v4, Motion. Case (cart) drawer via React context. Routes: `/`, `/collection`, `/collection/[slug]`, `/objects`, `/contact`, `/legal/*`. Prices are in rupees, inclusive of taxes.

## Capabilities and Constraints

- Seven perfumes (Aube, Fleur, Ambre Doux, Noctis, Blanc, Marée, Noir Cacao), 50 ml Extrait de Parfum. Notes and copy: `lib/products.ts` is authoritative (client-confirmed); where `site-blueprint.md` notes differ, products.ts wins.
- Objects: The Discovery Set (999, seven 10 ml vials), En Route car diffuser (499).
- Prices (client-confirmed): Discovery Set 999, Aube 1099, Blanc 1099, Fleur 1299, Noctis 1299, Noir Cacao 1599, Ambre Doux 1699, Marée 1699, En Route 499.
- Home carries no prices per the brand voice rules (Objects excepted where already shown).
- Legal pages required by Indian law live in the footer only.

## Brand Commitments

- Name and wordmark: LIGÉRO (serif wordmark, `public/images/ligero-logo.png`). Labels read "LIGÉRO PARFUMS".
- Voice: `brand-voice/SKILL.md`. Declarative, dry, certain. Zero em dashes, zero exclamation marks, no marketing filler. CTA = verb + specific thing ("Explore the Collection", "Add to Case"). "Case", never "cart".
- Newsletter is "The Correspondence": "Four letters a year. Nothing else." Last section before the footer.
- No testimonials, star ratings, countdowns, discounts, or sale language.
- Each perfume has a distinct label artwork (Aube sunrise, Noctis night sky and crescent, Marée sea, Ambre Doux flame-amber, Blanc white plaster, Fleur blush blossom, Noir Cacao round wooden-cap bottle).

## Evidence on Hand

- Bottle photography: `public/images/perfumes/*.jpeg` (white-ground packshots), cutouts in `perfumes/cutouts/`, ingredient still lifes in `perfumes/notes/`, group shots `all-perfumes.jpeg`, `hero/Hero-bg-169.jpg`, Discovery Set `objects/`.
- Existing imagery is AI-generated in a soft studio style. User approved generating new editorial campaign imagery using the real bottles and labels.
- No press, no customer quotes, no farm names confirmed. Do not fabricate them.

## Product Principles

1. State, never sell. Facts and restraint persuade.
2. Each perfume is a world; the house is the frame that holds seven.
3. Feel worth more than the price without lying about the price.
4. Mobile first; the Instagram visitor must feel it in one thumb-scroll.

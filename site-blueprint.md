# Ligero Parfum: Site Blueprint

Companion to `ligero/design-system.md` (AUBE light theme, Cormorant Garamond + Schibsted Grotesk). Standard: awards-level. The brief wins over any database default.

All copy in this blueprint follows `ligero/brand-voice/SKILL.md`. When writing or rewriting any string, load that skill first.

## 1. Sitemap

Seven routes. Depth kills desire.

```
/                    Home. The brand film you can scroll.
/collection          The Collection. All seven perfumes.
/collection/[slug]   Fragrance detail. noctis, aube, maree, ambre-doux, blanc, fleur, noir-coco.
/objects             Objects. The Discovery Set, En Route, and what follows.
/maison              The Maison. Story, craft, sourcing.
/journal             The Journal. Long pieces, no SKUs.
/contact             Concierge. Private appointments.
```

Catalog, client-confirmed: seven perfumes (Noctis, AUBE, Marée, Ambre Doux, Blanc, Fleur, Noir Cacao), plus Objects (the Discovery Set, En Route for the car). The Seven are the whole line; there is no tier or permanence split. Name spelling is client-confirmed as "Noir Cacao"; earlier "Noir Coco" references in this document are superseded.

Copy direction, client-confirmed: lead with feel and emotion, never with inventory counts or collection architecture. Do not build copy around "the Five", "permanent", "Suite", or any permanence framing. Seven is a fact to state quietly where a number is needed ("Seven perfumes"), never a theme.

Nav reads: Collection, Maison, Journal, Concierge. Four words. FAQ, shipping, returns live in the footer, never the nav.

Legal pages exist because Indian law requires them (DPDP Act 2023, Consumer Protection E-commerce Rules 2020, Legal Metrology). Footer only, drafts in `ligero/legal/`: Privacy Policy, Terms of Sale and Use, Shipping and Returns, plus the Grievance Officer block on the Concierge page.

## 2. Global elements

- Header: logo left, four-word nav right, max height 72px. Hairline bottom border appears only after scroll.
- Footer: Noctis dark (#101418), unbleached silk text (#EAE6DC), brass accents. Four columns: Explore (Home, The Collection, Objects, Journal), Maison, Concierge, The Correspondence. One legal line at the bottom: entity name, registered address, GSTIN, then text links: Privacy Policy, Terms of Sale, Shipping and Returns, Grievance Officer.
- Newsletter: one email field, one promise line: "Four letters a year. Nothing else."
- Scroll: parallax on hero imagery only. Reduced-motion collapses everything to static.
- No custom cursor, no announcement bar, no scroll cues. Luxury does not shout.

## 3. Hero per page

| Page | Hero | Behavior |
|---|---|---|
| / | Asymmetric split | Type left 40%, image right 60%. 4 text elements max. |
| /collection | Type-only | "The Collection" in 6rem Cormorant italic. No image. |
| /collection/[slug] | Product-first | No hero image. Name in 8rem Cormorant italic. Noctis variant dark. |
| /maison | Full-photo | One photo. One line of copy. |
| /journal | Type-only | "The Journal" in 6rem Cormorant italic. |
| /contact | Type-only | "Concierge." One word, set huge. Nothing else. |

## 4. Home sections, in order

1. **Hero**. AUBE raw silk. Eyebrow LIGERO PARFUM. Headline in Cormorant 300 at 5rem: "Scent, worn like silk." Subline: "Seven perfumes, rested ninety days." CTA text link, hairline underline: "Explore the Collection". No button fill.
2. **Manifesto**. Centered, Cormorant 3rem: one felt idea about wearing Ligero. No inventory statements.
3. **The Collection**. Horizontal scroll row of tall-crop product images, name in Cormorant italic below each. No prices. Home does the desiring; the collection page does the selling. Objects live on their own page.
4. **Craft strip**. Three images, 9-word captions, hairline-separated: sourcing, blending, resting.
5. **Editorial break**. Full-width Noctis band, Bodoni Moda 4rem: "Perfume is memory, made wearable."
6. **The Correspondence**. One email field, button "Request the Correspondence".
7. **Footer**.

Layout families used: split hero, centered manifesto, horizontal scroll, captioned strip, color band, form. Six distinct families, no repetition.

## 5. Home copy

Copy leads with feel and emotion. No permanence framing, no collection-architecture language in user-facing strings.

- Hero eyebrow: LIGERO PARFUM
- Hero headline: "Scent, worn like silk."
- Hero subline: "Seven perfumes, rested ninety days."
- Hero CTA: "Explore the Collection"
- Manifesto: one felt idea about what wearing Ligero is like. No inventory statements.
- The Collection section title: "Seven Olfactive Emotions." Names only. The mystery does the work.
- Craft captions (9 words each): "Raw materials come from four farms. We can name them." / "Each blend rests ninety days before a single bottle is filled." / "Nothing added to preserve. Nothing added to shine."
- Editorial break: "Perfume is memory, made wearable."
- Correspondence label: THE PRIVATE SALON. Button: "Join the Salon."

Hero stack is exactly 4 elements (eyebrow, headline, subline, CTA). One CTA intent on the page: collection. Newsletter CTA is a separate intent (email).

## 6. Collection page (/collection)

1. **Type-only hero**: "The Collection", 6rem Cormorant italic.
2. **The seven perfumes**. Full-width rows, 60/40 split, image side alternating (max 2 zigzags in a row, break with a full-bleed image between rows 2 and 3). Each row: name in 5rem Cormorant italic, one 7-word line, three note words in Schibsted 12px uppercase, price in Schibsted, link "Open Noctis" with hairline underline. One link label pattern, used seven times ("Open AUBE", "Open Marée", and so on).
3. **Prices**. Numerals only in display type ("1299" not "₹1299"), with one small line: "Prices in rupees, inclusive of all taxes."
5. **The Discovery Set band**. Hairline box: "New to the house? The Discovery Set. Every perfume, two millilitres each. 999." Link: "Order the Discovery Set".
6. **Bespoke band**. Hairline box: "Private commissions are accepted twice a year. Write to the maison."
7. **The Correspondence**.
8. **Footer**.

Per-fragrance lines (7 words max):
- Noctis: "Smoke, leather, the hour after midnight."
- AUBE: "Warm skin, citrus peel, first light."
- Marée: "Salt, kelp, the sea at dusk."
- Ambre Doux: "Amber, tobacco leaf, a closing door."
- Blanc: "Linen, iris, the pause before speech."

## 7. Fragrance detail (/collection/[slug])

Two-column: left sticky panel (name, price, "Add to Case"), right scrolling content. "Add to Case", never "Add to Cart". One primary CTA per page.

1. **Product-first hero**: name in 8rem Cormorant italic, notes line below, no image in the hero. The bottle image appears in the sticky panel.
2. **Notes as poem**: three lines, no pyramid jargon. No "top notes" language.
3. **Ritual**: 25 to 40 words on where and when.
4. **The Material**: 30 to 50 words on one hero ingredient, one farm named.
5. **Provenance line**: "Blended in India. Rested ninety days."
6. **Continue the story**: two related fragrances, name plus one-liner. Not a card grid; two wide rows.
7. **Footer**.

Noctis PDP gets the full Noctis dark treatment (Noctis palette, Bodoni Moda display). The other six stay on raw silk. Dark page is a deliberate product-story switch, once, with a strong transition in and out.

Sample copy, Noctis:
- Notes: "Smoked papyrus. Leather. The hour after midnight."
- Ritual: "On pulse points, after dark. Two sprays. Nothing more is needed."
- The Material: "Papyrus from the Nile delta. Cut by hand, pressed the same day, rested for a year before it meets the blend."
- Provenance: "Blended in India. Rested ninety days."

Sample copy, AUBE:
- Notes: "Bergamot peel. Orange blossom. Warm skin at dawn."
- Ritual: "Morning scent. Wrists, throat, behind the knees. Repeat at noon if the day deserves it."
- The Material: "Calabrian bergamot from one grove. Picked in November, pressed before the oils can turn."

Sample copy, Marée:
- Notes: "Sea salt. Kelp absolute. Wet stone."
- Ritual: "Wear it to the coast. Wrists, neck, forearms."
- The Material: "Kelp absolute from Brittany. Cut at low tide, distilled within the day."

Sample copy, Ambre Doux:
- Notes: "Amber. Tobacco leaf. A closing door."
- Ritual: "An evening fragrance. Nape of the neck, chest, coat collar."
- The Material: "Tobacco leaf cured for a year on a single estate in La Rioja."

Sample copy, Blanc:
- Notes: "Linen. Iris. The pause before speech."
- Ritual: "Wear it when you want to be remembered as calm."
- The Material: "Iris pallida, aged three years before grinding. A note that costs more than gold by weight."

Sample copy, Fleur:
- One-liner: "Jasmine, sambac, the courtyard after rain."
- Notes: "Jasmine sambac. Vetiver. Wet earth at dusk."
- Ritual: "A daylight fragrance. Throat, wrists, the ends of the hair."
- The Material: "Jasmine sambac from Madurai, picked before dawn while the flowers still sleep."
- Price: 1299.

Sample copy, Noir Cacao:
- One-liner: "Coconut, toasted, at the last hour of the party."
- Notes: "Coconut husk. Black vanilla. The last hour of the party."
- Ritual: "An after-dark fragrance. Chest, coat collar, one spray too many."
- The Material: "Coconut husk from Kerala, toasted slow, folded into a vanilla that never turns sweet."
- Price: 1599.

Sample copy, Objects:
- The Discovery Set, 999: "Every perfume the house makes, two millilitres each."
- En Route, 499: "For the drive." One line, no poem, no ritual.

## 8. Maison (/maison)

1. **Hero**: one photo, one line: "A maison is a promise kept slowly."
2. **Story**. 150 words, single column, 65ch measure. Founder, year, why the house makes few perfumes and not many. No timeline component.
3. **The four farms**. Four wide rows, one farm each: region, crop, one fact. No logos, no map pin decoration.
4. **Numbers, stated plainly**. Seven bottles. Ninety days of rest. Zero synthetic preservatives. Set as three lines of large Cormorant numerals with 4-word labels. No stat cards.
5. **The atelier photo**. Full-bleed, no caption.
6. **Concierge link**. Text link: "Arrange a private appointment."
7. **Footer**.

## 9. Journal (/journal)

1. **Type-only hero**: "The Journal".
2. **Index**. Five to seven essays. Each row: title in Cormorant italic, one-line standfirst, reading time. No dates, no thumbnails, no categories. Dates make a journal feel expired.
3. **Essay page pattern**: single column, 65ch, Cormorant 20px body, drop cap on first paragraph. No related-posts grid. One closing link: "The Collection."
4. **Footer**.

Sample essay titles: "Why we rest a perfume for ninety days." / "The cost of real iris." / "What the sea does to kelp absolute." / "On wearing perfume for yourself."

## 10. Objects (/objects)

The Discovery Set and En Route live here. Light section, few words.

1. **Type-only hero**: "Objects."
2. **The Discovery Set**. One wide row, bottle-lineup photo: "Every perfume the house makes, two millilitres each. Seven vials, one box. 999." Link: "Order the Discovery Set".
3. **En Route**. One wide row, product photo: "For the drive. 499." One line. A car perfume explained in five words keeps the maison's dignity and the margin.
4. **The Correspondence**.
5. **Footer**.

Two rows, no card grid. Objects is a shelf, not a shop.

## 11. Concierge (/contact)

1. **Type-only hero**: "Concierge."
2. **One promise line**: "Write, and a person answers within a day."
3. **Form**: name, email, message, optional "regarding" select (Private appointment / Private commission / Press). Labels above fields, never placeholder-as-label. Error text below fields. No reCAPTCHA badge visible; use an invisible honeypot.
4. **Alternatives**. Direct email and one phone number, set as text. No chat widget. Luxury is a reply, not a pop-up.
5. **Grievance Officer block**. Required by the DPDP Act and the E-commerce Rules, set as quiet text, not a warning box: name, grievance@ligeroparfums.com, phone, hours, "Acknowledged within 72 hours. Resolved within 30 days." Draft in `legal/compliance-checklist.md`.
6. **Footer**.

## 12. Marketing psychology, applied quietly

- Scarcity: small batches, no restocks promised. True scarcity, never a countdown timer. Never framed as permanence or tiering.
- Authority: named farms and single-origin Indian estates. Facts do the persuading. Ligero is an Indian maison; do not claim French or Grasse provenance anywhere.
- Mimetic desire: the Collection row. Desire spreads from seeing others' objects of desire. No testimonial wall; luxury avoids quotes from strangers.
- Loss aversion in the bespoke band: "twice a year" closes twice, gently.
- Zero-price effect: never discount. No sale language anywhere, ever.
- Peak-end rule: the Correspondence is the last section before the footer on every page. Every visit ends with a small gift.

## 13. Copy rules (the impactful-as-few-words system)

- Maximum 12 words per headline. Maximum 25 per paragraph. One idea per section.
- Concrete nouns over adjectives: "kelp absolute" beats "oceanic freshness".
- Fragrance descriptions are weather, time, and place. Never mood boards.
- CTA format: verb + specific thing. "Explore the Collection", "Add to Case", "Request the Correspondence". Never "Learn more", "Discover more", "Shop now".
- Voice: declarative, dry, certain. The brand never persuades; it states.
- Zero em dashes anywhere. Zero exclamation marks. Zero marketing filler: no "elevate", "seamless", "unleash", "timeless elegance", "crafted with passion".
- Numbers as words when under one hundred and not a price: "ninety days", "five perfumes".

## 14. Anti-slop checklist for this build

- No custom cursor. No scroll cues. No announcement bars.
- No eyebrows above every section: maximum 1 eyebrow per 3 sections (Home uses 2 total).
- No section numbers ("01 / Hero"), no decorative middle dots, no mono-caps strips.
- No 3-equal-card rows anywhere. Layout families alternate per section.
- No testimonial quotes with fake names. No star ratings.
- No emojis, no icon soup; icons only where function demands (form errors, mobile menu).
- Motion: hero parallax and one staggered reveal on the Collection row, both wrapped in prefers-reduced-motion.
- Contrast pairs AA verified by computation (2026-09 audit): espresso on raw silk 13.5:1 · accent `#A64B24` on raw silk 4.94:1 · taupe on raw silk 5.13:1 · silk white on Noctis 14.8:1 · brass `#B9975B` on Noctis 6.7:1. Muted-text opacity floors: full-strength taupe on silk, `/55` on Noctis dark. Cart badge: espresso text on espresso/brass fills, never white-on-brass. Do not revert the accent to `#B0522A` (4.41:1, fails AA at label sizes).
- Header bar uses the nav tints (`#ECE3D3` light / `#151A1F` dark), a half-step deeper than the page so the bar reads as its own layer. All header text passes AA on the tints.
- Images: real product photography only. The repo images folder is the source. No picsum placeholders on production pages.
- Zero em dashes in every visible string, verified by search before ship.

## 15. Price list (client-confirmed)

| Product | Price |
|---|---|
| The Discovery Set | 999 |
| AUBE | 1099 |
| Blanc | 1099 |
| Fleur | 1299 |
| Noctis | 1299 |
| Noir Cacao | 1599 |
| Ambre Doux | 1699 |
| Marée | 1699 |
| En Route (car) | 499 |

Per bottle. Numerals without currency symbols in display type, per the copy rules. The Discovery Set credit question stays open; the client's answer described the set's contents, not the credit mechanic, so the set currently sells as product, not as a credit funnel.

# Ligero Parfum: Design System

Color and type foundations for the Ligero Parfum website. Palettes are named after the fragrances in the line (Noctis, AUBE, Marée, Ambre Doux, Blanc), so each product story has its own visual world. The site-wide default is a **light theme: AUBE + Modern Artisan**. Noctis stays in the system as the dark direction for evening/noir sections; the other palettes are for product-specific or seasonal sections that need a different mood.

---

## 1. Color palettes

Every hex has a role. Never use a color outside its role.

**Ratio rule:** ~70% base · 20% surface · 7% text · 2% accent · 1% metal.
Metals (brass/gold/platinum) appear **only** as 1px hairlines, thin borders, and display-size type: never as fills, gradients, or large surfaces.

### 1.1 NOCTIS: Ink & Antique Brass *(dark · evening & editorial sections)*

For dark editorial breaks, the Noctis product page, and the site footer.

| Role           | Hex         | Notes                                                 |
| -------------- | ----------- | ----------------------------------------------------- |
| Base           | `#101418` | Smoke-black with a blue-grey cast. Never pure`#000` |
| Surface        | `#1A1F24` | Cards, raised panels                                  |
| Text           | `#EAE6DC` | Unbleached silk white                                 |
| Text muted     | `#A9A69C` | Secondary copy, captions                              |
| Accent         | `#B9975B` | Antique brass: CTAs, links, highlights              |
| Secondary      | `#5C2528` | Deep oxblood: badges, hovers on dark                |
| Metal/hairline | `#3A3F45` | Dividers, borders                                     |

### 1.2 AUBE: Raw Silk & Burnt Apricot *(light flagship · site default)*

The light theme: homepage, collection and e-commerce pages. Warm but with a bite: the anti-beige-minimalism option.

| Role       | Hex         | Notes                                     |
| ---------- | ----------- | ----------------------------------------- |
| Base       | `#F3EDE3` | Raw silk                                  |
| Surface    | `#FBF8F2` | Cards on raw silk                         |
| Text       | `#2B2118` | Espresso ink                              |
| Text muted | `#6F6154` | Warm taupe: secondary copy, captions    |
| Accent     | `#B0522A` | Burnt apricot: AA contrast on base      |
| Secondary  | `#8FA6B2` | Dawn grey-blue: tags, secondary buttons |
| Metal      | `#C6A15B` | Soft gold hairlines                       |
| Hairline   | `#E0D7C7` | Dividers on raw silk                      |

### 1.3 MARÉE: Petrol & Sea Glass *(moody aquatic)*

For the Marée product page and aquatic/editorial sections. Petrol-green is rare in perfume: instantly distinct.

| Role    | Hex         | Notes                      |
| ------- | ----------- | -------------------------- |
| Base    | `#0D1B1E` | Deep petrol                |
| Surface | `#142429` | Cards, panels              |
| Text    | `#DFE7E2` | Salt white                 |
| Accent  | `#7FA8A0` | Sea glass                  |
| Fill    | `#2E4A44` | Kelp: chips, hover fills |
| Metal   | `#BFC9CB` | Platinum hairlines         |

### 1.4 AMBRE DOUX: Tobacco & Amber *(rich warm dark)*

For amber/gourmand scents and gifting pages. Reads like aged leather, not "luxury template gold."

| Role      | Hex         | Notes           |
| --------- | ----------- | --------------- |
| Base      | `#201510` | Dark tobacco    |
| Surface   | `#2B1D15` | Cards, panels   |
| Text      | `#F1E4D3` | Cream           |
| Accent    | `#D08C3C` | Amber           |
| Secondary | `#6E2E2A` | Oxblood         |
| Metal     | `#A98443` | Brass hairlines |### 1.5 BLANC: Porcelain & a Single Amber Drop *(gallery monochrome)*
For lookbooks and the white-tray product photography. Monochrome gallery look where a single amber accent does all the work.

### 1.6 Suite line *(Fleur, Noir Coco)*
Suite products sit between AUBE and Ambre Doux. Fleur pages: AUBE base and surface with dawn grey-blue (`#8FA6B2`) promoted to section accent. Noir Coco pages: Ambre Doux palette with the oxblood (`#6E2E2A`) promoted to section accent. No new palettes; the house grows within its system.

### 1.7 Objects *(Discovery Set, En Route)*
Raw silk base, surface cards, burnt apricot used once per page. Objects get no new colors. The Discovery Set page may use the white-tray photography on BLANC porcelain for the lineup shot.

| Role     | Hex         | Notes                             |
| -------- | ----------- | --------------------------------- |
| Base     | `#FAFAF7` | Porcelain                         |
| Surface  | `#F1F0EB` | Bone                              |
| Text     | `#1F1E1C` | Graphite                          |
| Accent   | `#C87B2E` | One amber: CTAs and hovers only |
| Hairline | `#E3E1DB` | Dividers, card edges              |

### Light-theme rules

- On raw silk and porcelain, separate with hairlines and surface shifts: no drop shadows.
- Text is always espresso (`#2B2118`) or graphite (`#1F1E1C`): never pure `#000`.
- Burnt apricot/amber is the only saturated color above the fold; dawn grey-blue and soft gold stay in type, tags, and hairlines.
- White-background product shots blend into BLANC porcelain; on AUBE pages, seat them on a `#FBF8F2` surface card.

**Across all palettes:** never let two accents compete in one view; the metal and the accent never appear at equal weight.

---

## 2. Font pairings (all free, Google Fonts)

| # | Pairing | Display | Body/UI | Character | Fits |
|---|---|---|---|---|---|
| 1 | **Maison Editorial** | Bodoni Moda 500-700 | Archivo 400/500 | Vogue-style high contrast; display only ≥24px | Noctis (dark sections) |
| 2 | **Engraved Classic** | Marcellus (all-caps) | Instrument Sans 400/500 | Roman engraved, timeless | Blanc |
| 3 | **Modern Artisan** *(site default)* | Cormorant Garamond (300/400, italic for names) | Schibsted Grotesk 400/500 | Perfume-house elegance; runs small, so display sizes go 1.15x larger | AUBE (site default), Ambre Doux |
| 4 | **Couture Hairline** | Italiana | Hanken Grotesk 400/500 | Ultra-minimal couture; display ≥40px only | Blanc, Marée |
| 5 | **Quiet Luxury** | Newsreader Light | Familjen Grotesk 400/500 | Editorial calm; Newsreader italic for scent notes | AUBE, Marée |

### Type conventions

- Body text: 17-18px, line-height 1.6.
- Uppercase labels: 11-12px, letter-spacing 0.16-0.22em.
- Display type: slightly negative tracking (≈ −0.01em); respect minimum sizes (Italiana collapses below 40px; Bodoni Moda loses its edge under 24px). Cormorant Garamond runs visually small: multiply intended display sizes by 1.15, and use weight 500 below 24px so hairline strokes stay legible.
- Italic display words with descenders (g, y, p, q, j) need line-height 1.1 minimum plus padding-bottom reserve so tails never clip.
- Use italics (Cormorant or Newsreader italic) for scent names and poetry lines: never bold + italic together.

### Font loading (primary direction)

The site is Next.js (App Router), so prefer `next/font`: it self-hosts the fonts, preloads them, and avoids layout shift:

```tsx
// app/layout.tsx
import { Cormorant_Garamond, Schibsted_Grotesk } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500"],
});
const schibsted = Schibsted_Grotesk({ subsets: ["latin"], variable: "--font-schibsted" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${schibsted.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

Pages with Noctis (dark) sections additionally load Bodoni Moda + Archivo the same way, scoped to those routes.

Plain `<link>` fallback (non-Next pages, emails, prototypes):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Schibsted+Grotesk:wght@400;500;600&display=swap" rel="stylesheet">
```

---

## 3. Tokens: primary direction (AUBE + Modern Artisan)

### CSS custom properties

```css
:root {
  /* AUBE: Raw Silk & Burnt Apricot */
  --color-base: #F3EDE3;       /* page background: raw silk */
  --color-surface: #FBF8F2;    /* cards, raised panels */
  --color-text: #2B2118;       /* espresso ink */
  --color-text-muted: #6F6154; /* warm taupe: secondary text */
  --color-accent: #B0522A;     /* burnt apricot: CTAs, links */
  --color-secondary: #8FA6B2;  /* dawn grey-blue: tags, secondary buttons */
  --color-gold: #C6A15B;       /* soft gold: hairlines only */
  --color-hairline: #E0D7C7;   /* 1px borders, dividers on raw silk */

  /* Dark sections (Noctis) invert the same roles:
     base #101418 · surface #1A1F24 · text #EAE6DC · muted #A9A69C
     accent #B9975B · secondary #5C2528 · hairline #3A3F45 */

  /* Type: when using next/font, point these at the font variables
     from app/layout.tsx instead: var(--font-cormorant) / var(--font-schibsted) */
  --font-display: "Cormorant Garamond", "Georgia", serif;
  --font-body: "Schibsted Grotesk", "Helvetica Neue", sans-serif;
}
```

### Tailwind v4 `@theme` variant

```css
@theme {
  --color-aube-base: #F3EDE3;
  --color-aube-surface: #FBF8F2;
  --color-aube-text: #2B2118;
  --color-aube-text-muted: #6F6154;
  --color-aube-accent: #B0522A;
  --color-aube-secondary: #8FA6B2;
  --color-aube-gold: #C6A15B;
  --color-aube-hairline: #E0D7C7;

  /* With next/font: --font-display: var(--font-cormorant); --font-body: var(--font-schibsted); */
  --font-display: "Cormorant Garamond", serif;
  --font-body: "Schibsted Grotesk", sans-serif;
}
```

Swap the hex values per section using the other palettes; keep the same token names so components never change.

---

## 4. Anti-slop checklist

Banned from this system: a design review finding any of these fails:

- **Colors:** indigo/violet gradients, Tailwind default blue `#3B82F6`, teal-on-white SaaS look, pure `#000`/`#FFF` as large surfaces, gold gradients, glossy metal fills, glow/shine text effects.
- **Fonts:** Playfair Display, Inter, Poppins, DM Sans, Montserrat: the most over-used "elegant AI" choices.
- **Patterns:** metals as fills or gradients (hairlines only), drop shadows everywhere (use hairlines and surface shifts instead), two competing accents in one view, gradient buttons.

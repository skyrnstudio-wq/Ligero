# Ligero Parfum — Design System

Color and type foundations for the Ligero Parfum website. Palettes are named after the fragrances in the line (Noctis, AUBE, Marée, Ambre Doux, Blanc), so each product story has its own visual world. The site-wide default is a **light theme: AUBE + Modern Artisan**. Noctis stays in the system as the dark direction for evening/noir sections; the other palettes are for product-specific or seasonal sections that need a different mood.

---

## 1. Color palettes

Every hex has a role. Never use a color outside its role.

**Ratio rule:** ~70% base · 20% surface · 7% text · 2% accent · 1% metal.
Metals (brass/gold/platinum) appear **only** as 1px hairlines, thin borders, and display-size type — never as fills, gradients, or large surfaces.

### 1.1 NOCTIS — Ink & Antique Brass *(dark · evening & editorial sections)*

For dark editorial breaks, the Noctis product page, and the site footer.

| Role           | Hex         | Notes                                                 |
| -------------- | ----------- | ----------------------------------------------------- |
| Base           | `#101418` | Smoke-black with a blue-grey cast. Never pure`#000` |
| Surface        | `#1A1F24` | Cards, raised panels                                  |
| Text           | `#EAE6DC` | Unbleached silk white                                 |
| Text muted     | `#A9A69C` | Secondary copy, captions                              |
| Accent         | `#B9975B` | Antique brass — CTAs, links, highlights (6.7:1 on base)  |
| Secondary      | `#5C2528` | Deep oxblood — badges, hovers on dark                |
| Metal/hairline | `#3A3F45` | Dividers, borders                                     |

### 1.2 AUBE — Raw Silk & Burnt Apricot *(light flagship · site default)*

The light theme: homepage, collection and e-commerce pages. Warm but with a bite — the anti-beige-minimalism option.

| Role       | Hex         | Notes                                     |
| ---------- | ----------- | ----------------------------------------- |
| Base       | `#F3EDE3` | Raw silk                                  |
| Surface    | `#FBF8F2` | Cards on raw silk                         |
| Text       | `#2B2118` | Espresso ink                              |
| Text muted | `#6F6154` | Warm taupe — secondary copy, captions (5.1:1 on base)   |
| Accent     | `#A64B24` | Burnt apricot — 4.9:1 on base, WCAG AA     |
| Secondary  | `#8FA6B2` | Dawn grey-blue — tags, secondary buttons |
| Metal      | `#C6A15B` | Soft gold hairlines                       |
| Hairline   | `#E0D7C7` | Dividers on raw silk                      |

### 1.3 MARÉE — Petrol & Sea Glass *(moody aquatic)*

For the Marée product page and aquatic/editorial sections. Petrol-green is rare in perfume — instantly distinct.

| Role    | Hex         | Notes                      |
| ------- | ----------- | -------------------------- |
| Base    | `#0D1B1E` | Deep petrol                |
| Surface | `#142429` | Cards, panels              |
| Text    | `#DFE7E2` | Salt white                 |
| Accent  | `#7FA8A0` | Sea glass                  |
| Fill    | `#2E4A44` | Kelp — chips, hover fills |
| Metal   | `#BFC9CB` | Platinum hairlines         |

### 1.4 AMBRE DOUX — Tobacco & Amber *(rich warm dark)*

For amber/gourmand scents and gifting pages. Reads like aged leather, not "luxury template gold."

| Role      | Hex         | Notes           |
| --------- | ----------- | --------------- |
| Base      | `#201510` | Dark tobacco    |
| Surface   | `#2B1D15` | Cards, panels   |
| Text      | `#F1E4D3` | Cream           |
| Accent    | `#D08C3C` | Amber           |
| Secondary | `#6E2E2A` | Oxblood         |
| Metal     | `#A98443` | Brass hairlines |

### 1.5 BLANC — Porcelain & a Single Amber Drop *(gallery monochrome)*

For lookbooks and the white-tray product photography. Monochrome gallery look where a single amber accent does all the work.

| Role     | Hex         | Notes                             |
| -------- | ----------- | --------------------------------- |
| Base     | `#FAFAF7` | Porcelain                         |
| Surface  | `#F1F0EB` | Bone                              |
| Text     | `#1F1E1C` | Graphite                          |
| Accent   | `#C87B2E` | One amber — CTAs and hovers only |
| Hairline | `#E3E1DB` | Dividers, card edges              |

### Light-theme rules

- On raw silk and porcelain, separate with hairlines and surface shifts — no drop shadows.
- Text is always espresso (`#2B2118`) or graphite (`#1F1E1C`) — never pure `#000`.
- Burnt apricot/amber is the only saturated color above the fold; dawn grey-blue and soft gold stay in type, tags, and hairlines.
- White-background product shots blend seamlessly on BLANC porcelain; on AUBE pages, seat them on a `#FBF8F2` surface card.

**Across all palettes:** never let two accents compete in one view; the metal and the accent never appear at equal weight.

---

## 2. Font pairings (all free, Google Fonts)

1. #PairingDisplayBody/UICharacterFits1**Maison Editorial**Bodoni Moda 500–700Archivo 400/500Vogue-style high contrast; display only ≥24pxNoctis (dark sections)2**Engraved Classic**Marcellus (all-caps)Instrument Sans 400/500Roman engraved, timelessBlanc3**Modern Artisan** *(site default)*Fraunces (optical size; soft/wonk axes)Schibsted Grotesk 400/500Contemporary niche perfumerAUBE (site default), Ambre Doux4**Couture Hairline**ItalianaHanken Grotesk 400/500Ultra-minimal couture; display ≥40px onlyBlanc, Marée5**Quiet Luxury**Newsreader LightFamiljen Grotesk 400/500Editorial calm; Newsreader italic for scent notesAUBE, Marée

### Type conventions

- Body text: 17–18px, line-height 1.6.
- Uppercase labels: 11–12px, letter-spacing 0.16–0.22em.
- Display type: slightly negative tracking (≈ −0.01em); respect minimum sizes (Italiana collapses below 40px; Bodoni Moda loses its edge under 24px).
- Use italics (Newsreader italic) for scent notes and poetry lines — never bold + italic together.

### Font loading (primary direction)

The site is Next.js (App Router), so prefer `next/font` — it self-hosts the fonts, preloads them, and avoids layout shift:

```tsx
// app/layout.tsx
import { Fraunces, Schibsted_Grotesk } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz"], // add "SOFT" and/or "WONK" for a softer, quirkier display voice
});
const schibsted = Schibsted_Grotesk({ subsets: ["latin"], variable: "--font-schibsted" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${schibsted.variable}`}>
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
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Schibsted+Grotesk:wght@400;500;600&display=swap" rel="stylesheet">
```

---

## 3. Tokens — primary direction (AUBE + Modern Artisan)

### CSS custom properties

```css
:root {
  /* AUBE — Raw Silk & Burnt Apricot */
  --color-base: #F3EDE3;       /* page background — raw silk */
  --color-surface: #FBF8F2;    /* cards, raised panels */
  --color-text: #2B2118;       /* espresso ink */
  --color-text-muted: #6F6154; /* warm taupe — secondary text */
  --color-accent: #A64B24;     /* burnt apricot — CTAs, links. 4.9:1 on base (AA) */
  --color-secondary: #8FA6B2;  /* dawn grey-blue — tags, secondary buttons */
  --color-gold: #C6A15B;       /* soft gold — hairlines only */
  --color-hairline: #E0D7C7;   /* 1px borders, dividers on raw silk */
  --color-nav-silk: #ECE3D3;   /* header bar tint, light mode — a half-step deeper than base */

  /* Dark sections (Noctis) invert the same roles:
     base #101418 · surface #1A1F24 · text #EAE6DC · muted #A9A69C
     accent #B9975B (brass, 6.7:1 on base) · secondary #5C2528 · hairline #3A3F45
     nav tint #151A1F (lifted soot) */

  /* Type — when using next/font, point these at the font variables
     from app/layout.tsx instead: var(--font-fraunces) / var(--font-schibsted) */
  --font-display: "Fraunces", "Georgia", serif;
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
  --color-aube-accent: #A64B24;
  --color-aube-secondary: #8FA6B2;
  --color-aube-gold: #C6A15B;
  --color-aube-hairline: #E0D7C7;
  --color-nav-silk: #ECE3D3;

  /* Noctis dark theme */
  --color-noctis-base: #101418;
  --color-noctis-surface: #1A1F24;
  --color-noctis-accent: #B9975B;
  --color-nav-soot: #151A1F;

  /* With next/font: --font-display: var(--font-fraunces); --font-body: var(--font-schibsted); */
  --font-display: "Fraunces", serif;
  --font-body: "Schibsted Grotesk", sans-serif;
}
```

### Contrast floor (verified programmatically, WCAG AA)

- Accent on raw silk: `#A64B24` = 4.94:1. The former `#B0522A` measured 4.41:1 and failed at label sizes; do not revert.
- Espresso on accent hover fills: do not place `#2B2118` text on `#A64B24` backgrounds (2.7:1). Accent fills pair with `#F3EDE3` text only at display sizes, or use espresso fills with silk text for buttons.
- Taupe `#6F6154` and silk `#EAE6DC` must never be lightened below full opacity for text under 18px. Muted text opacity floor on dark: `/55`. Placeholder text uses full-strength taupe (global `::placeholder` rule in `globals.css`).
- The cart badge is espresso-on-silk (light) or espresso-on-brass (dark). White text on brass fails (2.75:1) and is banned.
- Hairlines (`#E0D7C7` on silk, 1.23:1) and inactive carousel dots are decorative non-text UI and are exempt.

Swap the hex values per section using the other palettes; keep the same token names so components never change.

---

## 4. Anti-slop checklist

Banned from this system — a design review finding any of these fails:

- **Colors:** indigo/violet gradients, Tailwind default blue `#3B82F6`, teal-on-white SaaS look, pure `#000`/`#FFF` as large surfaces, gold gradients, glossy metal fills, glow/shine text effects.
- **Fonts:** Playfair Display, Inter, Poppins, DM Sans, Montserrat — the most over-used "elegant AI" choices.
- **Patterns:** metals as fills or gradients (hairlines only), drop shadows everywhere (use hairlines and surface shifts instead), two competing accents in one view, gradient buttons.

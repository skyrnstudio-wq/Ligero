# Ligero Parfum — Design System

Color and type foundations for the Ligero Parfum website. Palettes are named after the fragrances in the line (Noctis, AUBE, Marée, Ambre Doux, Blanc), so each product story has its own visual world. The site-wide default is a **light theme: AUBE + Modern Artisan**. Noctis stays in the system as the dark direction for evening/noir sections; the other palettes are for product-specific or seasonal sections that need a different mood.

---

## 1. Color palettes

Every hex has a role. Never use a color outside its role.

**Ratio rule:** ~70% base · 20% surface · 7% text · 2% accent · 1% metal.
Metals (brass/gold/platinum) appear **only** as 1px hairlines, thin borders, and display-size type — never as fills, gradients, or large surfaces.

### 1.1 NOCTIS — Ink & Antique Brass *(dark · evening & editorial sections)*

For dark editorial breaks, evening perfume pages (Noctis, Noir Cacao), and the site footer.

| Role           | Hex         | Notes                                                 |
| -------------- | ----------- | ----------------------------------------------------- |
| Base           | `#101418` | Smoke-black with a blue-grey cast. Never pure `#000` |
| Surface        | `#1A1F24` | Cards, raised panels                                  |
| Text           | `#EAE6DC` | Unbleached silk white (14.8:1 on base)                |
| Text muted     | `#A9A69C` | Secondary copy, captions (7.6:1 on base)              |
| Accent         | `#B9975B` | Antique brass — CTAs, links, highlights (6.7:1 on base)|
| Accent hover   | `#C9A76B` | Lifted antique brass for hover states                 |
| Secondary      | `#5C2528` | Deep oxblood — badge & tag fills with silk text       |
| Metal/hairline | `#3A3F45` | Dividers, borders on dark                             |
| Error          | `#E59882` | Terracotta clay — form validation (8.0:1 on base)     |

### 1.2 AUBE — Raw Silk & Burnt Apricot *(light flagship · site default)*

The light theme: homepage, collection and e-commerce pages. Warm but with a bite — the anti-beige-minimalism option.

| Role            | Hex         | Notes                                                 |
| --------------- | ----------- | ----------------------------------------------------- |
| Base            | `#F3EDE3` | Raw silk page background                              |
| Surface         | `#FBF8F2` | Cards, raised panels on raw silk                      |
| Text            | `#2B2118` | Espresso ink (13.5:1 on base)                         |
| Text muted      | `#6F6154` | Warm taupe — secondary copy, captions (5.1:1 on base) |
| Accent          | `#A64B24` | Burnt apricot — 4.9:1 on base, WCAG AA                |
| Secondary (text)| `#4A6270` | Slate-dawn — text labels, secondary links (5.5:1)      |
| Secondary (fill)| `#8FA6B2` | Dawn grey-blue — background fills, chip borders       |
| Metal           | `#C6A15B` | Soft gold hairlines                                   |
| Hairline        | `#E0D7C7` | Dividers, borders on raw silk                         |
| Error           | `#8C2D19` | Venetian carmine — form errors (7.2:1 on base)        |
| Success         | `#3B5238` | Pressed olive leaf — verified order status (7.4:1)     |

### 1.3 MARÉE — Coastal Sea Mist & Deep Marine Ink *(light blue oceanic)*

For the Marée product page. Coastal morning light blue — luminous, fresh, and deeply maritime.

| Role    | Hex         | Notes                                      |
| ------- | ----------- | ------------------------------------------ |
| Base    | `#F0F6F9`   | Coastal sea mist page background           |
| Surface | `#E5F0F5`   | Soft pale seafoam cards, panels            |
| Text    | `#112530`   | Deep marine ink (14.2:1 on base)           |
| Muted   | `#557280`   | Maritime slate (5.0:1 on base)             |
| Accent  | `#197293`   | Crystalline sea glass azure                |
| Hairline| `#CEE0E9`   | Ocean mist hairlines                       |

### 1.4 AMBRE DOUX — Tobacco & Amber *(rich warm dark)*

For amber/gourmand scents and gifting pages. Reads like aged leather, not "luxury template gold."

| Role      | Hex         | Notes                                    |
| --------- | ----------- | ---------------------------------------- |
| Base      | `#201510` | Dark tobacco                             |
| Surface   | `#2B1D15` | Cards, panels                            |
| Text      | `#F1E4D3` | Cream (14.3:1 on base)                   |
| Accent    | `#D08C3C` | Amber (6.4:1 on base)                    |
| Secondary | `#6E2E2A` | Oxblood — surface fill behind cream text |
| Metal     | `#A98443` | Brass hairlines                          |

### 1.5 BLANC — Porcelain & a Single Amber Drop *(gallery monochrome)*

For lookbooks and the white-tray product photography. Monochrome gallery look where a single amber accent does all the work.

| Role     | Hex         | Notes                                             |
| -------- | ----------- | ------------------------------------------------- |
| Base     | `#FAFAF7` | Porcelain page background                         |
| Surface  | `#F1F0EB` | Bone cards and panels                             |
| Text     | `#1F1E1C` | Graphite (15.9:1 on base)                         |
| Accent   | `#9E5818` | Deepened amber — CTAs & hovers (5.2:1 on base, AA)|
| Hairline | `#E3E1DB` | Dividers, card edges                              |

### Theme & Palette Architecture (Option A: Restrained Dual-Mode)

- **Default Canvas:** **AUBE** is the default site-wide canvas (Home, Collection, Discovery Set, Objects, Maison, Concierge, Help, and daytime PDPs like AUBE, Fleur, Blanc, Ambre Doux, Marée).
- **Evening Scents & Noir Sections:** **NOCTIS** is applied to dark evening extraits (`noctis` and `noir-cacao`), the global footer, and editorial statement bands.
- **Scent-Specific Palettes:** Marée (petrol/sea glass) and Ambre Doux (tobacco/amber) are reserved for evocative material callouts, notes poetry cards, and lookbook imagery rather than recoloring the entire UI chrome.
- **Pure Colors Banned:** Pure `#000000` and `#FFFFFF` are banned from backgrounds and large surfaces. Dark uses `#101418` (smoke-black); light uses `#F3EDE3` (raw silk); overlays use `bg-noctis-base/70` or `bg-nav-silk/95`.
- **Oxblood Secondary Usage:** `#5C2528` and `#6E2E2A` must only be used as background badge/tag fills paired with light unbleached silk text (`#EAE6DC` / `#F1E4D3`). Never use oxblood as foreground text on dark backgrounds.

### Light-theme rules

- On raw silk and porcelain, separate with hairlines and surface shifts — no drop shadows.
- Text is always espresso (`#2B2118`) or graphite (`#1F1E1C`) — never pure `#000`.
- Burnt apricot/amber is the only saturated color above the fold; dawn grey-blue and soft gold stay in type, tags, and hairlines.
- White-background product shots blend seamlessly on BLANC porcelain; on AUBE pages, seat them on a `#FBF8F2` surface card.

**Across all palettes:** never let two accents compete in one view; the metal and the accent never appear at equal weight.

---

## 2. Font pairings (all free, Google Fonts)

1. #PairingDisplayBody/UICharacterFits1**Maison Editorial**Bodoni Moda 500–700Archivo 400/500Vogue-style high contrast; display only ≥24pxNoctis (dark sections)2**Engraved Classic**Marcellus (all-caps)Instrument Sans 400/500Roman engraved, timelessBlanc3**Modern Artisan** *(site default)*Cormorant Garamond 300–600 (normal & italic)Schibsted Grotesk 400/500Contemporary niche perfumerAUBE (site default), Ambre Doux4**Couture Hairline**ItalianaHanken Grotesk 400/500Ultra-minimal couture; display ≥40px onlyBlanc, Marée5**Quiet Luxury**Newsreader LightFamiljen Grotesk 400/500Editorial calm; Newsreader italic for scent notesAUBE, Marée

### Type conventions

- Body text: 17–18px, line-height 1.6.
- Uppercase labels: 11–12px, letter-spacing 0.16–0.22em.
- Display type: slightly negative tracking (≈ −0.01em); respect minimum sizes (Italiana collapses below 40px; Bodoni Moda loses its edge under 24px).
- Use italics (Newsreader italic) for scent notes and poetry lines — never bold + italic together.

### Font loading (primary direction)

The site is Next.js (App Router), so prefer `next/font` — it self-hosts the fonts, preloads them, and avoids layout shift:

```tsx
// app/layout.tsx
import { Cormorant_Garamond, Schibsted_Grotesk } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
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
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Schibsted+Grotesk:wght@400;500;600&display=swap" rel="stylesheet">
```

---

## 3. Tokens — primary direction (AUBE + Modern Artisan)

### CSS custom properties

```css
:root {
  /* AUBE — Raw Silk & Burnt Apricot (site default) */
  --color-base: #F3EDE3;       /* page background — raw silk */
  --color-surface: #FBF8F2;    /* cards, raised panels */
  --color-text: #2B2118;       /* espresso ink */
  --color-text-muted: #6F6154; /* warm taupe — secondary text */
  --color-accent: #A64B24;     /* burnt apricot — CTAs, links. 4.9:1 on base (AA) */
  --color-secondary: #4A6270;  /* slate-dawn for text (5.5:1 on base) */
  --color-gold: #C6A15B;       /* soft gold — hairlines only */
  --color-hairline: #E0D7C7;   /* 1px borders, dividers on raw silk */
  --color-error: #8C2D19;      /* venetian carmine — 7.2:1 on base */
  --color-success: #3B5238;    /* pressed olive leaf — 7.4:1 on base */
  --color-nav-silk: #ECE3D3;   /* header bar tint, light mode — a half-step deeper than base */

  /* Dark sections (Noctis) invert the same roles:
     base #101418 · surface #1A1F24 · text #EAE6DC · muted #A9A69C
     accent #B9975B (brass, 6.7:1 on base) · accent hover #C9A76B
     secondary #5C2528 · hairline #3A3F45 · error #E59882
     nav tint #151A1F (lifted soot) */

  /* Type — when using next/font, point these at the font variables
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
  --color-aube-accent: #A64B24;
  --color-aube-secondary: #4A6270;
  --color-aube-secondary-muted: #8FA6B2;
  --color-aube-gold: #C6A15B;
  --color-aube-hairline: #E0D7C7;
  --color-aube-error: #8C2D19;
  --color-aube-success: #3B5238;
  --color-nav-silk: #ECE3D3;

  /* Noctis dark theme */
  --color-noctis-base: #101418;
  --color-noctis-surface: #1A1F24;
  --color-noctis-text: #EAE6DC;
  --color-noctis-text-muted: #A9A69C;
  --color-noctis-accent: #B9975B;
  --color-noctis-accent-hover: #C9A76B;
  --color-noctis-hairline: #3A3F45;
  --color-noctis-secondary: #5C2528;
  --color-noctis-error: #E59882;
  --color-nav-soot: #151A1F;

  /* With next/font: --font-display: var(--font-cormorant); --font-body: var(--font-schibsted); */
  --font-display: "Cormorant Garamond", serif;
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

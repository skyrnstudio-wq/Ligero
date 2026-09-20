# Hero & Navbar Audit — Ligero Parfum

Audit lens: frontend-design principles + animation-vocabulary glossary.
Verdicts: ✅ passes · ⚠️ worth fixing · ❌ fails.

---

## Hero (`components/hero.tsx`)

### Design

✅ **Thesis** — The 16:9 campaign photo with type in the raw-silk negative space is the right thesis for a perfume house: product-first, restrained.

✅ **Typography carries personality** — Cormorant display against Schibsted utility, italic on the second headline line. The type scale steps cleanly (4xl → 6xl).

⚠️ **Copy drifted off-voice** — "Indulge in an olfactory statement" and "Discover Your Signature" break the brand rules: "indulge" is on the banned filler list in brand-voice §3, and the CTA is not the blueprint's "Explore the Collection". "Rare botanicals… second skin" also exceeds the 25-word paragraph cap at 33 words. Someone edited this copy away from the approved voice.

⚠️ **Eyebrow is an AI-tell** — "Haute Parfumerie · Hand-Crafted" with a middle dot is exactly the decorative mono-caps strip the blueprint's anti-slop list bans ("no decorative middle dots, no mono-caps strips"). The hero's eyebrow was specified as a single word: LIGERO PARFUM.

⚠️ **Palette drift** — The hero hard-codes `#F0E2D6` for the base + veils, but the site token is `--color-aube-base: #f3ede3`. On pages where the hero sits above raw-silk sections this produces a visible tint seam. Both veils and the section bg should use the token.

✅ **Structure is information** — No fake numbering, no stat cards. Good.

### Animation

⚠️ **The hero is completely static** — `ParallaxImage` exists and is imported nowhere now; the blueprint's global spec says "parallax on hero imagery only". The parallax got dropped when the hero was rewritten. For a brand whose whole identity is slow luxury, a static hero image is a missed beat — restore the subtle ±16px translate on the image.

✅ **Hover on CTA** — arrow `translate-x-1` on hover is a correct **Hover effect**, quiet and purposeful.

❌ **No entrance orchestration** — The type stack renders at full opacity immediately. After the intro loader hands off with the logo landing in the navbar, the page body appears with a hard cut. One **stagger** of **fade in / slide in** on eyebrow → headline → subline → CTA (each ~500ms, 80ms apart, ease-out) would connect the loader's **Orchestration** into the page. Currently the most expensive animation on the site (the logo flight) dead-ends.

---

## Navbar (`components/site-header.tsx` + `components/intro-loader.tsx`)

### Design

✅ **Centered big logo** — Exactly viewport-centered via absolute positioning with equal flex-1 side columns. Largest element in the strip as requested.

✅ **Scroll behavior** — Hide on scroll down, return on scroll up with a 4px hysteresis. Correct and standard.

⚠️ **Strip height vs logo size** — The logo renders at `h-16` (64px) inside an 80px strip (96px on sm+). That's 80% of the bar — visually "big" as asked, but the Menu/Case labels at 11px now feel undersized against it. Consider `sm:h-14 lg:h-16` instead of `md:h-14 lg:h-16` so the jump isn't so steep, or bump the side labels to 12px.

⚠️ **Dark-mode logo treatment is a hack** — `brightness-125 invert` on the PNG will gray-out the ink if the logo ever has mid-tones. Since the wordmark is solid near-black, this works today, but a dedicated light-ink PNG (or CSS mask with background color) would be robust. Low priority.

✅ **Focus visibility** — `focus-visible:ring-1` on both side controls. Passes the quality floor.

### Animation

✅ **Hide/show** — The `y: -100%` slide with `cubic-bezier(0.32, 0.72, 0, 1)` is a clean asymmetric curve; 450ms is the right duration for a strip. Passes **Interruptible animation** (Motion retargets mid-flight).

✅ **Intro loader flight** — The measured FLIP-style handoff (center logo → navbar slot) is a textbook **Shared element transition** / **Morph** with **Spatial consistency**. The 50ms overlap between handoff and unmount is exactly right for zero flicker.

⚠️ **Tagline copy in loader** — "Seven perfumes, all permanent." appears for ~1.3s then vanishes forever. A message the user reads for one second should not introduce the "permanent" framing the client explicitly rejected in planning. Either cut the tagline or use "Worn close. Remembered longer." (the approved footer tagline).

⚠️ **Session flag on window vs sessionStorage** — `window.__ligeroIntroDone` resets on every full page load, so every hard refresh replays the 1.35s intro. The earlier sessionStorage guard was removed in the rewrite. If the replay is intentional (page transitions in Next are client-side so it won't replay on route change), fine — but flag it as a choice.

❌ **Hero/heading content is not keyed to introDone** — Only Menu, logo, and Case wait for the intro. The hero type stack and image paint immediately underneath the veil, so when the veil lifts the hero is already "old". Give the hero stack the stagger above, triggered by the same `ligero:intro-done` event, and the whole entrance becomes one **Orchestration**.

---

## Priority fixes

1. **Hero copy** — restore voice-compliant headline/subline/CTA (banned-word sweep, 25-word cap, blueprint CTA).
2. **Hero entrance stagger** keyed to intro handoff — the single highest-impact motion fix.
3. **Restore hero image parallax** (subtle, reduced-motion collapsed) per blueprint.
4. **Palette** — replace hard-coded `#F0E2D6` with `aube-base` token.
5. **Eyebrow** — drop the "·" construct, back to LIGERO PARFUM or drop it.
6. **Loader tagline** — swap to approved tagline or cut.

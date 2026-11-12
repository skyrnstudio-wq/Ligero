# Ligero Parfum — Product Page Gallery AI Generation System
**Document Version:** 1.0.0  
**Target Platform:** Midjourney v6.1 / Flux.1 Pro / SDXL (ControlNet & IP-Adapter)  
**Standard Gallery Aspect Ratio:** `4:5` (optimised for mobile swipe carousel & desktop sticky 7:12 gallery grid)

---

## 1. Gallery Architecture & Image Strategy

A luxury niche fragrance product detail page (PDP) must balance **forensic clarity** (what am I physically buying?) with **olfactory desire** (what does this smell like, and what world does it transport me to?).

For each of the seven permanent perfumes (**Aubé, Fleur, Ambre Doux, Noctis, Blanc, Marée, Noir Cacao**), the gallery is structured into essential core assets plus high-converting recommended additions:

```
┌────────────────────────────────────────────────────────────────────────┐
│                      LIGÉRO PDP GALLERY SEQUENCE                       │
├───────────────┬────────────────────────────────────────────────────────┤
│ 1. Cutout     │ Pure flacon on neutral raw-silk / seamless studio card │
│ 2. Notes BG   │ Raw harvest botanicals & mineral still-life composition│
│ 3. Aesthetic  │ Architectural atmosphere, light & mood narrative       │
│ 4. Box/Case   │ Common luxury rigid unboxing presentation (All scents) │
│ 5. Macro (Rec)│ Flacon collar, magnetic cap seam & atomizer precision  │
│ 6. Scale (Rec)│ Human hand holding 50ml flacon (tactile ergonomics)    │
│ 7. Mist (Rec) │ Fine aerosol dispersion cloud in directional shaft     │
└───────────────┴────────────────────────────────────────────────────────┘
```

---

## 2. Why & When AI Needs a Reference Image

Standard text-to-image models (Midjourney, Flux, Stable Diffusion) will hallucinate random bottle shapes, fictional brand names, crooked caps, and erratic typography if prompted with text alone.

### Consistency Rules by Asset Type:
1. **Flacon Cutout:** **REQUIRES Reference Image.** Must maintain identical glass shoulder geometry, 50ml proportions, magnetic cap, and label typography across all products.
2. **Notes Background (2 Paths):**
   - *Composite Path (Recommended):* Generate a pristine **Botanical Backplate** (no bottle in prompt) and composite the existing PNG bottle cutout in Figma or Photoshop.
   - *Integrated Inpainting Path:* Use the bottle cutout as an inpainting mask with ControlNet Canny/Depth so botanicals wrap realistically around the glass without altering the flacon.
3. **Aesthetic / Editorial Shot:** **RECOMMENDS Reference Image** (`--cref` in Midjourney or IP-Adapter in Flux/SDXL) to anchor the flacon silhouette while letting the environment breathe.
4. **Presentation Box:** Can be generated with text-to-image or stylised using the brand crest and raw silk paper texture reference.

---

## 3. The Common Packaging / Presentation Box (All Perfumes)

This shot represents the common unboxing experience for all 50ml extraits de parfum across the maison.

```json
{
  "image_id": "pdp_common_box_unboxing",
  "category": "box_presentation",
  "target_product": "all_perfumes",
  "aspect_ratio": "4:5",
  "generator_target": "Midjourney v6.1 / Flux.1 Pro",
  "reference_image_required": true,
  "reference_image_details": {
    "recommended_file": "public/images/brand/logo-art.png",
    "texture_reference": "public/images/textures/raw-silk-canvas.webp",
    "purpose": "Logo deboss accuracy and unbleached raw silk paper texture",
    "midjourney_flags": "--sref <raw-silk-texture-url> --sw 150 --v 6.1 --ar 4:5 --style raw"
  },
  "prompt": "Haute parfumerie luxury unboxing editorial still life. An open architectural two-piece rigid presentation gift box made of heavy unbleached raw silk textured paper (#F3EDE3), precise sharp 90-degree edges, subtle blind-debossed minimalist brand crest, with dark espresso ink typography reading 'LIGÉRO PARFUMS'. Inside the box, a custom-moulded recessed bed lined with ivory matte paper cradles a heavy crystal glass perfume flacon. The box lid rests elegantly beside the open base on a honed light travertine stone surface. Beside the box lies a small folded letterpressed card sealed with unbleached cotton ribbon. Directional morning atelier window lighting, soft organic shadows, tactile paper grain visible, medium format Hasselblad 80mm lens, f/5.6, exquisite minimalist luxury packaging packshot --ar 4:5 --style raw --v 6.1",
  "negative_prompt": "glossy plastic, garish gold ribbons, cheap cardboard, crushed box, warped edges, artificial neon, overexposed reflections, messy background, distorted text, saturated colors, low resolution, 3d render plastic look"
}
```

---

## 4. Per-Fragrance Core Prompts (Cutout, Notes BG, Aesthetic)

---

### 4.1 Aubé (Fresh Green Aquatic)
*Notes:* Wild Mountain Spearmint · Water Jasmine · Green Virginian Cedar  
*Palette:* Raw Silk `#F3EDE3` · Burnt Apricot `#A64B24` · Morning travertine

```json
[
  {
    "image_id": "pdp_aube_01_cutout",
    "category": "cutout",
    "fragrance": "Aubé",
    "aspect_ratio": "4:5",
    "reference_image_required": true,
    "reference_image_details": {
      "path_in_repo": "public/images/perfumes/cutouts/aube.webp",
      "purpose": "Lock exact flacon geometry, pale sage-tinted juice color, and brushed brass cap",
      "method": "Midjourney --cref <aube_cutout_url> --cw 90 or SDXL ControlNet Tile/Canny"
    },
    "prompt": "Professional commercial e-commerce studio packshot cutout of a luxury perfume flacon for 'Aubé'. Heavy architectural clear crystal glass bottle with thick glass base, holding crystalline pale green-tinted fragrant oil. Cylindrical brushed soft champagne gold metal magnetic cap. Minimalist textured off-white paper label centered on the bottle with crisp typography: 'LIGÉRO' and 'AUBÉ · Extrait de Parfum · 50ml'. Centered, perfectly vertical, isolated on a clean seamless off-white raw silk surface (#F3EDE3), soft gradient under-shadow, high-end catalog lighting, ultra-sharp glass refraction and crisp reflections --ar 4:5 --style raw --v 6.1",
    "negative_prompt": "distorted bottle, crooked cap, plastic spray nozzle, chromatic aberration, glare, fingerprints on glass, harsh black background, cartoon, saturated neon colors"
  },
  {
    "image_id": "pdp_aube_02_notes_bg",
    "category": "notes_bg",
    "fragrance": "Aubé",
    "aspect_ratio": "4:5",
    "reference_image_required": false,
    "composite_instructions": "This prompt generates a pure raw material backplate. Composite 'public/images/perfumes/cutouts/aube.webp' over this plate at 65% height.",
    "prompt": "Haute parfumerie botanical still life plate for fragrance raw ingredients. Freshly picked wild mountain spearmint leaves glistening with microscopic dawn dew droplets, pristine white water jasmine petals (Jasminum sambac) scattered naturally, and freshly shaved aromatic green Virginian cedar twigs. Arranged artfully on a wet light-toned honed travertine stone slab with subtle water rivulets. Soft natural morning dawn sunlight entering at a low 30-degree angle from the side, delicate light refractions, macro 100mm f/4 lens depth of field, tactile organic textures, quiet contemplative editorial --ar 4:5 --style raw --v 6.1",
    "negative_prompt": "perfume bottle in frame, dry leaves, wilted flowers, dirty stones, high contrast, oversaturated green, artificial lighting, cluttered arrangement"
  },
  {
    "image_id": "pdp_aube_03_aesthetic",
    "category": "aesthetic",
    "fragrance": "Aubé",
    "aspect_ratio": "4:5",
    "reference_image_required": true,
    "reference_image_details": {
      "path_in_repo": "public/images/perfumes/cutouts/aube.webp",
      "purpose": "Object consistency for the bottle placed within the scene",
      "method": "Midjourney --cref <aube_cutout_url> --cw 75"
    },
    "prompt": "Vogue Living editorial fragrance campaign shot for 'Aubé'. An architectural modernist sunroom at sunrise. The heavy crystal bottle of Aubé rests on a low untreated limestone plinth next to sheer billowing unbleached linen drapes. Crisp morning golden-hour light casts long gentle geometric shadows across the raw silk textured ground. A subtle breath of wind, dew condensation on nearby glass, pristine stillness, awakening atmosphere, shot on 35mm film Kodak Portra 160 grain, understated niche luxury aesthetic --ar 4:5 --style raw --v 6.1",
    "negative_prompt": "messy bedroom, cluttered room, neon sunlight, plastic furniture, dark gothic mood, low quality, blurred subject"
  }
]
```

---

### 4.2 Fleur (Velvet Floral Oriental)
*Notes:* Creamy Magnolia · Velvet Rose · Pure White Musk  
*Palette:* Bone `#F1F0EB` · Petal blush `#DFD2C7` · Dawn gold

```json
[
  {
    "image_id": "pdp_fleur_01_cutout",
    "category": "cutout",
    "fragrance": "Fleur",
    "aspect_ratio": "4:5",
    "reference_image_required": true,
    "reference_image_details": {
      "path_in_repo": "public/images/perfumes/cutouts/fleur.webp",
      "purpose": "Bottle silhouette, soft pale rose juice refraction, polished champagne cap",
      "method": "Midjourney --cref <fleur_cutout_url> --cw 90"
    },
    "prompt": "Clean studio packshot of the luxury perfume flacon 'Fleur'. Ultra-clear heavy glass flacon with substantial base, luminous translucent blush-tinted fragrance liquid. Elegant brushed champagne gold cylindrical cap. Subtle textured paper label printed with 'LIGÉRO' and 'FLEUR · Extrait de Parfum · 50ml'. Centered, straight angle, resting on a porcelain off-white backdrop (#FBF8F2) with a delicate contact shadow, diffused softbox lighting revealing glass thickness and pristine edges --ar 4:5 --style raw --v 6.1",
    "negative_prompt": "bright pink perfume, plastic bottle, tilted horizon, shadows obscuring label, glitter, harsh reflections"
  },
  {
    "image_id": "pdp_fleur_02_notes_bg",
    "category": "notes_bg",
    "fragrance": "Fleur",
    "aspect_ratio": "4:5",
    "reference_image_required": false,
    "composite_instructions": "Botanical backplate for compositing 'public/images/perfumes/cutouts/fleur.webp'.",
    "prompt": "Haute parfumerie still life photograph of fresh floral raw harvest. Creamy ivory magnolia blossoms with thick velvety petals, open deep velvety rose petals showing delicate dew, resting on draped yards of natural unbleached raw silk crepe. Soft diffused atelier daylight from an open window, subtle textures of silk weaves and tender flower petals, Hasselblad H6D-100c, f/5.6, exquisite quiet elegance, timeless fine fragrance mood --ar 4:5 --style raw --v 6.1",
    "negative_prompt": "perfume bottle, artificial plastic flowers, tacky bouquet, harsh flash, oversaturated red, cartoon"
  },
  {
    "image_id": "pdp_fleur_03_aesthetic",
    "category": "aesthetic",
    "fragrance": "Fleur",
    "aspect_ratio": "4:5",
    "reference_image_required": true,
    "reference_image_details": {
      "path_in_repo": "public/images/perfumes/cutouts/fleur.webp",
      "purpose": "Maintain bottle fidelity in evocative outdoor courtyard lighting",
      "method": "Midjourney --cref <fleur_cutout_url> --cw 75"
    },
    "prompt": "Editorial campaign photograph for 'Fleur'. An ancient stone courtyard in Madurai after a gentle morning shower. The glass flacon sits quietly on a weathered pale stone ledge, reflecting rain mist and pale morning sky. Soft blurred backdrop of pale jasmine shrubs and wet terracotta arches. Serene, poetic, timeless luxury, natural muted daylight, Hasselblad medium format --ar 4:5 --style raw --v 6.1",
    "negative_prompt": "tourists, clutter, heavy rain pouring, darkness, artificial color pop, kitsch"
  }
]
```

---

### 4.3 Ambre Doux (Warm Amber Resin & Woods)
*Notes:* Radiant Saffron · Crystalline Amber · Silken Tobacco Woods  
*Palette:* Dark Tobacco `#201510` · Warm Amber `#D08C3C` · Antique Brass `#A98443`

```json
[
  {
    "image_id": "pdp_ambre_doux_01_cutout",
    "category": "cutout",
    "fragrance": "Ambre Doux",
    "aspect_ratio": "4:5",
    "reference_image_required": true,
    "reference_image_details": {
      "path_in_repo": "public/images/perfumes/cutouts/ambre-doux.webp",
      "purpose": "Cognac golden juice color and antique patinated brass cap",
      "method": "Midjourney --cref <ambre_doux_cutout_url> --cw 90"
    },
    "prompt": "Studio packshot cutout of luxury perfume bottle 'Ambre Doux'. Thick crystal flacon holding glowing deep golden-cognac honey amber liquid. Heavy antique brushed brass cylindrical cap. Uncoated cream paper label with dark espresso lettering: 'LIGÉRO' and 'AMBRE DOUX · Extrait de Parfum · 50ml'. Positioned on a warm bone neutral surface (#F1F0EB) with a warm soft falloff shadow, rim-lit to accentuate the translucent golden warmth of the oil inside --ar 4:5 --style raw --v 6.1",
    "negative_prompt": "flat brown liquid, dirty glass, cheap plastic cap, blown-out highlights, misaligned label"
  },
  {
    "image_id": "pdp_ambre_doux_02_notes_bg",
    "category": "notes_bg",
    "fragrance": "Ambre Doux",
    "aspect_ratio": "4:5",
    "reference_image_required": false,
    "composite_instructions": "Raw materials backplate for compositing 'public/images/perfumes/cutouts/ambre-doux.webp'.",
    "prompt": "Macro still life photograph of opulent perfume ingredients for 'Ambre Doux'. Deep crimson saffron threads (stigmas) scattering organically, raw natural translucent amber resin rocks glowing like polished gems in warm sunlight, cured aromatic tobacco leaves from La Rioja with rich leathery veins. Resting on a dark aged teak wood slab. Warm golden raking sunlight, chiaroscuro atmosphere, tactile natural textures, medium format depth of field --ar 4:5 --style raw --v 6.1",
    "negative_prompt": "perfume bottle, burning smoke, ash, dirty wood, low resolution, cheap amber plastic beads"
  },
  {
    "image_id": "pdp_ambre_doux_03_aesthetic",
    "category": "aesthetic",
    "fragrance": "Ambre Doux",
    "aspect_ratio": "4:5",
    "reference_image_required": true,
    "reference_image_details": {
      "path_in_repo": "public/images/perfumes/cutouts/ambre-doux.webp",
      "purpose": "Bottle silhouette in warm evening interior",
      "method": "Midjourney --cref <ambre_doux_cutout_url> --cw 75"
    },
    "prompt": "Intimate luxury editorial photograph for 'Ambre Doux'. Late afternoon in an architect's library. The perfume bottle rests on a dark walnut sideboard beside an open art monograph and an aged bronze tray. A single beam of slanted amber sunset light strikes through the bottle, projecting a warm golden pool of light onto the wood grain. Rich, quiet, sophisticated, tactile textures of leather, paper, and heavy glass --ar 4:5 --style raw --v 6.1",
    "negative_prompt": "cluttered room, messy desk, tacky whiskey glass, dark blurry noise, oversaturated orange"
  }
]
```

---

### 4.4 Noctis (Smoked Oceanic Noir & Wood)
*Notes:* Dark Plum · Smoked Papyrus · Grey Ambergris · Driftwood  
*Palette:* Noctis Smoke `#101418` · Antique Brass `#B9975B` · Basalt grey

```json
[
  {
    "image_id": "pdp_noctis_01_cutout",
    "category": "cutout",
    "fragrance": "Noctis",
    "aspect_ratio": "4:5",
    "reference_image_required": true,
    "reference_image_details": {
      "path_in_repo": "public/images/perfumes/cutouts/noctis.webp",
      "purpose": "Smoked obsidian bottle glass and deep dark juice hue",
      "method": "Midjourney --cref <noctis_cutout_url> --cw 90"
    },
    "prompt": "Precision luxury studio packshot of the nocturnal perfume flacon 'Noctis'. Substantial heavy crystal flacon with dark smoked charcoal undertones, holding deep dark amber perfume extrait. Heavy blackened antique brass cap with subtle knurled ring. Stark minimalist label with bone-white typography: 'LIGÉRO' and 'NOCTIS · Extrait de Parfum · 50ml'. Isolated on a seamless matte smoke-black ground (#1A1F24) with low-key studio edge-lighting highlighting bottle shoulders and glass contours --ar 4:5 --style raw --v 6.1",
    "negative_prompt": "pure black silhouette with no detail, scratches on glass, reflective glare blinding label, cheap plastic spray head"
  },
  {
    "image_id": "pdp_noctis_02_notes_bg",
    "category": "notes_bg",
    "fragrance": "Noctis",
    "aspect_ratio": "4:5",
    "reference_image_required": false,
    "composite_instructions": "Chiaroscuro backplate for compositing 'public/images/perfumes/cutouts/noctis.webp'.",
    "prompt": "Moody atmospheric haute parfumerie still life of dark fragrance materials. Ripe dark Damson plums sliced open revealing glistening deep violet flesh and moisture beads, chunks of raw grey ambergris with natural mineral facets, weathered coastal grey driftwood, and scrolls of dried papyrus. Arranged on a wet charcoal slate slab under directional moonlight chiaroscuro illumination, subtle silver specular highlights, mysterious nocturnal atmosphere --ar 4:5 --style raw --v 6.1",
    "negative_prompt": "perfume bottle, moldy fruit, spooky halloween props, high contrast flash, noisy darkness"
  },
  {
    "image_id": "pdp_noctis_03_aesthetic",
    "category": "aesthetic",
    "fragrance": "Noctis",
    "aspect_ratio": "4:5",
    "reference_image_required": true,
    "reference_image_details": {
      "path_in_repo": "public/images/perfumes/cutouts/noctis.webp",
      "purpose": "Exact flacon placement in chiaroscuro evening scene",
      "method": "Midjourney --cref <noctis_cutout_url> --cw 80"
    },
    "prompt": "Hauntingly elegant nocturnal fragrance campaign photograph for 'Noctis'. A minimalist brutalist bedroom in the hour past midnight. The Noctis flacon stands on a floating black volcanic stone nightstand. Cool moonlight cuts across the stone surface, catching the metallic rim of the cap. Soft deep shadows, dark charcoal textured walls, mysterious, quiet, masculine-leaning niche luxury editorial --ar 4:5 --style raw --v 6.1",
    "negative_prompt": "candle flames, tacky neon party lighting, overexposed daylight, blurry low-light noise"
  }
]
```

---

### 4.5 Blanc (Lactonic Gourmand Amber)
*Notes:* Wild Strawberry · Whipped Cream · Iris Pallida · Rich Vanilla  
*Palette:* Porcelain `#FAFAF7` · Raw Silk `#F3EDE3` · Amber drop `#9E5818`

```json
[
  {
    "image_id": "pdp_blanc_01_cutout",
    "category": "cutout",
    "fragrance": "Blanc",
    "aspect_ratio": "4:5",
    "reference_image_required": true,
    "reference_image_details": {
      "path_in_repo": "public/images/perfumes/cutouts/blanc.webp",
      "purpose": "Preserve pristine clear crystal bottle, pale champagne juice, and platinum cap",
      "method": "Midjourney --cref <blanc_cutout_url> --cw 90"
    },
    "prompt": "Ultra-clean high-fashion product packshot cutout of perfume flacon 'Blanc'. Heavy crystal flacon with razor-sharp beveled edges, filled with luminous pale opalescent champagne oil. Brushed platinum-silver cylindrical cap. Textured white cotton paper label with blind-debossed framing and graphite type: 'LIGÉRO' and 'BLANC · Extrait de Parfum · 50ml'. Set against a porcelain-white studio background (#FAFAF7) with soft ambient wraparound illumination and subtle natural ground shadow --ar 4:5 --style raw --v 6.1",
    "negative_prompt": "overexposed washed out white, yellow tint, dirty label, smudges on bottle, plastic look"
  },
  {
    "image_id": "pdp_blanc_02_notes_bg",
    "category": "notes_bg",
    "fragrance": "Blanc",
    "aspect_ratio": "4:5",
    "reference_image_required": false,
    "composite_instructions": "Backplate for compositing 'public/images/perfumes/cutouts/blanc.webp'.",
    "prompt": "Sculptural luxury still life of gourmet fragrance ingredients for 'Blanc'. Small ripe wild forest strawberries (Fragaria vesca) with delicate green stems, velvety split rich vanilla beans displaying glistening black seed paste, architectural soft wave curls of thick clotted sweet cream, and pale orris root powder dust on a honed Thassos white marble slab. Diffused morning gallery light, exquisite textural contrasts, quiet white minimalism --ar 4:5 --style raw --v 6.1",
    "negative_prompt": "perfume bottle, strawberry dessert, cake, spoon, messy splatters, cartoon food, tacky ice cream"
  },
  {
    "image_id": "pdp_blanc_03_aesthetic",
    "category": "aesthetic",
    "fragrance": "Blanc",
    "aspect_ratio": "4:5",
    "reference_image_required": true,
    "reference_image_details": {
      "path_in_repo": "public/images/perfumes/cutouts/blanc.webp",
      "purpose": "Bottle presence in Scandinavian/Zen minimalist gallery interior",
      "method": "Midjourney --cref <blanc_cutout_url> --cw 75"
    },
    "prompt": "Monochrome architectural editorial shot for 'Blanc'. A serene art gallery space with white plaster walls and pale travertine floors. The Blanc flacon rests atop a custom cylindrical bone-white ceramic plinth. High diffused northern skylight fills the frame with pure soft tones. Draped heavy white linen textile softly pooled at the base of the pedestal. Meditative, pure, timeless niche perfume editorial --ar 4:5 --style raw --v 6.1",
    "negative_prompt": "colorful background, busy modern clutter, bright artificial spotlight, clinical hospital white"
  }
]
```

---

### 4.6 Marée (Oceanic Mineral Aromatic)
*Notes:* Marine Sea Mist · Coastal Rosemary · Deep Sea Kelp · Wet Mineral Stone  
*Palette:* Sea Mist `#F0F6F9` · Marine Ink `#112530` · Sea Glass `#197293`

```json
[
  {
    "image_id": "pdp_maree_01_cutout",
    "category": "cutout",
    "fragrance": "Marée",
    "aspect_ratio": "4:5",
    "reference_image_required": true,
    "reference_image_details": {
      "path_in_repo": "public/images/perfumes/cutouts/maree.webp",
      "purpose": "Ensure aquamarine sea-mist juice tint and satin-nickel cap consistency",
      "method": "Midjourney --cref <maree_cutout_url> --cw 90"
    },
    "prompt": "E-commerce packshot cutout of luxury aquatic perfume bottle 'Marée'. Clear heavy crystal flacon holding pale seafoam-blue translucent perfume extrait. Cylindrical brushed satin-nickel cap with subtle metallic texture. Textured matte off-white label with crisp deep marine ink type: 'LIGÉRO' and 'MARÉE · Extrait de Parfum · 50ml'. Centered, isolated on a pale coastal sea-mist surface (#F0F6F9) with soft natural contact shadow, crisp reflections revealing glass weight --ar 4:5 --style raw --v 6.1",
    "negative_prompt": "bright turquoise chemical color, swimming pool blue, tilted flacon, heavy vignette, fingerprints"
  },
  {
    "image_id": "pdp_maree_02_notes_bg",
    "category": "notes_bg",
    "fragrance": "Marée",
    "aspect_ratio": "4:5",
    "reference_image_required": false,
    "composite_instructions": "Oceanic backplate for compositing 'public/images/perfumes/cutouts/maree.webp'.",
    "prompt": "Raw coastal haute parfumerie ingredients still life for 'Marée'. Wet dark ocean-smoothed granite stones, aromatic fresh sprigs of wild green coastal rosemary dotted with tiny pale blue blossoms, dark glistening deep sea kelp fronds, and weathered sea-salt encrusted driftwood. Microscopic sea spray droplets suspended in air, crisp northern maritime morning light, cool coastal color palette, tactile oceanic depth --ar 4:5 --style raw --v 6.1",
    "negative_prompt": "perfume bottle, sandy tropical beach, starfish, seashells kitsch, palm trees, sunny Caribbean holiday look"
  },
  {
    "image_id": "pdp_maree_03_aesthetic",
    "category": "aesthetic",
    "fragrance": "Marée",
    "aspect_ratio": "4:5",
    "reference_image_required": true,
    "reference_image_details": {
      "path_in_repo": "public/images/perfumes/cutouts/maree.webp",
      "purpose": "Bottle integration on wild ocean coastline",
      "method": "Midjourney --cref <maree_cutout_url> --cw 80"
    },
    "prompt": "Atmospheric fine fragrance campaign photograph for 'Marée'. Shot on windswept rocky coastal shores at low tide. The Marée perfume flacon stands securely on a massive flat wet granite boulder with dramatic sea foam and cold ocean waves breaking softly in the deep misty background. Overcast maritime morning light, fine sea fog, wild, majestic, elemental luxury editorial --ar 4:5 --style raw --v 6.1",
    "negative_prompt": "tropical resort, blue sunny sky, tourists, waves knocking over bottle, low contrast gray mush"
  }
]
```

---

### 4.7 Noir Cacao (Amber Gourmand Woody)
*Notes:* 85% Dark Chocolate · Roasted Cacao · Toasted Coconut · Rich Vanilla  
*Palette:* Cocoa brown `#241812` · Molten amber `#8B4513` · Raw bronze `#785127`

```json
[
  {
    "image_id": "pdp_noir_cacao_01_cutout",
    "category": "cutout",
    "fragrance": "Noir Cacao",
    "aspect_ratio": "4:5",
    "reference_image_required": true,
    "reference_image_details": {
      "path_in_repo": "public/images/perfumes/cutouts/noir-cacao.webp",
      "purpose": "Preserve rich dark cocoa-amber juice color and patinated bronze cap",
      "method": "Midjourney --cref <noir_cacao_cutout_url> --cw 90"
    },
    "prompt": "High-end product packshot cutout of perfume flacon 'Noir Cacao'. Heavy crystal glass flacon filled with deep, rich reddish-brown dark cocoa perfume oil. Solid cylindrical patinated dark bronze cap. Textured espresso-tinted paper label with debossed warm gold foil lettering: 'LIGÉRO' and 'NOIR CACAO · Extrait de Parfum · 50ml'. Resting centered on a warm charcoal surface (#1F1916), dramatic side rim lighting accentuating the glass edges and deep liquid amber tones --ar 4:5 --style raw --v 6.1",
    "negative_prompt": "muddy brown blob, illegible gold label, glossy plastic bottle, cheap perfume look, scratched glass"
  },
  {
    "image_id": "pdp_noir_cacao_02_notes_bg",
    "category": "notes_bg",
    "fragrance": "Noir Cacao",
    "aspect_ratio": "4:5",
    "reference_image_required": false,
    "composite_instructions": "Dark gourmand backplate for compositing 'public/images/perfumes/cutouts/noir-cacao.webp'.",
    "prompt": "Decadent haute parfumerie still life of raw gourmand ingredients for 'Noir Cacao'. Hand-snapped jagged slabs of 85% dark artisan chocolate showing matte interior crystallisation, raw roasted whole cacao beans tumbling across dark volcanic slate, toasted shredded coconut husk fibers, and split oily rich vanilla pods. Moody studio chiaroscuro lighting, rich chocolate dust particles, warm amber shadows, tactile sensory depth --ar 4:5 --style raw --v 6.1",
    "negative_prompt": "perfume bottle, sweet candy bar, sugary dessert, chocolate syrup puddle, cartoon, bright high-key lighting"
  },
  {
    "image_id": "pdp_noir_cacao_03_aesthetic",
    "category": "aesthetic",
    "fragrance": "Noir Cacao",
    "aspect_ratio": "4:5",
    "reference_image_required": true,
    "reference_image_details": {
      "path_in_repo": "public/images/perfumes/cutouts/noir-cacao.webp",
      "purpose": "Bottle consistency within intimate after-dark lounge setting",
      "method": "Midjourney --cref <noir_cacao_cutout_url> --cw 75"
    },
    "prompt": "Sophisticated evening fragrance editorial for 'Noir Cacao'. The last hour of an intimate private gathering. The perfume flacon rests on a dark ribbed mahogany console next to a heavy crystal paperweight. Low warm incandescent tungsten lamp glow catches the liquid depths of the bottle. Deep velvety shadows, subtle cigar leaf aroma ambiance, quiet seductive after-hours atmosphere, 35mm cinematographic quality --ar 4:5 --style raw --v 6.1",
    "negative_prompt": "bright party scene, neon club lights, crowded room, blurry noisy photo, oversaturated reds"
  }
]
```

---

## 5. Strategic Additions to the Gallery (Suggestions)

To maximize conversion and build consumer confidence for a ₹1,099–₹1,599 niche fragrance house, we strongly recommend adding these **four specific image types** into the PDP gallery carousel:

| Suggested Image Type | Strategic Purpose | Visual Execution |
| :--- | :--- | :--- |
| **A. Scale & Ergonomics (In-Hand)** | Eliminates size hesitation; proves the 50ml flacon feels substantial, weighty, and ergonomic. | Manicured hand/cuff gracefully holding the flacon against raw linen. |
| **B. Macro Craftsmanship (Cap & Atomizer)** | Proves haute-parfumerie build quality: knurled metal, tight cap seams, laser-etched nozzle. | Extreme 100mm macro shot of the collar, nozzle, and embossed crest. |
| **C. Application Ritual (Fine Mist)** | Evokes sensory pleasure; demonstrates micro-diffusion atomizer (no wet jets). | Directional beam of sunlight illuminating an ultra-fine aerosol mist cloud. |
| **D. Flat Lay Ecosystem (Vials & Correspondence)** | Contextualizes the maison; reinforces unboxing, batch rest certificate, and Discovery Set. | Overhead art-directed flat lay with envelope, cotton ribbon, and tasting card. |

---

### 5.1 In-Hand / Scale Reference (Tactile Shot)

```json
{
  "image_id": "pdp_suggested_scale_in_hand",
  "category": "suggested_scale",
  "target_product": "adaptable_per_fragrance",
  "aspect_ratio": "4:5",
  "generator_target": "Midjourney v6.1 / Flux.1 Inpainting",
  "reference_image_required": true,
  "reference_image_details": {
    "path_in_repo": "public/images/perfumes/cutouts/[slug].webp",
    "purpose": "Bottle dimensions and proportion relative to hand",
    "technique": "Inpainting or ControlNet OpenPose + Product Reference"
  },
  "prompt": "Editorial close-up of an elegant, well-groomed hand gently holding the 50ml glass flacon of luxury perfume 'Ligéro' at chest level. The wearer is dressed in an unbleached raw silk tailored cuff (#F3EDE3). The flacon's heavy crystal base and brushed metallic cap rest naturally in the palm, highlighting the tactile weight and human scale of the bottle. Soft daylight from the side, clean neutral architectural background, soft focus on fingers, ultra-sharp glass refractions --ar 4:5 --style raw --v 6.1",
  "negative_prompt": "deformed hands, extra fingers, plastic nails, ugly skin texture, blurry bottle, oversized bottle, cartoonish hands"
}
```

---

### 5.2 Macro Detail: Cap, Collar & Atomizer Nozzle

```json
{
  "image_id": "pdp_suggested_macro_atomizer",
  "category": "suggested_macro_detail",
  "target_product": "all_perfumes",
  "aspect_ratio": "4:5",
  "generator_target": "Midjourney v6.1 / Flux.1 Pro",
  "reference_image_required": true,
  "reference_image_details": {
    "recommended_file": "Slanted LIGÉRO Amber Perfume Bottle.png",
    "purpose": "Lock knurled metal texture and clean cylinder cap bevel",
    "midjourney_flags": "--cref <bottle_url> --cw 95"
  },
  "prompt": "Extreme macro commercial packshot of the atomizer collar and magnetic cap of a 'LIGÉRO' perfume bottle. 100mm macro lens focus on the hairline seam between the heavy brushed champagne metal cap and the precision-machined atomizer collar. Tiny micro-droplets on the polished nozzle ring. Fine laser-etched serif lettering reading 'LIGÉRO' visible on the metal bevel. Soft studio reflection on the metallic curve, dark velvet background falloff, exceptional tactile precision, mechanical luxury craftsmanship --ar 4:5 --style raw --v 6.1",
  "negative_prompt": "plastic crimping, cheap spray pump, chipped paint, blurry focus, dust on lens, misaligned metal"
}
```

---

### 5.3 Application Ritual: Fine Mist in Sunlight

```json
{
  "image_id": "pdp_suggested_mist_ritual",
  "category": "suggested_spray_mist",
  "target_product": "adaptable_per_fragrance",
  "aspect_ratio": "4:5",
  "generator_target": "Midjourney v6.1 / Flux.1 Pro",
  "reference_image_required": true,
  "reference_image_details": {
    "path_in_repo": "Perfume Mist Against Soft Skin.png",
    "purpose": "Match existing hero spray mist physics and feathering",
    "midjourney_flags": "--sref <mist_image_url> --sw 180"
  },
  "prompt": "Haute parfumerie high-speed motion photograph of the application ritual. A luxury perfume flacon seen in profile. As the atomizer is depressed, an ultra-fine, microscopic aerosol plume of fragrant mist blossoms into the air, backlit by a crisp directional shaft of warm morning sunlight. Millions of micro-droplets catch the beam like suspended diamond dust against a dark raw silk shadow background. Elegant, ethereal, frozen in 1/8000s shutter speed, poetry of scent in motion --ar 4:5 --style raw --v 6.1",
  "negative_prompt": "thick water jet, clumsy spray, steam, smoke vapor, messy splashes, foggy image, blurred bottle"
}
```

---

### 5.4 The Complete Presentation Flat Lay (Ecosystem Shot)

```json
{
  "image_id": "pdp_suggested_flatlay_ecosystem",
  "category": "suggested_flatlay",
  "target_product": "all_perfumes",
  "aspect_ratio": "4:5",
  "generator_target": "Midjourney v6.1 / Flux.1 Pro",
  "reference_image_required": true,
  "reference_image_details": {
    "path_in_repo": "public/images/perfumes/tray.jpeg",
    "purpose": "Porcelain tray and raw silk fabric arrangement style",
    "midjourney_flags": "--sref <tray_url> --sw 120"
  },
  "prompt": "Overhead top-down 45-degree flat lay editorial still life. Centered on a warm bone-white ceramic tray is the 50ml 'LIGÉRO' perfume flacon. Beside it lies the unboxed luxury rigid paper presentation box, a folded unbleached cotton paper correspondence note bearing 'Extrait de Parfum' in letterpress, a single glass sample vial from the Discovery Set, and an unbleached raw silk ribbon. Clean directional studio daylight casting crisp diagonal shadows across an off-white plaster surface. Pristine, restrained, artisanal haute parfumerie aesthetic --ar 4:5 --style raw --v 6.1",
  "negative_prompt": "cluttered mess, flowers everywhere, colorful props, plastic bubble wrap, cheap cards, distorted text"
}
```

---

## 6. Recommended Next Steps for Production Pipeline

1. **Generation:** Copy the JSON prompt strings directly into your generation engine (Midjourney v6.1 with `--style raw` is recommended for packshot realism, or Flux.1 Pro for typography adherence).
2. **Post-Processing Cutouts:** Run `python3 scripts/generate-cutouts.py` to auto-normalize any newly generated cutouts to the standard `840x1420` canvas height used by `components/product-gallery.tsx`.
3. **Updating Sanity & Catalog:** Add the newly generated image files to `public/images/perfumes/` and run `npx tsx scripts/migrate-to-sanity.ts` to sync with your headless CMS.

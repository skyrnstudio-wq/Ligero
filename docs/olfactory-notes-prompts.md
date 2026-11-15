# Ligéro Parfum — Olfactory Notes Generation Prompts

> **Context & Why Notes Images Were Repeated:**  
> Previously, the repository contained only one composite harvest still life per fragrance (`/images/perfumes/notes/${slug}.webp`). The PDP middle band ("Three-Tier Olfactory Architecture" in `components/product-scent-architecture.tsx`) renders three distinct cards—**Top (Head)**, **Heart (Mid)**, and **Base (Anchor)**. Without dedicated photography for each layer, the component fell back to repeating that single composite image across all three cards.
>
> This specification defines **21 dedicated macro botanical still life photographs** (3 notes × 7 fragrances) formatted as one-paragraph JSON prompts, ready for Midjourney v6.1, Flux.1 Pro, or Google ImageFX.

---

## 1. Production Specifications

- **Aspect Ratio:** `3:4` (matches `aspect-[3/4]` portrait plate in `ProductScentArchitecture`)
- **Target Folder:** `public/images/perfumes/notes/`
- **Recommended File Format:** `.webp` (or `.jpg` converted to `.webp`)
- **Visual Direction:** Hasselblad H6D-100c medium format macro still life, 120mm macro lens, $f/4.0$, soft directional studio morning daylight, tactile natural surfaces (raw silk, linen, limestone, travertine, slate), zero clutter, zero artificial fixatives.

---

## 2. The 21 One-Paragraph JSON Prompts

### 1. Aubé (Crisp Green Aquatic)

#### 1.1 Top Note — Wild Mountain Mint (`aube-top.webp`)
```json
{"filename": "aube-top.webp", "perfume": "aube", "tier": "top", "note": "Wild Mountain Mint", "aspect_ratio": "3:4", "prompt": "Editorial macro still life photograph of fresh crisp wild mountain mint leaves glistening with crystal-clear morning dew drops, resting on an off-white raw textured linen canvas. Soft morning sunlight casting subtle gentle shadows. Restrained minimalist luxury haute parfumerie aesthetic, Hasselblad medium format detail --ar 3:4 --style raw --v 6.1", "negative_prompt": "blurry, oversaturated neon, artificial gloss, plastic, text, watermark, cartoon"}
```

#### 1.2 Heart Note — Dewy Water Jasmine (`aube-mid.webp`)
```json
{"filename": "aube-mid.webp", "perfume": "aube", "tier": "heart", "note": "Dewy Water Jasmine", "aspect_ratio": "3:4", "prompt": "Editorial macro still life photograph of pristine white water jasmine blossoms with delicate velvety petals floating on a shallow pool of clear water with gentle ripples. Calm ethereal morning dawn light, pristine luxury perfume visual style, Hasselblad detail --ar 3:4 --style raw --v 6.1", "negative_prompt": "murky water, colorful flowers, artificial glitter, distorted petals, text, watermark"}
```

#### 1.3 Base Note — Green Himalayan Cedar (`aube-base.webp`)
```json
{"filename": "aube-base.webp", "perfume": "aube", "tier": "base", "note": "Green Himalayan Cedarwood", "aspect_ratio": "3:4", "prompt": "Editorial still life photograph of a freshly carved block of green Himalayan cedarwood showing fine fragrant wood grain and delicate natural cedar shavings resting on pale grey limestone. Warm studio architectural lighting, minimalist artisanal luxury aesthetic --ar 3:4 --style raw --v 6.1", "negative_prompt": "rough splintered wood, dirty floor, plastic shavings, harsh flash, text, watermark"}
```

---

### 2. Fleur (Velvet Floral Oriental)

#### 2.1 Top Note — White Star Magnolia (`fleur-top.webp`)
```json
{"filename": "fleur-top.webp", "perfume": "fleur", "tier": "top", "note": "White Star Magnolia", "aspect_ratio": "3:4", "prompt": "Editorial macro photograph of a luminous white star magnolia blossom with waxy cream-colored petals and subtle green citrus undertones, resting on a warm bone-white travertine surface. Soft morning side lighting highlighting petal texture, French haute parfumerie aesthetic --ar 3:4 --style raw --v 6.1", "negative_prompt": "brown edges, wilted petals, artificial saturation, plastic props, text, watermark"}
```

#### 2.2 Heart Note — Velvet Damascena Rose (`fleur-mid.webp`)
```json
{"filename": "fleur-mid.webp", "perfume": "fleur", "tier": "heart", "note": "Velvet Rose Absolute", "aspect_ratio": "3:4", "prompt": "Editorial macro still life photograph of deep crimson velvet Damascena rose petals dusted with microscopic morning dew drops, resting on hand-troweled off-white plaster. Tactile richness, sensual romantic luxury perfume imagery, Hasselblad medium format --ar 3:4 --style raw --v 6.1", "negative_prompt": "neon pink, cartoon, thorns, cluttered background, fake glitter, text, watermark"}
```

#### 2.3 Base Note — Botanical Velvet Musk (`fleur-base.webp`)
```json
{"filename": "fleur-base.webp", "perfume": "fleur", "tier": "base", "note": "Silken Botanical Musk", "aspect_ratio": "3:4", "prompt": "Editorial tactile still life photograph of natural ambrette musk seeds nestled inside the delicate folds of unbleached raw ivory cashmere and silken linen fabric. Warm, intimate, skin-soft tactile lighting, clean artisanal luxury aesthetic --ar 3:4 --style raw --v 6.1", "negative_prompt": "animal fur, coarse burlap, dark gloomy lighting, synthetic polyester, text, watermark"}
```

---

### 3. Ambre Doux (Warm Amber Resin & Woods)

#### 3.1 Top Note — Radiant Saffron Stigmas (`ambre-doux-top.webp`)
```json
{"filename": "ambre-doux-top.webp", "perfume": "ambre-doux", "tier": "top", "note": "Radiant Saffron Threads", "aspect_ratio": "3:4", "prompt": "Editorial macro photograph of precious regal crimson saffron stigmas with golden-amber tips, carefully arranged on a warm rough-cut sandstone block. Raking low-angle golden hour sunlight making the saffron filaments glow with fiery intensity --ar 3:4 --style raw --v 6.1", "negative_prompt": "crushed powder, cheap spice jar, messy pile, artificial food coloring, text, watermark"}
```

#### 3.2 Heart Note — Crystalline Amber Resin (`ambre-doux-mid.webp`)
```json
{"filename": "ambre-doux-mid.webp", "perfume": "ambre-doux", "tier": "heart", "note": "Crystalline Amber Resin", "aspect_ratio": "3:4", "prompt": "Editorial macro still life photograph of a raw translucent fossilized golden amber resin stone glowing from within with warm honeyed light, resting on aged pale travertine. Sharp micro-facets, internal warm inclusions, opulent haute parfumerie visual --ar 3:4 --style raw --v 6.1", "negative_prompt": "plastic bead, epoxy toy, blurry refraction, flat lighting, text, watermark"}
```

#### 3.3 Base Note — Polished Blonde Cedar & Sandalwood (`ambre-doux-base.webp`)
```json
{"filename": "ambre-doux-base.webp", "perfume": "ambre-doux", "tier": "base", "note": "Polished Silken Woods", "aspect_ratio": "3:4", "prompt": "Editorial architectural still life of a smooth sanded block of pale blonde cedar and creamy sandalwood showing fine undulating wood grain, surrounded by subtle aromatic wooden curls on a neutral stone slab. Serene, warm studio light --ar 3:4 --style raw --v 6.1", "negative_prompt": "splinters, rustic barnwood, dark charred wood, messy workshop, text, watermark"}
```

---

### 4. Noctis (Smoked Oceanic Noir & Wood)

#### 4.1 Top Note — Dark Damson Plum (`noctis-top.webp`)
```json
{"filename": "noctis-top.webp", "perfume": "noctis", "tier": "top", "note": "Damson Black Plum", "aspect_ratio": "3:4", "prompt": "Editorial macro photograph of a ripe deep purple-black Damson plum sliced open to reveal glistening rich dark amber-violet fruit flesh, resting on dark charcoal slate with scattered cracked black peppercorns. Moody chiaroscuro studio lighting --ar 3:4 --style raw --v 6.1", "negative_prompt": "rotten fruit, messy juice pool, cartoon fruit, bright cheerful lighting, text, watermark"}
```

#### 4.2 Heart Note — Coastal Grey Ambergris (`noctis-mid.webp`)
```json
{"filename": "noctis-mid.webp", "perfume": "noctis", "tier": "heart", "note": "Coastal Grey Amber", "aspect_ratio": "3:4", "prompt": "Editorial macro still life photograph of a weathered piece of natural grey oceanic ambergris showing saline mineral textures and silver-grey marbling, resting on wet dark basalt rock. Moody ocean-side diffused daylight, austere luxury perfume art --ar 3:4 --style raw --v 6.1", "negative_prompt": "plastic lump, moldy bread, bright colors, cluttered seashells, text, watermark"}
```

#### 4.3 Base Note — Sunken Coastal Driftwood (`noctis-base.webp`)
```json
{"filename": "noctis-base.webp", "perfume": "noctis", "tier": "base", "note": "Weathered Coastal Driftwood", "aspect_ratio": "3:4", "prompt": "Editorial macro photograph of sea-salt encrusted, mineral-bleached dark weathered coastal driftwood with deep linear grain and charcoal undertones, resting on damp grey volcanic sand. Atmospheric coastal mist, quiet luxury aesthetic --ar 3:4 --style raw --v 6.1", "negative_prompt": "green moss, rotting seaweed, brightly colored beach toys, messy junk, text, watermark"}
```

---

### 5. Blanc (Lactonic Gourmand Amber)

#### 5.1 Top Note — Wild Alpine Strawberries (`blanc-top.webp`)
```json
{"filename": "blanc-top.webp", "perfume": "blanc", "tier": "top", "note": "Wild Alpine Strawberry", "aspect_ratio": "3:4", "prompt": "Editorial macro still life photograph of three miniature wild red alpine strawberries with tiny fresh green calyxes, resting on off-white raw textured linen. Soft morning daylight accentuating glistening seed textures and vivid natural red hue --ar 3:4 --style raw --v 6.1", "negative_prompt": "large supermarket strawberries, artificial red syrup, plastic, messy stains, text, watermark"}
```

#### 5.2 Heart Note — Whipped Clotted Cream Accord (`blanc-mid.webp`)
```json
{"filename": "blanc-mid.webp", "perfume": "blanc", "tier": "heart", "note": "Whipped Cream Accord", "aspect_ratio": "3:4", "prompt": "Editorial macro photograph of velvety, sculptural folds of rich whipped clotted cream with delicate soft peaks, presented on a minimalist matte bone-white ceramic plate. Pristine, creamy lactonic luxury aesthetic with luminous soft-box lighting --ar 3:4 --style raw --v 6.1", "negative_prompt": "yellow curdled cream, aerosol spray cream, messy splatters, colored sprinkles, text, watermark"}
```

#### 5.3 Base Note — Bourbon Vanilla Orchid Pods (`blanc-base.webp`)
```json
{"filename": "blanc-base.webp", "perfume": "blanc", "tier": "base", "note": "Aged Vanilla Beans", "aspect_ratio": "3:4", "prompt": "Editorial macro still life photograph of plump, glossy dark Bourbon vanilla bean pods, one delicately split lengthwise revealing glistening dark vanilla caviar seeds, resting on pale warm limestone. Rich resinous gourmand luxury texture --ar 3:4 --style raw --v 6.1", "negative_prompt": "dry brittle sticks, artificial extract bottle, dusty, harsh shadow, text, watermark"}
```

---

### 6. Marée (Oceanic Mineral Aromatic)

#### 6.1 Top Note — Wild Coastal Rosemary (`maree-top.webp`)
```json
{"filename": "maree-top.webp", "perfume": "maree", "tier": "top", "note": "Wild Coastal Rosemary", "aspect_ratio": "3:4", "prompt": "Editorial macro still life photograph of a fresh, aromatic needle-leaved coastal rosemary branch dusted with fine white sea salt crystals, resting on weathered grey sandstone. Bright Mediterranean ocean breeze daylight, crisp aromatic clarity --ar 3:4 --style raw --v 6.1", "negative_prompt": "dried cooking herbs, kitchen cutting board, withered yellow needles, blurry focus, text, watermark"}
```

#### 6.2 Heart Note — Marine Tide & Mineral Sea Spray (`maree-mid.webp`)
```json
{"filename": "maree-mid.webp", "perfume": "maree", "tier": "heart", "note": "Oceanic Marine Accord", "aspect_ratio": "3:4", "prompt": "Editorial macro photograph of effervescent oceanic sea spray and delicate crystalline sea salt crust forming on dark wet tidepool rock. Crisp, clean saline mineral water droplets catching bright morning ocean sunlight --ar 3:4 --style raw --v 6.1", "negative_prompt": "murky brown water, dead fish, plastic beach trash, green algae slime, text, watermark"}
```

#### 6.3 Base Note — Earthy Wild Vetiver Roots (`maree-base.webp`)
```json
{"filename": "maree-base.webp", "perfume": "maree", "tier": "base", "note": "Smoky Wild Vetiver", "aspect_ratio": "3:4", "prompt": "Editorial tactile photograph of fragrant, earthy dried vetiver root bundle tied with natural raw unbleached linen cord, resting on a block of sun-bleached driftwood. Grounded smoky mineral sophistication, quiet luxury still life --ar 3:4 --style raw --v 6.1", "negative_prompt": "messy garden dirt, weeds, compost pile, plastic string, harsh contrast, text, watermark"}
```

---

### 7. Noir Cacao (Amber Gourmand Woody)

#### 7.1 Top Note — Spiced Bergamot & Cardamom (`noir-cacao-top.webp`)
```json
{"filename": "noir-cacao-top.webp", "perfume": "noir-cacao", "tier": "top", "note": "Spiced Bergamot & Cardamom", "aspect_ratio": "3:4", "prompt": "Editorial macro photograph of a fresh whole bitter green-gold bergamot fruit beside cracked green cardamom pods displaying intensely aromatic dark seeds, resting on dark charcoal slate. Dramatic moody studio lighting with golden highlights --ar 3:4 --style raw --v 6.1", "negative_prompt": "bruised rotten fruit, ground curry powder, messy kitchen counter, harsh flash, text, watermark"}
```

#### 7.2 Heart Note — Raw 85% Cacao Absolute (`noir-cacao-mid.webp`)
```json
{"filename": "noir-cacao-mid.webp", "perfume": "noir-cacao", "tier": "heart", "note": "Raw Cacao Absolute", "aspect_ratio": "3:4", "prompt": "Editorial macro still life photograph of fractured raw 85% bittersweet roasted cacao beans and dark artisanal cacao nibs, showing rich earthy matte chocolate textures on rough dark basalt stone. Dark, sophisticated, aristocratic gourmand --ar 3:4 --style raw --v 6.1", "negative_prompt": "sweet milk chocolate bars, candy wrappers, sugary frosting, artificial gloss, text, watermark"}
```

#### 7.3 Base Note — Smoked Dark Patchouli & Sandalwood (`noir-cacao-base.webp`)
```json
{"filename": "noir-cacao-base.webp", "perfume": "noir-cacao", "tier": "base", "note": "Aged Patchouli & Sandalwood", "aspect_ratio": "3:4", "prompt": "Editorial still life photograph of velvety aged dark patchouli leaves resting against a smooth block of smoked dark sandalwood showing delicate aromatic grain on aged dark slate. Warm, enigmatic, after-dark luxury ambiance --ar 3:4 --style raw --v 6.1", "negative_prompt": "dead dried dry leaves, campfire ash, messy dirt, blurry, text, watermark"}
```

---

## 3. Master JSON Array (All 21 Prompts in One Object)

Copy-paste this array directly into an automated generation script or pipeline:

```json
[
  {"filename": "aube-top.webp", "perfume": "aube", "tier": "top", "note": "Wild Mountain Mint", "aspect_ratio": "3:4", "prompt": "Editorial macro still life photograph of fresh crisp wild mountain mint leaves glistening with crystal-clear morning dew drops, resting on an off-white raw textured linen canvas. Soft morning sunlight casting subtle gentle shadows. Restrained minimalist luxury haute parfumerie aesthetic, Hasselblad medium format detail --ar 3:4 --style raw --v 6.1", "negative_prompt": "blurry, oversaturated neon, artificial gloss, plastic, text, watermark, cartoon"},
  {"filename": "aube-mid.webp", "perfume": "aube", "tier": "heart", "note": "Dewy Water Jasmine", "aspect_ratio": "3:4", "prompt": "Editorial macro still life photograph of pristine white water jasmine blossoms with delicate velvety petals floating on a shallow pool of clear water with gentle ripples. Calm ethereal morning dawn light, pristine luxury perfume visual style, Hasselblad detail --ar 3:4 --style raw --v 6.1", "negative_prompt": "murky water, colorful flowers, artificial glitter, distorted petals, text, watermark"},
  {"filename": "aube-base.webp", "perfume": "aube", "tier": "base", "note": "Green Himalayan Cedarwood", "aspect_ratio": "3:4", "prompt": "Editorial still life photograph of a freshly carved block of green Himalayan cedarwood showing fine fragrant wood grain and delicate natural cedar shavings resting on pale grey limestone. Warm studio architectural lighting, minimalist artisanal luxury aesthetic --ar 3:4 --style raw --v 6.1", "negative_prompt": "rough splintered wood, dirty floor, plastic shavings, harsh flash, text, watermark"},
  {"filename": "fleur-top.webp", "perfume": "fleur", "tier": "top", "note": "White Star Magnolia", "aspect_ratio": "3:4", "prompt": "Editorial macro photograph of a luminous white star magnolia blossom with waxy cream-colored petals and subtle green citrus undertones, resting on a warm bone-white travertine surface. Soft morning side lighting highlighting petal texture, French haute parfumerie aesthetic --ar 3:4 --style raw --v 6.1", "negative_prompt": "brown edges, wilted petals, artificial saturation, plastic props, text, watermark"},
  {"filename": "fleur-mid.webp", "perfume": "fleur", "tier": "heart", "note": "Velvet Rose Absolute", "aspect_ratio": "3:4", "prompt": "Editorial macro still life photograph of deep crimson velvet Damascena rose petals dusted with microscopic morning dew drops, resting on hand-troweled off-white plaster. Tactile richness, sensual romantic luxury perfume imagery, Hasselblad medium format --ar 3:4 --style raw --v 6.1", "negative_prompt": "neon pink, cartoon, thorns, cluttered background, fake glitter, text, watermark"},
  {"filename": "fleur-base.webp", "perfume": "fleur", "tier": "base", "note": "Silken Botanical Musk", "aspect_ratio": "3:4", "prompt": "Editorial tactile still life photograph of natural ambrette musk seeds nestled inside the delicate folds of unbleached raw ivory cashmere and silken linen fabric. Warm, intimate, skin-soft tactile lighting, clean artisanal luxury aesthetic --ar 3:4 --style raw --v 6.1", "negative_prompt": "animal fur, coarse burlap, dark gloomy lighting, synthetic polyester, text, watermark"},
  {"filename": "ambre-doux-top.webp", "perfume": "ambre-doux", "tier": "top", "note": "Radiant Saffron Threads", "aspect_ratio": "3:4", "prompt": "Editorial macro photograph of precious regal crimson saffron stigmas with golden-amber tips, carefully arranged on a warm rough-cut sandstone block. Raking low-angle golden hour sunlight making the saffron filaments glow with fiery intensity --ar 3:4 --style raw --v 6.1", "negative_prompt": "crushed powder, cheap spice jar, messy pile, artificial food coloring, text, watermark"},
  {"filename": "ambre-doux-mid.webp", "perfume": "ambre-doux", "tier": "heart", "note": "Crystalline Amber Resin", "aspect_ratio": "3:4", "prompt": "Editorial macro still life photograph of a raw translucent fossilized golden amber resin stone glowing from within with warm honeyed light, resting on aged pale travertine. Sharp micro-facets, internal warm inclusions, opulent haute parfumerie visual --ar 3:4 --style raw --v 6.1", "negative_prompt": "plastic bead, epoxy toy, blurry refraction, flat lighting, text, watermark"},
  {"filename": "ambre-doux-base.webp", "perfume": "ambre-doux", "tier": "base", "note": "Polished Silken Woods", "aspect_ratio": "3:4", "prompt": "Editorial architectural still life of a smooth sanded block of pale blonde cedar and creamy sandalwood showing fine undulating wood grain, surrounded by subtle aromatic wooden curls on a neutral stone slab. Serene, warm studio light --ar 3:4 --style raw --v 6.1", "negative_prompt": "splinters, rustic barnwood, dark charred wood, messy workshop, text, watermark"},
  {"filename": "noctis-top.webp", "perfume": "noctis", "tier": "top", "note": "Damson Black Plum", "aspect_ratio": "3:4", "prompt": "Editorial macro photograph of a ripe deep purple-black Damson plum sliced open to reveal glistening rich dark amber-violet fruit flesh, resting on dark charcoal slate with scattered cracked black peppercorns. Moody chiaroscuro studio lighting --ar 3:4 --style raw --v 6.1", "negative_prompt": "rotten fruit, messy juice pool, cartoon fruit, bright cheerful lighting, text, watermark"},
  {"filename": "noctis-mid.webp", "perfume": "noctis", "tier": "heart", "note": "Coastal Grey Amber", "aspect_ratio": "3:4", "prompt": "Editorial macro still life photograph of a weathered piece of natural grey oceanic ambergris showing saline mineral textures and silver-grey marbling, resting on wet dark basalt rock. Moody ocean-side diffused daylight, austere luxury perfume art --ar 3:4 --style raw --v 6.1", "negative_prompt": "plastic lump, moldy bread, bright colors, cluttered seashells, text, watermark"},
  {"filename": "noctis-base.webp", "perfume": "noctis", "tier": "base", "note": "Weathered Coastal Driftwood", "aspect_ratio": "3:4", "prompt": "Editorial macro photograph of sea-salt encrusted, mineral-bleached dark weathered coastal driftwood with deep linear grain and charcoal undertones, resting on damp grey volcanic sand. Atmospheric coastal mist, quiet luxury aesthetic --ar 3:4 --style raw --v 6.1", "negative_prompt": "green moss, rotting seaweed, brightly colored beach toys, messy junk, text, watermark"},
  {"filename": "blanc-top.webp", "perfume": "blanc", "tier": "top", "note": "Wild Alpine Strawberry", "aspect_ratio": "3:4", "prompt": "Editorial macro still life photograph of three miniature wild red alpine strawberries with tiny fresh green calyxes, resting on off-white raw textured linen. Soft morning daylight accentuating glistening seed textures and vivid natural red hue --ar 3:4 --style raw --v 6.1", "negative_prompt": "large supermarket strawberries, artificial red syrup, plastic, messy stains, text, watermark"},
  {"filename": "blanc-mid.webp", "perfume": "blanc", "tier": "heart", "note": "Whipped Cream Accord", "aspect_ratio": "3:4", "prompt": "Editorial macro photograph of velvety, sculptural folds of rich whipped clotted cream with delicate soft peaks, presented on a minimalist matte bone-white ceramic plate. Pristine, creamy lactonic luxury aesthetic with luminous soft-box lighting --ar 3:4 --style raw --v 6.1", "negative_prompt": "yellow curdled cream, aerosol spray cream, messy splatters, colored sprinkles, text, watermark"},
  {"filename": "blanc-base.webp", "perfume": "blanc", "tier": "base", "note": "Aged Vanilla Beans", "aspect_ratio": "3:4", "prompt": "Editorial macro still life photograph of plump, glossy dark Bourbon vanilla bean pods, one delicately split lengthwise revealing glistening dark vanilla caviar seeds, resting on pale warm limestone. Rich resinous gourmand luxury texture --ar 3:4 --style raw --v 6.1", "negative_prompt": "dry brittle sticks, artificial extract bottle, dusty, harsh shadow, text, watermark"},
  {"filename": "maree-top.webp", "perfume": "maree", "tier": "top", "note": "Wild Coastal Rosemary", "aspect_ratio": "3:4", "prompt": "Editorial macro still life photograph of a fresh, aromatic needle-leaved coastal rosemary branch dusted with fine white sea salt crystals, resting on weathered grey sandstone. Bright Mediterranean ocean breeze daylight, crisp aromatic clarity --ar 3:4 --style raw --v 6.1", "negative_prompt": "dried cooking herbs, kitchen cutting board, withered yellow needles, blurry focus, text, watermark"},
  {"filename": "maree-mid.webp", "perfume": "maree", "tier": "heart", "note": "Oceanic Marine Accord", "aspect_ratio": "3:4", "prompt": "Editorial macro photograph of effervescent oceanic sea spray and delicate crystalline sea salt crust forming on dark wet tidepool rock. Crisp, clean saline mineral water droplets catching bright morning ocean sunlight --ar 3:4 --style raw --v 6.1", "negative_prompt": "murky brown water, dead fish, plastic beach trash, green algae slime, text, watermark"},
  {"filename": "maree-base.webp", "perfume": "maree", "tier": "base", "note": "Smoky Wild Vetiver", "aspect_ratio": "3:4", "prompt": "Editorial tactile photograph of fragrant, earthy dried vetiver root bundle tied with natural raw unbleached linen cord, resting on a block of sun-bleached driftwood. Grounded smoky mineral sophistication, quiet luxury still life --ar 3:4 --style raw --v 6.1", "negative_prompt": "messy garden dirt, weeds, compost pile, plastic string, harsh contrast, text, watermark"},
  {"filename": "noir-cacao-top.webp", "perfume": "noir-cacao", "tier": "top", "note": "Spiced Bergamot & Cardamom", "aspect_ratio": "3:4", "prompt": "Editorial macro photograph of a fresh whole bitter green-gold bergamot fruit beside cracked green cardamom pods displaying intensely aromatic dark seeds, resting on dark charcoal slate. Dramatic moody studio lighting with golden highlights --ar 3:4 --style raw --v 6.1", "negative_prompt": "bruised rotten fruit, ground curry powder, messy kitchen counter, harsh flash, text, watermark"},
  {"filename": "noir-cacao-mid.webp", "perfume": "noir-cacao", "tier": "heart", "note": "Raw Cacao Absolute", "aspect_ratio": "3:4", "prompt": "Editorial macro still life photograph of fractured raw 85% bittersweet roasted cacao beans and dark artisanal cacao nibs, showing rich earthy matte chocolate textures on rough dark basalt stone. Dark, sophisticated, aristocratic gourmand --ar 3:4 --style raw --v 6.1", "negative_prompt": "sweet milk chocolate bars, candy wrappers, sugary frosting, artificial gloss, text, watermark"},
  {"filename": "noir-cacao-base.webp", "perfume": "noir-cacao", "tier": "base", "note": "Aged Patchouli & Sandalwood", "aspect_ratio": "3:4", "prompt": "Editorial still life photograph of velvety aged dark patchouli leaves resting against a smooth block of smoked dark sandalwood showing delicate aromatic grain on aged dark slate. Warm, enigmatic, after-dark luxury ambiance --ar 3:4 --style raw --v 6.1", "negative_prompt": "dead dried dry leaves, campfire ash, messy dirt, blurry, text, watermark"}
]
```

---

## 4. Destination & Wiring in Code

Once generated, place the `.webp` files in:
```
public/images/perfumes/notes/
├── aube-top.webp
├── aube-mid.webp
├── aube-base.webp
├── fleur-top.webp
├── fleur-mid.webp
├── fleur-base.webp
├── ambre-doux-top.webp
├── ambre-doux-mid.webp
├── ambre-doux-base.webp
├── noctis-top.webp
├── noctis-mid.webp
├── noctis-base.webp
├── blanc-top.webp
├── blanc-mid.webp
├── blanc-base.webp
├── maree-top.webp
├── maree-mid.webp
├── maree-base.webp
├── noir-cacao-top.webp
├── noir-cacao-mid.webp
└── noir-cacao-base.webp
```

The components (`ProductScentArchitecture` and `lib/products.ts`) will resolve each ingredient card's dedicated image automatically, while falling back gracefully to `/images/perfumes/notes/${slug}.webp` if an individual image is not yet loaded.

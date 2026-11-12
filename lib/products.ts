export interface KeyIngredient {
  name: string;
  origin?: string;
  note: string;
  description: string;
}

export interface Product {
  slug: string;
  name: string;
  subtitle: string;
  volume: string;
  price: number;
  oneLiner: string;
  notesUppercase: string;
  notesPoem: [string, string, string];
  ritual: string;
  material: string;
  provenance: string;
  image: string;
  gallery: string[];
  relatedSlugs: string[];
  isDark?: boolean;
  scentProfile: {
    top: string;
    heart: string;
    base: string;
    family: string;
    concentration?: string;
    longevity?: string;
    sillage?: string;
    maceration?: string;
  };
  keyIngredients: KeyIngredient[];
}

export interface HouseObject {
  slug: string;
  name: string;
  price: number;
  description: string;
  spec: string;
  image: string;
}

export const PERFUMES: Product[] = [
  {
    slug: "aube",
    name: "Aubé",
    subtitle: "Fresh. Vibrant. Awakening.",
    volume: "50 ml · Eau de Parfum",
    price: 1099,
    oneLiner: "A crisp, awakening breeze of fresh mint and water jasmine.",
    notesUppercase: "CRISP MINT · WATER JASMINE · GREEN CEDAR",
    notesPoem: [
      "Crisp mint.",
      "Water jasmine.",
      "Green cedar.",
    ],
    scentProfile: {
      top: "Wild Garden Mint · Bergamot · Crisp Dew Accord",
      heart: "Water Jasmine · Green Tea Infusion · White Neroli",
      base: "Distilled Green Cedarwood · Sheer Botanical Ambergris · Clean Linen Accord",
      family: "Crisp Green Aquatic",
      concentration: "Eau de Parfum",
      longevity: "10–12 Hours on Skin · 24 Hours on Raw Silk",
      sillage: "Crisp Radiance · 4–6 Feet Scent Aura",
      maceration: "Handcrafted in Small Batches",
    },
    keyIngredients: [
      {
        name: "Wild Mountain Mint",
        note: "Top / Head",
        description: "Harvested at dawn before sunrise to retain the crystalline, icy volatile essential oils without any bitterness.",
      },
      {
        name: "Dewy Water Jasmine",
        note: "Heart",
        description: "Hydro-distilled white petals that evoke morning mist rising over still mountain lakes.",
      },
      {
        name: "Green Cedar",
        note: "Base / Anchor",
        description: "Slow steam-extracted heartwood delivering architectural clarity and an earthy, pristine foundation.",
      },
    ],
    ritual: "Morning awakening. Apply two delicate presses to warm pulse points: wrists, hollow of the throat, and the collar of a crisp shirt. Inhale the dewy freshness as it unfolds into radiant floral elegance.",
    material: "Crisp green mint leaves and dewy water jasmine, anchored by freshly distilled green cedar.",
    provenance: "Formulated with pure botanical extraits and natural absolutes.",
    image: "/images/perfumes/aube.jpeg",
    gallery: [
      "/images/perfumes/aube.jpeg",
      "/images/perfumes/notes/aube.webp",
      "/images/perfumes/cutouts/aube.webp?v=2",
      "/images/perfumes/tray.jpeg",
      "/images/perfumes/all-perfumes.jpeg",
    ],
    relatedSlugs: ["blanc", "fleur"],
  },
  {
    slug: "fleur",
    name: "Fleur",
    subtitle: "Pure. Elegant. Timeless.",
    volume: "50 ml · Eau de Parfum",
    price: 1299,
    oneLiner: "A timeless floral harmony of magnolia, velvety rose, and luxury musk.",
    notesUppercase: "MAGNOLIA · VELVET ROSE · LUXURY MUSK",
    notesPoem: [
      "Magnolia.",
      "Velvet rose.",
      "Luxury musk.",
    ],
    scentProfile: {
      top: "Dewy White Magnolia · Pink Peppercorn · Green Mandarin",
      heart: "Velvet Rose Absolute · Silken Rose · White Lily",
      base: "Botanical Velvet Musk · Soft Cashmere Accord · Blonde Cedar",
      family: "Velvet Floral Oriental",
      concentration: "Eau de Parfum",
      longevity: "12+ Hours on Skin · Indefinite on Cashmere",
      sillage: "Enveloping & Sophisticated · 6 Feet Scent Aura",
      maceration: "Handcrafted in Small Batches",
    },
    keyIngredients: [
      {
        name: "Velvet Rose Absolute",
        note: "Heart / Soul",
        description: "Three million hand-harvested petals required for a single litre of pure absolute. Lush, velvety, and deeply romantic.",
      },
      {
        name: "White Star Magnolia",
        note: "Top / Head",
        description: "Delicate waxy white petals exuding citrus-tinged creaminess and luminous dawn florals.",
      },
      {
        name: "Silken Botanical Musk",
        note: "Base / Skin Fixative",
        description: "Cruelty-free plant-derived musk that mimics the natural warmth and sensual intimacy of bare skin.",
      },
    ],
    ritual: "Pure daytime elegance. Spray once onto the nape of the neck, behind each earlobe, and across the ends of hair. The sillage whispers with every turn of the head.",
    material: "Exquisite magnolia blossoms, velvety rose petals, and skin-soft luxury musk.",
    provenance: "Formulated with pure botanical extraits and natural absolutes.",
    image: "/images/perfumes/fleur.jpeg",
    gallery: [
      "/images/perfumes/fleur.jpeg",
      "/images/perfumes/notes/fleur.webp",
      "/images/perfumes/cutouts/fleur.webp?v=2",
      "/images/perfumes/fleur-tray.jpeg",
      "/images/perfumes/all-perfumes.jpeg",
    ],
    relatedSlugs: ["blanc", "aube"],
  },
  {
    slug: "ambre-doux",
    name: "Ambre Doux",
    subtitle: "Warm. Radiant. Addictive.",
    volume: "50 ml · Eau de Parfum",
    price: 1699,
    oneLiner: "An addictive, radiant aura of saffron, crystalline amber, and silken woods.",
    notesUppercase: "RADIANT SAFFRON · CRYSTALLINE AMBER · SILKEN WOODS",
    notesPoem: [
      "Radiant saffron.",
      "Crystalline amber.",
      "Silken woods.",
    ],
    scentProfile: {
      top: "Saffron Threads · Blood Orange · Roasted Cardamom",
      heart: "Crystalline Amber Resin · Tagetes Petals · Sweet Resin Tears",
      base: "Polished Silken Woods · Golden Cedar · Warm Vanilla Pod",
      family: "Warm Amber Resin & Woods",
      concentration: "Eau de Parfum",
      longevity: "14+ Hours on Skin · Days on Wool Coats",
      sillage: "Warm, Radiating Aura · Fills a Room Gently",
      maceration: "Handcrafted in Small Batches",
    },
    keyIngredients: [
      {
        name: "Saffron Stigmas",
        note: "Top / Head",
        description: "Regal crimson threads delivering a leathery, golden-spicy radiance that sparkles across the top.",
      },
      {
        name: "Crystalline Amber Resin",
        note: "Heart",
        description: "Slow-clarified tree resins imparting warmth, honeyed depth, and golden luminosity.",
      },
      {
        name: "Polished Cedar",
        note: "Base / Anchor",
        description: "Noble mountain cedar aged in temperature-controlled casks to impart a silken, polished woody sillage.",
      },
    ],
    ritual: "An evening signature. Apply to the nape of the neck, inside the elbows, and across your coat collar. Let the heat of your skin ignite the saffron and warm amber as twilight settles.",
    material: "Precious radiant saffron threads, golden crystalline amber resin, and polished silken woods.",
    provenance: "Formulated with pure botanical extraits and natural absolutes.",
    image: "/images/perfumes/ambre-doux.jpeg",
    gallery: [
      "/images/perfumes/ambre-doux.jpeg",
      "/images/perfumes/notes/ambre-doux.webp",
      "/images/perfumes/cutouts/ambre-doux.webp?v=2",
      "/images/perfumes/pairings.jpeg",
      "/images/perfumes/all-perfumes.jpeg",
    ],
    relatedSlugs: ["noctis", "noir-cacao"],
  },
  {
    slug: "noctis",
    name: "Noctis",
    subtitle: "Deep. Intense. Mysterious.",
    volume: "50 ml · Eau de Parfum",
    price: 1299,
    oneLiner: "A deep, intense journey of dark plum, grey amber, and driftwood.",
    notesUppercase: "DARK PLUM · GREY AMBER · DRIFTWOOD",
    notesPoem: [
      "Dark plum.",
      "Grey amber.",
      "Driftwood.",
    ],
    scentProfile: {
      top: "Black Damson Plum · Cracked Peppercorn · Cold Marine Mist",
      heart: "Coastal Grey Ambergris Accord · Wild Coastal Sage · Crushed Cypress",
      base: "Weathered Sea Driftwood · Smoked Birchwood · Dark Frankincense",
      family: "Smoked Oceanic Noir & Wood",
      concentration: "Eau de Parfum",
      longevity: "14+ Hours on Skin · Deep Sillage",
      sillage: "Intense & Enigmatic · Command Sillage",
      maceration: "Handcrafted in Small Batches",
    },
    keyIngredients: [
      {
        name: "Damson Black Plum",
        note: "Top / Head",
        description: "Inky, shadowed fruit steeped with cracked peppery spices to create a sensual, dark-toned opening.",
      },
      {
        name: "Coastal Grey Amber",
        note: "Heart",
        description: "Mineral-rich, saline, and skin-like warmth that anchors the fruity darkness with oceanic mystery.",
      },
      {
        name: "Sunken Coastal Driftwood",
        note: "Base / Anchor",
        description: "Salt-crusted, mineral-bleached wood cured by tides and sun, evoking midnight waves on desolate shores.",
      },
    ],
    ritual: "On pulse points, after dark. Two deliberate sprays on the chest and collarbone. Mysterious, enigmatic, and unforgettable in dimly lit spaces and nighttime conversations.",
    material: "Rich dark plum and oceanic grey amber resting on weathered coastal driftwood.",
    provenance: "Formulated with pure botanical extraits and natural absolutes.",
    image: "/images/perfumes/noctis.jpeg",
    gallery: [
      "/images/perfumes/noctis.jpeg",
      "/images/perfumes/notes/noctis.webp",
      "/images/perfumes/cutouts/noctis.webp?v=2",
      "/images/perfumes/details.jpeg",
      "/images/perfumes/all-perfumes.jpeg",
    ],
    relatedSlugs: ["ambre-doux", "noir-cacao"],
    isDark: true,
  },
  {
    slug: "blanc",
    name: "Blanc",
    subtitle: "Soft. Creamy. Indulgent.",
    volume: "50 ml · Eau de Parfum",
    price: 1099,
    oneLiner: "A creamy indulgence of wild strawberry, whipped cream, and rich vanilla.",
    notesUppercase: "WILD STRAWBERRY · WHIPPED CREAM · RICH VANILLA",
    notesPoem: [
      "Wild strawberry.",
      "Whipped cream.",
      "Rich vanilla.",
    ],
    scentProfile: {
      top: "Wild Strawberry · Sweet Almond Milk · Dewy Heliotrope",
      heart: "Whipped Cream Accord · Orris Butter Accord · White Jasmine Petals",
      base: "Rich Vanilla · Golden Tonka Infusion · Sandalwood Milk",
      family: "Lactonic Gourmand Amber",
      concentration: "Eau de Parfum",
      longevity: "12+ Hours on Skin · Melts Into Skin",
      sillage: "Intimate, Caressing Aura · Hugs the Body",
      maceration: "Handcrafted in Small Batches",
    },
    keyIngredients: [
      {
        name: "Wild Strawberry",
        note: "Top / Head",
        description: "Small, highly concentrated berries bursting with sweet tartness and sparkling sunlight.",
      },
      {
        name: "Whipped Cream Accord",
        note: "Heart",
        description: "Soft, whipped, airy cream that softens the skin profile without any sticky synthetic heaviness.",
      },
      {
        name: "Rich Vanilla Pods",
        note: "Base / Anchor",
        description: "Dark oily pods cured under tropical sun, delivering rich balsamic sweetness and warm, comforting depth.",
      },
    ],
    ritual: "Soft, decadent comfort. An irresistible daily indulgence that melts into the skin. Apply behind the ears, across wrists, and into warm hollows. Pure cashmere comfort.",
    material: "Lush wild strawberries folded into rich whipped cream and pure rich vanilla.",
    provenance: "Formulated with pure botanical extraits and natural absolutes.",
    image: "/images/perfumes/blanc.jpeg",
    gallery: [
      "/images/perfumes/blanc.jpeg",
      "/images/perfumes/notes/blanc.webp",
      "/images/perfumes/cutouts/blanc.webp?v=2",
      "/images/perfumes/tray.jpeg",
      "/images/perfumes/all-perfumes.jpeg",
    ],
    relatedSlugs: ["aube", "fleur"],
  },
  {
    slug: "maree",
    name: "Marée",
    subtitle: "Marine. Fresh. Deep.",
    volume: "50 ml · Eau de Parfum",
    price: 1699,
    oneLiner: "An oceanic surge of marine accord, wild rosemary, and mineral woods.",
    notesUppercase: "MARINE ACCORD · ROSEMARY · MINERAL WOODS",
    notesPoem: [
      "Marine accord.",
      "Rosemary.",
      "Mineral woods.",
    ],
    scentProfile: {
      top: "Saline Ocean Mist · Wild Rosemary Sprigs · Crisp Bergamot",
      heart: "Deep Marine Kelp Accord · Coastal Lavender · Crushed Myrtle Leaves",
      base: "Sun-Bleached Mineral Woods · Wild Vetiver · Weathered Sea Amber",
      family: "Oceanic Mineral Aromatic",
      concentration: "Eau de Parfum",
      longevity: "12+ Hours on Skin · Fresh Oceanic Aura",
      sillage: "Crisp, Invigorating Surge · 6 Feet Scent Aura",
      maceration: "Handcrafted in Small Batches",
    },
    keyIngredients: [
      {
        name: "Wild Coastal Rosemary",
        note: "Top / Head",
        description: "Aromatic needle leaves charged with coastal breeze, resinous, invigorating, and green.",
      },
      {
        name: "Marine Accord",
        note: "Heart",
        description: "Pure oceanic salt spray, mineral tides, and sea foam without synthetic metallic calone notes.",
      },
      {
        name: "Wild Vetiver",
        note: "Base / Anchor",
        description: "Smoky, earthy roots that ground the sea salt with mineral sophistication and enduring resilience.",
      },
    ],
    ritual: "Wear it for an invigorating, fresh coastal sillage. Apply across the collar, wrists, and forearms before stepping out. Carries the invigorating spirit of open sea tides wherever you go.",
    material: "Pure marine accord paired with aromatic rosemary and weathered mineral woods.",
    provenance: "Formulated with pure botanical extraits and natural absolutes.",
    image: "/images/perfumes/maree.jpeg",
    gallery: [
      "/images/perfumes/maree.jpeg",
      "/images/perfumes/notes/maree.webp",
      "/images/perfumes/cutouts/maree.webp?v=2",
      "/images/perfumes/details.jpeg",
      "/images/perfumes/all-perfumes.jpeg",
    ],
    relatedSlugs: ["aube", "blanc"],
  },
  {
    slug: "noir-cacao",
    name: "Noir Cacao",
    subtitle: "Dark. Warm. Addictive.",
    volume: "50 ml · Eau de Parfum",
    price: 1599,
    oneLiner: "A decadent fusion of deep cacao, velvety vanilla, and smoked woods.",
    notesUppercase: "CACAO ABSOLUTE · DARK CHOCOLATE · RICH VANILLA",
    notesPoem: [
      "Cacao absolute.",
      "Dark chocolate & spices.",
      "Rich vanilla & smoked woods.",
    ],
    scentProfile: {
      top: "Bergamot · Spiced Cardamom · Roasted Cocoa Husk",
      heart: "Raw Cacao Absolute 85% · Dark Truffle Chocolate · Jasmine Sambac",
      base: "Rich Vanilla · Smoked Patchouli · Sandalwood · Tonka Bean",
      family: "Amber Gourmand Woody",
      concentration: "Eau de Parfum",
      longevity: "16+ Hours on Skin · Unrivaled Sillage",
      sillage: "Hypnotic, Intoxicating Aura · Fills a Ballroom",
      maceration: "Handcrafted in Small Batches",
    },
    keyIngredients: [
      {
        name: "Raw Cacao Absolute",
        note: "Heart / Core",
        description: "Dark, bittersweet, roasted bean absolute with zero synthetic sweetness. Deep, intoxicating, and aristocratic.",
      },
      {
        name: "Aged Vanilla Beans",
        note: "Base",
        description: "Aged dark pods contributing resinous, creamy, and sensual balsamic undertones.",
      },
      {
        name: "Aged Patchouli",
        note: "Base / Anchor",
        description: "Cold-aged dark patchouli leaves offering earthy, velvety chocolate-like depth that fuses with sandalwood.",
      },
    ],
    ritual: "An addictive after-dark statement. Irresistible. Unforgettable. Two presses to the throat and wrists before dusk. Let the warmth of your skin reveal dark cacao, smoked patchouli, and roasted vanilla.",
    material: "Deep cacao absolute, spiced bergamot, and rich dark vanilla over smoked patchouli and sandalwood.",
    provenance: "Formulated with pure botanical extraits and natural absolutes.",
    image: "/images/perfumes/noir-cacao.jpeg",
    gallery: [
      "/images/perfumes/noir-cacao.jpeg",
      "/images/perfumes/notes/noir-cacao.webp",
      "/images/perfumes/cutouts/noir-cacao.webp?v=2",
      "/images/perfumes/details.jpeg",
      "/images/perfumes/all-perfumes.jpeg",
    ],
    relatedSlugs: ["noctis", "ambre-doux"],
    isDark: true,
  },
];

export const OBJECTS: HouseObject[] = [
  {
    slug: "discovery-set",
    name: "The Discovery Set",
    price: 999,
    description: "Every perfume the house makes, ten millilitres each.",
    spec: "Seven vials, one box. Ten millilitres each.",
    image: "/images/objects/discovery-set-floating.webp",
  },
  {
    slug: "en-route",
    name: "En Route",
    price: 499,
    description: "For the drive.",
    spec: "Refillable cabin diffuser. Cedar, bergamot, and warm amber.",
    image: "/images/objects/car-perfume-floating.webp",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PERFUMES.find((p) => p.slug === slug);
}

export function getAllProductSlugs(): string[] {
  return PERFUMES.map((p) => p.slug);
}

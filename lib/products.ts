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
  relatedSlugs: string[];
  isDark?: boolean;
  scentProfile?: {
    top?: string;
    heart?: string;
    base?: string;
    family?: string;
    longevity?: string;
  };
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
    volume: "50 ml · Extrait de Parfum",
    price: 1099,
    oneLiner: "A crisp, awakening breeze of fresh mint and water jasmine.",
    notesUppercase: "CRISP MINT · WATER JASMINE · GREEN CEDAR",
    notesPoem: [
      "Crisp mint.",
      "Water jasmine.",
      "Green cedar.",
    ],
    ritual: "Morning awakening. Wrists, throat, behind the knees. A revitalizing burst of clarity.",
    material: "Crisp green mint leaves and dewy water jasmine, anchored by freshly distilled green cedar.",
    provenance: "Blended in India. Rested ninety days.",
    image: "/images/perfumes/aube.jpeg",
    relatedSlugs: ["blanc", "fleur"],
  },
  {
    slug: "fleur",
    name: "Fleur",
    subtitle: "Pure. Elegant. Timeless.",
    volume: "50 ml · Extrait de Parfum",
    price: 1299,
    oneLiner: "A timeless floral harmony of magnolia, Bulgarian rose, and luxury musk.",
    notesUppercase: "MAGNOLIA · BULGARIAN ROSE · LUXURY MUSK",
    notesPoem: [
      "Magnolia.",
      "Bulgarian rose.",
      "Luxury musk.",
    ],
    ritual: "Pure daytime elegance. Throat, wrists, the ends of the hair.",
    material: "Exquisite magnolia blossoms, velvety Bulgarian rose petals, and skin-soft luxury musk.",
    provenance: "Blended in India. Rested ninety days.",
    image: "/images/perfumes/fleur.jpeg",
    relatedSlugs: ["blanc", "aube"],
  },
  {
    slug: "ambre-doux",
    name: "Ambre Doux",
    subtitle: "Warm. Radiant. Addictive.",
    volume: "50 ml · Extrait de Parfum",
    price: 1699,
    oneLiner: "An addictive, radiant aura of saffron, crystalline amber, and silken woods.",
    notesUppercase: "RADIANT SAFFRON · CRYSTALLINE AMBER · SILKEN WOODS",
    notesPoem: [
      "Radiant saffron.",
      "Crystalline amber.",
      "Silken woods.",
    ],
    ritual: "An evening fragrance. Nape of the neck, chest, coat collar. Warm and enveloping.",
    material: "Precious radiant saffron threads, golden crystalline amber resin, and polished silken woods.",
    provenance: "Blended in India. Rested ninety days.",
    image: "/images/perfumes/ambre-doux.jpeg",
    relatedSlugs: ["noctis", "noir-cacao"],
  },
  {
    slug: "noctis",
    name: "Noctis",
    subtitle: "Deep. Intense. Mysterious.",
    volume: "50 ml · Extrait de Parfum",
    price: 1299,
    oneLiner: "A deep, intense journey of dark plum, grey amber, and driftwood.",
    notesUppercase: "DARK PLUM · GREY AMBER · DRIFTWOOD",
    notesPoem: [
      "Dark plum.",
      "Grey amber.",
      "Driftwood.",
    ],
    ritual: "On pulse points, after dark. Two sprays. Deep, intense, and mysterious.",
    material: "Rich dark plum and oceanic grey amber resting on weathered coastal driftwood.",
    provenance: "Blended in India. Rested ninety days.",
    image: "/images/perfumes/noctis.jpeg",
    relatedSlugs: ["ambre-doux", "noir-cacao"],
    isDark: true,
  },
  {
    slug: "blanc",
    name: "Blanc",
    subtitle: "Soft. Creamy. Indulgent.",
    volume: "50 ml · Extrait de Parfum",
    price: 1099,
    oneLiner: "A creamy indulgence of wild strawberry, whipped cream, and Madagascar vanilla.",
    notesUppercase: "WILD STRAWBERRY · WHIPPED CREAM · MADAGASCAR VANILLA",
    notesPoem: [
      "Wild strawberry.",
      "Whipped cream.",
      "Madagascar vanilla.",
    ],
    ritual: "Soft, decadent comfort. An irresistible daily indulgence that melts into the skin.",
    material: "Lush wild strawberries folded into rich whipped cream and pure Madagascar vanilla.",
    provenance: "Blended in India. Rested ninety days.",
    image: "/images/perfumes/blanc.jpeg",
    relatedSlugs: ["aube", "fleur"],
  },
  {
    slug: "maree",
    name: "Marée",
    subtitle: "Marine. Fresh. Deep.",
    volume: "50 ml · Extrait de Parfum",
    price: 1699,
    oneLiner: "An oceanic surge of marine accord, wild rosemary, and mineral woods.",
    notesUppercase: "MARINE ACCORD · ROSEMARY · MINERAL WOODS",
    notesPoem: [
      "Marine accord.",
      "Rosemary.",
      "Mineral woods.",
    ],
    ritual: "Wear it for an invigorating, fresh coastal sillage. Wrists, neck, forearms.",
    material: "Pure marine accord paired with aromatic rosemary and weathered mineral woods.",
    provenance: "Blended in India. Rested ninety days.",
    image: "/images/perfumes/maree.jpeg",
    relatedSlugs: ["aube", "blanc"],
  },
  {
    slug: "noir-cacao",
    name: "Noir Cacao",
    subtitle: "Dark. Warm. Addictive.",
    volume: "50 ml · Extrait de Parfum",
    price: 1599,
    oneLiner: "A decadent fusion of deep cacao, velvety vanilla, and smoked woods.",
    notesUppercase: "CACAO ABSOLUTE · DARK CHOCOLATE · MADAGASCAR VANILLA",
    notesPoem: [
      "Cacao absolute.",
      "Dark chocolate & spices.",
      "Madagascar vanilla & smoked woods.",
    ],
    scentProfile: {
      top: "Bergamot · Spiced Accord",
      heart: "Cacao Absolute · Dark Chocolate · Jasmine Sambac",
      base: "Vanilla Madagascar · Tonka Bean · Amberwood · Smoked Patchouli · Sandalwood",
      family: "Amber Gourmand Woody",
      longevity: "12+ Hours Long Lasting",
    },
    ritual: "An addictive after-dark statement. Irresistible. Unforgettable.",
    material: "Deep cacao absolute, spiced bergamot, and rich Madagascar vanilla over smoked patchouli and sandalwood.",
    provenance: "Blended in India. Rested ninety days.",
    image: "/images/perfumes/noir-cacao.jpeg",
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
    spec: "Seven vials, one box. Rested ninety days.",
    image: "/images/objects/discovery-set.webp",
  },
  {
    slug: "en-route",
    name: "En Route",
    price: 499,
    description: "For the drive.",
    spec: "Refillable solid diffuser. Pure cedar and cold-pressed citrus.",
    image: "/images/perfumes/en-route.jpeg",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PERFUMES.find((p) => p.slug === slug);
}

export function getAllProductSlugs(): string[] {
  return PERFUMES.map((p) => p.slug);
}

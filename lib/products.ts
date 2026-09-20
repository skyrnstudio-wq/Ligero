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
    slug: "noctis",
    name: "Noctis",
    subtitle: "Midnight Papyrus & Dark Leather",
    volume: "50 ml · Extrait de Parfum",
    price: 1299,
    oneLiner: "Smoke, leather, the hour after midnight.",
    notesUppercase: "SMOKED PAPYRUS · LEATHER · AMBER",
    notesPoem: [
      "Smoked papyrus.",
      "Leather.",
      "The hour after midnight.",
    ],
    ritual: "On pulse points, after dark. Two sprays. Nothing more is needed.",
    material: "Papyrus from the Nile delta. Cut by hand, pressed the same day, rested for a year before it meets the blend.",
    provenance: "Blended in Grasse. Rested ninety days.",
    image: "/images/perfumes/noctis.jpeg",
    relatedSlugs: ["ambre-doux", "noir-cacao"],
    isDark: true,
  },
  {
    slug: "aube",
    name: "Aube",
    subtitle: "Raw Silk & Burnt Apricot",
    volume: "50 ml · Eau de Parfum",
    price: 1099,
    oneLiner: "Warm skin, citrus peel, first light.",
    notesUppercase: "BERGAMOT · ORANGE BLOSSOM · DAWN",
    notesPoem: [
      "Bergamot peel.",
      "Orange blossom.",
      "Warm skin at dawn.",
    ],
    ritual: "Morning scent. Wrists, throat, behind the knees. Repeat at noon if the day deserves it.",
    material: "Calabrian bergamot from one grove. Picked in November, pressed before the oils can turn.",
    provenance: "Blended in Grasse. Rested ninety days.",
    image: "/images/perfumes/aube.jpeg",
    relatedSlugs: ["blanc", "fleur"],
  },
  {
    slug: "maree",
    name: "Marée",
    subtitle: "Petrol & Sea Glass",
    volume: "50 ml · Eau Fraîche Parfumée",
    price: 1699,
    oneLiner: "Salt, kelp, the sea at dusk.",
    notesUppercase: "SEA SALT · KELP ABSOLUTE · WET STONE",
    notesPoem: [
      "Sea salt.",
      "Kelp absolute.",
      "Wet stone.",
    ],
    ritual: "Wear it to the coast. Wrists, neck, forearms.",
    material: "Kelp absolute from Brittany. Cut at low tide, distilled within the day.",
    provenance: "Blended in Grasse. Rested ninety days.",
    image: "/images/perfumes/maree.jpeg",
    relatedSlugs: ["aube", "blanc"],
  },
  {
    slug: "ambre-doux",
    name: "Ambre Doux",
    subtitle: "Tobacco & Aged Amber",
    volume: "50 ml · Extrait de Parfum",
    price: 1699,
    oneLiner: "Amber, tobacco leaf, a closing door.",
    notesUppercase: "AMBER · TOBACCO LEAF · CEDAR",
    notesPoem: [
      "Amber.",
      "Tobacco leaf.",
      "A closing door.",
    ],
    ritual: "An evening fragrance. Nape of the neck, chest, coat collar.",
    material: "Tobacco leaf cured for a year on a single estate in La Rioja.",
    provenance: "Blended in Grasse. Rested ninety days.",
    image: "/images/perfumes/ambre-doux.jpeg",
    relatedSlugs: ["noctis", "noir-cacao"],
  },
  {
    slug: "blanc",
    name: "Blanc",
    subtitle: "Porcelain & Florentine Iris",
    volume: "50 ml · Eau de Parfum",
    price: 1099,
    oneLiner: "Linen, iris, the pause before speech.",
    notesUppercase: "LINEN · IRIS PALLIDA · MUSK",
    notesPoem: [
      "Linen.",
      "Iris.",
      "The pause before speech.",
    ],
    ritual: "Wear it when you want to be remembered as calm.",
    material: "Iris pallida, aged three years before grinding. A note that costs more than gold by weight.",
    provenance: "Blended in Grasse. Rested ninety days.",
    image: "/images/perfumes/blanc.jpeg",
    relatedSlugs: ["aube", "fleur"],
  },
  {
    slug: "fleur",
    name: "Fleur",
    subtitle: "Night Jasmine & Wet Earth",
    volume: "50 ml · Eau de Parfum",
    price: 1299,
    oneLiner: "Jasmine, sambac, the courtyard after rain.",
    notesUppercase: "JASMINE SAMBAC · VETIVER · WET EARTH",
    notesPoem: [
      "Jasmine sambac.",
      "Vetiver.",
      "Wet earth at dusk.",
    ],
    ritual: "A daylight fragrance. Throat, wrists, the ends of the hair.",
    material: "Jasmine sambac from Madurai, picked before dawn while the flowers still sleep.",
    provenance: "Blended in Grasse. Rested ninety days.",
    image: "/images/perfumes/fleur.jpeg",
    relatedSlugs: ["blanc", "aube"],
  },
  {
    slug: "noir-cacao",
    name: "Noir Cacao",
    subtitle: "Dark Roasted Cacao & Black Vanilla",
    volume: "50 ml · Eau de Parfum",
    price: 1599,
    oneLiner: "Coconut, toasted, at the last hour of the party.",
    notesUppercase: "ROASTED CACAO · BLACK VANILLA · RUM",
    notesPoem: [
      "Coconut husk.",
      "Black vanilla.",
      "The last hour of the party.",
    ],
    ritual: "An after-dark fragrance. Chest, coat collar, one spray too many.",
    material: "Cacao and coconut husk from Kerala, toasted slow, folded into a vanilla that never turns sweet.",
    provenance: "Blended in Grasse. Rested ninety days.",
    image: "/images/perfumes/noir-cacao.jpeg",
    relatedSlugs: ["noctis", "ambre-doux"],
  },
];

export const OBJECTS: HouseObject[] = [
  {
    slug: "discovery-set",
    name: "The Discovery Set",
    price: 999,
    description: "Every perfume the house makes, two millilitres each.",
    spec: "Seven vials, one box. Rested ninety days.",
    image: "/images/perfumes/tray.jpeg",
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

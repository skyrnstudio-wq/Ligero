import { getPerfumeCutoutImage, type HouseObject, type Product } from "@/lib/products";
import type { PublicReview, ReviewSummary } from "@/lib/reviews";

export const BASE_URL = "https://www.ligeroparfum.com";
export const CONTACT_EMAIL = "sales@ligeroparfum.com";
export const INSTAGRAM_URL = "https://www.instagram.com/ligeroparfums";

/**
 * Serializes structured data safely for `<script type="application/ld+json">`
 * and `<script type="speculationrules">`, escaping `<`, `>`, `&`, and line
 * separators so untrusted CMS/review strings can never break out of `<script>`.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

/**
 * Clamps a meta description cleanly at word/sentence boundaries for optimal
 * 140-160 character SERP display.
 */
export function formatMetaDescription(text: string, maxLen = 158): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLen) return normalized;
  const sliced = normalized.slice(0, maxLen - 1);
  const lastSentence = Math.max(sliced.lastIndexOf(". "), sliced.lastIndexOf("; "));
  if (lastSentence >= 115) {
    return sliced.slice(0, lastSentence + 1).trim();
  }
  const lastSpace = sliced.lastIndexOf(" ");
  const trimmed = (lastSpace > 80 ? sliced.slice(0, lastSpace) : sliced).replace(/[,;:\s]+$/, "");
  return `${trimmed}.`;
}

export function toAbsoluteUrl(urlOrPath: string): string {
  if (!urlOrPath) return BASE_URL;
  if (urlOrPath.startsWith("http://") || urlOrPath.startsWith("https://")) {
    return urlOrPath;
  }
  const cleanPath = urlOrPath.split("?")[0];
  return `${BASE_URL}${cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`}`;
}

function getDynamicPriceValidUntil(): string {
  const date = new Date();
  date.setUTCFullYear(date.getUTCFullYear() + 1);
  return date.toISOString().slice(0, 10);
}

const MERCHANT_RETURN_POLICY = {
  "@type": "MerchantReturnPolicy",
  "@id": `${BASE_URL}/#return-policy`,
  applicableCountry: "IN",
  returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
  merchantReturnDays: 7,
  returnMethod: "https://schema.org/ReturnByMail",
  returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
};

const OFFER_SHIPPING_DETAILS = {
  "@type": "OfferShippingDetails",
  shippingRate: {
    "@type": "MonetaryAmount",
    value: 0,
    currency: "INR",
  },
  shippingDestination: {
    "@type": "DefinedRegion",
    addressCountry: "IN",
  },
  deliveryTime: {
    "@type": "ShippingDeliveryTime",
    handlingTime: {
      "@type": "QuantitativeValue",
      minValue: 1,
      maxValue: 2,
      unitCode: "DAY",
    },
    transitTime: {
      "@type": "QuantitativeValue",
      minValue: 3,
      maxValue: 7,
      unitCode: "DAY",
    },
  },
};

export function buildOrganizationSchema() {
  return {
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: "Ligero Parfum",
    legalName: "Ligero Parfum Private Limited",
    url: BASE_URL,
    description:
      "Independent Indian perfume house in Mumbai formulating permanent small-batch Eau de Parfum creations and scented objects with pure botanical extracts and resins.",
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/images/brand/logo-art.png`,
      width: 512,
      height: 512,
    },
    brand: {
      "@type": "Brand",
      name: "Ligero Parfum",
      url: BASE_URL,
    },
    sameAs: [INSTAGRAM_URL],
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: CONTACT_EMAIL,
      areaServed: "IN",
      availableLanguage: ["English"],
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Mumbai",
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
    hasMerchantReturnPolicy: MERCHANT_RETURN_POLICY,
  };
}

export function buildWebsiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    url: BASE_URL,
    name: "Ligero Parfum",
    inLanguage: "en-IN",
    description:
      "Independent Indian perfume house presenting seven permanent Eau de Parfum creations and two Objects of scent.",
    publisher: { "@id": `${BASE_URL}/#organization` },
  };
}

export function buildWebPageSchema(params: {
  path: string;
  name: string;
  description: string;
  type?: "WebPage" | "CollectionPage" | "FAQPage" | "ItemPage";
  dateModified?: string;
  primaryImage?: string;
  mainEntityId?: string;
}) {
  const url = toAbsoluteUrl(params.path);
  const schema: Record<string, unknown> = {
    "@type": params.type || "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: params.name,
    description: params.description,
    inLanguage: "en-IN",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: { "@id": `${BASE_URL}/#organization` },
  };

  if (params.dateModified) {
    schema.dateModified = params.dateModified;
  }
  if (params.primaryImage) {
    schema.primaryImageOfPage = {
      "@type": "ImageObject",
      url: toAbsoluteUrl(params.primaryImage),
    };
  }
  if (params.mainEntityId) {
    schema.mainEntity = { "@id": params.mainEntityId };
  }

  return schema;
}

export function buildBreadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: toAbsoluteUrl(item.path),
    })),
  };
}

export function buildFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildHowToSchema(params: {
  name: string;
  description: string;
  path: string;
  steps: { name: string; text: string }[];
}) {
  const url = toAbsoluteUrl(params.path);
  return {
    "@type": "HowTo",
    "@id": `${url}#ritual`,
    name: params.name,
    description: params.description,
    step: params.steps.map((step, idx) => ({
      "@type": "HowToStep",
      position: idx + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

export interface ProductProperty {
  name: string;
  value: string;
}

export function buildProductSchema(params: {
  name: string;
  slug: string;
  path: string;
  description: string;
  images: string[];
  price: number;
  category: string;
  size?: string;
  material?: string;
  properties?: ProductProperty[];
  reviewSummary?: ReviewSummary | null;
  reviews?: PublicReview[];
}) {
  const url = toAbsoluteUrl(params.path);
  const sku = `LP-${params.slug.toUpperCase()}`;
  const schema: Record<string, unknown> = {
    "@type": "Product",
    "@id": `${url}#product`,
    name: params.name,
    sku,
    mpn: sku,
    category: params.category,
    description: params.description,
    image: Array.from(new Set(params.images.map(toAbsoluteUrl))),
    brand: {
      "@type": "Brand",
      name: "Ligero Parfum",
    },
    manufacturer: { "@id": `${BASE_URL}/#organization` },
    countryOfOrigin: {
      "@type": "Country",
      name: "India",
    },
    audience: {
      "@type": "PeopleAudience",
      suggestedGender: "unisex",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: params.price,
      url,
      priceValidUntil: getDynamicPriceValidUntil(),
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
      seller: { "@id": `${BASE_URL}/#organization` },
      shippingDetails: OFFER_SHIPPING_DETAILS,
      hasMerchantReturnPolicy: MERCHANT_RETURN_POLICY,
    },
  };

  if (params.size) {
    schema.size = params.size;
  }
  if (params.material) {
    schema.material = params.material;
  }
  if (params.properties && params.properties.length > 0) {
    schema.additionalProperty = params.properties
      .filter((prop) => prop.value.trim() !== "")
      .map((prop) => ({
        "@type": "PropertyValue",
        name: prop.name,
        value: prop.value,
      }));
  }

  if (
    params.reviewSummary &&
    typeof params.reviewSummary.average === "number" &&
    params.reviewSummary.count > 0
  ) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(params.reviewSummary.average.toFixed(2)),
      reviewCount: params.reviewSummary.count,
      bestRating: 5,
      worstRating: 1,
    };

    if (params.reviews && params.reviews.length > 0) {
      schema.review = params.reviews.slice(0, 10).map((r) => ({
        "@type": "Review",
        author: {
          "@type": "Person",
          name: r.name,
        },
        datePublished: r.submittedAt,
        name: r.title || `${params.name} review`,
        reviewBody: r.body,
        reviewRating: {
          "@type": "Rating",
          ratingValue: r.rating,
          bestRating: 5,
          worstRating: 1,
        },
      }));
    }
  }

  return schema;
}

export function buildCollectionListSchema(
  perfumes: Product[],
  objects: HouseObject[],
  listName = "Ligero Parfum Collection"
) {
  const priceValidUntil = getDynamicPriceValidUntil();
  const entries = [
    ...perfumes.map((p) => ({
      name: p.name,
      sku: `LP-${p.slug.toUpperCase()}`,
      url: toAbsoluteUrl(`/collection/${p.slug}`),
      image: toAbsoluteUrl(getPerfumeCutoutImage(p)),
      price: p.price,
      description: p.oneLiner,
    })),
    ...objects.map((o) => ({
      name: o.name,
      sku: `LP-${o.slug.toUpperCase()}`,
      url: toAbsoluteUrl(
        o.slug === "discovery-set"
          ? "/discovery-set"
          : o.slug === "en-route"
            ? "/objects/en-route"
            : `/objects#${o.slug}`
      ),
      image: toAbsoluteUrl(o.image),
      price: o.price,
      description: o.description,
    })),
  ];

  return {
    "@type": "ItemList",
    "@id": `${BASE_URL}/collection#itemlist`,
    name: listName,
    numberOfItems: entries.length,
    itemListElement: entries.map((entry, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "Product",
        name: entry.name,
        sku: entry.sku,
        url: entry.url,
        image: entry.image,
        description: entry.description,
        brand: {
          "@type": "Brand",
          name: "Ligero Parfum",
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "INR",
          price: entry.price,
          priceValidUntil,
          itemCondition: "https://schema.org/NewCondition",
          availability: "https://schema.org/InStock",
          url: entry.url,
          seller: { "@id": `${BASE_URL}/#organization` },
        },
      },
    })),
  };
}

export function buildGraph(nodes: Record<string, unknown>[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}

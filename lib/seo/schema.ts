import { getPerfumeCutoutImage, type HouseObject, type Product } from "@/lib/products";
import type { PublicReview, ReviewSummary } from "@/lib/reviews";

export const BASE_URL = "https://ligeroparfums.com";

export function toAbsoluteUrl(urlOrPath: string): string {
  if (!urlOrPath) return BASE_URL;
  if (urlOrPath.startsWith("http://") || urlOrPath.startsWith("https://")) {
    return urlOrPath;
  }
  const cleanPath = urlOrPath.split("?")[0];
  return `${BASE_URL}${cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`}`;
}

export function buildOrganizationSchema() {
  return {
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: "Ligero Parfum",
    legalName: "Ligero Parfum Private Limited",
    url: BASE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/images/brand/logo-art.png`,
    },
    sameAs: ["https://www.instagram.com/ligeroparfums"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "sales@ligeroparfums.com",
      areaServed: "IN",
      availableLanguage: ["English"],
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Mumbai",
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
  };
}

export function buildWebsiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    url: BASE_URL,
    name: "Ligero Parfum",
    description:
      "Independent Indian perfume house presenting seven permanent Eau de Parfum creations and two Objects of scent.",
    publisher: { "@id": `${BASE_URL}/#organization` },
  };
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

const DEFAULT_OFFER_POLICIES = {
  priceValidUntil: "2027-12-31",
  itemCondition: "https://schema.org/NewCondition",
  availability: "https://schema.org/InStock",
  seller: { "@id": `${BASE_URL}/#organization` },
  shippingDetails: {
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
  },
  hasMerchantReturnPolicy: {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "IN",
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 7,
    returnMethod: "https://schema.org/ReturnByMail",
    returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
  },
};

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
  reviewSummary?: ReviewSummary | null;
  reviews?: PublicReview[];
}) {
  const url = toAbsoluteUrl(params.path);
  const schema: Record<string, unknown> = {
    "@type": "Product",
    "@id": `${url}#product`,
    name: params.name,
    sku: `LP-${params.slug.toUpperCase()}`,
    category: params.category,
    description: params.description,
    image: Array.from(new Set(params.images.map(toAbsoluteUrl))),
    brand: {
      "@type": "Brand",
      name: "Ligero Parfum",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: params.price,
      url,
      ...DEFAULT_OFFER_POLICIES,
    },
  };

  if (params.size) {
    schema.size = params.size;
  }
  if (params.material) {
    schema.material = params.material;
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

export function buildCollectionListSchema(perfumes: Product[], objects: HouseObject[]) {
  const entries = [
    ...perfumes.map((p) => ({
      name: p.name,
      url: toAbsoluteUrl(`/collection/${p.slug}`),
      image: toAbsoluteUrl(getPerfumeCutoutImage(p)),
      price: p.price,
      description: p.oneLiner,
    })),
    ...objects.map((o) => ({
      name: o.name,
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
    name: "Ligero Parfum Collection",
    numberOfItems: entries.length,
    itemListElement: entries.map((entry, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "Product",
        name: entry.name,
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
          availability: "https://schema.org/InStock",
          url: entry.url,
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

/** Shared review types, labels and limits (used by the form, the API route and the list). */

export interface PublicReview {
  _id: string;
  rating: number;
  name: string;
  city?: string | null;
  title?: string | null;
  body: string;
  wornFor?: string | null;
  purchaseChecked?: boolean | null;
  submittedAt: string;
}

export interface ReviewSummary {
  average: number;
  count: number;
}

export const WORN_FOR_OPTIONS = [
  { value: "less-than-a-week", label: "Less than a week" },
  { value: "a-few-weeks", label: "A few weeks" },
  { value: "several-months", label: "Several months" },
  { value: "a-year-or-more", label: "A year or more" },
] as const;

export const WORN_FOR_LABEL: Record<string, string> = Object.fromEntries(
  WORN_FOR_OPTIONS.map((o) => [o.value, o.label]),
);

export const REVIEW_LIMITS = {
  name: 60,
  city: 60,
  title: 100,
  bodyMin: 20,
  bodyMax: 1200,
} as const;

/** Average and count computed from real approved reviews only. Null when there are none. */
export function summarizeReviews(reviews: PublicReview[]): ReviewSummary | null {
  if (reviews.length === 0) return null;
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return { average: total / reviews.length, count: reviews.length };
}

/**
 * Authentic customer reviews received via direct correspondence / WhatsApp feedback.
 * Synchronized with Sanity document schema (`customerReview`).
 */
export const REAL_APPROVED_REVIEWS: Record<string, PublicReview[]> = {
  blanc: [
    {
      _id: "f7992662-2226-4d5b-bc44-a1de6aa30b4c",
      rating: 5,
      name: "Verified Collector",
      city: null,
      title: "Loved both of them — placing a repeat order",
      body: "Thank you Baljit for the lovely two fragrance, car Perfume and Blanc perfume\nWe loved both of them.\n\nEach one has its own unique fragrance, and the quality is excellent. The scents are refreshing, premium, and long-lasting. We were so impressed that we're placing a repeat order. Highly recommended!",
      wornFor: "a-few-weeks",
      purchaseChecked: true,
      submittedAt: "2026-11-11T15:17:00.000Z",
    },
  ],
  "en-route": [
    {
      _id: "d1feefea-fb6b-4e52-aac0-9d44cc065f76",
      rating: 5,
      name: "Verified Collector",
      city: null,
      title: "Scents are refreshing, premium, and long-lasting",
      body: "Thank you Baljit for the lovely two fragrance, car Perfume and Blanc perfume\nWe loved both of them.\n\nEach one has its own unique fragrance, and the quality is excellent. The scents are refreshing, premium, and long-lasting. We were so impressed that we're placing a repeat order. Highly recommended!",
      wornFor: "a-few-weeks",
      purchaseChecked: true,
      submittedAt: "2026-11-11T15:17:00.000Z",
    },
  ],
  aube: [
    {
      _id: "d047fe2a-bbb9-41bb-9960-efe535cfef8f",
      rating: 5,
      name: "Verified Collector",
      city: null,
      title: "Loved the packaging and the fragrance",
      body: "Really loved the packaging and the fragrance 💗\nIt’s such a nice, refreshing scent and I’ve been enjoying wearing it every day\nSuper happy with the purchase 🤩",
      wornFor: "a-few-weeks",
      purchaseChecked: true,
      submittedAt: "2026-11-11T20:27:00.000Z",
    },
  ],
};

import { randomUUID } from "node:crypto";
import { type NextRequest } from "next/server";
import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { getLiveObjects, getLivePerfumes } from "@/lib/sanity/data";
import { REVIEW_LIMITS, WORN_FOR_OPTIONS } from "@/lib/reviews";
import {
  createRateLimiter,
  getClientIp,
  rateLimitHeaders,
  readBoundedJsonObject,
  sanitizeText,
  secureJson,
} from "@/lib/security";

export const runtime = "nodejs";

/**
 * Receives a review from a product page and saves it to Sanity under a private
 * `drafts.review-*` document ID with status "pending".
 * Keeping reviews under `drafts.*` ensures reviewer email addresses are NEVER
 * queryable via unauthenticated public Sanity GROQ queries, while remaining
 * editable to authenticated team members in `/studio`.
 */

const MIN_FILL_MS = 4000;
const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1000;
const MAX_BODY_BYTES = 16 * 1024;

const reviewLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 3,
});

type FieldErrors = Partial<Record<"rating" | "name" | "email" | "body" | "form", string>>;

function fail(
  status: number,
  errors: FieldErrors,
  extraHeaders?: Record<string, string>
) {
  return secureJson({ ok: false, errors }, status, extraHeaders);
}

export async function POST(req: NextRequest) {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) {
    return fail(503, { form: "Reviews are not open yet. Please check back soon." });
  }

  const parsed = await readBoundedJsonObject(req, MAX_BODY_BYTES);
  if (!parsed.ok) {
    return fail(parsed.status, {
      form:
        parsed.status === 413
          ? "This review is too long to send. Shorten it and try again."
          : "This request could not be read. Reload the page and try again.",
    });
  }
  const payload = parsed.data;

  // Honeypot: real visitors never see or fill this field. Pretend success to bots.
  if (typeof payload.website === "string" && payload.website.trim() !== "") {
    return secureJson({ ok: true });
  }

  const now = Date.now();
  const startedAt = Number(payload.startedAt);
  if (
    !Number.isFinite(startedAt) ||
    startedAt > now ||
    now - startedAt < MIN_FILL_MS ||
    now - startedAt > MAX_FORM_AGE_MS
  ) {
    return fail(429, { form: "That was quick. Take a moment and send it again." });
  }

  const ip = getClientIp(req);
  const limit = reviewLimiter.check(ip);
  if (!limit.allowed) {
    return fail(
      429,
      { form: "Three reviews an hour is the limit. Try again later." },
      rateLimitHeaders(limit)
    );
  }

  const slug = sanitizeText(payload.perfumeSlug, 80);
  const [perfumes, objects] = await Promise.all([
    getLivePerfumes(),
    getLiveObjects(),
  ]);
  const validSlug =
    perfumes.some((p) => p.slug === slug) ||
    objects.some((o) => o.slug === slug);
  if (!validSlug) {
    return fail(400, { form: "This perfume could not be found." });
  }

  const errors: FieldErrors = {};

  const rating = Number(payload.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    errors.rating = "Choose a rating from one to five.";
  }

  const name = sanitizeText(payload.name, REVIEW_LIMITS.name);
  if (!name) errors.name = "Add the name to show on the review.";

  const email = sanitizeText(payload.email, 120).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.email = "This email is not valid. Check the address.";
  }

  const body = sanitizeText(payload.body, REVIEW_LIMITS.bodyMax, true);
  if (body.length < REVIEW_LIMITS.bodyMin) {
    errors.body = `Write at least ${REVIEW_LIMITS.bodyMin} characters.`;
  } else if (/https?:\/\/|www\./i.test(body)) {
    errors.body = "Links are not accepted in reviews. Remove the link.";
  }

  if (Object.keys(errors).length > 0) return fail(422, errors);

  const wornForRaw = sanitizeText(payload.wornFor, 40);
  const wornFor = WORN_FOR_OPTIONS.some((o) => o.value === wornForRaw) ? wornForRaw : undefined;

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
    perspective: "raw",
  });

  try {
    await client.create({
      _id: `drafts.review-${randomUUID()}`,
      _type: "customerReview",
      status: "pending",
      perfumeSlug: slug,
      rating,
      name,
      city: sanitizeText(payload.city, REVIEW_LIMITS.city) || undefined,
      title: sanitizeText(payload.title, REVIEW_LIMITS.title) || undefined,
      body,
      wornFor,
      email,
      purchaseChecked: false,
      submittedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Reviews] Could not save review:", error);
    return fail(502, { form: "The review could not be saved. Try again in a moment." });
  }

  return secureJson({ ok: true }, 200, rateLimitHeaders(limit));
}

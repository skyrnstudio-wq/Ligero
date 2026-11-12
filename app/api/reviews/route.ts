import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { PERFUMES } from "@/lib/products";
import { REVIEW_LIMITS, WORN_FOR_OPTIONS } from "@/lib/reviews";

export const runtime = "nodejs";

/**
 * Receives a review from a product page and saves it to Sanity as "pending".
 * Nothing is shown on the site until someone at the house approves it in the Studio.
 *
 * Needs SANITY_API_WRITE_TOKEN (an Editor token) in the server environment.
 */

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const MIN_FILL_MS = 4000;
const hits = new Map<string, number[]>();

function tooMany(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

function clean(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  // strip control characters, collapse stray whitespace, cap length
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max);
}

type FieldErrors = Partial<Record<"rating" | "name" | "email" | "body" | "form", string>>;

function fail(status: number, errors: FieldErrors) {
  return NextResponse.json({ ok: false, errors }, { status });
}

export async function POST(req: NextRequest) {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) {
    return fail(503, { form: "Reviews are not open yet. Please check back soon." });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return fail(400, { form: "This request could not be read. Reload the page and try again." });
  }

  // Honeypot: real visitors never see or fill this field. Pretend success to bots.
  if (typeof payload.website === "string" && payload.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const startedAt = Number(payload.startedAt);
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS) {
    return fail(429, { form: "That was quick. Take a moment and send it again." });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (tooMany(ip)) {
    return fail(429, { form: "Three reviews an hour is the limit. Try again later." });
  }

  const slug = clean(payload.perfumeSlug, 80);
  if (!PERFUMES.some((p) => p.slug === slug)) {
    return fail(400, { form: "This perfume could not be found." });
  }

  const errors: FieldErrors = {};

  const rating = Number(payload.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    errors.rating = "Choose a rating from one to five.";
  }

  const name = clean(payload.name, REVIEW_LIMITS.name);
  if (!name) errors.name = "Add the name to show on the review.";

  const email = clean(payload.email, 120);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.email = "This email is not valid. Check the address.";
  }

  const body = clean(payload.body, REVIEW_LIMITS.bodyMax);
  if (body.length < REVIEW_LIMITS.bodyMin) {
    errors.body = `Write at least ${REVIEW_LIMITS.bodyMin} characters.`;
  } else if (/https?:\/\/|www\./i.test(body)) {
    errors.body = "Links are not accepted in reviews. Remove the link.";
  }

  if (Object.keys(errors).length > 0) return fail(422, errors);

  const wornForRaw = clean(payload.wornFor, 40);
  const wornFor = WORN_FOR_OPTIONS.some((o) => o.value === wornForRaw) ? wornForRaw : undefined;

  const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

  try {
    await client.create({
      _type: "customerReview",
      status: "pending",
      perfumeSlug: slug,
      rating,
      name,
      city: clean(payload.city, REVIEW_LIMITS.city) || undefined,
      title: clean(payload.title, REVIEW_LIMITS.title) || undefined,
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

  return NextResponse.json({ ok: true });
}

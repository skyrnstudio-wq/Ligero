import { createHash } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export const runtime = "nodejs";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_WINDOW = 10;
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

function cleanText(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, max);
}

function getSubscriberDocId(normalizedEmail: string): string {
  const hash = createHash("sha256").update(normalizedEmail).digest("hex").slice(0, 24);
  return `drafts.correspondence-${hash}`;
}

export async function POST(req: NextRequest) {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "The Correspondence is temporarily unavailable. Write to sales@ligeroparfums.com." },
      { status: 503 }
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "This request could not be read. Reload the page and try again." },
      { status: 400 }
    );
  }

  // Honeypot: real visitors never fill this field.
  if (typeof payload.website === "string" && payload.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (tooMany(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests right now. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  const email = cleanText(payload.email, 160).toLowerCase();
  if (!email.includes("@")) {
    return NextResponse.json(
      { ok: false, error: "This email is missing an @. Check the address." },
      { status: 422 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: "This email is not valid. Check the address." },
      { status: 422 }
    );
  }

  const source = payload.source === "strip" ? "strip" : "default";
  const rawPagePath = cleanText(payload.pagePath, 160);
  const pagePath = rawPagePath.startsWith("/") ? rawPagePath : undefined;

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
    perspective: "raw",
  });

  const docId = getSubscriberDocId(email);
  const now = new Date().toISOString();

  try {
    const existing = await client.fetch<{ _id: string; status?: string } | null>(
      `*[_type == "correspondenceSubscriber" && (_id == $docId || lower(email) == $email)][0]{ _id, status }`,
      { docId, email }
    );

    if (existing?._id) {
      await client
        .patch(existing._id)
        .set({
          lastSubmittedAt: now,
          source,
          ...(pagePath ? { pagePath } : {}),
          ...(existing.status !== "subscribed"
            ? { status: "subscribed", subscribedAt: now }
            : {}),
        })
        .commit();

      return NextResponse.json({
        ok: true,
        alreadySubscribed: existing.status === "subscribed",
      });
    }

    await client.create({
      _id: docId,
      _type: "correspondenceSubscriber",
      email,
      status: "subscribed",
      source,
      ...(pagePath ? { pagePath } : {}),
      subscribedAt: now,
      lastSubmittedAt: now,
    });

    return NextResponse.json({ ok: true, alreadySubscribed: false });
  } catch (error) {
    console.error("[Correspondence] Failed to save subscriber email:", error);
    return NextResponse.json(
      { ok: false, error: "Could not save your email right now. Please try again in a moment." },
      { status: 502 }
    );
  }
}

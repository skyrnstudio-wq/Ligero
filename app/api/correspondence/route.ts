import { createHash, randomUUID } from "node:crypto";
import { type NextRequest } from "next/server";
import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import {
  isEmailConfigured,
  sendCorrespondenceNotificationEmail,
  type CorrespondenceEmailData,
} from "@/lib/email";
import {
  createRateLimiter,
  getClientIp,
  isSafePagePath,
  rateLimitHeaders,
  readBoundedJsonObject,
  sanitizeText,
  secureJson,
} from "@/lib/security";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 8 * 1024;
const correspondenceLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
});

function getSubscriberEmailHash(normalizedEmail: string): string {
  return createHash("sha256").update(normalizedEmail).digest("hex").slice(0, 24);
}

export async function POST(req: NextRequest) {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  const emailConfigured = isEmailConfigured();
  if (!token && !emailConfigured) {
    return secureJson(
      { ok: false, error: "The Correspondence is temporarily unavailable. Write to sales@ligeroparfum.com." },
      503
    );
  }

  const parsed = await readBoundedJsonObject(req, MAX_BODY_BYTES);
  if (!parsed.ok) {
    return secureJson(
      {
        ok: false,
        error:
          parsed.status === 413
            ? "This request is too large. Reload the page and try again."
            : "This request could not be read. Reload the page and try again.",
      },
      parsed.status
    );
  }
  const payload = parsed.data;

  // Honeypot: real visitors never fill this field.
  if (typeof payload.website === "string" && payload.website.trim() !== "") {
    return secureJson({ ok: true });
  }

  const limit = correspondenceLimiter.check(getClientIp(req));
  if (!limit.allowed) {
    return secureJson(
      { ok: false, error: "Too many requests right now. Please try again in a few minutes." },
      429,
      rateLimitHeaders(limit)
    );
  }

  const email = sanitizeText(payload.email, 160).toLowerCase();
  if (!email.includes("@")) {
    return secureJson(
      { ok: false, error: "This email is missing an @. Check the address." },
      422
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return secureJson(
      { ok: false, error: "This email is not valid. Check the address." },
      422
    );
  }

  const source = payload.source === "strip" ? "strip" : "default";
  const rawPagePath = sanitizeText(payload.pagePath, 160);
  const pagePath = isSafePagePath(rawPagePath) ? rawPagePath : undefined;

  const emailHash = getSubscriberEmailHash(email);
  const docId = `drafts.correspondence-${emailHash}`;
  const now = new Date().toISOString();

  let savedToSanity = false;
  let submissionKind: CorrespondenceEmailData["submissionKind"] = "new";

  if (token) {
    const client = createClient({
      projectId,
      dataset,
      apiVersion,
      token,
      useCdn: false,
      perspective: "raw",
    });

    try {
      const existing = await client.fetch<{ _id: string; status?: string } | null>(
        `*[_type == "correspondenceSubscriber" && (_id == $docId || lower(email) == $email)][0]{ _id, status }`,
        { docId, email }
      );

      if (existing?._id) {
        submissionKind = existing.status !== "subscribed" ? "resubscribed" : "returning";
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
      } else {
        submissionKind = "new";
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
      }

      savedToSanity = true;
    } catch (error) {
      console.error("[Correspondence] Failed to save subscriber email:", error);
    }
  }

  const emailResult = await sendCorrespondenceNotificationEmail({
    email,
    source,
    pagePath,
    submittedAt: now,
    submissionKind,
    savedToSanity,
    idempotencyId: `${emailHash}-${randomUUID()}`,
  }).catch((error) => ({
    ok: false as const,
    skipped: false,
    error: error instanceof Error ? error.message : "Failed to send notification email.",
  }));

  if (!emailResult.ok) {
    if (emailResult.skipped) {
      console.warn("[Correspondence] Sales notification email skipped:", emailResult.error);
    } else {
      console.error("[Correspondence] Failed to send sales notification email:", emailResult.error);
    }
  }

  if (!savedToSanity && !emailResult.ok) {
    return secureJson(
      { ok: false, error: "Could not save your email right now. Please try again in a moment." },
      502
    );
  }

  // Return identical success payload to avoid email enumeration
  return secureJson({ ok: true }, 200, rateLimitHeaders(limit));
}

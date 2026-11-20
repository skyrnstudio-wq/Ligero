import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const SECURE_NO_STORE_HEADERS: Record<string, string> = {
  "Cache-Control": "no-store, private, max-age=0",
  Pragma: "no-cache",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
}

/**
 * Bounded, self-pruning sliding-window rate limiter safe against IP-spoofing memory exhaustion.
 */
export function createRateLimiter(options: {
  windowMs: number;
  max: number;
  maxKeys?: number;
}) {
  const { windowMs, max, maxKeys = 10_000 } = options;
  const buckets = new Map<string, number[]>();

  function pruneExpired(now: number) {
    for (const [key, timestamps] of buckets.entries()) {
      const recent = timestamps.filter((t) => now - t < windowMs);
      if (recent.length === 0) {
        buckets.delete(key);
      } else if (recent.length !== timestamps.length) {
        buckets.set(key, recent);
      }
    }
  }

  function check(rawKey: string): RateLimitResult {
    const key = (rawKey || "unknown").slice(0, 96);
    const now = Date.now();

    if (buckets.size >= maxKeys && !buckets.has(key)) {
      pruneExpired(now);
      // If still at capacity, evict oldest inserted entry (Map preserves insertion order)
      if (buckets.size >= maxKeys) {
        const oldestKey = buckets.keys().next().value;
        if (oldestKey !== undefined) {
          buckets.delete(oldestKey);
        }
      }
    }

    const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
    if (recent.length >= max) {
      buckets.set(key, recent);
      const oldestInWindow = recent[0] ?? now;
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((oldestInWindow + windowMs - now) / 1000)
      );
      return {
        allowed: false,
        limit: max,
        remaining: 0,
        retryAfterSeconds,
      };
    }

    recent.push(now);
    // Re-insert so recently active keys stay at the tail of LRU order
    buckets.delete(key);
    buckets.set(key, recent);

    return {
      allowed: true,
      limit: max,
      remaining: Math.max(0, max - recent.length),
      retryAfterSeconds: 0,
    };
  }

  return { check };
}

/**
 * Extracts a normalized client IP from trusted proxy headers with safe bounds.
 */
export function getClientIp(req: NextRequest): string {
  const candidates = [
    req.headers.get("cf-connecting-ip"),
    req.headers.get("x-vercel-forwarded-for")?.split(",")[0],
    req.headers.get("x-real-ip"),
    req.headers.get("x-forwarded-for")?.split(",")[0],
  ];

  for (const candidate of candidates) {
    const cleaned = candidate?.trim();
    if (cleaned && /^[0-9a-fA-F:.]{3,64}$/.test(cleaned)) {
      return cleaned;
    }
  }

  return "unknown";
}

export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
  };
  if (!result.allowed && result.retryAfterSeconds > 0) {
    headers["Retry-After"] = String(result.retryAfterSeconds);
  }
  return headers;
}

export function secureJson(
  body: unknown,
  status = 200,
  extraHeaders?: Record<string, string>
): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: {
      ...SECURE_NO_STORE_HEADERS,
      ...(extraHeaders || {}),
    },
  });
}

export type BoundedTextResult =
  | { ok: true; text: string }
  | { ok: false; status: number; error: string };

/**
 * Reads a request body as UTF-8 text while enforcing a strict byte limit to prevent memory DoS.
 */
export async function readBoundedText(
  req: Request,
  maxBytes: number
): Promise<BoundedTextResult> {
  const contentLengthHeader = req.headers.get("content-length");
  if (contentLengthHeader) {
    const declaredBytes = Number(contentLengthHeader);
    if (Number.isFinite(declaredBytes) && declaredBytes > maxBytes) {
      return {
        ok: false,
        status: 413,
        error: "Request payload exceeds the maximum allowed size.",
      };
    }
  }

  try {
    const reader = req.body?.getReader();
    if (!reader) {
      const text = await req.text();
      if (Buffer.byteLength(text, "utf8") > maxBytes) {
        return {
          ok: false,
          status: 413,
          error: "Request payload exceeds the maximum allowed size.",
        };
      }
      return { ok: true, text };
    }

    const chunks: Uint8Array[] = [];
    let totalBytes = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        totalBytes += value.byteLength;
        if (totalBytes > maxBytes) {
          await reader.cancel().catch(() => undefined);
          return {
            ok: false,
            status: 413,
            error: "Request payload exceeds the maximum allowed size.",
          };
        }
        chunks.push(value);
      }
    }

    const combined = Buffer.concat(chunks.map((c) => Buffer.from(c)));
    return { ok: true, text: combined.toString("utf8") };
  } catch {
    return {
      ok: false,
      status: 400,
      error: "Unable to read request body.",
    };
  }
}

export type BoundedJsonResult =
  | { ok: true; data: Record<string, unknown> }
  | { ok: false; status: number; error: string };

/**
 * Reads and parses a bounded JSON object body. Rejects oversized bodies (413),
 * malformed JSON (400), and non-object JSON values such as arrays or primitives (400).
 */
export async function readBoundedJsonObject(
  req: Request,
  maxBytes: number
): Promise<BoundedJsonResult> {
  const bodyResult = await readBoundedText(req, maxBytes);
  if (!bodyResult.ok) {
    return bodyResult;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(bodyResult.text);
  } catch {
    return {
      ok: false,
      status: 400,
      error: "Invalid JSON request body.",
    };
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return {
      ok: false,
      status: 400,
      error: "Request body must be a valid JSON object.",
    };
  }

  return { ok: true, data: parsed as Record<string, unknown> };
}

/**
 * Strips ASCII control characters and Unicode bidirectional override characters.
 */
export function sanitizeText(value: unknown, maxLength: number, allowNewlines = false): string {
  if (typeof value !== "string") return "";
  const controlPattern = allowNewlines
    ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u202A-\u202E\u2066-\u2069]/g
    : /[\u0000-\u001F\u007F\u202A-\u202E\u2066-\u2069]/g;
  return value.replace(controlPattern, "").trim().slice(0, maxLength);
}

/**
 * Strips CR, LF, and NUL characters to prevent SMTP or HTTP header injection.
 */
export function stripHeaderNewlines(value: string): string {
  return value.replace(/[\r\n\0]/g, " ").trim();
}

export function isValidSlug(value: unknown): value is string {
  return typeof value === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= 96;
}

export function isSafePagePath(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith("//") &&
    /^\/[a-zA-Z0-9/_-]{0,160}$/.test(value)
  );
}

/**
 * Strips query parameters and fragments from a URL before writing to logs or telemetry.
 */
export function scrubUrlForLogs(raw: unknown): string {
  if (typeof raw !== "string" || !raw.trim()) return "";
  const trimmed = raw.trim().slice(0, 512);
  try {
    const parsed = new URL(trimmed);
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return trimmed.split(/[?#]/)[0].slice(0, 200);
  }
}

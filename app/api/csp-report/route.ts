import { NextResponse, type NextRequest } from "next/server";
import {
  SECURE_NO_STORE_HEADERS,
  createRateLimiter,
  getClientIp,
  readBoundedText,
  sanitizeText,
  scrubUrlForLogs,
} from "@/lib/security";

export const runtime = "nodejs";

const cspReportLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 120,
});

function summarizeViolation(raw: Record<string, unknown>) {
  const report =
    raw["csp-report"] && typeof raw["csp-report"] === "object"
      ? (raw["csp-report"] as Record<string, unknown>)
      : raw.body && typeof raw.body === "object"
        ? (raw.body as Record<string, unknown>)
        : raw;

  return {
    type: sanitizeText(raw.type || "csp-violation", 48),
    effectiveDirective: sanitizeText(
      report["effective-directive"] || report.effectiveDirective || report["violated-directive"],
      64
    ),
    disposition: sanitizeText(report.disposition, 24),
    documentUri: scrubUrlForLogs(report["document-uri"] || report.documentURL || raw.url),
    blockedUri: scrubUrlForLogs(report["blocked-uri"] || report.blockedURL),
    sample: sanitizeText(report["script-sample"] || report.sample, 64),
  };
}

export async function POST(req: NextRequest) {
  const limit = cspReportLimiter.check(getClientIp(req));
  if (!limit.allowed) {
    return new NextResponse(null, {
      status: 429,
      headers: SECURE_NO_STORE_HEADERS,
    });
  }

  const bodyResult = await readBoundedText(req, 16 * 1024);
  if (!bodyResult.ok) {
    return new NextResponse(null, {
      status: bodyResult.status,
      headers: SECURE_NO_STORE_HEADERS,
    });
  }

  try {
    const parsed: unknown = JSON.parse(bodyResult.text);
    const items = Array.isArray(parsed) ? parsed.slice(0, 10) : [parsed];
    const sanitized = items
      .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
      .map(summarizeViolation)
      .filter((entry) => entry.effectiveDirective || entry.blockedUri);

    if (sanitized.length > 0) {
      console.warn("[CSP Report]", JSON.stringify(sanitized));
    }
  } catch {
    // Ignore malformed browser telemetry payloads cleanly
  }

  return new NextResponse(null, {
    status: 204,
    headers: SECURE_NO_STORE_HEADERS,
  });
}

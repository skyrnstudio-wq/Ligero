import { NextResponse, type NextRequest } from "next/server";

const WEBHOOK_AND_TELEMETRY_PATHS = new Set([
  "/api/razorpay/webhook",
  "/api/orders/dispatch-webhook",
  "/api/revalidate",
  "/api/csp-report",
]);

const STATIC_EXTENSION_RE = /\.(?:png|jpe?g|webp|avif|gif|svg|ico|xml|txt|md|json|webmanifest|css|js|woff2?)$/i;

function isSameOriginHeader(originHeader: string, req: NextRequest): boolean {
  try {
    const originUrl = new URL(originHeader);
    const requestHost = (
      req.headers.get("x-forwarded-host") ||
      req.headers.get("host") ||
      req.nextUrl.host
    )
      .split(",")[0]
      .trim()
      .toLowerCase();

    return Boolean(requestHost) && originUrl.host.toLowerCase() === requestHost;
  } catch {
    return false;
  }
}

function buildStorefrontCsp(isHttps: boolean): string {
  const isDev = process.env.NODE_ENV !== "production";
  const scriptSrc = [
    "'self'",
    "'unsafe-inline'",
    ...(isDev ? ["'unsafe-eval'"] : []),
    "https://checkout.razorpay.com",
    "https://*.razorpay.com",
    "'report-sample'",
  ].join(" ");

  const directives = [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://cdn.sanity.io https://*.razorpay.com",
    "font-src 'self' data:",
    "connect-src 'self' https://api.razorpay.com https://lumberjack.razorpay.com https://lumberjack-cx.razorpay.com https://*.razorpay.com",
    "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://*.razorpay.com",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'self' https://api.razorpay.com https://checkout.razorpay.com",
    "frame-ancestors 'none'",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "report-to default",
    ...(isHttps ? ["upgrade-insecure-requests"] : []),
  ];

  return directives.join("; ");
}

function buildStudioCsp(isHttps: boolean): string {
  const directives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://core.sanity-cdn.com 'report-sample'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https://cdn.sanity.io https://*.sanity.io https://lh3.googleusercontent.com https://avatars.githubusercontent.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://*.sanity.io wss://*.sanity.io https://*.api.sanity.io wss://*.api.sanity.io https://*.apicdn.sanity.io https://cdn.sanity.io https://sanity-cdn.com https://*.sanity-cdn.com https://registry.npmjs.org",
    "frame-src 'self' https://*.sanity.io",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "worker-src 'self' blob:",
    "report-to default",
    ...(isHttps ? ["upgrade-insecure-requests"] : []),
  ];

  return directives.join("; ");
}

const API_CSP = "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'";

const PERMISSIONS_POLICY =
  'camera=(), geolocation=(), microphone=(), usb=(), bluetooth=(), interest-cohort=(), browsing-topics=(), focus-without-user-activation=(), payment=(self "https://checkout.razorpay.com" "https://api.razorpay.com")';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isApi = pathname.startsWith("/api/");
  const isStudio = pathname === "/studio" || pathname.startsWith("/studio/");
  const isCheckout = pathname === "/checkout" || pathname.startsWith("/checkout/");
  const isPublicMedia =
    pathname.startsWith("/images/") ||
    pathname === "/icon.png" ||
    pathname === "/apple-icon.png" ||
    pathname.startsWith("/opengraph-image") ||
    pathname.startsWith("/twitter-image");

  // Fetch Metadata & Origin CSRF defense-in-depth for first-party API endpoints
  if (isApi && !WEBHOOK_AND_TELEMETRY_PATHS.has(pathname)) {
    const fetchSite = req.headers.get("sec-fetch-site");
    if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") {
      return NextResponse.json(
        { success: false, error: "Cross-site API requests are forbidden." },
        {
          status: 403,
          headers: {
            "Cache-Control": "no-store, private, max-age=0",
            Pragma: "no-cache",
            "X-Content-Type-Options": "nosniff",
            Vary: "Sec-Fetch-Dest, Sec-Fetch-Mode, Sec-Fetch-Site",
          },
        }
      );
    }

    if (!["GET", "HEAD", "OPTIONS"].includes(req.method.toUpperCase())) {
      const origin = req.headers.get("origin");
      if (origin && !isSameOriginHeader(origin, req)) {
        return NextResponse.json(
          { success: false, error: "Request origin is not permitted." },
          {
            status: 403,
            headers: {
              "Cache-Control": "no-store, private, max-age=0",
              Pragma: "no-cache",
              "X-Content-Type-Options": "nosniff",
              Vary: "Origin, Sec-Fetch-Dest, Sec-Fetch-Mode, Sec-Fetch-Site",
            },
          }
        );
      }
    }
  }

  const res = NextResponse.next();

  const forwardedProto = req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const isHttps = forwardedProto === "https" || req.nextUrl.protocol === "https:";

  // Core & Companion Security Headers
  res.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set(
    "Referrer-Policy",
    isCheckout ? "no-referrer" : "strict-origin-when-cross-origin"
  );
  res.headers.set("Permissions-Policy", PERMISSIONS_POLICY);
  res.headers.set("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.headers.set(
    "Cross-Origin-Resource-Policy",
    isPublicMedia ? "cross-origin" : "same-origin"
  );
  res.headers.set("X-DNS-Prefetch-Control", "off");
  res.headers.set("Reporting-Endpoints", 'default="/api/csp-report"');

  if (isApi) {
    res.headers.set("Content-Security-Policy", API_CSP);
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    if (!WEBHOOK_AND_TELEMETRY_PATHS.has(pathname)) {
      res.headers.append("Vary", "Sec-Fetch-Dest, Sec-Fetch-Mode, Sec-Fetch-Site");
    }
  } else if (isStudio) {
    res.headers.set("Content-Security-Policy", buildStudioCsp(isHttps));
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  } else {
    res.headers.set("Content-Security-Policy", buildStorefrontCsp(isHttps));
    if (isCheckout) {
      res.headers.set("Cache-Control", "no-store, private, max-age=0");
      res.headers.set("Pragma", "no-cache");
      res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    } else if (!STATIC_EXTENSION_RE.test(pathname)) {
      // Agent-readiness discovery headers on public HTML pages
      res.headers.set(
        "Link",
        '</llms.txt>; rel="describedby"; type="text/plain", </pricing.md>; rel="alternate"; type="text/markdown"'
      );
    }
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

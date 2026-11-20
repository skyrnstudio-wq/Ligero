import { test, expect } from "@playwright/test";
import { captureConsoleErrors } from "../helpers/responsive-assertions";

test.describe("Security Hardening & SEO / AI-SEO Verification", () => {
  test("Storefront responses enforce core & companion HTTP security headers without X-Powered-By", async ({
    request,
  }) => {
    const res = await request.get("/");
    expect(res.status()).toBe(200);

    const h = res.headers();
    expect(h["x-powered-by"]).toBeUndefined();
    expect(h["strict-transport-security"]).toContain("max-age=31536000");
    expect(h["strict-transport-security"]).toContain("includeSubDomains");
    expect(h["x-content-type-options"]).toBe("nosniff");
    expect(h["x-frame-options"]).toBe("DENY");
    expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(h["cross-origin-opener-policy"]).toBe("same-origin-allow-popups");
    expect(h["cross-origin-resource-policy"]).toBe("same-origin");
    expect(h["x-dns-prefetch-control"]).toBe("off");
    expect(h["reporting-endpoints"]).toContain("/api/csp-report");
    expect(h["permissions-policy"]).toContain("camera=()");
    expect(h["permissions-policy"]).toContain("microphone=()");
    expect(h["permissions-policy"]).toContain("geolocation=()");
    expect(h["permissions-policy"]).toContain("focus-without-user-activation=()");

    const csp = h["content-security-policy"] || "";
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'none'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("report-to default");

    // Agent-readiness discovery Link header on public HTML
    const linkHeader = h["link"] || "";
    expect(linkHeader).toContain("</llms.txt>");
    expect(linkHeader).toContain("</pricing.md>");
  });

  test("Checkout, Studio, Images, and API routes apply tailored security and indexing headers", async ({
    request,
  }) => {
    const checkoutRes = await request.get("/checkout");
    expect(checkoutRes.status()).toBe(200);
    expect(checkoutRes.headers()["referrer-policy"]).toBe("no-referrer");
    expect(checkoutRes.headers()["cache-control"]).toContain("no-store");
    expect(checkoutRes.headers()["x-robots-tag"]).toContain("noindex");

    const studioRes = await request.get("/studio");
    expect(studioRes.status()).toBe(200);
    expect(studioRes.headers()["x-robots-tag"]).toContain("noindex");
    expect(studioRes.headers()["content-security-policy"]).toContain("frame-ancestors 'none'");

    const imgRes = await request.get("/images/hero/ligero-parfum-cutout.webp");
    expect(imgRes.status()).toBe(200);
    expect(imgRes.headers()["cross-origin-resource-policy"]).toBe("cross-origin");
    expect(imgRes.headers()["cache-control"]).toContain("immutable");
  });

  test("First-party API routes block cross-site Fetch Metadata and forged Origin CSRF requests", async ({
    request,
  }) => {
    const crossSiteCorrespondence = await request.post("/api/correspondence", {
      headers: {
        "sec-fetch-site": "cross-site",
        "sec-fetch-mode": "cors",
        "sec-fetch-dest": "empty",
      },
      data: { email: "test@example.com" },
    });
    expect(crossSiteCorrespondence.status()).toBe(403);
    expect(crossSiteCorrespondence.headers()["vary"]).toContain("Sec-Fetch-Site");

    const forgedOriginOrder = await request.post("/api/razorpay/create-order", {
      headers: {
        origin: "https://attacker.example",
      },
      data: { items: [{ slug: "aube", quantity: 1 }] },
    });
    expect(forgedOriginOrder.status()).toBe(403);

    const crossSiteLookup = await request.get(
      "/api/orders/lookup?orderId=LGP-TEST-1&paymentId=pay_TEST12345678&token=abc",
      {
        headers: {
          "sec-fetch-site": "cross-site",
        },
      }
    );
    expect(crossSiteLookup.status()).toBe(403);

    const crossSiteReview = await request.post("/api/reviews", {
      headers: {
        "sec-fetch-site": "cross-site",
      },
      data: { perfumeSlug: "aube" },
    });
    expect(crossSiteReview.status()).toBe(403);
  });

  test("API routes enforce payload bounds, no-store headers, fail-closed revalidation, and CSP telemetry", async ({
    request,
  }) => {
    const oversized = await request.post("/api/correspondence", {
      headers: { "content-type": "application/json" },
      data: JSON.stringify({ email: "a@b.com", padding: "x".repeat(12_000) }),
    });
    expect(oversized.status()).toBe(413);
    expect(oversized.headers()["cache-control"]).toContain("no-store");

    const unauthRevalidate = await request.post("/api/revalidate", {
      data: { _type: "perfume" },
    });
    expect(unauthRevalidate.status()).toBe(401);
    expect(unauthRevalidate.headers()["cache-control"]).toContain("no-store");

    const cspReport = await request.post("/api/csp-report", {
      headers: { "content-type": "application/csp-report" },
      data: JSON.stringify({
        "csp-report": {
          "document-uri": "https://www.ligeroparfum.com/checkout?token=secret123",
          "violated-directive": "script-src",
          "blocked-uri": "https://evil.example/payload.js?key=abc",
        },
      }),
    });
    expect(cspReport.status()).toBe(204);
  });

  test("Technical SEO & AI-SEO discovery files serve valid canonical data", async ({
    request,
  }) => {
    const robotsRes = await request.get("/robots.txt");
    expect(robotsRes.status()).toBe(200);
    const robotsText = await robotsRes.text();
    for (const bot of ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended", "Amazonbot"]) {
      expect(robotsText).toContain(bot);
    }
    expect(robotsText).toContain("Disallow: /checkout");
    expect(robotsText).toContain("Disallow: /studio");
    expect(robotsText).toContain("https://www.ligeroparfum.com/sitemap.xml");

    const sitemapRes = await request.get("/sitemap.xml");
    expect(sitemapRes.status()).toBe(200);
    const sitemapText = await sitemapRes.text();
    expect(sitemapText).toContain("https://www.ligeroparfum.com/collection/noctis");
    expect(sitemapText).toContain("image:image");
    expect(sitemapText).not.toContain("/checkout");
    expect(sitemapText).not.toContain("/studio");

    const manifestRes = await request.get("/manifest.webmanifest");
    expect(manifestRes.status()).toBe(200);
    const manifestJson = await manifestRes.json();
    expect(manifestJson.name).toBe("Ligero Parfum");
    expect(Array.isArray(manifestJson.icons)).toBe(true);

    const ogRes = await request.get("/opengraph-image");
    expect(ogRes.status()).toBe(200);
    expect(ogRes.headers()["content-type"]).toContain("image/png");

    const twRes = await request.get("/twitter-image");
    expect(twRes.status()).toBe(200);
    expect(twRes.headers()["content-type"]).toContain("image/png");

    for (const endpoint of ["/llms.txt", "/llms-full.txt", "/pricing.md"]) {
      const res = await request.get(endpoint);
      expect(res.status()).toBe(200);
      expect(res.headers()["last-modified"]).toBeTruthy();
      const text = await res.text();
      expect(text).toContain("Last updated:");
      expect(text).toContain("https://www.ligeroparfum.com");
      expect(text).toContain("sales@ligeroparfum.com");
    }
  });

  test("Legacy SEO redirects resolve cleanly to canonical destinations", async ({ request }) => {
    for (const [source, destination] of [
      ["/perfumes", "/collection"],
      ["/perfumes/noctis", "/collection/noctis"],
      ["/car-perfume", "/objects/en-route"],
    ]) {
      const res = await request.get(source, { maxRedirects: 0 });
      expect([301, 308]).toContain(res.status());
      expect(res.headers()["location"]).toBe(destination);
    }
  });

  test("All indexable pages emit self-referencing canonicals, valid JSON-LD graphs, and zero CSP/console errors", async ({
    page,
  }) => {
    const routes = [
      { path: "/", canonical: "https://www.ligeroparfum.com", requiredTypes: ["Organization", "WebSite", "WebPage", "ItemList"] },
      { path: "/collection", canonical: "https://www.ligeroparfum.com/collection", requiredTypes: ["Organization", "CollectionPage", "ItemList", "BreadcrumbList"] },
      { path: "/collection/noctis", canonical: "https://www.ligeroparfum.com/collection/noctis", requiredTypes: ["Organization", "ItemPage", "Product", "HowTo", "FAQPage", "BreadcrumbList"] },
      { path: "/discovery-set", canonical: "https://www.ligeroparfum.com/discovery-set", requiredTypes: ["Organization", "ItemPage", "Product", "BreadcrumbList"] },
      { path: "/objects", canonical: "https://www.ligeroparfum.com/objects", requiredTypes: ["Organization", "CollectionPage", "ItemList", "BreadcrumbList"] },
      { path: "/objects/en-route", canonical: "https://www.ligeroparfum.com/objects/en-route", requiredTypes: ["Organization", "ItemPage", "Product", "BreadcrumbList"] },
      { path: "/help", canonical: "https://www.ligeroparfum.com/help", requiredTypes: ["Organization", "WebPage", "FAQPage", "BreadcrumbList"] },
      { path: "/legal", canonical: "https://www.ligeroparfum.com/legal", requiredTypes: ["Organization", "WebPage", "BreadcrumbList"] },
      { path: "/legal/privacy", canonical: "https://www.ligeroparfum.com/legal/privacy", requiredTypes: ["Organization", "WebPage", "BreadcrumbList"] },
      { path: "/legal/terms", canonical: "https://www.ligeroparfum.com/legal/terms", requiredTypes: ["Organization", "WebPage", "BreadcrumbList"] },
      { path: "/legal/shipping-returns", canonical: "https://www.ligeroparfum.com/legal/shipping-returns", requiredTypes: ["Organization", "WebPage", "BreadcrumbList"] },
      { path: "/legal/compliance-checklist", canonical: "https://www.ligeroparfum.com/legal/compliance-checklist", requiredTypes: ["Organization", "WebPage", "BreadcrumbList"] },
    ];

    for (const route of routes) {
      const { getErrors } = captureConsoleErrors(page);
      const res = await page.goto(route.path, { waitUntil: "domcontentloaded" });
      expect(res?.status(), `HTTP 200 for ${route.path}`).toBe(200);

      // Single H1 check
      const h1Count = await page.locator("h1").count();
      expect(h1Count, `Expected exactly 1 H1 on ${route.path}`).toBe(1);

      // Self-referencing canonical check
      const canonicalHref = await page
        .locator('link[rel="canonical"]')
        .first()
        .getAttribute("href");
      expect(canonicalHref, `Canonical for ${route.path}`).toBe(route.canonical);

      // Meta description length check (non-empty and concise)
      const metaDesc = await page
        .locator('meta[name="description"]')
        .first()
        .getAttribute("content");
      expect(metaDesc?.length || 0, `Meta description length on ${route.path}`).toBeGreaterThan(50);
      expect(metaDesc?.length || 0, `Meta description <= 165 chars on ${route.path}`).toBeLessThanOrEqual(165);

      // JSON-LD schema verification via live DOM (per seo-audit skill)
      const schemas = await page.evaluate(() => {
        const scripts = Array.from(
          document.querySelectorAll('script[type="application/ld+json"]')
        );
        return scripts.map((s) => JSON.parse(s.textContent || "{}"));
      });
      expect(schemas.length, `JSON-LD present on ${route.path}`).toBeGreaterThanOrEqual(1);
      const graphTypes = schemas.flatMap((doc) =>
        Array.isArray(doc["@graph"])
          ? doc["@graph"].map((n: { "@type"?: string }) => n["@type"])
          : [doc["@type"]]
      );
      for (const reqType of route.requiredTypes) {
        expect(graphTypes, `Schema ${reqType} on ${route.path}`).toContain(reqType);
      }

      const errors = getErrors();
      expect(errors, `Zero console/CSP errors on ${route.path}`).toHaveLength(0);
    }

    // 404 route must NOT inherit homepage canonical
    const notFoundRes = await page.goto("/non-existent-seo-check-route", {
      waitUntil: "domcontentloaded",
    });
    expect(notFoundRes?.status()).toBe(404);
    const notFoundCanonical = await page.locator('link[rel="canonical"]').count();
    expect(notFoundCanonical).toBe(0);
  });

  test("Footer eliminates orphan legal pages by linking to Statutory Disclosures and Legal hub", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator('footer a[href="/legal/compliance-checklist"]')).toBeAttached();
    await expect(page.locator('footer a[href="/legal"]')).toBeAttached();
  });
});

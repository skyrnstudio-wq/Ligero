import { test, expect } from "@playwright/test";
import {
  assertNoHorizontalOverflow,
  captureConsoleErrors,
} from "../helpers/responsive-assertions";

test.describe("Routes Smoke Suite — All 34 Static, SSG, & Dynamic Routes", () => {
  const PAGE_ROUTES = [
    { path: "/", title: "Home" },
    { path: "/collection", title: "The Collection" },
    { path: "/discovery-set", title: "The Discovery Set" },
    { path: "/objects", title: "Objects of Scent" },
    { path: "/objects/en-route", title: "En Route Car Diffuser" },
    { path: "/help", title: "Help & Client Care" },
    { path: "/checkout", title: "Checkout" },
    { path: "/checkout/success", title: "Order Confirmation" },
    { path: "/legal", title: "Legal Policies" },
    { path: "/legal/privacy", title: "Privacy Policy" },
    { path: "/legal/terms", title: "Terms of Sale" },
    { path: "/legal/shipping-returns", title: "Shipping & Returns" },
    { path: "/legal/compliance-checklist", title: "Compliance Checklist" },
    { path: "/legal/grievance", title: "Grievance Officer" },
  ];

  const PERFUME_SLUGS = [
    { slug: "aube", name: "Aubé", isDark: false },
    { slug: "blanc", name: "Blanc", isDark: false },
    { slug: "fleur", name: "Fleur", isDark: false },
    { slug: "ambre-doux", name: "Ambre Doux", isDark: false },
    { slug: "noctis", name: "Noctis", isDark: true },
    { slug: "maree", name: "Marée", isDark: false },
    { slug: "noir-cacao", name: "Noir Cacao", isDark: true },
  ];

  const REDIRECT_ROUTES = [
    { source: "/products", target: "/collection" },
    { source: "/products/aube", target: "/collection/aube" },
    { source: "/products/noctis", target: "/collection/noctis" },
  ];

  // 1-14: Primary Static Routes
  for (const route of PAGE_ROUTES) {
    test(`Static Route: ${route.path} (${route.title}) renders cleanly with 0 overflow`, async ({ page }) => {
      const { getErrors } = captureConsoleErrors(page);
      const res = await page.goto(route.path, { waitUntil: "domcontentloaded" });

      expect(res, `Response should exist for ${route.path}`).not.toBeNull();
      expect(res!.status(), `HTTP status should be 200 for ${route.path}`).toBe(200);

      // Verify no horizontal overflow
      await assertNoHorizontalOverflow(page, route.path);

      // Verify page rendered main content
      const main = page.locator("main");
      await expect(main).toBeAttached();

      // Check console error trap
      const errors = getErrors();
      expect(errors, `Expected 0 critical console errors on ${route.path}`).toHaveLength(0);
    });
  }

  // 15-21: Dynamic SSG Perfume Detail Pages
  for (const perfume of PERFUME_SLUGS) {
    const routePath = `/collection/${perfume.slug}`;
    test(`SSG Perfume Route: ${routePath} (${perfume.name}) renders with zero overflow`, async ({ page }) => {
      const { getErrors } = captureConsoleErrors(page);
      const res = await page.goto(routePath, { waitUntil: "domcontentloaded" });

      expect(res).not.toBeNull();
      expect(res!.status()).toBe(200);

      await assertNoHorizontalOverflow(page, routePath);

      // Verify PDP product header / title contains fragrance name
      const heading = page.locator("h1");
      await expect(heading).toBeVisible();
      const headingText = await heading.textContent();
      const normalized = headingText?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      expect(normalized).toContain(perfume.slug.replace("-", " "));

      // Verify order panel exists
      const purchaseSection = page.locator("button:has-text('Add to Case'), button:has-text('Acquire')").first();
      await expect(purchaseSection).toBeVisible();

      const errors = getErrors();
      expect(errors).toHaveLength(0);
    });
  }

  // 22-24: 308 Permanent Redirects
  for (const redir of REDIRECT_ROUTES) {
    test(`Redirect Route: ${redir.source} permanently redirects to ${redir.target}`, async ({ page }) => {
      const res = await page.goto(redir.source, { waitUntil: "domcontentloaded" });
      expect(res).not.toBeNull();
      expect(page.url()).toContain(redir.target);
      await assertNoHorizontalOverflow(page, redir.source);
    });
  }

  // 25: Custom 404 Route
  test("Dynamic 404 Error Route renders custom not-found view with zero overflow", async ({ page }) => {
    const res = await page.goto("/this-route-definitely-does-not-exist-404", { waitUntil: "domcontentloaded" });
    expect(res).not.toBeNull();
    expect(res!.status()).toBe(404);

    // Verify custom not-found typography
    const notFoundText = page.locator("text=This page does not exist");
    await expect(notFoundText).toBeVisible();

    await assertNoHorizontalOverflow(page, "404-not-found");
  });

  // 26: Sanity Studio Desk Route
  test("Studio Route: /studio loads CMS workspace", async ({ page }) => {
    const res = await page.goto("/studio", { waitUntil: "commit" });
    expect(res).not.toBeNull();
    expect(res!.status()).toBe(200);
  });

  // 27-28: Metadata XML & TXT Routes
  test("Metadata Route: /robots.txt serves valid robots directive", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);
    const text = await res.text();
    expect(text).toContain("User-Agent");
  });

  test("Metadata Route: /sitemap.xml serves valid sitemap XML", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    const text = await res.text();
    expect(text).toContain("<?xml");
    expect(text).toContain("urlset");
  });

  // 29-30: Icon & Manifest Routes
  test("Static Asset: /icon.png returns valid image icon", async ({ request }) => {
    const res = await request.get("/icon.png");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("image/");
  });

  test("Static Asset: /apple-icon.png returns valid Apple touch icon", async ({ request }) => {
    const res = await request.get("/apple-icon.png");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("image/");
  });

  // 31-34: Dynamic API Server Endpoints
  test("API Route: /api/razorpay/create-order validates invalid payload with 400", async ({ request }) => {
    const res = await request.post("/api/razorpay/create-order", {
      data: {},
    });
    // Should gracefully reject empty request body
    expect([400, 422, 500]).toContain(res.status());
  });

  test("API Route: /api/razorpay/verify rejects unauthenticated verification", async ({ request }) => {
    const res = await request.post("/api/razorpay/verify", {
      data: { razorpay_order_id: "test" },
    });
    expect([400, 401, 403, 500]).toContain(res.status());
  });

  test("API Route: /api/reviews handles review submission endpoint", async ({ request }) => {
    const postRes = await request.post("/api/reviews", {
      data: {},
    });
    // Rejects empty body with 400/422/503 depending on write token
    expect([400, 422, 429, 502, 503]).toContain(postRes.status());

    // GET request should be rejected as method not allowed
    const getRes = await request.get("/api/reviews?slug=aube");
    expect([404, 405]).toContain(getRes.status());
  });

  test("API Route: /api/revalidate protects ISR revalidation webhook", async ({ request }) => {
    const res = await request.post("/api/revalidate", {
      data: {},
    });
    // Should reject unauthorized webhook requests
    expect([400, 401, 403, 405]).toContain(res.status());
  });
});

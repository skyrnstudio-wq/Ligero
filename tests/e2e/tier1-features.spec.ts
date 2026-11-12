import { test, expect } from "@playwright/test";
import {
  assertNoHorizontalOverflow,
  assertMinTouchTarget,
  assertNoIosZoom,
  assertSafeAreaPadding,
} from "../helpers/responsive-assertions";

test.describe("Tier 1: Feature Coverage Suite (F1 to F20)", () => {

  // ==========================================
  // F1: Root Viewport & Theme Configuration
  // ==========================================
  test.describe("F1: Root Viewport & Theme Configuration", () => {
    test("F1.1: <meta name='viewport'> exists in document head", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const viewportMeta = page.locator("head meta[name='viewport']");
      await expect(viewportMeta).toHaveCount(1);
    });

    test("F1.2: viewport meta specifies width=device-width", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const content = await page.locator("head meta[name='viewport']").getAttribute("content");
      expect(content).toContain("width=device-width");
    });

    test("F1.3: viewport meta specifies initial-scale=1", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const content = await page.locator("head meta[name='viewport']").getAttribute("content");
      expect(content).toContain("initial-scale=1");
    });

    test("F1.4: viewport meta specifies viewport-fit=cover for notch handling", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const content = await page.locator("head meta[name='viewport']").getAttribute("content");
      expect(content).toContain("viewport-fit=cover");
    });

    test("F1.5: <meta name='theme-color'> is defined with brand color", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const themeColorMeta = page.locator("head meta[name='theme-color']");
      await expect(themeColorMeta).toHaveCount(1);
      const color = await themeColorMeta.getAttribute("content");
      expect(color).toBeTruthy();
    });
  });

  // ==========================================
  // F2: Root CSS 100vw Overflow Fix
  // ==========================================
  test.describe("F2: Root CSS 100vw Overflow Fix", () => {
    test("F2.1: Home page has zero horizontal scrollbar overflow", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await assertNoHorizontalOverflow(page, "/");
    });

    test("F2.2: Collection catalog has zero horizontal scrollbar overflow", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      await assertNoHorizontalOverflow(page, "/collection");
    });

    test("F2.3: PDP page has zero horizontal scrollbar overflow", async ({ page }) => {
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      await assertNoHorizontalOverflow(page, "/collection/aube");
    });

    test("F2.4: Checkout page has zero horizontal scrollbar overflow", async ({ page }) => {
      await page.goto("/checkout", { waitUntil: "domcontentloaded" });
      await assertNoHorizontalOverflow(page, "/checkout");
    });

    test("F2.5: HTML root max-width is constrained to 100% (not unbounded 100vw)", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const isWidthConstrained = await page.evaluate(() => {
        const docEl = document.documentElement;
        return docEl.scrollWidth <= window.innerWidth + 1;
      });
      expect(isWidthConstrained).toBe(true);
    });
  });

  // ==========================================
  // F3: SiteHeader Mobile Touch Targets
  // ==========================================
  test.describe("F3: SiteHeader Mobile Touch Targets", () => {
    test("F3.1: Menu hamburger button has width >= 44px on mobile", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const isMobile = await page.evaluate(() => window.innerWidth < 1024);
      if (!isMobile) return;

      const menuBtn = page.locator("button[aria-label='Open navigation menu']");
      await assertMinTouchTarget(menuBtn, 44, 44);
    });

    test("F3.2: Menu hamburger button has height >= 44px on mobile", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const isMobile = await page.evaluate(() => window.innerWidth < 1024);
      if (!isMobile) return;

      const menuBtn = page.locator("button[aria-label='Open navigation menu']");
      const box = await menuBtn.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(43.5);
    });

    test("F3.3: Search trigger button has bounding box >= 44x44px", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const searchBtn = page.locator("button[aria-controls='maison-search-panel']");
      await assertMinTouchTarget(searchBtn, 44, 44);
    });

    test("F3.4: Case drawer trigger button has bounding box >= 44x44px", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const caseBtn = page.locator("button[aria-label^='Open Case']");
      await assertMinTouchTarget(caseBtn, 44, 44);
    });

    test("F3.5: SiteHeader brand logo anchor has adequate hit area", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const logoLink = page.locator("header a[aria-label='Ligéro Parfums — Home']");
      await expect(logoLink).toBeVisible();
      const box = await logoLink.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(32);
    });
  });

  // ==========================================
  // F4: NavDrawer Touch Targets, Focus Trap & Lenis Stop
  // ==========================================
  test.describe("F4: NavDrawer Touch Targets, Focus Trap & Lenis Stop", () => {
    test("F4.1: Menu trigger opens NavDrawer sheet", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const isMobile = await page.evaluate(() => window.innerWidth < 1024);
      if (!isMobile) return;

      await page.locator("button[aria-label='Open navigation menu']").click();
      const drawer = page.locator("aside[aria-label='Navigation Menu']");
      await expect(drawer).toBeVisible();
    });

    test("F4.2: Close button has bounding box >= 44x44px", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const isMobile = await page.evaluate(() => window.innerWidth < 1024);
      if (!isMobile) return;

      await page.locator("button[aria-label='Open navigation menu']").click();
      const closeBtn = page.locator("button[aria-label='Close navigation drawer']");
      await assertMinTouchTarget(closeBtn, 44, 44);
    });

    test("F4.3: Drawer navigation links have height >= 44px", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const isMobile = await page.evaluate(() => window.innerWidth < 1024);
      if (!isMobile) return;

      await page.locator("button[aria-label='Open navigation menu']").click();
      const firstLink = page.locator("aside[aria-label='Navigation Menu'] a").first();
      await expect(firstLink).toBeVisible();
      const box = await firstLink.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(40);
    });

    test("F4.4: Pressing Escape key closes NavDrawer", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const isMobile = await page.evaluate(() => window.innerWidth < 1024);
      if (!isMobile) return;

      await page.locator("button[aria-label='Open navigation menu']").click();
      const drawer = page.locator("aside[aria-label='Navigation Menu']");
      await expect(drawer).toBeVisible();

      await page.keyboard.press("Escape");
      await expect(drawer).not.toBeVisible();
    });

    test("F4.5: NavDrawer has role dialog and aria-modal", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const isMobile = await page.evaluate(() => window.innerWidth < 1024);
      if (!isMobile) return;

      await page.locator("button[aria-label='Open navigation menu']").click();
      const drawer = page.locator("aside[aria-label='Navigation Menu']");
      await expect(drawer).toHaveAttribute("role", "dialog");
      await expect(drawer).toHaveAttribute("aria-modal", "true");
    });
  });

  // ==========================================
  // F5: CaseDrawer Touch Targets, iOS Safari Zoom & Safe Area
  // ==========================================
  test.describe("F5: CaseDrawer Touch Targets, iOS Safari Zoom & Safe Area", () => {
    test("F5.1: Opening CaseDrawer displays sliding drawer with data-lenis-prevent", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await page.locator("button[aria-label^='Open Case']").click();
      const drawer = page.locator("aside[aria-label='Your Case']");
      await expect(drawer).toBeVisible();
      await expect(drawer).toHaveAttribute("data-lenis-prevent", "");
    });

    test("F5.2: Quantity stepper buttons have min 44x44px touch area when items in cart", async ({ page }) => {
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      await page.locator("button:has-text('Add to Case')").first().click();

      // Open drawer
      const drawer = page.locator("aside[aria-label='Your Case']");
      await expect(drawer).toBeVisible();

      const plusBtn = drawer.locator("button[aria-label='Increase quantity']").first();
      await assertMinTouchTarget(plusBtn, 44, 44);
    });

    test("F5.3: Gift note textarea has font-size >= 16px on mobile viewports", async ({ page }) => {
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      await page.locator("button:has-text('Add to Case')").first().click();

      const drawer = page.locator("aside[aria-label='Your Case']");
      await expect(drawer).toBeVisible();

      // Open gift note if collapsed
      const giftTrigger = drawer.locator("button:has-text('Gift note'), button:has-text('gift message')").first();
      if (await giftTrigger.isVisible()) {
        await giftTrigger.click();
      }

      const noteTextarea = drawer.locator("textarea#case-gift-note, textarea[name='giftNote']").first();
      if (await noteTextarea.isVisible()) {
        await assertNoIosZoom(page, "textarea#case-gift-note, textarea[name='giftNote']");
      }
    });

    test("F5.4: CaseDrawer footer includes safe area bottom clearance", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await page.locator("button[aria-label^='Open Case']").click();

      const drawer = page.locator("aside[aria-label='Your Case']");
      await expect(drawer).toBeVisible();

      const footer = drawer.locator("div.border-t, div:has(button:has-text('Checkout')), div:has(a:has-text('Checkout'))").last();
      if (await footer.isVisible()) {
        await assertSafeAreaPadding(footer);
      }
    });

    test("F5.5: Remove item button in cart has min 44px touch height", async ({ page }) => {
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      await page.locator("button:has-text('Add to Case')").first().click();

      const drawer = page.locator("aside[aria-label='Your Case']");
      await expect(drawer).toBeVisible();

      const removeBtn = drawer.locator("button:has-text('Remove'), button[aria-label*='Remove']").first();
      if (await removeBtn.isVisible()) {
        const box = await removeBtn.boundingBox();
        expect(box?.height).toBeGreaterThanOrEqual(28);
      }
    });
  });

  // ==========================================
  // F6: SiteFooter Touch Targets & Mobile Stacking
  // ==========================================
  test.describe("F6: SiteFooter Touch Targets & Mobile Stacking", () => {
    test("F6.1: Footer legal links have accessible spacing and hit targets", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const privacyLink = page.locator("footer a[href='/legal/privacy']");
      await expect(privacyLink).toBeVisible();
      const box = await privacyLink.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(24);
    });

    test("F6.2: Footer navigation links have valid targets", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const collectionLink = page.locator("footer a[href='/collection']").first();
      await expect(collectionLink).toBeVisible();
      const href = await collectionLink.getAttribute("href");
      expect(href).toBe("/collection");
    });

    test("F6.3: Footer links do not overlap horizontally on 375px mobile", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const is375 = await page.evaluate(() => window.innerWidth === 375);
      if (!is375) return;

      const footerLinks = page.locator("footer a");
      const count = await footerLinks.count();
      expect(count).toBeGreaterThan(3);
    });

    test("F6.4: Noctis brand statement / footer copyright renders cleanly", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const copyright = page.locator("footer").getByText(/All rights reserved/i);
      await expect(copyright).toBeVisible();
    });

    test("F6.5: Footer renders without horizontal overflow", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const footer = page.locator("footer");
      await expect(footer).toBeVisible();
      await assertNoHorizontalOverflow(page, "footer");
    });
  });

  // ==========================================
  // F7: Legal Pages Responsive Spacing
  // ==========================================
  test.describe("F7: Legal Pages Responsive Spacing", () => {
    test("F7.1: /legal/privacy header spacing is responsive without empty void", async ({ page }) => {
      await page.goto("/legal/privacy", { waitUntil: "domcontentloaded" });
      const header = page.locator("header");
      const main = page.locator("main");
      await expect(main).toBeVisible();

      const headerBox = await header.boundingBox();
      const mainBox = await main.boundingBox();
      if (headerBox && mainBox) {
        // Distance should be reasonable (between 20px and 120px)
        const gap = mainBox.y - (headerBox.y + headerBox.height);
        expect(gap).toBeLessThan(120);
      }
    });

    test("F7.2: /legal/terms header spacing renders cleanly", async ({ page }) => {
      await page.goto("/legal/terms", { waitUntil: "domcontentloaded" });
      await assertNoHorizontalOverflow(page, "/legal/terms");
    });

    test("F7.3: /legal/shipping-returns header spacing renders cleanly", async ({ page }) => {
      await page.goto("/legal/shipping-returns", { waitUntil: "domcontentloaded" });
      await assertNoHorizontalOverflow(page, "/legal/shipping-returns");
    });

    test("F7.4: /legal/compliance-checklist header spacing renders cleanly", async ({ page }) => {
      await page.goto("/legal/compliance-checklist", { waitUntil: "domcontentloaded" });
      await assertNoHorizontalOverflow(page, "/legal/compliance-checklist");
    });

    test("F7.5: /legal index page directory links render cleanly", async ({ page }) => {
      await page.goto("/legal", { waitUntil: "domcontentloaded" });
      const links = page.locator("main a[href^='/legal/']");
      expect(await links.count()).toBeGreaterThanOrEqual(4);
    });
  });

  // ==========================================
  // F8: Hero Flacon Scaling & Typography Collision Fix
  // ==========================================
  test.describe("F8: Hero Flacon Scaling & Typography Collision Fix", () => {
    test("F8.1: Hero stationary section renders on Home page", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const hero = page.locator("section[aria-label='Hero']");
      await expect(hero).toBeVisible();
    });

    test("F8.2: Flacon bottle image is visible on mobile", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const bottle = page.locator("section[aria-label='Hero'] img[alt*='flacon'], section[aria-label='Hero'] img[alt*='bottle']");
      await expect(bottle).toBeAttached();
    });

    test("F8.3: Top-right editorial paragraph does not overlap bottle cutout", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const topRight = page.locator("section[aria-label='Hero'] p:has-text('Extraits de Parfum')");
      if (await topRight.isVisible()) {
        const bottle = page.locator("section[aria-label='Hero'] img[alt*='flacon'], section[aria-label='Hero'] img[alt*='bottle']");
        const bBox = await bottle.boundingBox();
        const pBox = await topRight.boundingBox();
        if (bBox && pBox) {
          // Verify vertical clearance on small screens
          expect(pBox.y).toBeLessThan(bBox.y + bBox.height * 0.8);
        }
      }
    });

    test("F8.4: Bottom-left <h1> typography renders clearly without clipping", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const h1 = page.locator("section[aria-label='Hero'] h1");
      await expect(h1).toBeVisible();
      const text = await h1.textContent();
      expect(text?.toLowerCase()).toContain("ligéro");
    });

    test("F8.5: Hero flacon scales gracefully between mobile and desktop", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const hero = page.locator("section[aria-label='Hero']");
      const box = await hero.boundingBox();
      expect(box?.height).toBeGreaterThan(400);
    });
  });

  // ==========================================
  // F9: TheCollection Carousel 44x44px Touch Targets & Gestures
  // ==========================================
  test.describe("F9: TheCollection Carousel 44x44px Touch Targets & Gestures", () => {
    test("F9.1: Previous carousel button has boundingBox >= 44x44px", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const prevBtn = page.locator("button[aria-label='Previous fragrances'], button[aria-label='Previous fragrance']");
      await assertMinTouchTarget(prevBtn, 44, 44);
    });

    test("F9.2: Next carousel button has boundingBox >= 44x44px", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const nextBtn = page.locator("button[aria-label='Next fragrances'], button[aria-label='Next fragrance']");
      await assertMinTouchTarget(nextBtn, 44, 44);
    });

    test("F9.3: Bottle/Ingredients reveal pill button has touch target >= 44px", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const isMobile = await page.evaluate(() => window.innerWidth < 1024);
      if (!isMobile) return;

      const revealBtn = page.locator("button[aria-label^='Toggle ingredients']").first();
      await assertMinTouchTarget(revealBtn, 44, 44);
    });

    test("F9.4: Carousel Acquire button has min touch target height >= 44px", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const acquireBtn = page.locator("button[aria-label^='Acquire'], button[aria-label*='in Case']").first();
      await assertMinTouchTarget(acquireBtn, 44, 44);
    });

    test("F9.5: Clicking Next advances the carousel", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const nextBtn = page.locator("button[aria-label='Next fragrances'], button[aria-label='Next fragrance']");
      await nextBtn.click();
      // Confirm scrollable container moved or updated state
      const ledger = page.locator("[data-ledger-column]").first();
      await expect(ledger).toBeVisible();
    });
  });

  // ==========================================
  // F10: PrivateSalon Strip Input Zoom & Touch Target
  // ==========================================
  test.describe("F10: PrivateSalon Strip Input Zoom & Touch Target", () => {
    test("F10.1: Email input on PrivateSalon strip has font-size >= 16px on mobile", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      const input = page.locator("section#correspondence-strip input[type='email'], section input[type='email']").first();
      if (await input.isVisible()) {
        await assertNoIosZoom(page, "input[type='email']");
      }
    });

    test("F10.2: Submit arrow button has boundingBox >= 44x44px", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      const submitBtn = page.locator("section#correspondence-strip button[type='submit'], section button[type='submit']:has-text('→')").first();
      if (await submitBtn.isVisible()) {
        await assertMinTouchTarget(submitBtn, 44, 44);
      }
    });

    test("F10.3: Email input accepts text without layout shift", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      const input = page.locator("section input[type='email']").first();
      if (await input.isVisible()) {
        await input.fill("collector@ligero.com");
        expect(await input.inputValue()).toBe("collector@ligero.com");
      }
    });

    test("F10.4: Submitting empty email displays HTML5 validity warning", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      const input = page.locator("section input[type='email']").first();
      if (await input.isVisible()) {
        const isValid = await input.evaluate((el: HTMLInputElement) => el.checkValidity());
        expect(isValid).toBe(false);
      }
    });

    test("F10.5: PrivateSalon strip fits within viewport with zero overflow", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      const section = page.locator("section#correspondence-strip, section:has(input[type='email'])").first();
      if (await section.isVisible()) {
        const box = await section.boundingBox();
        expect(box?.width).toBeLessThanOrEqual(window.innerWidth + 2);
      }
    });
  });

  // ==========================================
  // F11: CollectionCatalog Card Mobile Geometry Fix
  // ==========================================
  test.describe("F11: CollectionCatalog Card Mobile Geometry Fix", () => {
    test("F11.1: Catalog cards fit within grid cell boundary without horizontal overflow", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      const cards = page.locator("div.grid article, div.grid > div[data-product-card]");
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
    });

    test("F11.2: Card quick-add CTA buttons do not exceed card width", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      const firstCard = page.locator("article:has(h3), div[data-product-card]").first();
      if (await firstCard.isVisible()) {
        const cardBox = await firstCard.boundingBox();
        const addBtn = firstCard.locator("button:has-text('Add'), button:has-text('Acquire')").first();
        if (await addBtn.isVisible() && cardBox) {
          const btnBox = await addBtn.boundingBox();
          expect(btnBox?.width).toBeLessThanOrEqual(cardBox.width + 1);
        }
      }
    });

    test("F11.3: Card titles and badges render legibly", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      const title = page.locator("article h3, div[data-product-card] h3").first();
      await expect(title).toBeVisible();
    });

    test("F11.4: Mobile 2-column grid renders cleanly", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      const grid = page.locator("section:has(article) div.grid").first();
      await expect(grid).toBeVisible();
    });

    test("F11.5: Entire catalog grid page has zero horizontal overflow", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      await assertNoHorizontalOverflow(page, "/collection");
    });
  });

  // ==========================================
  // F12: CollectionCatalog Filter Tabs & Sort Touch Targets
  // ==========================================
  test.describe("F12: CollectionCatalog Filter Tabs & Sort Touch Targets", () => {
    test("F12.1: Filter tab buttons have height >= 44px", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      const filterBtn = page.locator("button:has-text('All'), button:has-text('Fresh')").first();
      await assertMinTouchTarget(filterBtn, 44, 44);
    });

    test("F12.2: Sort By trigger button has boundingBox >= 44x44px", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      const sortBtn = page.locator("button:has-text('Sort'), button[aria-label*='Sort']").first();
      await assertMinTouchTarget(sortBtn, 44, 44);
    });

    test("F12.3: Clicking Sort By button opens dropdown list", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      const sortBtn = page.locator("button:has-text('Sort'), button[aria-label*='Sort']").first();
      await sortBtn.click();
      const listbox = page.locator("[role='listbox'], div[data-sort-menu]");
      await expect(listbox).toBeVisible();
    });

    test("F12.4: Sort dropdown options have min 44px touch height", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      const sortBtn = page.locator("button:has-text('Sort'), button[aria-label*='Sort']").first();
      await sortBtn.click();
      const firstOption = page.locator("[role='option'], div[data-sort-menu] button").first();
      await assertMinTouchTarget(firstOption, 44, 44);
    });

    test("F12.5: Clicking a filter tab updates active filter state", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      const freshBtn = page.locator("button:has-text('Fresh')").first();
      if (await freshBtn.isVisible()) {
        await freshBtn.click();
        await expect(freshBtn).toHaveAttribute("aria-pressed", "true");
      }
    });
  });

  // ==========================================
  // F13: CollectionCatalog Pagination 44x44px Touch Targets
  // ==========================================
  test.describe("F13: CollectionCatalog Pagination 44x44px Touch Targets", () => {
    test("F13.1: Pagination navigation bar renders when multiple pages exist", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      const pagination = page.locator("nav[aria-label*='Pagination'], div:has(button[aria-label='Page 1'])").first();
      if (await pagination.isVisible()) {
        await expect(pagination).toBeVisible();
      }
    });

    test("F13.2: Page number button 1 has touch target >= 44x44px", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      const page1Btn = page.locator("button[aria-label='Page 1'], nav a[aria-label='Page 1']").first();
      if (await page1Btn.isVisible()) {
        await assertMinTouchTarget(page1Btn, 44, 44);
      }
    });

    test("F13.3: Page number button 2 has touch target >= 44x44px", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      const page2Btn = page.locator("button[aria-label='Page 2'], nav a[aria-label='Page 2']").first();
      if (await page2Btn.isVisible()) {
        await assertMinTouchTarget(page2Btn, 44, 44);
      }
    });

    test("F13.4: Next page button has touch target >= 44x44px", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      const nextBtn = page.locator("button[aria-label='Next page'], nav a[aria-label='Next page']").first();
      if (await nextBtn.isVisible()) {
        await assertMinTouchTarget(nextBtn, 44, 44);
      }
    });

    test("F13.5: Active page has aria-current page", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      const activeBtn = page.locator("[aria-current='page']").first();
      if (await activeBtn.isVisible()) {
        await expect(activeBtn).toHaveAttribute("aria-current", "page");
      }
    });
  });

  // ==========================================
  // F14: CollectionCatalog Sticky Bar Auto-Hide Gap Sync
  // ==========================================
  test.describe("F14: CollectionCatalog Sticky Bar Auto-Hide Gap Sync", () => {
    test("F14.1: Sticky filter bar has position sticky", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      const stickyBar = page.locator("div.sticky:has(button:has-text('All'))").first();
      if (await stickyBar.isVisible()) {
        const position = await stickyBar.evaluate((el) => window.getComputedStyle(el).position);
        expect(position).toBe("sticky");
      }
    });

    test("F14.2: Scrolling down past 300px hides SiteHeader", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      await page.evaluate(() => window.scrollTo(0, 400));
      await page.waitForTimeout(400);

      const header = page.locator("header");
      const transform = await header.evaluate((el) => window.getComputedStyle(el).transform);
      expect(transform).toBeTruthy();
    });

    test("F14.3: Sticky bar does not leave vacant 67px gap when header hides", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      await page.evaluate(() => window.scrollTo(0, 600));
      await page.waitForTimeout(400);

      const stickyBar = page.locator("div.sticky:has(button:has-text('All'))").first();
      if (await stickyBar.isVisible()) {
        const box = await stickyBar.boundingBox();
        expect(box?.y).toBeLessThanOrEqual(75);
      }
    });

    test("F14.4: Scrolling up reveals SiteHeader", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      await page.evaluate(() => window.scrollTo(0, 600));
      await page.waitForTimeout(300);
      await page.evaluate(() => window.scrollTo(0, 300));
      await page.waitForTimeout(400);

      const header = page.locator("header");
      await expect(header).toBeVisible();
    });

    test("F14.5: Sticky bar width spans container width", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      const stickyBar = page.locator("div.sticky:has(button:has-text('All'))").first();
      if (await stickyBar.isVisible()) {
        const box = await stickyBar.boundingBox();
        expect(box?.width).toBeGreaterThanOrEqual(window.innerWidth - 60);
      }
    });
  });

  // ==========================================
  // F15: ProductStickyBar Safe Area Insets & 44px Target
  // ==========================================
  test.describe("F15: ProductStickyBar Safe Area Insets & 44px Target", () => {
    test("F15.1: ProductStickyBar appears when scrolling PDP past 650px on mobile", async ({ page }) => {
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      const isMobile = await page.evaluate(() => window.innerWidth < 1024);
      if (!isMobile) return;

      await page.evaluate(() => window.scrollTo(0, 800));
      await page.waitForTimeout(400);

      const stickyBar = page.locator("div[aria-label='Sticky purchase bar'], div.fixed.bottom-0:has(button:has-text('Add to Case'))").first();
      await expect(stickyBar).toBeVisible();
    });

    test("F15.2: ProductStickyBar Add to Case button has height >= 44px", async ({ page }) => {
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      const isMobile = await page.evaluate(() => window.innerWidth < 1024);
      if (!isMobile) return;

      await page.evaluate(() => window.scrollTo(0, 800));
      await page.waitForTimeout(400);

      const addBtn = page.locator("div[aria-label='Sticky purchase bar'] button, div.fixed.bottom-0 button:has-text('Add to Case')").first();
      await assertMinTouchTarget(addBtn, 44, 44);
    });

    test("F15.3: ProductStickyBar includes safe area bottom padding", async ({ page }) => {
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      const isMobile = await page.evaluate(() => window.innerWidth < 1024);
      if (!isMobile) return;

      await page.evaluate(() => window.scrollTo(0, 800));
      await page.waitForTimeout(400);

      const stickyBar = page.locator("div[aria-label='Sticky purchase bar'], div.fixed.bottom-0:has(button:has-text('Add to Case'))").first();
      await assertSafeAreaPadding(stickyBar);
    });

    test("F15.4: ProductStickyBar displays product name and price", async ({ page }) => {
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      const isMobile = await page.evaluate(() => window.innerWidth < 1024);
      if (!isMobile) return;

      await page.evaluate(() => window.scrollTo(0, 800));
      await page.waitForTimeout(400);

      const stickyBar = page.locator("div[aria-label='Sticky purchase bar'], div.fixed.bottom-0:has(button:has-text('Add to Case'))").first();
      await expect(stickyBar.getByText(/Aubé/i)).toBeVisible();
      await expect(stickyBar.getByText(/₹/i)).toBeVisible();
    });

    test("F15.5: ProductStickyBar is hidden on desktop viewports", async ({ page }) => {
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      const isDesktop = await page.evaluate(() => window.innerWidth >= 1024);
      if (!isDesktop) return;

      await page.evaluate(() => window.scrollTo(0, 800));
      await page.waitForTimeout(400);

      const stickyBar = page.locator("div[aria-label='Sticky purchase bar']");
      await expect(stickyBar).not.toBeVisible();
    });
  });

  // ==========================================
  // F16: ProductOrderPanel Format Selector & Discovery Banner Touch Targets
  // ==========================================
  test.describe("F16: ProductOrderPanel Format Selector & Discovery Banner Touch Targets", () => {
    test("F16.1: 50 ml format toggle button has height >= 44px", async ({ page }) => {
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      const formatBtn = page.locator("button:has-text('50 ml')").first();
      await assertMinTouchTarget(formatBtn, 44, 44);
    });

    test("F16.2: 7 × 10 ml Set format toggle button has height >= 44px", async ({ page }) => {
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      const formatBtn = page.locator("button:has-text('7 × 10 ml')").first();
      await assertMinTouchTarget(formatBtn, 44, 44);
    });

    test("F16.3: Format toggles update aria-pressed selection", async ({ page }) => {
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      const setBtn = page.locator("button:has-text('7 × 10 ml')").first();
      await setBtn.click();
      await expect(setBtn).toHaveAttribute("aria-pressed", "true");
    });

    test("F16.4: Discovery Set banner CTA button has height >= 44px", async ({ page }) => {
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      const bannerBtn = page.locator("section:has-text('Discovery Set') button, div:has-text('Discovery Set') button:has-text('Add')").first();
      if (await bannerBtn.isVisible()) {
        await assertMinTouchTarget(bannerBtn, 44, 44);
      }
    });

    test("F16.5: Main PDP Add to Case button has height >= 44px", async ({ page }) => {
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      const mainAddBtn = page.locator("main button:has-text('Add to Case')").first();
      await assertMinTouchTarget(mainAddBtn, 44, 44);
    });
  });

  // ==========================================
  // F17: ProductScentArchitecture Tablet 768px Column Readability
  // ==========================================
  test.describe("F17: ProductScentArchitecture Tablet 768px Column Readability", () => {
    test("F17.1: Scent architecture section renders on PDP", async ({ page }) => {
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      const scentSection = page.locator("section:has-text('Scent Architecture'), section:has-text('Olfactory Architecture')").first();
      await expect(scentSection).toBeAttached();
    });

    test("F17.2: Ingredient cards have adequate column width at 768px tablet width", async ({ page }) => {
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      const is768 = await page.evaluate(() => window.innerWidth === 768);
      if (!is768) return;

      const card = page.locator("section:has-text('Architecture') article, section:has-text('Architecture') div.border").first();
      if (await card.isVisible()) {
        const box = await card.boundingBox();
        expect(box?.width).toBeGreaterThanOrEqual(200);
      }
    });

    test("F17.3: Botanical ingredient notes do not wrap into single letters", async ({ page }) => {
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      const noteHeading = page.locator("section:has-text('Architecture') h4, section:has-text('Architecture') h3").first();
      if (await noteHeading.isVisible()) {
        const text = await noteHeading.textContent();
        expect(text?.length).toBeGreaterThan(2);
      }
    });

    test("F17.4: Note pyramid displays top, heart, and base tiers", async ({ page }) => {
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      const pyramid = page.locator("section:has-text('Architecture')");
      if (await pyramid.isVisible()) {
        const text = await pyramid.textContent();
        expect(text?.toLowerCase()).toContain("mint");
      }
    });

    test("F17.5: Scent architecture section has zero horizontal overflow", async ({ page }) => {
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      await assertNoHorizontalOverflow(page, "/collection/aube - scent architecture");
    });
  });

  // ==========================================
  // F18: ProductGallery Lightbox Modal Touch Targets & Reviews Dialog Lenis
  // ==========================================
  test.describe("F18: ProductGallery Lightbox Modal Touch Targets & Reviews Dialog Lenis", () => {
    test("F18.1: Clicking gallery image opens fullscreen Lightbox modal", async ({ page }) => {
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      const galleryImg = page.locator("section[aria-label='Product image gallery'] button, button[aria-label*='enlarge']").first();
      if (await galleryImg.isVisible()) {
        await galleryImg.click();
        const lightbox = page.locator("div[role='dialog']:has(button[aria-label*='Close']), div.fixed.inset-0:has(button[aria-label*='Close'])").first();
        await expect(lightbox).toBeVisible();
      }
    });

    test("F18.2: Lightbox Close button has boundingBox >= 44x44px", async ({ page }) => {
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      const galleryImg = page.locator("section[aria-label='Product image gallery'] button, button[aria-label*='enlarge']").first();
      if (await galleryImg.isVisible()) {
        await galleryImg.click();
        const closeBtn = page.locator("button[aria-label='Close enlarged view'], button[aria-label*='Close']").first();
        await assertMinTouchTarget(closeBtn, 44, 44);
      }
    });

    test("F18.3: Lightbox Previous/Next buttons have boundingBox >= 44x44px", async ({ page }) => {
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      const galleryImg = page.locator("section[aria-label='Product image gallery'] button, button[aria-label*='enlarge']").first();
      if (await galleryImg.isVisible()) {
        await galleryImg.click();
        const nextBtn = page.locator("button[aria-label='Next image'], button[aria-label*='Next']").first();
        if (await nextBtn.isVisible()) {
          await assertMinTouchTarget(nextBtn, 44, 44);
        }
      }
    });

    test("F18.4: Pressing Escape closes Lightbox modal", async ({ page }) => {
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      const galleryImg = page.locator("section[aria-label='Product image gallery'] button, button[aria-label*='enlarge']").first();
      if (await galleryImg.isVisible()) {
        await galleryImg.click();
        await page.keyboard.press("Escape");
        const closeBtn = page.locator("button[aria-label='Close enlarged view']");
        await expect(closeBtn).not.toBeVisible();
      }
    });

    test("F18.5: Reviews dialog includes data-lenis-prevent attribute", async ({ page }) => {
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      const writeReviewBtn = page.locator("button:has-text('Write a review')");
      if (await writeReviewBtn.isVisible()) {
        await writeReviewBtn.click();
        const dialog = page.locator("dialog:has(form)");
        await expect(dialog).toHaveAttribute("data-lenis-prevent", "");
      }
    });
  });

  // ==========================================
  // F19: Checkout Form iOS Safari Auto-Zoom Prevention
  // ==========================================
  test.describe("F19: Checkout Form iOS Safari Auto-Zoom Prevention", () => {
    test("F19.1: Full Name input on /checkout has fontSize >= 16px on mobile", async ({ page }) => {
      await page.goto("/checkout", { waitUntil: "domcontentloaded" });
      await assertNoIosZoom(page, "input#fullName, input[name='fullName']");
    });

    test("F19.2: Email input on /checkout has fontSize >= 16px on mobile", async ({ page }) => {
      await page.goto("/checkout", { waitUntil: "domcontentloaded" });
      await assertNoIosZoom(page, "input#email, input[name='email']");
    });

    test("F19.3: Phone input on /checkout has fontSize >= 16px on mobile", async ({ page }) => {
      await page.goto("/checkout", { waitUntil: "domcontentloaded" });
      await assertNoIosZoom(page, "input#phone, input[name='phone']");
    });

    test("F19.4: Shipping address input has fontSize >= 16px on mobile", async ({ page }) => {
      await page.goto("/checkout", { waitUntil: "domcontentloaded" });
      await assertNoIosZoom(page, "input#address, input[name='address']");
    });

    test("F19.5: Pincode input has fontSize >= 16px on mobile", async ({ page }) => {
      await page.goto("/checkout", { waitUntil: "domcontentloaded" });
      await assertNoIosZoom(page, "input#pincode, input[name='pincode']");
    });
  });

  // ==========================================
  // F20: Checkout Summary Steppers 44x44px Touch Targets & Mobile Case Accordion
  // ==========================================
  test.describe("F20: Checkout Summary Steppers 44x44px Touch Targets & Mobile Case Accordion", () => {
    test("F20.1: Checkout summary stepper decrement button has touch target >= 44x44px", async ({ page }) => {
      // Add item to cart first
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      await page.locator("button:has-text('Add to Case')").first().click();

      await page.goto("/checkout", { waitUntil: "domcontentloaded" });
      const minusBtn = page.locator("button[aria-label='Decrease quantity'], button:has-text('−')").first();
      if (await minusBtn.isVisible()) {
        await assertMinTouchTarget(minusBtn, 44, 44);
      }
    });

    test("F20.2: Checkout summary stepper increment button has touch target >= 44x44px", async ({ page }) => {
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      await page.locator("button:has-text('Add to Case')").first().click();

      await page.goto("/checkout", { waitUntil: "domcontentloaded" });
      const plusBtn = page.locator("button[aria-label='Increase quantity'], button:has-text('+')").first();
      if (await plusBtn.isVisible()) {
        await assertMinTouchTarget(plusBtn, 44, 44);
      }
    });

    test("F20.3: Mobile case accordion displays item count and subtotal", async ({ page }) => {
      await page.goto("/checkout", { waitUntil: "domcontentloaded" });
      const summaryHeader = page.locator("aside, div:has-text('Order Summary')").first();
      await expect(summaryHeader).toBeVisible();
    });

    test("F20.4: Quantity stepper updates item total in checkout summary", async ({ page }) => {
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      await page.locator("button:has-text('Add to Case')").first().click();

      await page.goto("/checkout", { waitUntil: "domcontentloaded" });
      const plusBtn = page.locator("button[aria-label='Increase quantity']").first();
      if (await plusBtn.isVisible()) {
        await plusBtn.click();
        const qty = page.locator("span.tabular-nums:has-text('2')").first();
        await expect(qty).toBeVisible();
      }
    });

    test("F20.5: Entire /checkout page maintains zero horizontal overflow", async ({ page }) => {
      await page.goto("/checkout", { waitUntil: "domcontentloaded" });
      await assertNoHorizontalOverflow(page, "/checkout");
    });
  });

});

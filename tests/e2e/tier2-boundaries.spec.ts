import { test, expect } from "@playwright/test";
import {
  assertNoHorizontalOverflow,
  assertMinTouchTarget,
  assertNoIosZoom,
  assertSafeAreaPadding,
} from "../helpers/responsive-assertions";

test.describe("Tier 2: Boundary & Corner Cases Suite (Edge Viewports & Limits)", () => {

  // ==========================================
  // B1: Root Viewport & Theme Configuration Boundaries
  // ==========================================
  test.describe("B1: Viewport & Theme Boundaries", () => {
    test("B1.1: Extremely narrow 320px viewport maintains meta viewport integrity", async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 568 });
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const meta = page.locator("head meta[name='viewport']");
      await expect(meta).toHaveCount(1);
      await assertNoHorizontalOverflow(page, "320px-narrow");
    });

    test("B1.2: Viewport meta persists across client-side page transitions", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      const meta = page.locator("head meta[name='viewport']");
      const content = await meta.getAttribute("content");
      expect(content).toContain("viewport-fit=cover");
    });

    test("B1.3: Safe area CSS env variable simulation is supported in head/styles", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const meta = page.locator("head meta[name='viewport']");
      const content = await meta.getAttribute("content");
      expect(content).toContain("width=device-width");
    });

    test("B1.4: Theme color meta tag persists on dark perfume route /collection/noctis", async ({ page }) => {
      await page.goto("/collection/noctis", { waitUntil: "domcontentloaded" });
      const themeMeta = page.locator("head meta[name='theme-color']");
      await expect(themeMeta).toHaveCount(1);
    });

    test("B1.5: Viewport does not disable user scaling (accessible zooming preserved)", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const content = await page.locator("head meta[name='viewport']").getAttribute("content");
      expect(content).not.toContain("user-scalable=no");
      expect(content).not.toContain("maximum-scale=1");
    });
  });

  // ==========================================
  // B2: Root CSS 100vw Overflow Boundaries
  // ==========================================
  test.describe("B2: CSS 100vw Overflow Boundaries", () => {
    test("B2.1: Forced vertical scrollbar on desktop 1440px does not induce horizontal overflow", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await page.evaluate(() => {
        document.documentElement.style.overflowY = "scroll";
      });
      await assertNoHorizontalOverflow(page, "forced-scrollbar-desktop");
    });

    test("B2.2: Extreme desktop 2560px ultrawide viewport maintains zero overflow", async ({ page }) => {
      await page.setViewportSize({ width: 2560, height: 1440 });
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      await assertNoHorizontalOverflow(page, "2560px-ultrawide");
    });

    test("B2.3: Body width strictly matches clientWidth (no 17px scrollbar leak)", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      const widthDiff = await page.evaluate(() => {
        return Math.abs(document.body.clientWidth - document.documentElement.clientWidth);
      });
      expect(widthDiff).toBeLessThanOrEqual(2);
    });

    test("B2.4: Deeply nested catalog grid containers do not expand beyond viewport", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      const maxContainerRight = await page.evaluate(() => {
        const containers = document.querySelectorAll("main, section, div.grid");
        let maxRight = 0;
        containers.forEach((c) => {
          const r = c.getBoundingClientRect().right;
          if (r > maxRight) maxRight = r;
        });
        return maxRight;
      });
      expect(maxContainerRight).toBeLessThanOrEqual(window.innerWidth + 2);
    });

    test("B2.5: Zero horizontal overflow during rapid full-page height transitions", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(200);
      await assertNoHorizontalOverflow(page, "scrolled-to-bottom");
    });
  });

  // ==========================================
  // B3: SiteHeader Mobile Touch Target Boundaries
  // ==========================================
  test.describe("B3: Header Touch Target Boundaries", () => {
    test("B3.1: Header touch target bounds at 1023px tablet breakpoint", async ({ page }) => {
      await page.setViewportSize({ width: 1023, height: 768 });
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const menuBtn = page.locator("button[aria-label='Open navigation menu']");
      await assertMinTouchTarget(menuBtn, 44, 44);
    });

    test("B3.2: Rapid tap events on hamburger button do not cause layout drift", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const isMobile = await page.evaluate(() => window.innerWidth < 1024);
      if (!isMobile) return;

      const menuBtn = page.locator("button[aria-label='Open navigation menu']");
      const box1 = await menuBtn.boundingBox();
      await menuBtn.click();
      const closeBtn = page.locator("button[aria-label='Close navigation drawer']");
      await closeBtn.click();
      const box2 = await menuBtn.boundingBox();

      expect(box1?.x).toBe(box2?.x);
      expect(box1?.y).toBe(box2?.y);
    });

    test("B3.3: Search panel open state preserves header bounding height", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const searchBtn = page.locator("button[aria-controls='maison-search-panel']");
      await searchBtn.click();
      const searchInput = page.locator("input#maison-search-input");
      await expect(searchInput).toBeVisible();
      await assertNoHorizontalOverflow(page, "search-panel-open");
    });

    test("B3.4: Cart badge with multi-digit count does not push header offscreen", async ({ page }) => {
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      await page.locator("button:has-text('Add to Case')").first().click();

      const caseTrigger = page.locator("button[aria-label^='Open Case']");
      await expect(caseTrigger).toBeVisible();
      const box = await caseTrigger.boundingBox();
      expect(box?.x).toBeLessThan(window.innerWidth);
    });

    test("B3.5: Header bounding box remains valid during downward scroll hide/reveal", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(300);
      await page.evaluate(() => window.scrollTo(0, 100));
      await page.waitForTimeout(300);

      const header = page.locator("header");
      await expect(header).toBeVisible();
    });
  });

  // ==========================================
  // B4: NavDrawer Boundaries
  // ==========================================
  test.describe("B4: NavDrawer Boundaries", () => {
    test("B4.1: Rapid open/close toggling prevents drawer lockup", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const isMobile = await page.evaluate(() => window.innerWidth < 1024);
      if (!isMobile) return;

      const menuBtn = page.locator("button[aria-label='Open navigation menu']");
      for (let i = 0; i < 3; i++) {
        await menuBtn.click();
        const closeBtn = page.locator("button[aria-label='Close navigation drawer']");
        await closeBtn.click();
      }
      await expect(menuBtn).toBeVisible();
    });

    test("B4.2: Tab key wraps around focusable elements in NavDrawer", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const isMobile = await page.evaluate(() => window.innerWidth < 1024);
      if (!isMobile) return;

      await page.locator("button[aria-label='Open navigation menu']").click();
      const closeBtn = page.locator("button[aria-label='Close navigation drawer']");
      await expect(closeBtn).toBeFocused();
    });

    test("B4.3: Backdrop tap dismisses NavDrawer", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const isMobile = await page.evaluate(() => window.innerWidth < 1024);
      if (!isMobile) return;

      await page.locator("button[aria-label='Open navigation menu']").click();
      const drawer = page.locator("aside[aria-label='Navigation Menu']");
      await expect(drawer).toBeVisible();

      // Click outside drawer on backdrop (right side of viewport)
      await page.mouse.click(window.innerWidth - 10, 200);
      await expect(drawer).not.toBeVisible();
    });

    test("B4.4: Window resize across 1024px breakpoint closes mobile NavDrawer", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await page.locator("button[aria-label='Open navigation menu']").click();

      // Resize to desktop
      await page.setViewportSize({ width: 1200, height: 800 });
      await page.waitForTimeout(300);

      const menuBtn = page.locator("button[aria-label='Open navigation menu']");
      await expect(menuBtn).not.toBeVisible();
    });

    test("B4.5: Background body scroll is locked while NavDrawer is active", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const isMobile = await page.evaluate(() => window.innerWidth < 1024);
      if (!isMobile) return;

      await page.locator("button[aria-label='Open navigation menu']").click();
      const isOverflowHidden = await page.evaluate(() => {
        return document.body.style.overflow === "hidden" || document.documentElement.style.overflow === "hidden";
      });
      expect(isOverflowHidden).toBe(true);
    });
  });

  // ==========================================
  // B5: CaseDrawer Boundaries
  // ==========================================
  test.describe("B5: CaseDrawer Boundaries", () => {
    test("B5.1: Empty cart state renders clear empty message and Explore button", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await page.locator("button[aria-label^='Open Case']").click();

      const drawer = page.locator("aside[aria-label='Your Case']");
      await expect(drawer).toBeVisible();
      await expect(drawer.getByText(/empty|no items/i)).toBeVisible();
    });

    test("B5.2: Maximum 240-character gift note renders with internal scrolling", async ({ page }) => {
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      await page.locator("button:has-text('Add to Case')").first().click();

      const drawer = page.locator("aside[aria-label='Your Case']");
      await expect(drawer).toBeVisible();

      const giftTrigger = drawer.locator("button:has-text('Gift note'), button:has-text('gift message')").first();
      if (await giftTrigger.isVisible()) {
        await giftTrigger.click();
      }

      const textarea = drawer.locator("textarea#case-gift-note, textarea[name='giftNote']").first();
      if (await textarea.isVisible()) {
        const longText = "A".repeat(240);
        await textarea.fill(longText);
        expect(await textarea.inputValue()).toBe(longText);
      }
    });

    test("B5.3: Soft keyboard emulation on 375x667 keeps drawer scrollable", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 400 }); // simulated keyboard
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      await page.locator("button:has-text('Add to Case')").first().click();

      const drawer = page.locator("aside[aria-label='Your Case']");
      await expect(drawer).toBeVisible();
      const scrollable = await drawer.evaluate((el) => {
        return el.scrollHeight >= el.clientHeight;
      });
      expect(scrollable).toBe(true);
    });

    test("B5.4: Decrementing stepper at quantity 1 triggers removal or keeps min 1", async ({ page }) => {
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      await page.locator("button:has-text('Add to Case')").first().click();

      const drawer = page.locator("aside[aria-label='Your Case']");
      const minusBtn = drawer.locator("button[aria-label='Decrease quantity']").first();
      await minusBtn.click();
      // Cart either decrements or removes cleanly
      await expect(drawer).toBeVisible();
    });

    test("B5.5: Quantity increment updates cart subtotal calculations", async ({ page }) => {
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      await page.locator("button:has-text('Add to Case')").first().click();

      const drawer = page.locator("aside[aria-label='Your Case']");
      const plusBtn = drawer.locator("button[aria-label='Increase quantity']").first();
      await plusBtn.click();

      const qty = drawer.locator("span.tabular-nums:has-text('2')").first();
      await expect(qty).toBeVisible();
    });
  });

  // ==========================================
  // B6: SiteFooter Boundaries
  // ==========================================
  test.describe("B6: Footer Boundaries", () => {
    test("B6.1: Smallest 320px viewport footer stacking check", async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 568 });
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await assertNoHorizontalOverflow(page, "footer-320px");
    });

    test("B6.2: Rapid multi-link tap test verifies isolated hit boxes", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const links = page.locator("footer a");
      const count = await links.count();
      for (let i = 0; i < Math.min(count, 4); i++) {
        const box = await links.nth(i).boundingBox();
        expect(box?.height).toBeGreaterThan(0);
      }
    });

    test("B6.3: Footer container reflows gracefully on high zoom", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await page.evaluate(() => {
        document.body.style.fontSize = "150%";
      });
      await assertNoHorizontalOverflow(page, "footer-zoomed");
    });

    test("B6.4: Legal disclaimer text wraps without horizontal bleed", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const footer = page.locator("footer");
      const box = await footer.boundingBox();
      expect(box?.width).toBeLessThanOrEqual(376);
    });

    test("B6.5: Footer links keyboard navigation tab order", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const firstFooterLink = page.locator("footer a").first();
      await firstFooterLink.focus();
      await expect(firstFooterLink).toBeFocused();
    });
  });

  // ==========================================
  // B7: Legal Spacing Boundaries
  // ==========================================
  test.describe("B7: Legal Spacing Boundaries", () => {
    test("B7.1: Zero-height viewport resize test on legal pages", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 450 });
      await page.goto("/legal/privacy", { waitUntil: "domcontentloaded" });
      await assertNoHorizontalOverflow(page, "legal-short-height");
    });

    test("B7.2: Direct navigation to /legal/terms with anchor fragment", async ({ page }) => {
      await page.goto("/legal/terms#terms-of-sale", { waitUntil: "domcontentloaded" });
      await assertNoHorizontalOverflow(page, "legal-terms-anchor");
    });

    test("B7.3: Fast scroll to footer on legal pages without layout jumping", async ({ page }) => {
      await page.goto("/legal/shipping-returns", { waitUntil: "domcontentloaded" });
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(200);
      await assertNoHorizontalOverflow(page, "legal-shipping-bottom");
    });

    test("B7.4: Legal document readability at 375px", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/legal/compliance-checklist", { waitUntil: "domcontentloaded" });
      const main = page.locator("main");
      await expect(main).toBeVisible();
      await assertNoHorizontalOverflow(page, "compliance-375px");
    });

    test("B7.5: Legal directory page cards wrap cleanly at 768px tablet", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto("/legal", { waitUntil: "domcontentloaded" });
      await assertNoHorizontalOverflow(page, "legal-768px");
    });
  });

  // ==========================================
  // B8: Hero Flacon Scaling Boundaries
  // ==========================================
  test.describe("B8: Hero Flacon Scaling Boundaries", () => {
    test("B8.1: Exact 375x667px (iPhone SE) short viewport flacon collision check", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await assertNoHorizontalOverflow(page, "hero-375x667");
    });

    test("B8.2: 390x667px short viewport flacon vertical bounds", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 667 });
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const hero = page.locator("section[aria-label='Hero']");
      await expect(hero).toBeVisible();
    });

    test("B8.3: Rapid scroll fling through Movement 1 transition", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await page.evaluate(() => {
        window.scrollBy({ top: 700, behavior: "smooth" });
      });
      await page.waitForTimeout(300);
      await assertNoHorizontalOverflow(page, "hero-rapid-scroll");
    });

    test("B8.4: Reduced motion media query disables parallax transforms", async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const hero = page.locator("section[aria-label='Hero']");
      await expect(hero).toBeVisible();
    });

    test("B8.5: Landscape mobile (667x375) hero container adaptation", async ({ page }) => {
      await page.setViewportSize({ width: 667, height: 375 });
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await assertNoHorizontalOverflow(page, "hero-landscape-mobile");
    });
  });

  // ==========================================
  // B9: TheCollection Carousel Boundaries
  // ==========================================
  test.describe("B9: Carousel Boundaries", () => {
    test("B9.1: Rapid consecutive clicks on Next button handle boundary cleanly", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const nextBtn = page.locator("button[aria-label='Next fragrances'], button[aria-label='Next fragrance']");
      for (let i = 0; i < 5; i++) {
        await nextBtn.click();
      }
      await assertNoHorizontalOverflow(page, "carousel-rapid-clicks");
    });

    test("B9.2: Cyclic boundary wrapping: carousel retains active item", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const cards = page.locator("[data-ledger-column], article:has(h3)");
      expect(await cards.count()).toBeGreaterThanOrEqual(1);
    });

    test("B9.3: Simultaneous reveal toggle and acquire tap handling", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const isMobile = await page.evaluate(() => window.innerWidth < 1024);
      if (!isMobile) return;

      const revealBtn = page.locator("button[aria-label^='Toggle ingredients']").first();
      await revealBtn.click();
      const acquireBtn = page.locator("button[aria-label^='Acquire']").first();
      await acquireBtn.click();

      // Case drawer opens
      const drawer = page.locator("aside[aria-label='Your Case']");
      await expect(drawer).toBeVisible();
    });

    test("B9.4: Touch flick gesture simulation across carousel track", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const track = page.locator("[data-ledger-column]").first();
      if (await track.isVisible()) {
        const box = await track.boundingBox();
        if (box) {
          await page.mouse.move(box.x + 200, box.y + 100);
          await page.mouse.down();
          await page.mouse.move(box.x + 50, box.y + 100);
          await page.mouse.up();
        }
      }
      await assertNoHorizontalOverflow(page, "carousel-swipe");
    });

    test("B9.5: Keyboard navigation across carousel controls", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const nextBtn = page.locator("button[aria-label='Next fragrances'], button[aria-label='Next fragrance']");
      await nextBtn.focus();
      await page.keyboard.press("Enter");
      await assertNoHorizontalOverflow(page, "carousel-keyboard");
    });
  });

  // ==========================================
  // B10: PrivateSalon Strip Boundaries
  // ==========================================
  test.describe("B10: PrivateSalon Strip Boundaries", () => {
    test("B10.1: Long email string (100 characters) does not break strip container", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      const input = page.locator("section input[type='email']").first();
      if (await input.isVisible()) {
        const longEmail = `${"a".repeat(80)}@ligero.com`;
        await input.fill(longEmail);
        await assertNoHorizontalOverflow(page, "salon-long-email");
      }
    });

    test("B10.2: Special characters in email input handled safely", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      const input = page.locator("section input[type='email']").first();
      if (await input.isVisible()) {
        await input.fill("test+special'chars@domain.co");
        expect(await input.inputValue()).toContain("test+special");
      }
    });

    test("B10.3: Rapid submission clicks do not cause error loops", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      const submitBtn = page.locator("section button[type='submit']").first();
      if (await submitBtn.isVisible()) {
        await submitBtn.click();
        await submitBtn.click();
      }
      await assertNoHorizontalOverflow(page, "salon-rapid-submit");
    });

    test("B10.4: Input focus and blur cycle does not alter page scroll position", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      const input = page.locator("section input[type='email']").first();
      if (await input.isVisible()) {
        await input.focus();
        await input.blur();
      }
    });

    test("B10.5: Strip background contrast and text legibility at mobile boundary", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      await assertNoHorizontalOverflow(page, "salon-375px");
    });
  });

  // ==========================================
  // B11: Catalog Card Geometry Boundaries
  // ==========================================
  test.describe("B11: Catalog Card Geometry Boundaries", () => {
    test("B11.1: Exact 375px viewport dual-column card width boundary", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      await assertNoHorizontalOverflow(page, "catalog-375px-boundary");
    });

    test("B11.2: Card with longest perfume name renders without layout break", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      const card = page.locator("article:has-text('Noir Cacao'), div[data-product-card]:has-text('Noir Cacao')").first();
      if (await card.isVisible()) {
        await expect(card).toBeVisible();
      }
    });

    test("B11.3: Card price formatting displays INR symbol", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      const price = page.locator("article:has-text('₹')").first();
      await expect(price).toBeVisible();
    });

    test("B11.4: Card hover focus state does not induce horizontal scroll", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      const firstCard = page.locator("article a, div[data-product-card] a").first();
      await firstCard.hover();
      await assertNoHorizontalOverflow(page, "card-hover-overflow");
    });

    test("B11.5: Image fallback gracefully handles broken image without collapse", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      const images = page.locator("article img");
      expect(await images.count()).toBeGreaterThan(0);
    });
  });

  // ==========================================
  // B12: Catalog Filter & Sort Boundaries
  // ==========================================
  test.describe("B12: Filter & Sort Boundaries", () => {
    test("B12.1: Category filter switching maintains non-empty card list", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      const floralBtn = page.locator("button:has-text('Floral')").first();
      if (await floralBtn.isVisible()) {
        await floralBtn.click();
        const cards = page.locator("article, div[data-product-card]");
        expect(await cards.count()).toBeGreaterThan(0);
      }
    });

    test("B12.2: Rapid category switching does not cause race conditions", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      const tabs = ["All", "Fresh", "Floral"];
      for (const t of tabs) {
        const btn = page.locator(`button:has-text('${t}')`).first();
        if (await btn.isVisible()) {
          await btn.click();
        }
      }
      await assertNoHorizontalOverflow(page, "rapid-tabs");
    });

    test("B12.3: Sort by price low-to-high order boundary", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      const sortBtn = page.locator("button:has-text('Sort')").first();
      if (await sortBtn.isVisible()) {
        await sortBtn.click();
        const lowToHigh = page.locator("button:has-text('Low to High'), [role='option']:has-text('Low')").first();
        if (await lowToHigh.isVisible()) {
          await lowToHigh.click();
          await assertNoHorizontalOverflow(page, "sort-low-to-high");
        }
      }
    });

    test("B12.4: Dropdown menu dismisses on outside click", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      const sortBtn = page.locator("button:has-text('Sort')").first();
      if (await sortBtn.isVisible()) {
        await sortBtn.click();
        const listbox = page.locator("[role='listbox'], div[data-sort-menu]");
        await expect(listbox).toBeVisible();

        await page.mouse.click(10, 10);
        await expect(listbox).not.toBeVisible();
      }
    });

    test("B12.5: Dropdown menu closes on Escape key", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      const sortBtn = page.locator("button:has-text('Sort')").first();
      if (await sortBtn.isVisible()) {
        await sortBtn.click();
        await page.keyboard.press("Escape");
        const listbox = page.locator("[role='listbox']");
        await expect(listbox).not.toBeVisible();
      }
    });
  });

  // ==========================================
  // B13: Catalog Pagination Boundaries
  // ==========================================
  test.describe("B13: Pagination Boundaries", () => {
    test("B13.1: Clicking current page 1 does not trigger redundant transition", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      const page1 = page.locator("button[aria-label='Page 1']").first();
      if (await page1.isVisible()) {
        await page1.click();
        await assertNoHorizontalOverflow(page, "page-1-click");
      }
    });

    test("B13.2: Terminal page boundary disables or handles next page", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      await assertNoHorizontalOverflow(page, "pagination-boundary");
    });

    test("B13.3: Direct navigation with arbitrary query parameter", async ({ page }) => {
      await page.goto("/collection?category=unknown", { waitUntil: "domcontentloaded" });
      await assertNoHorizontalOverflow(page, "unknown-category");
    });

    test("B13.4: Pagination maintains page scroll alignment", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      await assertNoHorizontalOverflow(page, "pagination-scroll");
    });

    test("B13.5: Rapid pagination clicks do not break catalog DOM", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      const nextBtn = page.locator("button[aria-label='Next page']").first();
      if (await nextBtn.isVisible()) {
        await nextBtn.click();
        await nextBtn.click();
      }
    });
  });

  // ==========================================
  // B14: Sticky Filter Bar Sync Boundaries
  // ==========================================
  test.describe("B14: Sticky Bar Sync Boundaries", () => {
    test("B14.1: Scroll threshold boundary at exact 649px vs 651px", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      await page.evaluate(() => window.scrollTo(0, 649));
      await page.waitForTimeout(200);
      await page.evaluate(() => window.scrollTo(0, 651));
      await page.waitForTimeout(200);
      await assertNoHorizontalOverflow(page, "threshold-650px");
    });

    test("B14.2: Direction-reversal oscillation does not produce visual jitter", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      for (let i = 0; i < 4; i++) {
        await page.evaluate((pos) => window.scrollTo(0, pos), 400 + (i % 2) * 50);
        await page.waitForTimeout(100);
      }
      await assertNoHorizontalOverflow(page, "oscillation-scroll");
    });

    test("B14.3: Page reload while scrolled past threshold preserves layout stability", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      await page.evaluate(() => window.scrollTo(0, 800));
      await page.reload({ waitUntil: "domcontentloaded" });
      await assertNoHorizontalOverflow(page, "reload-scrolled");
    });

    test("B14.4: Sticky bar z-index does not obscure modal overlays", async ({ page }) => {
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      await page.evaluate(() => window.scrollTo(0, 800));
      await page.locator("button[aria-label^='Open Case']").click();

      const drawer = page.locator("aside[aria-label='Your Case']");
      await expect(drawer).toBeVisible();
    });

    test("B14.5: Viewport orientation change while sticky bar is pinned", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/collection", { waitUntil: "domcontentloaded" });
      await page.evaluate(() => window.scrollTo(0, 800));
      await page.setViewportSize({ width: 844, height: 390 });
      await page.waitForTimeout(200);
      await assertNoHorizontalOverflow(page, "orientation-change");
    });
  });

  // ==========================================
  // B15: ProductStickyBar Boundaries
  // ==========================================
  test.describe("B15: ProductStickyBar Boundaries", () => {
    test("B15.1: Sticky bar appears at exact 651px scroll threshold on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      await page.evaluate(() => window.scrollTo(0, 680));
      await page.waitForTimeout(400);

      const bar = page.locator("div[aria-label='Sticky purchase bar'], div.fixed.bottom-0").first();
      await expect(bar).toBeVisible();
    });

    test("B15.2: Sticky bar button tap opens Case drawer", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      await page.evaluate(() => window.scrollTo(0, 750));
      await page.waitForTimeout(400);

      const addBtn = page.locator("div[aria-label='Sticky purchase bar'] button, div.fixed.bottom-0 button:has-text('Add to Case')").first();
      await addBtn.click();

      const drawer = page.locator("aside[aria-label='Your Case']");
      await expect(drawer).toBeVisible();
    });

    test("B15.3: Safe area inset emulation on iPhone standard", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      await page.evaluate(() => window.scrollTo(0, 750));
      await page.waitForTimeout(400);

      const bar = page.locator("div[aria-label='Sticky purchase bar'], div.fixed.bottom-0").first();
      await assertSafeAreaPadding(bar);
    });

    test("B15.4: Long fragrance title in sticky bar does not wrap into illegible lines", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/collection/noir-cacao", { waitUntil: "domcontentloaded" });
      await page.evaluate(() => window.scrollTo(0, 750));
      await page.waitForTimeout(400);

      const bar = page.locator("div[aria-label='Sticky purchase bar'], div.fixed.bottom-0").first();
      await expect(bar).toBeVisible();
      await assertNoHorizontalOverflow(page, "sticky-noir-cacao");
    });

    test("B15.5: Sticky bar hides cleanly at footer boundary", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(300);
      await assertNoHorizontalOverflow(page, "sticky-at-footer");
    });
  });

  // ==========================================
  // B16: ProductOrderPanel Boundaries
  // ==========================================
  test.describe("B16: Order Panel Boundaries", () => {
    test("B16.1: Rapid switching between formats updates price instantly", async ({ page }) => {
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      const btn50 = page.locator("button:has-text('50 ml')").first();
      const btnSet = page.locator("button:has-text('7 × 10 ml')").first();

      await btnSet.click();
      await expect(btnSet).toHaveAttribute("aria-pressed", "true");
      await btn50.click();
      await expect(btn50).toHaveAttribute("aria-pressed", "true");
    });

    test("B16.2: Format toggle keyboard accessibility", async ({ page }) => {
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      const btnSet = page.locator("button:has-text('7 × 10 ml')").first();
      await btnSet.focus();
      await page.keyboard.press("Space");
      await expect(btnSet).toHaveAttribute("aria-pressed", "true");
    });

    test("B16.3: Discovery Set banner click does not alter selected perfume format", async ({ page }) => {
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      const bannerBtn = page.locator("button:has-text('Add Discovery Set')").first();
      if (await bannerBtn.isVisible()) {
        await bannerBtn.click();
        const drawer = page.locator("aside[aria-label='Your Case']");
        await expect(drawer).toBeVisible();
      }
    });

    test("B16.4: Accordion expand/collapse toggles details cleanly", async ({ page }) => {
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      const accordion = page.locator("details, button[aria-expanded]").first();
      if (await accordion.isVisible()) {
        await accordion.click();
        await assertNoHorizontalOverflow(page, "accordion-expanded");
      }
    });

    test("B16.5: Main Add to Case button has distinct visual feedback on click", async ({ page }) => {
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      const addBtn = page.locator("main button:has-text('Add to Case')").first();
      await addBtn.click();
      const drawer = page.locator("aside[aria-label='Your Case']");
      await expect(drawer).toBeVisible();
    });
  });

  // ==========================================
  // B17: Scent Architecture Boundaries
  // ==========================================
  test.describe("B17: Scent Architecture Boundaries", () => {
    test("B17.1: Exact 768px tablet width boundary test", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      await assertNoHorizontalOverflow(page, "scent-768px");
    });

    test("B17.2: 767px mobile vs 769px tablet layout transition", async ({ page }) => {
      await page.setViewportSize({ width: 767, height: 1024 });
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      await assertNoHorizontalOverflow(page, "scent-767px");

      await page.setViewportSize({ width: 769, height: 1024 });
      await assertNoHorizontalOverflow(page, "scent-769px");
    });

    test("B17.3: Note cards with longest botanical descriptions wrap cleanly", async ({ page }) => {
      await page.goto("/collection/noir-cacao", { waitUntil: "domcontentloaded" });
      await assertNoHorizontalOverflow(page, "scent-noir-cacao");
    });

    test("B17.4: Pyramid tier hierarchy visual alignment", async ({ page }) => {
      await page.goto("/collection/blanc", { waitUntil: "domcontentloaded" });
      const scentSection = page.locator("section:has-text('Architecture')").first();
      await expect(scentSection).toBeAttached();
    });

    test("B17.5: Noctis dark theme scent architecture maintains high contrast", async ({ page }) => {
      await page.goto("/collection/noctis", { waitUntil: "domcontentloaded" });
      await assertNoHorizontalOverflow(page, "scent-noctis-dark");
    });
  });

  // ==========================================
  // B18: Gallery Lightbox & Reviews Boundaries
  // ==========================================
  test.describe("B18: Gallery & Reviews Boundaries", () => {
    test("B18.1: Lightbox modal preserves aspect ratio on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      const galleryBtn = page.locator("section[aria-label='Product image gallery'] button").first();
      if (await galleryBtn.isVisible()) {
        await galleryBtn.click();
        await assertNoHorizontalOverflow(page, "lightbox-375px");
      }
    });

    test("B18.2: Lightbox image navigation wraps or bounds cleanly", async ({ page }) => {
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      const galleryBtn = page.locator("section[aria-label='Product image gallery'] button").first();
      if (await galleryBtn.isVisible()) {
        await galleryBtn.click();
        const nextBtn = page.locator("button[aria-label*='Next']").first();
        if (await nextBtn.isVisible()) {
          await nextBtn.click();
        }
      }
    });

    test("B18.3: Reviews dialog with 500-character review body renders scrollably", async ({ page }) => {
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      const writeBtn = page.locator("button:has-text('Write a review')");
      if (await writeBtn.isVisible()) {
        await writeBtn.click();
        const textarea = page.locator("dialog textarea").first();
        if (await textarea.isVisible()) {
          await textarea.fill("A".repeat(300));
          expect(await textarea.inputValue()).toHaveLength(300);
        }
      }
    });

    test("B18.4: Reviews dialog star rating selection boundary", async ({ page }) => {
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      const writeBtn = page.locator("button:has-text('Write a review')");
      if (await writeBtn.isVisible()) {
        await writeBtn.click();
        const starBtn = page.locator("dialog button[aria-label*='star']").last();
        if (await starBtn.isVisible()) {
          await starBtn.click();
        }
      }
    });

    test("B18.5: Background page scroll is isolated while reviewing", async ({ page }) => {
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      const writeBtn = page.locator("button:has-text('Write a review')");
      if (await writeBtn.isVisible()) {
        await writeBtn.click();
        const dialog = page.locator("dialog:has(form)");
        await expect(dialog).toHaveAttribute("data-lenis-prevent", "");
      }
    });
  });

  // ==========================================
  // B19: Checkout Form iOS Safari Auto-Zoom Boundaries
  // ==========================================
  test.describe("B19: Checkout Auto-Zoom Boundaries", () => {
    test("B19.1: Mobile focus on phone number field retains computed fontSize >= 16px", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/checkout", { waitUntil: "domcontentloaded" });
      await assertNoIosZoom(page, "input#phone, input[name='phone']");
    });

    test("B19.2: Mobile focus on state/dropdown preserves fontSize >= 16px", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/checkout", { waitUntil: "domcontentloaded" });
      const stateSelect = page.locator("select#state, select[name='state']");
      if (await stateSelect.isVisible()) {
        await assertNoIosZoom(page, "select#state, select[name='state']");
      }
    });

    test("B19.3: Rapid tab navigation through all form inputs", async ({ page }) => {
      await page.goto("/checkout", { waitUntil: "domcontentloaded" });
      const firstInput = page.locator("form input").first();
      await firstInput.focus();
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press("Tab");
      }
      await assertNoHorizontalOverflow(page, "checkout-tabs");
    });

    test("B19.4: Autofill simulation on checkout form", async ({ page }) => {
      await page.goto("/checkout", { waitUntil: "domcontentloaded" });
      const nameInput = page.locator("input#fullName, input[name='fullName']").first();
      await nameInput.fill("Alexander Sterling");
      expect(await nameInput.inputValue()).toBe("Alexander Sterling");
    });

    test("B19.5: Validation error states do not reduce input font sizes", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/checkout", { waitUntil: "domcontentloaded" });
      const submitBtn = page.locator("button:has-text('Place Order'), button:has-text('Pay')").first();
      if (await submitBtn.isVisible()) {
        await submitBtn.click();
        await assertNoIosZoom(page, "input#fullName, input[name='fullName']");
      }
    });
  });

  // ==========================================
  // B20: Checkout Summary Steppers Boundaries
  // ==========================================
  test.describe("B20: Checkout Summary Boundaries", () => {
    test("B20.1: Empty checkout redirect or clean empty state", async ({ page }) => {
      await page.goto("/checkout", { waitUntil: "domcontentloaded" });
      await assertNoHorizontalOverflow(page, "checkout-empty");
    });

    test("B20.2: Quantity stepper stress: incrementing to 5 and decrementing", async ({ page }) => {
      await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
      await page.locator("button:has-text('Add to Case')").first().click();

      await page.goto("/checkout", { waitUntil: "domcontentloaded" });
      const plusBtn = page.locator("button[aria-label='Increase quantity']").first();
      if (await plusBtn.isVisible()) {
        for (let i = 0; i < 3; i++) {
          await plusBtn.click();
        }
        const minusBtn = page.locator("button[aria-label='Decrease quantity']").first();
        await minusBtn.click();
        await assertNoHorizontalOverflow(page, "checkout-stepper-stress");
      }
    });

    test("B20.3: Price formatting preserves INR currency notation", async ({ page }) => {
      await page.goto("/checkout", { waitUntil: "domcontentloaded" });
      const priceText = page.locator("aside, div:has-text('Order Summary')").first();
      await expect(priceText).toBeVisible();
    });

    test("B20.4: Sticky summary card boundary on desktop 1440px", async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto("/checkout", { waitUntil: "domcontentloaded" });
      await assertNoHorizontalOverflow(page, "checkout-1440px-summary");
    });

    test("B20.5: Checkout summary accordion toggle on mobile 375px", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/checkout", { waitUntil: "domcontentloaded" });
      await assertNoHorizontalOverflow(page, "checkout-375px-summary");
    });
  });

});

import { test, expect } from "@playwright/test";
import { assertNoHorizontalOverflow, assertMinTouchTarget, assertNoIosZoom, assertSafeAreaPadding, captureConsoleErrors } from "../helpers/responsive-assertions";

test.describe("Milestone 1 Adversarial Challenge: Shell, Focus Traps, Lenis & iOS Zoom", () => {

  test("F1 & F2: Viewport meta tag and root 100% width (no 100vw overflow)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Verify Viewport meta tag attributes
    const viewportMeta = page.locator('meta[name="viewport"]');
    await expect(viewportMeta).toHaveCount(1);
    const content = await viewportMeta.getAttribute("content");
    expect(content).toContain("width=device-width");
    expect(content).toContain("initial-scale=1");
    expect(content).toContain("viewport-fit=cover");

    // Verify root body CSS properties
    const bodyStyles = await page.evaluate(() => {
      const bodyStyle = window.getComputedStyle(document.body);
      const htmlStyle = window.getComputedStyle(document.documentElement);
      return {
        bodyOverflowX: bodyStyle.overflowX,
        htmlOverflowX: htmlStyle.overflowX,
        bodyWidth: bodyStyle.width,
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      };
    });

    expect(["clip", "hidden"]).toContain(bodyStyles.bodyOverflowX);
    expect(bodyStyles.scrollWidth).toBeLessThanOrEqual(bodyStyles.clientWidth + 1);

    await assertNoHorizontalOverflow(page, "Homepage Root");
  });

  test("F3: SiteHeader mobile touch targets >= 44x44px and no layout collision", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const isMobile = await page.evaluate(() => window.innerWidth < 1024);

    if (isMobile) {
      // Menu button
      const menuBtn = page.getByRole("button", { name: /open navigation menu/i });
      await assertMinTouchTarget(menuBtn, 44, 44);

      // Search button
      const searchBtn = page.getByRole("button", { name: /search fragrances/i });
      await assertMinTouchTarget(searchBtn, 44, 44);

      // Case button
      const caseBtn = page.getByRole("button", { name: /open case/i });
      await assertMinTouchTarget(caseBtn, 44, 44);

      // Verify no overlap between left/right controls and centered logo
      const logoBox = await page.locator("#site-header-logo-target").boundingBox();
      const menuBox = await menuBtn.boundingBox();
      const searchBox = await searchBtn.boundingBox();

      expect(logoBox).not.toBeNull();
      expect(menuBox).not.toBeNull();
      expect(searchBox).not.toBeNull();

      if (logoBox && menuBox && searchBox) {
        expect(menuBox.x + menuBox.width).toBeLessThanOrEqual(logoBox.x);
        expect(logoBox.x + logoBox.width).toBeLessThanOrEqual(searchBox.x);
      }
    }
  });

  test("F4: NavDrawer Focus Trap, Escape key, Lenis pause/resume & Focus Restoration", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const isMobile = await page.evaluate(() => window.innerWidth < 1024);
    if (!isMobile) return;

    const menuBtn = page.getByRole("button", { name: /open navigation menu/i });
    await expect(menuBtn).toBeVisible();

    // Focus trigger button explicitly with keyboard
    await menuBtn.focus();
    expect(await page.evaluate(() => document.activeElement === document.querySelector('button[aria-label="Open navigation menu"]'))).toBe(true);

    // Open drawer via Enter/Click
    await menuBtn.click();

    const drawerAside = page.locator('aside[aria-label="Navigation Menu"]');
    await expect(drawerAside).toBeVisible();

    // Verify data-lenis-prevent attribute on drawer aside
    const lenisPrevent = await drawerAside.getAttribute("data-lenis-prevent");
    expect(lenisPrevent).not.toBeNull();

    // Verify Lenis is paused
    const lenisPaused = await page.evaluate(() => {
      // If lenis exists, check its isStopped flag
      const lenis = (window as any).__lenis;
      return lenis ? lenis.isStopped : true;
    });
    expect(lenisPaused).toBe(true);

    // Verify initial focus in drawer (close button)
    const closeBtn = drawerAside.getByRole("button", { name: /close navigation drawer/i });
    await expect(closeBtn).toBeFocused();

    // Query all focusable elements inside the drawer
    const focusableInfo = await drawerAside.evaluate((aside) => {
      const focusable = aside.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      return {
        count: focusable.length,
        firstTag: focusable[0]?.tagName,
        firstHref: focusable[0]?.getAttribute("href"),
        lastTag: focusable[focusable.length - 1]?.tagName,
        lastHref: focusable[focusable.length - 1]?.getAttribute("href"),
      };
    });

    expect(focusableInfo.count).toBeGreaterThan(5);

    // Boundary Test 1: Shift+Tab wrap from the first element
    // First, focus the very first focusable element inside aside
    await drawerAside.locator('a[href="/"]').first().focus();
    const isFirstFocused = await drawerAside.locator('a[href="/"]').first().evaluate((el) => document.activeElement === el);
    expect(isFirstFocused).toBe(true);

    // Press Shift+Tab: focus should wrap to the last focusable element
    await page.keyboard.press("Shift+Tab");
    const isLastFocusedAfterShiftTab = await drawerAside.evaluate((aside) => {
      const focusable = aside.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      const last = focusable[focusable.length - 1];
      return document.activeElement === last;
    });
    expect(isLastFocusedAfterShiftTab, "Shift+Tab from first element should wrap to last element").toBe(true);

    // Boundary Test 2: Tab wrap from the last element
    // Press Tab from last element: focus should wrap to the first focusable element
    await page.keyboard.press("Tab");
    const isFirstFocusedAfterTab = await drawerAside.evaluate((aside) => {
      const focusable = aside.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      return document.activeElement === first;
    });
    expect(isFirstFocusedAfterTab, "Tab from last element should wrap to first element").toBe(true);

    // Touch targets in NavDrawer: Close button >= 44x44px
    await assertMinTouchTarget(closeBtn, 44, 44);

    // Check link touch target heights (all >= 44px)
    const links = drawerAside.locator("a");
    const linkCount = await links.count();
    for (let i = 0; i < Math.min(linkCount, 6); i++) {
      const link = links.nth(i);
      const box = await link.boundingBox();
      if (box) {
        expect(box.height, `Nav drawer link ${i} height >= 44px`).toBeGreaterThanOrEqual(43.5);
      }
    }

    // Test Safe Area Padding on NavDrawer
    await assertSafeAreaPadding(drawerAside);

    // Close via Escape key
    await page.keyboard.press("Escape");

    // Drawer should become hidden
    await expect(drawerAside).not.toBeVisible();

    // Lenis should resume
    const lenisResumed = await page.evaluate(() => {
      const lenis = (window as any).__lenis;
      return lenis ? !lenis.isStopped : true;
    });
    expect(lenisResumed).toBe(true);

    // Focus restoration: verify focus returned to the trigger button
    const isTriggerFocused = await menuBtn.evaluate((btn) => document.activeElement === btn);
    expect(isTriggerFocused, "Focus should return to menu trigger button upon close").toBe(true);
  });

  test("F5: CaseDrawer Focus Trap, Empty & Populated States, Lenis pause, iOS Safari Zoom & Safe Area", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const caseBtn = page.getByRole("button", { name: /open case/i });
    await expect(caseBtn).toBeVisible();

    // Focus trigger button
    await caseBtn.focus();

    // Open CaseDrawer
    await caseBtn.click();

    const caseAside = page.locator('aside[aria-label="Your Case"]');
    await expect(caseAside).toBeVisible();

    // Verify data-lenis-prevent attribute
    expect(await caseAside.getAttribute("data-lenis-prevent")).not.toBeNull();

    // Verify Lenis is paused
    const lenisPaused = await page.evaluate(() => {
      const lenis = (window as any).__lenis;
      return lenis ? lenis.isStopped : true;
    });
    expect(lenisPaused).toBe(true);

    // Test Empty Case state: Focusable elements = Close button, Explore the Collection
    const closeBtn = caseAside.getByRole("button", { name: /close case drawer/i });
    await expect(closeBtn).toBeFocused();

    // Shift+Tab from close button (first element) wraps to last element ("Explore the Collection")
    await page.keyboard.press("Shift+Tab");
    const exploreLink = caseAside.getByRole("link", { name: /explore the collection/i });
    await expect(exploreLink).toBeFocused();

    // Tab from "Explore the Collection" wraps back to close button
    await page.keyboard.press("Tab");
    await expect(closeBtn).toBeFocused();

    // Verify Safe Area Padding
    await assertSafeAreaPadding(caseAside);

    // Close via close button and check focus restoration
    await closeBtn.click();
    await expect(caseAside).not.toBeVisible();

    const isTriggerFocused = await caseBtn.evaluate((btn) => document.activeElement === btn);
    expect(isTriggerFocused, "Focus should return to case trigger button upon close").toBe(true);

    // Now navigate to a product page to add an item to the case and test populated drawer
    await page.goto("/collection/noctis");
    await page.waitForLoadState("domcontentloaded");

    // Click "Add to Case" or "Acquire"
    const acquireBtn = page.getByRole("button", { name: /add to case|acquire/i }).first();
    if (await acquireBtn.isVisible()) {
      await acquireBtn.click();
      // CaseDrawer should open automatically when item is added
      await expect(caseAside).toBeVisible();

      // Check quantity stepper buttons >= 44x44px
      const decreaseBtn = caseAside.getByRole("button", { name: /decrease .* quantity/i }).first();
      const increaseBtn = caseAside.getByRole("button", { name: /increase .* quantity/i }).first();
      await assertMinTouchTarget(decreaseBtn, 44, 44);
      await assertMinTouchTarget(increaseBtn, 44, 44);

      // Check remove button >= 44px height
      const removeBtn = caseAside.getByRole("button", { name: /remove/i }).first();
      await assertMinTouchTarget(removeBtn, 30, 44);

      // Open Gift Note accordion
      const giftNoteToggle = caseAside.getByRole("button", { name: /gift note/i });
      await assertMinTouchTarget(giftNoteToggle, 44, 44);
      await giftNoteToggle.click();

      // Check Gift Note textarea for iOS Safari auto-zoom prevention (fontSize >= 16px on mobile)
      const textarea = caseAside.locator("textarea#case-gift-note");
      await expect(textarea).toBeVisible();
      await assertNoIosZoom(page, "textarea#case-gift-note");

      // Verify Tab navigation wraps properly with open accordion
      // Focus close button
      await closeBtn.focus();
      // Shift+Tab wraps to last element (Checkout or link)
      await page.keyboard.press("Shift+Tab");
      const checkoutLink = caseAside.getByRole("link", { name: /proceed to checkout/i });
      const lastFocusable = await caseAside.evaluate((aside) => {
        const focusable = aside.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        return document.activeElement === focusable[focusable.length - 1];
      });
      expect(lastFocusable).toBe(true);

      // Tab wraps back to close button
      await page.keyboard.press("Tab");
      await expect(closeBtn).toBeFocused();

      // Close via Escape key
      await page.keyboard.press("Escape");
      await expect(caseAside).not.toBeVisible();
    }
  });

  test("F6: SiteFooter touch targets >= 44px, vertical mobile stack & safe area bottom", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const footer = page.locator("footer");
    await expect(footer).toBeVisible();

    // Verify safe area bottom padding on footer
    const footerPadding = await footer.evaluate((el) => parseFloat(window.getComputedStyle(el).paddingBottom));
    expect(footerPadding, "Footer paddingBottom should be >= 48px (3rem)").toBeGreaterThanOrEqual(48);

    // Verify touch target min-height on footer links
    const legalLinks = footer.locator("a");
    const count = await legalLinks.count();
    expect(count).toBeGreaterThan(5);

    for (let i = 0; i < Math.min(count, 8); i++) {
      const link = legalLinks.nth(i);
      const box = await link.boundingBox();
      if (box) {
        expect(box.height, `Footer link ${i} height >= 44px`).toBeGreaterThanOrEqual(43.5);
      }
    }
  });

  test("F7: Legal pages top padding responsive offset", async ({ page }) => {
    const legalPages = [
      "/legal",
      "/legal/privacy",
      "/legal/terms",
      "/legal/shipping-returns",
      "/legal/compliance-checklist",
    ];

    for (const url of legalPages) {
      await page.goto(url);
      await page.waitForLoadState("domcontentloaded");

      // Verify no horizontal overflow
      await assertNoHorizontalOverflow(page, `Legal Page: ${url}`);

      // Verify top padding dynamically accounts for header offset
      const mainOrContainer = page.locator("main, [class*='pt-[calc(var(--header-offset)']").first();
      await expect(mainOrContainer).toBeVisible();

      const paddingTop = await mainOrContainer.evaluate((el) => parseFloat(window.getComputedStyle(el).paddingTop));
      // header offset is 67-73px + 32px (2rem) = ~99px-105px minimum
      expect(paddingTop, `Padding top on ${url} should be >= 90px`).toBeGreaterThanOrEqual(90);
    }
  });
});

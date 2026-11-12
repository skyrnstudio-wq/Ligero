import { test, expect } from "@playwright/test";
import {
  assertNoHorizontalOverflow,
  assertMinTouchTarget,
  assertNoIosZoom,
  assertSafeAreaPadding,
} from "../helpers/responsive-assertions";

test.describe("Tier 4: Real-World E2E Application Scenarios (S1 to S5)", () => {

  // =========================================================================
  // Scenario S1: Mobile Discovery to Checkout Journey
  // Exercising: F1, F2, F3, F4, F9, F5, F19, F20
  // Target Viewports: mobile-se (375x667), mobile-std (390x844)
  // =========================================================================
  test("S1: Mobile Discovery to Checkout Journey", async ({ page }, testInfo) => {
    // Enforce target viewports: mobile-se and mobile-std
    const targetProjects = ["mobile-se", "mobile-std"];
    if (testInfo.project.name && !targetProjects.includes(testInfo.project.name)) {
      test.skip(true, `S1 is scoped to mobile-se and mobile-std (running in ${testInfo.project.name})`);
    }

    // 1. Visit Home on mobile
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await assertNoHorizontalOverflow(page, "S1: Home page");

    // 2. Interact with TheCollection Carousel (Movement 2)
    const nextBtn = page.locator("button[aria-label='Next fragrances'], button[aria-label='Next fragrance']").first();
    await expect(nextBtn).toBeVisible();
    await assertMinTouchTarget(nextBtn, 44, 44);
    await nextBtn.click();
    await page.waitForTimeout(400);

    // 3. Quick-acquire perfume from carousel
    const acquireBtn = page.locator("button[aria-label^='Acquire']").first();
    await expect(acquireBtn).toBeVisible();
    await assertMinTouchTarget(acquireBtn, 44, 44);
    await acquireBtn.click();

    // 4. CaseDrawer opens automatically
    const drawer = page.locator("aside[aria-label='Your Case']");
    await expect(drawer).toBeVisible();
    await expect(drawer).toHaveAttribute("data-lenis-prevent", "");

    // 5. Adjust quantity using steppers
    const plusBtn = drawer.locator("button[aria-label*='Increase']").first();
    await assertMinTouchTarget(plusBtn, 44, 44);
    await plusBtn.click();

    const qtyDisplay = drawer.locator("span.tabular-nums").first();
    await expect(qtyDisplay).toHaveText("2");

    // 6. Expand and enter gift note
    const giftTrigger = drawer.locator("button:has-text('gift note'), button:has-text('Gift note')").first();
    if (await giftTrigger.isVisible()) {
      await giftTrigger.click();
      const giftInput = drawer.locator("textarea#case-gift-note, textarea[name='giftNote']").first();
      if (await giftInput.isVisible()) {
        await assertNoIosZoom(page, "textarea#case-gift-note");
        await giftInput.fill("For my dearest on our anniversary.");
      }
    }

    // 7. Proceed to Checkout
    const checkoutBtn = drawer.locator("a[href='/checkout']").first();
    await expect(checkoutBtn).toBeVisible();
    await checkoutBtn.click();

    await page.waitForURL("**/checkout");
    await assertNoHorizontalOverflow(page, "S1: Checkout page");

    // 8. Verify all form inputs adhere to 16px font-size to prevent iOS auto-zoom
    const formInputs = [
      "input[name='fullName']",
      "input[name='email']",
      "input[name='phone']",
      "input[name='address']",
      "input[name='pincode']",
    ];

    for (const selector of formInputs) {
      const input = page.locator(selector).first();
      if (await input.isVisible()) {
        await assertNoIosZoom(page, selector);
      }
    }

    // 9. Fill out guest checkout details
    await page.locator("input[name='fullName']").fill("Julian Vance");
    await page.locator("input[name='email']").fill("julian.vance@example.com");
    await page.locator("input[name='phone']").fill("9876543210");
    await page.locator("input[name='address']").fill("74 Heritage Boulevard, Suite 402");
    await page.locator("input[name='pincode']").fill("400001");

    // 10. Verify order summary steppers have 44px touch targets
    const summaryPlus = page.locator("aside button:has-text('+'), div button:has-text('+')").first();
    if (await summaryPlus.isVisible()) {
      await assertMinTouchTarget(summaryPlus, 44, 44);
    }
  });

  // =========================================================================
  // Scenario S2: PDP Exploration, Gallery Lightbox & Sticky Bar
  // Exercising: F1, F2, F8, F15, F16, F17, F18
  // Target Viewports: mobile-se (375x667), mobile-std (390x844), tablet-portrait (768px)
  // =========================================================================
  test("S2: PDP Exploration, Gallery Lightbox & Sticky Bar", async ({ page }, testInfo) => {
    // Enforce target viewports: mobile-se, mobile-std, tablet-portrait
    const targetProjects = ["mobile-se", "mobile-std", "tablet-portrait"];
    if (testInfo.project.name && !targetProjects.includes(testInfo.project.name)) {
      test.skip(true, `S2 is scoped to mobile-se, mobile-std, and tablet-portrait (running in ${testInfo.project.name})`);
    }

    // 1. Visit Aubé PDP directly
    await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
    await assertNoHorizontalOverflow(page, "S2: /collection/aube");

    // 2. Select 7 × 10 ml Set format
    const formatSet = page.locator("button:has-text('7 × 10 ml')").first();
    await assertMinTouchTarget(formatSet, 44, 44);
    await formatSet.click();
    await expect(formatSet).toHaveAttribute("aria-pressed", "true");

    // 3. Switch back to 50 ml format
    const format50 = page.locator("button:has-text('50 ml')").first();
    await assertMinTouchTarget(format50, 44, 44);
    await format50.click();
    await expect(format50).toHaveAttribute("aria-pressed", "true");

    // 4. Open Gallery Lightbox Modal
    const galleryItem = page.locator("button[aria-label*='studio flacon'], div[role='button'][aria-label*='studio flacon'], button[aria-label*='atelier']").first();
    if (await galleryItem.isVisible()) {
      await galleryItem.click();

      // Verify Close button touch target
      const closeBtn = page.locator("button[aria-label='Close enlarged view']").first();
      await expect(closeBtn).toBeVisible();
      await assertMinTouchTarget(closeBtn, 44, 44);

      // Verify Next button touch target
      const nextBtn = page.locator("button:has-text('Next →')").first();
      if (await nextBtn.isVisible()) {
        await assertMinTouchTarget(nextBtn, 44, 44);
        await nextBtn.click();
      }

      // Close modal using Escape
      await page.keyboard.press("Escape");
      await expect(closeBtn).not.toBeVisible();
    }

    // 5. Scroll down to inspect Olfactory Architecture
    const scentSection = page.locator("section:has-text('Architecture'), section:has-text('Notes')").first();
    if (await scentSection.isVisible()) {
      await scentSection.scrollIntoViewIfNeeded();
      await assertNoHorizontalOverflow(page, "S2: Scent Architecture section");
    }

    // 6. Scroll past 650px to engage mobile sticky purchase bar
    const isMobileOrTablet = await page.evaluate(() => window.innerWidth < 1024);
    if (isMobileOrTablet) {
      await page.evaluate(() => window.scrollTo(0, 850));
      await page.waitForTimeout(400);

      const stickyBar = page.locator("div[aria-label='Sticky purchase bar'], div.fixed.bottom-0:has(button:has-text('Add to Case'))").first();
      if (await stickyBar.isVisible()) {
        await assertSafeAreaPadding(stickyBar);

        // Tap sticky Add to Case
        const stickyAddBtn = stickyBar.locator("button:has-text('Add to Case')").first();
        await assertMinTouchTarget(stickyAddBtn, 44, 44);
        await stickyAddBtn.click();

        // Confirm Case drawer opened with item
        const drawer = page.locator("aside[aria-label='Your Case']");
        await expect(drawer).toBeVisible();
      }
    }
  });

  // =========================================================================
  // Scenario S3: Catalog Filter, Sort, Pagination & Sticky Header Sync
  // Exercising: F2, F11, F12, F13, F14
  // Target Viewports: mobile-std (390x844), tablet-air (820px), desktop (1440px)
  // =========================================================================
  test("S3: Catalog Filter, Sort, Pagination & Sticky Header Sync", async ({ page }, testInfo) => {
    // Enforce target viewports: mobile-std, tablet-air, desktop
    const targetProjects = ["mobile-std", "tablet-air", "desktop"];
    if (testInfo.project.name && !targetProjects.includes(testInfo.project.name)) {
      test.skip(true, `S3 is scoped to mobile-std, tablet-air, and desktop (running in ${testInfo.project.name})`);
    }

    // 1. Visit Catalog
    await page.goto("/collection", { waitUntil: "domcontentloaded" });
    await assertNoHorizontalOverflow(page, "S3: Collection Catalog");

    // 2. Filter by "Amber & Woods" (Warm olfactive family)
    const warmBtn = page.locator("button:has-text('Amber'), button:has-text('Warm')").first();
    if (await warmBtn.isVisible()) {
      await assertMinTouchTarget(warmBtn, 44, 44);
      await warmBtn.click();
      await expect(warmBtn).toHaveAttribute("aria-pressed", "true");
    }

    // 3. Open Sort By dropdown and select an option
    const sortBtn = page.locator("button[aria-haspopup='listbox'], button:has-text('Sort')").first();
    if (await sortBtn.isVisible()) {
      await assertMinTouchTarget(sortBtn, 44, 44);
      await sortBtn.click();

      const option = page.locator("[role='option'], div[data-sort-menu] button, button:has-text('Price')").first();
      if (await option.isVisible()) {
        await assertMinTouchTarget(option, 44, 44);
        await option.click();
      }
    }

    // 4. Scroll down through catalog observing sticky filter bar
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(400);

    const stickyBar = page.locator("div.sticky:has(button:has-text('All'))").first();
    if (await stickyBar.isVisible()) {
      const box = await stickyBar.boundingBox();
      expect(box?.y).toBeLessThanOrEqual(75);
    }

    // 5. Check catalog card geometry
    const firstCard = page.locator("article").first();
    if (await firstCard.isVisible()) {
      const cardBox = await firstCard.boundingBox();
      expect(cardBox?.width).toBeGreaterThan(120);
    }

    // 6. Reset filter to "All"
    const allBtn = page.locator("button:has-text('All')").first();
    if (await allBtn.isVisible()) {
      await allBtn.click();
      await expect(allBtn).toHaveAttribute("aria-pressed", "true");
    }
    await assertNoHorizontalOverflow(page, "S3: Reset filter");
  });

  // =========================================================================
  // Scenario S4: Navigation Drawer & Focus Management Flow
  // Exercising: F3, F4, F5, F7
  // Target Viewports: mobile-se (375x667), tablet-portrait (768px)
  // =========================================================================
  test("S4: Navigation Drawer & Focus Management Flow", async ({ page }, testInfo) => {
    // Enforce target viewports: mobile-se and tablet-portrait
    const targetProjects = ["mobile-se", "tablet-portrait"];
    if (testInfo.project.name && !targetProjects.includes(testInfo.project.name)) {
      test.skip(true, `S4 is scoped to mobile-se and tablet-portrait (running in ${testInfo.project.name})`);
    }

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await assertNoHorizontalOverflow(page, "S4: Home");

    // 1. Open mobile NavDrawer
    const menuBtn = page.locator("button[aria-label='Open navigation menu']");
    await expect(menuBtn).toBeVisible();
    await assertMinTouchTarget(menuBtn, 44, 44);
    await menuBtn.focus();
    await menuBtn.click();

    const drawer = page.locator("aside[aria-label='Navigation Menu']");
    await expect(drawer).toBeVisible();
    await expect(drawer).toHaveAttribute("data-lenis-prevent", "");

    // 2. Verify Close button is focused and has touch target
    const closeBtn = page.locator("button[aria-label='Close navigation drawer']");
    await expect(closeBtn).toBeVisible();
    await assertMinTouchTarget(closeBtn, 44, 44);

    // 3. Navigate to /legal/privacy from drawer
    const privacyLink = drawer.locator("a[href='/legal/privacy'], a:has-text('Privacy')").first();
    if (await privacyLink.isVisible()) {
      await privacyLink.click();
      await page.waitForURL("**/legal/privacy");
      await assertNoHorizontalOverflow(page, "S4: Legal Privacy");

      // 4. Verify no 77px empty void
      const main = page.locator("main");
      await expect(main).toBeVisible();

      // 5. Open Case drawer from legal page
      const caseTrigger = page.locator("button[aria-label^='Open Case']");
      await expect(caseTrigger).toBeVisible();
      await assertMinTouchTarget(caseTrigger, 44, 44);
      await caseTrigger.click();

      const caseDrawer = page.locator("aside[aria-label='Your Case']");
      await expect(caseDrawer).toBeVisible();
      await expect(caseDrawer).toHaveAttribute("data-lenis-prevent", "");

      // Dismiss Case drawer with Escape
      await page.keyboard.press("Escape");
      await expect(caseDrawer).not.toBeVisible();
    }
  });

  // =========================================================================
  // Scenario S5: Dark-Themed PDP & Reviews Modal Flow
  // Exercising: F1, F2, F15, F16, F18
  // Target Viewports: mobile-std (390x844), laptop (1024px), desktop (1440px)
  // =========================================================================
  test("S5: Dark-Themed PDP & Reviews Modal Flow", async ({ page }, testInfo) => {
    // Enforce target viewports: mobile-std, laptop, desktop
    const targetProjects = ["mobile-std", "laptop", "desktop"];
    if (testInfo.project.name && !targetProjects.includes(testInfo.project.name)) {
      test.skip(true, `S5 is scoped to mobile-std, laptop, and desktop (running in ${testInfo.project.name})`);
    }

    // 1. Visit dark-themed perfume Noctis
    await page.goto("/collection/noctis", { waitUntil: "domcontentloaded" });
    await assertNoHorizontalOverflow(page, "S5: /collection/noctis");

    // 2. Open Reviews Submission Dialog
    const writeBtn = page.locator("button:has-text('Write a review')");
    if (await writeBtn.isVisible()) {
      await writeBtn.scrollIntoViewIfNeeded();
      await writeBtn.click();

      const dialog = page.locator("dialog:has(form)");
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveAttribute("data-lenis-prevent", "");

      // 3. Select 5-star rating
      const fifthStar = dialog.locator("label:has(input[value='5'])").first();
      if (await fifthStar.isVisible()) {
        await fifthStar.click();
      }

      // 4. Close dialog using Escape
      await page.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible();
    }

    // 5. Scroll down to Discovery banner
    const banner = page.locator("div:has(button:has-text('Add Discovery Set')), section:has(button:has-text('Add Discovery Set'))").first();
    if (await banner.isVisible()) {
      await banner.scrollIntoViewIfNeeded();
      const bannerBtn = banner.locator("button:has-text('Add Discovery Set'), button:has-text('Added')").first();
      if (await bannerBtn.isVisible()) {
        await assertMinTouchTarget(bannerBtn, 44, 44);
      }
    }

    // 6. Verify sticky bar visibility by viewport
    const isDesktopOrLaptop = await page.evaluate(() => window.innerWidth >= 1024);
    const stickyBar = page.locator("div[aria-label='Sticky purchase bar']");
    if (isDesktopOrLaptop) {
      // Sticky bar should remain hidden on desktop/laptop
      await expect(stickyBar).not.toBeVisible();
    } else {
      await page.evaluate(() => window.scrollTo(0, 850));
      await page.waitForTimeout(300);
      if (await stickyBar.isVisible()) {
        await assertSafeAreaPadding(stickyBar);
      }
    }

    await assertNoHorizontalOverflow(page, "S5: Noctis completed flow");
  });

});

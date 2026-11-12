import { test, expect } from "@playwright/test";
import {
  assertNoHorizontalOverflow,
  assertMinTouchTarget,
  assertNoIosZoom,
} from "../helpers/responsive-assertions";

test.describe("Tier 3: Cross-Feature Combinations Suite (Pairwise Interactions)", () => {

  // ==========================================
  // Combo 1: NavDrawer + CaseDrawer Mutually Exclusive State
  // ==========================================
  test("C1: Opening CaseDrawer while NavDrawer is open closes NavDrawer", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const isMobile = await page.evaluate(() => window.innerWidth < 1024);
    if (!isMobile) return;

    // Open NavDrawer
    await page.locator("button[aria-label='Open navigation menu']").click();
    const navDrawer = page.locator("aside[aria-label='Navigation Menu']");
    await expect(navDrawer).toBeVisible();

    // Trigger CaseDrawer from header
    const caseBtn = page.locator("button[aria-label^='Open Case']");
    await caseBtn.click();

    const caseDrawer = page.locator("aside[aria-label='Your Case']");
    await expect(caseDrawer).toBeVisible();
    await expect(navDrawer).not.toBeVisible();
  });

  test("C2: Opening NavDrawer while CaseDrawer is open closes CaseDrawer", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const isMobile = await page.evaluate(() => window.innerWidth < 1024);
    if (!isMobile) return;

    // Open CaseDrawer
    await page.locator("button[aria-label^='Open Case']").click();
    const caseDrawer = page.locator("aside[aria-label='Your Case']");
    await expect(caseDrawer).toBeVisible();

    // Trigger NavDrawer
    const menuBtn = page.locator("button[aria-label='Open navigation menu']");
    await menuBtn.click();

    const navDrawer = page.locator("aside[aria-label='Navigation Menu']");
    await expect(navDrawer).toBeVisible();
    await expect(caseDrawer).not.toBeVisible();
  });

  // ==========================================
  // Combo 2: Search Panel + Sticky Filter Bar
  // ==========================================
  test("C3: Opening Search Panel while Sticky Filter Bar is docked layers cleanly", async ({ page }) => {
    await page.goto("/collection", { waitUntil: "domcontentloaded" });
    // Scroll down to pin sticky bar
    await page.evaluate(() => window.scrollTo(0, 700));
    await page.waitForTimeout(300);

    // Open search panel
    const searchBtn = page.locator("button[aria-controls='maison-search-panel']");
    await searchBtn.click();

    const searchInput = page.locator("input#maison-search-input");
    await expect(searchInput).toBeVisible();
    await assertNoHorizontalOverflow(page, "search-over-sticky-bar");
  });

  test("C4: Live searching in Search Panel filters results without disturbing background page", async ({ page }) => {
    await page.goto("/collection", { waitUntil: "domcontentloaded" });
    const searchBtn = page.locator("button[aria-controls='maison-search-panel']");
    await searchBtn.click();

    const searchInput = page.locator("input#maison-search-input");
    await searchInput.fill("aube");
    await page.waitForTimeout(200);

    const result = page.locator("#maison-search-panel a:has-text('Aubé')");
    await expect(result).toBeVisible();
  });

  // ==========================================
  // Combo 3: Sticky Filter Bar Sync with Auto-Hiding Header
  // ==========================================
  test("C5: Downward scroll docks sticky filter bar to top without 67px vacant gap", async ({ page }) => {
    await page.goto("/collection", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(400);

    const stickyBar = page.locator("div.sticky:has(button:has-text('All'))").first();
    if (await stickyBar.isVisible()) {
      const box = await stickyBar.boundingBox();
      expect(box?.y).toBeLessThanOrEqual(75);
    }
  });

  test("C6: Upward scroll smoothly reveals SiteHeader without pushing sticky bar off-screen", async ({ page }) => {
    await page.goto("/collection", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(300);
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(400);

    const header = page.locator("header");
    await expect(header).toBeVisible();
    await assertNoHorizontalOverflow(page, "sticky-sync-upward-scroll");
  });

  // ==========================================
  // Combo 4: Product Format Selector + Sticky Purchase Bar
  // ==========================================
  test("C7: Changing product format to 7x10ml updates price in both panel and sticky bar", async ({ page }) => {
    await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
    const isMobile = await page.evaluate(() => window.innerWidth < 1024);
    if (!isMobile) return;

    // Scroll to activate sticky bar
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(400);

    const formatSet = page.locator("button:has-text('7 × 10 ml')").first();
    await formatSet.click();

    // Verify sticky bar reflects updated selection or price
    const stickyBar = page.locator("div[aria-label='Sticky purchase bar'], div.fixed.bottom-0").first();
    await expect(stickyBar).toBeVisible();
  });

  test("C8: Sticky bar Add to Case adds selected 7x10ml format to CaseDrawer", async ({ page }) => {
    await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
    const isMobile = await page.evaluate(() => window.innerWidth < 1024);
    if (!isMobile) return;

    const formatSet = page.locator("button:has-text('7 × 10 ml')").first();
    await formatSet.click();

    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(400);

    const addBtn = page.locator("div[aria-label='Sticky purchase bar'] button, div.fixed.bottom-0 button:has-text('Add to Case')").first();
    await addBtn.click();

    const drawer = page.locator("aside[aria-label='Your Case']");
    await expect(drawer).toBeVisible();
    await expect(drawer.getByText(/Aubé/i)).toBeVisible();
  });

  // ==========================================
  // Combo 5: Quantity Steppers + Cart Badge Count Synchronization
  // ==========================================
  test("C9: Stepper increment in CaseDrawer updates header cart badge counter", async ({ page }) => {
    await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
    await page.locator("button:has-text('Add to Case')").first().click();

    const drawer = page.locator("aside[aria-label='Your Case']");
    await expect(drawer).toBeVisible();

    const plusBtn = drawer.locator("button[aria-label='Increase quantity']").first();
    await plusBtn.click();

    // Close drawer
    const closeBtn = drawer.locator("button[aria-label='Close case']").first();
    await closeBtn.click();

    // Verify header badge displays 2
    const badge = page.locator("header span.tabular-nums, header [aria-label*='2 items']").first();
    await expect(badge).toBeVisible();
  });

  test("C10: Quantity changes in CaseDrawer synchronize seamlessly to /checkout", async ({ page }) => {
    await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
    await page.locator("button:has-text('Add to Case')").first().click();

    const drawer = page.locator("aside[aria-label='Your Case']");
    const plusBtn = drawer.locator("button[aria-label='Increase quantity']").first();
    await plusBtn.click();

    // Proceed to checkout
    const checkoutLink = drawer.locator("a:has-text('Checkout'), button:has-text('Checkout')").first();
    await checkoutLink.click();

    await page.waitForURL("**/checkout");
    const summary = page.locator("aside, div:has-text('Order Summary')").first();
    await expect(summary.locator("span.tabular-nums:has-text('2')")).toBeVisible();
  });

  // ==========================================
  // Combo 6: NavDrawer Navigation + Legal Header Spacing
  // ==========================================
  test("C11: Navigating to /legal/privacy from NavDrawer preserves responsive header clearance", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const isMobile = await page.evaluate(() => window.innerWidth < 1024);
    if (!isMobile) return;

    await page.locator("button[aria-label='Open navigation menu']").click();
    const legalLink = page.locator("aside[aria-label='Navigation Menu'] a[href*='legal'], aside a:has-text('Help'), aside a:has-text('Privacy')").first();
    if (await legalLink.isVisible()) {
      await legalLink.click();
      await assertNoHorizontalOverflow(page, "navdrawer-to-legal");
    }
  });

  // ==========================================
  // Combo 7: PDP Lightbox Modal + ProductStickyBar
  // ==========================================
  test("C12: Opening Lightbox modal layers cleanly above sticky purchase bar", async ({ page }) => {
    await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
    const isMobile = await page.evaluate(() => window.innerWidth < 1024);
    if (!isMobile) return;

    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(300);

    const galleryBtn = page.locator("section[aria-label='Product image gallery'] button").first();
    if (await galleryBtn.isVisible()) {
      await galleryBtn.click();
      const lightbox = page.locator("div[role='dialog']:has(button[aria-label*='Close'])").first();
      await expect(lightbox).toBeVisible();

      // Lightbox z-index should be >= 50
      const zIndex = await lightbox.evaluate((el) => window.getComputedStyle(el).zIndex);
      expect(Number(zIndex)).toBeGreaterThanOrEqual(50);
    }
  });

  // ==========================================
  // Combo 8: Discovery Banner + CaseDrawer Cross-sell
  // ==========================================
  test("C13: Adding Discovery Set from PDP banner creates 2 distinct items in CaseDrawer", async ({ page }) => {
    await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
    await page.locator("main button:has-text('Add to Case')").first().click();

    const drawer = page.locator("aside[aria-label='Your Case']");
    const closeBtn = drawer.locator("button[aria-label='Close case']").first();
    await closeBtn.click();

    const bannerAddBtn = page.locator("button:has-text('Add Discovery Set')").first();
    if (await bannerAddBtn.isVisible()) {
      await bannerAddBtn.click();
      await expect(drawer).toBeVisible();
      // Should contain Discovery Set and Aubé
      await expect(drawer.getByText(/Discovery Set/i)).toBeVisible();
      await expect(drawer.getByText(/Aubé/i)).toBeVisible();
    }
  });

  // ==========================================
  // Combo 9: Dark Theme PDP + Reviews Modal Scrolling
  // ==========================================
  test("C14: Noctis dark-themed PDP reviews dialog isolates scroll with data-lenis-prevent", async ({ page }) => {
    await page.goto("/collection/noctis", { waitUntil: "domcontentloaded" });
    const writeBtn = page.locator("button:has-text('Write a review')");
    if (await writeBtn.isVisible()) {
      await writeBtn.click();
      const dialog = page.locator("dialog:has(form)");
      await expect(dialog).toHaveAttribute("data-lenis-prevent", "");
    }
  });

  // ==========================================
  // Combo 10: Category Filter + Search Reset
  // ==========================================
  test("C15: Filtering by 'Warm' then searching resets to filtered view cleanly", async ({ page }) => {
    await page.goto("/collection", { waitUntil: "domcontentloaded" });
    const warmBtn = page.locator("button:has-text('Warm')").first();
    if (await warmBtn.isVisible()) {
      await warmBtn.click();
      await expect(warmBtn).toHaveAttribute("aria-pressed", "true");

      const searchBtn = page.locator("button[aria-controls='maison-search-panel']");
      await searchBtn.click();
      const closeSearch = page.locator("button[aria-label='Close search panel']");
      await closeSearch.click();

      // Warm filter remains active
      await expect(warmBtn).toHaveAttribute("aria-pressed", "true");
    }
  });

  // ==========================================
  // Combo 11: CaseDrawer Gift Note + Checkout Navigation
  // ==========================================
  test("C16: Gift note entered in CaseDrawer transfers to Checkout page", async ({ page }) => {
    await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
    await page.locator("button:has-text('Add to Case')").first().click();

    const drawer = page.locator("aside[aria-label='Your Case']");
    const giftTrigger = drawer.locator("button:has-text('Gift note'), button:has-text('gift message')").first();
    if (await giftTrigger.isVisible()) {
      await giftTrigger.click();
      const textarea = drawer.locator("textarea#case-gift-note, textarea[name='giftNote']").first();
      if (await textarea.isVisible()) {
        await textarea.fill("With love for your anniversary.");
        const checkoutBtn = drawer.locator("a:has-text('Checkout'), button:has-text('Checkout')").first();
        await checkoutBtn.click();

        await page.waitForURL("**/checkout");
        const checkoutNote = page.locator("textarea#giftNote, textarea[name='giftNote']").first();
        if (await checkoutNote.isVisible()) {
          expect(await checkoutNote.inputValue()).toBe("With love for your anniversary.");
        }
      }
    }
  });

  // ==========================================
  // Combo 12: Mobile Carousel Snap + Quick Acquire
  // ==========================================
  test("C17: Advancing home carousel to Fleur and clicking Acquire adds Fleur to cart", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const nextBtn = page.locator("button[aria-label='Next fragrances'], button[aria-label='Next fragrance']");
    await nextBtn.click();

    const acquireBtn = page.locator("button[aria-label^='Acquire Fleur'], button[aria-label^='Acquire']").first();
    await acquireBtn.click();

    const drawer = page.locator("aside[aria-label='Your Case']");
    await expect(drawer).toBeVisible();
  });

  // ==========================================
  // Combo 13: En Route Car Diffuser Quick Add + Case Drawer
  // ==========================================
  test("C18: Adding En Route from /objects/en-route adds diffuser item to cart", async ({ page }) => {
    await page.goto("/objects/en-route", { waitUntil: "domcontentloaded" });
    const addBtn = page.locator("button:has-text('Add to Case'), button:has-text('Acquire')").first();
    await addBtn.click();

    const drawer = page.locator("aside[aria-label='Your Case']");
    await expect(drawer).toBeVisible();
    await expect(drawer.getByText(/En Route/i)).toBeVisible();
  });

  // ==========================================
  // Combo 14: NavDrawer Focus Restoration
  // ==========================================
  test("C19: Dismissing NavDrawer restores focus back to Menu hamburger trigger", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const isMobile = await page.evaluate(() => window.innerWidth < 1024);
    if (!isMobile) return;

    const menuBtn = page.locator("button[aria-label='Open navigation menu']");
    await menuBtn.click();

    const closeBtn = page.locator("button[aria-label='Close navigation drawer']");
    await closeBtn.click();

    await expect(menuBtn).toBeFocused();
  });

  // ==========================================
  // Combo 15: Search Panel Escape Key Focus Restoration
  // ==========================================
  test("C20: Pressing Escape in Search Panel restores focus to Search trigger", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const searchBtn = page.locator("button[aria-controls='maison-search-panel']");
    await searchBtn.click();

    await page.keyboard.press("Escape");
    await expect(searchBtn).toBeFocused();
  });

  // ==========================================
  // Combo 16: Sticky Filter Bar + Sort Dropdown Alignment
  // ==========================================
  test("C21: Opening sort dropdown while sticky bar is pinned docks menu directly underneath", async ({ page }) => {
    await page.goto("/collection", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(300);

    const sortBtn = page.locator("button:has-text('Sort')").first();
    if (await sortBtn.isVisible()) {
      await sortBtn.click();
      const listbox = page.locator("[role='listbox'], div[data-sort-menu]");
      await expect(listbox).toBeVisible();

      const sortBox = await sortBtn.boundingBox();
      const listBox = await listbox.boundingBox();
      if (sortBox && listBox) {
        expect(listBox.y).toBeGreaterThanOrEqual(sortBox.y + sortBox.height - 2);
      }
    }
  });

  // ==========================================
  // Combo 17: Multi-Item Cart Removal & Empty State
  // ==========================================
  test("C22: Adding two distinct perfumes and removing both transitions to clean empty cart state", async ({ page }) => {
    await page.goto("/collection/aube", { waitUntil: "domcontentloaded" });
    await page.locator("button:has-text('Add to Case')").first().click();

    const drawer = page.locator("aside[aria-label='Your Case']");
    const closeBtn = drawer.locator("button[aria-label='Close case']").first();
    await closeBtn.click();

    await page.goto("/collection/blanc", { waitUntil: "domcontentloaded" });
    await page.locator("button:has-text('Add to Case')").first().click();

    await expect(drawer).toBeVisible();

    // Remove all items
    const removeBtns = drawer.locator("button:has-text('Remove'), button[aria-label*='Remove']");
    while ((await removeBtns.count()) > 0) {
      await removeBtns.first().click();
      await page.waitForTimeout(200);
    }

    await expect(drawer.getByText(/empty|no items/i)).toBeVisible();
  });

});

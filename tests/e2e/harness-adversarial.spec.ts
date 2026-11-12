import { test, expect } from "@playwright/test";
import {
  assertNoHorizontalOverflow,
  assertMinTouchTarget,
  assertNoIosZoom,
  assertSafeAreaPadding,
  captureConsoleErrors,
} from "../helpers/responsive-assertions";

test.describe("Adversarial Stress Test: Testing Harness & Assertion Sensitivity", () => {

  test("Stress 1: assertNoHorizontalOverflow catches injected overflow element and pinpoints culprit", async ({ page }) => {
    await page.goto("/help", { waitUntil: "domcontentloaded" });

    // Baseline: clean page has no overflow
    await assertNoHorizontalOverflow(page, "Help Baseline");

    // Adversarial Injection: inject element that blows out horizontal width
    await page.evaluate(() => {
      const badEl = document.createElement("div");
      badEl.id = "adversarial-overflow-culprit";
      badEl.style.width = "4000px";
      badEl.style.height = "20px";
      badEl.style.position = "relative";
      badEl.textContent = "Overflow Exploit";
      document.body.appendChild(badEl);
    });

    // Verify assertion FAILS when overflow is injected
    let errorCaught: Error | null = null;
    try {
      await assertNoHorizontalOverflow(page, "Help with Injected Overflow");
    } catch (err: any) {
      errorCaught = err;
    }

    expect(errorCaught, "assertNoHorizontalOverflow MUST fail when overflow element is injected").not.toBeNull();
    expect(errorCaught?.message).toContain("Horizontal overflow detected");
    expect(errorCaught?.message).toContain("body.scrollWidth=4000px");
  });

  test("Stress 2: assertMinTouchTarget rejects sub-44px targets with exact dimension reporting", async ({ page }) => {
    await page.goto("/help", { waitUntil: "domcontentloaded" });

    // Adversarial Injection: inject sub-44px touch target (24px x 24px)
    await page.evaluate(() => {
      const tinyBtn = document.createElement("button");
      tinyBtn.id = "adversarial-tiny-button";
      tinyBtn.style.width = "24px";
      tinyBtn.style.height = "24px";
      tinyBtn.style.display = "block";
      tinyBtn.textContent = "X";
      document.body.appendChild(tinyBtn);
    });

    const tinyLocator = page.locator("#adversarial-tiny-button");
    let errorCaught: Error | null = null;
    try {
      await assertMinTouchTarget(tinyLocator, 44, 44);
    } catch (err: any) {
      errorCaught = err;
    }

    expect(errorCaught, "assertMinTouchTarget MUST fail for a 24x24px button").not.toBeNull();
    expect(errorCaught?.message).toContain("Touch target width should be >= 44px (actual: 24px)");

    // Adversarial Injection 2: Inject compliant button (48px x 48px)
    await page.evaluate(() => {
      const compliantBtn = document.createElement("button");
      compliantBtn.id = "adversarial-compliant-button";
      compliantBtn.style.width = "48px";
      compliantBtn.style.height = "48px";
      compliantBtn.style.display = "block";
      compliantBtn.textContent = "OK";
      document.body.appendChild(compliantBtn);
    });

    const compliantLocator = page.locator("#adversarial-compliant-button");
    // Should NOT throw
    await assertMinTouchTarget(compliantLocator, 44, 44);
  });

  test("Stress 3: assertNoIosZoom rejects inputs with fontSize < 16px on mobile viewports", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/help", { waitUntil: "domcontentloaded" });

    // Adversarial Injection: inject input with 13px font
    await page.evaluate(() => {
      const smallInput = document.createElement("input");
      smallInput.id = "adversarial-small-input";
      smallInput.style.fontSize = "13px";
      smallInput.style.display = "block";
      document.body.appendChild(smallInput);
    });

    let errorCaught: Error | null = null;
    try {
      await assertNoIosZoom(page, "#adversarial-small-input");
    } catch (err: any) {
      errorCaught = err;
    }

    expect(errorCaught, "assertNoIosZoom MUST fail for 13px input on mobile").not.toBeNull();
    expect(errorCaught?.message).toContain("should be >= 16px to prevent iOS auto-zoom, found: 13px");

    // Compliant input: 16px
    await page.evaluate(() => {
      const safeInput = document.createElement("input");
      safeInput.id = "adversarial-safe-input";
      safeInput.style.fontSize = "16px";
      safeInput.style.display = "block";
      document.body.appendChild(safeInput);
    });

    // Should NOT throw
    await assertNoIosZoom(page, "#adversarial-safe-input");
  });

  test("Stress 4: assertSafeAreaPadding rejects insufficient bottom clearance", async ({ page }) => {
    await page.goto("/help", { waitUntil: "domcontentloaded" });

    // Adversarial Injection: inject container with 4px paddingBottom
    await page.evaluate(() => {
      const shallowBar = document.createElement("div");
      shallowBar.id = "adversarial-shallow-bar";
      shallowBar.style.paddingBottom = "4px";
      shallowBar.style.display = "block";
      document.body.appendChild(shallowBar);
    });

    const shallowLocator = page.locator("#adversarial-shallow-bar");
    let errorCaught: Error | null = null;
    try {
      await assertSafeAreaPadding(shallowLocator);
    } catch (err: any) {
      errorCaught = err;
    }

    expect(errorCaught, "assertSafeAreaPadding MUST fail for 4px padding-bottom").not.toBeNull();
    expect(errorCaught?.message).toContain("should have safe-area padding-bottom >= 12px, found: 4px");

    // Compliant container: 16px
    await page.evaluate(() => {
      const safeBar = document.createElement("div");
      safeBar.id = "adversarial-safe-bar";
      safeBar.style.paddingBottom = "16px";
      safeBar.style.display = "block";
      document.body.appendChild(safeBar);
    });

    const safeLocator = page.locator("#adversarial-safe-bar");
    // Should NOT throw
    await assertSafeAreaPadding(safeLocator);
  });

  test("Stress 5: captureConsoleErrors captures real unhandled page exceptions", async ({ page }) => {
    const { getErrors } = captureConsoleErrors(page);

    await page.goto("/help", { waitUntil: "domcontentloaded" });

    // Inject console error
    await page.evaluate(() => {
      console.error("Adversarial critical error injected into DOM");
    });

    const errors = getErrors();
    expect(errors.length).toBeGreaterThanOrEqual(1);
    expect(errors[0]).toContain("Adversarial critical error injected into DOM");
  });

});

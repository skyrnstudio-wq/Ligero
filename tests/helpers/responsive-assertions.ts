import { type Page, type Locator, expect } from "@playwright/test";

/**
 * Validates that the document and top-level containers do not produce horizontal overflow
 * on the current viewport.
 */
export async function assertNoHorizontalOverflow(page: Page, routeName: string = ""): Promise<void> {
  // Allow DOM to settle
  await page.waitForLoadState("domcontentloaded");

  const overflowInfo = await page.evaluate(() => {
    const docEl = document.documentElement;
    const body = document.body;
    const clientWidth = docEl.clientWidth;
    const scrollWidth = docEl.scrollWidth;
    const bodyScrollWidth = body ? body.scrollWidth : 0;

    // Subpixel tolerance: <= 1px
    const hasDocOverflow = scrollWidth > clientWidth + 1;
    const hasBodyOverflow = bodyScrollWidth > clientWidth + 1;

    const overflowingElements: Array<{
      selector: string;
      clientWidth: number;
      scrollWidth: number;
      rectRight: number;
      viewportWidth: number;
    }> = [];

    if (hasDocOverflow || hasBodyOverflow) {
      const allElements = document.querySelectorAll("*");
      for (const el of Array.from(allElements)) {
        const rect = el.getBoundingClientRect();
        // Check if element extends noticeably past the right viewport boundary
        if (rect.right > window.innerWidth + 2 && rect.width > 0 && rect.height > 0) {
          const tagName = el.tagName.toLowerCase();
          const id = el.id ? `#${el.id}` : "";
          const className = el.className && typeof el.className === "string" 
            ? `.${el.className.trim().split(/\s+/).slice(0, 3).join(".")}` 
            : "";
          overflowingElements.push({
            selector: `${tagName}${id}${className}`,
            clientWidth: el.clientWidth,
            scrollWidth: el.scrollWidth,
            rectRight: Math.round(rect.right),
            viewportWidth: window.innerWidth,
          });
          if (overflowingElements.length >= 5) break;
        }
      }
    }

    return {
      clientWidth,
      scrollWidth,
      bodyScrollWidth,
      hasOverflow: hasDocOverflow || hasBodyOverflow,
      overflowingElements,
    };
  });

  const failureDetails = overflowInfo.overflowingElements
    .map(
      (el) =>
        `Element "${el.selector}" extends to right=${el.rectRight}px (viewport=${el.viewportWidth}px, scrollWidth=${el.scrollWidth}px)`
    )
    .join("; ");

  expect(
    overflowInfo.hasOverflow,
    `Horizontal overflow detected on ${routeName || "page"}! clientWidth=${overflowInfo.clientWidth}px, document.scrollWidth=${overflowInfo.scrollWidth}px, body.scrollWidth=${overflowInfo.bodyScrollWidth}px. Culprits: ${failureDetails || "None detected"}`
  ).toBe(false);
}

/**
 * Validates that an interactive touch target meets WCAG 2.5.5 minimum dimensions (>=44x44px).
 */
export async function assertMinTouchTarget(
  locator: Locator,
  minWidth: number = 44,
  minHeight: number = 44
): Promise<void> {
  await expect(locator).toBeVisible();
  const box = await locator.boundingBox();

  expect(box, `Locator should have a bounding box`).not.toBeNull();
  if (box) {
    // 0.5px subpixel rounding tolerance
    expect(
      box.width,
      `Touch target width should be >= ${minWidth}px (actual: ${box.width}px)`
    ).toBeGreaterThanOrEqual(minWidth - 0.5);

    expect(
      box.height,
      `Touch target height should be >= ${minHeight}px (actual: ${box.height}px)`
    ).toBeGreaterThanOrEqual(minHeight - 0.5);
  }
}

/**
 * Validates that an input or textarea element renders with computed fontSize >= 16px
 * on mobile viewports (<640px) to prevent iOS Safari auto-zoom.
 */
export async function assertNoIosZoom(page: Page, selector: string): Promise<void> {
  const isMobile = await page.evaluate(() => window.innerWidth < 640);
  if (!isMobile) return;

  const locator = page.locator(selector).first();
  await expect(locator).toBeVisible();

  const fontSizeStr = await locator.evaluate((el) => {
    return window.getComputedStyle(el).fontSize;
  });

  const fontSize = parseFloat(fontSizeStr);
  expect(
    fontSize,
    `Element "${selector}" computed fontSize should be >= 16px to prevent iOS auto-zoom, found: ${fontSizeStr}`
  ).toBeGreaterThanOrEqual(16);
}

/**
 * Validates that a fixed bottom component has adequate safe area bottom clearance (>= 12px padding).
 */
export async function assertSafeAreaPadding(locator: Locator): Promise<void> {
  await expect(locator).toBeVisible();
  const paddingBottomStr = await locator.evaluate((el) => {
    return window.getComputedStyle(el).paddingBottom;
  });

  const paddingBottom = parseFloat(paddingBottomStr);
  expect(
    paddingBottom,
    `Component should have safe-area padding-bottom >= 12px, found: ${paddingBottomStr}`
  ).toBeGreaterThanOrEqual(12);
}

/**
 * Sets up listeners for console error capture on a page.
 */
export function captureConsoleErrors(page: Page): { getErrors: () => string[] } {
  const errors: string[] = [];

  page.on("pageerror", (err) => {
    errors.push(`PageError: ${err.message}`);
  });

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const text = msg.text();
      // Ignore known benign third-party or network noise (e.g. Razorpay test key warnings or missing cdn images)
      if (
        !text.includes("Razorpay") &&
        !text.includes("Failed to load resource") &&
        !text.includes("favicon")
      ) {
        errors.push(`ConsoleError: ${text}`);
      }
    }
  });

  return {
    getErrors: () => errors,
  };
}

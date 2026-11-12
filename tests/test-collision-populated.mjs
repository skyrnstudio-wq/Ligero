import { chromium } from "playwright";

async function testPopulatedCartHeaderAt320() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 320, height: 750 },
    isMobile: true,
    hasTouch: true,
  });

  // Navigate to product page and add item to cart
  await page.goto("http://localhost:3000/collection/noctis", { waitUntil: "networkidle" });
  const acquireBtn = page.getByRole("button", { name: /add to case|acquire/i }).first();
  await acquireBtn.click();
  await page.waitForTimeout(400);

  // Close the drawer to inspect header
  const closeBtn = page.getByRole("button", { name: /close case drawer/i });
  await closeBtn.click();
  await page.waitForTimeout(400);

  // Now measure header elements with cart count = 1
  const menuBtn = page.getByRole("button", { name: /open navigation menu/i });
  const logoEl = page.locator("#site-header-logo-target");
  const searchBtn = page.getByRole("button", { name: /search fragrances/i });
  const caseBtn = page.getByRole("button", { name: /open case/i });

  const menuBox = await menuBtn.boundingBox();
  const logoBox = await logoEl.boundingBox();
  const searchBox = await searchBtn.boundingBox();
  const caseBox = await caseBtn.boundingBox();

  console.log("=== POPULATED CART AT 320PX ===");
  console.log("Menu Box:", menuBox);
  console.log("Logo Box:", logoBox);
  console.log("Search Box:", searchBox);
  console.log("Case Box:", caseBox);

  const logoRight = logoBox.x + logoBox.width;
  const searchLeft = searchBox.x;
  const rightClearance = searchLeft - logoRight;

  console.log(`Logo right: ${logoRight}, Search left: ${searchLeft}`);
  console.log(`Right clearance at 320px with item in cart: ${rightClearance}px`);

  if (rightClearance < 0) {
    console.error(`COLLISION DETECTED! Overlap of ${Math.abs(rightClearance)}px!`);
  } else {
    console.log(`No collision: clearance is ${rightClearance}px`);
  }

  // Also check at 360px
  await page.setViewportSize({ width: 360, height: 750 });
  await page.waitForTimeout(200);

  const logoBox360 = await logoEl.boundingBox();
  const searchBox360 = await searchBtn.boundingBox();
  const rightClearance360 = searchBox360.x - (logoBox360.x + logoBox360.width);
  console.log(`Right clearance at 360px with item in cart: ${rightClearance360}px`);

  await browser.close();
}

testPopulatedCartHeaderAt320().catch(console.error);

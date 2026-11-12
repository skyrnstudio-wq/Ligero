import { chromium } from "playwright";

const VIEWPORTS = [320, 360, 375, 390, 414];
const BASE_URL = "http://localhost:3000";

async function runEmpiricalStressTest() {
  const browser = await chromium.launch({ headless: true });
  const results = {
    rootOverflow: [],
    headerCollision: [],
    touchTargetsHeader: [],
    touchTargetsNavDrawer: [],
    touchTargetsCaseDrawer: [],
    touchTargetsFooter: [],
  };

  console.log("=== STARTING EMPIRICAL GEOMETRY & OVERFLOW STRESS TEST ===");

  // 1. Stress-test Root CSS Layout & Header Collisions across viewports
  for (const width of VIEWPORTS) {
    const page = await browser.newPage({
      viewport: { width, height: 750 },
      isMobile: true,
      hasTouch: true,
    });

    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

    // Check Root CSS layout
    const rootMetrics = await page.evaluate(() => {
      const html = document.documentElement;
      const body = document.body;
      const htmlStyle = window.getComputedStyle(html);
      const bodyStyle = window.getComputedStyle(body);

      return {
        clientWidth: html.clientWidth,
        scrollWidth: html.scrollWidth,
        bodyClientWidth: body.clientWidth,
        bodyScrollWidth: body.scrollWidth,
        htmlOverflowX: htmlStyle.overflowX,
        bodyOverflowX: bodyStyle.overflowX,
        bodyWidth: bodyStyle.width,
        bodyMaxWidth: bodyStyle.maxWidth,
      };
    });

    const hasHorizontalOverflow = rootMetrics.scrollWidth > rootMetrics.clientWidth;
    results.rootOverflow.push({
      width,
      ...rootMetrics,
      hasHorizontalOverflow,
      pass: !hasHorizontalOverflow && (rootMetrics.bodyOverflowX === "clip" || rootMetrics.bodyOverflowX === "hidden"),
    });

    // Check Header Geometry & Collisions
    const menuBtn = page.getByRole("button", { name: /open navigation menu/i });
    const logoEl = page.locator("#site-header-logo-target");
    const searchBtn = page.getByRole("button", { name: /search fragrances/i });
    const caseBtn = page.getByRole("button", { name: /open case/i });

    const menuBox = await menuBtn.boundingBox();
    const logoBox = await logoEl.boundingBox();
    const searchBox = await searchBtn.boundingBox();
    const caseBox = await caseBtn.boundingBox();

    if (!menuBox || !logoBox || !searchBox || !caseBox) {
      throw new Error(`Failed to get bounding boxes at viewport ${width}`);
    }

    const menuRight = menuBox.x + menuBox.width;
    const logoLeft = logoBox.x;
    const logoRight = logoBox.x + logoBox.width;
    const searchLeft = searchBox.x;

    const leftClearance = logoLeft - menuRight;
    const rightClearance = searchLeft - logoRight;
    const hasCollision = leftClearance <= 0 || rightClearance <= 0;

    results.headerCollision.push({
      width,
      menuBox: { x: menuBox.x, y: menuBox.y, w: menuBox.width, h: menuBox.height, right: menuRight },
      logoBox: { x: logoBox.x, y: logoBox.y, w: logoBox.width, h: logoBox.height, left: logoLeft, right: logoRight },
      searchBox: { x: searchBox.x, y: searchBox.y, w: searchBox.width, h: searchBox.height, left: searchLeft },
      caseBox: { x: caseBox.x, y: caseBox.y, w: caseBox.width, h: caseBox.height },
      leftClearance,
      rightClearance,
      pass: !hasCollision,
    });

    // Record header touch targets at this viewport
    results.touchTargetsHeader.push({
      width,
      menu: { w: menuBox.width, h: menuBox.height, pass: menuBox.width >= 44 && menuBox.height >= 44 },
      search: { w: searchBox.width, h: searchBox.height, pass: searchBox.width >= 44 && searchBox.height >= 44 },
      case: { w: caseBox.width, h: caseBox.height, pass: caseBox.width >= 44 && caseBox.height >= 44 },
    });

    await page.close();
  }

  // 2. Stress-test NavDrawer Touch Targets on 375px mobile viewport
  {
    const page = await browser.newPage({
      viewport: { width: 375, height: 667 },
      isMobile: true,
      hasTouch: true,
    });
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

    // Open NavDrawer
    const menuBtn = page.getByRole("button", { name: /open navigation menu/i });
    await menuBtn.click();
    await page.waitForTimeout(400); // Wait for transition

    const drawerAside = page.locator('aside[aria-label="Navigation Menu"]');
    const closeBtn = drawerAside.getByRole("button", { name: /close navigation drawer/i });
    const closeBox = await closeBtn.boundingBox();

    // Check all links in NavDrawer
    const links = await drawerAside.locator("a").all();
    const linkResults = [];

    for (const link of links) {
      const text = (await link.innerText()).trim().replace(/\n/g, " ");
      const href = await link.getAttribute("href");
      const box = await link.boundingBox();
      if (box) {
        linkResults.push({
          text,
          href,
          w: box.width,
          h: box.height,
          passHeight: box.height >= 43.5, // 44px
        });
      }
    }

    results.touchTargetsNavDrawer = {
      closeButton: {
        w: closeBox?.width,
        h: closeBox?.height,
        pass: (closeBox?.height ?? 0) >= 43.5 && (closeBox?.width ?? 0) >= 43.5,
      },
      links: linkResults,
    };

    // Close NavDrawer
    await closeBtn.click();
    await page.waitForTimeout(400);
    await page.close();
  }

  // 3. Stress-test CaseDrawer Touch Targets (Empty state + Populated state with +/- and Remove)
  {
    const page = await browser.newPage({
      viewport: { width: 375, height: 667 },
      isMobile: true,
      hasTouch: true,
    });
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

    // Open CaseDrawer (empty)
    const caseBtn = page.getByRole("button", { name: /open case/i });
    await caseBtn.click();
    await page.waitForTimeout(400);

    const caseAside = page.locator('aside[aria-label="Your Case"]');
    const closeBtn = caseAside.getByRole("button", { name: /close case drawer/i });
    const closeBox = await closeBtn.boundingBox();

    const emptyLink = caseAside.getByRole("link", { name: /explore the collection/i });
    const emptyLinkBox = await emptyLink.boundingBox();

    results.touchTargetsCaseDrawer.push({
      state: "empty",
      closeButton: {
        w: closeBox?.width,
        h: closeBox?.height,
        pass: (closeBox?.height ?? 0) >= 43.5 && (closeBox?.width ?? 0) >= 43.5,
      },
      emptyLink: {
        w: emptyLinkBox?.width,
        h: emptyLinkBox?.height,
        pass: (emptyLinkBox?.height ?? 0) >= 43.5,
      },
    });

    // Close CaseDrawer
    await closeBtn.click();
    await page.waitForTimeout(400);

    // Go to product page and add item
    await page.goto(`${BASE_URL}/collection/noctis`, { waitUntil: "networkidle" });
    const acquireBtn = page.getByRole("button", { name: /add to case|acquire/i }).first();
    await acquireBtn.click();
    await page.waitForTimeout(400);

    // Case drawer should now be open and populated
    const decreaseBtn = caseAside.getByRole("button", { name: /decrease .* quantity/i }).first();
    const increaseBtn = caseAside.getByRole("button", { name: /increase .* quantity/i }).first();
    const removeBtn = caseAside.getByRole("button", { name: /remove/i }).first();
    const giftNoteToggle = caseAside.getByRole("button", { name: /gift note/i });
    const checkoutLink = caseAside.getByRole("link", { name: /proceed to checkout/i });

    const decBox = await decreaseBtn.boundingBox();
    const incBox = await increaseBtn.boundingBox();
    const remBox = await removeBtn.boundingBox();
    const giftBox = await giftNoteToggle.boundingBox();
    const checkBox = await checkoutLink.boundingBox();

    // Open gift note and check textarea fontSize
    await giftNoteToggle.click();
    const textarea = caseAside.locator("textarea#case-gift-note");
    const textareaFontSize = await textarea.evaluate((el) => window.getComputedStyle(el).fontSize);

    results.touchTargetsCaseDrawer.push({
      state: "populated",
      stepperDecrease: {
        w: decBox?.width,
        h: decBox?.height,
        pass: (decBox?.width ?? 0) >= 43.5 && (decBox?.height ?? 0) >= 43.5,
      },
      stepperIncrease: {
        w: incBox?.width,
        h: incBox?.height,
        pass: (incBox?.width ?? 0) >= 43.5 && (incBox?.height ?? 0) >= 43.5,
      },
      removeButton: {
        w: remBox?.width,
        h: remBox?.height,
        pass: (remBox?.height ?? 0) >= 43.5,
      },
      giftNoteToggle: {
        w: giftBox?.width,
        h: giftBox?.height,
        pass: (giftBox?.height ?? 0) >= 43.5,
      },
      checkoutButton: {
        w: checkBox?.width,
        h: checkBox?.height,
        pass: (checkBox?.height ?? 0) >= 43.5,
      },
      textareaFontSize,
      textareaNoZoomPass: parseFloat(textareaFontSize) >= 16,
    });

    await page.close();
  }

  // 4. Stress-test SiteFooter touch targets
  {
    const page = await browser.newPage({
      viewport: { width: 375, height: 667 },
      isMobile: true,
      hasTouch: true,
    });
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

    const footer = page.locator("footer");
    const footerLinks = await footer.locator("a").all();
    const footerLinkResults = [];

    for (const link of footerLinks) {
      const text = (await link.innerText()).trim().replace(/\n/g, " ");
      const href = await link.getAttribute("href");
      const box = await link.boundingBox();
      if (box) {
        footerLinkResults.push({
          text,
          href,
          w: box.width,
          h: box.height,
          passHeight: box.height >= 43.5,
        });
      }
    }

    results.touchTargetsFooter = footerLinkResults;
    await page.close();
  }

  await browser.close();

  console.log(JSON.stringify(results, null, 2));
}

runEmpiricalStressTest().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});

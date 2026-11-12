import { chromium } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const VIEWPORTS = [
  { name: "320px (iPhone SE 1st gen)", width: 320, height: 568 },
  { name: "360px (Galaxy S8/A-series)", width: 360, height: 640 },
  { name: "375px (iPhone SE 2nd/3rd)", width: 375, height: 667 },
  { name: "390px (iPhone 12/13/14)", width: 390, height: 844 },
];

const LEGAL_ROUTES = [
  "/legal",
  "/legal/privacy",
  "/legal/terms",
  "/legal/shipping-returns",
  "/legal/compliance-checklist",
  "/legal/grievance",
];

async function run() {
  console.log("=== EMPIRICAL ADVERSARIAL STRESS TEST FOR MILESTONE 1 ===");
  const browser = await chromium.launch({ headless: true });
  const results = {
    overflow: [],
    crestCollision: [],
    touchTargets: [],
    iosZoom: [],
    safeAreas: [],
    focusTrap: [],
    lenisLock: [],
    legalPadding: [],
  };

  try {
    for (const vp of VIEWPORTS) {
      console.log(`\n--- Testing Viewport: ${vp.name} (${vp.width}x${vp.height}) ---`);
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        hasTouch: true,
        isMobile: true,
      });
      const page = await context.newPage();

      // 1. Root & Overflow on Home
      await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(500);

      const homeOverflow = await page.evaluate(() => {
        const doc = document.documentElement;
        const body = document.body;
        return {
          clientWidth: doc.clientWidth,
          scrollWidth: doc.scrollWidth,
          bodyScrollWidth: body ? body.scrollWidth : 0,
          innerWidth: window.innerWidth,
          overflowX: window.getComputedStyle(body).overflowX,
          maxWidth: window.getComputedStyle(body).maxWidth,
          width: window.getComputedStyle(body).width,
        };
      });

      const hasHomeOverflow = homeOverflow.scrollWidth > homeOverflow.clientWidth + 1;
      results.overflow.push({
        viewport: vp.name,
        route: "/",
        hasOverflow: hasHomeOverflow,
        details: homeOverflow,
      });

      // 2. Header Geometry & Crest Collision
      const menuBtn = page.locator('button[aria-label="Open navigation menu"]');
      const crestLogo = page.locator("#site-header-logo-target");
      const searchBtn = page.locator('button[aria-label="Search fragrances and objects"]');
      const caseBtn = page.locator('button[aria-label^="Open Case"]');
      const header = page.locator("header");

      const menuBox = await menuBtn.boundingBox();
      const crestBox = await crestLogo.boundingBox();
      const searchBox = await searchBtn.boundingBox();
      const caseBox = await caseBtn.boundingBox();
      const headerBox = await header.boundingBox();

      // Check Touch Targets on Header
      results.touchTargets.push({
        viewport: vp.name,
        element: "Header: Menu Trigger",
        box: menuBox,
        pass: menuBox && menuBox.width >= 43.5 && menuBox.height >= 43.5,
      });
      results.touchTargets.push({
        viewport: vp.name,
        element: "Header: Search Trigger",
        box: searchBox,
        pass: searchBox && searchBox.width >= 43.5 && searchBox.height >= 43.5,
      });
      results.touchTargets.push({
        viewport: vp.name,
        element: "Header: Case Trigger (empty)",
        box: caseBox,
        pass: caseBox && caseBox.width >= 43.5 && caseBox.height >= 43.5,
      });

      // Crest Collision Analysis
      if (menuBox && crestBox && searchBox) {
        const leftGap = crestBox.x - (menuBox.x + menuBox.width);
        const rightGap = searchBox.x - (crestBox.x + crestBox.width);
        const collides = leftGap < 0 || rightGap < 0;

        results.crestCollision.push({
          viewport: vp.name,
          menuRight: menuBox.x + menuBox.width,
          crestLeft: crestBox.x,
          crestRight: crestBox.x + crestBox.width,
          searchLeft: searchBox.x,
          leftGap: Math.round(leftGap * 10) / 10,
          rightGap: Math.round(rightGap * 10) / 10,
          collision: collides,
        });
      }

      // 3. Test Crest Collision with Items in Case (Cart Badge present)
      await page.evaluate(() => {
        // Mock add item to cart via localStorage
        const testItem = [
          {
            slug: "noctis",
            name: "Noctis",
            price: "₹18,500",
            volume: "50ml Extrait",
            image: "/images/perfumes/cutouts/noctis.webp",
            quantity: 99,
          },
        ];
        localStorage.setItem("ligero_case", JSON.stringify(testItem));
      });
      await page.reload({ waitUntil: "domcontentloaded" });
      await page.waitForTimeout(500);

      const searchBoxWithBadge = await page.locator('button[aria-label="Search fragrances and objects"]').boundingBox();
      const crestBoxWithBadge = await page.locator("#site-header-logo-target").boundingBox();
      const caseBoxWithBadge = await page.locator('button[aria-label^="Open Case"]').boundingBox();

      results.touchTargets.push({
        viewport: vp.name,
        element: "Header: Case Trigger (with 99 badge)",
        box: caseBoxWithBadge,
        pass: caseBoxWithBadge && caseBoxWithBadge.width >= 43.5 && caseBoxWithBadge.height >= 43.5,
      });

      if (crestBoxWithBadge && searchBoxWithBadge) {
        const rightGapBadge = searchBoxWithBadge.x - (crestBoxWithBadge.x + crestBoxWithBadge.width);
        results.crestCollision.push({
          viewport: `${vp.name} [99 Items Badge]`,
          crestRight: crestBoxWithBadge.x + crestBoxWithBadge.width,
          searchLeft: searchBoxWithBadge.x,
          rightGap: Math.round(rightGapBadge * 10) / 10,
          collision: rightGapBadge < 0,
        });
      }

      // 4. Test Case Drawer (Full Cart)
      await page.locator('button[aria-label^="Open Case"]').click();
      await page.waitForTimeout(400); // allow drawer animation

      const caseDrawer = page.locator('aside[aria-label="Your Case"]');
      const caseCloseBtn = page.locator('button[aria-label="Close Case drawer"]');
      const minusBtn = page.locator('button[aria-label^="Decrease"]').first();
      const plusBtn = page.locator('button[aria-label^="Increase"]').first();
      const removeBtn = page.locator("text=Remove").first();
      const checkoutBtn = page.locator("text=Proceed to Checkout").first();

      const caseCloseBox = await caseCloseBtn.boundingBox();
      const minusBox = await minusBtn.boundingBox();
      const plusBox = await plusBtn.boundingBox();
      const removeBox = await removeBtn.boundingBox();
      const checkoutBox = await checkoutBtn.boundingBox();

      results.touchTargets.push({
        viewport: vp.name,
        element: "CaseDrawer: Close Button",
        box: caseCloseBox,
        pass: caseCloseBox && caseCloseBox.width >= 43.5 && caseCloseBox.height >= 43.5,
      });
      results.touchTargets.push({
        viewport: vp.name,
        element: "CaseDrawer: Stepper Minus (-)",
        box: minusBox,
        pass: minusBox && minusBox.width >= 43.5 && minusBox.height >= 43.5,
      });
      results.touchTargets.push({
        viewport: vp.name,
        element: "CaseDrawer: Stepper Plus (+)",
        box: plusBox,
        pass: plusBox && plusBox.width >= 43.5 && plusBox.height >= 43.5,
      });
      results.touchTargets.push({
        viewport: vp.name,
        element: "CaseDrawer: Remove Button",
        box: removeBox,
        pass: removeBox && removeBox.width >= 43.5 && removeBox.height >= 43.5,
      });
      results.touchTargets.push({
        viewport: vp.name,
        element: "CaseDrawer: Checkout Button",
        box: checkoutBox,
        pass: checkoutBox && checkoutBox.height >= 43.5,
      });

      // Test Gift note expansion & iOS font size
      const giftNoteBtn = page.locator('button:has-text("gift note")').first();
      const giftNoteBox = await giftNoteBtn.boundingBox();
      results.touchTargets.push({
        viewport: vp.name,
        element: "CaseDrawer: Gift Note Accordion",
        box: giftNoteBox,
        pass: giftNoteBox && giftNoteBox.height >= 43.5,
      });

      await giftNoteBtn.click();
      await page.waitForTimeout(200);
      const textarea = page.locator("#case-gift-note");
      const fontSize = await textarea.evaluate((el) => window.getComputedStyle(el).fontSize);
      const parsedFontSize = parseFloat(fontSize);
      results.iosZoom.push({
        viewport: vp.name,
        element: "CaseDrawer: Gift Note Textarea",
        fontSize,
        pass: parsedFontSize >= 16,
      });

      // Case Drawer Safe Area
      const casePaddingBottom = await caseDrawer.evaluate((el) => window.getComputedStyle(el).paddingBottom);
      results.safeAreas.push({
        viewport: vp.name,
        element: "CaseDrawer aside",
        paddingBottom: casePaddingBottom,
        pass: parseFloat(casePaddingBottom) >= 16,
      });

      // Close Case Drawer with Escape
      await page.keyboard.press("Escape");
      await page.waitForTimeout(400);

      // 5. Test Nav Drawer
      await page.locator('button[aria-label="Open navigation menu"]').click();
      await page.waitForTimeout(400); // allow drawer animation

      const navDrawer = page.locator('aside[aria-label="Navigation Menu"]');
      const navCloseBtn = page.locator('button[aria-label="Close navigation drawer"]');
      const navCloseBox = await navCloseBtn.boundingBox();
      results.touchTargets.push({
        viewport: vp.name,
        element: "NavDrawer: Close Button",
        box: navCloseBox,
        pass: navCloseBox && navCloseBox.width >= 43.5 && navCloseBox.height >= 43.5,
      });

      // Nav Links Touch Targets
      const houseLinks = page.locator('nav[aria-label="House Directory"] a');
      const houseLinkCount = await houseLinks.count();
      for (let i = 0; i < houseLinkCount; i++) {
        const link = houseLinks.nth(i);
        const linkBox = await link.boundingBox();
        const text = await link.innerText();
        results.touchTargets.push({
          viewport: vp.name,
          element: `NavDrawer House Link: ${text}`,
          box: linkBox,
          pass: linkBox && linkBox.height >= 43.5,
        });
      }

      // Seven Perfumes Links Touch Targets
      const perfumeLinks = page.locator('ul li a[href*="/collection/"]');
      const perfumeCount = await perfumeLinks.count();
      for (let i = 0; i < perfumeCount; i++) {
        const link = perfumeLinks.nth(i);
        const linkBox = await link.boundingBox();
        const text = await link.locator("span").first().innerText();
        results.touchTargets.push({
          viewport: vp.name,
          element: `NavDrawer Perfume: ${text}`,
          box: linkBox,
          pass: linkBox && linkBox.height >= 43.5,
        });
      }

      // Nav Drawer Safe Area & Lenis
      const navPaddingBottom = await navDrawer.evaluate((el) => window.getComputedStyle(el).paddingBottom);
      const dataLenisPrevent = await navDrawer.getAttribute("data-lenis-prevent");
      results.safeAreas.push({
        viewport: vp.name,
        element: "NavDrawer aside",
        paddingBottom: navPaddingBottom,
        pass: parseFloat(navPaddingBottom) >= 16,
      });
      results.lenisLock.push({
        viewport: vp.name,
        element: "NavDrawer data-lenis-prevent",
        value: dataLenisPrevent,
        pass: dataLenisPrevent !== null,
      });

      // Close Nav Drawer
      await navCloseBtn.click();
      await page.waitForTimeout(400);

      // 6. Test Site Footer Touch Targets & Vertical Stack
      const footer = page.locator("footer");
      const footerLinks = footer.locator("a");
      const footerLinkCount = await footerLinks.count();
      for (let i = 0; i < footerLinkCount; i++) {
        const link = footerLinks.nth(i);
        const text = (await link.innerText()).replace(/\n/g, " ").trim();
        const box = await link.boundingBox();
        results.touchTargets.push({
          viewport: vp.name,
          element: `Footer Link: ${text.slice(0, 25)}`,
          box,
          pass: box && box.height >= 43.5,
        });
      }

      // Footer Safe Area
      const footerPaddingBottom = await footer.evaluate((el) => window.getComputedStyle(el).paddingBottom);
      results.safeAreas.push({
        viewport: vp.name,
        element: "SiteFooter",
        paddingBottom: footerPaddingBottom,
        pass: parseFloat(footerPaddingBottom) >= 32,
      });

      // 7. Test Legal Pages Padding Rhythm & Header Clearance
      for (const legalRoute of LEGAL_ROUTES) {
        await page.goto(`${BASE_URL}${legalRoute}`, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(300);

        const legalInfo = await page.evaluate(() => {
          const doc = document.documentElement;
          const body = document.body;
          const main = document.querySelector("main");
          const header = document.querySelector("header");
          const backLink = document.querySelector('a[href="/legal"]');

          const headerRect = header ? header.getBoundingClientRect() : null;
          const mainRect = main ? main.getBoundingClientRect() : null;
          const backLinkRect = backLink ? backLink.getBoundingClientRect() : null;

          const computedMainPaddingTop = main ? window.getComputedStyle(main).paddingTop : null;

          return {
            hasOverflow: doc.scrollWidth > doc.clientWidth + 1,
            clientWidth: doc.clientWidth,
            scrollWidth: doc.scrollWidth,
            headerBottom: headerRect ? headerRect.bottom : 0,
            mainTop: mainRect ? mainRect.top : 0,
            mainPaddingTop: computedMainPaddingTop,
            backLinkTop: backLinkRect ? backLinkRect.top : null,
            backLinkHeight: backLinkRect ? backLinkRect.height : null,
          };
        });

        results.overflow.push({
          viewport: vp.name,
          route: legalRoute,
          hasOverflow: legalInfo.hasOverflow,
          clientWidth: legalInfo.clientWidth,
          scrollWidth: legalInfo.scrollWidth,
        });

        const headerClearance = legalInfo.mainTop >= 0 && (legalInfo.backLinkTop === null || legalInfo.backLinkTop > legalInfo.headerBottom);
        results.legalPadding.push({
          viewport: vp.name,
          route: legalRoute,
          mainPaddingTop: legalInfo.mainPaddingTop,
          headerBottom: legalInfo.headerBottom,
          backLinkTop: legalInfo.backLinkTop,
          headerClearance,
          pass: headerClearance && !legalInfo.hasOverflow,
        });
      }

      await context.close();
    }
  } catch (err) {
    console.error("Test execution failed with error:", err);
  } finally {
    await browser.close();
  }

  console.log("\n================ TEST SUMMARY ================");
  console.log("Overflow checks:", results.overflow.every((o) => !o.hasOverflow) ? "ALL PASSED" : "FAILED");
  const failedOverflows = results.overflow.filter((o) => o.hasOverflow);
  if (failedOverflows.length > 0) {
    console.log("Failed Overflows:", JSON.stringify(failedOverflows, null, 2));
  }

  console.log("Crest Collision checks:", results.crestCollision.every((c) => !c.collision) ? "ALL PASSED" : "FAILED");
  console.log("Crest Gaps across viewports:");
  for (const c of results.crestCollision) {
    console.log(`  - ${c.viewport}: Left Gap=${c.leftGap !== undefined ? c.leftGap + 'px' : 'N/A'}, Right Gap=${c.rightGap}px | Collision=${c.collision}`);
  }

  console.log("Touch Target checks:", results.touchTargets.every((t) => t.pass) ? "ALL PASSED" : "FAILED");
  const failedTargets = results.touchTargets.filter((t) => !t.pass);
  if (failedTargets.length > 0) {
    console.log("Failed Touch Targets:", JSON.stringify(failedTargets, null, 2));
  }

  console.log("iOS Zoom checks:", results.iosZoom.every((z) => z.pass) ? "ALL PASSED" : "FAILED");
  for (const z of results.iosZoom) {
    console.log(`  - ${z.viewport}: ${z.element} font-size=${z.fontSize} | Pass=${z.pass}`);
  }

  console.log("Safe Area checks:", results.safeAreas.every((s) => s.pass) ? "ALL PASSED" : "FAILED");
  for (const s of results.safeAreas) {
    console.log(`  - ${s.viewport}: ${s.element} pb=${s.paddingBottom} | Pass=${s.pass}`);
  }

  console.log("Lenis Lock checks:", results.lenisLock.every((l) => l.pass) ? "ALL PASSED" : "FAILED");

  console.log("Legal Padding Rhythm checks:", results.legalPadding.every((lp) => lp.pass) ? "ALL PASSED" : "FAILED");
  const failedLegal = results.legalPadding.filter((lp) => !lp.pass);
  if (failedLegal.length > 0) {
    console.log("Failed Legal Paddings:", JSON.stringify(failedLegal, null, 2));
  }
}

run();

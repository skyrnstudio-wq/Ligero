import { chromium } from "playwright";

const VIEWPORTS = [320, 360, 375, 390, 414];
const CART_SCENARIOS = [
  { name: "Empty Case (0 items)", items: [] },
  { name: "Populated Case (1 item)", items: [{ slug: "noctis", name: "Noctis", price: "₹18,500", volume: "50ml", quantity: 1, image: "/images/perfumes/cutouts/noctis.webp" }] },
  { name: "Populated Case (99 items)", items: [{ slug: "noctis", name: "Noctis", price: "₹18,500", volume: "50ml", quantity: 99, image: "/images/perfumes/cutouts/noctis.webp" }] },
];

async function runHeaderCollisionMatrix() {
  const browser = await chromium.launch({ headless: true });
  console.log("=== HEADER COLLISION MATRIX ACROSS VIEWPORTS AND CART STATES ===");

  for (const scenario of CART_SCENARIOS) {
    console.log(`\n--- Scenario: ${scenario.name} ---`);
    for (const width of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width, height: 750 },
        isMobile: true,
        hasTouch: true,
      });

      if (scenario.items.length > 0) {
        await context.addInitScript((items) => {
          localStorage.setItem("ligero_case", JSON.stringify(items));
        }, scenario.items);
      }

      const page = await context.newPage();
      await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
      await page.waitForSelector("#site-header-logo-target", { timeout: 10000 });
      await page.waitForTimeout(500);

      const collisionData = await page.evaluate(() => {
        const menuBtn = document.querySelector('button[aria-label="Open navigation menu"]');
        const logoTarget = document.querySelector("#site-header-logo-target");
        const searchBtn = document.querySelector('button[aria-label="Search fragrances and objects"]');
        const caseBtn = document.querySelector('button[aria-label^="Open Case"]');

        const mBox = menuBtn?.getBoundingClientRect();
        const lBox = logoTarget?.getBoundingClientRect();
        const sBox = searchBtn?.getBoundingClientRect();
        const cBox = caseBtn?.getBoundingClientRect();

        const menuRight = mBox ? mBox.right : 0;
        const logoLeft = lBox ? lBox.left : 0;
        const logoRight = lBox ? lBox.right : 0;
        const searchLeft = sBox ? sBox.left : 0;

        const leftGap = logoLeft - menuRight;
        const rightGap = searchLeft - logoRight;

        return {
          windowWidth: window.innerWidth,
          menu: mBox ? { x: mBox.x, y: mBox.y, w: mBox.width, h: mBox.height, right: mBox.right } : null,
          logo: lBox ? { x: lBox.x, y: lBox.y, w: lBox.width, h: lBox.height, left: lBox.left, right: lBox.right } : null,
          search: sBox ? { x: sBox.x, y: sBox.y, w: sBox.width, h: sBox.height, left: sBox.left } : null,
          case: cBox ? { x: cBox.x, y: cBox.y, w: cBox.width, h: cBox.height } : null,
          leftGap,
          rightGap,
          hasLeftCollision: leftGap < 0,
          hasRightCollision: rightGap < 0,
        };
      });

      console.log(`Viewport ${width}px:`);
      console.log(`  Menu: [${collisionData.menu?.x} → ${collisionData.menu?.right}], w=${collisionData.menu?.w}`);
      console.log(`  Logo: [${collisionData.logo?.left} → ${collisionData.logo?.right}], w=${collisionData.logo?.w}`);
      console.log(`  Search: [${collisionData.search?.left} → ${collisionData.search?.x + collisionData.search?.w}], w=${collisionData.search?.w}`);
      console.log(`  Case: [${collisionData.case?.x} → ${collisionData.case?.x + collisionData.case?.w}], w=${collisionData.case?.w}`);
      console.log(`  --> Left clearance (Menu -> Logo): ${collisionData.leftGap.toFixed(2)}px`);
      console.log(`  --> Right clearance (Logo -> Search): ${collisionData.rightGap.toFixed(2)}px`);
      if (collisionData.hasRightCollision) {
        console.log(`  🚨 COLLISION DETECTED! Search overlaps Logo by ${Math.abs(collisionData.rightGap).toFixed(2)}px!`);
      } else if (collisionData.rightGap < 5) {
        console.log(`  ⚠️ EXTREME RAZOR-THIN MARGIN: only ${collisionData.rightGap.toFixed(2)}px`);
      } else {
        console.log(`  ✅ SAFE (${collisionData.rightGap.toFixed(2)}px clearance)`);
      }

      await context.close();
    }
  }

  await browser.close();
}

runHeaderCollisionMatrix().catch(console.error);

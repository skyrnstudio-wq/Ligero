import { chromium } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const VIEWPORTS = [
  { name: "320px (iPhone SE 1st gen)", width: 320, height: 568 },
  { name: "360px (Galaxy S8/A-series)", width: 360, height: 640 },
  { name: "375px (iPhone SE 2nd/3rd)", width: 375, height: 667 },
  { name: "390px (iPhone 12/13/14)", width: 390, height: 844 },
];

const SCENARIOS = [
  { name: "Empty Case (0 items)", items: [] },
  { name: "Single Digit Badge (1 item)", items: [{ slug: "noctis", name: "Noctis", price: 18500, volume: "50ml", image: "/images/perfumes/cutouts/noctis.webp", quantity: 1 }] },
  { name: "Double Digit Badge (12 items)", items: [{ slug: "noctis", name: "Noctis", price: 18500, volume: "50ml", image: "/images/perfumes/cutouts/noctis.webp", quantity: 12 }] },
];

async function run() {
  console.log("=== EMPIRICAL MAISON CREST COLLISION STRESS TEST ===");
  const browser = await chromium.launch({ headless: true });

  for (const scenario of SCENARIOS) {
    console.log(`\n================ SCENARIO: ${scenario.name} ================`);
    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        hasTouch: true,
        isMobile: true,
      });

      if (scenario.items.length > 0) {
        await context.addInitScript((items) => {
          localStorage.setItem("ligero_case", JSON.stringify(items));
        }, scenario.items);
      }

      const page = await context.newPage();
      await page.goto(`${BASE_URL}/`, { waitUntil: "commit" });
      await page.waitForSelector("#site-header-logo-target");
      await page.waitForTimeout(300);

      const data = await page.evaluate(() => {
        const menu = document.querySelector('button[aria-label="Open navigation menu"]');
        const crest = document.querySelector("#site-header-logo-target");
        const crestLink = crest ? crest.closest("a") : null;
        const search = document.querySelector('button[aria-label="Search fragrances and objects"]');
        const caseBtn = document.querySelector('button[aria-label^="Open Case"]');
        const rightContainer = search ? search.parentElement : null;

        const getBox = (el) => {
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return {
            x: Math.round(r.x * 10) / 10,
            y: Math.round(r.y * 10) / 10,
            width: Math.round(r.width * 10) / 10,
            height: Math.round(r.height * 10) / 10,
            right: Math.round(r.right * 10) / 10,
          };
        };

        const menuBox = getBox(menu);
        const crestBox = getBox(crest);
        const crestLinkBox = getBox(crestLink);
        const searchBox = getBox(search);
        const caseBox = getBox(caseBtn);
        const rightContainerBox = getBox(rightContainer);

        const leftGap = crestBox && menuBox ? crestBox.x - menuBox.right : null;
        const rightGap = searchBox && crestBox ? searchBox.x - crestBox.right : null;

        // Also check if crestLink clickable area overlaps search or menu
        const linkLeftGap = crestLinkBox && menuBox ? crestLinkBox.x - menuBox.right : null;
        const linkRightGap = searchBox && crestLinkBox ? searchBox.x - crestLinkBox.right : null;

        return {
          windowWidth: window.innerWidth,
          menuBox,
          crestBox,
          crestLinkBox,
          searchBox,
          caseBox,
          rightContainerBox,
          leftGap: Math.round(leftGap * 10) / 10,
          rightGap: Math.round(rightGap * 10) / 10,
          linkLeftGap: Math.round(linkLeftGap * 10) / 10,
          linkRightGap: Math.round(linkRightGap * 10) / 10,
          collidesText: (leftGap < 0 || rightGap < 0),
          collidesLink: (linkLeftGap < 0 || linkRightGap < 0),
        };
      });

      console.log(`Viewport: ${vp.name}`);
      console.log(`  Menu: [${data.menuBox.x} → ${data.menuBox.right}], w=${data.menuBox.width}px`);
      console.log(`  Crest: [${data.crestBox.x} → ${data.crestBox.right}], w=${data.crestBox.width}px (center=${Math.round((data.crestBox.x + data.crestBox.width/2)*10)/10})`);
      console.log(`  Search: [${data.searchBox.x} → ${data.searchBox.right}], w=${data.searchBox.width}px`);
      console.log(`  Case: [${data.caseBox.x} → ${data.caseBox.right}], w=${data.caseBox.width}px`);
      console.log(`  --> Left Gap (Menu to Crest): ${data.leftGap}px`);
      console.log(`  --> Right Gap (Crest to Search): ${data.rightGap}px`);
      console.log(`  --> Collision Status: ${data.collidesText ? "💥 COLLISION DETECTED!" : "✅ SAFE"}`);
      if (data.collidesText || data.rightGap < 10) {
        console.log(`  ⚠️ CRITICAL MARGIN WARNING: Right gap is only ${data.rightGap}px!`);
      }

      await context.close();
    }
  }

  await browser.close();
}

run();

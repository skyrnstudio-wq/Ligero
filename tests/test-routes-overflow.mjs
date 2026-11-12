import { chromium } from "playwright";

const ROUTES = [
  "/",
  "/collection",
  "/collection/aube",
  "/collection/fleur",
  "/collection/ambre-doux",
  "/collection/noctis",
  "/collection/blanc",
  "/collection/maree",
  "/collection/noir-cacao",
  "/discovery-set",
  "/objects",
  "/objects/en-route",
  "/help",
  "/checkout",
  "/legal",
  "/legal/privacy",
  "/legal/terms",
  "/legal/shipping-returns",
  "/legal/grievance",
  "/legal/compliance-checklist",
];

async function checkAllRoutesOverflow() {
  const browser = await chromium.launch({ headless: true });
  const viewports = [320, 360, 375];
  const overflowIssues = [];

  for (const width of viewports) {
    const page = await browser.newPage({
      viewport: { width, height: 750 },
      isMobile: true,
      hasTouch: true,
    });

    for (const route of ROUTES) {
      try {
        await page.goto(`http://localhost:3000${route}`, { waitUntil: "domcontentloaded" });
        const overflow = await page.evaluate(() => {
          const clientWidth = document.documentElement.clientWidth;
          const scrollWidth = document.documentElement.scrollWidth;
          return {
            clientWidth,
            scrollWidth,
            diff: scrollWidth - clientWidth,
          };
        });

        if (overflow.diff > 1) {
          overflowIssues.push({ width, route, ...overflow });
        }
      } catch (err) {
        overflowIssues.push({ width, route, error: err.message });
      }
    }
    await page.close();
  }

  await browser.close();

  console.log("=== ROUTE OVERFLOW AUDIT RESULTS ===");
  if (overflowIssues.length === 0) {
    console.log("ALL ROUTES PASSED: 0 horizontal overflows detected across 320px, 360px, 375px!");
  } else {
    console.error(`Detected ${overflowIssues.length} overflow issues:`, overflowIssues);
  }
}

checkAllRoutesOverflow().catch(console.error);

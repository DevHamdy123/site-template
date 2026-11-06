// Usage: npm run build && npm start   (in another terminal)  then:  npm run check:screens
// Optional: node scripts/check-screens.mjs http://localhost:3000
// First time only: npx playwright install chromium
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const base = process.argv[2] ?? "http://localhost:3000";
const widths = [320, 360, 390, 430, 768, 1024, 1280, 1920];

mkdirSync("screenshots", { recursive: true });
const browser = await chromium.launch();
let failed = false;

for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto(base, { waitUntil: "networkidle" });

  // scroll through the page so scroll-triggered animations play before the screenshot
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += 600) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(150);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);

  const report = await page.evaluate(() => {
    const cw = document.documentElement.clientWidth;
    const sw = document.documentElement.scrollWidth;
    const offenders = [];
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && (r.right > cw + 1 || r.left < -1)) {
        offenders.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)}`);
      }
    }
    return { cw, sw, offenders: offenders.slice(0, 5) };
  });

  const bad = report.sw > report.cw || report.offenders.length > 0;
  if (bad) failed = true;
  console.log(
    `${bad ? "FAIL" : "ok  "} ${String(width).padStart(4)}px  scrollWidth=${report.sw} clientWidth=${report.cw}` +
      (report.offenders.length ? `  offenders: ${report.offenders.join(" | ")}` : ""),
  );

  await page.screenshot({ path: `screenshots/w${width}.png`, fullPage: true });
  await page.close();
}

await browser.close();
console.log(failed ? "\nSome widths overflow. See offenders above." : "\nNo horizontal overflow at any width. Screenshots saved in ./screenshots");
process.exit(failed ? 1 : 0);

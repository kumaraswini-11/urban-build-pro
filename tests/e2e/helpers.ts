import type { Page } from "@playwright/test";

/**
 * Scrolls through the whole page so scroll-triggered animations run, then
 * returns to the top once everything has settled.
 */
export async function settlePage(page: Page) {
  await page.goto("/", { waitUntil: "networkidle" });
  const height = await page.evaluate(() => document.body.scrollHeight);
  const step = Math.floor((page.viewportSize()?.height ?? 800) / 2);
  for (let y = 0; y < height; y += step) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(100);
  }
  // Count-up animations run for ~2.5s.
  await page.waitForTimeout(3000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
}

export async function hasHorizontalOverflow(page: Page) {
  return page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
}

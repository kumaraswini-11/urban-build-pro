import { expect, test } from "@playwright/test";

import { hasHorizontalOverflow } from "./helpers";

test("page does not scroll horizontally", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  expect(await hasHorizontalOverflow(page)).toBe(false);
});

test("page does not scroll horizontally at 320px (WCAG 1.4.10)", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/", { waitUntil: "networkidle" });

  expect(await hasHorizontalOverflow(page)).toBe(false);
});

test("section headings are larger than body text", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const sizes = await page.evaluate(() => {
    const px = (el: Element) => parseFloat(getComputedStyle(el).fontSize);
    return {
      body: px(document.body),
      h2: [...document.querySelectorAll("main h2.h2")].map(px),
    };
  });

  for (const size of sizes.h2) {
    expect(size).toBeGreaterThanOrEqual(sizes.body * 1.5);
  }
});

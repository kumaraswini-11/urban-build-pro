import { expect, test } from "@playwright/test";

import { hasHorizontalOverflow } from "./helpers";

test("page does not scroll horizontally", async ({ page, viewport }) => {
  test.fail(
    (viewport?.width ?? 0) < 768,
    "U6: FAQ questions cannot wrap (whitespace-nowrap)",
  );
  await page.goto("/", { waitUntil: "networkidle" });

  expect(await hasHorizontalOverflow(page)).toBe(false);
});

test("page does not scroll horizontally at 320px (WCAG 1.4.10)", async ({
  page,
}) => {
  test.fail(true, "U6: FAQ questions cannot wrap (whitespace-nowrap)");
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/", { waitUntil: "networkidle" });

  expect(await hasHorizontalOverflow(page)).toBe(false);
});

test("section headings are larger than body text", async ({ page }) => {
  test.fail(true, "U5: .h2/.h3/.h4 utilities are never defined");
  await page.goto("/", { waitUntil: "networkidle" });

  const sizes = await page.evaluate(() => {
    const px = (el: Element) => parseFloat(getComputedStyle(el).fontSize);
    return {
      body: px(document.body),
      h2: [...document.querySelectorAll("main h2")].map(px),
    };
  });

  for (const size of sizes.h2) {
    expect(size).toBeGreaterThanOrEqual(sizes.body * 1.5);
  }
});

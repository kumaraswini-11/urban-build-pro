import { expect, test } from "@playwright/test";

import { settlePage } from "./helpers";

// Screenshot baselines are platform-specific, so they run locally
// (`bun run test:visual`) rather than in CI. Intentional visual changes are
// re-baselined with `bun run test:visual:update` in the same change.
test("home page @visual", async ({ page }) => {
  test.slow(); // full scroll-through + animation settle
  await settlePage(page);
  // Freeze the autoplaying testimonial carousel on its first slide.
  await page.evaluate(() => {
    const el = document.querySelector(".swiper") as
      | (Element & {
          swiper?: { autoplay?: { stop(): void }; slideTo(i: number): void };
        })
      | null;
    el?.swiper?.autoplay?.stop();
    el?.swiper?.slideTo(0);
  });
  await page.waitForTimeout(500);

  await expect(page).toHaveScreenshot("home.png", {
    fullPage: true,
    timeout: 20_000,
  });
});

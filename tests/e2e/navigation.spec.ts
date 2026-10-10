import { expect, test } from "@playwright/test";

// Known defects from docs/CURRENT_STATE_AUDIT.md are marked with test.fail().
// When a fix lands, the test starts passing, Playwright reports it, and the
// marker must be removed in the same change.

test.describe("desktop navigation", () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) < 1280, "desktop nav");

  test("every nav link scrolls its section into view", async ({ page }) => {
    test.fail(true, "U2: Portfolio targets a missing #projects section");
    await page.goto("/", { waitUntil: "networkidle" });
    const nav = page.getByRole("navigation", { name: "Desktop navigation" });

    for (const label of ["About Us", "Services", "Portfolio", "Contact"]) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await nav.getByText(label, { exact: true }).click();
      await page.waitForTimeout(1200);
      expect(await page.evaluate(() => window.scrollY), label).toBeGreaterThan(
        0,
      );
    }
  });

  test("nav links are reachable with the keyboard", async ({ page }) => {
    test.fail(true, "U1: react-scroll links render without href");
    await page.goto("/", { waitUntil: "networkidle" });

    const focused = new Set<string>();
    for (let i = 0; i < 25; i++) {
      await page.keyboard.press("Tab");
      focused.add(
        await page.evaluate(() => document.activeElement?.textContent ?? ""),
      );
    }

    for (const label of ["Home", "About Us", "Services", "Portfolio"]) {
      expect([...focused], label).toContain(label);
    }
  });

  test("header 'Get a quote' takes the visitor to the contact form", async ({
    page,
  }) => {
    test.fail(true, "U4: CTA has no action");
    await page.goto("/", { waitUntil: "networkidle" });

    await page
      .locator("header")
      .first()
      .getByText(/get a quote/i)
      .click();

    await expect(page.locator("#contact")).toBeInViewport();
  });
});

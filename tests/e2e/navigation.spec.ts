import { expect, test } from "@playwright/test";

// Known defects from docs/CURRENT_STATE_AUDIT.md are marked with test.fail().
// When a fix lands, the test starts passing, Playwright reports it, and the
// marker must be removed in the same change.

test.describe("desktop navigation", () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) < 1280, "desktop nav");

  test("every nav link scrolls its section into view", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const nav = page.getByRole("navigation", { name: "Main navigation" });

    for (const label of ["About Us", "Services", "Portfolio", "Contact"]) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await nav.getByText(label, { exact: true }).click();
      await page.waitForTimeout(1200);
      expect(await page.evaluate(() => window.scrollY), label).toBeGreaterThan(
        0,
      );
    }
  });

  test("the active nav link stays readable on the dark header (U3)", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const nav = page.getByRole("navigation", { name: "Main navigation" });
    await nav.getByText("About Us", { exact: true }).click();
    await page.waitForTimeout(1500);
    // Keep the pointer off the nav so hover styles can't mask a regression.
    await page.mouse.move(0, 0);
    await page.waitForTimeout(500); // let transition-colors finish

    const { primary, links } = await page.evaluate(() => {
      const probe = document.createElement("span");
      probe.className = "text-primary";
      document.body.append(probe);
      const primary = getComputedStyle(probe).color;
      probe.remove();
      // One sticky header; the active link is marked with aria-current.
      const links = [
        ...document.querySelectorAll(
          'nav[aria-label="Main navigation"] [aria-current="true"]',
        ),
      ].map((link) => ({
        text: link.textContent,
        color: getComputedStyle(link).color,
        underlineScale: getComputedStyle(link, "::after").scale,
        headerBackground: getComputedStyle(link.closest("header") as Element)
          .backgroundColor,
      }));
      return { primary, links };
    });

    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      expect(link.text).toBe("About Us");
      expect(link.color).toBe(primary);
      expect(link.color).not.toBe(link.headerBackground);
      // Tailwind v4 scale-x uses the CSS `scale` property: "0 1" when hidden.
      expect(link.underlineScale).not.toMatch(/^0[ %]/);
    }
  });

  test("nav links are reachable with the keyboard", async ({ page }) => {
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
    await page.goto("/", { waitUntil: "networkidle" });

    await page
      .locator("header")
      .first()
      .getByText(/get a quote/i)
      .click();

    await expect(page.locator("#contact")).toBeInViewport();
  });
});

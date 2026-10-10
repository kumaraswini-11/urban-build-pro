import { expect, test } from "@playwright/test";

test("the theme button toggles between light and dark (D-003)", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const html = page.locator("html");
  await expect(html).not.toHaveClass(/dark/);

  await page
    .getByRole("banner")
    .getByRole("button", { name: "Switch to dark theme" })
    .first()
    .click();
  await expect(html).toHaveClass(/dark/);

  await page
    .getByRole("banner")
    .getByRole("button", { name: "Switch to light theme" })
    .first()
    .click();
  await expect(html).not.toHaveClass(/dark/);
});

test("focus rings stay visible on the dark header in both themes (A3)", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const colors = await page.evaluate(() => {
    const read = (el: Element) =>
      getComputedStyle(el).getPropertyValue("--ring");
    const header = document.querySelector("header") as Element;
    const probe = document.createElement("span");
    probe.className = "text-primary";
    document.body.append(probe);
    const primary = getComputedStyle(probe).getPropertyValue("--primary");
    probe.remove();
    return { headerRing: read(header).trim(), primary: primary.trim() };
  });
  // On always-dark surfaces the ring is brand yellow, not the dark page ring.
  expect(colors.headerRing).toBe(colors.primary);
});

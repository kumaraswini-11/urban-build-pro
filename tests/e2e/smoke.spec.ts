import { expect, test } from "@playwright/test";

test("home page renders without console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));

  await page.goto("/", { waitUntil: "networkidle" });

  await expect(page).toHaveTitle(/Urban/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(errors).toEqual([]);
});

test("unknown routes render the 404 page", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
});

test("sitemap only lists routes that exist", async ({ page, request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
    (match) => new URL(match[1]).pathname,
  );

  for (const pathname of locations) {
    const response = await page.goto(pathname);
    expect(response?.status(), pathname).toBe(200);
  }
});

test("responses carry security headers and hide the framework", async ({
  request,
}) => {
  const response = await request.get("/");
  const headers = response.headers();

  expect(headers["x-powered-by"]).toBeUndefined();
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["strict-transport-security"]).toContain("max-age=");
  expect(headers["content-security-policy"]).toContain(
    "frame-ancestors 'none'",
  );
});

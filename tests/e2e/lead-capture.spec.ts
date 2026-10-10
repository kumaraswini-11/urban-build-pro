import { expect, type Page, test } from "@playwright/test";

// The e2e server runs with LEAD_DELIVERY=console (see playwright.config.ts),
// so a valid submission is logged by the server instead of emailed.

const fillRequiredFields = async (page: Page) => {
  const form = page.locator("#contact form");
  await form.getByLabel("Full name").fill("Jane Doe");
  await form.getByLabel("Email address").fill("jane@example.com");
  await form
    .getByLabel("Tell us about your project")
    .fill("We need a 3-storey office fit-out next spring.");
  return form;
};

test("every quote form field has a visible label (A1, A4)", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const form = page.locator("#contact form");

  for (const label of [
    "Full name",
    "Email address",
    "Phone number",
    "Project type",
    "Tell us about your project",
  ]) {
    await expect(form.getByLabel(label)).toBeVisible();
  }
});

test("a valid quote request is confirmed and the form resets (S3)", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const form = await fillRequiredFields(page);

  await form.getByLabel("Project type").click();
  await page.getByRole("option", { name: "Commercial Development" }).click();
  await form.getByRole("button", { name: /send message/i }).click();

  const status = page.locator("#contact").getByRole("status");
  await expect(status).toContainText("your request has been received");
  await expect(status).toBeFocused();
  await expect(form.getByLabel("Full name")).toHaveValue("");
});

test("server-side errors focus the field and keep the other values (U7)", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const form = await fillRequiredFields(page);

  // Browsers accept any text in type="tel"; only the server rejects this.
  await form.getByLabel("Phone number").fill("abc");
  await form.getByLabel("Project type").click();
  await page.getByRole("option", { name: "Renovation & Retrofit" }).click();
  await form.getByRole("button", { name: /send message/i }).click();

  const phone = form.getByLabel("Phone number");
  await expect(phone).toBeFocused();
  await expect(phone).toHaveAttribute("aria-invalid", "true");
  await expect(phone).toHaveAccessibleDescription(
    "Please enter a valid phone number.",
  );
  await expect(form.getByLabel("Full name")).toHaveValue("Jane Doe");
  await expect(form.getByLabel("Project type")).toContainText(
    "Renovation & Retrofit",
  );
  // The value that will actually be submitted, not just the visible text.
  await expect(form.locator('select[name="service"]')).toHaveValue(
    "renovation",
  );
  await expect(page.locator("#contact").getByRole("status")).toContainText(
    "Please check the highlighted fields.",
  );
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the quote form still submits (progressive enhancement)", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "load" });
    const form = await fillRequiredFields(page);

    // Keyboard submit: a real user path that does not depend on layout
    // stability (CSS smooth scrolling keeps the button moving without JS).
    await form.getByRole("button", { name: /send message/i }).focus();
    await page.keyboard.press("Enter");

    await expect(page.locator("#contact").getByRole("status")).toContainText(
      "your request has been received",
    );
  });
});

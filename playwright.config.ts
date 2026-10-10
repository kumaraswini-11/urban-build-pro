import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
  },
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: "disabled" },
  },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "tablet",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      // Plain narrow viewport (no isMobile emulation): emulation widens the
      // layout viewport and hides horizontal overflow.
      name: "mobile",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 390, height: 844 },
        hasTouch: true,
      },
    },
  ],
  webServer: {
    // CI builds in a separate step; locally build + start in one go.
    command: isCI
      ? `bun run start --port ${PORT}`
      : `bun run build && bun run start --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !isCI,
    timeout: 240_000,
  },
});

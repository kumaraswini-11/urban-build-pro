import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import baseline from "./a11y-baseline.json";
import { settlePage } from "./helpers";

const WCAG_TAGS = [
  "wcag2a",
  "wcag2aa",
  "wcag21a",
  "wcag21aa",
  "wcag22aa",
  "best-practice",
];

// The baseline records violations known at the start of the modernization.
// CI fails on any new rule or a higher count. Shrink the baseline as fixes
// land; the goal is an empty object.
for (const theme of ["light", "dark"] as const) {
  test(`no accessibility violations beyond the recorded baseline (${theme} theme)`, async ({
    page,
  }) => {
    await page.addInitScript((value) => {
      localStorage.setItem("theme", value);
    }, theme);
    test.slow(); // full scroll-through + animation settle
    await settlePage(page);

    const { violations } = await new AxeBuilder({ page })
      .withTags(WCAG_TAGS)
      .analyze();

    const allowed: Record<string, number> = baseline;
    const regressions = violations
      .filter((v) => v.nodes.length > (allowed[v.id] ?? 0))
      .map((v) => ({
        rule: v.id,
        count: v.nodes.length,
        allowed: allowed[v.id] ?? 0,
        targets: v.nodes.slice(0, 5).map((n) => n.target.join(" ")),
      }));

    expect(regressions).toEqual([]);
  });
}

import { describe, expect, it } from "vitest";

import { resolveSiteUrl } from "@/lib/env";

describe("resolveSiteUrl", () => {
  it("uses NEXT_PUBLIC_SITE_URL without a trailing slash", () => {
    expect(resolveSiteUrl("https://urbanbuild.com/")).toBe(
      "https://urbanbuild.com",
    );
  });

  it("falls back to localhost when unset or empty (fresh clone, CI)", () => {
    expect(resolveSiteUrl(undefined)).toBe("http://localhost:3000");
    expect(resolveSiteUrl("")).toBe("http://localhost:3000");
  });

  it("rejects a malformed URL", () => {
    expect(() => resolveSiteUrl("not a url")).toThrow(/NEXT_PUBLIC_SITE_URL/);
  });

  it("refuses to build Vercel production with a localhost URL", () => {
    expect(() => resolveSiteUrl(undefined, "production")).toThrow(/production/);
    expect(() => resolveSiteUrl("http://localhost:3000", "production")).toThrow(
      /production/,
    );
  });

  it("allows localhost on Vercel preview deployments", () => {
    expect(resolveSiteUrl(undefined, "preview")).toBe("http://localhost:3000");
  });
});

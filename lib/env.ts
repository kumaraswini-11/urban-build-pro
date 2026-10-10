const LOCAL_SITE_URL = "http://localhost:3000";

/**
 * Canonical site origin for metadata, robots and the sitemap, from
 * NEXT_PUBLIC_SITE_URL. Falls back to localhost so a fresh clone builds;
 * Vercel production builds (VERCEL_ENV is set by Vercel) fail instead of
 * publishing localhost URLs.
 */
export function resolveSiteUrl(
  value: string | undefined,
  vercelEnv?: string,
): string {
  const siteUrl = (value?.trim() || LOCAL_SITE_URL).replace(/\/+$/, "");

  if (!URL.canParse(siteUrl)) {
    throw new Error(`NEXT_PUBLIC_SITE_URL is not a valid URL: "${siteUrl}"`);
  }
  if (vercelEnv === "production" && new URL(siteUrl).hostname === "localhost") {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must be set to the real domain for Vercel production builds.",
    );
  }

  return siteUrl;
}

export const siteUrl = resolveSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL,
  process.env.VERCEL_ENV,
);

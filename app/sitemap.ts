import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/env";

// Single-page site: sections are anchors on "/", not separate routes.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}

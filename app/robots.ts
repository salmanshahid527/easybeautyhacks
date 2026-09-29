import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Internal search result pages are thin/duplicate content; keep them out of the index.
      disallow: ["/api/revalidate-all", "/search$", "/search?", "/search/"],
    },
    host: new URL(SITE_URL).host,
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

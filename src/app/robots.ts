/**
 * robots.txt — index marketing pages; keep private areas (dashboard, API,
 * previews, personal ask cards) out of search engines. Event pages also send
 * a noindex meta tag because they contain personal details.
 */

import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/dashboard", "/api/", "/preview", "/q/", "/auth/", "/login", "/signup"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}

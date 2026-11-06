/**
 * sitemap.xml — marketing pages, occasion landing pages, pricing and every
 * template demo. Event pages and ask cards are private and excluded.
 */

import type { MetadataRoute } from "next";
import { OCCASIONS } from "@/lib/occasions";
import { absoluteUrl } from "@/lib/seo";
import { GUIDES } from "@/lib/guides";
import { PLANS_ENABLED } from "@/lib/plans";
import { createPublicClient } from "@/lib/supabase/public";

export const revalidate = 86400;

/** Last time the marketing copy and guides were reviewed. */
const CONTENT_UPDATED = new Date("2026-11-04");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: CONTENT_UPDATED, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/templates"), lastModified: CONTENT_UPDATED, changeFrequency: "weekly", priority: 0.9 },
    ...(PLANS_ENABLED ? [{ url: absoluteUrl("/pricing"), lastModified: CONTENT_UPDATED, changeFrequency: "monthly" as const, priority: 0.7 }] : []),
    { url: absoluteUrl("/cards"), lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/how-it-works"), lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/contact"), lastModified: CONTENT_UPDATED, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/privacy"), lastModified: CONTENT_UPDATED, changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/terms"), lastModified: CONTENT_UPDATED, changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/help"), lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.7 },
    ...GUIDES.map((guide) => ({
      url: absoluteUrl(`/help/${guide.slug}`),
      lastModified: CONTENT_UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...OCCASIONS.map((o) => ({
      url: absoluteUrl(`/invitations/${o.slug}`),
      lastModified: CONTENT_UPDATED,
      changeFrequency: "monthly" as const,
      priority: o.slug === "wedding" ? 0.95 : 0.6,
    })),
  ];

  let templatePages: MetadataRoute.Sitemap = [];
  try {
    const supabase = createPublicClient();
    const { data } = supabase ? await supabase.from("templates").select("slug, created_at") : { data: null };
    templatePages = (data ?? []).map((t: { slug: string; created_at: string }) => ({
      url: absoluteUrl(`/templates/${t.slug}`),
      lastModified: new Date(t.created_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    console.warn("[WARNING] sitemap: templates unavailable");
  }

  return [...staticPages, ...templatePages];
}

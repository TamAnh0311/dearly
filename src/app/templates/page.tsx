/**
 * Templates gallery — the template list is fetched on the server so search
 * engines see real names and links in the initial HTML. Filtering and search
 * stay client-side for instant interaction.
 */

import { createPublicClient } from "@/lib/supabase/public";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";
import type { TemplateRow } from "@/types/database";
import TemplatesGallery from "./TemplatesGallery";

export const revalidate = 3600;

export default async function TemplatesPage() {
  const supabase = createPublicClient();
  const { data } = supabase
    ? await supabase.from("templates").select("*").neq("hidden", true).order("name", { ascending: true })
    : { data: null };

  const templates = (data ?? []) as TemplateRow[];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: SITE_NAME, item: absoluteUrl("/") },
                  { "@type": "ListItem", position: 2, name: "Templates", item: absoluteUrl("/templates") },
                ],
              },
              {
                "@type": "CollectionPage",
                name: "Invitation Templates — Weddings, Birthdays, Dinners & Parties",
                url: absoluteUrl("/templates"),
                isPartOf: { "@type": "WebSite", name: SITE_NAME, url: absoluteUrl("/") },
                mainEntity: {
                  "@type": "ItemList",
                  numberOfItems: templates.length,
                  itemListElement: templates.map((t, i) => ({
                    "@type": "ListItem",
                    position: i + 1,
                    name: t.name,
                    url: absoluteUrl(`/templates/${t.slug}`),
                  })),
                },
              },
            ],
          }),
        }}
      />
      <TemplatesGallery initialTemplates={templates} />
    </>
  );
}

/**
 * Guest-facing guestbook page.
 * Fetches the published wedding by slug, loads the assigned template dynamically,
 * and renders all guestbook entries via GuestbookSection.
 */

import { notFound } from "next/navigation";
import { createCookieClient } from "@/lib/supabase/server";
import { getTemplate } from "@/components/templates/registry";
import { resolveTheme } from "@/components/templates/types";
import ScrollProgress from "@/components/ui/ScrollProgress";
import FloatingNav from "@/components/ui/FloatingNav";
import type { WeddingRow, TemplateRow, GuestbookEntryRow } from "@/types/database";

interface PageProps {
  params: { slug: string };
}

export default async function GuestbookPage({ params }: PageProps) {
  const supabase = createCookieClient();

  const { data: wedding } = await supabase
    .from("weddings")
    .select("*, template:templates(*)")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .single();

  if (!wedding) notFound();

  const weddingData = wedding as WeddingRow & { template: TemplateRow };

  if (!weddingData.customization.sections.guestbook) notFound();

  const templateDef = getTemplate(weddingData.template.slug);
  if (!templateDef) notFound();

  const { data: entries } = await supabase
    .from("guestbook_entries")
    .select("*")
    .eq("wedding_id", weddingData.id)
    .order("created_at", { ascending: false });

  const components = await templateDef.load();
  const theme = resolveTheme(weddingData.template.default_config, weddingData.customization);
  const { GuestbookSection } = components;

  return (
    <>
      <ScrollProgress color={theme.colors.primary} />
      <GuestbookSection
        weddingId={weddingData.id}
        entries={(entries ?? []) as GuestbookEntryRow[]}
        theme={theme}
      />
      <FloatingNav
        weddingSlug={params.slug}
        theme={theme}
        sections={weddingData.customization.sections}
      />
    </>
  );
}

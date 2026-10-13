/**
 * Guest-facing wedding invitation page.
 * Fetches the published wedding by slug, loads the assigned template dynamically,
 * and renders the invitation and (optionally) the timeline section.
 * First-time visitors see the EnvelopeAnimation before the content is revealed.
 */

import { notFound } from "next/navigation";
import { createCookieClient } from "@/lib/supabase/server";
import { getTemplate } from "@/components/templates/registry";
import { resolveTheme } from "@/components/templates/types";
import ScrollProgress from "@/components/ui/ScrollProgress";
import EnvelopeWrapper from "@/components/ui/EnvelopeWrapper";
import type { WeddingRow, TemplateRow, WeddingEventRow } from "@/types/database";
import MusicPlayer from "@/components/ui/MusicPlayer";
import FloatingNav from "@/components/ui/FloatingNav";

interface PageProps {
  params: { slug: string };
}

export default async function WeddingPage({ params }: PageProps) {
  const supabase = createCookieClient();

  const { data: wedding } = await supabase
    .from("weddings")
    .select("*, template:templates(*)")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .single();

  if (!wedding) notFound();

  const weddingData = wedding as WeddingRow & { template: TemplateRow };
  const templateDef = getTemplate(weddingData.template.slug);
  if (!templateDef) notFound();

  const { data: events } = await supabase
    .from("wedding_events")
    .select("*")
    .eq("wedding_id", weddingData.id)
    .order("sort_order", { ascending: true });

  const components = await templateDef.load();
  const theme = resolveTheme(weddingData.template.default_config, weddingData.customization);
  const { InvitationPage, TimelineSection } = components;

  return (
    <>
      <EnvelopeWrapper
        weddingId={weddingData.id}
        theme={theme}
        partnerNames={[weddingData.partner1_name, weddingData.partner2_name]}
      >
        <ScrollProgress color={theme.colors.primary} />
        <InvitationPage
          wedding={weddingData}
          events={(events ?? []) as WeddingEventRow[]}
          theme={theme}
        />
        {weddingData.customization.sections.timeline && (
          <TimelineSection
            events={(events ?? []) as WeddingEventRow[]}
            theme={theme}
          />
        )}
        <MusicPlayer musicUrl={weddingData.music_url ?? undefined} theme={theme} />
        <FloatingNav
          weddingSlug={params.slug}
          theme={theme}
          sections={weddingData.customization.sections}
        />
      </EnvelopeWrapper>
    </>
  );
}

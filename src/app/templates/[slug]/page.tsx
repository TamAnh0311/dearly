/**
 * Public template preview page — renders a full demo of the template
 * using placeholder wedding data, so guests can see exactly what each
 * template looks like before signing up.
 *
 * A floating banner at the top prompts visitors to create their own site.
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import { createCookieClient } from "@/lib/supabase/server";
import { getTemplate } from "@/components/templates/registry";
import { resolveTheme } from "@/components/templates/types";
import ScrollProgress from "@/components/ui/ScrollProgress";
import type { TemplateRow, WeddingRow, WeddingEventRow } from "@/types/database";

interface PageProps {
  params: { slug: string };
}

/** Placeholder wedding data used for the template preview. */
function buildMockWedding(template: TemplateRow): WeddingRow {
  return {
    id: "preview",
    user_id: "preview",
    template_id: template.id,
    slug: "preview",
    partner1_name: "Emma",
    partner2_name: "James",
    wedding_date: "2027-06-15",
    venue_name: "The Grand Estate",
    venue_address: "123 Garden Lane, Countryside",
    story_text:
      "We met on a rainy afternoon in a small coffee shop downtown. What started as a conversation over lattes became the greatest adventure of our lives. Three years, countless memories, and one very special question later — here we are, ready to begin our forever surrounded by the people we love most.",
    customization: {
      colors: {},
      fonts: {},
      sections: { timeline: true, gallery: true, guestbook: true },
      galleryLayout: "masonry",
    },
    is_published: true,
    guest_uploads_enabled: false,
    music_url: null,
    music_track_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

/** Placeholder timeline events for the preview. */
const MOCK_EVENTS: WeddingEventRow[] = [
  {
    id: "evt-1",
    wedding_id: "preview",
    title: "Ceremony",
    description: "Join us as we exchange our vows in the garden.",
    location: "The Grand Estate Chapel",
    start_time: "2027-06-15T15:00:00",
    end_time: "2027-06-15T16:00:00",
    icon: "heart",
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "evt-2",
    wedding_id: "preview",
    title: "Cocktail Hour",
    description: "Enjoy drinks and canapés on the terrace.",
    location: "Terrace Gardens",
    start_time: "2027-06-15T16:30:00",
    end_time: "2027-06-15T18:00:00",
    icon: "glass",
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "evt-3",
    wedding_id: "preview",
    title: "Reception & Dinner",
    description: "Celebrate with us in the grand ballroom.",
    location: "The Grand Ballroom",
    start_time: "2027-06-15T18:00:00",
    end_time: "2027-06-15T23:00:00",
    icon: "music",
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
];

export default async function TemplatePreviewPage({ params }: PageProps) {
  const supabase = createCookieClient();

  const { data: templateData } = await supabase
    .from("templates")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!templateData) notFound();

  const template = templateData as TemplateRow;
  const templateDef = getTemplate(template.slug);
  if (!templateDef) notFound();

  const mockWedding = buildMockWedding(template);
  const components = await templateDef.load();
  const theme = resolveTheme(template.default_config, mockWedding.customization);
  const { InvitationPage, TimelineSection } = components;

  return (
    <>
      {/* ── Preview Banner ── */}
      <div
        className="fixed top-0 inset-x-0 z-50 flex items-center justify-between gap-4 px-4 py-3 text-sm shadow-md"
        style={{ backgroundColor: theme.colors.primary }}
      >
        <p className="font-medium text-white/90 truncate">
          <span className="font-bold text-white">Preview:</span>{" "}
          {template.name} — This is a demo with placeholder content.
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/templates"
            className="rounded-lg border border-white/30 px-3 py-1.5 text-xs font-semibold text-white/90 transition hover:bg-white/10"
          >
            All Templates
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold transition hover:opacity-90"
            style={{ color: theme.colors.primary }}
          >
            Create Your Own Site
          </Link>
        </div>
      </div>

      {/* Spacer so the banner doesn't overlap content */}
      <div className="h-14" />

      <ScrollProgress color={theme.colors.primary} />

      <InvitationPage
        wedding={mockWedding}
        events={MOCK_EVENTS}
        theme={theme}
      />

      <TimelineSection events={MOCK_EVENTS} theme={theme} />

      {/* ── Bottom CTA ── */}
      <div className="relative z-10 flex flex-col items-center gap-4 py-16 px-6 text-center border-t bg-white">
        <p className="text-lg font-bold text-gray-900">
          Love what you see?
        </p>
        <p className="text-sm text-gray-500 max-w-md">
          Create your free account and use the{" "}
          <strong>{template.name}</strong> template for your own wedding site.
          Fully customizable — your colors, your story, your day.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/signup"
            className="rounded-xl px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
            style={{ backgroundColor: theme.colors.primary }}
          >
            Use This Template — Free
          </Link>
          <Link
            href="/templates"
            className="rounded-xl border border-gray-200 px-8 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
          >
            Browse All Templates
          </Link>
        </div>
      </div>
    </>
  );
}

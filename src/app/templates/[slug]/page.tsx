/**
 * Public template preview page — renders a full demo of the template
 * using placeholder wedding data, so guests can see exactly what each
 * template looks like before signing up.
 *
 * A floating banner at the top prompts visitors to create their own site.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { absoluteUrl } from "@/lib/seo";
import { LAYOUT_LABEL, getInvitationStyle } from "@/components/invitation/styles";
import Link from "next/link";
import { createCookieClient } from "@/lib/supabase/server";
import { getTemplate } from "@/components/templates/registry";
import { resolveTheme } from "@/components/templates/types";
import ScrollProgress from "@/components/ui/ScrollProgress";
import TemplatePreview from "@/components/invitation/TemplatePreview";
import { PLACEHOLDER_IMAGES } from "@/lib/placeholder-images";
import type { TemplateRow, WeddingRow, WeddingEventRow, GuestbookEntryRow } from "@/types/database";

interface PageProps {
  params: { slug: string };
  searchParams?: { embed?: string; scheme?: string; bare?: string };
}

/** Placeholder wedding data used for the template preview. */
function buildMockWedding(template: TemplateRow): WeddingRow {
  // Celebration templates demo as a birthday/party so visitors see the right copy.
  const type = template.event_types?.[0] ?? "wedding";
  const single = type === "birthday" || type === "party" || type === "social" || type === "baby-shower";
  return {
    id: "preview",
    user_id: "preview",
    template_id: template.id,
    slug: "preview",
    partner1_name: "Emma",
    partner2_name: single ? "" : "James",
    event_type: type,
    event_title: type === "birthday" ? "Emma's 30th Birthday" : type === "party" ? "Summer Rooftop Party" : type === "social" ? "An Evening at the Grand Estate" : null,
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

/** DEMO ONLY — sample blessings so visitors can see the blessing wall. Never persisted. */
const DEMO_BLESSINGS: GuestbookEntryRow[] = [
  { id: "demo-b1", wedding_id: "preview", guest_name: "Grandma Rose", message: "My darlings, may your home always be full of laughter and your hearts full of each other. I love you both more than words.", rsvp_status: "attending", created_at: "2027-05-01T10:00:00Z" },
  { id: "demo-b2", wedding_id: "preview", guest_name: "Sophie & Liam", message: "So sad we can't be there — sending all our love from Lisbon! Dance the night away for us.", rsvp_status: "declined", created_at: "2027-04-28T18:30:00Z" },
  { id: "demo-b3", wedding_id: "preview", guest_name: "Daniel", message: "Best friends since kindergarten, and now I get to watch you marry the love of your life. Cheers to forever!", rsvp_status: "attending", created_at: "2027-04-20T09:15:00Z" },
  { id: "demo-b4", wedding_id: "preview", guest_name: "Aunt Clara", message: "Wishing you a lifetime of adventures together.", rsvp_status: "attending", created_at: "2027-04-12T12:00:00Z" },
];

/** SEO: each template demo is an indexable landing page (embedded modes are not). */
export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const supabase = createCookieClient();
  const { data } = await supabase.from("templates").select("name, description, slug").eq("slug", params.slug).maybeSingle();
  if (!data) return { title: "Template not found", robots: { index: false } };
  const label = LAYOUT_LABEL[getInvitationStyle(data.slug).hero];
  const title = `${data.name} — ${label} invitation template`;
  const description = `${data.description}. Live animated demo with RSVP, blessings and a photo album — try every colour scheme free.`;
  const embedded = searchParams?.embed === "1";
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(`/templates/${data.slug}`) },
    robots: embedded ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: { title, description, url: absoluteUrl(`/templates/${data.slug}`) },
  };
}

export default async function TemplatePreviewPage({ params, searchParams }: PageProps) {
  const embedded = searchParams?.embed === "1";
  const bare = embedded && searchParams?.bare === "1";
  const initialScheme = typeof searchParams?.scheme === "string" ? searchParams.scheme.slice(0, 40) : "original";
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
  const theme = resolveTheme(template.default_config, mockWedding.customization);

  return (
    <>
      {!bare && <ScrollProgress color={theme.colors.primary} />}

      <TemplatePreview
        templateName={template.name}
        templateSlug={template.slug}
        baseTheme={theme}
        wedding={mockWedding}
        events={MOCK_EVENTS}
        blessings={DEMO_BLESSINGS}
        reactions={{ love: 128, bloom: 64, cheers: 42, sparkle: 37, rings: 21 }}
        photos={[...PLACEHOLDER_IMAGES.couple, ...PLACEHOLDER_IMAGES.wedding.slice(0, 3)]}
        initialScheme={initialScheme}
        embedded={embedded}
        bare={bare}
      />

      {/* ── Bottom CTA (hidden when embedded in the dashboard) ── */}
      {!embedded && (
      <div className="relative z-10 flex flex-col items-center gap-4 border-t bg-white px-6 py-16 text-center">
        <p className="text-lg font-bold text-gray-900">Love what you see?</p>
        <p className="max-w-md text-sm text-gray-500">
          Create your free account and use the <strong>{template.name}</strong> design for your own wedding site.
          Pick any colour scheme — your colours, your story, your day.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href={`/signup?template=${template.slug}`}
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
      )}
    </>
  );
}
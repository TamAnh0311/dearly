/**
 * Guest-facing event page (wedding, birthday, party, social event).
 * Fetches the published event by slug and renders the shared
 * CinematicInvitation themed by the chosen template.
 * First-time visitors see the EnvelopeAnimation before the content is revealed.
 *
 * - Personal links `/<slug>?i=<token>` (from the guest list) greet the guest by
 *   name, prefill RSVP and cap their party size.
 * - Pages are noindex (they contain personal details) but carry rich Open
 *   Graph previews for WhatsApp / social sharing.
 * - After the event date the page becomes a memory book (RSVP closes).
 *
 * Music resolution order:
 *  1. music_track_id - library track; plays as its genre's generative preset
 *     (or the file, if the URL is external).
 *  2. music_url - custom file, falling back to the template's preset if it fails.
 *  3. Neither set - the template's default generative music (can be switched off
 *     with the "Background music" section toggle).
 */

import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { createCookieClient, createServiceRoleClient } from "@/lib/supabase/server";
import { getTemplate } from "@/components/templates/registry";
import { resolveTheme } from "@/components/templates/types";
import ScrollProgress from "@/components/ui/ScrollProgress";
import EnvelopeWrapper from "@/components/ui/EnvelopeWrapper";
import CinematicInvitation from "@/components/invitation/CinematicInvitation";
import { getInvitationStyle } from "@/components/invitation/styles";
import { formatLongDate } from "@/components/invitation/utils";
import { toMusicPreset } from "@/lib/ambient-music";
import { EVENT_COPY, eventTypeOf, hostNames } from "@/lib/event-types";
import type {
  WeddingRow,
  TemplateRow,
  WeddingEventRow,
  MusicTrackRow,
  GuestbookEntryRow,
  WeddingReactionRow,
} from "@/types/database";

interface PageProps {
  params: { slug: string };
  searchParams?: { i?: string };
}

type EventWithTemplate = WeddingRow & { template: TemplateRow };

/** Loads a published event by slug (memoised per request for metadata + page). */
const loadEvent = cache(async (slug: string): Promise<EventWithTemplate | null> => {
  const supabase = createCookieClient();
  const { data } = await supabase
    .from("weddings")
    .select("*, template:templates(*)")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  return (data as EventWithTemplate | null) ?? null;
});

/** Share-friendly title/description; event pages stay out of search results. */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const event = await loadEvent(params.slug);
  if (!event) return { title: "Invitation not found", robots: { index: false, follow: false } };
  const copy = EVENT_COPY[eventTypeOf(event)];
  const title = event.event_title || `${hostNames(event)} — ${copy.label}`;
  const when = event.wedding_date ? formatLongDate(event.wedding_date) : null;
  const description = [when, event.venue_name].filter(Boolean).join(" · ") || copy.blurb;
  const shareTitle = `You're invited: ${title}`;
  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: { title: shareTitle, description, type: "website" },
    twitter: { card: "summary_large_image", title: shareTitle, description },
  };
}

/** Resolves a personal invitation token to the invitee's name and seat limit (server-only). */
async function loadInvitee(weddingId: string, token: string | undefined) {
  if (!token || !/^[a-f0-9]{8,40}$/i.test(token)) return null;
  try {
    const admin = createServiceRoleClient();
    const { data } = await admin
      .from("invitees")
      .select("name, max_party_size, token")
      .eq("wedding_id", weddingId)
      .eq("token", token)
      .maybeSingle();
    return data ? { token: data.token as string, name: data.name as string, maxPartySize: data.max_party_size as number } : null;
  } catch (err) {
    console.warn("[WARNING] invitee lookup failed", { weddingId, reason: err instanceof Error ? err.message : "unknown" });
    return null;
  }
}

export default async function WeddingPage({ params, searchParams }: PageProps) {
  const supabase = createCookieClient();
  const weddingData = await loadEvent(params.slug);
  if (!weddingData) notFound();
  if (!getTemplate(weddingData.template.slug)) notFound();

  const [eventsRes, blessingsRes, reactionsRes, photosRes, trackRes, invitee] = await Promise.all([
    supabase.from("wedding_events").select("*").eq("wedding_id", weddingData.id).order("sort_order", { ascending: true }),
    supabase
      .from("guestbook_entries")
      .select("*")
      .eq("wedding_id", weddingData.id)
      .order("created_at", { ascending: false })
      .limit(200),
    supabase.from("wedding_reactions").select("kind, count").eq("wedding_id", weddingData.id),
    supabase
      .from("gallery_photos")
      .select("url, thumbnail_url")
      .eq("wedding_id", weddingData.id)
      .eq("status", "approved")
      .order("sort_order", { ascending: true })
      .limit(10),
    weddingData.music_track_id
      ? supabase.from("music_tracks").select("url, genre").eq("id", weddingData.music_track_id).single()
      : Promise.resolve({ data: null }),
    loadInvitee(weddingData.id, searchParams?.i),
  ]);

  if (reactionsRes.error) console.warn("[WARNING] reactions unavailable", { code: reactionsRes.error.code });

  // Library tracks point at /music/* files that are not bundled, so they play as the
  // matching generative preset; a custom URL plays as a file (falling back to the preset).
  const track = trackRes.data as Pick<MusicTrackRow, "url" | "genre"> | null;
  const music = track
    ? { url: track.url.startsWith("/music/") ? null : track.url, preset: toMusicPreset(track.genre) }
    : weddingData.music_url
      ? { url: weddingData.music_url, preset: null }
      : undefined;

  const reactions = Object.fromEntries(
    ((reactionsRes.data ?? []) as Pick<WeddingReactionRow, "kind" | "count">[]).map((r) => [r.kind, Number(r.count)])
  );
  const photos = ((photosRes.data ?? []) as { url: string; thumbnail_url: string | null }[]).map((p) => p.thumbnail_url ?? p.url);
  const theme = resolveTheme(weddingData.template.default_config, weddingData.customization);
  const style = getInvitationStyle(weddingData.template.slug);

  const content = (
    <>
      {!style.storybook && <ScrollProgress color={theme.colors.primary} />}
      <CinematicInvitation
        wedding={weddingData}
        events={(eventsRes.data ?? []) as WeddingEventRow[]}
        theme={theme}
        templateSlug={weddingData.template.slug}
        blessings={(blessingsRes.data ?? []) as GuestbookEntryRow[]}
        reactions={reactions}
        photos={photos}
        music={music}
        guestUploads={weddingData.guest_uploads_enabled}
        invitee={invitee}
      />
    </>
  );

  // The wax-seal and Storybook designs open their own page, so skip the generic envelope intro.
  if (style.hero === "seal" || style.storybook) return content;

  return (
    <EnvelopeWrapper weddingId={weddingData.id} theme={theme} partnerNames={[weddingData.partner1_name, weddingData.partner2_name]}>
      {content}
    </EnvelopeWrapper>
  );
}

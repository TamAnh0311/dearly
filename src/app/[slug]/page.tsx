/**
 * Guest-facing wedding invitation page.
 * Fetches the published wedding by slug and renders the shared
 * CinematicInvitation landing page themed by the couple's template.
 * First-time visitors see the EnvelopeAnimation before the content is revealed.
 *
 * Data loaded server-side: events, blessings (guestbook entries), reaction
 * counts, and approved gallery photos for the "Moments" ribbon.
 *
 * Music resolution order:
 *  1. music_track_id — library track; plays as its genre's generative preset
 *     (or the file, if the URL is external).
 *  2. music_url — custom file, falling back to the template's preset if it fails.
 *  3. Neither set — the template's default generative music (can be switched off
 *     with the "Background music" section toggle).
 */

import { notFound } from "next/navigation";
import { createCookieClient } from "@/lib/supabase/server";
import { getTemplate } from "@/components/templates/registry";
import { resolveTheme } from "@/components/templates/types";
import ScrollProgress from "@/components/ui/ScrollProgress";
import EnvelopeWrapper from "@/components/ui/EnvelopeWrapper";
import CinematicInvitation from "@/components/invitation/CinematicInvitation";
import { getInvitationStyle } from "@/components/invitation/styles";
import { toMusicPreset } from "@/lib/ambient-music";
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
  if (!getTemplate(weddingData.template.slug)) notFound();

  const [eventsRes, blessingsRes, reactionsRes, photosRes, trackRes] = await Promise.all([
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
  ]);

  // Reaction table may not exist yet if migration 00015 hasn't been applied — degrade gracefully.
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
  const photos = ((photosRes.data ?? []) as { url: string; thumbnail_url: string | null }[]).map(
    (p) => p.thumbnail_url ?? p.url
  );

  const theme = resolveTheme(weddingData.template.default_config, weddingData.customization);

  const content = (
    <>
      <ScrollProgress color={theme.colors.primary} />
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
      />
    </>
  );

  // The wax-seal design opens its own envelope, so skip the generic envelope intro.
  if (getInvitationStyle(weddingData.template.slug).hero === "seal") return content;

  return (
    <EnvelopeWrapper
      weddingId={weddingData.id}
      theme={theme}
      partnerNames={[weddingData.partner1_name, weddingData.partner2_name]}
    >
      {content}
    </EnvelopeWrapper>
  );
}
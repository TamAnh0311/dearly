"use client";

/**
 * CinematicInvitation — the shared guest-facing landing page used by every
 * wedding template. Each template contributes its colours and fonts (via
 * ResolvedTheme) and its own design language via `templateSlug` (hero layout,
 * ambient effects, ornaments, corners, texture — see ./styles.ts). This
 * component supplies the shared content, RSVP flow and blessing wall.
 *
 * Section order: Hero → Countdown → Story → Schedule → Venue → Moments → RSVP → Blessings → Footer.
 * Sections without data are skipped, and couples can hide any section via
 * customization.sections (see ./sections-config.ts).
 */

import { useMemo, useState } from "react";
import type { ResolvedTheme } from "@/components/templates/types";
import type { GuestbookEntryRow, WeddingEventRow, WeddingRow } from "@/types/database";
import Hero from "./sections/Hero";
import Countdown from "./sections/Countdown";
import Story from "./sections/Story";
import Schedule from "./sections/Schedule";
import { Moments, Venue } from "./sections/VenueMoments";
import RsvpSection from "./sections/RsvpSection";
import Blessings, { type ReactionCounts } from "./sections/Blessings";
import { Footer, TopNav, type NavLink } from "./sections/Chrome";
import { buildPalette, googleFontsUrl } from "./utils";
import { resolveBlessingStyle, resolveSections } from "./sections-config";
import { EventContext } from "./sections/HeroParts";
import { EVENT_COPY, eventTypeOf, hostNames, isPastEvent } from "@/lib/event-types";
import BlessingShower from "./effects/BlessingShower";
import MusicPlayer from "@/components/ui/MusicPlayer";
import type { MusicPreset } from "@/lib/ambient-music";

export interface CinematicInvitationProps {
  wedding: WeddingRow;
  events: WeddingEventRow[];
  theme: ResolvedTheme;
  /** Template slug — selects the design language (see ./styles.ts). */
  templateSlug?: string | null;
  /** Approved blessings / guestbook entries, newest first. */
  blessings?: GuestbookEntryRow[];
  reactions?: Partial<ReactionCounts>;
  /** Photo URLs for the "Moments" ribbon. */
  photos?: string[];
  /** Simulate RSVP/reactions locally (template gallery & editor previews). */
  demo?: boolean;
  /** Pixels reserved at the top of the viewport (e.g. a preview banner). */
  topOffset?: number;
  /** Background music: a file URL and/or generative preset. Defaults to the template's preset. */
  music?: { url?: string | null; preset?: MusicPreset | null };
  /** Show the "Share your photos" call-to-action (guest uploads enabled). */
  guestUploads?: boolean;
  /** Personal invitation from the guest list (?i=token): prefilled name + seat limit. */
  invitee?: { token: string; name: string; maxPartySize: number } | null;
}

/** Fixed, non-interactive paper / film-grain overlay for tactile templates. */
function TextureOverlay({ kind }: { kind: "paper" | "grain" }) {
  const noise = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${kind === "paper" ? 0.6 : 0.9}' numOctaves='${kind === "paper" ? 4 : 2}' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.35  0 0 0 0 0.28  0 0 0 0 0.2  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[35] mix-blend-multiply"
      style={{ backgroundImage: noise, opacity: kind === "paper" ? 0.22 : 0.14 }}
    />
  );
}

const EMPTY_REACTIONS: ReactionCounts = { love: 0, bloom: 0, cheers: 0, sparkle: 0, rings: 0 };

export default function CinematicInvitation({
  wedding,
  events,
  theme,
  templateSlug,
  blessings: initialBlessings = [],
  reactions,
  photos = [],
  demo = false,
  topOffset = 0,
  music,
  guestUploads = false,
  invitee = null,
}: CinematicInvitationProps) {
  const palette = useMemo(() => buildPalette(theme, templateSlug), [theme, templateSlug]);
  const [blessings, setBlessings] = useState(initialBlessings);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const names: [string, string] = [wedding.partner1_name, wedding.partner2_name];
  const eventType = eventTypeOf(wedding);
  const copy = EVENT_COPY[eventType];
  const twoNames = Boolean(wedding.partner2_name?.trim());
  // After the event the page becomes a memory book: RSVP closes, memories stay.
  const past = !demo && isPastEvent(wedding.wedding_date);
  const show = resolveSections(wedding.customization?.sections);
  const showSchedule = events.length > 0 && show.timeline;
  const showMoments = (photos.length >= 3 || guestUploads) && show.gallery;
  const showStory = !!wedding.story_text && show.story;
  const showVenue = !!wedding.venue_name && show.venue;
  const showWall = show.blessings || show.reactions;
  const showRsvp = show.rsvp && !past;

  const links: NavLink[] = [
    ...(showStory ? [{ href: "#story", label: copy.storyTitle }] : []),
    ...(showSchedule ? [{ href: "#schedule", label: "Schedule" }] : []),
    ...(showVenue ? [{ href: "#venue", label: "Venue" }] : []),
    ...(showMoments ? [{ href: "#moments", label: "Memories" }] : []),
    ...(showWall ? [{ href: "#blessings", label: copy.blessingsTitle }] : []),
  ];

  /** Adds a freshly-sent blessing to the top of the wall and scrolls to it. */
  function handleBlessing(entry: GuestbookEntryRow) {
    setBlessings((prev) => [entry, ...prev]);
    setHighlightId(entry.id);
    setTimeout(() => document.getElementById("blessings")?.scrollIntoView({ behavior: "smooth" }), 2200);
  }

  return (
    <EventContext.Provider value={{ eventType, copy, twoNames, inviteeName: invitee?.name ?? null }}>
      <div
        className="relative min-h-screen overflow-x-hidden antialiased"
        style={{ backgroundColor: palette.background, color: palette.ink, fontFamily: palette.bodyFont }}
      >
        {/* Theme fonts (template fonts + script accent) */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href={googleFontsUrl(theme.fonts)} />

        {palette.style.texture !== "none" && <TextureOverlay kind={palette.style.texture} />}
        <TopNav names={names} links={links} palette={palette} topOffset={topOffset} showRsvp={showRsvp} />
        <Hero wedding={wedding} palette={palette} photos={photos} />
        {wedding.wedding_date && show.countdown && (
          <Countdown
            date={wedding.wedding_date}
            title={copy.calendarTitle(hostNames(wedding))}
            venue={[wedding.venue_name, wedding.venue_address].filter(Boolean).join(", ") || null}
            palette={palette}
          />
        )}
        {showStory && <Story text={wedding.story_text!} palette={palette} title={copy.storyTitle} />}
        {showSchedule && <Schedule events={events} palette={palette} />}
        {showVenue && <Venue name={wedding.venue_name!} address={wedding.venue_address} palette={palette} />}
        {showMoments && (
          <Moments
            photos={photos}
            galleryHref={demo ? undefined : `/${wedding.slug}/gallery`}
            uploadHref={guestUploads ? (demo ? "#moments" : `/${wedding.slug}/gallery#share`) : undefined}
            palette={palette}
          />
        )}
        {showRsvp && (
          <RsvpSection
            weddingId={wedding.id}
            coupleNames={names}
            palette={palette}
            demo={demo}
            onBlessing={handleBlessing}
            eyebrow={copy.rsvpEyebrow}
            title={copy.rsvpTitle}
            invitee={invitee}
          />
        )}
        {showWall && (
          <Blessings
            weddingId={wedding.id}
            blessings={blessings}
            reactions={{ ...EMPTY_REACTIONS, ...reactions }}
            highlightId={highlightId}
            palette={palette}
            demo={demo}
            showWall={show.blessings}
            showReactions={show.reactions}
            title={copy.blessingsTitle}
          />
        )}
        {show.blessingShower && (
          <BlessingShower
            blessings={blessings}
            palette={palette}
            latestId={highlightId}
            mode={resolveBlessingStyle(wedding.customization?.blessingStyle)}
          />
        )}
        {show.music && <MusicPlayer musicUrl={music?.url} preset={music?.preset ?? palette.style.music} theme={theme} />}
        <Footer
          names={names}
          date={wedding.wedding_date}
          slug={demo ? undefined : wedding.slug}
          palette={palette}
          showGallery={show.gallery}
          showGuestbook={show.guestbook}
        />
      </div>
    </EventContext.Provider>
  );
}

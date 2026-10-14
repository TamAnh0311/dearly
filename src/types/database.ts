/**
 * Database row types matching the Supabase schema.
 */

export interface TemplateRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  preview_image: string | null;
  animation_style: "subtle" | "cinematic" | "interactive";
  default_config: TemplateConfig;
  created_at: string;
}

export interface TemplateConfig {
  colors: { primary: string; secondary: string; accent: string };
  fonts: { display: string; body: string };
  animations: Record<string, string>;
}

export interface WeddingRow {
  id: string;
  user_id: string;
  template_id: string;
  slug: string;
  partner1_name: string;
  partner2_name: string;
  wedding_date: string | null;
  venue_name: string | null;
  venue_address: string | null;
  story_text: string | null;
  customization: WeddingCustomization;
  music_url: string | null;
  music_track_id: string | null;
  is_published: boolean;
  guest_uploads_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface MusicTrackRow {
  id: string;
  name: string;
  artist: string;
  genre: "piano" | "acoustic" | "orchestral" | "ambient" | "romantic";
  duration_seconds: number;
  url: string;
  preview_url: string | null;
  is_featured: boolean;
  created_at: string;
}

export interface WeddingCustomization {
  colors: { primary?: string; secondary?: string; accent?: string };
  fonts: { display?: string; body?: string };
  /** Section visibility (see src/components/invitation/sections-config.ts). Unset keys = visible. */
  sections: {
    timeline: boolean;
    gallery: boolean;
    guestbook: boolean;
    countdown?: boolean;
    story?: boolean;
    venue?: boolean;
    rsvp?: boolean;
    blessings?: boolean;
    reactions?: boolean;
    blessingShower?: boolean;
    music?: boolean;
  };
  galleryLayout: "masonry" | "albums" | "timeline";
  /** How blessings appear on page load: background running text (default) or floating carriers. */
  blessingStyle?: "marquee" | "float";
}

export interface WeddingEventRow {
  id: string;
  wedding_id: string;
  title: string;
  description: string | null;
  location: string | null;
  start_time: string;
  end_time: string | null;
  icon: string;
  sort_order: number;
  created_at: string;
}

export interface GalleryPhotoRow {
  id: string;
  wedding_id: string;
  url: string;
  thumbnail_url: string | null;
  caption: string | null;
  album: "pre-wedding" | "ceremony" | "reception" | "other";
  sort_order: number;
  uploaded_by: "couple" | "guest";
  guest_name: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export interface GuestbookEntryRow {
  id: string;
  wedding_id: string;
  guest_name: string;
  message: string;
  /** RSVP choice of the guest who left this blessing (null for plain guestbook messages). */
  rsvp_status?: "attending" | "declined" | null;
  created_at: string;
}

export interface RsvpRow {
  id: string;
  wedding_id: string;
  guest_name: string;
  attending: boolean;
  party_size: number;
  message: string | null;
  created_at: string;
}

/** Blessing reaction kinds — must match the CHECK constraint on wedding_reactions.kind. */
export const REACTION_KINDS = ["love", "bloom", "cheers", "sparkle", "rings"] as const;
export type ReactionKind = (typeof REACTION_KINDS)[number];

export interface WeddingReactionRow {
  wedding_id: string;
  kind: ReactionKind;
  count: number;
}

export interface CuteQuestionRow {
  id: string;
  user_id: string | null;
  slug: string;
  question: string;
  sender_name: string;
  recipient_name: string | null;
  theme: "hearts" | "roses" | "stars" | "kawaii" | "classic";
  yes_message: string;
  background_color: string;
  accent_color: string;
  answered: boolean;
  answered_at: string | null;
  created_at: string;
}

export interface CardTemplateRow {
  id: string;
  name: string;
  slug: string;
  category: "postcard" | "birthday" | "event" | "thank-you" | "holiday";
  description: string;
  preview_image: string | null;
  default_config: { colors: { primary: string; secondary: string; accent: string }; fonts: { display: string; body: string } };
  created_at: string;
}

export interface CardRow {
  id: string;
  user_id: string | null;
  template_id: string;
  slug: string;
  title: string;
  message: string;
  sender_name: string;
  recipient_name: string | null;
  event_date: string | null;
  event_location: string | null;
  customization: Record<string, unknown>;
  image_url: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

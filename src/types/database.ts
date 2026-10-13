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
  is_published: boolean;
  guest_uploads_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface WeddingCustomization {
  colors: { primary?: string; secondary?: string; accent?: string };
  fonts: { display?: string; body?: string };
  sections: { timeline: boolean; gallery: boolean; guestbook: boolean };
  galleryLayout: "masonry" | "albums" | "timeline";
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
  created_at: string;
}

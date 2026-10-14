/**
 * Template component interfaces — every template must export components
 * matching these props to be registered. The main invitation page is the
 * shared CinematicInvitation; templates provide gallery + guestbook views.
 */

import type { WeddingRow, GalleryPhotoRow, GuestbookEntryRow, TemplateConfig } from "@/types/database";

export interface ResolvedTheme {
  colors: { primary: string; secondary: string; accent: string };
  fonts: { display: string; body: string };
  animations: Record<string, string>;
}

export interface GalleryLayoutProps {
  wedding: WeddingRow;
  photos: GalleryPhotoRow[];
  layout: "masonry" | "albums" | "timeline";
  theme: ResolvedTheme;
}

export interface GuestbookSectionProps {
  weddingId: string;
  entries: GuestbookEntryRow[];
  theme: ResolvedTheme;
}

export interface TemplateComponents {
  GalleryLayout: React.ComponentType<GalleryLayoutProps>;
  GuestbookSection: React.ComponentType<GuestbookSectionProps>;
}

export interface TemplateDefinition {
  slug: string;
  name: string;
  load: () => Promise<TemplateComponents>;
}

/**
 * Resolves theme by merging template defaults with couple customization.
 */
export function resolveTheme(
  templateConfig: TemplateConfig,
  customization: WeddingRow["customization"]
): ResolvedTheme {
  return {
    colors: {
      primary: customization.colors?.primary ?? templateConfig.colors.primary,
      secondary: customization.colors?.secondary ?? templateConfig.colors.secondary,
      accent: customization.colors?.accent ?? templateConfig.colors.accent,
    },
    fonts: {
      display: customization.fonts?.display ?? templateConfig.fonts.display,
      body: customization.fonts?.body ?? templateConfig.fonts.body,
    },
    animations: templateConfig.animations ?? {},
  };
}

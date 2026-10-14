/**
 * Invitation section visibility — which parts of the guest page the couple
 * chooses to show. Stored in `weddings.customization.sections` (JSONB);
 * keys missing from older rows default to visible.
 */

import type { WeddingCustomization } from "@/types/database";

export type SectionKey =
  | "countdown"
  | "story"
  | "timeline"
  | "venue"
  | "gallery"
  | "rsvp"
  | "blessings"
  | "reactions"
  | "blessingShower"
  | "music"
  | "guestbook";

export interface SectionToggle {
  key: SectionKey;
  label: string;
  description: string;
}

/** Toggles shown to couples, in page order. */
export const SECTION_TOGGLES: SectionToggle[] = [
  { key: "countdown", label: "Countdown", description: "Live days-to-go timer & add-to-calendar" },
  { key: "story", label: "Our story", description: "How you met, in your words" },
  { key: "timeline", label: "Schedule", description: "Order of the day" },
  { key: "venue", label: "Venue & map", description: "Address with directions" },
  { key: "gallery", label: "Photo moments", description: "Photo ribbon + gallery page" },
  { key: "rsvp", label: "RSVP", description: "\u201cI'll be there\u201d / \u201cCan't make it\u201d" },
  { key: "blessings", label: "Blessing wall", description: "All guest wishes on the page" },
  { key: "reactions", label: "Reactions", description: "Tap-to-send hearts, blooms, cheers" },
  { key: "blessingShower", label: "Blessings on page load", description: "Running text or floating wishes as the page opens" },
  { key: "music", label: "Background music", description: "Starts softly on the guest's first tap" },
  { key: "guestbook", label: "Guest book page", description: "Separate guest book link" },
];

export type SectionVisibility = Record<SectionKey, boolean>;

export type BlessingStyle = NonNullable<WeddingCustomization["blessingStyle"]>;

/** Choices for how blessings appear on page load. */
export const BLESSING_STYLES: { value: BlessingStyle; label: string; description: string }[] = [
  { value: "marquee", label: "Running text", description: "Wishes drift across the background" },
  { value: "float", label: "Floating", description: "Carried up by flowers, butterflies or stars" },
];

/** Resolves the stored blessing style; anything unknown falls back to running text. */
export function resolveBlessingStyle(value: unknown): BlessingStyle {
  return value === "float" ? "float" : "marquee";
}

/** Resolves stored (possibly partial) section flags; anything unset is visible. */
export function resolveSections(sections?: Partial<WeddingCustomization["sections"]> | null): SectionVisibility {
  const out = {} as SectionVisibility;
  for (const { key } of SECTION_TOGGLES) out[key] = sections?.[key] !== false;
  return out;
}

/**
 * Validates untrusted input (e.g. a postMessage payload) into a sections
 * object: only known keys with boolean values survive; returns null if invalid.
 */
export function sanitizeSections(input: unknown): WeddingCustomization["sections"] | null {
  if (!input || typeof input !== "object") return null;
  const raw = input as Record<string, unknown>;
  const out: Record<string, boolean> = {};
  for (const { key } of SECTION_TOGGLES) out[key] = raw[key] !== false;
  return out as unknown as WeddingCustomization["sections"];
}
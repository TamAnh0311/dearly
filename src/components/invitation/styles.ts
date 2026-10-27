/**
 * Per-template design language for the cinematic invitation.
 *
 * Every template shares the same section *content* (hero, countdown, story,
 * schedule, venue, RSVP, blessings) but each has its own look: hero layout,
 * ambient effects, ornaments, corner shapes, paper texture and heading style.
 * Colours come separately from the theme / selected colour scheme.
 */

import type { MusicPreset } from "@/lib/ambient-music";
import type { ArtCollectionId } from "./art";

export type HeroLayout =
  | "garden"
  | "arch"
  | "editorial"
  | "split"
  | "celestial"
  | "polaroid"
  | "curtain"
  | "seal"
  | "daynight"
  | "stained"
  // ── East Asian collection ──
  | "doors"
  | "poster"
  | "enso"
  | "shoji"
  | "bojagi"
  // ── Painted collection ──
  | "atelier";
export type Ambient = "butterflies" | "petals" | "leaves" | "confetti" | "snow" | "gold-dust" | "stars" | "bokeh" | "balloons" | "lanterns";
export type Ornament = "floral" | "deco" | "line" | "leaf" | "star" | "wave" | "cloud";
/** Cultural tradition a template draws on (search keywords, copy accents). */
export type Culture = "chinese" | "japanese" | "korean" | "vietnamese";
export type Corners = "rounded" | "sharp" | "arch" | "pill";
export type Texture = "none" | "paper" | "grain";

export interface InvitationStyle {
  hero: HeroLayout;
  ambient: Ambient[];
  ornament: Ornament;
  corners: Corners;
  texture: Texture;
  /** Script-font eyebrows ("Save the date") vs small-caps eyebrows. */
  eyebrow: "script" | "caps";
  /** Section titles in uppercase tracking vs natural case. */
  headingCase: "upper" | "normal";
  /** Whether the hero shows growing flowers along the bottom. */
  flowers: boolean;
  /** Curtain material for the "curtain" hero: theatre velvet or garden ivy gates. */
  curtain: "velvet" | "ivy";
  /** Hide the date under a scratch-to-reveal card in the countdown section. */
  scratchReveal: boolean;
  /** Default generative background music when the couple hasn't picked a track. */
  music: MusicPreset;
  /** Show a month calendar with the date circled (East Asian invitations always do). */
  calendar: boolean;
  /** Cultural tradition the design draws on, if any. */
  culture?: Culture;
  /** Curated artwork the template layers behind its content (see ./art.ts). */
  art?: ArtCollectionId;
  /** Optional body-font override when the template's default pair is too playful. */
  bodyFont?: string;
}

const BASE: InvitationStyle = {
  hero: "garden",
  ambient: ["butterflies", "petals", "bokeh"],
  ornament: "floral",
  corners: "rounded",
  texture: "none",
  eyebrow: "script",
  headingCase: "upper",
  flowers: true,
  curtain: "velvet",
  scratchReveal: false,
  music: "piano",
  calendar: false,
};

/** Template slug → design language. Unknown slugs fall back to BASE ("garden"). */
const STYLES: Record<string, Partial<InvitationStyle>> = {
  eternal: { music: "romantic", hero: "arch", ambient: ["gold-dust", "bokeh"], ornament: "deco", corners: "sharp", flowers: false },
  bloom: { music: "romantic", hero: "atelier", art: "watercolour-garden", bodyFont: "Jost", ambient: ["butterflies", "petals", "bokeh"], ornament: "line", eyebrow: "caps", headingCase: "normal", texture: "paper", flowers: false, calendar: true },
  minimal: { hero: "editorial", ambient: [], ornament: "line", corners: "sharp", eyebrow: "caps", headingCase: "normal", flowers: false },
  rustic: { music: "acoustic", hero: "arch", ambient: ["leaves"], ornament: "leaf", texture: "paper", flowers: true },
  deco: { music: "orchestral", hero: "arch", ambient: ["gold-dust"], ornament: "deco", corners: "sharp", eyebrow: "caps", flowers: false },
  sunset: { music: "acoustic", hero: "split", ambient: ["petals", "bokeh"], ornament: "wave", corners: "rounded", flowers: false },
  noir: { hero: "editorial", ambient: ["gold-dust"], ornament: "line", corners: "sharp", eyebrow: "caps", flowers: false },
  garden: { music: "acoustic", hero: "garden", art: "watercolour-garden", ambient: ["butterflies", "leaves", "bokeh"], ornament: "leaf", texture: "paper", calendar: true },
  polaroid: { music: "acoustic", hero: "polaroid", ambient: ["confetti"], ornament: "line", corners: "sharp", eyebrow: "script", headingCase: "normal", flowers: false },
  glass: { music: "ambient", hero: "split", ambient: ["bokeh"], ornament: "line", corners: "pill", eyebrow: "caps", headingCase: "normal", flowers: false },
  luxe: { music: "orchestral", hero: "arch", ambient: ["gold-dust", "bokeh"], ornament: "deco", corners: "sharp", flowers: false },
  boho: { music: "acoustic", hero: "arch", ambient: ["leaves", "butterflies"], ornament: "leaf", corners: "arch", texture: "paper" },
  seaside: { music: "acoustic", hero: "split", ambient: ["bokeh"], ornament: "wave", corners: "rounded", flowers: false },
  cherry: { music: "musicbox", hero: "garden", ambient: ["petals", "butterflies"], ornament: "floral", corners: "rounded" },
  vineyard: { music: "acoustic", hero: "split", ambient: ["leaves"], ornament: "leaf", corners: "arch", texture: "paper", flowers: false },
  nordic: { music: "ambient", hero: "editorial", ambient: ["snow"], ornament: "line", corners: "sharp", eyebrow: "caps", headingCase: "normal", flowers: false },
  celestial: { music: "ambient", hero: "celestial", ambient: ["stars"], ornament: "star", corners: "pill", flowers: false },
  terracotta: { music: "acoustic", hero: "arch", ambient: ["leaves", "bokeh"], ornament: "leaf", corners: "arch", texture: "grain", flowers: true },
  vintage: { music: "romantic", hero: "polaroid", ambient: ["petals"], ornament: "floral", corners: "sharp", texture: "paper", flowers: false },
  whimsical: { music: "musicbox", hero: "garden", ambient: ["butterflies", "confetti", "bokeh"], ornament: "star", corners: "pill", scratchReveal: true },
  // ── Signature collection ──
  velvet: { music: "orchestral", hero: "curtain", curtain: "velvet", ambient: ["gold-dust"], ornament: "deco", corners: "sharp", eyebrow: "caps", flowers: false },
  "secret-garden": { music: "acoustic", hero: "curtain", curtain: "ivy", art: "watercolour-garden", ambient: ["butterflies", "petals"], ornament: "floral", corners: "arch", flowers: false, calendar: true },
  "wax-seal": { music: "romantic", hero: "seal", ambient: ["petals"], ornament: "floral", corners: "rounded", texture: "paper", flowers: false, scratchReveal: true },
  dusk: { music: "ambient", hero: "daynight", ambient: ["stars"], ornament: "star", corners: "pill", headingCase: "normal", flowers: false },
  // ── Celebration collection (birthday / party / social) ──
  "confetti-pop": { music: "musicbox", hero: "polaroid", ambient: ["confetti", "balloons"], ornament: "star", corners: "pill", headingCase: "normal", flowers: false, scratchReveal: true },
  "balloon-bash": { music: "acoustic", hero: "garden", ambient: ["balloons", "confetti", "bokeh"], ornament: "star", corners: "pill", headingCase: "normal", flowers: true },
  "neon-night": { music: "ambient", hero: "editorial", ambient: ["gold-dust", "confetti"], ornament: "line", corners: "sharp", eyebrow: "caps", flowers: false },
  soiree: { music: "romantic", hero: "arch", ambient: ["bokeh", "gold-dust"], ornament: "deco", corners: "arch", flowers: false },
  rosewindow: { music: "orchestral", hero: "stained", ambient: ["bokeh"], ornament: "deco", corners: "arch", flowers: false, scratchReveal: true },
  // ── East Asian collection ──
  "double-happiness": { music: "orchestral", hero: "doors", culture: "chinese", ambient: ["lanterns", "gold-dust"], ornament: "cloud", corners: "sharp", eyebrow: "caps", flowers: false, calendar: true },
  "crimson-keepsake": { music: "romantic", hero: "poster", culture: "vietnamese", ambient: ["petals"], ornament: "floral", corners: "rounded", headingCase: "normal", flowers: false, calendar: true },
  "lantern-night": { music: "ambient", hero: "celestial", culture: "chinese", ambient: ["lanterns"], ornament: "cloud", corners: "pill", headingCase: "normal", flowers: false, calendar: true },
  sakura: { music: "musicbox", hero: "shoji", culture: "japanese", ambient: ["petals"], ornament: "floral", corners: "sharp", texture: "paper", eyebrow: "caps", headingCase: "normal", flowers: false, calendar: true },
  enso: { music: "ambient", hero: "enso", culture: "japanese", ambient: [], ornament: "line", corners: "sharp", texture: "paper", eyebrow: "caps", headingCase: "normal", flowers: false, calendar: true },
  seigaiha: { music: "piano", hero: "enso", culture: "japanese", ambient: ["gold-dust"], ornament: "wave", corners: "sharp", eyebrow: "caps", headingCase: "normal", flowers: false, calendar: true },
  "seoul-studio": { music: "piano", hero: "poster", culture: "korean", ambient: [], ornament: "line", corners: "sharp", eyebrow: "caps", headingCase: "normal", flowers: false, calendar: true },
  hanbok: { music: "acoustic", hero: "bojagi", culture: "korean", ambient: ["petals", "bokeh"], ornament: "cloud", corners: "rounded", texture: "paper", headingCase: "normal", flowers: false, calendar: true },
};

/** Resolves the design language for a template slug. */
export function getInvitationStyle(slug?: string | null): InvitationStyle {
  return { ...BASE, ...(slug ? STYLES[slug] : undefined) };
}

/** Border radius tokens for small elements and large cards. */
export function radii(corners: Corners): { sm: string; lg: string; card: string } {
  switch (corners) {
    case "sharp":
      return { sm: "2px", lg: "2px", card: "2px" };
    case "pill":
      return { sm: "999px", lg: "2.5rem", card: "1.75rem" };
    case "arch":
      return { sm: "999px", lg: "999px 999px 1.5rem 1.5rem", card: "1.25rem" };
    default:
      return { sm: "1rem", lg: "2rem", card: "1.5rem" };
  }
}

/** Human-friendly label for each hero layout (used for filters and badges). */
export const LAYOUT_LABEL: Record<HeroLayout, string> = {
  garden: "Floral",
  arch: "Classic",
  editorial: "Modern",
  split: "Photo",
  celestial: "Night Sky",
  polaroid: "Playful",
  curtain: "Theatrical",
  seal: "Letter",
  daynight: "Cinematic",
  stained: "Heirloom",
  doors: "Lacquer Doors",
  poster: "Photo Poster",
  enso: "Zen",
  shoji: "Shoji",
  bojagi: "Bojagi",
  atelier: "Watercolour",
};

/* ─── Colour schemes ──────────────────────────────────────────────────────── */

export interface ColorScheme {
  id: string;
  name: string;
  colors: { primary: string; secondary: string; accent: string };
}

/** Curated schemes offered on every template preview (in addition to the template's original). */
export const COLOR_SCHEMES: ColorScheme[] = [
  { id: "ivory-gold", name: "Ivory & Gold", colors: { primary: "#B08D57", secondary: "#FBF8F1", accent: "#D9C3A0" } },
  { id: "blush", name: "Blush Rose", colors: { primary: "#C27C88", secondary: "#FFF6F5", accent: "#E8B4B8" } },
  { id: "sage", name: "Sage Garden", colors: { primary: "#6F8F72", secondary: "#F5F7F0", accent: "#C9B79C" } },
  { id: "dusty-blue", name: "Dusty Blue", colors: { primary: "#5B7A99", secondary: "#F4F7FA", accent: "#B7C9D9" } },
  { id: "terracotta", name: "Terracotta", colors: { primary: "#B8613E", secondary: "#FBF3EC", accent: "#E3A87C" } },
  { id: "lavender", name: "Lavender", colors: { primary: "#8A76AE", secondary: "#F8F5FC", accent: "#CBB8E6" } },
  { id: "emerald", name: "Emerald Night", colors: { primary: "#D4B26A", secondary: "#0F2A22", accent: "#6FA88E" } },
  { id: "midnight", name: "Midnight", colors: { primary: "#E2C98F", secondary: "#0E1226", accent: "#8E9AD6" } },
  { id: "noir", name: "Black Tie", colors: { primary: "#E8DCC8", secondary: "#0B0B0B", accent: "#9A8B74" } },
];

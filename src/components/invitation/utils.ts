/**
 * Pure helpers for the cinematic invitation: palette derivation from the
 * template theme, Google Fonts URL, date formatting, and share/calendar links.
 */

import type { ResolvedTheme } from "@/components/templates/types";
import { getInvitationStyle, radii, type InvitationStyle } from "./styles";

/** Shared easing curve (easeOutExpo-like) used across the invitation. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Script font used for flourishes (ampersand, eyebrows). Loaded alongside theme fonts. */
export const SCRIPT_FONT = "Great Vibes";

/** Colour + font tokens every invitation section consumes. */
export interface InvitationPalette {
  isDark: boolean;
  primary: string;
  accent: string;
  background: string;
  /** Slightly offset background for alternating sections. */
  surface: string;
  /** High-contrast body text colour. */
  ink: string;
  /** Muted secondary text colour. */
  inkMuted: string;
  /** Petal colours for flowers/particles. */
  petals: [string, string, string];
  leaf: string;
  displayFont: string;
  bodyFont: string;
  scriptFont: string;
  /** Template design language (layout, ornaments, effects). */
  style: InvitationStyle;
  radius: { sm: string; lg: string; card: string };
}

/** Parses #rgb / #rrggbb into [r, g, b]; falls back to white on invalid input. */
export function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "").trim();
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return [255, 255, 255];
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Returns `rgba()` for a hex colour at the given alpha (0..1). */
export function alpha(hex: string, a: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/** Linear mix of two hex colours; t=0 → a, t=1 → b. */
export function mix(a: string, b: string, t: number): string {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  const out = ca.map((v, i) => Math.round(v + (cb[i] - v) * t));
  return `#${out.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

/** WCAG relative luminance (0 = black, 1 = white). */
export function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Derives readable colour + design tokens from a template theme and its slug. */
export function buildPalette(theme: ResolvedTheme, templateSlug?: string | null): InvitationPalette {
  const style = getInvitationStyle(templateSlug);
  const { primary, secondary, accent } = theme.colors;
  const isDark = luminance(secondary) < 0.25;
  const ink = isDark ? mix(secondary, "#ffffff", 0.88) : mix(secondary, "#1f1a17", 0.86);

  return {
    isDark,
    primary,
    accent,
    background: secondary,
    surface: isDark ? mix(secondary, "#ffffff", 0.05) : mix(secondary, primary, 0.06),
    ink,
    inkMuted: alpha(ink, 0.66),
    petals: [
      mix(primary, "#ffffff", 0.35),
      mix(accent, "#ffffff", 0.45),
      mix(primary, "#f6c6cf", 0.5),
    ],
    leaf: isDark ? mix("#7a9a74", secondary, 0.25) : "#8aa882",
    displayFont: `'${theme.fonts.display}', 'Playfair Display', serif`,
    bodyFont: `'${theme.fonts.body}', 'Lato', sans-serif`,
    scriptFont: `'${SCRIPT_FONT}', cursive`,
    style,
    radius: radii(style.corners),
  };
}

/** Builds a Google Fonts stylesheet URL for the theme fonts + script font. */
export function googleFontsUrl(fonts: ResolvedTheme["fonts"]): string {
  const families = Array.from(new Set([fonts.display, fonts.body, SCRIPT_FONT]))
    .filter((f) => f.length > 0 && f.length <= 60 && !/[<>{}()\[\]"';]/.test(f))
    .map((f) => `family=${encodeURIComponent(f).replace(/%20/g, "+")}`);
  return `https://fonts.googleapis.com/css2?${families.join("&")}&display=swap`;
}

/** Parses a date-only (YYYY-MM-DD) or ISO string without timezone drift. */
export function parseWeddingDate(value: string): Date {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00`) : new Date(value);
}

/** "Saturday, June 15, 2027" — pass locale "vi-VN" for Vietnamese dates. */
export function formatLongDate(value: string, timeZone?: string | null, locale?: string): string {
  const opts: Intl.DateTimeFormatOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  if (timeZone) opts.timeZone = timeZone;
  return parseWeddingDate(value).toLocaleDateString(locale || "en-US", opts);
}

/** "15 · 06 · 2027" */
export function formatDotDate(value: string): string {
  const d = parseWeddingDate(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())} · ${pad(d.getMonth() + 1)} · ${d.getFullYear()}`;
}

/**
 * "3:00 PM" — displayed in the event's timezone so guests always see
 * venue-local time. Without a timezone, the clock time exactly as entered is
 * shown, so guests abroad do not see a shifted hour.
 */
export function formatTime(value: string, timeZone?: string | null, locale: string = "en-US"): string {
  const opts: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit" };
  if (timeZone) return new Date(value).toLocaleTimeString(locale, { ...opts, timeZone });
  const wallClock = /(?:T|\s|^)(\d{1,2}):(\d{2})/.exec(value);
  if (wallClock) {
    const d = new Date(2000, 0, 1, Number(wallClock[1]), Number(wallClock[2]));
    return d.toLocaleTimeString(locale, opts);
  }
  return new Date(value).toLocaleTimeString(locale, opts);
}

/** Google Maps search link for a venue. */
export function mapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Google Calendar "add event" link for an all-day wedding. */
export function calendarUrl(title: string, date: string, location?: string | null): string {
  const d = parseWeddingDate(date);
  const next = new Date(d);
  next.setDate(d.getDate() + 1);
  const fmt = (x: Date) =>
    `${x.getFullYear()}${String(x.getMonth() + 1).padStart(2, "0")}${String(x.getDate()).padStart(2, "0")}`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${fmt(d)}/${fmt(next)}`,
    ...(location ? { location } : {}),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** "2 days ago" / "2 ngày trước" style relative time. */
export function timeAgo(value: string, now: number = Date.now(), locale: string = "en-US"): string {
  const s = Math.max(0, Math.floor((now - new Date(value).getTime()) / 1000));
  if (s < 60) return locale.startsWith("vi") ? "vừa xong" : "just now";
  const units: [number, Intl.RelativeTimeFormatUnit][] = [
    [60 * 60 * 24 * 365, "year"],
    [60 * 60 * 24 * 30, "month"],
    [60 * 60 * 24 * 7, "week"],
    [60 * 60 * 24, "day"],
    [60 * 60, "hour"],
    [60, "minute"],
  ];
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "always" });
  for (const [size, unit] of units) {
    if (s >= size) return rtf.format(-Math.floor(s / size), unit);
  }
  return locale.startsWith("vi") ? "vừa xong" : "just now";
}

/** Deterministic pseudo-random in [0,1) — keeps SSR and client particle layouts identical. */
export function seeded(i: number): number {
  const x = Math.sin(i * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

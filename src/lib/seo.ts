/**
 * Site-wide SEO constants: canonical origin, brand copy and keyword sets.
 * Set NEXT_PUBLIC_SITE_URL in production so canonical URLs, the sitemap and
 * Open Graph images use the real domain.
 */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://dearly-self.vercel.app").replace(/\/$/, "");
export const SITE_NAME = "Dearly";
export const SITE_TAGLINE = "Cinematic wedding & event invitations that become your memory book";
export const SITE_DESCRIPTION =
  "Create animated wedding invitations with RSVP, a personalised guest list, live blessings and a shared photo album — plus birthday, party and social event invitations. Free.";

export const SITE_KEYWORDS = [
  "digital wedding invitation",
  "online wedding invitation",
  "wedding website",
  "wedding RSVP",
  "animated wedding invitation",
  "wedding guest list",
  "wedding photo sharing",
  "birthday invitation online",
  "party invitation online",
  "event RSVP",
  "proposal website",
  "date night invitation",
];

/** Absolute URL for a path on this site. */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

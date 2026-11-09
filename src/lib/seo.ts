/**
 * Site-wide SEO constants: canonical origin, brand copy and keyword sets.
 * Set NEXT_PUBLIC_SITE_URL in production so canonical URLs, the sitemap and
 * Open Graph images use the real domain.
 */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://dearly-self.vercel.app").replace(/\/$/, "");
export const SITE_NAME = "Dearly";
export const SITE_TAGLINE = "Invitations, RSVPs and guest management for every celebration";
export const SITE_DESCRIPTION =
  "Free digital wedding invitations with RSVP, guest management, photo album & blessings wall. 20+ cinematic templates. Create yours in minutes — no app needed.";

export const SITE_KEYWORDS = [
  "digital wedding invitation",
  "online wedding invitation",
  "animated wedding invitation",
  "wedding invitation website",
  "free wedding website",
  "wedding RSVP",
  "online RSVP",
  "wedding guest list",
  "wedding guest management",
  "wedding photo sharing",
  "wedding memory book",
  "birthday invitation online",
  "birthday RSVP",
  "party invitation online",
  "dinner party invitation",
  "engagement invitation",
  "anniversary invitation",
  "baby shower invitation",
  "event invitation",
  "event RSVP",
  "event guest list",
  "event management",
  "proposal website",
  "date night invitation",
  "thiep cuoi online",
  "vietnamese wedding invitation",
];

/** Absolute URL for a path on this site. */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

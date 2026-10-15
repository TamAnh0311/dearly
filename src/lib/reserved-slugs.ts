/**
 * Event slugs live at the site root (`/<slug>`), so they must never shadow
 * an app route. Keep this list in sync with the folders in `src/app`.
 */
const RESERVED = new Set([
  "api", "auth", "c", "q", "cards", "dashboard", "fonts", "invitations", "login",
  "signup", "preview", "pricing", "templates", "sitemap", "robots", "opengraph-image",
  "favicon", "admin", "about", "help", "terms", "privacy", "blog",
]);

/** True when the slug would collide with a built-in Dearly page. */
export function isReservedSlug(slug: string): boolean {
  return RESERVED.has(slug.trim().toLowerCase());
}

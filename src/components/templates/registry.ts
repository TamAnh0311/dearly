/**
 * Template registry — maps template slugs to lazy-loaded component bundles.
 */

import type { TemplateDefinition } from "./types";

const templates: TemplateDefinition[] = [
  { slug: "eternal", name: "Eternal", load: () => import("./eternal").then((m) => m.default) },
  { slug: "bloom", name: "Bloom", load: () => import("./bloom").then((m) => m.default) },
  { slug: "chateau", name: "Chateau", load: () => import("./chateau").then((m) => m.default) },
  { slug: "minimal", name: "Minimal", load: () => import("./minimal").then((m) => m.default) },
  { slug: "rustic", name: "Rustic", load: () => import("./rustic").then((m) => m.default) },
  { slug: "deco", name: "Deco", load: () => import("./deco").then((m) => m.default) },
  { slug: "sunset", name: "Sunset", load: () => import("./sunset").then((m) => m.default) },
  { slug: "noir", name: "Noir", load: () => import("./noir").then((m) => m.default) },
  { slug: "garden", name: "Garden", load: () => import("./garden").then((m) => m.default) },
  { slug: "polaroid", name: "Polaroid", load: () => import("./polaroid").then((m) => m.default) },
  { slug: "glass", name: "Glass", load: () => import("./glass").then((m) => m.default) },
  { slug: "luxe", name: "Luxe", load: () => import("./luxe").then((m) => m.default) },
  { slug: "boho", name: "Boho", load: () => import("./boho").then((m) => m.default) },
  { slug: "seaside", name: "Seaside", load: () => import("./seaside").then((m) => m.default) },
  { slug: "cherry", name: "Cherry Blossom", load: () => import("./cherry").then((m) => m.default) },
  { slug: "vineyard", name: "Vineyard", load: () => import("./vineyard").then((m) => m.default) },
  { slug: "nordic", name: "Nordic", load: () => import("./nordic").then((m) => m.default) },
  { slug: "celestial", name: "Celestial", load: () => import("./celestial").then((m) => m.default) },
  { slug: "terracotta", name: "Terracotta", load: () => import("./terracotta").then((m) => m.default) },
  { slug: "vintage", name: "Vintage", load: () => import("./vintage").then((m) => m.default) },
  { slug: "whimsical", name: "Whimsical", load: () => import("./whimsical").then((m) => m.default) },
  // Signature collection — the invitation page is fully driven by styles.ts; gallery/guestbook
  // views reuse the closest existing template bundle.
  { slug: "velvet", name: "Velvet Curtain", load: () => import("./noir").then((m) => m.default) },
  { slug: "secret-garden", name: "Secret Garden", load: () => import("./garden").then((m) => m.default) },
  { slug: "wax-seal", name: "Wax Seal", load: () => import("./eternal").then((m) => m.default) },
  { slug: "dusk", name: "Dusk till Dawn", load: () => import("./celestial").then((m) => m.default) },
  { slug: "rosewindow", name: "Rose Window", load: () => import("./luxe").then((m) => m.default) },
  // Celebration collection (birthday / party / social events)
  { slug: "confetti-pop", name: "Confetti Pop", load: () => import("./whimsical").then((m) => m.default) },
  { slug: "balloon-bash", name: "Balloon Bash", load: () => import("./whimsical").then((m) => m.default) },
  { slug: "neon-night", name: "Neon Night", load: () => import("./noir").then((m) => m.default) },
  { slug: "soiree", name: "Soirée", load: () => import("./luxe").then((m) => m.default) },
  // East Asian collection (Chinese / Japanese / Korean / Vietnamese)
  { slug: "double-happiness", name: "Double Happiness", load: () => import("./luxe").then((m) => m.default) },
  { slug: "crimson-keepsake", name: "Crimson Keepsake", load: () => import("./eternal").then((m) => m.default) },
  { slug: "lantern-night", name: "Lantern Night", load: () => import("./celestial").then((m) => m.default) },
  { slug: "sakura", name: "Sakura", load: () => import("./cherry").then((m) => m.default) },
  { slug: "enso", name: "Ensō", load: () => import("./minimal").then((m) => m.default) },
  { slug: "seigaiha", name: "Seigaiha", load: () => import("./noir").then((m) => m.default) },
  { slug: "seoul-studio", name: "Seoul Studio", load: () => import("./minimal").then((m) => m.default) },
  { slug: "hanbok", name: "Hanbok", load: () => import("./rustic").then((m) => m.default) },
  // Storybook collection — editorial paper invitations rendered by StorybookInvitation.
  { slug: "atelier-ivory", name: "Atelier Ivory", load: () => import("./bloom").then((m) => m.default) },
  { slug: "ivory-veil", name: "Ivory Veil", load: () => import("./garden").then((m) => m.default) },
  { slug: "lakeside-hydrangea", name: "Lakeside Hydrangea", load: () => import("./seaside").then((m) => m.default) },
  { slug: "peony-letter", name: "Peony Letter", load: () => import("./garden").then((m) => m.default) },
  { slug: "lantern-garden", name: "Lantern Garden", load: () => import("./celestial").then((m) => m.default) },
];

/**
 * Returns the template definition for a given slug.
 */
export function getTemplate(slug: string): TemplateDefinition | undefined {
  return templates.find((t) => t.slug === slug);
}

/**
 * Returns all available template definitions.
 */
export function getAllTemplates(): TemplateDefinition[] {
  return templates;
}

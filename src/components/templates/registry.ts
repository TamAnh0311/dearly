/**
 * Template registry — maps template slugs to lazy-loaded component bundles.
 */

import type { TemplateDefinition } from "./types";

const templates: TemplateDefinition[] = [
  { slug: "eternal", name: "Eternal", load: () => import("./eternal").then((m) => m.default) },
  { slug: "bloom", name: "Bloom", load: () => import("./bloom").then((m) => m.default) },
  { slug: "minimal", name: "Minimal", load: () => import("./minimal").then((m) => m.default) },
  { slug: "rustic", name: "Rustic", load: () => import("./rustic").then((m) => m.default) },
  { slug: "deco", name: "Deco", load: () => import("./deco").then((m) => m.default) },
  { slug: "sunset", name: "Sunset", load: () => import("./sunset").then((m) => m.default) },
  { slug: "noir", name: "Noir", load: () => import("./noir").then((m) => m.default) },
  { slug: "garden", name: "Garden", load: () => import("./garden").then((m) => m.default) },
  { slug: "polaroid", name: "Polaroid", load: () => import("./polaroid").then((m) => m.default) },
  { slug: "glass", name: "Glass", load: () => import("./glass").then((m) => m.default) },
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

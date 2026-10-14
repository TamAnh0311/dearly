/**
 * Template search — matches a free-text query against a template's name,
 * slug, description and its design language (layout label, hero, ambient
 * effects, ornament). Every query word must match (AND), case-insensitive,
 * with simple plural folding ("butterflies" ≈ "butterfly", "stars" ≈ "star").
 */

import { LAYOUT_LABEL, getInvitationStyle } from "@/components/invitation/styles";

export interface SearchableTemplate {
  name: string;
  slug: string;
  description?: string | null;
}

/** Normalises a word: lowercase, strip accents and common plural endings. */
function fold(word: string): string {
  const w = word
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (w.length > 4 && w.endsWith("ies")) return `${w.slice(0, -3)}y`;
  if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss")) return w.slice(0, -1);
  return w;
}

/** Builds the searchable text for one template. */
export function templateHaystack(t: SearchableTemplate): string {
  const style = getInvitationStyle(t.slug);
  const parts = [
    t.name,
    t.slug.replace(/-/g, " "),
    t.description ?? "",
    LAYOUT_LABEL[style.hero],
    style.hero,
    style.ornament,
    ...style.ambient.map((a) => a.replace("-", " ")),
    style.hero === "curtain" ? `${style.curtain} curtain theatre gate` : "",
    style.scratchReveal ? "scratch reveal" : "",
  ];
  return parts
    .join(" ")
    .split(/[^a-z0-9\u00c0-\u024f]+/i)
    .filter(Boolean)
    .map(fold)
    .join(" ");
}

/** Filters templates by query; an empty/whitespace query returns all templates. */
export function searchTemplates<T extends SearchableTemplate>(templates: T[], query: string): T[] {
  const words = query.split(/[^a-z0-9\u00c0-\u024f]+/i).filter(Boolean).map(fold);
  if (words.length === 0) return templates;
  return templates.filter((t) => {
    const hay = templateHaystack(t);
    return words.every((w) => hay.includes(w));
  });
}

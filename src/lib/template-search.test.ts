/**
 * Unit tests for template search.
 */

import { describe, expect, it } from "vitest";
import { searchTemplates, templateHaystack } from "./template-search";

const T = [
  { name: "Velvet Curtain", slug: "velvet", description: "Theatre night with gold dust" },
  { name: "Secret Garden", slug: "secret-garden", description: "Ivy gates swing open" },
  { name: "Bloom", slug: "bloom", description: "Romantic floral" },
  { name: "Celestial", slug: "celestial", description: "Starry night sky" },
  { name: "Minimal", slug: "minimal", description: "Modern clean" },
];

describe("searchTemplates", () => {
  it("returns everything for an empty query", () => {
    expect(searchTemplates(T, "   ")).toHaveLength(T.length);
  });

  it("matches names case-insensitively", () => {
    expect(searchTemplates(T, "VELVET").map((t) => t.slug)).toEqual(["velvet"]);
  });

  it("matches design language words (effects, layout labels)", () => {
    expect(searchTemplates(T, "butterflies").map((t) => t.slug)).toEqual(expect.arrayContaining(["bloom", "secret-garden"]));
    expect(searchTemplates(T, "theatrical").map((t) => t.slug)).toEqual(expect.arrayContaining(["velvet", "secret-garden"]));
    expect(searchTemplates(T, "modern").map((t) => t.slug)).toEqual(["minimal"]);
  });

  it("folds plurals so 'stars' finds star templates", () => {
    expect(searchTemplates(T, "stars").map((t) => t.slug)).toContain("celestial");
  });

  it("requires every word to match", () => {
    expect(searchTemplates(T, "garden ivy").map((t) => t.slug)).toEqual(["secret-garden"]);
    expect(searchTemplates(T, "garden zebra")).toHaveLength(0);
  });

  it("builds a haystack that includes the slug words", () => {
    expect(templateHaystack(T[1])).toContain("secret");
  });
});
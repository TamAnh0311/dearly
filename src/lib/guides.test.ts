/**
 * Unit tests for the Help Center guide data and search helpers.
 */

import { describe, expect, it } from "vitest";
import {
  GUIDES,
  GUIDE_CATEGORIES,
  getGuide,
  guideHaystack,
  guidesInCategory,
  relatedGuides,
  searchGuides,
} from "./guides";

describe("guides data", () => {
  it("has unique slugs and a known category for every guide", () => {
    const slugs = GUIDES.map((g) => g.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    const categories = new Set(GUIDE_CATEGORIES.map((c) => c.id));
    expect(GUIDES.every((g) => categories.has(g.category))).toBe(true);
  });

  it("gives every guide content and a positive read time", () => {
    expect(GUIDES.every((g) => g.sections.length > 0)).toBe(true);
    expect(GUIDES.every((g) => g.minutes > 0)).toBe(true);
  });

  it("returns a guide by slug", () => {
    expect(getGuide("guest-list")?.title).toMatch(/guest list/i);
    expect(getGuide("missing")).toBeUndefined();
  });

  it("filters by category", () => {
    const guests = guidesInCategory("guests");
    expect(guests.length).toBeGreaterThan(0);
    expect(guests.every((g) => g.category === "guests")).toBe(true);
  });
});

describe("searchGuides", () => {
  it("returns every guide for an empty query", () => {
    expect(searchGuides(GUIDES, "   ")).toHaveLength(GUIDES.length);
  });

  it("matches titles case-insensitively", () => {
    expect(searchGuides(GUIDES, "RSVP").map((g) => g.slug)).toContain("rsvps");
  });

  it("folds plurals and accents", () => {
    expect(searchGuides(GUIDES, "photos").map((g) => g.slug)).toContain("photos-and-memories");
    expect(searchGuides(GUIDES, "colours").map((g) => g.slug)).toContain("customise-your-design");
  });

  it("matches keywords and body words", () => {
    expect(searchGuides(GUIDES, "whatsapp").map((g) => g.slug)).toEqual(["publish-and-share"]);
    expect(searchGuides(GUIDES, "runaway").map((g) => g.slug)).toEqual(["ask-cards"]);
  });

  it("requires every word to match", () => {
    expect(searchGuides(GUIDES, "guest link").map((g) => g.slug)).toContain("guest-list");
    expect(searchGuides(GUIDES, "guest zebra")).toHaveLength(0);
  });

  it("builds a haystack that includes section headings", () => {
    const guide = getGuide("guest-list")!;
    expect(guideHaystack(guide)).toContain("paste");
  });
});

describe("relatedGuides", () => {
  it("excludes the current guide and caps the result", () => {
    const guide = getGuide("guest-list")!;
    const related = relatedGuides(guide, 3);
    expect(related).toHaveLength(3);
    expect(related.some((g) => g.slug === guide.slug)).toBe(false);
  });

  it("prefers guides in the same category", () => {
    const guide = getGuide("rsvps")!;
    expect(relatedGuides(guide, 1)[0].category).toBe("guests");
  });
});

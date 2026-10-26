/**
 * Unit tests for the art-kit manifest: every asset path must resolve under
 * /public/art and every collection must carry licence credits.
 */

import { describe, expect, it } from "vitest";
import { ART_COLLECTIONS, getArtCollection } from "./art";

describe("art kit", () => {
  it("resolves a collection by id and returns null for unknown ids", () => {
    expect(getArtCollection("watercolour-garden")?.name).toBe("Watercolour Garden");
    expect(getArtCollection("nope")).toBeNull();
    expect(getArtCollection(null)).toBeNull();
  });

  it("points every asset at a local file with intrinsic dimensions", () => {
    for (const art of Object.values(ART_COLLECTIONS)) {
      const assets = [art.hero, art.heroPortrait, art.venue, ...Object.values(art.sprays)];
      for (const asset of assets) {
        expect(asset.src.startsWith("/art/")).toBe(true);
        expect(asset.src.endsWith(".webp")).toBe(true);
        expect(asset.width).toBeGreaterThan(0);
        expect(asset.height).toBeGreaterThan(0);
      }
      expect(art.hero.blurDataURL).toMatch(/^data:image\/webp;base64,/);
      expect(art.heroPortrait.blurDataURL).toMatch(/^data:image\/webp;base64,/);
    }
  });

  it("credits its sources and licences", () => {
    for (const art of Object.values(ART_COLLECTIONS)) {
      expect(art.credits.length).toBeGreaterThan(0);
      for (const credit of art.credits) {
        expect(credit.title).toBeTruthy();
        expect(credit.license).toBeTruthy();
      }
    }
  });
});

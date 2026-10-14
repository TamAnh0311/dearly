/**
 * Unit tests for invitation section visibility helpers.
 */

import { describe, expect, it } from "vitest";
import { SECTION_TOGGLES, resolveBlessingStyle, resolveSections, sanitizeSections } from "./sections-config";

describe("resolveSections", () => {
  it("treats missing keys (older weddings) as visible", () => {
    const s = resolveSections({ timeline: true, gallery: false, guestbook: true });
    expect(s.gallery).toBe(false);
    expect(s.rsvp).toBe(true);
    expect(s.blessingShower).toBe(true);
  });

  it("handles null/undefined", () => {
    expect(Object.values(resolveSections(null)).every(Boolean)).toBe(true);
  });

  it("covers every toggle key", () => {
    expect(Object.keys(resolveSections(undefined)).sort()).toEqual(SECTION_TOGGLES.map((t) => t.key).sort());
  });
});

describe("sanitizeSections", () => {
  it("keeps only known keys and booleans", () => {
    const s = sanitizeSections({ rsvp: false, evil: "<script>", blessingShower: false });
    expect(s).not.toHaveProperty("evil");
    expect(s?.rsvp).toBe(false);
    expect(s?.blessingShower).toBe(false);
    expect(s?.timeline).toBe(true);
  });

  it("rejects non-objects", () => {
    expect(sanitizeSections("nope")).toBeNull();
    expect(sanitizeSections(null)).toBeNull();
  });
});
describe("resolveBlessingStyle", () => {
  it("defaults to background running text", () => {
    expect(resolveBlessingStyle(undefined)).toBe("marquee");
    expect(resolveBlessingStyle("weird")).toBe("marquee");
  });
  it("keeps the floating style when chosen", () => {
    expect(resolveBlessingStyle("float")).toBe("float");
  });
});
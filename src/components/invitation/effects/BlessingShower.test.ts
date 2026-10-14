/**
 * Unit tests for BlessingShower helpers: carrier motif selection and
 * readable note accent colours.
 */

import { describe, expect, it } from "vitest";
import { carriersFor, marqueeItems, noteAccent } from "./BlessingShower";
import { buildPalette, luminance } from "../utils";

const palette = (slug: string, secondary = "#FFF7EE", primary = "#F2B880") =>
  buildPalette({ colors: { primary, secondary, accent: "#6C5B9E" }, fonts: { display: "Inter", body: "Inter" }, animations: {} }, slug);

/** WCAG contrast ratio between two hex colours. */
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

describe("carriersFor", () => {
  it("uses butterflies and flowers for garden templates", () => {
    expect(carriersFor(palette("bloom"))).toEqual(expect.arrayContaining(["butterfly", "flower"]));
  });
  it("uses stars for night templates and hearts as the fallback", () => {
    expect(carriersFor(palette("dusk"))).toContain("star");
    expect(carriersFor(palette("minimal"))).toEqual(["heart"]);
  });
  it("uses confetti for playful templates", () => {
    expect(carriersFor(palette("polaroid"))).toContain("confetti");
  });
});

describe("noteAccent", () => {
  it("darkens a light accent on a light note so names stay readable", () => {
    const p = palette("dusk");
    expect(contrast(noteAccent(p), p.background)).toBeGreaterThanOrEqual(3);
  });
  it("keeps an accent that already contrasts", () => {
    const p = palette("wax-seal", "#FBF7F0", "#8E2F3A");
    expect(noteAccent(p)).toBe("#8E2F3A");
  });
});
describe("marqueeItems", () => {
  const b = (id: string) => ({ id, wedding_id: "w", guest_name: id, message: "Love", created_at: "2027-01-01T00:00:00Z" });

  it("repeats a few blessings so each running-text row stays full", () => {
    const items = marqueeItems([b("a"), b("b")], 0);
    expect(items.length).toBeGreaterThanOrEqual(6);
    expect(new Set(items.map((i) => i.id))).toEqual(new Set(["a", "b"]));
  });

  it("offsets rows so they don't start with the same blessing", () => {
    const list = [b("a"), b("b"), b("c")];
    expect(marqueeItems(list, 0)[0].id).not.toBe(marqueeItems(list, 1)[0].id);
  });

  it("returns nothing without blessings", () => {
    expect(marqueeItems([], 0)).toEqual([]);
  });
});
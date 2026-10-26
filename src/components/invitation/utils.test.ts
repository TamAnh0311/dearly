/**
 * Unit tests for invitation colour/date helpers and template design styles.
 */

import { describe, expect, it } from "vitest";
import {
  alpha,
  buildPalette,
  calendarUrl,
  formatDotDate,
  formatTime,
  googleFontsUrl,
  hexToRgb,
  luminance,
  mapsUrl,
  mix,
  parseWeddingDate,
  seeded,
  timeAgo,
} from "./utils";
import { COLOR_SCHEMES, getInvitationStyle, radii } from "./styles";
import type { ResolvedTheme } from "@/components/templates/types";

const theme = (secondary: string): ResolvedTheme => ({
  colors: { primary: "#B8860B", secondary, accent: "#D4A574" },
  fonts: { display: "Playfair Display", body: "Lato" },
  animations: {},
});

describe("colour helpers", () => {
  it("parses short and long hex, falls back to white on garbage", () => {
    expect(hexToRgb("#fff")).toEqual([255, 255, 255]);
    expect(hexToRgb("#B8860B")).toEqual([184, 134, 11]);
    expect(hexToRgb("not-a-colour")).toEqual([255, 255, 255]);
  });

  it("builds rgba strings and mixes colours", () => {
    expect(alpha("#000000", 0.5)).toBe("rgba(0, 0, 0, 0.5)");
    expect(mix("#000000", "#ffffff", 0.5)).toBe("#808080");
    expect(mix("#123456", "#abcdef", 0)).toBe("#123456");
  });

  it("computes luminance at the extremes", () => {
    expect(luminance("#000000")).toBe(0);
    expect(luminance("#ffffff")).toBeCloseTo(1);
  });
});

describe("buildPalette", () => {
  it("detects dark backgrounds and picks light ink", () => {
    const p = buildPalette(theme("#0D0D0D"), "noir");
    expect(p.isDark).toBe(true);
    expect(luminance(p.ink)).toBeGreaterThan(0.6);
  });

  it("uses dark ink on light backgrounds", () => {
    const p = buildPalette(theme("#FFFFF0"), "eternal");
    expect(p.isDark).toBe(false);
    expect(luminance(p.ink)).toBeLessThan(0.1);
  });

  it("attaches the template design language and radius tokens", () => {
    const p = buildPalette(theme("#FFFFFF"), "minimal");
    expect(p.style.hero).toBe("editorial");
    expect(p.radius.card).toBe("2px");
  });

  it("applies a template body-font override and loads it", () => {
    const p = buildPalette(theme("#FFF5F5"), "bloom");
    expect(p.style.art).toBe("watercolour-garden");
    expect(p.bodyFont).toContain("Jost");
    expect(googleFontsUrl(theme("#FFF5F5").fonts, [p.style.bodyFont])).toContain("family=Jost");
  });
});

describe("design styles", () => {
  it("gives templates distinct hero layouts", () => {
    expect(getInvitationStyle("bloom").hero).toBe("atelier");
    expect(getInvitationStyle("eternal").hero).toBe("arch");
    expect(getInvitationStyle("celestial").hero).toBe("celestial");
    expect(getInvitationStyle("polaroid").hero).toBe("polaroid");
    expect(getInvitationStyle("sunset").hero).toBe("split");
  });

  it("maps the signature collection to its theatrical heroes", () => {
    expect(getInvitationStyle("velvet")).toMatchObject({ hero: "curtain", curtain: "velvet" });
    expect(getInvitationStyle("secret-garden")).toMatchObject({ hero: "curtain", curtain: "ivy" });
    expect(getInvitationStyle("wax-seal")).toMatchObject({ hero: "seal", scratchReveal: true });
    expect(getInvitationStyle("dusk").hero).toBe("daynight");
    expect(getInvitationStyle("rosewindow").hero).toBe("stained");
    expect(getInvitationStyle("bloom").scratchReveal).toBe(false);
  });

  it("maps the East Asian collection to its heroes, culture and calendar", () => {
    expect(getInvitationStyle("double-happiness")).toMatchObject({ hero: "doors", culture: "chinese", calendar: true });
    expect(getInvitationStyle("crimson-keepsake")).toMatchObject({ hero: "poster", culture: "vietnamese" });
    expect(getInvitationStyle("seoul-studio")).toMatchObject({ hero: "poster", culture: "korean" });
    expect(getInvitationStyle("sakura")).toMatchObject({ hero: "shoji", culture: "japanese" });
    expect(getInvitationStyle("enso").hero).toBe("enso");
    expect(getInvitationStyle("seigaiha")).toMatchObject({ hero: "enso", ornament: "wave" });
    expect(getInvitationStyle("hanbok")).toMatchObject({ hero: "bojagi", ornament: "cloud" });
    expect(getInvitationStyle("lantern-night").ambient).toContain("lanterns");
    expect(getInvitationStyle("bloom").calendar).toBe(false);
  });

  it("falls back to the garden layout for unknown or missing slugs", () => {
    expect(getInvitationStyle("does-not-exist").hero).toBe("garden");
    expect(getInvitationStyle(null).hero).toBe("garden");
  });

  it("returns radius tokens for every corner style", () => {
    for (const c of ["rounded", "sharp", "pill", "arch"] as const) {
      const r = radii(c);
      expect(r.sm && r.lg && r.card).toBeTruthy();
    }
  });

  it("has unique colour scheme ids with valid hex colours", () => {
    const ids = COLOR_SCHEMES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of COLOR_SCHEMES) {
      for (const c of Object.values(s.colors)) expect(c).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });
});

describe("dates & links", () => {
  it("parses date-only strings in local time (no off-by-one day)", () => {
    const d = parseWeddingDate("2027-06-15");
    expect(d.getDate()).toBe(15);
    expect(d.getMonth()).toBe(5);
    expect(formatDotDate("2027-06-15")).toBe("15 · 06 · 2027");
  });

  it("builds an all-day Google Calendar link", () => {
    const url = new URL(calendarUrl("E & J", "2027-06-15", "Grand Estate"));
    expect(url.searchParams.get("dates")).toBe("20270615/20270616");
    expect(url.searchParams.get("text")).toBe("E & J");
    expect(url.searchParams.get("location")).toBe("Grand Estate");
  });

  it("encodes map queries", () => {
    expect(mapsUrl("A & B, Paris")).toContain("query=A%20%26%20B%2C%20Paris");
  });

  it("shows the entered wall-clock time when no timezone is set", () => {
    expect(formatTime("2026-11-16T17:00:00+00:00", null, "vi-VN")).toBe("17:00");
    expect(formatTime("2026-11-16T17:00:00+00:00", undefined, "en-US")).toContain("5:00");
  });

  it("converts to the venue timezone when one is set", () => {
    expect(formatTime("2026-11-16T10:00:00Z", "Asia/Ho_Chi_Minh", "vi-VN")).toBe("17:00");
  });

  it("formats relative time", () => {
    const now = Date.parse("2027-01-10T12:00:00Z");
    expect(timeAgo("2027-01-10T11:59:30Z", now)).toBe("just now");
    expect(timeAgo("2027-01-10T10:00:00Z", now)).toBe("2 hours ago");
    expect(timeAgo("2027-01-09T12:00:00Z", now)).toBe("1 day ago");
  });
});

describe("misc", () => {
  it("builds a Google Fonts URL and drops unsafe family names", () => {
    const url = googleFontsUrl({ display: "Cormorant Garamond", body: "x<script>" }, ["Jost"]);
    expect(url).toContain("family=Cormorant+Garamond");
    expect(url).toContain("family=Great+Vibes");
    expect(url).toContain("family=Jost");
    expect(url).not.toContain("script");
  });

  it("seeded() is deterministic and in [0,1)", () => {
    expect(seeded(3)).toBe(seeded(3));
    for (let i = 0; i < 50; i++) {
      const v = seeded(i);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

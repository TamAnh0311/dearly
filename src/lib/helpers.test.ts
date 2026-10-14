/**
 * Unit tests for the in-memory rate limiter and pending-design storage.
 */

import { afterEach, describe, expect, it, vi } from "vitest";
import { checkRateLimit } from "./rate-limit";
import { capturePendingDesign, clearPendingDesign, readPendingDesign, schemeColors } from "./pending-design";

/** Minimal in-memory Storage for tests. */
function memoryStorage(): Storage {
  const m = new Map<string, string>();
  return {
    get length() {
      return m.size;
    },
    clear: () => m.clear(),
    getItem: (k) => m.get(k) ?? null,
    key: (i) => Array.from(m.keys())[i] ?? null,
    removeItem: (k) => void m.delete(k),
    setItem: (k, v) => void m.set(k, String(v)),
  };
}

describe("checkRateLimit", () => {
  afterEach(() => vi.useRealTimers());

  it("allows up to the limit, then reports a wait, then recovers", () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    const key = `test-${Math.random()}`;
    expect(checkRateLimit(key, 2, 10_000)).toBe(0);
    expect(checkRateLimit(key, 2, 10_000)).toBe(0);
    expect(checkRateLimit(key, 2, 10_000)).toBe(10);
    vi.setSystemTime(10_001);
    expect(checkRateLimit(key, 2, 10_000)).toBe(0);
  });

  it("tracks keys independently", () => {
    const a = `a-${Math.random()}`;
    const b = `b-${Math.random()}`;
    expect(checkRateLimit(a, 1, 60_000)).toBe(0);
    expect(checkRateLimit(a, 1, 60_000)).toBeGreaterThan(0);
    expect(checkRateLimit(b, 1, 60_000)).toBe(0);
  });
});

describe("pending design", () => {
  it("captures valid template + scheme and reads it back", () => {
    const s = memoryStorage();
    capturePendingDesign("?template=bloom&scheme=sage", s);
    expect(readPendingDesign(s)).toMatchObject({ template: "bloom", scheme: "sage" });
    clearPendingDesign(s);
    expect(readPendingDesign(s)).toBeNull();
  });

  it("rejects malformed slugs", () => {
    const s = memoryStorage();
    expect(capturePendingDesign("?template=<script>", s)).toBeNull();
    expect(readPendingDesign(s)).toBeNull();
    capturePendingDesign("?template=bloom&scheme=../../x", s);
    expect(readPendingDesign(s)?.scheme).toBeNull();
  });

  it("expires after 7 days and tolerates corrupt JSON", () => {
    const s = memoryStorage();
    capturePendingDesign("?template=noir", s);
    expect(readPendingDesign(s, Date.now() + 8 * 24 * 3600 * 1000)).toBeNull();
    s.setItem("dearly-pending-design", "{not json");
    expect(readPendingDesign(s)).toBeNull();
  });

  it("maps scheme ids to colours ('original' keeps template defaults)", () => {
    expect(schemeColors("original")).toBeNull();
    expect(schemeColors(null)).toBeNull();
    expect(schemeColors("unknown")).toBeNull();
    expect(schemeColors("sage")?.primary).toMatch(/^#/);
  });
});

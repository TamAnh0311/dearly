/**
 * Unit tests for the Supabase-backed rate limiter and pending-design storage.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { capturePendingDesign, clearPendingDesign, readPendingDesign, schemeColors } from "./pending-design";

/* ─── Supabase mock for the rate limiter ─────────────────────────────────── */

const mockRpc = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createServiceRoleClient: () => ({ rpc: mockRpc }),
}));

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
  let checkRateLimit: typeof import("./rate-limit").checkRateLimit;

  beforeEach(async () => {
    mockRpc.mockReset();
    ({ checkRateLimit } = await import("./rate-limit"));
  });
  afterEach(() => vi.restoreAllMocks());

  it("returns 0 when the RPC allows the request", async () => {
    mockRpc.mockResolvedValueOnce({ data: 0, error: null });
    expect(await checkRateLimit("test-key", 3, 10_000)).toBe(0);
    expect(mockRpc).toHaveBeenCalledWith("check_rate_limit", {
      p_key: "test-key",
      p_limit: 3,
      p_window_ms: 10_000,
    });
  });

  it("returns wait seconds when rate limited", async () => {
    mockRpc.mockResolvedValueOnce({ data: 42, error: null });
    expect(await checkRateLimit("test-key", 3, 10_000)).toBe(42);
  });

  it("fails open on RPC error", async () => {
    mockRpc.mockResolvedValueOnce({ data: null, error: { code: "42P01", message: "relation not found" } });
    expect(await checkRateLimit("test-key", 3, 10_000)).toBe(0);
  });

  it("fails open on thrown error", async () => {
    mockRpc.mockRejectedValueOnce(new Error("connection refused"));
    expect(await checkRateLimit("test-key", 3, 10_000)).toBe(0);
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

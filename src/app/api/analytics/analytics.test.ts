/**
 * Tests for the analytics tracking endpoint.
 * Mocks Supabase, rate-limit, and geo dependencies — no network calls.
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

/* ─── Shared state ────────────────────────────────────────────────────────── */

const state = {
  existingEvent: null as Record<string, unknown> | null,
  insertError: null as { message: string; code?: string } | null,
  inserts: [] as Record<string, unknown>[],
};

/* ─── Supabase mock ───────────────────────────────────────────────────────── */

function makeQueryBuilder(tableName: string) {
  const builder = {
    select: () => builder,
    eq: () => builder,
    gte: () => builder,
    limit: () => builder,
    maybeSingle: async () => ({ data: state.existingEvent, error: null }),
    insert: (row: Record<string, unknown>) => {
      state.inserts.push({ _table: tableName, ...row });
      return Promise.resolve({ error: state.insertError });
    },
  };

  return builder;
}

vi.mock("@/lib/supabase/server", () => ({
  createServiceRoleClient: () => ({
    from: (name: string) => makeQueryBuilder(name),
  }),
}));

/* ─── Rate-limit mock ─────────────────────────────────────────────────────── */

vi.mock("@/lib/rate-limit", () => ({
  clientIp: (_req: NextRequest) => "203.0.113.1",
}));

/* ─── Geo mock ────────────────────────────────────────────────────────────── */

vi.mock("@/lib/geo", () => ({
  hashIp: (ip: string) => `hash-${ip}`,
  lookupGeo: async () => ({ country: "AU", city: "Sydney" }),
}));

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

const WEDDING = "11111111-1111-4111-8111-111111111111";

function post(body: unknown) {
  return new NextRequest("http://x/api/analytics/track", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  state.existingEvent = null;
  state.insertError = null;
  state.inserts = [];
  vi.spyOn(console, "info").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

/* ─── Tests ───────────────────────────────────────────────────────────────── */

describe("POST /api/analytics/track", async () => {
  const { POST } = await import("./track/route");

  it("returns 400 for an invalid event type", async () => {
    const res = await POST(post({ weddingId: WEDDING, eventType: "invalid_event" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBeTruthy();
  });

  it("returns 400 for a missing weddingId", async () => {
    const res = await POST(post({ eventType: "page_view" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for a non-UUID weddingId", async () => {
    const res = await POST(post({ weddingId: "not-a-uuid", eventType: "page_view" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid JSON", async () => {
    const req = new NextRequest("http://x/api/analytics/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{bad json",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("inserts a valid event and returns 201", async () => {
    const res = await POST(post({ weddingId: WEDDING, eventType: "page_view", metadata: { ref: "twitter" } }));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.recorded).toBe(true);

    expect(state.inserts).toHaveLength(1);
    const row = state.inserts[0];
    expect(row.wedding_id).toBe(WEDDING);
    expect(row.event).toBe("page_view");
    expect(row.ip_hash).toBe("hash-203.0.113.1");
    expect(row.country).toBe("AU");
    expect(row.city).toBe("Sydney");
    expect(row.properties).toEqual({ ref: "twitter" });
  });

  it("stores guest_token when provided", async () => {
    const res = await POST(
      post({ weddingId: WEDDING, eventType: "rsvp_submitted", guestToken: "token-abc" })
    );
    expect(res.status).toBe(201);
    expect(state.inserts[0].guest_token).toBe("token-abc");
  });

  it("stores null guest_token when omitted", async () => {
    const res = await POST(post({ weddingId: WEDDING, eventType: "blessing_sent" }));
    expect(res.status).toBe(201);
    expect(state.inserts[0].guest_token).toBeNull();
  });

  it("returns 200 and skips insert when event is a duplicate", async () => {
    state.existingEvent = { id: 99 };
    const res = await POST(post({ weddingId: WEDDING, eventType: "page_view" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.deduplicated).toBe(true);
    expect(state.inserts).toHaveLength(0);
  });

  it("returns 500 when the insert fails", async () => {
    state.insertError = { message: "DB error", code: "XX000" };
    const res = await POST(post({ weddingId: WEDDING, eventType: "reaction_sent" }));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBeTruthy();
  });
});

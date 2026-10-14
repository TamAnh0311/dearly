/**
 * Integration-style tests for the RSVP and reactions API routes with a
 * mocked Supabase service client (no network).
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

/* ─── Supabase mock ───────────────────────────────────────────────────────── */

const state = {
  published: true,
  inserts: [] as { table: string; row: Record<string, unknown> }[],
  rpcError: null as { message: string; code?: string } | null,
};

/** Chainable query builder that records inserts and resolves wedding lookups. */
function table(name: string) {
  const q = {
    select: () => q,
    eq: () => q,
    maybeSingle: async () => ({ data: state.published ? { id: "w" } : null, error: null }),
    single: async () => ({ data: { id: "entry-1", ...state.inserts.at(-1)?.row }, error: null }),
    insert: (row: Record<string, unknown>) => {
      state.inserts.push({ table: name, row });
      return Object.assign(Promise.resolve({ error: null }), q);
    },
  };
  return q;
}

vi.mock("@/lib/supabase/server", () => ({
  createServiceRoleClient: () => ({
    from: (name: string) => table(name),
    rpc: async () => (state.rpcError ? { data: null, error: state.rpcError } : { data: 42, error: null }),
  }),
}));

const WEDDING = "11111111-1111-4111-8111-111111111111";
let ipCounter = 0;

/** Builds a POST request with a unique client IP (so rate limits don't bleed between tests). */
function post(url: string, body: unknown) {
  return new NextRequest(url, {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": `10.0.0.${++ipCounter}` },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

beforeEach(() => {
  state.published = true;
  state.inserts = [];
  state.rpcError = null;
  vi.spyOn(console, "info").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

/* ─── RSVP ────────────────────────────────────────────────────────────────── */

describe("POST /api/rsvp", async () => {
  const { POST } = await import("./rsvp/route");

  it("rejects invalid JSON and invalid payloads", async () => {
    expect((await POST(post("http://x/api/rsvp", "{oops"))).status).toBe(400);
    expect((await POST(post("http://x/api/rsvp", { weddingId: "nope", guestName: "A", attending: true }))).status).toBe(400);
    const blank = await POST(post("http://x/api/rsvp", { weddingId: WEDDING, guestName: "   ", attending: true }));
    expect(blank.status).toBe(400);
    expect((await blank.json()).error).toMatch(/name/i);
  });

  it("returns 404 for unpublished weddings", async () => {
    state.published = false;
    const res = await POST(post("http://x/api/rsvp", { weddingId: WEDDING, guestName: "Ann", attending: true }));
    expect(res.status).toBe(404);
  });

  it("records an RSVP and publishes the blessing with rsvp_status", async () => {
    const res = await POST(
      post("http://x/api/rsvp", { weddingId: WEDDING, guestName: " Ann ", attending: false, message: "Love you both" })
    );
    expect(res.status).toBe(201);
    const rsvp = state.inserts.find((i) => i.table === "rsvps")!.row;
    expect(rsvp).toMatchObject({ guest_name: "Ann", attending: false, party_size: 0, message: "Love you both" });
    const blessing = state.inserts.find((i) => i.table === "guestbook_entries")!.row;
    expect(blessing).toMatchObject({ rsvp_status: "declined", message: "Love you both" });
  });

  it("does not create a blessing when there is no message", async () => {
    const res = await POST(post("http://x/api/rsvp", { weddingId: WEDDING, guestName: "Bo", attending: true, partySize: 3 }));
    expect(res.status).toBe(201);
    expect((await res.json()).blessing).toBeNull();
    expect(state.inserts.map((i) => i.table)).toEqual(["rsvps"]);
    expect(state.inserts[0].row.party_size).toBe(3);
  });

  it("rate-limits repeated submissions from the same IP", async () => {
    const headers = { "content-type": "application/json", "x-forwarded-for": "9.9.9.9" };
    const body = JSON.stringify({ weddingId: WEDDING, guestName: "Cy", attending: true });
    const send = () => POST(new NextRequest("http://x/api/rsvp", { method: "POST", headers, body }));
    for (let i = 0; i < 3; i++) expect((await send()).status).toBe(201);
    expect((await send()).status).toBe(429);
  });
});

/* ─── Reactions ───────────────────────────────────────────────────────────── */

describe("POST /api/reactions", async () => {
  const { POST } = await import("./reactions/route");

  it("validates kind and amount", async () => {
    expect((await POST(post("http://x/api/reactions", { weddingId: WEDDING, kind: "hate", amount: 1 }))).status).toBe(400);
    expect((await POST(post("http://x/api/reactions", { weddingId: WEDDING, kind: "love", amount: 0 }))).status).toBe(400);
    expect((await POST(post("http://x/api/reactions", { weddingId: WEDDING, kind: "love", amount: 21 }))).status).toBe(400);
  });

  it("returns the new count on success", async () => {
    const res = await POST(post("http://x/api/reactions", { weddingId: WEDDING, kind: "bloom", amount: 5 }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ count: 42 });
  });

  it("maps the DB guard to 404 and other failures to 500", async () => {
    state.rpcError = { message: "wedding not found" };
    expect((await POST(post("http://x/api/reactions", { weddingId: WEDDING, kind: "love", amount: 1 }))).status).toBe(404);
    state.rpcError = { message: "boom", code: "XX000" };
    expect((await POST(post("http://x/api/reactions", { weddingId: WEDDING, kind: "love", amount: 1 }))).status).toBe(500);
  });
});

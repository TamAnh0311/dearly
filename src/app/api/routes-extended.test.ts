/**
 * Integration tests for guestbook, photo upload, questions/answer, and
 * billing/checkout API routes with a mocked Supabase service client.
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

/* ─── Shared mock state ──────────────────────────────────────────────────── */

const state = {
  published: true,
  guestUploadsEnabled: true,
  userId: "owner-1",
  inserts: [] as { table: string; row: Record<string, unknown> }[],
  updates: [] as { table: string; row: Record<string, unknown> }[],
  photoCount: 0,
  uploadError: null as { message: string } | null,
};

/** Chainable query builder for the mock Supabase client. */
function table(name: string) {
  const q: Record<string, unknown> = {
    select: () => q,
    eq: () => q,
    neq: () => q,
    maybeSingle: async () => ({
      data: state.published
        ? {
            id: "w",
            user_id: state.userId,
            is_published: state.published,
            guest_uploads_enabled: state.guestUploadsEnabled,
            plan: "free",
            plan_expires_at: null,
          }
        : null,
      error: null,
      count: state.photoCount,
    }),
    single: async () => ({
      data: {
        id: "entry-1",
        ...(state.inserts.at(-1)?.row ?? state.updates.at(-1)?.row),
      },
      error: null,
    }),
    insert: (row: Record<string, unknown>) => {
      state.inserts.push({ table: name, row });
      return Object.assign(Promise.resolve({ error: null }), q);
    },
    update: (row: Record<string, unknown>) => {
      state.updates.push({ table: name, row });
      return q;
    },
  };
  return q;
}

/** Mock storage bucket. */
function mockStorage() {
  return {
    from: () => ({
      upload: async () =>
        state.uploadError
          ? { error: state.uploadError }
          : { error: null },
      getPublicUrl: () => ({
        data: { publicUrl: "https://storage.example.com/test.jpg" },
      }),
    }),
  };
}

vi.mock("@/lib/supabase/server", () => ({
  createServiceRoleClient: () => ({
    from: (name: string) => table(name),
    storage: mockStorage(),
  }),
  createCookieClient: () => ({
    auth: {
      getUser: async () => ({
        data: { user: { id: state.userId } },
      }),
    },
  }),
}));

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: () => 0,
  clientIp: () => "127.0.0.1",
}));

const WEDDING = "11111111-1111-4111-8111-111111111111";
let ipCounter = 0;

/** Builds a POST request with JSON body and a unique IP. */
function post(url: string, body: unknown) {
  return new NextRequest(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": `10.0.0.${++ipCounter}`,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

/** Builds a POST request with FormData (for file uploads). */
function postForm(url: string, formData: FormData) {
  return new NextRequest(url, {
    method: "POST",
    headers: { "x-forwarded-for": `10.0.0.${++ipCounter}` },
    body: formData,
  });
}

/** Creates a mock File for upload tests. */
function fakeFile(name: string, sizeBytes = 1024, type = "image/jpeg"): File {
  const buffer = new Uint8Array(sizeBytes);
  return new File([buffer], name, { type });
}

beforeEach(() => {
  state.published = true;
  state.guestUploadsEnabled = true;
  state.userId = "owner-1";
  state.inserts = [];
  state.updates = [];
  state.photoCount = 0;
  state.uploadError = null;
  vi.spyOn(console, "info").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

/* ─── Guestbook ──────────────────────────────────────────────────────────── */

describe("POST /api/guestbook", async () => {
  const { POST } = await import("./guestbook/route");

  it("rejects requests with missing required fields", async () => {
    const res = await POST(post("http://x/api/guestbook", { weddingId: WEDDING }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/missing/i);
  });

  it("rejects guest name longer than 100 characters", async () => {
    const res = await POST(
      post("http://x/api/guestbook", {
        weddingId: WEDDING,
        guestName: "A".repeat(101),
        message: "Hello",
      })
    );
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/name.*long/i);
  });

  it("rejects message longer than 1000 characters", async () => {
    const res = await POST(
      post("http://x/api/guestbook", {
        weddingId: WEDDING,
        guestName: "Ann",
        message: "X".repeat(1001),
      })
    );
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/message.*long/i);
  });

  it("creates an entry and returns 201 on success", async () => {
    const res = await POST(
      post("http://x/api/guestbook", {
        weddingId: WEDDING,
        guestName: "Linh",
        message: "Chúc mừng hạnh phúc!",
      })
    );
    expect(res.status).toBe(201);
    const row = state.inserts.find((i) => i.table === "guestbook_entries")!.row;
    expect(row).toMatchObject({
      wedding_id: WEDDING,
      guest_name: "Linh",
      message: "Chúc mừng hạnh phúc!",
    });
  });

  it("accepts CJK characters in guest names and messages", async () => {
    const res = await POST(
      post("http://x/api/guestbook", {
        weddingId: WEDDING,
        guestName: "田中太郎",
        message: "おめでとうございます！末永くお幸せに。",
      })
    );
    expect(res.status).toBe(201);
    const row = state.inserts.find((i) => i.table === "guestbook_entries")!.row;
    expect(row.guest_name).toBe("田中太郎");
  });
});

/* ─── Photo Upload ───────────────────────────────────────────────────────── */

describe("POST /api/photos/upload", async () => {
  const { POST } = await import("./photos/upload/route");

  it("rejects missing or invalid weddingId", async () => {
    const form = new FormData();
    form.append("weddingId", "not-a-uuid");
    form.append("photos", fakeFile("test.jpg"));
    const res = await POST(postForm("http://x/api/photos/upload", form));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/invalid/i);
  });

  it("rejects when no photos are provided", async () => {
    const form = new FormData();
    form.append("weddingId", WEDDING);
    const res = await POST(postForm("http://x/api/photos/upload", form));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/no photos/i);
  });

  it("rejects unsupported file types", async () => {
    const form = new FormData();
    form.append("weddingId", WEDDING);
    form.append("photos", fakeFile("doc.pdf", 1024, "application/pdf"));
    const res = await POST(postForm("http://x/api/photos/upload", form));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/unsupported/i);
  });

  it("rejects files larger than 10 MB", async () => {
    const form = new FormData();
    form.append("weddingId", WEDDING);
    form.append("photos", fakeFile("huge.jpg", 11 * 1024 * 1024));
    const res = await POST(postForm("http://x/api/photos/upload", form));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/larger than 10 MB/i);
  });

  it("rejects more than 10 files per request", async () => {
    const form = new FormData();
    form.append("weddingId", WEDDING);
    for (let i = 0; i < 11; i++) form.append("photos", fakeFile(`img${i}.jpg`));
    const res = await POST(postForm("http://x/api/photos/upload", form));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/up to 10/i);
  });

  it("returns 404 when wedding does not exist", async () => {
    state.published = false;
    const form = new FormData();
    form.append("weddingId", WEDDING);
    form.append("photos", fakeFile("test.jpg"));
    const res = await POST(postForm("http://x/api/photos/upload", form));
    expect(res.status).toBe(404);
  });

  it("uploads photos successfully for the event owner", async () => {
    const form = new FormData();
    form.append("weddingId", WEDDING);
    form.append("photos", fakeFile("photo1.jpg"));
    form.append("photos", fakeFile("photo2.png", 2048, "image/png"));
    const res = await POST(postForm("http://x/api/photos/upload", form));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.photos).toHaveLength(2);
    const rows = state.inserts.filter((i) => i.table === "gallery_photos");
    expect(rows).toHaveLength(2);
    expect(rows[0].row.uploaded_by).toBe("couple");
    expect(rows[0].row.status).toBe("approved");
  });

  it("accepts guest uploads with pending status", async () => {
    const form = new FormData();
    form.append("weddingId", WEDDING);
    form.append("guestName", "小紅");
    form.append("photos", fakeFile("guest.jpg"));
    const res = await POST(postForm("http://x/api/photos/upload", form));
    expect(res.status).toBe(201);
    const row = state.inserts.find((i) => i.table === "gallery_photos")!.row;
    expect(row.uploaded_by).toBe("guest");
    expect(row.status).toBe("pending");
    expect(row.guest_name).toBe("小紅");
  });

  it("rejects guest uploads when guest_uploads_enabled is false", async () => {
    state.guestUploadsEnabled = false;
    const form = new FormData();
    form.append("weddingId", WEDDING);
    form.append("guestName", "Guest");
    form.append("photos", fakeFile("test.jpg"));
    const res = await POST(postForm("http://x/api/photos/upload", form));
    expect(res.status).toBe(403);
  });

  it("returns 500 when storage upload fails", async () => {
    state.uploadError = { message: "Storage error" };
    const form = new FormData();
    form.append("weddingId", WEDDING);
    form.append("photos", fakeFile("test.jpg"));
    const res = await POST(postForm("http://x/api/photos/upload", form));
    expect(res.status).toBe(500);
    expect((await res.json()).error).toMatch(/upload failed/i);
  });
});

/* ─── Questions Answer ───────────────────────────────────────────────────── */

describe("POST /api/questions/answer", async () => {
  const { POST } = await import("./questions/answer/route");

  it("rejects invalid JSON", async () => {
    const res = await POST(post("http://x/api/questions/answer", "{bad"));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/invalid json/i);
  });

  it("rejects missing questionId", async () => {
    const res = await POST(post("http://x/api/questions/answer", {}));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/questionId/i);
  });

  it("rejects non-string questionId", async () => {
    const res = await POST(
      post("http://x/api/questions/answer", { questionId: 123 })
    );
    expect(res.status).toBe(400);
  });

  it("marks a question as answered", async () => {
    const res = await POST(
      post("http://x/api/questions/answer", { questionId: "q-1" })
    );
    expect(res.status).toBe(200);
    const update = state.updates.find((u) => u.table === "cute_questions")!.row;
    expect(update.answered).toBe(true);
    expect(update.answered_at).toBeDefined();
  });
});

/* ─── Billing Checkout ───────────────────────────────────────────────────── */

describe("POST /api/billing/checkout", async () => {
  const { POST } = await import("./billing/checkout/route");

  it("rejects invalid JSON", async () => {
    const res = await POST(post("http://x/api/billing/checkout", "{bad"));
    expect(res.status).toBe(400);
  });

  it("rejects an unknown plan", async () => {
    const res = await POST(
      post("http://x/api/billing/checkout", { plan: "super-mega" })
    );
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/unknown plan/i);
  });

  it("returns 501 with early-access message for valid plans", async () => {
    for (const plan of ["premium", "forever"]) {
      const res = await POST(
        post("http://x/api/billing/checkout", { plan })
      );
      expect(res.status).toBe(501);
      const body = await res.json();
      expect(body.code).toBe("BILLING_NOT_CONFIGURED");
      expect(body.error).toMatch(/coming soon|free/i);
    }
  });

  it("accepts optional eventId when it is a valid UUID", async () => {
    const res = await POST(
      post("http://x/api/billing/checkout", { plan: "premium", eventId: WEDDING })
    );
    expect(res.status).toBe(501);
  });

  it("rejects eventId when it is not a valid UUID", async () => {
    const res = await POST(
      post("http://x/api/billing/checkout", { plan: "premium", eventId: "not-uuid" })
    );
    expect(res.status).toBe(400);
  });
});

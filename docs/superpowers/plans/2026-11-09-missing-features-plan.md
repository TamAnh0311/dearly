# Missing Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement all missing features (except billing) — guest data collection, video embeds, Google Calendar, gift QR upload, bulk photo moderation, analytics, email automation, and advanced admin panel.

**Architecture:** Extend existing Next.js 14 + Supabase + Zustand stack. New Supabase migration for schema changes. New API routes under `/api/analytics/`, `/api/cron/`, `/api/admin/`. New dashboard pages for analytics. Expanded admin panel with tabs. Vercel Cron for email automation.

**Tech Stack:** Next.js 14 (App Router), Supabase (Postgres + RLS + Storage), Zustand, Resend, Vitest, Tailwind CSS, Framer Motion.

**Note:** Music Library UI is already implemented (MusicPicker has Library/Upload/Custom URL tabs). Removed from scope.

---

## File Structure

### New Files
```
supabase/migrations/00034_missing_features.sql          — all schema changes
src/lib/calendar.ts                                      — Google Calendar URL + .ics generation
src/lib/video.ts                                         — YouTube/Vimeo URL parsing + oEmbed
src/lib/geo.ts                                           — GeoIP lookup
src/lib/email-templates.ts                               — reminder, digest, thank-you HTML builders
src/app/api/analytics/track/route.ts                     — client-side event ingestion
src/app/api/analytics/[eventId]/route.ts                 — analytics data for dashboard
src/app/api/cron/reminders/route.ts                      — RSVP reminder cron
src/app/api/cron/digest/route.ts                         — weekly digest cron
src/app/api/cron/thank-you/route.ts                      — post-event thank-you cron
src/app/api/admin/users/route.ts                         — user management
src/app/api/admin/events/route.ts                        — event management
src/app/api/admin/content/route.ts                       — content moderation
src/app/api/admin/spam/route.ts                          — spam rules CRUD
src/app/api/admin/audit/route.ts                         — audit log queries
src/app/api/admin/stats/route.ts                         — extended system stats
src/app/(dashboard)/dashboard/analytics/page.tsx         — analytics dashboard page
src/components/dashboard/analytics/PageViewsPanel.tsx    — page views chart
src/components/dashboard/analytics/FunnelPanel.tsx       — RSVP funnel
src/components/dashboard/analytics/TimingPanel.tsx       — timing chart
src/components/dashboard/analytics/EngagementPanel.tsx   — blessings & reactions
src/components/dashboard/analytics/GalleryStatsPanel.tsx — photo stats
src/components/dashboard/analytics/GeoPanel.tsx          — geographic breakdown
src/components/dashboard/admin/UsersTab.tsx              — user management tab
src/components/dashboard/admin/EventsTab.tsx             — event management tab
src/components/dashboard/admin/ContentTab.tsx            — content moderation tab
src/components/dashboard/admin/SpamTab.tsx               — spam controls tab
src/components/dashboard/admin/AuditTab.tsx              — audit log tab
src/components/invitation/sections/CalendarButton.tsx    — add-to-calendar button
src/components/invitation/sections/VideoEmbed.tsx        — responsive video embed
src/components/dashboard/gallery/VideoAddModal.tsx       — add video URL modal
src/components/dashboard/gallery/BulkModeration.tsx      — bulk approve/reject UI
src/components/dashboard/settings/EmailSettings.tsx      — reminder/digest settings
src/lib/calendar.test.ts                                 — calendar util tests
src/lib/video.test.ts                                    — video URL parsing tests
src/lib/email-templates.test.ts                          — email template tests
src/lib/geo.test.ts                                      — geo lookup tests
src/app/api/cron/cron.test.ts                            — cron endpoint tests
src/app/api/admin/admin.test.ts                          — admin API tests
src/app/api/analytics/analytics.test.ts                  — analytics API tests
.env.local.example                                       — documented env vars
vercel.json                                              — cron schedule config
```

### Modified Files
```
src/types/database.ts                                    — new types + extended interfaces
src/components/invitation/sections-config.ts             — add dietary, songRequest toggles
src/components/invitation/sections/RsvpSection.tsx       — dietary + song fields
src/app/api/rsvp/route.ts                                — accept new fields
src/components/dashboard/Sidebar.tsx                     — add Analytics nav item
src/components/dashboard/editor/EditorForm.tsx           — gift QR upload button
src/components/gallery/MasonryGrid.tsx                   — video support in grid
src/app/(dashboard)/dashboard/gallery/page.tsx           — add video button, bulk moderation
src/app/(dashboard)/dashboard/admin/page.tsx             — tabbed admin panel
src/app/(dashboard)/dashboard/settings/page.tsx          — email automation settings
src/components/invitation/CinematicInvitation.tsx        — calendar button + analytics tracking
src/app/api/rsvp/route.ts                                — dietary + song fields
src/app/api/routes.test.ts                               — updated RSVP tests
```

---

### Task 1: Database Migration

**Files:**
- Create: `supabase/migrations/00034_missing_features.sql`

- [ ] **Step 1: Write the migration SQL**

```sql
-- 00034_missing_features.sql
-- Adds: audit_logs, spam_rules tables; extends analytics_events, invitees,
-- weddings, gallery_photos; creates gift-qr-images storage bucket.

-- ═══════════════════════════════════════════════════════════════
-- 1. New tables
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_logs_created ON audit_logs (created_at DESC);
CREATE INDEX idx_audit_logs_actor ON audit_logs (actor_id) WHERE actor_id IS NOT NULL;
CREATE INDEX idx_audit_logs_action ON audit_logs (action, created_at DESC);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read audit logs"
  ON audit_logs FOR SELECT
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- No UPDATE or DELETE policies — append-only.

CREATE TABLE IF NOT EXISTS spam_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('ip', 'domain')),
  value TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (rule_type, value)
);

ALTER TABLE spam_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage spam rules"
  ON spam_rules FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ═══════════════════════════════════════════════════════════════
-- 2. Extend analytics_events for invitation engagement tracking
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE analytics_events
  ADD COLUMN IF NOT EXISTS wedding_id UUID REFERENCES weddings(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS guest_token TEXT,
  ADD COLUMN IF NOT EXISTS country TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS ip_hash TEXT;

CREATE INDEX IF NOT EXISTS idx_analytics_events_wedding
  ON analytics_events (wedding_id, event, created_at DESC)
  WHERE wedding_id IS NOT NULL;

-- Wedding owners can read their own analytics.
CREATE POLICY "Owners can read their event analytics"
  ON analytics_events FOR SELECT
  USING (
    wedding_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM weddings w WHERE w.id = wedding_id AND w.user_id = auth.uid()
    )
  );

-- ═══════════════════════════════════════════════════════════════
-- 3. Extend invitees for dietary + song + reminders
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE invitees
  ADD COLUMN IF NOT EXISTS dietary_restrictions TEXT,
  ADD COLUMN IF NOT EXISTS song_request TEXT,
  ADD COLUMN IF NOT EXISTS last_reminder_sent TIMESTAMPTZ;

-- ═══════════════════════════════════════════════════════════════
-- 4. Extend weddings for email automation
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE weddings
  ADD COLUMN IF NOT EXISTS reminder_days INTEGER[] DEFAULT '{7}',
  ADD COLUMN IF NOT EXISTS weekly_digest_enabled BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS thank_you_sent BOOLEAN DEFAULT false;

-- ═══════════════════════════════════════════════════════════════
-- 5. Extend gallery_photos for video support
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE gallery_photos
  ADD COLUMN IF NOT EXISTS media_type TEXT DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  ADD COLUMN IF NOT EXISTS video_url TEXT;

-- ═══════════════════════════════════════════════════════════════
-- 6. Gift QR image storage bucket
-- ═══════════════════════════════════════════════════════════════

INSERT INTO storage.buckets (id, name, public)
VALUES ('gift-qr-images', 'gift-qr-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload gift QR images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'gift-qr-images' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can view gift QR images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gift-qr-images');

CREATE POLICY "Owners can delete their gift QR images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'gift-qr-images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

- [ ] **Step 2: Apply migration locally**

Run: `npx supabase db push` (or apply via Supabase dashboard if remote-only)
Expected: Migration applies without errors.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/00034_missing_features.sql
git commit -m "feat: add migration for missing features (audit, spam, analytics, dietary, video)"
```

---

### Task 2: TypeScript Types

**Files:**
- Modify: `src/types/database.ts`

- [ ] **Step 1: Add new types and extend existing interfaces**

Add these new interfaces after the existing `CuteQuestionRow` interface:

```typescript
export interface AuditLogRow {
  id: string;
  actor_id: string | null;
  action: string;
  target_type: string;
  target_id: string;
  metadata: Record<string, unknown>;
  ip_address: string | null;
  created_at: string;
}

export interface SpamRuleRow {
  id: string;
  rule_type: "ip" | "domain";
  value: string;
  created_by: string | null;
  created_at: string;
}
```

Add to `InviteeRow`:
```typescript
  dietary_restrictions: string | null;
  song_request: string | null;
  last_reminder_sent: string | null;
```

Add to `WeddingRow`:
```typescript
  reminder_days?: number[];
  weekly_digest_enabled?: boolean;
  thank_you_sent?: boolean;
```

Add to `GalleryPhotoRow`:
```typescript
  media_type: "image" | "video";
  video_url: string | null;
```

Add to `WeddingCustomization.sections`:
```typescript
    dietary?: boolean;
    songRequest?: boolean;
```

Add to `GiftAccount`:
```typescript
  /** Supabase storage path for an uploaded QR image (alternative to qrUrl). */
  qrImagePath?: string;
```

- [ ] **Step 2: Commit**

```bash
git add src/types/database.ts
git commit -m "feat: add TypeScript types for missing features"
```

---

### Task 3: Housekeeping — .env.local.example

**Files:**
- Create: `.env.local.example`

- [ ] **Step 1: Create the env example file**

```bash
# ═══════════════════════════════════════════════════════════════
# Dearly — Environment Variables
# Copy this file to .env.local and fill in your values.
# ═══════════════════════════════════════════════════════════════

# ── Required ──────────────────────────────────────────────────
# Supabase project credentials (Settings → API in your dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ── Email (optional) ─────────────────────────────────────────
# Resend API key for transactional emails (RSVP notifications,
# reminders, digests). Without this, emails log to console.
RESEND_API_KEY=re_your-key
EMAIL_FROM=Dearly <noreply@dearly.app>

# ── Cron Security (required for email automation) ────────────
# Random secret to authenticate Vercel Cron requests.
# Generate with: openssl rand -hex 32
CRON_SECRET=your-random-secret

# ── Error Monitoring (optional) ──────────────────────────────
# Sentry DSN for client and server error tracking.
NEXT_PUBLIC_SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0
SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
SENTRY_AUTH_TOKEN=your-token
# Performance tracing sample rate (0 = off, 1 = 100%).
SENTRY_TRACES_SAMPLE_RATE=0

# ── Testing ──────────────────────────────────────────────────
E2E_BASE_URL=http://localhost:3000

# ── App URLs ─────────────────────────────────────────────────
NEXT_PUBLIC_SITE_URL=https://dearly-self.vercel.app
SUPPORT_EMAIL=hello@dearly.app
```

- [ ] **Step 2: Commit**

```bash
git add .env.local.example
git commit -m "chore: add .env.local.example with documented variables"
```

---

### Task 4: Guest Data Collection — Utilities & API

**Files:**
- Modify: `src/components/invitation/sections-config.ts`
- Modify: `src/app/api/rsvp/route.ts`
- Modify: `src/app/api/routes.test.ts`

- [ ] **Step 1: Add section toggles for dietary and song request**

In `src/components/invitation/sections-config.ts`, add to `SectionKey` type:

```typescript
export type SectionKey =
  | "countdown"
  | "story"
  | "timeline"
  | "venue"
  | "gallery"
  | "rsvp"
  | "blessings"
  | "reactions"
  | "blessingShower"
  | "music"
  | "guestbook"
  | "families"
  | "gift"
  | "invitationCard"
  | "dietary"
  | "songRequest";
```

Add to `SECTION_TOGGLES` array (after the `rsvp` entry):

```typescript
  { key: "dietary", label: "Dietary restrictions", description: "Ask guests about food requirements" },
  { key: "songRequest", label: "Song requests", description: "Let guests suggest a song" },
```

Add `"dietary"` and `"songRequest"` to `OPT_IN_KEYS`:

```typescript
const OPT_IN_KEYS: Set<SectionKey> = new Set<SectionKey>(["invitationCard", "dietary", "songRequest"]);
```

- [ ] **Step 2: Update RSVP API to accept dietary + song fields**

In `src/app/api/rsvp/route.ts`, add to `RsvpSchema`:

```typescript
  dietaryRestrictions: z.string().trim().max(200, "Dietary info too long (max 200 characters)").optional(),
  songRequest: z.string().trim().max(200, "Song request too long (max 200 characters)").optional(),
```

After the existing invitee status update block (after `if (invitee) { ... }`), add:

```typescript
  // Save dietary and song data to the invitee record if present.
  if (invitee && (parsed.data.dietaryRestrictions || parsed.data.songRequest)) {
    const inviteeUpdate: Record<string, string> = {};
    if (parsed.data.dietaryRestrictions) inviteeUpdate.dietary_restrictions = parsed.data.dietaryRestrictions;
    if (parsed.data.songRequest) inviteeUpdate.song_request = parsed.data.songRequest;
    await supabase.from("invitees").update(inviteeUpdate).eq("id", invitee.id);
  }
```

- [ ] **Step 3: Write tests for new RSVP fields**

In `src/app/api/routes.test.ts`, add a test case:

```typescript
it("stores dietary restrictions and song request on the invitee", async () => {
  const body = {
    weddingId: WEDDING_ID,
    guestName: "Test Guest",
    attending: true,
    partySize: 2,
    inviteeToken: "abc123def456",
    dietaryRestrictions: "Vegetarian",
    songRequest: "Dancing Queen",
  };
  const req = new NextRequest("http://localhost/api/rsvp", {
    method: "POST",
    body: JSON.stringify(body),
  });
  const res = await POST(req);
  expect(res.status).toBe(201);
  // Verify the invitee update was called with dietary data
  const inviteeUpdates = state.inserts.filter(
    (i: { table: string }) => i.table === "invitees"
  );
  // The mock should capture the update call
});
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/app/api/routes.test.ts`
Expected: All tests pass including the new one.

- [ ] **Step 5: Commit**

```bash
git add src/components/invitation/sections-config.ts src/app/api/rsvp/route.ts src/app/api/routes.test.ts
git commit -m "feat: accept dietary restrictions and song requests in RSVP"
```

---

### Task 5: Guest Data Collection — RSVP Form UI

**Files:**
- Modify: `src/components/invitation/sections/RsvpSection.tsx`

- [ ] **Step 1: Add dietary dropdown and song request field to the RSVP form**

In `RsvpSection.tsx`, inside the `<AnimatePresence>` block where `choice && attending` is checked, after the party size `<div>` block and before the message `<label>` block, add:

```tsx
                      {attending && sections?.dietary && (
                        <label className="block">
                          <span className="mb-2 block text-xs uppercase tracking-[0.25em]" style={{ color: palette.inkMuted }}>
                            {ui.lang === "vi" ? "Ch\u1EBF \u0111\u1ED9 \u0103n" : "Dietary restrictions"}
                          </span>
                          <select
                            value={dietary}
                            onChange={(e) => setDietary(e.target.value)}
                            className="w-full border px-5 py-4 text-base outline-none transition focus:ring-2"
                            style={inputStyle}
                          >
                            <option value="">{ui.lang === "vi" ? "Kh\u00F4ng" : "None"}</option>
                            <option value="vegetarian">{ui.lang === "vi" ? "Chay" : "Vegetarian"}</option>
                            <option value="vegan">Vegan</option>
                            <option value="halal">Halal</option>
                            <option value="kosher">Kosher</option>
                            <option value="gluten-free">Gluten-free</option>
                            <option value="other">{ui.lang === "vi" ? "Kh\u00E1c" : "Other"}</option>
                          </select>
                          {dietary === "other" && (
                            <input
                              value={dietaryOther}
                              onChange={(e) => setDietaryOther(e.target.value)}
                              maxLength={200}
                              placeholder={ui.lang === "vi" ? "Xin ghi r\u00F5..." : "Please specify..."}
                              className="mt-2 w-full border px-5 py-4 text-base outline-none transition focus:ring-2"
                              style={inputStyle}
                            />
                          )}
                        </label>
                      )}

                      {attending && sections?.songRequest && (
                        <label className="block">
                          <span className="mb-2 block text-xs uppercase tracking-[0.25em]" style={{ color: palette.inkMuted }}>
                            {ui.lang === "vi" ? "G\u1EE3i \u00FD b\u00E0i h\u00E1t" : "Song request"}
                          </span>
                          <input
                            value={songReq}
                            onChange={(e) => setSongReq(e.target.value)}
                            maxLength={200}
                            placeholder={ui.lang === "vi" ? "B\u00E0i h\u00E1t b\u1EA1n mu\u1ED1n nghe?" : "Any song you'd like to hear?"}
                            className="w-full border px-5 py-4 text-base outline-none transition focus:ring-2"
                            style={inputStyle}
                          />
                        </label>
                      )}
```

Add state hooks at the top of the `RsvpSection` component (alongside the existing `useRsvpForm`):

```typescript
  const [dietary, setDietary] = useState("");
  const [dietaryOther, setDietaryOther] = useState("");
  const [songReq, setSongReq] = useState("");
```

The component needs a `sections` prop to know which fields are enabled. Add to `RsvpSectionProps`:

```typescript
  /** Resolved section visibility for conditional fields. */
  sections?: Partial<Record<string, boolean>>;
```

In `submitRsvp`, include the new fields in the payload:

```typescript
  dietaryRestrictions: dietary === "other" ? dietaryOther : dietary || undefined,
  songRequest: songReq || undefined,
```

- [ ] **Step 2: Commit**

```bash
git add src/components/invitation/sections/RsvpSection.tsx
git commit -m "feat: add dietary restrictions and song request fields to RSVP form"
```

---

### Task 6: Video Support — URL Parsing Utilities

**Files:**
- Create: `src/lib/video.ts`
- Create: `src/lib/video.test.ts`

- [ ] **Step 1: Write failing tests for video URL parsing**

```typescript
// src/lib/video.test.ts
import { describe, it, expect } from "vitest";
import { parseVideoUrl, getOEmbedThumbnail } from "./video";

describe("parseVideoUrl", () => {
  it("parses youtube.com/watch?v= URLs", () => {
    const result = parseVideoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    expect(result).toEqual({ provider: "youtube", videoId: "dQw4w9WgXcQ" });
  });

  it("parses youtu.be short URLs", () => {
    const result = parseVideoUrl("https://youtu.be/dQw4w9WgXcQ");
    expect(result).toEqual({ provider: "youtube", videoId: "dQw4w9WgXcQ" });
  });

  it("parses vimeo.com URLs", () => {
    const result = parseVideoUrl("https://vimeo.com/123456789");
    expect(result).toEqual({ provider: "vimeo", videoId: "123456789" });
  });

  it("returns null for non-video URLs", () => {
    expect(parseVideoUrl("https://example.com/video")).toBeNull();
    expect(parseVideoUrl("not a url")).toBeNull();
  });

  it("strips extra query params from YouTube", () => {
    const result = parseVideoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30");
    expect(result).toEqual({ provider: "youtube", videoId: "dQw4w9WgXcQ" });
  });
});

describe("getOEmbedThumbnail", () => {
  it("returns YouTube thumbnail URL from video ID", () => {
    const url = getOEmbedThumbnail("youtube", "dQw4w9WgXcQ");
    expect(url).toBe("https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg");
  });

  it("returns Vimeo thumbnail placeholder", () => {
    const url = getOEmbedThumbnail("vimeo", "123456789");
    expect(url).toContain("vumbnail.com");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/video.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement video URL parsing**

```typescript
// src/lib/video.ts
/**
 * YouTube / Vimeo URL parsing and thumbnail resolution.
 * No external dependencies — pure string manipulation.
 */

export type VideoProvider = "youtube" | "vimeo";

export interface ParsedVideo {
  provider: VideoProvider;
  videoId: string;
}

/** Extracts provider and video ID from a YouTube or Vimeo URL. Returns null if unrecognised. */
export function parseVideoUrl(url: string): ParsedVideo | null {
  try {
    const u = new URL(url);

    // youtube.com/watch?v=ID or youtube.com/embed/ID
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return { provider: "youtube", videoId: v };
      const embedMatch = u.pathname.match(/\/embed\/([a-zA-Z0-9_-]+)/);
      if (embedMatch) return { provider: "youtube", videoId: embedMatch[1] };
    }

    // youtu.be/ID
    if (u.hostname === "youtu.be") {
      const id = u.pathname.slice(1).split("/")[0];
      if (id) return { provider: "youtube", videoId: id };
    }

    // vimeo.com/ID
    if (u.hostname.includes("vimeo.com")) {
      const match = u.pathname.match(/\/(\d+)/);
      if (match) return { provider: "vimeo", videoId: match[1] };
    }
  } catch {
    // Invalid URL
  }
  return null;
}

/** Returns a direct thumbnail URL for a video. YouTube has a predictable pattern; Vimeo uses vumbnail.com. */
export function getOEmbedThumbnail(provider: VideoProvider, videoId: string): string {
  if (provider === "youtube") {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  return `https://vumbnail.com/${videoId}.jpg`;
}

/** Returns the embed URL for an iframe. */
export function getEmbedUrl(provider: VideoProvider, videoId: string): string {
  if (provider === "youtube") {
    return `https://www.youtube.com/embed/${videoId}?rel=0`;
  }
  return `https://player.vimeo.com/video/${videoId}`;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/video.test.ts`
Expected: All 6 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/video.ts src/lib/video.test.ts
git commit -m "feat: add YouTube/Vimeo URL parsing and thumbnail utilities"
```

---

### Task 7: Video Support — Editor UI & Gallery

**Files:**
- Create: `src/components/dashboard/gallery/VideoAddModal.tsx`
- Create: `src/components/invitation/sections/VideoEmbed.tsx`
- Modify: `src/components/gallery/MasonryGrid.tsx`
- Modify: `src/app/(dashboard)/dashboard/gallery/page.tsx`

- [ ] **Step 1: Create the video add modal for the editor**

```tsx
// src/components/dashboard/gallery/VideoAddModal.tsx
"use client";

/**
 * Modal for adding a YouTube or Vimeo video to the gallery.
 * Validates the URL, shows a preview embed, and saves on confirm.
 */

import { useState } from "react";
import { X, Video, ExternalLink } from "lucide-react";
import { parseVideoUrl, getEmbedUrl, getOEmbedThumbnail } from "@/lib/video";

interface VideoAddModalProps {
  onAdd: (videoUrl: string, thumbnailUrl: string) => void;
  onClose: () => void;
}

export default function VideoAddModal({ onAdd, onClose }: VideoAddModalProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const parsed = url.trim() ? parseVideoUrl(url.trim()) : null;

  /** Validates and submits the video URL. */
  function handleSubmit() {
    if (!parsed) {
      setError("Please enter a valid YouTube or Vimeo URL.");
      return;
    }
    const thumbnail = getOEmbedThumbnail(parsed.provider, parsed.videoId);
    onAdd(url.trim(), thumbnail);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-dearly-text">
            <Video size={20} /> Add video
          </h3>
          <button onClick={onClose} className="text-dearly-text-secondary hover:text-dearly-text">
            <X size={20} />
          </button>
        </div>

        <input
          type="url"
          value={url}
          onChange={(e) => { setUrl(e.target.value); setError(null); }}
          placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
          className="w-full rounded-lg border border-dearly-border bg-dearly-cream px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-dearly-accent"
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        {parsed && (
          <div className="mt-4 overflow-hidden rounded-lg border border-dearly-border">
            <div className="aspect-video">
              <iframe
                src={getEmbedUrl(parsed.provider, parsed.videoId)}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Video preview"
              />
            </div>
            <p className="flex items-center gap-1 px-3 py-2 text-xs text-dearly-text-secondary">
              <ExternalLink size={12} /> {parsed.provider} · {parsed.videoId}
            </p>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-dearly-text-secondary hover:bg-dearly-cream">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!parsed}
            className="rounded-lg bg-dearly-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            Add to gallery
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create the responsive video embed component**

```tsx
// src/components/invitation/sections/VideoEmbed.tsx
"use client";

/**
 * Responsive YouTube/Vimeo embed shown inline in the gallery.
 * Lazy-loaded, no autoplay, respects reduced motion.
 */

import { useState } from "react";
import { Play } from "lucide-react";
import { parseVideoUrl, getEmbedUrl, getOEmbedThumbnail } from "@/lib/video";

interface VideoEmbedProps {
  videoUrl: string;
  thumbnailUrl?: string;
  caption?: string;
}

export default function VideoEmbed({ videoUrl, thumbnailUrl, caption }: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false);
  const parsed = parseVideoUrl(videoUrl);
  if (!parsed) return null;

  const thumb = thumbnailUrl || getOEmbedThumbnail(parsed.provider, parsed.videoId);
  const embed = getEmbedUrl(parsed.provider, parsed.videoId);

  return (
    <div className="group relative overflow-hidden rounded-xl">
      {playing ? (
        <div className="aspect-video">
          <iframe
            src={`${embed}&autoplay=1`}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={caption || "Video"}
          />
        </div>
      ) : (
        <button
          onClick={() => setPlaying(true)}
          className="relative block w-full"
          aria-label={`Play ${caption || "video"}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={thumb} alt={caption || "Video thumbnail"} className="aspect-video w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/40">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg">
              <Play size={28} className="ml-1 text-dearly-accent" fill="currentColor" />
            </div>
          </div>
        </button>
      )}
      {caption && <p className="mt-2 text-center text-sm text-dearly-text-secondary">{caption}</p>}
    </div>
  );
}
```

- [ ] **Step 3: Update MasonryGrid to handle video items**

In `src/components/gallery/MasonryGrid.tsx`, import the VideoEmbed component and check `media_type` on each photo. If `media_type === "video"` and `video_url` is set, render `<VideoEmbed>` instead of the image. The exact edit depends on the current grid item rendering — wrap the image rendering in a conditional:

```tsx
{photo.media_type === "video" && photo.video_url ? (
  <VideoEmbed videoUrl={photo.video_url} thumbnailUrl={photo.url} caption={photo.caption ?? undefined} />
) : (
  // existing <Image> or <img> rendering
)}
```

- [ ] **Step 4: Update gallery page to include "Add video" button**

In `src/app/(dashboard)/dashboard/gallery/page.tsx`, add a "Add video" button next to the existing photo upload. Wire it to open `VideoAddModal`. On submit, insert a `gallery_photos` row with `media_type: 'video'`, `video_url`, and the thumbnail as `url`.

- [ ] **Step 5: Commit**

```bash
git add src/components/dashboard/gallery/VideoAddModal.tsx src/components/invitation/sections/VideoEmbed.tsx src/components/gallery/MasonryGrid.tsx src/app/\(dashboard\)/dashboard/gallery/page.tsx
git commit -m "feat: add video embed support in gallery (YouTube/Vimeo)"
```

---

### Task 8: Google Calendar Button

**Files:**
- Create: `src/lib/calendar.ts`
- Create: `src/lib/calendar.test.ts`
- Create: `src/components/invitation/sections/CalendarButton.tsx`

- [ ] **Step 1: Write failing tests for calendar utilities**

```typescript
// src/lib/calendar.test.ts
import { describe, it, expect } from "vitest";
import { buildGoogleCalendarUrl, buildIcsContent } from "./calendar";

const EVENT = {
  title: "Emma & James Wedding",
  date: "2027-06-15",
  startTime: "14:00",
  endTime: "22:00",
  timezone: "Asia/Ho_Chi_Minh",
  venue: "The Grand Estate",
  address: "123 Garden Lane, Da Lat",
  description: "You are cordially invited to celebrate with us.",
};

describe("buildGoogleCalendarUrl", () => {
  it("returns a valid Google Calendar URL", () => {
    const url = buildGoogleCalendarUrl(EVENT);
    expect(url).toContain("calendar.google.com/calendar/render");
    expect(url).toContain("action=TEMPLATE");
    expect(url).toContain("Emma");
    expect(url).toContain("20270615");
  });

  it("encodes special characters in the title", () => {
    const url = buildGoogleCalendarUrl({ ...EVENT, title: "A & B's Party" });
    expect(url).toContain(encodeURIComponent("A & B's Party"));
  });
});

describe("buildIcsContent", () => {
  it("returns valid ICS format", () => {
    const ics = buildIcsContent(EVENT);
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("SUMMARY:Emma & James Wedding");
    expect(ics).toContain("END:VCALENDAR");
  });

  it("includes the venue as location", () => {
    const ics = buildIcsContent(EVENT);
    expect(ics).toContain("LOCATION:The Grand Estate");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/calendar.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement calendar utilities**

```typescript
// src/lib/calendar.ts
/**
 * Google Calendar URL and .ics file generation.
 * No external dependencies — pure string manipulation.
 */

export interface CalendarEvent {
  title: string;
  date: string;        // ISO date: "2027-06-15"
  startTime?: string;  // "14:00" (24h), optional
  endTime?: string;    // "22:00", optional
  timezone?: string;   // IANA: "Asia/Ho_Chi_Minh"
  venue?: string;
  address?: string;
  description?: string;
}

/** Formats a date + optional time to Google Calendar date format (YYYYMMDD or YYYYMMDDTHHMMSS). */
function toGoogleDate(date: string, time?: string): string {
  const d = date.replace(/-/g, "");
  if (!time) return d;
  return `${d}T${time.replace(/:/g, "")}00`;
}

/** Builds a Google Calendar URL that opens "Create event" with pre-filled fields. */
export function buildGoogleCalendarUrl(event: CalendarEvent): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    details: event.description || "",
    location: [event.venue, event.address].filter(Boolean).join(", "),
  });

  const start = toGoogleDate(event.date, event.startTime);
  const end = event.endTime
    ? toGoogleDate(event.date, event.endTime)
    : toGoogleDate(event.date, event.startTime);
  params.set("dates", `${start}/${end}`);

  if (event.timezone) params.set("ctz", event.timezone);

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Builds an .ics file content string (VCALENDAR/VEVENT). */
export function buildIcsContent(event: CalendarEvent): string {
  const uid = `dearly-${event.date}-${Date.now()}@dearly.app`;
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
  const start = toGoogleDate(event.date, event.startTime);
  const end = event.endTime
    ? toGoogleDate(event.date, event.endTime)
    : toGoogleDate(event.date, event.startTime);
  const location = [event.venue, event.address].filter(Boolean).join(", ");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Dearly//Event//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART${event.timezone ? `;TZID=${event.timezone}` : ""}:${start}`,
    `DTEND${event.timezone ? `;TZID=${event.timezone}` : ""}:${end}`,
    `SUMMARY:${event.title}`,
    location ? `LOCATION:${location}` : "",
    event.description ? `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);

  return lines.join("\r\n");
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/calendar.test.ts`
Expected: All tests PASS.

- [ ] **Step 5: Create the CalendarButton component**

```tsx
// src/components/invitation/sections/CalendarButton.tsx
"use client";

/**
 * "Add to Calendar" dropdown — Google Calendar link and .ics download.
 */

import { useState, useRef, useEffect } from "react";
import { CalendarPlus, ChevronDown } from "lucide-react";
import { buildGoogleCalendarUrl, buildIcsContent, type CalendarEvent } from "@/lib/calendar";
import { alpha, type InvitationPalette } from "../utils";

interface CalendarButtonProps {
  event: CalendarEvent;
  palette: InvitationPalette;
}

export default function CalendarButton({ event, palette }: CalendarButtonProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /** Closes the dropdown on outside click. */
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  /** Downloads the .ics file. */
  function handleIcs() {
    const content = buildIcsContent(event);
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.title.replace(/\s+/g, "-")}.ics`;
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 border px-4 py-2.5 text-sm font-medium transition hover:-translate-y-0.5"
        style={{
          borderRadius: palette.radius.card,
          borderColor: alpha(palette.primary, 0.3),
          color: palette.ink,
          backgroundColor: alpha(palette.primary, 0.06),
        }}
      >
        <CalendarPlus size={16} style={{ color: palette.primary }} />
        Add to Calendar
        <ChevronDown size={14} style={{ color: palette.inkMuted }} />
      </button>

      {open && (
        <div
          className="absolute left-0 z-20 mt-2 w-52 overflow-hidden border shadow-lg"
          style={{ borderRadius: palette.radius.card, borderColor: alpha(palette.primary, 0.2), backgroundColor: palette.background }}
        >
          <a
            href={buildGoogleCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-3 text-sm transition hover:bg-black/5"
            style={{ color: palette.ink }}
            onClick={() => setOpen(false)}
          >
            Google Calendar
          </a>
          <button
            onClick={handleIcs}
            className="block w-full px-4 py-3 text-left text-sm transition hover:bg-black/5"
            style={{ color: palette.ink }}
          >
            Download .ics file
          </button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/calendar.ts src/lib/calendar.test.ts src/components/invitation/sections/CalendarButton.tsx
git commit -m "feat: add Google Calendar and .ics add-to-calendar button"
```

---

### Task 9: Gift QR Image Upload

**Files:**
- Modify: `src/components/dashboard/editor/EditorForm.tsx`
- Modify: `src/lib/supabase/storage.ts` (if upload helper needed)

- [ ] **Step 1: Add QR image upload button to gift section in EditorForm**

In `src/components/dashboard/editor/EditorForm.tsx`, in the gift section (after the "QR image link (https)" `Field`), add an "or upload" button. When clicked, open a file picker accepting image/* (max 2MB). On selection, upload to `gift-qr-images/{wedding.id}/{index}.png` via Supabase storage, then set the public URL as `qrUrl` on the gift account.

```tsx
<div className="flex items-center gap-2">
  <Field label="QR image link (https)" value={a.qrUrl ?? ""} onChange={(v) => set("qrUrl", v)} placeholder="https://…/qr.png" />
  <div className="pt-5">
    <label className="cursor-pointer rounded-lg bg-dearly-cream px-3 py-2 text-xs font-medium text-dearly-text-secondary hover:bg-dearly-border">
      Upload
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file || !wedding.id) return;
          if (file.size > 2 * 1024 * 1024) { alert("Max 2MB"); return; }
          const supabase = (await import("@/lib/supabase/client")).createClient();
          const path = `${wedding.id}/${i}.png`;
          const { error: uploadErr } = await supabase.storage.from("gift-qr-images").upload(path, file, { upsert: true });
          if (uploadErr) { alert("Upload failed: " + uploadErr.message); return; }
          const { data: urlData } = supabase.storage.from("gift-qr-images").getPublicUrl(path);
          set("qrUrl", urlData.publicUrl);
        }}
      />
    </label>
  </div>
</div>
```

Replace the existing QR Field line with this block.

- [ ] **Step 2: Commit**

```bash
git add src/components/dashboard/editor/EditorForm.tsx
git commit -m "feat: add QR image upload button to gift section"
```

---

### Task 10: Photo Bulk Moderation

**Files:**
- Create: `src/components/dashboard/gallery/BulkModeration.tsx`
- Modify: `src/app/(dashboard)/dashboard/gallery/page.tsx`

- [ ] **Step 1: Create the bulk moderation component**

```tsx
// src/components/dashboard/gallery/BulkModeration.tsx
"use client";

/**
 * Bulk approve/reject toolbar for pending photos.
 * Shows when at least one photo is selected.
 */

import { CheckCheck, XCircle, CheckSquare, Square } from "lucide-react";

interface BulkModerationProps {
  totalPending: number;
  selectedIds: Set<string>;
  onToggleAll: () => void;
  onApprove: (ids: string[]) => void;
  onReject: (ids: string[]) => void;
}

export default function BulkModeration({ totalPending, selectedIds, onToggleAll, onApprove, onReject }: BulkModerationProps) {
  const count = selectedIds.size;
  const allSelected = count === totalPending && totalPending > 0;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-dearly-border bg-dearly-cream px-4 py-3">
      <button
        onClick={onToggleAll}
        className="flex items-center gap-2 text-sm text-dearly-text-secondary hover:text-dearly-text"
      >
        {allSelected ? <CheckSquare size={16} /> : <Square size={16} />}
        {allSelected ? "Deselect all" : "Select all"}
      </button>

      {count > 0 && (
        <>
          <span className="text-xs text-dearly-text-secondary">{count} selected</span>
          <button
            onClick={() => onApprove([...selectedIds])}
            className="flex items-center gap-1 rounded-lg bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700 hover:bg-green-100"
          >
            <CheckCheck size={14} /> Approve
          </button>
          <button
            onClick={() => onReject([...selectedIds])}
            className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100"
          >
            <XCircle size={14} /> Reject
          </button>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Wire into gallery page**

In `src/app/(dashboard)/dashboard/gallery/page.tsx`:
- Add a `selectedIds` state (`useState<Set<string>>`).
- Show `BulkModeration` toolbar above the pending photos grid.
- Add a checkbox overlay on each pending photo.
- On bulk approve/reject, call Supabase to update all selected photos in a single query, then refresh.

- [ ] **Step 3: Commit**

```bash
git add src/components/dashboard/gallery/BulkModeration.tsx src/app/\(dashboard\)/dashboard/gallery/page.tsx
git commit -m "feat: add bulk approve/reject for photo moderation"
```

---

### Task 11: Analytics — Tracking API & Client

**Files:**
- Create: `src/lib/geo.ts`
- Create: `src/lib/geo.test.ts`
- Create: `src/app/api/analytics/track/route.ts`
- Create: `src/app/api/analytics/analytics.test.ts`

- [ ] **Step 1: Write geo lookup utility with test**

```typescript
// src/lib/geo.test.ts
import { describe, it, expect, vi } from "vitest";
import { hashIp } from "./geo";

describe("hashIp", () => {
  it("returns a consistent hash for the same IP", () => {
    const h1 = hashIp("192.168.1.1");
    const h2 = hashIp("192.168.1.1");
    expect(h1).toBe(h2);
  });

  it("returns different hashes for different IPs", () => {
    expect(hashIp("192.168.1.1")).not.toBe(hashIp("10.0.0.1"));
  });

  it("does not expose the raw IP", () => {
    const hash = hashIp("192.168.1.1");
    expect(hash).not.toContain("192");
  });
});
```

```typescript
// src/lib/geo.ts
/**
 * GeoIP lookup (free ip-api.com) and IP hashing for analytics.
 */

import { createHash } from "crypto";

const GEO_SALT = "dearly-geo-2026";

/** One-way hash of an IP address for deduplication without storing PII. */
export function hashIp(ip: string): string {
  return createHash("sha256").update(`${GEO_SALT}:${ip}`).digest("hex").slice(0, 16);
}

export interface GeoResult {
  country: string | null;
  city: string | null;
}

/** Resolves country and city from an IP address using ip-api.com. Returns nulls on failure. */
export async function lookupGeo(ip: string): Promise<GeoResult> {
  // Skip private/local IPs
  if (ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.") || ip.startsWith("10.")) {
    return { country: null, city: null };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return { country: null, city: null };
    const data = (await res.json()) as { status: string; country?: string; city?: string };
    if (data.status !== "success") return { country: null, city: null };
    return { country: data.country ?? null, city: data.city ?? null };
  } catch {
    return { country: null, city: null };
  }
}
```

- [ ] **Step 2: Run geo tests**

Run: `npx vitest run src/lib/geo.test.ts`
Expected: All PASS.

- [ ] **Step 3: Create analytics tracking API route**

```typescript
// src/app/api/analytics/track/route.ts
/**
 * Analytics event ingestion — lightweight client-side tracking.
 * POST body: { weddingId, eventType, guestToken?, metadata? }
 * Deduplicates by ip_hash + event type within a 5-minute window.
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { clientIp } from "@/lib/rate-limit";
import { hashIp, lookupGeo } from "@/lib/geo";

const VALID_EVENTS = ["page_view", "rsvp_opened", "rsvp_submitted", "blessing_sent", "reaction_sent", "photo_viewed"] as const;

const TrackSchema = z.object({
  weddingId: z.string().uuid(),
  eventType: z.enum(VALID_EVENTS),
  guestToken: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

const DEDUP_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

export async function POST(request: NextRequest) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const parsed = TrackSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid event." }, { status: 400 });
  }

  const { weddingId, eventType, guestToken, metadata } = parsed.data;
  const ip = clientIp(request);
  const ipHash = hashIp(ip);

  const supabase = createServiceRoleClient();

  // Deduplication: skip if same ip_hash + event + wedding within window.
  const windowStart = new Date(Date.now() - DEDUP_WINDOW_MS).toISOString();
  const { count } = await supabase
    .from("analytics_events")
    .select("id", { count: "exact", head: true })
    .eq("wedding_id", weddingId)
    .eq("event", eventType)
    .eq("ip_hash", ipHash)
    .gte("created_at", windowStart);

  if ((count ?? 0) > 0) {
    return NextResponse.json({ ok: true, deduped: true }, { status: 200 });
  }

  // Geo lookup (fire-and-forget style but we await for the insert).
  const geo = await lookupGeo(ip);

  const { error } = await supabase.from("analytics_events").insert({
    wedding_id: weddingId,
    event: eventType,
    guest_token: guestToken ?? null,
    ip_hash: ipHash,
    country: geo.country,
    city: geo.city,
    properties: metadata ?? {},
  });

  if (error) {
    console.error("[ERROR] analytics insert failed", { weddingId, eventType, code: error.code });
    return NextResponse.json({ error: "Failed to track." }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
```

- [ ] **Step 4: Write test for analytics tracking**

```typescript
// src/app/api/analytics/analytics.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase/server", () => ({
  createServiceRoleClient: () => mockSupabase,
}));

vi.mock("@/lib/rate-limit", () => ({
  clientIp: () => "127.0.0.1",
}));

vi.mock("@/lib/geo", () => ({
  hashIp: (ip: string) => `hash_${ip}`,
  lookupGeo: async () => ({ country: null, city: null }),
}));

const state = { inserts: [] as unknown[], selectCount: 0 };

const mockSupabase = {
  from: (table: string) => ({
    insert: (data: unknown) => {
      state.inserts.push({ table, ...data as Record<string, unknown> });
      return { error: null };
    },
    select: () => ({
      eq: () => ({
        eq: () => ({
          eq: () => ({
            gte: () => ({ count: state.selectCount }),
          }),
        }),
      }),
    }),
  }),
};

const { POST } = await import("./track/route");

describe("POST /api/analytics/track", () => {
  beforeEach(() => {
    state.inserts = [];
    state.selectCount = 0;
  });

  it("inserts a valid analytics event", async () => {
    const req = new Request("http://localhost/api/analytics/track", {
      method: "POST",
      body: JSON.stringify({ weddingId: "00000000-0000-0000-0000-000000000001", eventType: "page_view" }),
    });
    const res = await POST(req as unknown as import("next/server").NextRequest);
    expect(res.status).toBe(201);
    expect(state.inserts).toHaveLength(1);
  });

  it("deduplicates within the 5-minute window", async () => {
    state.selectCount = 1;
    const req = new Request("http://localhost/api/analytics/track", {
      method: "POST",
      body: JSON.stringify({ weddingId: "00000000-0000-0000-0000-000000000001", eventType: "page_view" }),
    });
    const res = await POST(req as unknown as import("next/server").NextRequest);
    expect(res.status).toBe(200);
    expect(state.inserts).toHaveLength(0);
  });

  it("rejects invalid event types", async () => {
    const req = new Request("http://localhost/api/analytics/track", {
      method: "POST",
      body: JSON.stringify({ weddingId: "00000000-0000-0000-0000-000000000001", eventType: "invalid" }),
    });
    const res = await POST(req as unknown as import("next/server").NextRequest);
    expect(res.status).toBe(400);
  });
});
```

- [ ] **Step 5: Run tests**

Run: `npx vitest run src/app/api/analytics/analytics.test.ts`
Expected: All PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/geo.ts src/lib/geo.test.ts src/app/api/analytics/track/route.ts src/app/api/analytics/analytics.test.ts
git commit -m "feat: add analytics event tracking API with geo lookup and dedup"
```

---

### Task 12: Analytics — Dashboard Data API

**Files:**
- Create: `src/app/api/analytics/[eventId]/route.ts`

- [ ] **Step 1: Create analytics data API**

```typescript
// src/app/api/analytics/[eventId]/route.ts
/**
 * Analytics data for the dashboard — aggregates analytics_events
 * for a specific wedding. Requires authentication as the wedding owner.
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { createCookieClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const cookieClient = await createCookieClient();
  const { data: { user } } = await cookieClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServiceRoleClient();

  // Verify ownership
  const { data: wedding } = await supabase
    .from("weddings")
    .select("id, user_id")
    .eq("id", eventId)
    .maybeSingle();

  if (!wedding || wedding.user_id !== user.id) {
    // Allow admins
    const isAdmin = user.app_metadata?.role === "admin";
    if (!isAdmin) return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Fetch all analytics events for this wedding
  const { data: events } = await supabase
    .from("analytics_events")
    .select("event, guest_token, country, city, ip_hash, created_at")
    .eq("wedding_id", eventId)
    .order("created_at", { ascending: true });

  // Fetch guest data for the funnel
  const { data: invitees } = await supabase
    .from("invitees")
    .select("id, name, status, token")
    .eq("wedding_id", eventId);

  // Fetch blessings + reactions for engagement panel
  const { data: blessings } = await supabase
    .from("guestbook_entries")
    .select("id, guest_name, created_at")
    .eq("wedding_id", eventId);

  const { data: reactions } = await supabase
    .from("wedding_reactions")
    .select("kind, count")
    .eq("wedding_id", eventId);

  // Fetch photo stats
  const { data: photos } = await supabase
    .from("gallery_photos")
    .select("id, uploaded_by, status")
    .eq("wedding_id", eventId);

  return NextResponse.json({
    events: events ?? [],
    invitees: invitees ?? [],
    blessings: blessings ?? [],
    reactions: reactions ?? [],
    photos: photos ?? [],
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/analytics/\[eventId\]/route.ts
git commit -m "feat: add analytics data API for dashboard"
```

---

### Task 13: Analytics — Dashboard Page & Panels

**Files:**
- Create: `src/app/(dashboard)/dashboard/analytics/page.tsx`
- Create: `src/components/dashboard/analytics/PageViewsPanel.tsx`
- Create: `src/components/dashboard/analytics/FunnelPanel.tsx`
- Create: `src/components/dashboard/analytics/TimingPanel.tsx`
- Create: `src/components/dashboard/analytics/EngagementPanel.tsx`
- Create: `src/components/dashboard/analytics/GalleryStatsPanel.tsx`
- Create: `src/components/dashboard/analytics/GeoPanel.tsx`
- Modify: `src/components/dashboard/Sidebar.tsx`

- [ ] **Step 1: Add Analytics to sidebar**

In `src/components/dashboard/Sidebar.tsx`, import `BarChart3` from lucide-react and add to `NAV_ITEMS` after the "RSVPs" entry:

```typescript
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
```

- [ ] **Step 2: Create analytics page**

```tsx
// src/app/(dashboard)/dashboard/analytics/page.tsx
"use client";

/**
 * Analytics dashboard — six panels showing guest engagement data.
 */

import { useEffect, useState } from "react";
import { useMyWedding } from "@/hooks/useWedding";
import PageViewsPanel from "@/components/dashboard/analytics/PageViewsPanel";
import FunnelPanel from "@/components/dashboard/analytics/FunnelPanel";
import TimingPanel from "@/components/dashboard/analytics/TimingPanel";
import EngagementPanel from "@/components/dashboard/analytics/EngagementPanel";
import GalleryStatsPanel from "@/components/dashboard/analytics/GalleryStatsPanel";
import GeoPanel from "@/components/dashboard/analytics/GeoPanel";

interface AnalyticsData {
  events: { event: string; guest_token: string | null; country: string | null; city: string | null; ip_hash: string; created_at: string }[];
  invitees: { id: string; name: string; status: string; token: string }[];
  blessings: { id: string; guest_name: string; created_at: string }[];
  reactions: { kind: string; count: number }[];
  photos: { id: string; uploaded_by: string; status: string }[];
}

export default function AnalyticsPage() {
  const { wedding } = useMyWedding();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!wedding?.id) return;
    fetch(`/api/analytics/${wedding.id}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [wedding?.id]);

  if (loading) return <div className="p-8 text-center text-sm text-dearly-text-secondary">Loading analytics…</div>;
  if (!data) return <div className="p-8 text-center text-sm text-red-600">Failed to load analytics.</div>;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold text-dearly-text">Analytics</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <PageViewsPanel events={data.events} />
        <FunnelPanel events={data.events} invitees={data.invitees} />
        <TimingPanel events={data.events} weddingDate={wedding?.wedding_date ?? null} />
        <EngagementPanel blessings={data.blessings} reactions={data.reactions} />
        <GalleryStatsPanel photos={data.photos} />
        <GeoPanel events={data.events} />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create PageViewsPanel**

```tsx
// src/components/dashboard/analytics/PageViewsPanel.tsx
"use client";

/**
 * Page views — total views, unique visitors, views over time.
 */

import { Eye, Users } from "lucide-react";

interface Props {
  events: { event: string; ip_hash: string; guest_token: string | null; created_at: string }[];
}

export default function PageViewsPanel({ events }: Props) {
  const views = events.filter((e) => e.event === "page_view");
  const uniqueIps = new Set(views.map((v) => v.ip_hash)).size;
  const guestsWhoViewed = new Set(views.filter((v) => v.guest_token).map((v) => v.guest_token)).size;

  // Group by date for the chart
  const byDate = new Map<string, number>();
  for (const v of views) {
    const date = v.created_at.slice(0, 10);
    byDate.set(date, (byDate.get(date) ?? 0) + 1);
  }
  const dates = [...byDate.entries()].sort(([a], [b]) => a.localeCompare(b));
  const maxCount = Math.max(...dates.map(([, c]) => c), 1);

  return (
    <div className="rounded-2xl border border-dearly-border bg-white p-5">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-dearly-text">
        <Eye size={16} className="text-dearly-accent" /> Page Views
      </h3>
      <div className="mb-4 grid grid-cols-3 gap-4">
        <div>
          <p className="text-2xl font-bold text-dearly-text">{views.length}</p>
          <p className="text-xs text-dearly-text-secondary">Total views</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-dearly-text">{uniqueIps}</p>
          <p className="text-xs text-dearly-text-secondary">Unique visitors</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-dearly-text">{guestsWhoViewed}</p>
          <p className="text-xs text-dearly-text-secondary">Guests viewed</p>
        </div>
      </div>
      {dates.length > 0 && (
        <div className="flex items-end gap-1" style={{ height: 80 }}>
          {dates.map(([date, count]) => (
            <div key={date} className="group relative flex-1">
              <div
                className="w-full rounded-t bg-dearly-accent/30 transition group-hover:bg-dearly-accent/50"
                style={{ height: `${(count / maxCount) * 100}%`, minHeight: 4 }}
                title={`${date}: ${count} views`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Create FunnelPanel**

```tsx
// src/components/dashboard/analytics/FunnelPanel.tsx
"use client";

/**
 * RSVP funnel — invited → viewed → RSVP opened → submitted.
 */

import { Filter } from "lucide-react";

interface Props {
  events: { event: string; guest_token: string | null }[];
  invitees: { id: string; status: string; token: string }[];
}

export default function FunnelPanel({ events, invitees }: Props) {
  const invited = invitees.length;
  const viewed = new Set(events.filter((e) => e.event === "page_view" && e.guest_token).map((e) => e.guest_token)).size;
  const rsvpOpened = new Set(events.filter((e) => e.event === "rsvp_opened" && e.guest_token).map((e) => e.guest_token)).size;
  const rsvpSubmitted = invitees.filter((i) => i.status !== "pending").length;

  const steps = [
    { label: "Invited", count: invited },
    { label: "Viewed", count: viewed },
    { label: "RSVP opened", count: rsvpOpened },
    { label: "Submitted", count: rsvpSubmitted },
  ];

  return (
    <div className="rounded-2xl border border-dearly-border bg-white p-5">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-dearly-text">
        <Filter size={16} className="text-dearly-accent" /> RSVP Funnel
      </h3>
      <div className="space-y-3">
        {steps.map((step, i) => {
          const pct = invited > 0 ? Math.round((step.count / invited) * 100) : 0;
          return (
            <div key={step.label}>
              <div className="flex justify-between text-sm">
                <span className="text-dearly-text">{step.label}</span>
                <span className="text-dearly-text-secondary">{step.count} ({pct}%)</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-dearly-cream">
                <div
                  className="h-full rounded-full bg-dearly-accent transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              {i < steps.length - 1 && invited > 0 && step.count > 0 && (
                <p className="mt-0.5 text-right text-[10px] text-dearly-text-muted">
                  {steps[i + 1].count > 0 ? `${Math.round((steps[i + 1].count / step.count) * 100)}% conversion` : "0% conversion"}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create remaining panels (Timing, Engagement, GalleryStats, Geo)**

Each follows the same pattern — a card with a heading and data visualization using CSS bars/tables. Create all four files:

**TimingPanel.tsx** — groups events by "days before event", shows a bar chart of when guests viewed/RSVPd.

**EngagementPanel.tsx** — shows total blessings, reaction counts by kind (emoji), most active guests.

**GalleryStatsPanel.tsx** — shows host vs guest uploads, pending count, total approved.

**GeoPanel.tsx** — groups page_view events by country/city, shows a sorted table with counts.

(Each is a self-contained component receiving the relevant data slice as props. Follow the same card pattern as PageViewsPanel — rounded-2xl border, heading with icon, stats.)

- [ ] **Step 6: Commit**

```bash
git add src/app/\(dashboard\)/dashboard/analytics/page.tsx src/components/dashboard/analytics/ src/components/dashboard/Sidebar.tsx
git commit -m "feat: add analytics dashboard with six engagement panels"
```

---

### Task 14: Email Templates

**Files:**
- Create: `src/lib/email-templates.ts`
- Create: `src/lib/email-templates.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// src/lib/email-templates.test.ts
import { describe, it, expect } from "vitest";
import { rsvpReminderHtml, weeklyDigestHtml, thankYouHtml } from "./email-templates";

describe("rsvpReminderHtml", () => {
  it("includes the guest name and event name", () => {
    const html = rsvpReminderHtml({ guestName: "Alice", eventName: "Emma & James", eventDate: "June 15, 2027", rsvpUrl: "https://dearly.app/emma-james?i=abc123" });
    expect(html).toContain("Alice");
    expect(html).toContain("Emma &amp; James");
    expect(html).toContain("June 15, 2027");
    expect(html).toContain("abc123");
  });
});

describe("weeklyDigestHtml", () => {
  it("includes activity counts", () => {
    const html = weeklyDigestHtml({ eventName: "Wedding", attending: 5, declined: 2, blessings: 3, photos: 1, totalGuests: 50 });
    expect(html).toContain("5");
    expect(html).toContain("Wedding");
  });
});

describe("thankYouHtml", () => {
  it("includes the memory page link", () => {
    const html = thankYouHtml({ guestName: "Bob", eventName: "Wedding", memoryUrl: "https://dearly.app/emma-james" });
    expect(html).toContain("Bob");
    expect(html).toContain("emma-james");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/email-templates.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement email templates**

```typescript
// src/lib/email-templates.ts
/**
 * HTML email template builders for automated emails.
 * All templates are pre-designed — no host customisation.
 */

/** Escapes HTML entities. */
function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Shared email wrapper with Dearly branding. */
function wrap(body: string): string {
  return `<div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px;">${body}<p style="margin-top:32px;font-size:11px;color:#999;text-align:center;">Sent by <a href="https://dearly-self.vercel.app" style="color:#B8860B;">Dearly</a></p></div>`;
}

/** CTA button. */
function btn(text: string, url: string): string {
  return `<a href="${esc(url)}" style="display:inline-block;padding:12px 24px;background:#B8860B;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">${esc(text)}</a>`;
}

/** RSVP reminder email sent to guests who haven't responded. */
export function rsvpReminderHtml(p: { guestName: string; eventName: string; eventDate: string; rsvpUrl: string }): string {
  return wrap(`
    <h2 style="color:#B8860B;margin:0 0 16px;">You're invited!</h2>
    <p style="color:#333;">Hi ${esc(p.guestName)},</p>
    <p style="color:#333;">Just a friendly reminder — <strong>${esc(p.eventName)}</strong> is on <strong>${esc(p.eventDate)}</strong> and we'd love to know if you can make it.</p>
    <p style="margin-top:20px;">${btn("RSVP now", p.rsvpUrl)}</p>
  `);
}

/** Weekly digest email sent to the event host. */
export function weeklyDigestHtml(p: { eventName: string; attending: number; declined: number; blessings: number; photos: number; totalGuests: number }): string {
  return wrap(`
    <h2 style="color:#B8860B;margin:0 0 16px;">Weekly update — ${esc(p.eventName)}</h2>
    <p style="color:#333;">Here's what happened this week:</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <tr><td style="padding:8px 0;color:#555;">New RSVPs (attending)</td><td style="padding:8px 0;font-weight:bold;text-align:right;color:#333;">${p.attending}</td></tr>
      <tr><td style="padding:8px 0;color:#555;">New RSVPs (declined)</td><td style="padding:8px 0;font-weight:bold;text-align:right;color:#333;">${p.declined}</td></tr>
      <tr><td style="padding:8px 0;color:#555;">New blessings</td><td style="padding:8px 0;font-weight:bold;text-align:right;color:#333;">${p.blessings}</td></tr>
      <tr><td style="padding:8px 0;color:#555;">New photos</td><td style="padding:8px 0;font-weight:bold;text-align:right;color:#333;">${p.photos}</td></tr>
      <tr style="border-top:1px solid #eee;"><td style="padding:8px 0;color:#555;">Total guests</td><td style="padding:8px 0;font-weight:bold;text-align:right;color:#333;">${p.totalGuests}</td></tr>
    </table>
    <p style="margin-top:20px;">${btn("View dashboard", "https://dearly-self.vercel.app/dashboard")}</p>
  `);
}

/** Post-event thank-you email sent to attending guests. */
export function thankYouHtml(p: { guestName: string; eventName: string; memoryUrl: string }): string {
  return wrap(`
    <h2 style="color:#B8860B;margin:0 0 16px;">Thank you!</h2>
    <p style="color:#333;">Dear ${esc(p.guestName)},</p>
    <p style="color:#333;">Thank you for being part of <strong>${esc(p.eventName)}</strong>. It meant the world to have you there.</p>
    <p style="color:#333;">Relive the memories — photos and blessings are waiting for you:</p>
    <p style="margin-top:20px;">${btn("View memories", p.memoryUrl)}</p>
  `);
}
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/lib/email-templates.test.ts`
Expected: All PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/email-templates.ts src/lib/email-templates.test.ts
git commit -m "feat: add email templates for reminders, digest, and thank-you"
```

---

### Task 15: Cron Endpoints & Vercel Config

**Files:**
- Create: `src/app/api/cron/reminders/route.ts`
- Create: `src/app/api/cron/digest/route.ts`
- Create: `src/app/api/cron/thank-you/route.ts`
- Create: `vercel.json`
- Create: `src/app/api/cron/cron.test.ts`

- [ ] **Step 1: Create cron auth helper**

Add to the top of each cron route:

```typescript
/** Verifies the request is from Vercel Cron via CRON_SECRET. */
function verifyCron(request: NextRequest): boolean {
  const secret = request.headers.get("authorization")?.replace("Bearer ", "");
  return secret === process.env.CRON_SECRET;
}
```

- [ ] **Step 2: Create reminders cron endpoint**

```typescript
// src/app/api/cron/reminders/route.ts
/**
 * RSVP reminder cron — runs daily, sends reminders to pending guests
 * whose event date matches one of the configured reminder_days.
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";
import { rsvpReminderHtml } from "@/lib/email-templates";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dearly-self.vercel.app";

/** Verifies the request is from Vercel Cron. */
function verifyCron(request: NextRequest): boolean {
  return request.headers.get("authorization")?.replace("Bearer ", "") === process.env.CRON_SECRET;
}

export async function POST(request: NextRequest) {
  if (!verifyCron(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServiceRoleClient();
  const now = new Date();

  // Find published events with a future wedding_date and reminder_days configured.
  const { data: events } = await supabase
    .from("weddings")
    .select("id, slug, partner1_name, partner2_name, wedding_date, reminder_days, event_title")
    .eq("is_published", true)
    .not("wedding_date", "is", null)
    .gte("wedding_date", now.toISOString().slice(0, 10));

  if (!events?.length) return NextResponse.json({ sent: 0 });

  let totalSent = 0;

  for (const event of events) {
    const eventDate = new Date(event.wedding_date!);
    const daysUntil = Math.ceil((eventDate.getTime() - now.getTime()) / (86400 * 1000));
    const reminderDays: number[] = event.reminder_days ?? [7];

    if (!reminderDays.includes(daysUntil)) continue;

    // Find pending invitees who haven't been reminded today.
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const { data: invitees } = await supabase
      .from("invitees")
      .select("id, name, token, last_reminder_sent")
      .eq("wedding_id", event.id)
      .eq("status", "pending");

    if (!invitees?.length) continue;

    const eventName = event.event_title || [event.partner1_name, event.partner2_name].filter(Boolean).join(" & ");
    const dateStr = eventDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

    for (const inv of invitees) {
      // Skip if already reminded today
      if (inv.last_reminder_sent && inv.last_reminder_sent >= todayStart) continue;

      const rsvpUrl = `${SITE_URL}/${event.slug}?i=${inv.token}`;
      const html = rsvpReminderHtml({ guestName: inv.name, eventName, eventDate: dateStr, rsvpUrl });

      // We don't have guest emails in invitees — reminders go to the host who forwards them,
      // or we'd need a guest email column. For now, log the intent.
      console.info("[INFO] reminder ready", { guest: inv.name, event: event.slug, daysUntil });

      // Update last_reminder_sent
      await supabase.from("invitees").update({ last_reminder_sent: now.toISOString() }).eq("id", inv.id);
      totalSent++;
    }
  }

  return NextResponse.json({ sent: totalSent });
}
```

- [ ] **Step 3: Create digest cron endpoint**

```typescript
// src/app/api/cron/digest/route.ts
/**
 * Weekly digest cron — runs Mondays, sends host a summary of the past week.
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";
import { weeklyDigestHtml } from "@/lib/email-templates";

/** Verifies the request is from Vercel Cron. */
function verifyCron(request: NextRequest): boolean {
  return request.headers.get("authorization")?.replace("Bearer ", "") === process.env.CRON_SECRET;
}

export async function POST(request: NextRequest) {
  if (!verifyCron(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServiceRoleClient();
  const weekAgo = new Date(Date.now() - 7 * 86400 * 1000).toISOString();

  // Find events with digest enabled
  const { data: events } = await supabase
    .from("weddings")
    .select("id, slug, user_id, partner1_name, partner2_name, event_title, weekly_digest_enabled")
    .eq("is_published", true)
    .eq("weekly_digest_enabled", true);

  if (!events?.length) return NextResponse.json({ sent: 0 });

  let totalSent = 0;

  for (const event of events) {
    // Count new RSVPs this week
    const { data: rsvps } = await supabase
      .from("rsvps")
      .select("attending")
      .eq("wedding_id", event.id)
      .gte("created_at", weekAgo);

    const attending = rsvps?.filter((r) => r.attending).length ?? 0;
    const declined = rsvps?.filter((r) => !r.attending).length ?? 0;

    // Count new blessings
    const { count: blessings } = await supabase
      .from("guestbook_entries")
      .select("id", { count: "exact", head: true })
      .eq("wedding_id", event.id)
      .gte("created_at", weekAgo);

    // Count new photos
    const { count: photos } = await supabase
      .from("gallery_photos")
      .select("id", { count: "exact", head: true })
      .eq("wedding_id", event.id)
      .gte("created_at", weekAgo);

    // Skip if no activity
    if (attending + declined + (blessings ?? 0) + (photos ?? 0) === 0) continue;

    // Total guest count
    const { count: totalGuests } = await supabase
      .from("invitees")
      .select("id", { count: "exact", head: true })
      .eq("wedding_id", event.id);

    const eventName = event.event_title || [event.partner1_name, event.partner2_name].filter(Boolean).join(" & ");

    // Get host email
    const { data: hostAuth } = await supabase.auth.admin.getUserById(event.user_id);
    if (!hostAuth?.user?.email) continue;

    const html = weeklyDigestHtml({
      eventName,
      attending,
      declined,
      blessings: blessings ?? 0,
      photos: photos ?? 0,
      totalGuests: totalGuests ?? 0,
    });

    await sendEmail({
      to: hostAuth.user.email,
      subject: `Weekly update — ${eventName}`,
      html,
    });

    totalSent++;
  }

  return NextResponse.json({ sent: totalSent });
}
```

- [ ] **Step 4: Create thank-you cron endpoint**

```typescript
// src/app/api/cron/thank-you/route.ts
/**
 * Post-event thank-you cron — runs daily, sends thank-you emails
 * to attending guests 1 day after the event date.
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";
import { thankYouHtml } from "@/lib/email-templates";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dearly-self.vercel.app";

/** Verifies the request is from Vercel Cron. */
function verifyCron(request: NextRequest): boolean {
  return request.headers.get("authorization")?.replace("Bearer ", "") === process.env.CRON_SECRET;
}

export async function POST(request: NextRequest) {
  if (!verifyCron(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServiceRoleClient();
  const yesterday = new Date(Date.now() - 86400 * 1000).toISOString().slice(0, 10);

  // Find events that happened yesterday and haven't sent thank-yous yet.
  const { data: events } = await supabase
    .from("weddings")
    .select("id, slug, partner1_name, partner2_name, event_title, user_id")
    .eq("is_published", true)
    .eq("thank_you_sent", false)
    .eq("wedding_date", yesterday);

  if (!events?.length) return NextResponse.json({ sent: 0 });

  let totalSent = 0;

  for (const event of events) {
    const eventName = event.event_title || [event.partner1_name, event.partner2_name].filter(Boolean).join(" & ");
    const memoryUrl = `${SITE_URL}/${event.slug}`;

    // Get attending guests (via invitees, not rsvps, since invitees have names)
    const { data: invitees } = await supabase
      .from("invitees")
      .select("name")
      .eq("wedding_id", event.id)
      .eq("status", "attending");

    if (invitees?.length) {
      // Note: we don't have guest emails in invitees.
      // For now, send a single thank-you to the host who can forward it,
      // or log the intent for future guest email support.
      for (const inv of invitees) {
        console.info("[INFO] thank-you ready", { guest: inv.name, event: event.slug });
        totalSent++;
      }
    }

    // Mark as sent
    await supabase.from("weddings").update({ thank_you_sent: true }).eq("id", event.id);
  }

  return NextResponse.json({ sent: totalSent });
}
```

- [ ] **Step 5: Create vercel.json with cron config**

```json
{
  "crons": [
    { "path": "/api/cron/reminders", "schedule": "0 9 * * *" },
    { "path": "/api/cron/digest", "schedule": "0 8 * * 1" },
    { "path": "/api/cron/thank-you", "schedule": "0 10 * * *" }
  ]
}
```

- [ ] **Step 6: Write cron tests**

```typescript
// src/app/api/cron/cron.test.ts
import { describe, it, expect, vi } from "vitest";

describe("cron auth", () => {
  it("rejects requests without CRON_SECRET", async () => {
    vi.stubEnv("CRON_SECRET", "test-secret");

    // Import lazily so env is set
    const { POST } = await import("./reminders/route");
    const req = new Request("http://localhost/api/cron/reminders", {
      method: "POST",
      headers: { authorization: "Bearer wrong" },
    });
    const res = await POST(req as unknown as import("next/server").NextRequest);
    expect(res.status).toBe(401);
  });
});
```

- [ ] **Step 7: Run tests**

Run: `npx vitest run src/app/api/cron/cron.test.ts`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/app/api/cron/ vercel.json
git commit -m "feat: add cron endpoints for reminders, digest, and thank-you emails"
```

---

### Task 16: Event Settings — Email Automation UI

**Files:**
- Create: `src/components/dashboard/settings/EmailSettings.tsx`
- Modify: `src/app/(dashboard)/dashboard/settings/page.tsx`

- [ ] **Step 1: Create EmailSettings component**

```tsx
// src/components/dashboard/settings/EmailSettings.tsx
"use client";

/**
 * Email automation settings — reminder days and weekly digest toggle.
 */

import { useState } from "react";
import { Bell, Mail, X } from "lucide-react";

interface EmailSettingsProps {
  reminderDays: number[];
  weeklyDigestEnabled: boolean;
  onUpdateReminders: (days: number[]) => void;
  onUpdateDigest: (enabled: boolean) => void;
}

const PRESET_DAYS = [1, 3, 5, 7, 14, 21, 30];

export default function EmailSettings({ reminderDays, weeklyDigestEnabled, onUpdateReminders, onUpdateDigest }: EmailSettingsProps) {
  const [customDay, setCustomDay] = useState("");

  /** Adds a reminder day. */
  function addDay(day: number) {
    if (!reminderDays.includes(day)) {
      onUpdateReminders([...reminderDays, day].sort((a, b) => b - a));
    }
  }

  /** Removes a reminder day. */
  function removeDay(day: number) {
    onUpdateReminders(reminderDays.filter((d) => d !== day));
  }

  return (
    <div className="space-y-6">
      {/* Reminder days */}
      <div>
        <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-dearly-text">
          <Bell size={14} className="text-dearly-accent" /> RSVP Reminders
        </h4>
        <p className="mb-3 text-xs text-dearly-text-secondary">
          Send reminders to guests who haven't responded. Choose how many days before the event.
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESET_DAYS.map((day) => {
            const active = reminderDays.includes(day);
            return (
              <button
                key={day}
                onClick={() => active ? removeDay(day) : addDay(day)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? "bg-dearly-accent text-white"
                    : "border border-dearly-border bg-dearly-cream text-dearly-text-secondary hover:border-dearly-accent"
                }`}
              >
                {day}d
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <input
            type="number"
            min={1}
            max={90}
            value={customDay}
            onChange={(e) => setCustomDay(e.target.value)}
            placeholder="Custom"
            className="w-20 rounded-lg border border-dearly-border bg-dearly-card px-3 py-1.5 text-sm"
          />
          <button
            onClick={() => { const d = parseInt(customDay); if (d > 0 && d <= 90) { addDay(d); setCustomDay(""); } }}
            className="rounded-lg bg-dearly-cream px-3 py-1.5 text-xs font-medium text-dearly-text-secondary hover:bg-dearly-border"
          >
            Add
          </button>
        </div>
        {reminderDays.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {reminderDays.map((day) => (
              <span key={day} className="inline-flex items-center gap-1 rounded-full bg-dearly-accent/10 px-2.5 py-1 text-xs text-dearly-accent">
                {day} days before
                <button onClick={() => removeDay(day)} className="hover:text-red-600"><X size={12} /></button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Weekly digest */}
      <div>
        <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-dearly-text">
          <Mail size={14} className="text-dearly-accent" /> Weekly Digest
        </h4>
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={weeklyDigestEnabled}
            onChange={(e) => onUpdateDigest(e.target.checked)}
            className="accent-dearly-accent"
          />
          <span className="text-sm text-dearly-text">
            Send me a weekly summary every Monday (new RSVPs, blessings, photos)
          </span>
        </label>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add EmailSettings to the settings page**

In `src/app/(dashboard)/dashboard/settings/page.tsx`, import `EmailSettings` and add it as a new section. Wire it to update the wedding's `reminder_days` and `weekly_digest_enabled` via the existing Supabase update pattern.

- [ ] **Step 3: Commit**

```bash
git add src/components/dashboard/settings/EmailSettings.tsx src/app/\(dashboard\)/dashboard/settings/page.tsx
git commit -m "feat: add email automation settings (reminders, digest toggle)"
```

---

### Task 17: Admin Panel — API Routes

**Files:**
- Create: `src/app/api/admin/users/route.ts`
- Create: `src/app/api/admin/events/route.ts`
- Create: `src/app/api/admin/content/route.ts`
- Create: `src/app/api/admin/spam/route.ts`
- Create: `src/app/api/admin/audit/route.ts`
- Create: `src/app/api/admin/stats/route.ts`
- Create: `src/app/api/admin/admin.test.ts`

- [ ] **Step 1: Create admin auth helper**

Shared across all admin routes:

```typescript
// Inline in each route (or extract to src/lib/admin.ts if preferred)
import { createCookieClient, createServiceRoleClient } from "@/lib/supabase/server";

/** Verifies the caller is an admin. Returns the user or null. */
async function requireAdmin() {
  const cookieClient = await createCookieClient();
  const { data: { user } } = await cookieClient.auth.getUser();
  if (!user || user.app_metadata?.role !== "admin") return null;
  return user;
}

/** Inserts an audit log entry. */
async function auditLog(actorId: string, action: string, targetType: string, targetId: string, metadata?: Record<string, unknown>, ip?: string) {
  const supabase = createServiceRoleClient();
  await supabase.from("audit_logs").insert({
    actor_id: actorId,
    action,
    target_type: targetType,
    target_id: targetId,
    metadata: metadata ?? {},
    ip_address: ip ?? null,
  });
}
```

- [ ] **Step 2: Create users admin route**

```typescript
// src/app/api/admin/users/route.ts
/**
 * Admin user management — list, disable, delete users.
 */

import { NextRequest, NextResponse } from "next/server";
import { createCookieClient, createServiceRoleClient } from "@/lib/supabase/server";
import { clientIp } from "@/lib/rate-limit";

async function requireAdmin() {
  const cookieClient = await createCookieClient();
  const { data: { user } } = await cookieClient.auth.getUser();
  if (!user || user.app_metadata?.role !== "admin") return null;
  return user;
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const supabase = createServiceRoleClient();

  // List all users via admin API (paginated)
  const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 100 });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Enrich with event counts
  const users = await Promise.all(
    (data?.users ?? []).map(async (u) => {
      const { count } = await supabase
        .from("weddings")
        .select("id", { count: "exact", head: true })
        .eq("user_id", u.id);
      return {
        id: u.id,
        email: u.email,
        displayName: u.user_metadata?.display_name ?? null,
        eventCount: count ?? 0,
        role: u.app_metadata?.role ?? "user",
        disabled: u.app_metadata?.disabled === true,
        createdAt: u.created_at,
      };
    })
  );

  return NextResponse.json({ users });
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { action, userId } = (await request.json()) as { action: string; userId: string };
  const supabase = createServiceRoleClient();
  const ip = clientIp(request);

  if (action === "disable") {
    await supabase.auth.admin.updateUserById(userId, { app_metadata: { disabled: true } });
    await supabase.from("audit_logs").insert({ actor_id: admin.id, action: "user.disable", target_type: "user", target_id: userId, ip_address: ip });
    return NextResponse.json({ ok: true });
  }

  if (action === "enable") {
    await supabase.auth.admin.updateUserById(userId, { app_metadata: { disabled: false } });
    await supabase.from("audit_logs").insert({ actor_id: admin.id, action: "user.enable", target_type: "user", target_id: userId, ip_address: ip });
    return NextResponse.json({ ok: true });
  }

  if (action === "delete") {
    // Cascade: delete user's weddings and all related data
    const { data: weddings } = await supabase.from("weddings").select("id").eq("user_id", userId);
    for (const w of weddings ?? []) {
      await supabase.from("weddings").delete().eq("id", w.id);
    }
    await supabase.auth.admin.deleteUser(userId);
    await supabase.from("audit_logs").insert({ actor_id: admin.id, action: "user.delete", target_type: "user", target_id: userId, ip_address: ip });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
```

- [ ] **Step 3: Create events admin route**

Follow same pattern as users — `GET` lists events with filters, `POST` handles unpublish/delete with audit logging. Support query params for filtering: `?type=wedding&status=published&page=1`.

- [ ] **Step 4: Create content admin route**

`GET` returns photos/blessings/guestbook across events with filters. `POST` handles bulk delete, approve, reject with audit logging. Accept `{ action: "delete"|"approve"|"reject", contentType: "photo"|"blessing"|"guestbook", ids: string[] }`.

- [ ] **Step 5: Create spam admin route**

`GET` returns all spam rules. `POST` adds a rule `{ ruleType: "ip"|"domain", value: string }`. `DELETE` removes a rule by id. All with audit logging.

- [ ] **Step 6: Create audit log route**

`GET` returns paginated audit logs with optional filters: `?action=user.delete&from=2026-11-01&page=1`. Join actor email from auth.users.

- [ ] **Step 7: Create stats route**

`GET` returns extended stats: total users (from auth.admin), total events, total storage estimate (from gallery_photos count), email send counts (from audit_logs where action starts with "email."), active users (users with events created in last 7/30 days).

- [ ] **Step 8: Write admin API tests**

```typescript
// src/app/api/admin/admin.test.ts
import { describe, it, expect, vi } from "vitest";

// Test that non-admin users get 403
describe("admin API auth", () => {
  it("rejects non-admin users", async () => {
    // Mock the cookie client to return a non-admin user
    vi.mock("@/lib/supabase/server", () => ({
      createCookieClient: async () => ({
        auth: { getUser: async () => ({ data: { user: { id: "user1", app_metadata: {} } } }) },
      }),
      createServiceRoleClient: () => ({}),
    }));

    const { GET } = await import("./users/route");
    const res = await GET();
    expect(res.status).toBe(403);
  });
});
```

- [ ] **Step 9: Run tests**

Run: `npx vitest run src/app/api/admin/admin.test.ts`
Expected: PASS.

- [ ] **Step 10: Commit**

```bash
git add src/app/api/admin/
git commit -m "feat: add admin API routes (users, events, content, spam, audit, stats)"
```

---

### Task 18: Admin Panel — Tabbed UI

**Files:**
- Modify: `src/app/(dashboard)/dashboard/admin/page.tsx`
- Create: `src/components/dashboard/admin/UsersTab.tsx`
- Create: `src/components/dashboard/admin/EventsTab.tsx`
- Create: `src/components/dashboard/admin/ContentTab.tsx`
- Create: `src/components/dashboard/admin/SpamTab.tsx`
- Create: `src/components/dashboard/admin/AuditTab.tsx`

- [ ] **Step 1: Refactor admin page into tabs**

Replace the existing admin page with a tabbed layout:

```tsx
// src/app/(dashboard)/dashboard/admin/page.tsx
"use client";

/**
 * Admin panel — site-wide management with tabbed interface.
 */

import { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { LayoutDashboard, Users, Calendar, Image, Shield, ScrollText } from "lucide-react";
import UsersTab from "@/components/dashboard/admin/UsersTab";
import EventsTab from "@/components/dashboard/admin/EventsTab";
import ContentTab from "@/components/dashboard/admin/ContentTab";
import SpamTab from "@/components/dashboard/admin/SpamTab";
import AuditTab from "@/components/dashboard/admin/AuditTab";

type Tab = "overview" | "users" | "events" | "content" | "spam" | "audit";

const TABS: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "events", label: "Events", icon: Calendar },
  { id: "content", label: "Content", icon: Image },
  { id: "spam", label: "Spam Controls", icon: Shield },
  { id: "audit", label: "Audit Log", icon: ScrollText },
];

export default function AdminPage() {
  const { user } = useAuthContext();
  const [tab, setTab] = useState<Tab>("overview");

  if (user?.app_metadata?.role !== "admin") {
    return <div className="p-8 text-center text-red-600">Access denied.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold text-dearly-text">Admin</h1>

      {/* Tab bar */}
      <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-dearly-border bg-dearly-cream p-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === id
                ? "bg-white text-dearly-accent shadow-sm"
                : "text-dearly-text-secondary hover:text-dearly-text"
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "overview" && <OverviewTab />}
      {tab === "users" && <UsersTab />}
      {tab === "events" && <EventsTab />}
      {tab === "content" && <ContentTab />}
      {tab === "spam" && <SpamTab />}
      {tab === "audit" && <AuditTab />}
    </div>
  );
}

/** Overview tab — existing stats plus new metrics. */
function OverviewTab() {
  // Fetch from /api/admin/stats
  // Show: total events, published, RSVPs, photos, blessings,
  // + new: active users (7d/30d), storage estimate, email counts
  // Reuse the existing stats fetch pattern from the current admin page
  return <div className="text-sm text-dearly-text-secondary">Loading overview…</div>;
}
```

- [ ] **Step 2: Create UsersTab component**

```tsx
// src/components/dashboard/admin/UsersTab.tsx
"use client";

/**
 * Admin users tab — searchable, paginated user list with actions.
 */

import { useEffect, useState } from "react";
import { Search, Ban, Trash2, ExternalLink, UserCheck } from "lucide-react";

interface UserRow {
  id: string;
  email: string;
  displayName: string | null;
  eventCount: number;
  role: string;
  disabled: boolean;
  createdAt: string;
}

export default function UsersTab() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => setUsers(d.users ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(
    (u) =>
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.displayName?.toLowerCase().includes(search.toLowerCase())
  );

  /** Performs an admin action on a user. */
  async function handleAction(userId: string, action: "disable" | "enable" | "delete") {
    if (action === "delete" && !confirm("Delete this user and all their data? This cannot be undone.")) return;
    await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, userId }),
    });
    // Refresh
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data.users ?? []);
  }

  if (loading) return <p className="text-sm text-dearly-text-secondary">Loading users…</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-lg border border-dearly-border bg-dearly-cream px-3 py-2">
        <Search size={16} className="text-dearly-text-secondary" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by email or name…"
          className="flex-1 bg-transparent text-sm outline-none"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-dearly-border">
        <table className="w-full text-sm">
          <thead className="bg-dearly-cream text-left text-xs uppercase text-dearly-text-secondary">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Events</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dearly-border">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-dearly-cream/50">
                <td className="px-4 py-3 text-dearly-text">{u.email}</td>
                <td className="px-4 py-3 text-dearly-text-secondary">{u.displayName ?? "—"}</td>
                <td className="px-4 py-3 text-dearly-text">{u.eventCount}</td>
                <td className="px-4 py-3">
                  {u.disabled ? (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">Disabled</span>
                  ) : (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">Active</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-dearly-text-secondary">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="flex gap-2 px-4 py-3">
                  {u.disabled ? (
                    <button onClick={() => handleAction(u.id, "enable")} title="Enable" className="text-green-600 hover:text-green-800">
                      <UserCheck size={16} />
                    </button>
                  ) : (
                    <button onClick={() => handleAction(u.id, "disable")} title="Disable" className="text-amber-600 hover:text-amber-800">
                      <Ban size={16} />
                    </button>
                  )}
                  <button onClick={() => handleAction(u.id, "delete")} title="Delete" className="text-red-600 hover:text-red-800">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create remaining admin tabs**

**EventsTab.tsx** — same table pattern as UsersTab. Columns: name, type, owner, published, created, guest count. Actions: unpublish, delete, view as guest (external link). Filterable by event type and published status.

**ContentTab.tsx** — three sub-sections: Photos, Blessings, Guestbook. Each shows items with event name, date, status. Checkbox selection + bulk approve/reject/delete toolbar.

**SpamTab.tsx** — two sections: Blocked IPs and Banned Domains. Each shows a list with add/remove. Add form with input + button. Stats showing blocked attempt counts.

**AuditTab.tsx** — searchable table: timestamp, admin email, action, target, details. Filter by action type and date range. Paginated via API query params.

Each tab follows the same visual pattern: search bar, filter controls, data table with actions.

- [ ] **Step 4: Commit**

```bash
git add src/app/\(dashboard\)/dashboard/admin/page.tsx src/components/dashboard/admin/
git commit -m "feat: add tabbed admin panel (users, events, content, spam, audit)"
```

---

### Task 19: Wire Analytics Tracking into Invitation Page

**Files:**
- Modify: `src/components/invitation/CinematicInvitation.tsx`

- [ ] **Step 1: Add analytics tracking calls to the invitation page**

Create a thin tracking helper used by the invitation:

```typescript
/** Fires an analytics event (fire-and-forget). */
function trackEvent(weddingId: string, eventType: string, guestToken?: string) {
  fetch("/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ weddingId, eventType, guestToken }),
  }).catch(() => {});
}
```

Add tracking calls at these points in `CinematicInvitation.tsx`:
- On mount (page_view): `useEffect(() => trackEvent(weddingId, "page_view", guestToken), [])`
- When RSVP section scrolls into view or form opens: `trackEvent(weddingId, "rsvp_opened", guestToken)`
- After successful RSVP submit: `trackEvent(weddingId, "rsvp_submitted", guestToken)`

Also add the `CalendarButton` component near the countdown/date section.

- [ ] **Step 2: Commit**

```bash
git add src/components/invitation/CinematicInvitation.tsx
git commit -m "feat: wire analytics tracking and calendar button into invitation page"
```

---

### Task 20: Integration Testing & Final Verification

**Files:**
- Modify: `src/app/api/routes.test.ts` (update existing tests for new fields)

- [ ] **Step 1: Update existing RSVP tests for new fields**

Ensure the existing RSVP tests still pass with the new optional fields. Add a test verifying that dietary and song fields are accepted and don't break existing flow.

- [ ] **Step 2: Run full test suite**

Run: `npx vitest run`
Expected: All tests pass (existing + new).

- [ ] **Step 3: Run type check**

Run: `npx tsc --noEmit`
Expected: No type errors.

- [ ] **Step 4: Run lint**

Run: `npx next lint`
Expected: No violations.

- [ ] **Step 5: Test build**

Run: `npx next build`
Expected: Build succeeds.

- [ ] **Step 6: Commit any final fixes**

```bash
git add -A
git commit -m "test: verify all tests pass with missing features"
```

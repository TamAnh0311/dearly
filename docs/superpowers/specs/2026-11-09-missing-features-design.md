# Dearly — Missing Features Design Spec

**Date:** 2026-11-09
**Scope:** All missing features except billing/payments

---

## 1. Database & Schema Changes

### New Tables

#### `audit_logs`
Append-only log of all admin actions.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid, PK | |
| `actor_id` | uuid, FK → auth.users | Admin who performed action |
| `action` | text | e.g., `user.disable`, `event.unpublish`, `content.delete`, `spam.block_ip` |
| `target_type` | text | `user`, `event`, `photo`, `blessing`, `guestbook`, `ip`, `domain` |
| `target_id` | text | ID of affected record |
| `metadata` | jsonb | Additional context (reason, old values, etc.) |
| `ip_address` | inet | Admin's IP |
| `created_at` | timestamptz | Default `now()` |

RLS: read-only for admins, no public access. No updates or deletes.

#### `spam_rules`
Stores blocked IPs and banned email domains for spam prevention.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid, PK | |
| `rule_type` | text | `ip` or `domain` |
| `value` | text | IP address or email domain |
| `created_by` | uuid, FK → auth.users | Admin who created rule |
| `created_at` | timestamptz | Default `now()` |

RLS: read/write for admins only.

#### `analytics_events`
Tracks guest engagement on invitation pages.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid, PK | |
| `event_id` | uuid, FK → weddings | Which event/invitation |
| `guest_token` | text, nullable | Links to guest if from personal link |
| `event_type` | text | `page_view`, `rsvp_opened`, `rsvp_submitted`, `blessing_sent`, `reaction_sent`, `photo_viewed` |
| `metadata` | jsonb | Extra data (referrer, device, etc.) |
| `country` | text, nullable | Resolved from IP server-side |
| `city` | text, nullable | Resolved from IP server-side |
| `ip_hash` | text | Hashed IP for deduplication (not raw IP for privacy) |
| `created_at` | timestamptz | Default `now()` |

RLS: insert for anon (rate-limited via RPC), read for event owner + admin.

### Altered Tables

#### `guests`
- Add `dietary_restrictions` (text, nullable)
- Add `song_request` (text, nullable)
- Add `last_reminder_sent` (timestamptz, nullable)

#### `weddings` table (new columns)
- Add `reminder_days` (integer[], default `{7}`) — days before event to send reminders
- Add `weekly_digest_enabled` (boolean, default true)
- Add `thank_you_sent` (boolean, default false)

#### `customization` JSONB (within `weddings`)
- Add section toggles in `customization.sections`: `dietary`, `songRequest`

#### `photos`
- Add `media_type` (text, default `'image'`) — values: `image`, `video`
- Add `video_url` (text, nullable) — YouTube/Vimeo URL for video entries

### New Storage Bucket
- `gift-qr-images` — for uploaded QR code images in gift section

---

## 2. Guest Data Collection

### RSVP Form
- Two new optional fields shown when guest selects "attending":
  - **Dietary restrictions** — dropdown: None, Vegetarian, Vegan, Halal, Kosher, Gluten-free, Other (free text). Single select + "Other" shows text input.
  - **Song request** — text input, placeholder: "Any song you'd like to hear?"
- Both controlled by section toggles (`customization.sections.dietary`, `customization.sections.songRequest`)
- Default: off (host enables in editor)

### API Changes
- `POST /api/rsvp` — accept `dietary_restrictions` and `song_request` fields
- Validation: `dietary_restrictions` max 200 chars, `song_request` max 200 chars
- Guest list CSV export includes new columns

### Dashboard
- Guest management table shows dietary + song request columns
- Filterable by dietary restriction type

---

## 3. Video Support

### How It Works
- Host pastes YouTube or Vimeo URL in gallery section of event editor
- App extracts video ID, validates domain (youtube.com, youtu.be, vimeo.com only)
- Stored as a `photos` record with `media_type: 'video'`, `video_url` set, no file upload
- Thumbnail fetched via oEmbed API (YouTube/Vimeo) and stored as the photo `url`
- Counts toward plan photo limits (1 video = 1 item)

### Editor UI
- "Add video" button next to existing photo upload in gallery section
- Modal: paste URL → preview embed → save
- Validation rejects non-YouTube/Vimeo URLs

### Guest-Facing
- Videos appear in masonry grid with play icon overlay on thumbnail
- Click opens inline embedded iframe (responsive, lazy-loaded)
- Respects reduced-motion preferences (no autoplay)

---

## 4. Music Library UI

### Design
- Keep existing generative music presets unchanged
- Add "Link your own music" option in music section of event editor
- Host pastes a direct audio URL (MP3, WAV, OGG)
- Preview playback in editor before saving
- Existing uploaded audio files (Supabase storage) continue to work — no changes to that path
- No upload UI, no music catalog/browse feature

---

## 5. Email Automation

All emails use Resend (existing integration). Gracefully degrade if `RESEND_API_KEY` not set. All templated — no host customization of content.

### 5.1 RSVP Reminders
- Host configures `reminder_days` in event settings (e.g., `[14, 7, 3]`)
- Cron endpoint: `POST /api/cron/reminders` (secured with `CRON_SECRET`)
- Runs daily, checks events with upcoming dates matching reminder intervals
- Sends to guests with status `pending` only
- Tracks `last_reminder_sent` per guest to avoid duplicates
- Email content: event name, date, personal invitation link, RSVP CTA button

### 5.2 Weekly Admin Digest
- Sent every Monday to event host
- Cron endpoint: `POST /api/cron/digest`
- Summarizes past 7 days: new RSVPs (attending count, declined count), new blessings, new photos, total guest stats
- Only sent if there's activity (skip empty weeks)
- Controlled by `weekly_digest_enabled` toggle in event settings

### 5.3 Post-Event Thank You
- Cron endpoint: `POST /api/cron/thank-you`
- Triggered 1 day after event date
- Sent to all guests with status `attending`
- Content: thank you message, event name, link to memory page (gallery/blessings)
- `thank_you_sent` flag on event prevents re-sending

### Cron Schedule
- All three endpoints called by Vercel Cron (configured in `vercel.json`)
- Reminders: daily at 09:00 UTC
- Digest: Mondays at 08:00 UTC
- Thank-you: daily at 10:00 UTC

---

## 6. Analytics Dashboard

### New Page
`/dashboard/[id]/analytics` — accessible from event management sidebar.

### Six Panels

#### 6.1 Page Views
- Total views, unique visitors (by `ip_hash`)
- Views over time (line chart, daily granularity)
- Per-guest view tracking: which guests opened their personal link

#### 6.2 RSVP Funnel
- Funnel visualization: invited → viewed → RSVP opened → submitted
- Conversion rate at each step
- Counts derived from `analytics_events` + `guests` table

#### 6.3 Timing
- Timeline chart: when guests view and RSVP relative to event date
- Highlight clusters (e.g., spike after reminders sent)
- Days-before-event distribution

#### 6.4 Blessings & Reactions
- Total blessings count, reaction counts by emoji
- Most active guests
- Activity over time (bar chart)
- Data from existing `blessings` + `reactions` tables

#### 6.5 Photo Gallery Stats
- Upload count: host vs guest breakdown
- Pending moderation count
- Data from existing `photos` table

#### 6.6 Geographic
- Country/city breakdown table with counts
- Simple map visualization (optional — can be a table if map library is too heavy)
- Data from `analytics_events.country` / `analytics_events.city`

### Tracking Implementation
- Client-side: lightweight `POST /api/analytics/track` call
- Fires on: page view, RSVP form open, RSVP submit, blessing sent, reaction sent, photo view
- Server-side: resolves geo from IP using free GeoIP service (ip-api.com), stores country/city
- Deduplication: same guest token + event type within 5-minute window = 1 event
- Rate-limited to prevent abuse

---

## 7. Advanced Admin Panel

### Tabbed Interface at `/admin`

#### 7.1 Overview Tab
- Existing stats (total events, published, RSVPs, photos, guestbook)
- New: storage usage estimate, email send counts, active users (7d/30d), event creation trend chart

#### 7.2 Users Tab
- Searchable, paginated user list
- Columns: email, display name, event count, created date, status (active/disabled)
- Actions: disable account (sets flag, blocks login), delete account (cascade all data), view user's events

#### 7.3 Events Tab
- Searchable, filterable event list (by type, published/draft, date range)
- Columns: name, type, owner, published, created, guest count
- Actions: unpublish, delete, view as guest (opens invitation), view owner profile

#### 7.4 Content Tab
- Browse photos, blessings, guestbook entries across all events
- Filter by event, date range, status (pending/approved/rejected)
- Bulk select with checkboxes
- Bulk delete, bulk approve/reject
- Flag/unflag individual items

#### 7.5 Spam Controls Tab
- Blocked IP addresses: list with add/remove
- Banned email domains: list with add/remove
- View stats: blocked attempts count
- Stored in a `spam_rules` table (type: `ip` or `domain`, value, created_by, created_at)

#### 7.6 Audit Log Tab
- Searchable, filterable log
- Columns: timestamp, admin email, action, target type, target ID, details
- Filter by action type, date range, admin
- Paginated, newest first

### Authorization
- All admin API routes under `/api/admin/*`
- Check `app_metadata.role === 'admin'` (existing pattern)
- Every mutating action writes to `audit_logs`

---

## 8. Google Calendar

### "Add to Calendar" Button
- Appears on invitation page near event date or timeline section
- Two options in a small dropdown:
  - **Google Calendar** — opens Google Calendar URL with pre-filled event details
  - **Download .ics** — downloads `.ics` file (Apple Calendar, Outlook, etc.)
- Event details populated from: event title, date/time, venue name + address, event description
- Uses event timezone from settings

### Implementation
- Utility function generates Google Calendar URL: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=...&dates=...&location=...&details=...`
- Utility function generates `.ics` file content (VCALENDAR/VEVENT format)
- No API integration needed — pure URL/file generation

---

## 9. Housekeeping

### 9.1 `.env.local.example`
Document all environment variables with descriptions:
```
# Required
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Email (optional — logs to console if not set)
RESEND_API_KEY=re_your-key
EMAIL_FROM=Dearly <noreply@dearly.app>

# Cron security (required for email automation)
CRON_SECRET=your-random-secret

# Error monitoring (optional)
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
SENTRY_DSN=https://...@sentry.io/...
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
SENTRY_AUTH_TOKEN=your-token

# Analytics (optional)
SENTRY_TRACES_SAMPLE_RATE=0

# Testing
E2E_BASE_URL=http://localhost:3000

# App
NEXT_PUBLIC_SITE_URL=https://dearly-self.vercel.app
SUPPORT_EMAIL=hello@dearly.app
```

### 9.2 Gift QR Image Upload
- In gift section of event editor, add image upload button alongside existing URL input
- Upload to `gift-qr-images` Supabase bucket
- Display uploaded image on invitation gift section
- Max 2 QR images (matching existing 2-account limit)

### 9.3 Photo Bulk Moderation
- In event dashboard photo moderation view:
  - Select all / individual checkboxes
  - Bulk approve / bulk reject buttons
  - Auto-flag: photos under 5KB file size flagged as suspicious (likely spam/blank)

---

## Technical Notes

### New API Routes
| Route | Purpose |
|---|---|
| `POST /api/analytics/track` | Client-side event tracking |
| `GET /api/analytics/[eventId]` | Dashboard analytics data |
| `POST /api/cron/reminders` | RSVP reminder cron |
| `POST /api/cron/digest` | Weekly digest cron |
| `POST /api/cron/thank-you` | Post-event thank you cron |
| `GET/POST/DELETE /api/admin/users` | User management |
| `GET/POST/DELETE /api/admin/events` | Event management |
| `GET/POST/DELETE /api/admin/content` | Content moderation |
| `GET/POST/DELETE /api/admin/spam` | Spam rules management |
| `GET /api/admin/audit` | Audit log queries |
| `GET /api/admin/stats` | Extended system stats |

### New Supabase Migration
Single migration file covering all schema changes (new tables, altered tables, RLS policies, storage bucket).

### New Vercel Cron Config
```json
{
  "crons": [
    { "path": "/api/cron/reminders", "schedule": "0 9 * * *" },
    { "path": "/api/cron/digest", "schedule": "0 8 * * 1" },
    { "path": "/api/cron/thank-you", "schedule": "0 10 * * *" }
  ]
}
```

### Dependencies
- No new major dependencies
- GeoIP: use free `ip-api.com` HTTP API (no npm package needed)
- `.ics` generation: hand-rolled (simple VCALENDAR format, no library needed)
- Charts: use a lightweight chart library if not already present, or simple CSS/SVG bars

### What's NOT in scope
- Billing/payments (deferred — no Vietnam solution yet)
- Real-time WebSocket updates (Supabase Realtime available but not wired up in this phase)
- Custom domains / CNAME routing
- Check-in kiosk mode
- SMS notifications
- Native mobile apps
- Custom email templates (all templated)

# AGENTS.md — Dearly

Guidance for AI agents and contributors working on **Dearly**, an event invitation and memory platform (weddings first, plus birthdays, parties and social events) (Next.js 14 App Router, TypeScript, Tailwind, Framer Motion, Supabase).

## Contents

1. [Purpose](#1-purpose)
2. [Commands](#2-commands)
3. [Architecture of an invitation](#3-architecture-of-an-invitation)
4. [Design guideline](#4-design-guideline)
5. [Adding a template (checklist)](#5-adding-a-template-checklist)
6. [Data, API and security rules](#6-data-api-and-security-rules)
7. [Quality gates](#7-quality-gates)

---

## 1. Purpose

Dearly is both an **invitation** and a **wedding memory book**. A couple shares one link; guests open it on their phone. The page must feel like a **cinematic, celebrity-grade landing page**, not a card. Every template shares the same content and features (RSVP, blessings, countdown, schedule, venue, gallery). Each template has its **own design language**: layout, motion, ornaments, shapes and texture. Colour schemes are interchangeable on top of that.

The benchmark is hand-made studios such as The Digital Yes (envelope intros, curtain reveals, scratch-to-reveal, RSVP inside the invitation). We aim to beat them on **interactivity** (live blessings, reactions, drag-able photos) and **instant customisation** (any colour scheme, live preview).

## 2. Commands

| Task | Command |
| --- | --- |
| Dev server (http://localhost:3000) | `npm run dev` |
| Unit/integration tests (Vitest) | `npm test` |
| Type check (must be 0 errors; builds fail on type errors) | `npx tsc --noEmit -p .` |
| Lint | `npm run lint` |
| Production build | `npm run build` |
| Preview pending DB migrations | `npx supabase db push --dry-run` |
| Apply DB migrations (remote, high-impact: dry-run first) | `npx supabase db push` |
| Visual QA screenshots (server must be running) | `node scripts/screenshot.mjs .shots "http://localhost:3000/templates/velvet\|velvet"` |

**Screenshot parameters:** `<outDir> <url>[|name][|#selector] ...`. A `#selector` scrolls to that section before capturing, e.g. `"http://localhost:3000/templates/bloom|bloom-rsvp|#rsvp"`. Do not use `chrome --screenshot` or browser tools that wait for "network idle": the infinite ambient animations keep the page busy, and entrances look blank when captured too early.

## 3. Architecture of an invitation

```
src/components/invitation/
  CinematicInvitation.tsx   ← the guest page (all templates). Composes sections in order.
  styles.ts                 ← per-template DESIGN LANGUAGE, LAYOUT_LABEL, curated COLOR_SCHEMES
  sections-config.ts        ← section visibility toggles (resolveSections / sanitizeSections)
  SectionToggles.tsx        ← switch list used in the editor and the preview "Sections" popover
  TemplateSearchInput.tsx   ← search field; filtering lives in src/lib/template-search.ts
  utils.ts                  ← buildPalette(theme, slug) → colour + design tokens; date/link helpers
  TemplatePreview.tsx       ← public demo: colour-scheme picker + Sections popover (embed / bare modes)
  LayoutThumbnail.tsx       ← static miniature of each hero layout for gallery cards
  sections/                 ← Hero (+ HeroCurtain, HeroSignature, HeroParts), Countdown, ScratchReveal, Story,
                              Schedule, VenueMoments, RsvpSection, Blessings, Chrome (nav/footer)
  effects/                  ← Botanicals (growing flowers/vines), Particles, Ambient, BlessingShower
src/components/templates/<slug>/  ← GalleryLayout + GuestbookSection only (sub-pages)
src/components/templates/registry.ts ← slug → gallery/guestbook bundle
```

**Data flow:**
1. `templates.default_config` (DB) supplies colours and fonts.
2. `resolveTheme` applies the couple's customisation on top.
3. `buildPalette(theme, slug)` derives readable ink, petals and leaf colours, then attaches `style` (from `styles.ts`) and `radius`.
4. Every section reads **only** `palette`. Never hard-code colours or fonts inside sections.

**Section order:** Hero → Countdown (optional scratch reveal) → Story → Schedule → Venue → Moments → RSVP → Blessings → Footer. On top of the page sit a fixed `TopNav`, the `BlessingShower` and the music player.

A section is skipped when it has no data **or** when the couple hid it. Visibility lives in `customization.sections` and is read through `resolveSections()`; keys that are missing count as visible.

| Key | Controls |
| --- | --- |
| `countdown` | Countdown and add-to-calendar |
| `story` | Our Story |
| `timeline` | Schedule |
| `venue` | Venue card |
| `gallery` | Moments ribbon and the footer gallery link |
| `rsvp` | RSVP section and the nav RSVP button |
| `blessings` | Blessing wall |
| `reactions` | Reaction bar |
| `blessingShower` | Blessings shown when the page loads (style set by `customization.blessingStyle`) |
| `music` | Background music |
| `guestbook` | Footer guest-book link |

**Blessing style** (`customization.blessingStyle`):
- `"marquee"` (default): blessings run as large, faint lines of text behind the **hero only**. They are rendered into the hero's `#hero-blessings` layer, which sits under the names and the curtains.
- `"float"`: each blessing floats up the whole screen, carried by the template's motif.

Guests can hide blessings themselves. That choice is remembered in `localStorage` under `dearly-blessing-shower`.

**Background music** (`src/lib/ambient-music.ts` + `components/ui/MusicPlayer.tsx`):
- The app ships no audio files, so music is generated in the browser with Web Audio. Presets: `piano`, `acoustic`, `orchestral`, `ambient`, `romantic`, `musicbox`.
- Every template has a default preset (`style.music`).
- A library track plays as the preset that matches its genre. A custom `music_url` plays as a file and falls back to the preset if it fails to load.
- Browsers block autoplay, so music starts on the guest's first tap or key press, prompted by a "Tap anywhere for music" hint.
- If a guest pauses, that is remembered in `localStorage` under `dearly-music`.

**Memories:** the Moments section doubles as a memory album.
- When `weddings.guest_uploads_enabled` is on, it shows **Share your photos**, which links to `/[slug]/gallery#share`.
- Uploaded photos are moderated in the dashboard ("Memories & Photos").

**Preview URL modes for `/templates/[slug]`:**
- `?embed=1`: shown inside the dashboard modal. Links are hidden, and scheme/section changes are posted to the parent window.
- `?embed=1&bare=1`: no banner at all. Used by the landing-page phone demo.
- `&scheme=<id>`: start on that colour scheme.

**Template search** (`searchTemplates`) matches:
- the template name, slug and description;
- its design language (layout label, hero, ambient effects, ornament).

Every word in the query must match. Plurals are folded, so "butterflies" finds "butterfly".

**Event types** (`src/lib/event-types.ts`):
- The `weddings` table hosts every event. `event_type` is one of `wedding` `engagement` `birthday` `party` `social` `anniversary` `baby-shower`; `event_title` is an optional headline ("Mia turns 30").
- Single-host events store `partner2_name = ''`. Use `hostNames()` and `EVENT_COPY[type]` for labels and eyebrows; never hard-code "wedding" or "&" in sections. The `Ampersand` hides itself for single hosts.
- Sections read copy through `EventContext` (`useEventCopy`, `useEyebrow` in `HeroParts.tsx`).
- After the event date (`isPastEvent`) the page becomes a memory book: RSVP is hidden; blessings and photos stay.
- `templates.event_types[]` decides which occasions a template is offered for (onboarding and the `/templates` occasion filter).
- Date-night / proposal "ask cards" live separately at `/q/<slug>` (`CuteQuestionView`, runaway "No" button).

**Guest list and personal invites** (`invitees` table, `src/lib/guest-list.ts`, dashboard "Guest list"):
- Hosts paste names (`Anna +1`, `Ben, 4`, `Chi (3)`); each row gets a random `token`.
- Personal link: `/<slug>?i=<token>`. The token is resolved server-side; the hero greets "Dear {name}" and the RSVP is prefilled and capped at `max_party_size`.
- `/api/rsvp` with `inviteeToken` updates the invitee's status. The dashboard shows results, check-in on the day and CSV export.

**Plans** (`src/lib/plans.ts`): **currently off** (`PLANS_ENABLED = false`, early access to attract users).
- While off, `planOf()` returns `EARLY_ACCESS`: every design unlocked, no retention limit, abuse caps only (2,000 photos → `413`, 1,000 named guests). `/pricing` returns 404 and is left out of the sitemap; pricing links, the "Plans" sidebar item and "Premium" badges are hidden.
- To turn plans on: set `PLANS_ENABLED = true`, re-add the Pricing links on the landing page, and wire a payment provider into `/api/billing/checkout` (currently `501 BILLING_NOT_CONFIGURED`). Paid limits then apply (`402 PLAN_LIMIT`).

**Weddings lead:** weddings are the flagship occasion. Onboarding shows a large Wedding choice with other occasions as small chips, `/templates` sorts wedding designs first, and other occasions appear as a secondary "Not a wedding?" strip on the landing page and an "Also for" group in occasion-page navigation.

**Slugs:** event slugs live at the site root, so `isReservedSlug()` (`src/lib/reserved-slugs.ts`) rejects names of app routes. Add new top-level routes there.

**SEO** (`src/lib/seo.ts`, `SITE_URL` from `NEXT_PUBLIC_SITE_URL`): indexable pages are `/`, `/templates`, `/templates/<slug>`, `/invitations/<occasion>` (`src/lib/occasions.ts`) and `/pricing` (only while plans are on); they are listed in `sitemap.ts`. Guest event pages, `/q/*` and `?embed=1` previews are `noindex`.

## 4. Design guideline

### 4.1 Principles

1. **Open like a film, not a document.** The first 3 seconds are choreographed. Background and ornaments arrive first (0–1.5s), names rise next (1–2.5s), then details (2.5–3.5s). Guests should never see an empty screen for longer than ~1s.
2. **One signature moment per template.** Examples: curtains part, a seal cracks, the sun sets, a rose window lights up, flowers grow. Don't stack several signature moments in one hero.
3. **Content is shared, character is not.** Change *how* things look and move, never *what* guests can do. Every template gets RSVP, blessings and reactions.
4. **Colour schemes must never break a template.** Derive every colour from `palette`. Test at least one light and one dark scheme from `COLOR_SCHEMES`.
5. **Calm after the opening.** Below the hero, motion is reveal-on-scroll only, plus gentle ambient effects. No looping animation may compete with text people are reading.

### 4.2 Design language tokens (`styles.ts`)

| Token | Values | Meaning |
| --- | --- | --- |
| `hero` | `garden` `arch` `editorial` `split` `celestial` `polaroid` `curtain` `seal` `daynight` `stained` | Opening layout |
| `ambient` | `butterflies` `petals` `leaves` `confetti` `snow` `gold-dust` `stars` `bokeh` | Background effects. Also picks the BlessingShower carriers. |
| `ornament` | `floral` `deco` `line` `leaf` `star` `wave` | Section dividers, Story side decoration |
| `corners` | `rounded` `sharp` `pill` `arch` | Radius of every card and button, via `palette.radius` |
| `texture` | `none` `paper` `grain` | Fixed tactile overlay |
| `eyebrow` | `script` `caps` | Section kicker style |
| `headingCase` | `upper` `normal` | Section titles |
| `flowers` | boolean | Growing flowers in the hero / venue |
| `curtain` | `velvet` `ivy` | Material for the `curtain` hero (`HeroCurtain.tsx`). `velvet` is a theatre with swags, fringe, tie-backs and footlights. `ivy` is a garden: a heart lock turns, light spills through, iron gates swing open, petals and butterflies burst out and a floral arch grows. |
| `scratchReveal` | boolean | Date hidden under a scratch card |

### 4.3 Colour

- Use `palette.ink` and `palette.inkMuted` for text. They are computed from the background luminance, which keeps them readable on both light and dark backgrounds. **Never** use `accent` for body text.
- Use `palette.primary` for emphasis: script eyebrows, ampersand, buttons, lines.
- Use `alpha(color, a)` and `mix(a, b, t)` from `utils.ts`. Don't concatenate hex strings with alpha suffixes.
- **Dark backgrounds:** `palette.isDark === true` means a background luminance below 0.25. In that case use light ink, and glow effects with lower opacity.
- **Self-themed heroes:** heroes that set their own background (`celestial`, `daynight`) pick a fixed light ink, because the hero background may differ from `palette.background`.

### 4.4 Typography

| Role | Source | Notes |
| --- | --- | --- |
| Display (names, titles) | `palette.displayFont` (template font) | Hero names 6xl–9xl; section titles 4xl–6xl |
| Body | `palette.bodyFont` | 16–20px, line-height ≥ 1.7 |
| Script accent | `palette.scriptFont` (Great Vibes) | Ampersand, eyebrows, guest names, short phrases only. Never paragraphs. |

- Fonts load via `googleFontsUrl()`. Font names must match `^[\w\s-]{1,60}$`.
- Wrap animated names in `RisingText`, which reserves horizontal padding so script and italic overhangs are not clipped.

### 4.5 Motion

- **Easing:** use `EASE_OUT` (`[0.22, 1, 0.36, 1]`) for entrances, and springs for "objects" (seals, polaroids, buttons).
- **Durations:**
  - entrances 0.8–1.2s
  - signature moments ≤ 3s
  - ambient loops 6–30s
  - hover/tap 0.2–0.4s
- **Accessibility:** every new effect checks `useReducedMotion()`. It must either render a static end state or nothing, and content must remain fully visible.
- **SSR safety:** randomness comes from `seeded(i)`, never `Math.random()` during render. Time-based values (countdown, "2 days ago") render on the client or use `suppressHydrationWarning`.
- **Performance:** animate only `transform`, `opacity`, `pathLength` and `clipPath`. Particle counts: ≤ 30 per effect, ≤ 80 stars. Prefer CSS gradients to images for decoration.
- Scroll-linked effects use `useScroll({ target })` with `useTransform`. Hero content parallaxes and fades out (`contentY`, `contentOpacity`).

### 4.6 Layout and shape

- **Section padding:** `py-28 md:py-36`; content `max-w-2xl` (text) to `max-w-6xl` (grids).
- **Backgrounds:** alternate `palette.background` and `palette.surface` between sections.
- **Corners:** all cards and buttons use `palette.radius.{sm,lg,card}`. Never hard-code `rounded-*` classes on themed elements.
- **Mobile first:** heroes must work at 360×740. Use `min-h-[100svh]`, and `clamp`/`min()` for oversized type.

### 4.7 Interaction patterns

- **RSVP:** two large choice cards ("I'll be there" / "Can't make it"). Then name, party size (attending only) and an optional blessing. The success state celebrates with `CelebrationBurst`.
- **Blessings:**
  - **Wall:** a masonry wall of cards.
  - **Reactions:** batched (1 request/s, ≤ 20 per kind) with optimistic counts.
  - **`BlessingShower`:** shows blessings when the page loads, either as running text behind the hero (default) or floating up the screen, carried by the template's motif (butterfly, flower, star, heart, confetti). It must stay pointer-transparent and offer an on/off toggle.
- **Scratch reveal:** must always offer the "tap here to reveal" fallback.
- **Demo mode** (`demo` prop): never call APIs. Simulate success locally.

### 4.8 Accessibility checklist

- Text contrast ≥ 4.5:1 for body text (verify with `luminance()` when introducing a new hero background).
- Decorative SVGs and effects use `aria-hidden`; choice buttons use `aria-pressed`; live counters use `aria-live` where relevant.
- All interactions work by keyboard (buttons, not divs) and on touch (`touch-none` only on scratch canvases).

## 5. Adding a template (checklist)

1. **Design language:** add an entry to `STYLES` in `src/components/invitation/styles.ts`. Reuse an existing `hero` or add a new one; new heroes go in `sections/HeroSignature.tsx`.
2. **New hero layout:**
   - Add it to the `HeroLayout` union.
   - Add a case to the dispatcher in `sections/Hero.tsx`.
   - Add a thumbnail case and a `LAYOUT_LABEL` entry in `LayoutThumbnail.tsx`.
   - Add a `getInvitationStyle` assertion in `utils.test.ts`.
3. **Registry:** add the slug to `src/components/templates/registry.ts`. Point `load` at the closest existing gallery/guestbook bundle unless the template needs bespoke sub-pages.
4. **Database:** create a new migration `supabase/migrations/000NN_*.sql` that inserts into `public.templates` with `ON CONFLICT (slug) DO NOTHING` and a rollback comment. Run the dry run, then push.
5. **QA:**
   - `npm test`, `npx tsc --noEmit -p .`, `npm run lint`, `npm run build`.
   - Screenshots of the hero plus `#celebrate`, `#rsvp` and `#blessings`, in the original scheme and in one contrasting scheme (light ↔ dark).

## 6. Data, API and security rules

- **Writes:** guest writes go **only** through API routes (`/api/rsvp`, `/api/reactions`, `/api/guestbook`).
  - Validate input with `zod`.
  - Rate-limit with `src/lib/rate-limit.ts`.
  - Verify the wedding is published before using the service-role client, because the service role bypasses RLS.
- **RSVPs:** private. RLS allows reads by the wedding owner only. Blessings are public guestbook entries tagged with `rsvp_status`.
- **Reaction counts:** change only through the `increment_reaction` SECURITY DEFINER function. `anon` and `authenticated` cannot execute it.
- **Logging:** log with `[INFO]`, `[WARNING]` or `[ERROR]` prefixes. Never log guest names, messages or keys.
- **postMessage:** check `event.origin === window.location.origin`. Message types are `preview-ready`, `preview-update`, `scheme-change` and `sections-change`. Pass the `sections` payload through `sanitizeSections()` before using it.
- **Migrations:** schema changes ship as new numbered migrations with a rollback note. Never edit an applied migration.

## 7. Quality gates

A change is done when:

- Tests, type check, lint and build pass.
- Every new function has a short docstring explaining its purpose.
- New logic has tests (pure helpers in `*.test.ts` next to the code; API routes in `src/app/api/routes.test.ts` with a mocked Supabase client).
- Visual changes have been screenshot-checked as described above.
- A summary has been appended to `logs/<feature>.log`.

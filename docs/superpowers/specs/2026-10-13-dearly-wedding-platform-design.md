# Dearly — Wedding Platform Design Spec

**Date:** 2026-10-13
**Status:** Approved

## Overview

Dearly is a reusable wedding platform where any couple can sign up, pick a template, customize their wedding site, and share it with guests. Built on the same stack as wtd-app.

## Tech Stack

- **Framework:** Next.js 14 (App Router) + React 18 + TypeScript
- **Styling:** Tailwind CSS 3 + Framer Motion (animations)
- **Backend:** Supabase (Auth, PostgreSQL, Storage)
- **State:** Zustand
- **Validation:** Zod + React Hook Form
- **Icons:** Lucide React
- **Testing:** Vitest
- **Fonts:** Google Fonts (template-specific pairings)
- **Deployment:** Vercel

## Core Features

1. **Digital Invitation** — animated landing page with couple names, date, venue, countdown
2. **Photo Gallery** — three layout options (masonry, albums, timeline), guest uploads with moderation
3. **Event Timeline** — schedule of wedding events with template-specific animations
4. **Guest Book** — public messages from guests with spam prevention

## Architecture

### Single Next.js Monolith

One Next.js app handles all concerns: marketing landing page, couple authentication, dashboard/editor, and guest-facing wedding sites. Templates are loaded via dynamic imports based on the wedding's `template_id`.

### Route Structure

```
/                        → Marketing landing page
/auth/login              → Email/password + social login (Google, Apple)
/auth/signup             → Couple registration
/dashboard               → Couple's wedding management hub
/dashboard/editor        → Hybrid editor (form + live preview)
/dashboard/gallery       → Photo management + moderation
/dashboard/guestbook     → View/manage guest messages
/dashboard/timeline      → Manage event timeline
/dashboard/settings      → Site settings, URL slug, visibility
/[slug]                  → Guest-facing wedding site (public)
/[slug]/gallery          → Photo gallery (public)
/[slug]/guestbook        → Guest book (public)
```

### Database Schema

#### `templates`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Template name (e.g., "Eternal") |
| slug | text | URL-safe identifier |
| description | text | Short description |
| preview_image | text | URL to preview screenshot |
| animation_style | text | subtle, cinematic, interactive |
| default_config | jsonb | Default colors, fonts, animation settings |
| created_at | timestamptz | Creation timestamp |

#### `weddings`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | FK → auth.users |
| template_id | uuid | FK → templates |
| slug | text | Unique URL slug (e.g., "anthony-and-sarah") |
| partner1_name | text | First partner's name |
| partner2_name | text | Second partner's name |
| wedding_date | date | Wedding date |
| venue_name | text | Venue name |
| venue_address | text | Venue address |
| story_text | text | Couple's story (optional) |
| customization | jsonb | Colors, fonts, section toggles, template-specific overrides |
| is_published | boolean | Draft or live |
| guest_uploads_enabled | boolean | Allow guest photo uploads |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Last update |

#### `wedding_events`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| wedding_id | uuid | FK → weddings |
| title | text | Event title (e.g., "Ceremony") |
| description | text | Event description |
| location | text | Event location |
| start_time | timestamptz | Start time |
| end_time | timestamptz | End time (optional) |
| icon | text | Lucide icon name |
| sort_order | integer | Display order |

#### `gallery_photos`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| wedding_id | uuid | FK → weddings |
| url | text | Full-size image URL (Supabase Storage) |
| thumbnail_url | text | Thumbnail URL |
| caption | text | Photo caption (optional) |
| album | text | Category: pre-wedding, ceremony, reception, other |
| sort_order | integer | Display order within album |
| uploaded_by | text | "couple" or "guest" |
| guest_name | text | Guest's name (if guest upload) |
| status | text | pending, approved, rejected |
| created_at | timestamptz | Upload timestamp |

#### `guestbook_entries`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| wedding_id | uuid | FK → weddings |
| guest_name | text | Guest's display name |
| message | text | Guest's message |
| created_at | timestamptz | Submission timestamp |

### Storage Buckets

- **`wedding-photos`** — couple and guest uploaded photos, organized by `wedding_id/`
- **`wedding-assets`** — couple avatars, custom backgrounds

### Authentication

- **Couples:** Email/password + Google/Apple social login via Supabase Auth
- **Guests:** No authentication required — all wedding sites are fully public

## Template System

### 10 Launch Templates

| # | Name | Aesthetic | Animation Style |
|---|------|-----------|-----------------|
| 1 | Eternal | Classic elegant — serif fonts, gold accents, ivory | Subtle fade-ins, gentle parallax |
| 2 | Bloom | Romantic floral — watercolor flowers, soft pinks | Flowers blooming on scroll, petal particles |
| 3 | Minimal | Modern clean — sans-serif, whitespace, monochrome | Crisp slide-ups, staggered text reveals |
| 4 | Rustic | Botanical/earthy — kraft textures, hand-drawn | Sketch-drawing animations, leaf drifts |
| 5 | Deco | Art Deco — geometric patterns, gold/black | Geometric shape builds, shimmer effects |
| 6 | Sunset | Warm tropical — coral, terracotta, palm motifs | Wave motion, warm gradient transitions |
| 7 | Noir | Dark moody — dramatic typography, dark bg | Cinematic text reveals, spotlight effects |
| 8 | Garden | English garden — muted pastels, delicate borders | Vine growth animations, butterfly particles |
| 9 | Polaroid | Retro/playful — polaroid frames, handwritten | Photo scatter/stack, tape-peel transitions |
| 10 | Glass | Glassmorphism — frosted panels, gradients | 3D tilt on hover, floating blur layers |

### Template Architecture

Each template is a self-contained folder:

```
src/components/templates/[name]/
├── InvitationPage.tsx    → Main invitation/landing page
├── GalleryLayout.tsx     → Gallery display (renders chosen layout type)
├── TimelinePage.tsx      → Event timeline display
├── GuestbookPage.tsx     → Guest book display
├── theme.ts              → Default colors, fonts, animation config
└── index.ts              → Re-exports all components
```

**Template Registry:** Auto-discovers templates by scanning the templates directory. Adding a new template = adding a new folder with the required exports. No hardcoded lists.

### Customization Options

Per-template customizable properties:

- **Colors:** primary, secondary, accent (color picker + template-specific preset palettes)
- **Fonts:** display + body font pairing (curated list of 5-6 pairings per template)
- **Section toggles:** show/hide timeline, gallery, guestbook independently
- **Content:** couple names, date, venue, story text, photos

Customizations stored as JSON in `weddings.customization`:
```json
{
  "colors": { "primary": "#D4622B", "secondary": "#F5F0EB", "accent": "#C7962A" },
  "fonts": { "display": "Playfair Display", "body": "Lato" },
  "sections": { "timeline": true, "gallery": true, "guestbook": true },
  "templateOverrides": {}
}
```

## Photo Gallery

### Three Layout Options

Couples choose their gallery layout in the dashboard:

1. **Masonry** — Pinterest-style staggered grid, responsive columns, lightbox on click
2. **Albums** — categorized albums (Pre-wedding, Ceremony, Reception), grid view inside each
3. **Timeline** — chronological scroll with captions, date markers, scroll-driven narrative

### Photo Flow

1. **Couple uploads:** drag-and-drop in dashboard → assign album, add captions, reorder
2. **Guest uploads:** upload form on `/[slug]/gallery` → enters moderation queue (pending status)
3. **Moderation:** dashboard shows pending photos → couple approves/rejects with bulk actions

### Gallery Features

- Lightbox with swipe (mobile) and keyboard (desktop) navigation
- Lazy loading with blur placeholders (Next.js Image `blurDataURL`)
- Infinite scroll or "Load more" for large galleries
- Download button (original resolution) in lightbox
- Template-specific open/close animations

## Event Timeline

- Couple adds events in dashboard: title, time, location, description, icon
- Vertical or horizontal layout (template-dependent)
- Template-specific scroll animations (e.g., Bloom: vine growth reveals, Glass: floating card parallax)
- Supports all-day events and multi-day weddings

## Guest Book

- Public form on `/[slug]/guestbook` — name + message, no auth required
- Messages displayed in styled feed, newest first
- Template-specific styling (e.g., Polaroid: handwritten font cards, Noir: dark speech bubbles)
- Spam prevention: rate limiting (1 message per IP per 5 minutes) + honeypot field
- Couple can delete messages from dashboard

## Dashboard & Hybrid Editor

### Dashboard Layout

- **Sidebar navigation:** Editor, Gallery, Guest Book, Timeline, Settings
- **Top bar:** couple names, preview link, publish toggle

### Hybrid Editor

- **Left panel:** form sections — Couple Info, Date & Venue, Template Selection, Color & Font Customization, Section Toggles
- **Right panel:** live preview iframe rendering the wedding site with current settings
- Changes update preview in real-time (debounced Zustand state → preview re-renders)
- Template picker shows visual previews with couple's content applied
- Color picker with preset palettes + custom
- Font pairing selector with live typography preview

### Settings

- URL slug (auto-generated from couple names, editable, uniqueness validated)
- Site visibility (draft / published)
- Guest upload toggle (enable / disable)

## Future Considerations

- **Subscription monetization** — data model supports adding `subscriptions` table and plan tiers when ready
- **Additional templates** — template registry pattern makes adding new templates a folder drop-in
- **RSVP management** — can be added as a new section/feature later
- **Gift registry** — linkable external registries or built-in wishlist
- **Custom domain support** — couples connect their own domain

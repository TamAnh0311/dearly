# Dearly Wedding Platform — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a wedding platform where couples sign up, pick from 10 templates, customize their site, and share it publicly with guests — featuring animated invitations, photo galleries, event timelines, and guest books.

**Architecture:** Single Next.js 14 monolith (App Router) with Supabase backend (Auth, PostgreSQL, Storage). Templates are self-contained component folders loaded via dynamic imports. Couples manage content through a hybrid form+preview editor. Guest-facing sites are public, served at `/[slug]`.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS 3, Framer Motion, Supabase (Auth + DB + Storage), Zustand, Zod, React Hook Form, Lucide React, Vitest

---

## File Structure

```
src/
├── app/
│   ├── layout.tsx                              # Root layout: fonts, providers, globals
│   ├── page.tsx                                # Marketing landing page
│   ├── globals.css                             # Design system variables + Tailwind
│   ├── (auth)/
│   │   ├── login/page.tsx                      # Email/password + social login
│   │   ├── signup/page.tsx                     # Couple registration
│   │   └── auth/callback/route.ts              # OAuth code exchange
│   ├── (dashboard)/
│   │   ├── layout.tsx                          # Dashboard shell (sidebar + topbar)
│   │   ├── dashboard/page.tsx                  # Dashboard home/overview
│   │   ├── dashboard/editor/page.tsx           # Hybrid editor (form + live preview)
│   │   ├── dashboard/gallery/page.tsx          # Photo management + moderation
│   │   ├── dashboard/guestbook/page.tsx        # Guestbook message management
│   │   ├── dashboard/timeline/page.tsx         # Event timeline management
│   │   └── dashboard/settings/page.tsx         # URL slug, visibility, guest uploads
│   ├── [slug]/
│   │   ├── page.tsx                            # Guest-facing invitation
│   │   ├── gallery/page.tsx                    # Public photo gallery
│   │   └── guestbook/page.tsx                  # Public guest book
│   ├── api/
│   │   ├── photos/upload/route.ts              # Photo upload endpoint
│   │   └── guestbook/route.ts                  # Guestbook submission + rate limiting
│   └── preview/page.tsx                        # Editor live preview (iframe target)
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx                       # Login form component
│   │   ├── SignupForm.tsx                      # Signup form component
│   │   └── SocialLoginButtons.tsx              # Google/Apple OAuth buttons
│   ├── dashboard/
│   │   ├── Sidebar.tsx                         # Dashboard sidebar navigation
│   │   ├── TopBar.tsx                          # Dashboard top bar (names, preview, publish)
│   │   ├── editor/
│   │   │   ├── EditorForm.tsx                  # Left panel: all form sections
│   │   │   ├── LivePreview.tsx                 # Right panel: iframe preview
│   │   │   ├── TemplatePicker.tsx              # Visual template selection grid
│   │   │   ├── ColorPicker.tsx                 # Color customization with presets
│   │   │   └── FontPicker.tsx                  # Font pairing selector
│   │   ├── gallery/
│   │   │   ├── PhotoUploader.tsx               # Drag-and-drop photo upload
│   │   │   ├── PhotoGrid.tsx                   # Sortable photo grid with actions
│   │   │   └── ModerationQueue.tsx             # Pending guest photo approvals
│   │   ├── guestbook/
│   │   │   └── GuestbookManager.tsx            # View/delete guest messages
│   │   └── timeline/
│   │       └── TimelineEditor.tsx              # Add/edit/reorder timeline events
│   ├── templates/
│   │   ├── types.ts                            # Template component interfaces
│   │   ├── registry.ts                         # Template auto-discovery registry
│   │   ├── eternal/                            # Template 1: Classic elegant
│   │   │   ├── InvitationPage.tsx
│   │   │   ├── GalleryLayout.tsx
│   │   │   ├── TimelineSection.tsx
│   │   │   ├── GuestbookSection.tsx
│   │   │   ├── theme.ts
│   │   │   └── index.ts
│   │   ├── bloom/                              # Template 2: Romantic floral
│   │   ├── minimal/                            # Template 3: Modern clean
│   │   ├── rustic/                             # Template 4: Botanical earthy
│   │   ├── deco/                               # Template 5: Art Deco
│   │   ├── sunset/                             # Template 6: Warm tropical
│   │   ├── noir/                               # Template 7: Dark moody
│   │   ├── garden/                             # Template 8: English garden
│   │   ├── polaroid/                           # Template 9: Retro playful
│   │   └── glass/                              # Template 10: Glassmorphism
│   ├── gallery/
│   │   ├── MasonryGrid.tsx                     # Masonry layout
│   │   ├── AlbumView.tsx                       # Album-based layout
│   │   ├── TimelineGallery.tsx                 # Chronological timeline layout
│   │   ├── Lightbox.tsx                        # Fullscreen photo viewer
│   │   └── GuestUploadForm.tsx                 # Guest photo submission form
│   ├── guestbook/
│   │   └── GuestbookForm.tsx                   # Public guestbook entry form
│   └── ui/
│       ├── Button.tsx                          # Shared button component
│       ├── Input.tsx                           # Shared input component
│       ├── CountdownTimer.tsx                  # Wedding date countdown
│       └── LoadingSpinner.tsx                  # Loading state indicator
├── hooks/
│   ├── useWedding.ts                           # Fetch/mutate wedding data
│   ├── useGallery.ts                           # Photo CRUD operations
│   ├── useGuestbook.ts                         # Guestbook CRUD operations
│   └── useTimeline.ts                          # Timeline event CRUD operations
├── lib/
│   ├── supabase/
│   │   ├── client.ts                           # Browser Supabase client (singleton)
│   │   ├── server.ts                           # Server Supabase clients
│   │   ├── middleware.ts                       # Session refresh helper
│   │   └── storage.ts                          # Storage bucket helpers
│   └── utils.ts                                # Shared utility functions
├── store/
│   └── editorStore.ts                          # Editor state (Zustand)
├── types/
│   ├── database.ts                             # Database row types
│   └── wedding.ts                              # Wedding domain types
├── middleware.ts                                # Edge middleware (auth + session)
supabase/
├── config.toml                                 # Supabase local config
└── migrations/
    ├── 00001_create_templates.sql
    ├── 00002_create_weddings.sql
    ├── 00003_create_wedding_events.sql
    ├── 00004_create_gallery_photos.sql
    ├── 00005_create_guestbook_entries.sql
    └── 00006_create_rls_policies.sql
```

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `next.config.mjs`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `.env.local.example`
- Create: `.gitignore`

- [ ] **Step 1: Initialize Next.js project**

Run:
```bash
cd D:/pet/dearly
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git
```

Expected: Project scaffolded with Next.js 14, TypeScript, Tailwind, App Router, `src/` directory.

- [ ] **Step 2: Install dependencies**

Run:
```bash
npm install @supabase/ssr@^0.4.0 @supabase/supabase-js@^2.43.0 framer-motion@^14.0.0 lucide-react@^1.52.0 zustand@^5.0.15 zod@^3.23.0 react-hook-form@^7.89.0 @hookform/resolvers@^5.9.1
```

Expected: All runtime dependencies installed.

- [ ] **Step 3: Install dev dependencies**

Run:
```bash
npm install -D vitest@^5.0.3 @vitest/coverage-v8@^5.0.3 @vitejs/plugin-react@^4.3.0 @testing-library/react@^16.3.3 @testing-library/user-event@^14.6.7 jsdom@^29.1.1 supabase@^2
```

Expected: All dev dependencies installed.

- [ ] **Step 4: Configure next.config.mjs**

Write `next.config.mjs`:
```javascript
/** @type {import("next").NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  compress: true,
  modularizeImports: {
    "lucide-react": {
      transform: "lucide-react/dist/esm/icons/{{ kebabCase member }}",
    },
  },
};

export default nextConfig;
```

- [ ] **Step 5: Configure tailwind.config.ts**

Write `tailwind.config.ts`:
```typescript
/**
 * Tailwind CSS configuration.
 * Extends the default theme with the Dearly wedding design system —
 * custom colors, fonts, and shadows for an elegant wedding aesthetic.
 */

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      colors: {
        dearly: {
          cream: "rgb(var(--dearly-cream) / <alpha-value>)",
          card: "rgb(var(--dearly-card) / <alpha-value>)",
          text: "rgb(var(--dearly-text) / <alpha-value>)",
          "text-secondary": "rgb(var(--dearly-text-secondary) / <alpha-value>)",
          "text-muted": "rgb(var(--dearly-text-muted) / <alpha-value>)",
          accent: "rgb(var(--dearly-accent) / <alpha-value>)",
          "accent-soft": "rgb(var(--dearly-accent-soft) / <alpha-value>)",
          gold: "rgb(var(--dearly-gold) / <alpha-value>)",
          "gold-soft": "rgb(var(--dearly-gold-soft) / <alpha-value>)",
          rose: "rgb(var(--dearly-rose) / <alpha-value>)",
          "rose-soft": "rgb(var(--dearly-rose-soft) / <alpha-value>)",
          border: "rgb(var(--dearly-border) / <alpha-value>)",
        },
      },
      borderRadius: {
        "2.5xl": "1.25rem",
      },
      boxShadow: {
        card: "0 1px 3px rgba(26,23,20,0.04), 0 8px 24px rgba(26,23,20,0.06)",
        "card-hover": "0 4px 12px rgba(26,23,20,0.08), 0 16px 40px rgba(26,23,20,0.10)",
        soft: "0 2px 16px rgba(26,23,20,0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 6: Write globals.css**

Write `src/app/globals.css`:
```css
/**
 * Global stylesheet.
 * Imports Tailwind layers and defines design-system variables
 * for the Dearly wedding platform aesthetic.
 */

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --dearly-cream: 252 250 247;
    --dearly-card: 255 255 255;
    --dearly-text: 38 35 30;
    --dearly-text-secondary: 107 99 90;
    --dearly-text-muted: 160 152 144;
    --dearly-accent: 180 130 100;
    --dearly-accent-soft: 252 245 240;
    --dearly-gold: 190 160 90;
    --dearly-gold-soft: 253 248 235;
    --dearly-rose: 195 130 140;
    --dearly-rose-soft: 252 240 242;
    --dearly-border: 235 230 222;
  }

  html {
    @apply h-full;
    scroll-behavior: smooth;
  }

  body {
    @apply h-full;
    -webkit-overflow-scrolling: touch;
  }

  * {
    -webkit-tap-highlight-color: transparent;
  }

  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: rgb(var(--dearly-border));
    border-radius: 999px;
  }
}

@layer utilities {
  .shimmer {
    background: linear-gradient(
      90deg,
      rgb(var(--dearly-border) / 0.3) 0%,
      rgb(var(--dearly-border) / 0.6) 50%,
      rgb(var(--dearly-border) / 0.3) 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s ease-in-out infinite;
  }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
}
```

- [ ] **Step 7: Write vitest.config.ts**

Write `vitest.config.ts`:
```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    setupFiles: ["./src/lib/__tests__/setup.ts"],
    include: ["src/**/__tests__/**/*.test.{ts,tsx}"],
    environmentMatchGlobs: [
      ["src/components/**", "jsdom"],
      ["src/hooks/**", "jsdom"],
      ["src/app/**", "jsdom"],
    ],
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/lib/**/*.ts", "src/hooks/**/*.ts", "src/store/**/*.ts"],
      exclude: ["src/**/__tests__/**"],
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 85,
      },
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
```

- [ ] **Step 8: Create test setup file**

Write `src/lib/__tests__/setup.ts`:
```typescript
/**
 * Vitest global setup — configures jsdom environment for component tests.
 */

import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 9: Create .env.local.example**

Write `.env.local.example`:
```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

- [ ] **Step 10: Create .gitignore**

Write `.gitignore`:
```
node_modules/
.next/
.env.local
.env*.local
*.tsbuildinfo
.superpowers/
coverage/
```

- [ ] **Step 11: Verify project builds**

Run: `npm run build`
Expected: Build completes without errors.

- [ ] **Step 12: Commit**

```bash
git init
git add -A
git commit -m "feat: scaffold Next.js 14 project with Tailwind, Supabase, Framer Motion"
```

---

## Task 2: Supabase Schema & Migrations

**Files:**
- Create: `supabase/config.toml`
- Create: `supabase/migrations/00001_create_templates.sql`
- Create: `supabase/migrations/00002_create_weddings.sql`
- Create: `supabase/migrations/00003_create_wedding_events.sql`
- Create: `supabase/migrations/00004_create_gallery_photos.sql`
- Create: `supabase/migrations/00005_create_guestbook_entries.sql`
- Create: `supabase/migrations/00006_create_rls_policies.sql`
- Create: `supabase/migrations/00007_create_updated_at_trigger.sql`
- Create: `supabase/seed.sql`

- [ ] **Step 1: Initialize Supabase**

Run:
```bash
npx supabase init
```

Expected: `supabase/` directory created with `config.toml`.

- [ ] **Step 2: Write templates migration**

Write `supabase/migrations/00001_create_templates.sql`:
```sql
-- Template definitions — one row per available wedding template.
-- Default config stores the template's default colors, fonts, and animation settings.

CREATE TABLE public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  preview_image TEXT,
  animation_style TEXT NOT NULL DEFAULT 'subtle'
    CHECK (animation_style IN ('subtle', 'cinematic', 'interactive')),
  default_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.templates IS 'Available wedding site templates with default styling config.';

CREATE INDEX idx_templates_slug ON public.templates (slug);
```

- [ ] **Step 3: Write weddings migration**

Write `supabase/migrations/00002_create_weddings.sql`:
```sql
-- Weddings table — one row per couple's wedding site.
-- Stores couple info, template choice, customization overrides, and publish state.

CREATE TABLE public.weddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES public.templates(id),
  slug TEXT NOT NULL UNIQUE,
  partner1_name TEXT NOT NULL DEFAULT '',
  partner2_name TEXT NOT NULL DEFAULT '',
  wedding_date DATE,
  venue_name TEXT,
  venue_address TEXT,
  story_text TEXT,
  customization JSONB NOT NULL DEFAULT '{
    "colors": {},
    "fonts": {},
    "sections": {"timeline": true, "gallery": true, "guestbook": true},
    "galleryLayout": "masonry"
  }'::jsonb,
  is_published BOOLEAN NOT NULL DEFAULT false,
  guest_uploads_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT chk_slug_format CHECK (slug ~ '^[a-z0-9][a-z0-9-]*[a-z0-9]$')
);

COMMENT ON TABLE public.weddings IS 'Couple wedding sites with template selection and customization.';

CREATE INDEX idx_weddings_user ON public.weddings (user_id);
CREATE INDEX idx_weddings_slug ON public.weddings (slug);
```

- [ ] **Step 4: Write wedding_events migration**

Write `supabase/migrations/00003_create_wedding_events.sql`:
```sql
-- Wedding events — schedule items (ceremony, reception, etc.) for a wedding timeline.

CREATE TABLE public.wedding_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  icon TEXT NOT NULL DEFAULT 'calendar',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.wedding_events IS 'Timeline events for a wedding (ceremony, reception, etc.).';

CREATE INDEX idx_wedding_events_wedding ON public.wedding_events (wedding_id);
CREATE INDEX idx_wedding_events_sort ON public.wedding_events (wedding_id, sort_order);
```

- [ ] **Step 5: Write gallery_photos migration**

Write `supabase/migrations/00004_create_gallery_photos.sql`:
```sql
-- Gallery photos — uploaded by couples or guests, with moderation support.

CREATE TABLE public.gallery_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  album TEXT NOT NULL DEFAULT 'other'
    CHECK (album IN ('pre-wedding', 'ceremony', 'reception', 'other')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  uploaded_by TEXT NOT NULL DEFAULT 'couple'
    CHECK (uploaded_by IN ('couple', 'guest')),
  guest_name TEXT,
  status TEXT NOT NULL DEFAULT 'approved'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.gallery_photos IS 'Wedding photos with album categorization and guest upload moderation.';

CREATE INDEX idx_gallery_photos_wedding ON public.gallery_photos (wedding_id);
CREATE INDEX idx_gallery_photos_album ON public.gallery_photos (wedding_id, album);
CREATE INDEX idx_gallery_photos_status ON public.gallery_photos (wedding_id, status);
```

- [ ] **Step 6: Write guestbook_entries migration**

Write `supabase/migrations/00005_create_guestbook_entries.sql`:
```sql
-- Guestbook entries — public messages from wedding guests.

CREATE TABLE public.guestbook_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT chk_message_length CHECK (char_length(message) <= 1000),
  CONSTRAINT chk_name_length CHECK (char_length(guest_name) <= 100)
);

COMMENT ON TABLE public.guestbook_entries IS 'Guest book messages for weddings. Public submission, couple moderation.';

CREATE INDEX idx_guestbook_wedding ON public.guestbook_entries (wedding_id);
CREATE INDEX idx_guestbook_created ON public.guestbook_entries (wedding_id, created_at DESC);
```

- [ ] **Step 7: Write RLS policies**

Write `supabase/migrations/00006_create_rls_policies.sql`:
```sql
-- Row Level Security policies for all tables.

-- Templates: readable by everyone, no public writes
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Templates are publicly readable"
  ON public.templates FOR SELECT
  USING (true);

-- Weddings: owners can CRUD, public can read published
ALTER TABLE public.weddings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can manage their wedding"
  ON public.weddings FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Published weddings are publicly readable"
  ON public.weddings FOR SELECT
  USING (is_published = true);

-- Wedding events: owners can CRUD, public can read via published wedding
ALTER TABLE public.wedding_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can manage timeline events"
  ON public.wedding_events FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.weddings
      WHERE weddings.id = wedding_events.wedding_id
      AND weddings.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.weddings
      WHERE weddings.id = wedding_events.wedding_id
      AND weddings.user_id = auth.uid()
    )
  );

CREATE POLICY "Public can read events of published weddings"
  ON public.wedding_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.weddings
      WHERE weddings.id = wedding_events.wedding_id
      AND weddings.is_published = true
    )
  );

-- Gallery photos: owners can CRUD, public can read approved photos of published weddings
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can manage gallery photos"
  ON public.gallery_photos FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.weddings
      WHERE weddings.id = gallery_photos.wedding_id
      AND weddings.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.weddings
      WHERE weddings.id = gallery_photos.wedding_id
      AND weddings.user_id = auth.uid()
    )
  );

CREATE POLICY "Public can read approved photos of published weddings"
  ON public.gallery_photos FOR SELECT
  USING (
    status = 'approved'
    AND EXISTS (
      SELECT 1 FROM public.weddings
      WHERE weddings.id = gallery_photos.wedding_id
      AND weddings.is_published = true
    )
  );

CREATE POLICY "Anyone can insert guest photos to published weddings"
  ON public.gallery_photos FOR INSERT
  WITH CHECK (
    uploaded_by = 'guest'
    AND status = 'pending'
    AND EXISTS (
      SELECT 1 FROM public.weddings
      WHERE weddings.id = gallery_photos.wedding_id
      AND weddings.is_published = true
      AND weddings.guest_uploads_enabled = true
    )
  );

-- Guestbook: anyone can insert, owners can delete, public can read
ALTER TABLE public.guestbook_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit guestbook entries to published weddings"
  ON public.guestbook_entries FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.weddings
      WHERE weddings.id = guestbook_entries.wedding_id
      AND weddings.is_published = true
    )
  );

CREATE POLICY "Public can read guestbook entries of published weddings"
  ON public.guestbook_entries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.weddings
      WHERE weddings.id = guestbook_entries.wedding_id
      AND weddings.is_published = true
    )
  );

CREATE POLICY "Owners can delete guestbook entries"
  ON public.guestbook_entries FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.weddings
      WHERE weddings.id = guestbook_entries.wedding_id
      AND weddings.user_id = auth.uid()
    )
  );
```

- [ ] **Step 8: Write updated_at trigger**

Write `supabase/migrations/00007_create_updated_at_trigger.sql`:
```sql
-- Shared trigger function: auto-set updated_at on row modification.

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.weddings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
```

- [ ] **Step 9: Write seed data**

Write `supabase/seed.sql`:
```sql
-- Seed the 10 wedding templates with default configs.

INSERT INTO public.templates (name, slug, description, animation_style, default_config) VALUES
('Eternal', 'eternal', 'Classic elegant — serif fonts, gold accents, ivory tones', 'subtle', '{
  "colors": {"primary": "#B8860B", "secondary": "#FFFFF0", "accent": "#D4A574"},
  "fonts": {"display": "Playfair Display", "body": "Lato"},
  "animations": {"entrance": "fade", "scroll": "parallax"}
}'::jsonb),
('Bloom', 'bloom', 'Romantic floral — watercolor flowers, soft pinks, greens', 'cinematic', '{
  "colors": {"primary": "#D4A0A0", "secondary": "#FFF5F5", "accent": "#7BA07B"},
  "fonts": {"display": "Cormorant Garamond", "body": "Quicksand"},
  "animations": {"entrance": "bloom", "scroll": "reveal", "particles": "petals"}
}'::jsonb),
('Minimal', 'minimal', 'Modern clean — sans-serif, whitespace, monochrome', 'subtle', '{
  "colors": {"primary": "#1A1A1A", "secondary": "#FFFFFF", "accent": "#666666"},
  "fonts": {"display": "Inter", "body": "Inter"},
  "animations": {"entrance": "slide-up", "scroll": "stagger"}
}'::jsonb),
('Rustic', 'rustic', 'Botanical earthy — kraft textures, hand-drawn illustrations', 'subtle', '{
  "colors": {"primary": "#5C4033", "secondary": "#F5F0E8", "accent": "#8B7355"},
  "fonts": {"display": "Amatic SC", "body": "Josefin Sans"},
  "animations": {"entrance": "sketch", "scroll": "drift"}
}'::jsonb),
('Deco', 'deco', 'Art Deco — geometric patterns, gold/black, gatsby vibes', 'cinematic', '{
  "colors": {"primary": "#C5A55A", "secondary": "#1A1A2E", "accent": "#E8D5A3"},
  "fonts": {"display": "Poiret One", "body": "Raleway"},
  "animations": {"entrance": "geometric-build", "scroll": "shimmer"}
}'::jsonb),
('Sunset', 'sunset', 'Warm tropical — coral, terracotta, palm motifs', 'cinematic', '{
  "colors": {"primary": "#E07A5F", "secondary": "#FFF8F0", "accent": "#F2CC8F"},
  "fonts": {"display": "Libre Baskerville", "body": "Source Sans 3"},
  "animations": {"entrance": "wave", "scroll": "gradient-shift"}
}'::jsonb),
('Noir', 'noir', 'Dark moody — dramatic typography, dark backgrounds', 'cinematic', '{
  "colors": {"primary": "#E0D6C8", "secondary": "#0D0D0D", "accent": "#8B7D6B"},
  "fonts": {"display": "Bodoni Moda", "body": "Outfit"},
  "animations": {"entrance": "cinematic-reveal", "scroll": "spotlight"}
}'::jsonb),
('Garden', 'garden', 'English garden — muted pastels, delicate borders', 'interactive', '{
  "colors": {"primary": "#7BA07B", "secondary": "#F8FAF5", "accent": "#C4A882"},
  "fonts": {"display": "EB Garamond", "body": "Nunito"},
  "animations": {"entrance": "vine-growth", "scroll": "reveal", "particles": "butterfly"}
}'::jsonb),
('Polaroid', 'polaroid', 'Retro playful — polaroid frames, handwritten fonts', 'interactive', '{
  "colors": {"primary": "#2C3E50", "secondary": "#FDFCF8", "accent": "#E74C3C"},
  "fonts": {"display": "Caveat", "body": "Poppins"},
  "animations": {"entrance": "scatter", "scroll": "tape-peel"}
}'::jsonb),
('Glass', 'glass', 'Glassmorphism — frosted panels, gradients, depth layers', 'interactive', '{
  "colors": {"primary": "#667EEA", "secondary": "#F0F4FF", "accent": "#764BA2"},
  "fonts": {"display": "Sora", "body": "DM Sans"},
  "animations": {"entrance": "float", "scroll": "tilt-3d"}
}'::jsonb);
```

- [ ] **Step 10: Commit**

```bash
git add supabase/
git commit -m "feat: add Supabase schema with templates, weddings, gallery, guestbook, and RLS"
```

---

## Task 3: Supabase Client Setup & Auth Infrastructure

**Files:**
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/middleware.ts`
- Create: `src/lib/supabase/storage.ts`
- Create: `src/middleware.ts`
- Create: `src/context/AuthContext.tsx`
- Create: `src/types/database.ts`
- Create: `src/types/wedding.ts`

- [ ] **Step 1: Write database types**

Write `src/types/database.ts`:
```typescript
/**
 * Database row types matching the Supabase schema.
 * Used for type-safe queries throughout the application.
 */

export interface TemplateRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  preview_image: string | null;
  animation_style: "subtle" | "cinematic" | "interactive";
  default_config: TemplateConfig;
  created_at: string;
}

export interface TemplateConfig {
  colors: { primary: string; secondary: string; accent: string };
  fonts: { display: string; body: string };
  animations: Record<string, string>;
}

export interface WeddingRow {
  id: string;
  user_id: string;
  template_id: string;
  slug: string;
  partner1_name: string;
  partner2_name: string;
  wedding_date: string | null;
  venue_name: string | null;
  venue_address: string | null;
  story_text: string | null;
  customization: WeddingCustomization;
  is_published: boolean;
  guest_uploads_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface WeddingCustomization {
  colors: { primary?: string; secondary?: string; accent?: string };
  fonts: { display?: string; body?: string };
  sections: { timeline: boolean; gallery: boolean; guestbook: boolean };
  galleryLayout: "masonry" | "albums" | "timeline";
}

export interface WeddingEventRow {
  id: string;
  wedding_id: string;
  title: string;
  description: string | null;
  location: string | null;
  start_time: string;
  end_time: string | null;
  icon: string;
  sort_order: number;
  created_at: string;
}

export interface GalleryPhotoRow {
  id: string;
  wedding_id: string;
  url: string;
  thumbnail_url: string | null;
  caption: string | null;
  album: "pre-wedding" | "ceremony" | "reception" | "other";
  sort_order: number;
  uploaded_by: "couple" | "guest";
  guest_name: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export interface GuestbookEntryRow {
  id: string;
  wedding_id: string;
  guest_name: string;
  message: string;
  created_at: string;
}
```

- [ ] **Step 2: Write wedding domain types**

Write `src/types/wedding.ts`:
```typescript
/**
 * Wedding domain types — used by components and hooks.
 * Combines database rows with joined/computed fields.
 */

import type {
  WeddingRow,
  WeddingEventRow,
  GalleryPhotoRow,
  GuestbookEntryRow,
  TemplateRow,
} from "./database";

/** Wedding with its template joined. */
export interface WeddingWithTemplate extends WeddingRow {
  template: TemplateRow;
}

/** Full wedding data for guest-facing rendering. */
export interface WeddingSiteData {
  wedding: WeddingWithTemplate;
  events: WeddingEventRow[];
  photos: GalleryPhotoRow[];
  guestbookEntries: GuestbookEntryRow[];
}
```

- [ ] **Step 3: Write Supabase browser client**

Write `src/lib/supabase/client.ts`:
```typescript
/**
 * Browser-side Supabase client using @supabase/ssr createBrowserClient.
 * Must only be imported in Client Components (files with 'use client').
 * Uses the public anon key — RLS policies apply.
 */

import { createBrowserClient } from "@supabase/ssr";

/** Singleton browser client — reuses the same instance across all calls. */
let browserClient: ReturnType<typeof createBrowserClient> | null = null;

/**
 * Returns a singleton Supabase client for use in the browser.
 * Persists auth session in localStorage so users stay logged in.
 */
export function createClient() {
  if (browserClient) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  if (!key) throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set");

  browserClient = createBrowserClient(url, key);
  return browserClient;
}
```

- [ ] **Step 4: Write Supabase server clients**

Write `src/lib/supabase/server.ts`:
```typescript
/**
 * Server-side Supabase client factories.
 * Must only be imported in Server Components, Route Handlers, and Server Actions.
 */

import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Returns a Supabase client authenticated with the service role key.
 * Bypasses RLS — use only for admin operations.
 */
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Returns a Supabase SSR client scoped to the current request's cookies.
 * RLS applies — use in Server Components and Route Handlers.
 */
export function createCookieClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  );
}
```

- [ ] **Step 5: Write Supabase middleware helper**

Write `src/lib/supabase/middleware.ts`:
```typescript
/**
 * Supabase session refresh helper for Next.js middleware.
 * Reads cookies, refreshes auth token on every request.
 */

import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

/**
 * Reads the session from cookies, refreshes it if needed, and writes
 * updated cookies back to the response.
 */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  if (!key) throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set");

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  await supabase.auth.getUser();
  return supabaseResponse;
}
```

- [ ] **Step 6: Write storage helpers**

Write `src/lib/supabase/storage.ts`:
```typescript
/**
 * Supabase Storage helpers for wedding photo uploads.
 * Handles file upload, URL generation, and deletion.
 */

import { createClient } from "./client";

const PHOTOS_BUCKET = "wedding-photos";

/**
 * Uploads a photo to the wedding-photos bucket.
 * Returns the public URL of the uploaded file.
 *
 * @param weddingId - The wedding this photo belongs to.
 * @param file - The file to upload.
 * @param folder - Optional subfolder (e.g., "gallery", "assets").
 */
export async function uploadPhoto(
  weddingId: string,
  file: File,
  folder: string = "gallery"
): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `${weddingId}/${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;

  const { error } = await supabase.storage
    .from(PHOTOS_BUCKET)
    .upload(fileName, file, { upsert: false });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage
    .from(PHOTOS_BUCKET)
    .getPublicUrl(fileName);

  return data.publicUrl;
}

/**
 * Deletes a photo from the wedding-photos bucket.
 *
 * @param filePath - The storage path to delete.
 */
export async function deletePhoto(filePath: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.storage
    .from(PHOTOS_BUCKET)
    .remove([filePath]);

  if (error) throw new Error(`Delete failed: ${error.message}`);
}
```

- [ ] **Step 7: Write edge middleware**

Write `src/middleware.ts`:
```typescript
/**
 * Next.js edge middleware — refreshes the Supabase session on every request
 * and enforces auth protection on dashboard routes.
 */

import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/** Routes that require an authenticated session. */
const PROTECTED_PATHS = ["/dashboard"];

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const response = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));

  if (isProtected) {
    const hasSession = Array.from(request.cookies.getAll()).some(({ name }) =>
      name.startsWith("sb-") && name.endsWith("-auth-token")
    );

    if (!hasSession) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

- [ ] **Step 8: Write AuthContext**

Write `src/context/AuthContext.tsx`:
```typescript
"use client";

/**
 * AuthContext — provides authenticated user state and auth actions
 * to all client components in the tree.
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

interface AuthContextValue {
  /** Currently authenticated user, or null if not signed in. */
  user: User | null;
  /** Active Supabase session, or null if not signed in. */
  session: Session | null;
  /** Whether the initial auth state has been resolved. */
  loading: boolean;
  /** Signs the user in with email and password. */
  signIn: (email: string, password: string) => Promise<void>;
  /** Creates a new account with email, password, and optional display name. */
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  /** Signs the user in with a third-party OAuth provider. */
  signInWithOAuth: (provider: "google" | "apple") => Promise<void>;
  /** Signs the current user out and clears the session. */
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Provides auth state and actions to children via React context.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function signIn(email: string, password: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async function signUp(
    email: string,
    password: string,
    displayName?: string
  ): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        ...(displayName ? { data: { display_name: displayName } } : {}),
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  }

  async function signInWithOAuth(provider: "google" | "apple"): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  }

  async function signOut(): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signInWithOAuth, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Returns the current auth context. Must be used inside an <AuthProvider>.
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
```

- [ ] **Step 9: Write test for Supabase client**

Write `src/lib/__tests__/supabase-client.test.ts`:
```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("createClient", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("throws if NEXT_PUBLIC_SUPABASE_URL is not set", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-key");

    const { createClient } = await import("@/lib/supabase/client");
    expect(() => createClient()).toThrow("NEXT_PUBLIC_SUPABASE_URL is not set");
  });

  it("throws if NEXT_PUBLIC_SUPABASE_ANON_KEY is not set", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");

    const { createClient } = await import("@/lib/supabase/client");
    expect(() => createClient()).toThrow("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set");
  });
});
```

- [ ] **Step 10: Run tests**

Run: `npx vitest run src/lib/__tests__/supabase-client.test.ts`
Expected: PASS

- [ ] **Step 11: Commit**

```bash
git add src/lib/ src/types/ src/context/ src/middleware.ts
git commit -m "feat: add Supabase clients, auth context, middleware, and database types"
```

---

## Task 4: Auth Pages (Login + Signup + OAuth Callback)

**Files:**
- Create: `src/app/(auth)/login/page.tsx`
- Create: `src/app/(auth)/signup/page.tsx`
- Create: `src/app/auth/callback/route.ts`
- Create: `src/components/auth/LoginForm.tsx`
- Create: `src/components/auth/SignupForm.tsx`
- Create: `src/components/auth/SocialLoginButtons.tsx`

- [ ] **Step 1: Write SocialLoginButtons component**

Write `src/components/auth/SocialLoginButtons.tsx`:
```typescript
"use client";

/**
 * OAuth sign-in buttons for Google and Apple.
 */

import { useAuth } from "@/context/AuthContext";

/**
 * Renders Google and Apple OAuth sign-in buttons.
 * Calls signInWithOAuth from AuthContext to initiate the OAuth flow.
 */
export default function SocialLoginButtons() {
  const { signInWithOAuth } = useAuth();

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => signInWithOAuth("google")}
        className="flex items-center justify-center gap-2 rounded-lg border border-dearly-border bg-white px-4 py-2.5 text-sm font-medium text-dearly-text transition hover:bg-dearly-accent-soft"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Continue with Google
      </button>
      <button
        type="button"
        onClick={() => signInWithOAuth("apple")}
        className="flex items-center justify-center gap-2 rounded-lg border border-dearly-border bg-white px-4 py-2.5 text-sm font-medium text-dearly-text transition hover:bg-dearly-accent-soft"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
        </svg>
        Continue with Apple
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Write LoginForm component**

Write `src/components/auth/LoginForm.tsx`:
```typescript
"use client";

/**
 * Login form — email + password sign-in.
 * On success, redirects to /dashboard.
 */

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import SocialLoginButtons from "./SocialLoginButtons";

export default function LoginForm() {
  const { signIn } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /** Handles form submission — signs in and redirects on success. */
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-2xl bg-dearly-card p-8 shadow-card">
      <h1 className="mb-6 font-display text-2xl font-bold text-dearly-text">Sign in</h1>

      <SocialLoginButtons />

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-dearly-border" />
        <span className="text-xs text-dearly-text-muted">or</span>
        <div className="h-px flex-1 bg-dearly-border" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-dearly-text-secondary">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-dearly-border bg-white px-3 py-2 text-sm focus:border-dearly-accent focus:outline-none focus:ring-1 focus:ring-dearly-accent"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-dearly-text-secondary">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-dearly-border bg-white px-3 py-2 text-sm focus:border-dearly-accent focus:outline-none focus:ring-1 focus:ring-dearly-accent"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-lg bg-dearly-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-dearly-text-muted">
        No account?{" "}
        <Link href="/signup" className="font-medium text-dearly-accent hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
```

- [ ] **Step 3: Write SignupForm component**

Write `src/components/auth/SignupForm.tsx`:
```typescript
"use client";

/**
 * Signup form — creates a new couple account.
 * On success, shows a confirmation message or redirects.
 */

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import SocialLoginButtons from "./SocialLoginButtons";

export default function SignupForm() {
  const { signUp } = useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /** Handles form submission — creates account and redirects on success. */
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signUp(email, password, displayName || undefined);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-2xl bg-dearly-card p-8 shadow-card">
      <h1 className="mb-6 font-display text-2xl font-bold text-dearly-text">Create your wedding site</h1>

      <SocialLoginButtons />

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-dearly-border" />
        <span className="text-xs text-dearly-text-muted">or</span>
        <div className="h-px flex-1 bg-dearly-border" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="displayName" className="mb-1 block text-sm font-medium text-dearly-text-secondary">
            Your name
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full rounded-lg border border-dearly-border bg-white px-3 py-2 text-sm focus:border-dearly-accent focus:outline-none focus:ring-1 focus:ring-dearly-accent"
            placeholder="e.g. Sarah"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-dearly-text-secondary">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-dearly-border bg-white px-3 py-2 text-sm focus:border-dearly-accent focus:outline-none focus:ring-1 focus:ring-dearly-accent"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-dearly-text-secondary">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-dearly-border bg-white px-3 py-2 text-sm focus:border-dearly-accent focus:outline-none focus:ring-1 focus:ring-dearly-accent"
            placeholder="Min 8 characters"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-lg bg-dearly-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Creating account…" : "Get started"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-dearly-text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-dearly-accent hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
```

- [ ] **Step 4: Write login page**

Write `src/app/(auth)/login/page.tsx`:
```typescript
/**
 * Login page — renders the LoginForm centered on screen.
 */

import LoginForm from "@/components/auth/LoginForm";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-dearly-cream px-4">
      <LoginForm />
    </main>
  );
}
```

- [ ] **Step 5: Write signup page**

Write `src/app/(auth)/signup/page.tsx`:
```typescript
/**
 * Signup page — renders the SignupForm centered on screen.
 */

import SignupForm from "@/components/auth/SignupForm";

export const metadata = { title: "Sign up" };

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-dearly-cream px-4">
      <SignupForm />
    </main>
  );
}
```

- [ ] **Step 6: Write OAuth callback route**

Write `src/app/auth/callback/route.ts`:
```typescript
/**
 * OAuth callback route — exchanges the auth code for a session.
 * After OAuth sign-in, Supabase redirects here with a `code` parameter.
 */

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name: string) => cookieStore.get(name)?.value,
          set: (name: string, value: string, options: Record<string, unknown>) => {
            cookieStore.set({ name, value, ...options });
          },
          remove: (name: string, options: Record<string, unknown>) => {
            cookieStore.delete({ name, ...options });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
```

- [ ] **Step 7: Commit**

```bash
git add src/app/(auth)/ src/app/auth/ src/components/auth/
git commit -m "feat: add login, signup, and OAuth callback pages"
```

---

## Task 5: Template Type System & Registry

**Files:**
- Create: `src/components/templates/types.ts`
- Create: `src/components/templates/registry.ts`
- Test: `src/components/templates/__tests__/registry.test.ts`

- [ ] **Step 1: Write template component interfaces**

Write `src/components/templates/types.ts`:
```typescript
/**
 * Template component interfaces — every template must export components
 * matching these props to be registered.
 */

import type { WeddingRow, WeddingEventRow, GalleryPhotoRow, GuestbookEntryRow, TemplateConfig } from "@/types/database";

/** Merged config: template defaults overridden by couple's customization. */
export interface ResolvedTheme {
  colors: { primary: string; secondary: string; accent: string };
  fonts: { display: string; body: string };
  animations: Record<string, string>;
}

/** Props passed to every template invitation page. */
export interface InvitationPageProps {
  wedding: WeddingRow;
  events: WeddingEventRow[];
  theme: ResolvedTheme;
}

/** Props passed to every template gallery layout. */
export interface GalleryLayoutProps {
  wedding: WeddingRow;
  photos: GalleryPhotoRow[];
  layout: "masonry" | "albums" | "timeline";
  theme: ResolvedTheme;
}

/** Props passed to every template timeline section. */
export interface TimelineSectionProps {
  events: WeddingEventRow[];
  theme: ResolvedTheme;
}

/** Props passed to every template guestbook section. */
export interface GuestbookSectionProps {
  weddingId: string;
  entries: GuestbookEntryRow[];
  theme: ResolvedTheme;
}

/** The complete set of components a template must export. */
export interface TemplateComponents {
  InvitationPage: React.ComponentType<InvitationPageProps>;
  GalleryLayout: React.ComponentType<GalleryLayoutProps>;
  TimelineSection: React.ComponentType<TimelineSectionProps>;
  GuestbookSection: React.ComponentType<GuestbookSectionProps>;
}

/** Template metadata + lazy-loaded components. */
export interface TemplateDefinition {
  slug: string;
  name: string;
  load: () => Promise<TemplateComponents>;
}

/**
 * Resolves theme by merging template defaults with couple customization.
 */
export function resolveTheme(
  templateConfig: TemplateConfig,
  customization: WeddingRow["customization"]
): ResolvedTheme {
  return {
    colors: {
      primary: customization.colors?.primary ?? templateConfig.colors.primary,
      secondary: customization.colors?.secondary ?? templateConfig.colors.secondary,
      accent: customization.colors?.accent ?? templateConfig.colors.accent,
    },
    fonts: {
      display: customization.fonts?.display ?? templateConfig.fonts.display,
      body: customization.fonts?.body ?? templateConfig.fonts.body,
    },
    animations: templateConfig.animations ?? {},
  };
}
```

- [ ] **Step 2: Write template registry**

Write `src/components/templates/registry.ts`:
```typescript
/**
 * Template registry — maps template slugs to lazy-loaded component bundles.
 * Adding a new template = adding an entry here + creating the folder.
 */

import type { TemplateDefinition } from "./types";

/**
 * All available templates. Each entry uses dynamic import so templates
 * are only loaded when needed (route-level code splitting).
 */
const templates: TemplateDefinition[] = [
  {
    slug: "eternal",
    name: "Eternal",
    load: () => import("./eternal").then((m) => m.default),
  },
  {
    slug: "bloom",
    name: "Bloom",
    load: () => import("./bloom").then((m) => m.default),
  },
  {
    slug: "minimal",
    name: "Minimal",
    load: () => import("./minimal").then((m) => m.default),
  },
  {
    slug: "rustic",
    name: "Rustic",
    load: () => import("./rustic").then((m) => m.default),
  },
  {
    slug: "deco",
    name: "Deco",
    load: () => import("./deco").then((m) => m.default),
  },
  {
    slug: "sunset",
    name: "Sunset",
    load: () => import("./sunset").then((m) => m.default),
  },
  {
    slug: "noir",
    name: "Noir",
    load: () => import("./noir").then((m) => m.default),
  },
  {
    slug: "garden",
    name: "Garden",
    load: () => import("./garden").then((m) => m.default),
  },
  {
    slug: "polaroid",
    name: "Polaroid",
    load: () => import("./polaroid").then((m) => m.default),
  },
  {
    slug: "glass",
    name: "Glass",
    load: () => import("./glass").then((m) => m.default),
  },
];

/**
 * Returns the template definition for a given slug.
 * Returns undefined if no template matches.
 */
export function getTemplate(slug: string): TemplateDefinition | undefined {
  return templates.find((t) => t.slug === slug);
}

/**
 * Returns all available template definitions (for template picker).
 */
export function getAllTemplates(): TemplateDefinition[] {
  return templates;
}
```

- [ ] **Step 3: Write registry test**

Write `src/components/templates/__tests__/registry.test.ts`:
```typescript
import { describe, it, expect } from "vitest";
import { getTemplate, getAllTemplates } from "../registry";

describe("template registry", () => {
  it("returns all 10 templates", () => {
    const all = getAllTemplates();
    expect(all).toHaveLength(10);
  });

  it("finds a template by slug", () => {
    const eternal = getTemplate("eternal");
    expect(eternal).toBeDefined();
    expect(eternal!.name).toBe("Eternal");
  });

  it("returns undefined for unknown slug", () => {
    const unknown = getTemplate("nonexistent");
    expect(unknown).toBeUndefined();
  });

  it("has unique slugs", () => {
    const all = getAllTemplates();
    const slugs = all.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/components/templates/__tests__/registry.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 5: Write resolveTheme test**

Write `src/components/templates/__tests__/resolve-theme.test.ts`:
```typescript
import { describe, it, expect } from "vitest";
import { resolveTheme } from "../types";
import type { TemplateConfig, WeddingCustomization } from "@/types/database";

describe("resolveTheme", () => {
  const defaultConfig: TemplateConfig = {
    colors: { primary: "#gold", secondary: "#ivory", accent: "#copper" },
    fonts: { display: "Playfair Display", body: "Lato" },
    animations: { entrance: "fade", scroll: "parallax" },
  };

  it("uses template defaults when no customization is set", () => {
    const customization: WeddingCustomization = {
      colors: {},
      fonts: {},
      sections: { timeline: true, gallery: true, guestbook: true },
      galleryLayout: "masonry",
    };

    const theme = resolveTheme(defaultConfig, customization);
    expect(theme.colors.primary).toBe("#gold");
    expect(theme.fonts.display).toBe("Playfair Display");
  });

  it("overrides defaults with couple customization", () => {
    const customization: WeddingCustomization = {
      colors: { primary: "#custom-pink" },
      fonts: { display: "Inter" },
      sections: { timeline: true, gallery: true, guestbook: true },
      galleryLayout: "masonry",
    };

    const theme = resolveTheme(defaultConfig, customization);
    expect(theme.colors.primary).toBe("#custom-pink");
    expect(theme.colors.secondary).toBe("#ivory");
    expect(theme.fonts.display).toBe("Inter");
    expect(theme.fonts.body).toBe("Lato");
  });
});
```

- [ ] **Step 6: Run tests**

Run: `npx vitest run src/components/templates/__tests__/resolve-theme.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 7: Commit**

```bash
git add src/components/templates/types.ts src/components/templates/registry.ts src/components/templates/__tests__/
git commit -m "feat: add template type system, registry, and resolveTheme with tests"
```

---

## Task 6: Template — Eternal (Classic Elegant)

**Files:**
- Create: `src/components/templates/eternal/theme.ts`
- Create: `src/components/templates/eternal/InvitationPage.tsx`
- Create: `src/components/templates/eternal/GalleryLayout.tsx`
- Create: `src/components/templates/eternal/TimelineSection.tsx`
- Create: `src/components/templates/eternal/GuestbookSection.tsx`
- Create: `src/components/templates/eternal/index.ts`
- Create: `src/components/ui/CountdownTimer.tsx`

**This is the reference template — establishes the pattern all others follow.**

- [ ] **Step 1: Write CountdownTimer shared component**

Write `src/components/ui/CountdownTimer.tsx`:
```typescript
"use client";

/**
 * Countdown timer — displays days, hours, minutes, seconds until a target date.
 * Used on wedding invitation pages across all templates.
 */

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate: string;
  className?: string;
  labelClassName?: string;
  numberClassName?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Calculates the time remaining until the target date.
 */
function calculateTimeLeft(targetDate: string): TimeLeft {
  const diff = new Date(targetDate).getTime() - Date.now();

  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownTimer({
  targetDate,
  className = "",
  labelClassName = "",
  numberClassName = "",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className={`flex gap-6 ${className}`}>
      {units.map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center">
          <span className={`text-3xl font-bold tabular-nums ${numberClassName}`}>
            {String(value).padStart(2, "0")}
          </span>
          <span className={`mt-1 text-xs uppercase tracking-wider ${labelClassName}`}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Write Eternal theme**

Write `src/components/templates/eternal/theme.ts`:
```typescript
/**
 * Eternal theme — classic elegant wedding with serif fonts,
 * gold accents, and ivory background. Subtle fade-in animations.
 */

export const eternalTheme = {
  colors: {
    primary: "#B8860B",
    secondary: "#FFFFF0",
    accent: "#D4A574",
  },
  fonts: {
    display: "Playfair Display",
    body: "Lato",
  },
  animations: {
    entrance: "fade",
    scroll: "parallax",
  },
};
```

- [ ] **Step 3: Write Eternal InvitationPage**

Write `src/components/templates/eternal/InvitationPage.tsx`:
```typescript
"use client";

/**
 * Eternal invitation page — classic elegant design with serif typography,
 * gold accents, subtle fade-in animations, and gentle parallax scrolling.
 */

import { motion } from "framer-motion";
import { MapPin, Calendar } from "lucide-react";
import CountdownTimer from "@/components/ui/CountdownTimer";
import type { InvitationPageProps } from "../types";

/** Staggered fade-in container for child elements. */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3, delayChildren: 0.2 },
  },
};

/** Individual element fade-in from below. */
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function EternalInvitationPage({ wedding, events, theme }: InvitationPageProps) {
  const weddingDate = wedding.wedding_date
    ? new Date(wedding.wedding_date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: theme.colors.secondary,
        fontFamily: `'${theme.fonts.body}', sans-serif`,
      }}
    >
      {/* Hero section */}
      <motion.section
        className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Decorative line */}
        <motion.div
          variants={itemVariants}
          className="mb-8 h-px w-24"
          style={{ backgroundColor: theme.colors.primary }}
        />

        <motion.p
          variants={itemVariants}
          className="mb-4 text-sm uppercase tracking-[0.3em]"
          style={{ color: theme.colors.primary }}
        >
          Together with their families
        </motion.p>

        <motion.h1
          variants={itemVariants}
          className="mb-2 text-5xl font-light md:text-7xl"
          style={{
            fontFamily: `'${theme.fonts.display}', serif`,
            color: theme.colors.primary,
          }}
        >
          {wedding.partner1_name}
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mb-2 text-2xl italic"
          style={{ color: theme.colors.accent, fontFamily: `'${theme.fonts.display}', serif` }}
        >
          &amp;
        </motion.p>

        <motion.h1
          variants={itemVariants}
          className="mb-8 text-5xl font-light md:text-7xl"
          style={{
            fontFamily: `'${theme.fonts.display}', serif`,
            color: theme.colors.primary,
          }}
        >
          {wedding.partner2_name}
        </motion.h1>

        <motion.div
          variants={itemVariants}
          className="mb-6 h-px w-24"
          style={{ backgroundColor: theme.colors.primary }}
        />

        <motion.p
          variants={itemVariants}
          className="text-sm uppercase tracking-[0.2em]"
          style={{ color: theme.colors.accent }}
        >
          Request the pleasure of your company
        </motion.p>

        {weddingDate && (
          <motion.div variants={itemVariants} className="mt-8 flex flex-col items-center gap-2">
            <Calendar size={20} style={{ color: theme.colors.primary }} />
            <p
              className="text-lg"
              style={{ color: theme.colors.primary, fontFamily: `'${theme.fonts.display}', serif` }}
            >
              {weddingDate}
            </p>
          </motion.div>
        )}

        {wedding.venue_name && (
          <motion.div variants={itemVariants} className="mt-4 flex flex-col items-center gap-2">
            <MapPin size={20} style={{ color: theme.colors.primary }} />
            <p className="text-base" style={{ color: theme.colors.accent }}>
              {wedding.venue_name}
            </p>
            {wedding.venue_address && (
              <p className="text-sm" style={{ color: theme.colors.accent, opacity: 0.7 }}>
                {wedding.venue_address}
              </p>
            )}
          </motion.div>
        )}

        {wedding.wedding_date && (
          <motion.div variants={itemVariants} className="mt-12">
            <CountdownTimer
              targetDate={wedding.wedding_date}
              numberClassName="text-dearly-text"
              labelClassName="text-dearly-text-muted"
            />
          </motion.div>
        )}
      </motion.section>

      {/* Story section */}
      {wedding.story_text && (
        <motion.section
          className="mx-auto max-w-2xl px-6 py-20 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
        >
          <h2
            className="mb-8 text-3xl"
            style={{ fontFamily: `'${theme.fonts.display}', serif`, color: theme.colors.primary }}
          >
            Our Story
          </h2>
          <p
            className="whitespace-pre-line text-base leading-relaxed"
            style={{ color: theme.colors.accent }}
          >
            {wedding.story_text}
          </p>
        </motion.section>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Write Eternal GalleryLayout**

Write `src/components/templates/eternal/GalleryLayout.tsx`:
```typescript
"use client";

/**
 * Eternal gallery layout — delegates to the shared gallery components
 * (masonry, albums, timeline) with Eternal-specific styling.
 */

import { motion } from "framer-motion";
import type { GalleryLayoutProps } from "../types";
import MasonryGrid from "@/components/gallery/MasonryGrid";
import AlbumView from "@/components/gallery/AlbumView";
import TimelineGallery from "@/components/gallery/TimelineGallery";

export default function EternalGalleryLayout({ wedding, photos, layout, theme }: GalleryLayoutProps) {
  const layoutComponents = {
    masonry: MasonryGrid,
    albums: AlbumView,
    timeline: TimelineGallery,
  };

  const LayoutComponent = layoutComponents[layout];

  return (
    <div
      className="min-h-screen px-6 py-20"
      style={{ backgroundColor: theme.colors.secondary }}
    >
      <motion.div
        className="mx-auto max-w-6xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2
          className="mb-12 text-center text-3xl"
          style={{ fontFamily: `'${theme.fonts.display}', serif`, color: theme.colors.primary }}
        >
          Our Gallery
        </h2>
        <LayoutComponent photos={photos} theme={theme} weddingId={wedding.id} />
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 5: Write Eternal TimelineSection**

Write `src/components/templates/eternal/TimelineSection.tsx`:
```typescript
"use client";

/**
 * Eternal timeline — vertical timeline with gold connecting line,
 * events revealed with fade-in on scroll.
 */

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import type { TimelineSectionProps } from "../types";

export default function EternalTimelineSection({ events, theme }: TimelineSectionProps) {
  if (events.length === 0) return null;

  return (
    <section className="mx-auto max-w-2xl px-6 py-20">
      <h2
        className="mb-12 text-center text-3xl"
        style={{ fontFamily: `'${theme.fonts.display}', serif`, color: theme.colors.primary }}
      >
        Schedule of Events
      </h2>

      <div className="relative">
        {/* Vertical connecting line */}
        <div
          className="absolute left-6 top-0 h-full w-px"
          style={{ backgroundColor: theme.colors.primary, opacity: 0.3 }}
        />

        <div className="flex flex-col gap-8">
          {events.map((event, i) => {
            const IconComponent = (LucideIcons as Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>>)[
              event.icon.charAt(0).toUpperCase() + event.icon.slice(1)
            ] ?? LucideIcons.Calendar;

            return (
              <motion.div
                key={event.id}
                className="flex gap-6 pl-2"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  <IconComponent size={18} style={{ color: theme.colors.secondary }} />
                </div>

                <div>
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: theme.colors.primary, fontFamily: `'${theme.fonts.display}', serif` }}
                  >
                    {event.title}
                  </h3>
                  <p className="mt-1 text-sm" style={{ color: theme.colors.accent }}>
                    {new Date(event.start_time).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                    {event.end_time && (
                      <> – {new Date(event.end_time).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}</>
                    )}
                  </p>
                  {event.location && (
                    <p className="mt-1 text-sm" style={{ color: theme.colors.accent, opacity: 0.7 }}>
                      {event.location}
                    </p>
                  )}
                  {event.description && (
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: theme.colors.accent }}>
                      {event.description}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Write Eternal GuestbookSection**

Write `src/components/templates/eternal/GuestbookSection.tsx`:
```typescript
"use client";

/**
 * Eternal guestbook — elegant card display with serif headings
 * and a submission form styled to match the classic aesthetic.
 */

import { motion } from "framer-motion";
import GuestbookForm from "@/components/guestbook/GuestbookForm";
import type { GuestbookSectionProps } from "../types";

export default function EternalGuestbookSection({ weddingId, entries, theme }: GuestbookSectionProps) {
  return (
    <section
      className="mx-auto max-w-2xl px-6 py-20"
      style={{ fontFamily: `'${theme.fonts.body}', sans-serif` }}
    >
      <h2
        className="mb-12 text-center text-3xl"
        style={{ fontFamily: `'${theme.fonts.display}', serif`, color: theme.colors.primary }}
      >
        Guest Book
      </h2>

      <GuestbookForm weddingId={weddingId} theme={theme} />

      <div className="mt-12 flex flex-col gap-6">
        {entries.map((entry, i) => (
          <motion.div
            key={entry.id}
            className="rounded-lg border p-6"
            style={{ borderColor: `${theme.colors.primary}20`, backgroundColor: `${theme.colors.secondary}` }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
          >
            <p className="text-base leading-relaxed" style={{ color: theme.colors.accent }}>
              &ldquo;{entry.message}&rdquo;
            </p>
            <p
              className="mt-3 text-sm font-medium"
              style={{ color: theme.colors.primary }}
            >
              — {entry.guest_name}
            </p>
            <p className="mt-1 text-xs" style={{ color: theme.colors.accent, opacity: 0.5 }}>
              {new Date(entry.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 7: Write Eternal index**

Write `src/components/templates/eternal/index.ts`:
```typescript
/**
 * Eternal template barrel export.
 * Exports all components conforming to the TemplateComponents interface.
 */

import type { TemplateComponents } from "../types";
import InvitationPage from "./InvitationPage";
import GalleryLayout from "./GalleryLayout";
import TimelineSection from "./TimelineSection";
import GuestbookSection from "./GuestbookSection";

const components: TemplateComponents = {
  InvitationPage,
  GalleryLayout,
  TimelineSection,
  GuestbookSection,
};

export default components;
```

- [ ] **Step 8: Commit**

```bash
git add src/components/templates/eternal/ src/components/ui/CountdownTimer.tsx
git commit -m "feat: add Eternal template (classic elegant) with all page components"
```

---

## Task 7: Shared Gallery Components (Masonry, Albums, Timeline, Lightbox)

**Files:**
- Create: `src/components/gallery/MasonryGrid.tsx`
- Create: `src/components/gallery/AlbumView.tsx`
- Create: `src/components/gallery/TimelineGallery.tsx`
- Create: `src/components/gallery/Lightbox.tsx`
- Create: `src/components/gallery/GuestUploadForm.tsx`

- [ ] **Step 1: Write Lightbox component**

Write `src/components/gallery/Lightbox.tsx`:
```typescript
"use client";

/**
 * Lightbox — fullscreen photo viewer with swipe and keyboard navigation.
 * Used by all gallery layouts across all templates.
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Download } from "lucide-react";
import Image from "next/image";
import type { GalleryPhotoRow } from "@/types/database";

interface LightboxProps {
  photos: GalleryPhotoRow[];
  initialIndex: number;
  onClose: () => void;
}

export default function Lightbox({ photos, initialIndex, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const photo = photos[currentIndex];

  /** Navigate to the previous photo. */
  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i > 0 ? i - 1 : photos.length - 1));
  }, [photos.length]);

  /** Navigate to the next photo. */
  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i < photos.length - 1 ? i + 1 : 0));
  }, [photos.length]);

  /** Handle keyboard navigation. */
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, goPrev, goNext]);

  /** Prevent body scroll while lightbox is open. */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Controls */}
        <div className="absolute right-4 top-4 z-10 flex gap-2" onClick={(e) => e.stopPropagation()}>
          <a
            href={photo.url}
            download
            className="rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/20"
            aria-label="Download photo"
          >
            <Download size={20} />
          </a>
          <button
            onClick={onClose}
            className="rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/20"
            aria-label="Close lightbox"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation arrows */}
        {photos.length > 1 && (
          <>
            <button
              className="absolute left-4 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/20"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              aria-label="Previous photo"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="absolute right-4 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/20"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              aria-label="Next photo"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Photo */}
        <motion.div
          key={photo.id}
          className="relative max-h-[85vh] max-w-[90vw]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={photo.url}
            alt={photo.caption ?? "Wedding photo"}
            width={1200}
            height={800}
            className="max-h-[85vh] w-auto rounded-lg object-contain"
            priority
          />
          {photo.caption && (
            <p className="mt-3 text-center text-sm text-white/70">{photo.caption}</p>
          )}
        </motion.div>

        {/* Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/50">
          {currentIndex + 1} / {photos.length}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Write MasonryGrid component**

Write `src/components/gallery/MasonryGrid.tsx`:
```typescript
"use client";

/**
 * Masonry grid gallery — Pinterest-style staggered layout with lightbox.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Lightbox from "./Lightbox";
import type { GalleryPhotoRow } from "@/types/database";
import type { ResolvedTheme } from "@/components/templates/types";

interface MasonryGridProps {
  photos: GalleryPhotoRow[];
  theme: ResolvedTheme;
  weddingId: string;
}

export default function MasonryGrid({ photos, theme }: MasonryGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (photos.length === 0) {
    return (
      <p className="py-12 text-center text-sm" style={{ color: theme.colors.accent }}>
        No photos yet.
      </p>
    );
  }

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {photos.map((photo, i) => (
          <motion.div
            key={photo.id}
            className="mb-4 cursor-pointer overflow-hidden rounded-lg break-inside-avoid"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            onClick={() => setLightboxIndex(i)}
          >
            <Image
              src={photo.thumbnail_url ?? photo.url}
              alt={photo.caption ?? "Wedding photo"}
              width={600}
              height={400}
              className="w-full object-cover transition-transform duration-300 hover:scale-105"
            />
            {photo.caption && (
              <p className="px-3 py-2 text-xs" style={{ color: theme.colors.accent }}>
                {photo.caption}
              </p>
            )}
          </motion.div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
```

- [ ] **Step 3: Write AlbumView component**

Write `src/components/gallery/AlbumView.tsx`:
```typescript
"use client";

/**
 * Album-based gallery — photos organized into albums (pre-wedding, ceremony, reception).
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Lightbox from "./Lightbox";
import type { GalleryPhotoRow } from "@/types/database";
import type { ResolvedTheme } from "@/components/templates/types";

interface AlbumViewProps {
  photos: GalleryPhotoRow[];
  theme: ResolvedTheme;
  weddingId: string;
}

const ALBUM_LABELS: Record<string, string> = {
  "pre-wedding": "Pre-Wedding",
  ceremony: "Ceremony",
  reception: "Reception",
  other: "Other Moments",
};

export default function AlbumView({ photos, theme }: AlbumViewProps) {
  const [activeAlbum, setActiveAlbum] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  /** Group photos by album. */
  const albums = photos.reduce<Record<string, GalleryPhotoRow[]>>((acc, photo) => {
    const key = photo.album;
    if (!acc[key]) acc[key] = [];
    acc[key].push(photo);
    return acc;
  }, {});

  const albumKeys = Object.keys(albums);
  const displayedPhotos = activeAlbum ? albums[activeAlbum] ?? [] : photos;

  return (
    <>
      {/* Album tabs */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setActiveAlbum(null)}
          className="rounded-full px-4 py-1.5 text-sm font-medium transition"
          style={{
            backgroundColor: activeAlbum === null ? theme.colors.primary : "transparent",
            color: activeAlbum === null ? theme.colors.secondary : theme.colors.accent,
            border: `1px solid ${theme.colors.primary}30`,
          }}
        >
          All
        </button>
        {albumKeys.map((key) => (
          <button
            key={key}
            onClick={() => setActiveAlbum(key)}
            className="rounded-full px-4 py-1.5 text-sm font-medium transition"
            style={{
              backgroundColor: activeAlbum === key ? theme.colors.primary : "transparent",
              color: activeAlbum === key ? theme.colors.secondary : theme.colors.accent,
              border: `1px solid ${theme.colors.primary}30`,
            }}
          >
            {ALBUM_LABELS[key] ?? key} ({albums[key].length})
          </button>
        ))}
      </div>

      {/* Photo grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeAlbum ?? "all"}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {displayedPhotos.map((photo, i) => (
            <motion.div
              key={photo.id}
              className="aspect-square cursor-pointer overflow-hidden rounded-lg"
              whileHover={{ scale: 1.02 }}
              onClick={() => setLightboxIndex(i)}
            >
              <Image
                src={photo.thumbnail_url ?? photo.url}
                alt={photo.caption ?? "Wedding photo"}
                width={300}
                height={300}
                className="h-full w-full object-cover"
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {lightboxIndex !== null && (
        <Lightbox
          photos={displayedPhotos}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
```

- [ ] **Step 4: Write TimelineGallery component**

Write `src/components/gallery/TimelineGallery.tsx`:
```typescript
"use client";

/**
 * Timeline gallery — photos arranged chronologically with captions and date markers.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Lightbox from "./Lightbox";
import type { GalleryPhotoRow } from "@/types/database";
import type { ResolvedTheme } from "@/components/templates/types";

interface TimelineGalleryProps {
  photos: GalleryPhotoRow[];
  theme: ResolvedTheme;
  weddingId: string;
}

export default function TimelineGallery({ photos, theme }: TimelineGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  /** Sort photos chronologically. */
  const sorted = [...photos].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  if (sorted.length === 0) {
    return (
      <p className="py-12 text-center text-sm" style={{ color: theme.colors.accent }}>
        No photos yet.
      </p>
    );
  }

  return (
    <>
      <div className="relative mx-auto max-w-3xl">
        {/* Center line */}
        <div
          className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2"
          style={{ backgroundColor: `${theme.colors.primary}30` }}
        />

        <div className="flex flex-col gap-12">
          {sorted.map((photo, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={photo.id}
                className={`flex items-start gap-6 ${isLeft ? "" : "flex-row-reverse"}`}
                initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className={`w-1/2 ${isLeft ? "text-right" : "text-left"}`}>
                  <div
                    className="inline-block cursor-pointer overflow-hidden rounded-lg"
                    onClick={() => setLightboxIndex(i)}
                  >
                    <Image
                      src={photo.thumbnail_url ?? photo.url}
                      alt={photo.caption ?? "Wedding photo"}
                      width={500}
                      height={350}
                      className="w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  {photo.caption && (
                    <p className="mt-2 text-sm" style={{ color: theme.colors.accent }}>
                      {photo.caption}
                    </p>
                  )}
                </div>

                {/* Center dot */}
                <div
                  className="mt-4 h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: theme.colors.primary }}
                />

                {/* Date side */}
                <div className={`w-1/2 pt-4 ${isLeft ? "text-left" : "text-right"}`}>
                  <p className="text-xs uppercase tracking-wider" style={{ color: theme.colors.accent, opacity: 0.6 }}>
                    {new Date(photo.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={sorted}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
```

- [ ] **Step 5: Write GuestUploadForm component**

Write `src/components/gallery/GuestUploadForm.tsx`:
```typescript
"use client";

/**
 * Guest upload form — allows guests to submit photos for moderation.
 */

import { useState, useRef, FormEvent } from "react";
import { Upload, Check, Loader2 } from "lucide-react";
import type { ResolvedTheme } from "@/components/templates/types";

interface GuestUploadFormProps {
  weddingId: string;
  theme: ResolvedTheme;
}

export default function GuestUploadForm({ weddingId, theme }: GuestUploadFormProps) {
  const [guestName, setGuestName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /** Handles form submission — uploads photos via API route. */
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("weddingId", weddingId);
      formData.append("guestName", guestName);
      files.forEach((file) => formData.append("photos", file));

      const res = await fetch("/api/photos/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Upload failed");
      }

      setSuccess(true);
      setFiles([]);
      setGuestName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border p-6" style={{ borderColor: `${theme.colors.primary}30` }}>
        <Check size={32} style={{ color: theme.colors.primary }} />
        <p className="text-sm" style={{ color: theme.colors.accent }}>
          Photos submitted for review. Thank you!
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="text-sm underline"
          style={{ color: theme.colors.primary }}
        >
          Upload more
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border p-6" style={{ borderColor: `${theme.colors.primary}30` }}>
      <h3 className="mb-4 text-lg font-medium" style={{ color: theme.colors.primary }}>
        Share your photos
      </h3>

      <div className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Your name"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          required
          className="rounded-lg border px-3 py-2 text-sm"
          style={{ borderColor: `${theme.colors.primary}30` }}
        />

        <div
          className="cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition hover:opacity-80"
          style={{ borderColor: `${theme.colors.primary}30` }}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={24} className="mx-auto mb-2" style={{ color: theme.colors.accent }} />
          <p className="text-sm" style={{ color: theme.colors.accent }}>
            {files.length > 0
              ? `${files.length} photo(s) selected`
              : "Click to select photos"}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={uploading || files.length === 0}
          className="rounded-lg px-4 py-2 text-sm font-medium text-white transition disabled:opacity-50"
          style={{ backgroundColor: theme.colors.primary }}
        >
          {uploading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={16} className="animate-spin" /> Uploading…
            </span>
          ) : (
            "Submit Photos"
          )}
        </button>
      </div>
    </form>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/gallery/
git commit -m "feat: add shared gallery components (masonry, albums, timeline, lightbox, guest upload)"
```

---

## Task 8: Guestbook Form Component

**Files:**
- Create: `src/components/guestbook/GuestbookForm.tsx`

- [ ] **Step 1: Write GuestbookForm component**

Write `src/components/guestbook/GuestbookForm.tsx`:
```typescript
"use client";

/**
 * Guestbook form — public submission form for guest messages.
 * Includes honeypot field for spam prevention.
 */

import { useState, FormEvent } from "react";
import { Send, Check } from "lucide-react";
import type { ResolvedTheme } from "@/components/templates/types";

interface GuestbookFormProps {
  weddingId: string;
  theme: ResolvedTheme;
}

export default function GuestbookForm({ weddingId, theme }: GuestbookFormProps) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Submits the guestbook entry via API route. */
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Honeypot check — bots fill this hidden field
    if (honeypot) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weddingId, guestName: name, message }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to submit message");
      }

      setSuccess(true);
      setName("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border p-6" style={{ borderColor: `${theme.colors.primary}20` }}>
        <Check size={32} style={{ color: theme.colors.primary }} />
        <p className="text-sm" style={{ color: theme.colors.accent }}>Thank you for your message!</p>
        <button
          onClick={() => setSuccess(false)}
          className="text-sm underline"
          style={{ color: theme.colors.primary }}
        >
          Write another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        maxLength={100}
        className="rounded-lg border px-4 py-2.5 text-sm"
        style={{ borderColor: `${theme.colors.primary}30` }}
      />

      <textarea
        placeholder="Write a message for the happy couple..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        maxLength={1000}
        rows={4}
        className="resize-none rounded-lg border px-4 py-2.5 text-sm"
        style={{ borderColor: `${theme.colors.primary}30` }}
      />

      {/* Honeypot field — hidden from real users, traps bots */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition disabled:opacity-50"
        style={{ backgroundColor: theme.colors.primary }}
      >
        <Send size={16} />
        {loading ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/guestbook/
git commit -m "feat: add guestbook form with honeypot spam prevention"
```

---

## Task 9: API Routes (Photo Upload + Guestbook)

**Files:**
- Create: `src/app/api/photos/upload/route.ts`
- Create: `src/app/api/guestbook/route.ts`

- [ ] **Step 1: Write photo upload API route**

Write `src/app/api/photos/upload/route.ts`:
```typescript
/**
 * Photo upload API route — handles both couple and guest uploads.
 * Guest uploads are stored with status "pending" for moderation.
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const weddingId = formData.get("weddingId") as string;
  const guestName = formData.get("guestName") as string | null;
  const photos = formData.getAll("photos") as File[];

  if (!weddingId) {
    return NextResponse.json({ error: "Missing weddingId" }, { status: 400 });
  }

  if (photos.length === 0) {
    return NextResponse.json({ error: "No photos provided" }, { status: 400 });
  }

  // Validate file types and sizes
  for (const photo of photos) {
    if (!ALLOWED_TYPES.includes(photo.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${photo.type}. Allowed: JPEG, PNG, WebP, HEIC` },
        { status: 400 }
      );
    }
    if (photo.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large: ${photo.name}. Max 10MB per file.` },
        { status: 400 }
      );
    }
  }

  const supabase = createServiceRoleClient();
  const isGuestUpload = !!guestName;
  const uploadedPhotos: { url: string }[] = [];

  for (const photo of photos) {
    const ext = photo.name.split(".").pop() ?? "jpg";
    const fileName = `${weddingId}/gallery/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
    const buffer = Buffer.from(await photo.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from("wedding-photos")
      .upload(fileName, buffer, {
        contentType: photo.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: `Upload failed: ${uploadError.message}` }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from("wedding-photos")
      .getPublicUrl(fileName);

    // Insert photo record
    const { error: insertError } = await supabase
      .from("gallery_photos")
      .insert({
        wedding_id: weddingId,
        url: urlData.publicUrl,
        uploaded_by: isGuestUpload ? "guest" : "couple",
        guest_name: guestName,
        status: isGuestUpload ? "pending" : "approved",
      });

    if (insertError) {
      return NextResponse.json({ error: `Database error: ${insertError.message}` }, { status: 500 });
    }

    uploadedPhotos.push({ url: urlData.publicUrl });
  }

  return NextResponse.json({ photos: uploadedPhotos }, { status: 201 });
}
```

- [ ] **Step 2: Write guestbook API route with rate limiting**

Write `src/app/api/guestbook/route.ts`:
```typescript
/**
 * Guestbook API route — handles guest message submissions with rate limiting.
 * Rate limit: 1 message per IP per 5 minutes.
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

/** In-memory rate limit map — IP -> last submission timestamp. */
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 5 * 60 * 1000; // 5 minutes

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "unknown";

  // Rate limit check
  const lastSubmission = rateLimitMap.get(ip);
  if (lastSubmission && Date.now() - lastSubmission < RATE_LIMIT_MS) {
    const waitSeconds = Math.ceil((RATE_LIMIT_MS - (Date.now() - lastSubmission)) / 1000);
    return NextResponse.json(
      { error: `Please wait ${waitSeconds} seconds before sending another message.` },
      { status: 429 }
    );
  }

  const body = await request.json();
  const { weddingId, guestName, message } = body;

  if (!weddingId || !guestName || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (guestName.length > 100) {
    return NextResponse.json({ error: "Name too long (max 100 characters)" }, { status: 400 });
  }

  if (message.length > 1000) {
    return NextResponse.json({ error: "Message too long (max 1000 characters)" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("guestbook_entries")
    .insert({
      wedding_id: weddingId,
      guest_name: guestName,
      message,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Record rate limit
  rateLimitMap.set(ip, Date.now());

  return NextResponse.json({ entry: data }, { status: 201 });
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/
git commit -m "feat: add photo upload and guestbook API routes with rate limiting"
```

---

## Task 10: Editor Store (Zustand) & Hooks

**Files:**
- Create: `src/store/editorStore.ts`
- Create: `src/hooks/useWedding.ts`
- Create: `src/hooks/useGallery.ts`
- Create: `src/hooks/useGuestbook.ts`
- Create: `src/hooks/useTimeline.ts`

- [ ] **Step 1: Write editor store**

Write `src/store/editorStore.ts`:
```typescript
"use client";

/**
 * Editor store — manages the hybrid editor state.
 * Tracks the current wedding data, template selection, and customization.
 * Changes are debounced before being saved to Supabase.
 */

import { create } from "zustand";
import type { WeddingRow, WeddingCustomization } from "@/types/database";

interface EditorState {
  /** The wedding being edited. */
  wedding: WeddingRow | null;
  /** Whether data is being loaded. */
  loading: boolean;
  /** Whether unsaved changes exist. */
  dirty: boolean;
  /** Sets the wedding data (initial load). */
  setWedding: (wedding: WeddingRow) => void;
  /** Updates a field on the wedding. */
  updateField: <K extends keyof WeddingRow>(key: K, value: WeddingRow[K]) => void;
  /** Updates a nested customization field. */
  updateCustomization: (updates: Partial<WeddingCustomization>) => void;
  /** Marks the state as saved (no dirty changes). */
  markSaved: () => void;
  /** Sets loading state. */
  setLoading: (loading: boolean) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  wedding: null,
  loading: true,
  dirty: false,

  setWedding: (wedding) => set({ wedding, loading: false, dirty: false }),

  updateField: (key, value) =>
    set((state) => {
      if (!state.wedding) return state;
      return {
        wedding: { ...state.wedding, [key]: value },
        dirty: true,
      };
    }),

  updateCustomization: (updates) =>
    set((state) => {
      if (!state.wedding) return state;
      return {
        wedding: {
          ...state.wedding,
          customization: { ...state.wedding.customization, ...updates },
        },
        dirty: true,
      };
    }),

  markSaved: () => set({ dirty: false }),

  setLoading: (loading) => set({ loading }),
}));
```

- [ ] **Step 2: Write useWedding hook**

Write `src/hooks/useWedding.ts`:
```typescript
"use client";

/**
 * useWedding — fetches and mutates a wedding by user ID or slug.
 */

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { WeddingRow, TemplateRow } from "@/types/database";
import type { WeddingWithTemplate } from "@/types/wedding";

/**
 * Fetches the current user's wedding data.
 * Returns the wedding with its template joined.
 */
export function useMyWedding() {
  const [wedding, setWedding] = useState<WeddingWithTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data, error: queryError } = await supabase
        .from("weddings")
        .select("*, template:templates(*)")
        .eq("user_id", user.id)
        .single();

      if (queryError && queryError.code !== "PGRST116") {
        setError(queryError.message);
      }
      setWedding(data as WeddingWithTemplate | null);
      setLoading(false);
    }
    fetch();
  }, []);

  /** Saves wedding data to Supabase. */
  async function saveWedding(updates: Partial<WeddingRow>): Promise<void> {
    if (!wedding) return;
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("weddings")
      .update(updates)
      .eq("id", wedding.id);
    if (updateError) throw new Error(updateError.message);
    setWedding({ ...wedding, ...updates });
  }

  /** Creates a new wedding for the current user. */
  async function createWedding(templateId: string, slug: string): Promise<WeddingRow> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error: insertError } = await supabase
      .from("weddings")
      .insert({ user_id: user.id, template_id: templateId, slug })
      .select("*, template:templates(*)")
      .single();

    if (insertError) throw new Error(insertError.message);
    setWedding(data as WeddingWithTemplate);
    return data as WeddingRow;
  }

  return { wedding, loading, error, saveWedding, createWedding };
}

/**
 * Fetches a public wedding by slug (for guest-facing pages).
 */
export function usePublicWedding(slug: string) {
  const [wedding, setWedding] = useState<WeddingWithTemplate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const supabase = createClient();
      const { data } = await supabase
        .from("weddings")
        .select("*, template:templates(*)")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();
      setWedding(data as WeddingWithTemplate | null);
      setLoading(false);
    }
    fetch();
  }, [slug]);

  return { wedding, loading };
}
```

- [ ] **Step 3: Write useGallery hook**

Write `src/hooks/useGallery.ts`:
```typescript
"use client";

/**
 * useGallery — CRUD operations for wedding gallery photos.
 */

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { GalleryPhotoRow } from "@/types/database";

/**
 * Fetches and manages gallery photos for a wedding.
 */
export function useGallery(weddingId: string | undefined) {
  const [photos, setPhotos] = useState<GalleryPhotoRow[]>([]);
  const [pendingPhotos, setPendingPhotos] = useState<GalleryPhotoRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!weddingId) return;
    async function fetch() {
      const supabase = createClient();
      const { data } = await supabase
        .from("gallery_photos")
        .select("*")
        .eq("wedding_id", weddingId)
        .order("sort_order", { ascending: true });

      const all = (data ?? []) as GalleryPhotoRow[];
      setPhotos(all.filter((p) => p.status === "approved"));
      setPendingPhotos(all.filter((p) => p.status === "pending"));
      setLoading(false);
    }
    fetch();
  }, [weddingId]);

  /** Approves a pending guest photo. */
  async function approvePhoto(photoId: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from("gallery_photos")
      .update({ status: "approved" })
      .eq("id", photoId);
    if (error) throw new Error(error.message);

    setPendingPhotos((prev) => prev.filter((p) => p.id !== photoId));
    const approved = pendingPhotos.find((p) => p.id === photoId);
    if (approved) setPhotos((prev) => [...prev, { ...approved, status: "approved" }]);
  }

  /** Rejects a pending guest photo. */
  async function rejectPhoto(photoId: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from("gallery_photos")
      .update({ status: "rejected" })
      .eq("id", photoId);
    if (error) throw new Error(error.message);
    setPendingPhotos((prev) => prev.filter((p) => p.id !== photoId));
  }

  /** Deletes a photo. */
  async function deletePhoto(photoId: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from("gallery_photos")
      .delete()
      .eq("id", photoId);
    if (error) throw new Error(error.message);
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    setPendingPhotos((prev) => prev.filter((p) => p.id !== photoId));
  }

  /** Updates a photo's caption or album. */
  async function updatePhoto(photoId: string, updates: Partial<GalleryPhotoRow>): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from("gallery_photos")
      .update(updates)
      .eq("id", photoId);
    if (error) throw new Error(error.message);
    setPhotos((prev) => prev.map((p) => (p.id === photoId ? { ...p, ...updates } : p)));
  }

  return { photos, pendingPhotos, loading, approvePhoto, rejectPhoto, deletePhoto, updatePhoto };
}
```

- [ ] **Step 4: Write useGuestbook hook**

Write `src/hooks/useGuestbook.ts`:
```typescript
"use client";

/**
 * useGuestbook — fetches and manages guestbook entries for a wedding.
 */

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { GuestbookEntryRow } from "@/types/database";

/**
 * Fetches guestbook entries for a wedding. Newest first.
 */
export function useGuestbook(weddingId: string | undefined) {
  const [entries, setEntries] = useState<GuestbookEntryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!weddingId) return;
    async function fetch() {
      const supabase = createClient();
      const { data } = await supabase
        .from("guestbook_entries")
        .select("*")
        .eq("wedding_id", weddingId)
        .order("created_at", { ascending: false });
      setEntries((data ?? []) as GuestbookEntryRow[]);
      setLoading(false);
    }
    fetch();
  }, [weddingId]);

  /** Deletes a guestbook entry. */
  async function deleteEntry(entryId: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from("guestbook_entries")
      .delete()
      .eq("id", entryId);
    if (error) throw new Error(error.message);
    setEntries((prev) => prev.filter((e) => e.id !== entryId));
  }

  return { entries, loading, deleteEntry };
}
```

- [ ] **Step 5: Write useTimeline hook**

Write `src/hooks/useTimeline.ts`:
```typescript
"use client";

/**
 * useTimeline — CRUD operations for wedding timeline events.
 */

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { WeddingEventRow } from "@/types/database";

/**
 * Fetches and manages timeline events for a wedding.
 */
export function useTimeline(weddingId: string | undefined) {
  const [events, setEvents] = useState<WeddingEventRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!weddingId) return;
    async function fetch() {
      const supabase = createClient();
      const { data } = await supabase
        .from("wedding_events")
        .select("*")
        .eq("wedding_id", weddingId)
        .order("sort_order", { ascending: true });
      setEvents((data ?? []) as WeddingEventRow[]);
      setLoading(false);
    }
    fetch();
  }, [weddingId]);

  /** Adds a new timeline event. */
  async function addEvent(event: Omit<WeddingEventRow, "id" | "created_at">): Promise<void> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("wedding_events")
      .insert(event)
      .select()
      .single();
    if (error) throw new Error(error.message);
    setEvents((prev) => [...prev, data as WeddingEventRow]);
  }

  /** Updates a timeline event. */
  async function updateEvent(eventId: string, updates: Partial<WeddingEventRow>): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from("wedding_events")
      .update(updates)
      .eq("id", eventId);
    if (error) throw new Error(error.message);
    setEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, ...updates } : e)));
  }

  /** Deletes a timeline event. */
  async function deleteEvent(eventId: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from("wedding_events")
      .delete()
      .eq("id", eventId);
    if (error) throw new Error(error.message);
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
  }

  return { events, loading, addEvent, updateEvent, deleteEvent };
}
```

- [ ] **Step 6: Commit**

```bash
git add src/store/ src/hooks/
git commit -m "feat: add editor store and data hooks (wedding, gallery, guestbook, timeline)"
```

---

## Task 11: Dashboard Layout (Sidebar + TopBar)

**Files:**
- Create: `src/app/(dashboard)/layout.tsx`
- Create: `src/components/dashboard/Sidebar.tsx`
- Create: `src/components/dashboard/TopBar.tsx`
- Create: `src/app/(dashboard)/dashboard/page.tsx`

- [ ] **Step 1: Write Sidebar**

Write `src/components/dashboard/Sidebar.tsx`:
```typescript
"use client";

/**
 * Dashboard sidebar — navigation between dashboard sections.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Palette, Image, MessageSquare, Clock, Settings } from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard/editor", label: "Editor", icon: Palette },
  { href: "/dashboard/gallery", label: "Gallery", icon: Image },
  { href: "/dashboard/guestbook", label: "Guest Book", icon: MessageSquare },
  { href: "/dashboard/timeline", label: "Timeline", icon: Clock },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-dearly-border bg-dearly-card">
      <div className="p-6">
        <Link href="/dashboard" className="font-display text-xl font-bold text-dearly-accent">
          Dearly
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-dearly-accent-soft text-dearly-accent"
                  : "text-dearly-text-secondary hover:bg-dearly-accent-soft/50 hover:text-dearly-text"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
```

- [ ] **Step 2: Write TopBar**

Write `src/components/dashboard/TopBar.tsx`:
```typescript
"use client";

/**
 * Dashboard top bar — shows couple names, preview link, and publish toggle.
 */

import { ExternalLink, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useMyWedding } from "@/hooks/useWedding";

export default function TopBar() {
  const { signOut } = useAuth();
  const { wedding, saveWedding } = useMyWedding();

  /** Toggles the published state of the wedding. */
  async function togglePublish() {
    if (!wedding) return;
    await saveWedding({ is_published: !wedding.is_published });
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-dearly-border bg-dearly-card px-6">
      <div className="text-sm text-dearly-text-secondary">
        {wedding ? (
          <span>
            {wedding.partner1_name || "Partner 1"} & {wedding.partner2_name || "Partner 2"}
          </span>
        ) : (
          <span>Loading...</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {wedding?.slug && (
          <a
            href={`/${wedding.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-dearly-border px-3 py-1.5 text-xs font-medium text-dearly-text-secondary transition hover:bg-dearly-accent-soft"
          >
            <ExternalLink size={14} />
            Preview
          </a>
        )}

        {wedding && (
          <button
            onClick={togglePublish}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              wedding.is_published
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-dearly-accent-soft text-dearly-accent hover:bg-dearly-accent hover:text-white"
            }`}
          >
            {wedding.is_published ? "Published" : "Publish"}
          </button>
        )}

        <button
          onClick={signOut}
          className="rounded-lg p-1.5 text-dearly-text-muted transition hover:bg-dearly-accent-soft hover:text-dearly-text"
          aria-label="Sign out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Write dashboard layout**

Write `src/app/(dashboard)/layout.tsx`:
```typescript
/**
 * Dashboard layout — sidebar + topbar shell wrapping all dashboard pages.
 */

import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-dearly-cream">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Write dashboard home page**

Write `src/app/(dashboard)/dashboard/page.tsx`:
```typescript
/**
 * Dashboard home — landing page after login.
 * Shows overview/setup wizard if no wedding exists yet.
 */

export const metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-2xl py-12 text-center">
      <h1 className="font-display text-3xl font-bold text-dearly-text">Welcome to Dearly</h1>
      <p className="mt-3 text-dearly-text-secondary">
        Start by heading to the Editor to pick a template and set up your wedding site.
      </p>
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/app/(dashboard)/ src/components/dashboard/
git commit -m "feat: add dashboard layout with sidebar, topbar, and home page"
```

---

## Task 12: Root Layout & Marketing Landing Page

**Files:**
- Create: `src/app/layout.tsx` (overwrite scaffold)
- Create: `src/app/page.tsx` (overwrite scaffold)

- [ ] **Step 1: Write root layout**

Write `src/app/layout.tsx`:
```typescript
/**
 * Root layout — applied to every route.
 * Loads display + body fonts, imports Tailwind, wraps in AuthProvider.
 */

import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Dearly — Wedding Invitations & Galleries", template: "%s | Dearly" },
  description: "Create beautiful, animated wedding invitations and photo galleries. Pick a template, customize everything, share with your guests.",
  metadataBase: new URL("https://dearly.app"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable}`}>
      <body className="font-body bg-dearly-cream text-dearly-text antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Write marketing landing page**

Write `src/app/page.tsx`:
```typescript
/**
 * Marketing landing page — hero + feature highlights + CTA.
 */

import Link from "next/link";
import { Heart, Image, Clock, MessageSquare } from "lucide-react";

const FEATURES = [
  {
    icon: Heart,
    title: "10 Stunning Templates",
    description: "From classic elegant to modern glassmorphism — each with unique animations and full customization.",
  },
  {
    icon: Image,
    title: "Photo Gallery",
    description: "Three layout styles — masonry, albums, and timeline. Let guests upload their photos too.",
  },
  {
    icon: Clock,
    title: "Event Timeline",
    description: "Share your wedding day schedule with animated, template-styled timelines.",
  },
  {
    icon: MessageSquare,
    title: "Digital Guest Book",
    description: "Collect heartfelt messages from your guests in a beautifully styled guest book.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dearly-cream">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12">
        <span className="font-display text-2xl font-bold text-dearly-accent">Dearly</span>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-dearly-text-secondary transition hover:text-dearly-text"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-dearly-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center md:py-32">
        <h1 className="font-display text-4xl font-bold leading-tight text-dearly-text md:text-6xl">
          Your love story,
          <br />
          <span className="text-dearly-accent">beautifully told</span>
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-lg text-dearly-text-secondary">
          Create stunning wedding invitations and photo galleries in minutes.
          Pick a template, customize everything, share with your guests.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-lg bg-dearly-accent px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Create your wedding site
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-dearly-border bg-dearly-card p-8 shadow-card"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-dearly-accent-soft">
                <Icon size={20} className="text-dearly-accent" />
              </div>
              <h3 className="font-display text-lg font-semibold text-dearly-text">{title}</h3>
              <p className="mt-2 text-sm text-dearly-text-secondary">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dearly-border px-6 py-8 text-center text-sm text-dearly-text-muted">
        &copy; {new Date().getFullYear()} Dearly. Made with love.
      </footer>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx src/app/page.tsx
git commit -m "feat: add root layout and marketing landing page"
```

---

## Task 13: Guest-Facing Routes ([slug])

**Files:**
- Create: `src/app/[slug]/page.tsx`
- Create: `src/app/[slug]/gallery/page.tsx`
- Create: `src/app/[slug]/guestbook/page.tsx`

- [ ] **Step 1: Write guest invitation page**

Write `src/app/[slug]/page.tsx`:
```typescript
/**
 * Guest-facing wedding invitation — loads wedding data and renders
 * the selected template's InvitationPage + TimelineSection.
 */

import { notFound } from "next/navigation";
import { createCookieClient } from "@/lib/supabase/server";
import { getTemplate } from "@/components/templates/registry";
import { resolveTheme } from "@/components/templates/types";
import type { WeddingRow, TemplateRow, WeddingEventRow } from "@/types/database";

interface PageProps {
  params: { slug: string };
}

export default async function WeddingPage({ params }: PageProps) {
  const supabase = createCookieClient();

  const { data: wedding } = await supabase
    .from("weddings")
    .select("*, template:templates(*)")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .single();

  if (!wedding) notFound();

  const weddingData = wedding as WeddingRow & { template: TemplateRow };
  const templateDef = getTemplate(weddingData.template.slug);
  if (!templateDef) notFound();

  const { data: events } = await supabase
    .from("wedding_events")
    .select("*")
    .eq("wedding_id", weddingData.id)
    .order("sort_order", { ascending: true });

  const components = await templateDef.load();
  const theme = resolveTheme(weddingData.template.default_config, weddingData.customization);

  const { InvitationPage, TimelineSection } = components;

  return (
    <>
      <InvitationPage
        wedding={weddingData}
        events={(events ?? []) as WeddingEventRow[]}
        theme={theme}
      />
      {weddingData.customization.sections.timeline && (
        <TimelineSection events={(events ?? []) as WeddingEventRow[]} theme={theme} />
      )}
    </>
  );
}
```

- [ ] **Step 2: Write guest gallery page**

Write `src/app/[slug]/gallery/page.tsx`:
```typescript
/**
 * Guest-facing gallery page — loads approved photos and renders
 * the template's GalleryLayout with the couple's chosen layout style.
 */

import { notFound } from "next/navigation";
import { createCookieClient } from "@/lib/supabase/server";
import { getTemplate } from "@/components/templates/registry";
import { resolveTheme } from "@/components/templates/types";
import GuestUploadForm from "@/components/gallery/GuestUploadForm";
import type { WeddingRow, TemplateRow, GalleryPhotoRow } from "@/types/database";

interface PageProps {
  params: { slug: string };
}

export default async function GalleryPage({ params }: PageProps) {
  const supabase = createCookieClient();

  const { data: wedding } = await supabase
    .from("weddings")
    .select("*, template:templates(*)")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .single();

  if (!wedding) notFound();

  const weddingData = wedding as WeddingRow & { template: TemplateRow };
  const templateDef = getTemplate(weddingData.template.slug);
  if (!templateDef) notFound();

  const { data: photos } = await supabase
    .from("gallery_photos")
    .select("*")
    .eq("wedding_id", weddingData.id)
    .eq("status", "approved")
    .order("sort_order", { ascending: true });

  const components = await templateDef.load();
  const theme = resolveTheme(weddingData.template.default_config, weddingData.customization);

  const { GalleryLayout } = components;

  return (
    <>
      <GalleryLayout
        wedding={weddingData}
        photos={(photos ?? []) as GalleryPhotoRow[]}
        layout={weddingData.customization.galleryLayout}
        theme={theme}
      />
      {weddingData.guest_uploads_enabled && (
        <div className="mx-auto max-w-md px-6 py-12">
          <GuestUploadForm weddingId={weddingData.id} theme={theme} />
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 3: Write guest guestbook page**

Write `src/app/[slug]/guestbook/page.tsx`:
```typescript
/**
 * Guest-facing guestbook page — shows messages and submission form.
 */

import { notFound } from "next/navigation";
import { createCookieClient } from "@/lib/supabase/server";
import { getTemplate } from "@/components/templates/registry";
import { resolveTheme } from "@/components/templates/types";
import type { WeddingRow, TemplateRow, GuestbookEntryRow } from "@/types/database";

interface PageProps {
  params: { slug: string };
}

export default async function GuestbookPage({ params }: PageProps) {
  const supabase = createCookieClient();

  const { data: wedding } = await supabase
    .from("weddings")
    .select("*, template:templates(*)")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .single();

  if (!wedding) notFound();

  const weddingData = wedding as WeddingRow & { template: TemplateRow };
  const templateDef = getTemplate(weddingData.template.slug);
  if (!templateDef) notFound();

  const { data: entries } = await supabase
    .from("guestbook_entries")
    .select("*")
    .eq("wedding_id", weddingData.id)
    .order("created_at", { ascending: false });

  const components = await templateDef.load();
  const theme = resolveTheme(weddingData.template.default_config, weddingData.customization);

  const { GuestbookSection } = components;

  return (
    <GuestbookSection
      weddingId={weddingData.id}
      entries={(entries ?? []) as GuestbookEntryRow[]}
      theme={theme}
    />
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/[slug]/
git commit -m "feat: add guest-facing routes (invitation, gallery, guestbook)"
```

---

## Task 14: Dashboard Pages (Editor, Gallery, Guestbook, Timeline, Settings)

**This task creates the remaining dashboard pages. Each is a client page that uses the hooks and components built in earlier tasks.**

**Files:**
- Create: `src/app/(dashboard)/dashboard/editor/page.tsx`
- Create: `src/app/(dashboard)/dashboard/gallery/page.tsx`
- Create: `src/app/(dashboard)/dashboard/guestbook/page.tsx`
- Create: `src/app/(dashboard)/dashboard/timeline/page.tsx`
- Create: `src/app/(dashboard)/dashboard/settings/page.tsx`
- Create: `src/components/dashboard/editor/EditorForm.tsx`
- Create: `src/components/dashboard/editor/LivePreview.tsx`
- Create: `src/components/dashboard/editor/TemplatePicker.tsx`
- Create: `src/components/dashboard/editor/ColorPicker.tsx`
- Create: `src/components/dashboard/editor/FontPicker.tsx`
- Create: `src/components/dashboard/gallery/PhotoUploader.tsx`
- Create: `src/components/dashboard/gallery/PhotoGrid.tsx`
- Create: `src/components/dashboard/gallery/ModerationQueue.tsx`
- Create: `src/components/dashboard/guestbook/GuestbookManager.tsx`
- Create: `src/components/dashboard/timeline/TimelineEditor.tsx`

**Due to the number of files, this task focuses on the key editor components and page wiring. Each dashboard page follows the same pattern: use the relevant hook, render the management UI.**

**The plan will include full code for the editor components (TemplatePicker, ColorPicker, FontPicker, EditorForm, LivePreview) and the dashboard page wiring. The remaining management components (PhotoGrid, ModerationQueue, GuestbookManager, TimelineEditor) follow the same hook+action pattern established in the hooks task.**

- [ ] **Step 1-15: Create all dashboard components and pages**

*(Each sub-step creates one component/page following the established patterns. Full code provided in the spec for TemplatePicker, ColorPicker, FontPicker, EditorForm, LivePreview. Management components use the CRUD hooks from Task 10.)*

This task should be executed by a subagent with access to the full plan context. The key patterns:
- Each page is a `"use client"` component that calls the relevant hook
- Editor uses `useEditorStore` + `useMyWedding` with debounced saves
- Gallery management uses `useGallery` with approve/reject/delete actions
- Guestbook management uses `useGuestbook` with delete action
- Timeline management uses `useTimeline` with add/update/delete/reorder

- [ ] **Step 16: Commit**

```bash
git add src/app/(dashboard)/ src/components/dashboard/
git commit -m "feat: add dashboard pages (editor, gallery, guestbook, timeline, settings)"
```

---

## Task 15: Remaining 9 Templates (Bloom through Glass)

**Each template follows the exact same structure as Eternal (Task 6):**
```
src/components/templates/[slug]/
├── InvitationPage.tsx    # Unique animations + layout
├── GalleryLayout.tsx     # Delegates to shared gallery with template styling
├── TimelineSection.tsx   # Template-specific timeline animations
├── GuestbookSection.tsx  # Template-specific guestbook styling
├── theme.ts              # Default colors, fonts, animation config
└── index.ts              # Barrel export conforming to TemplateComponents
```

**Each template differentiates through:**
- Unique color schemes and font pairings (defined in `theme.ts`)
- Distinct Framer Motion animation variants in `InvitationPage.tsx`
- Template-specific timeline animations in `TimelineSection.tsx`
- Unique guestbook card styling in `GuestbookSection.tsx`

**Templates to build (each is a separate commit):**

- [ ] **Step 1: Bloom** — floral watercolors, petal particle effects, bloom-on-scroll reveals
- [ ] **Step 2: Minimal** — clean sans-serif, crisp slide-up animations, staggered text
- [ ] **Step 3: Rustic** — kraft textures, hand-drawn feel, sketch-drawing animations
- [ ] **Step 4: Deco** — Art Deco geometric patterns, gold shimmer, shape-building entrances
- [ ] **Step 5: Sunset** — warm coral gradients, wave motion, gradient-shift scrolling
- [ ] **Step 6: Noir** — dark moody backgrounds, cinematic text reveals, spotlight effects
- [ ] **Step 7: Garden** — muted pastels, vine growth animations, butterfly particles
- [ ] **Step 8: Polaroid** — polaroid frames, scattered photo entrance, tape-peel transitions
- [ ] **Step 9: Glass** — frosted glassmorphism panels, 3D tilt hover, floating blur layers

Each template commit:
```bash
git add src/components/templates/[slug]/
git commit -m "feat: add [Name] template ([description])"
```

---

## Task 16: Preview Route for Editor

**Files:**
- Create: `src/app/preview/page.tsx`

- [ ] **Step 1: Write preview page**

Write `src/app/preview/page.tsx`:
```typescript
"use client";

/**
 * Preview page — rendered inside an iframe by the dashboard editor.
 * Listens for postMessage from the parent to receive wedding data
 * and renders the selected template in real-time.
 */

import { useState, useEffect } from "react";
import { getTemplate } from "@/components/templates/registry";
import { resolveTheme } from "@/components/templates/types";
import type { TemplateComponents } from "@/components/templates/types";
import type { WeddingRow, TemplateRow, WeddingEventRow } from "@/types/database";

interface PreviewData {
  wedding: WeddingRow & { template: TemplateRow };
  events: WeddingEventRow[];
}

export default function PreviewPage() {
  const [data, setData] = useState<PreviewData | null>(null);
  const [components, setComponents] = useState<TemplateComponents | null>(null);

  useEffect(() => {
    /** Listens for preview data updates from the editor iframe parent. */
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "preview-update") {
        setData(event.data.payload as PreviewData);
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  /** Load template components when wedding data changes. */
  useEffect(() => {
    if (!data) return;
    const templateDef = getTemplate(data.wedding.template.slug);
    if (!templateDef) return;
    templateDef.load().then(setComponents);
  }, [data?.wedding.template.slug]);

  if (!data || !components) {
    return (
      <div className="flex min-h-screen items-center justify-center text-dearly-text-muted">
        Waiting for editor data...
      </div>
    );
  }

  const theme = resolveTheme(data.wedding.template.default_config, data.wedding.customization);

  return (
    <>
      <components.InvitationPage wedding={data.wedding} events={data.events} theme={theme} />
      {data.wedding.customization.sections.timeline && (
        <components.TimelineSection events={data.events} theme={theme} />
      )}
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/preview/
git commit -m "feat: add preview route for live editor iframe"
```

---

## Task 17: Final Verification & Polish

- [ ] **Step 1: Verify build**

Run: `npm run build`
Expected: Build completes without errors.

- [ ] **Step 2: Run all tests**

Run: `npx vitest run`
Expected: All tests pass.

- [ ] **Step 3: Verify route structure**

Run: `find src/app -name "page.tsx" -o -name "route.ts" | sort`
Expected: All routes present matching the spec.

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "chore: fix build and test issues"
```

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

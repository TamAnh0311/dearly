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

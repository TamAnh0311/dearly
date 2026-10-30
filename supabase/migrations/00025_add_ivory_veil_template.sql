-- 00025: Storybook collection — Ivory Veil.
-- Renderer: storybook variant in src/components/invitation/StorybookInvitation.tsx
-- Design language: src/components/invitation/styles.ts
--
-- Rollback:
--   DELETE FROM public.templates WHERE slug = 'ivory-veil';

INSERT INTO public.templates (name, slug, description, animation_style, default_config, event_types, is_premium) VALUES
('Ivory Veil', 'ivory-veil', 'A painted ivory garden behind a watercolour veil, framed by magnolia and eucalyptus', 'cinematic', '{
  "colors": {"primary": "#6E795C", "secondary": "#F7F2E8", "accent": "#B49A6B"},
  "fonts": {"display": "Cormorant Garamond", "body": "Jost"},
  "animations": {"entrance": "fade", "scroll": "parallax"}
}'::jsonb, ARRAY['wedding', 'engagement', 'anniversary'], false)
ON CONFLICT (slug) DO NOTHING;

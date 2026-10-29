-- 00024: Storybook collection — editorial paper invitations.
-- Renderer: src/components/invitation/storybook/StorybookInvitation.tsx
-- Design language: storybook variants in src/components/invitation/styles.ts
--
-- Rollback:
--   DELETE FROM public.templates
--   WHERE slug IN ('atelier-ivory','lakeside-hydrangea','peony-letter','lantern-garden');

INSERT INTO public.templates (name, slug, description, animation_style, default_config, event_types, is_premium) VALUES
('Atelier Ivory', 'atelier-ivory', 'Hand-painted ivory paper, a watercolour garden scene and a quiet editorial arch', 'cinematic', '{
  "colors": {"primary": "#6E795C", "secondary": "#F7F2E8", "accent": "#B49A6B"},
  "fonts": {"display": "Cormorant Garamond", "body": "Jost"},
  "animations": {"entrance": "fade", "scroll": "parallax"}
}'::jsonb, ARRAY['wedding', 'engagement', 'anniversary'], false),
('Lakeside Hydrangea', 'lakeside-hydrangea', 'Cool hydrangea blues beside a still lake, framed by eucalyptus and soft morning light', 'cinematic', '{
  "colors": {"primary": "#7F9BB5", "secondary": "#F4F6F2", "accent": "#B4A379"},
  "fonts": {"display": "Cormorant Garamond", "body": "Jost"},
  "animations": {"entrance": "fade", "scroll": "parallax"}
}'::jsonb, ARRAY['wedding', 'engagement', 'anniversary'], false),
('Peony Letter', 'peony-letter', 'A peony wreath, a growing vine and a wax-sealed letter RSVP on blush paper', 'cinematic', '{
  "colors": {"primary": "#B76E79", "secondary": "#FBF5EF", "accent": "#B99A6B"},
  "fonts": {"display": "Italiana", "body": "Jost"},
  "animations": {"entrance": "fade", "scroll": "parallax"}
}'::jsonb, ARRAY['wedding', 'engagement', 'anniversary'], false),
('Lantern Garden', 'lantern-garden', 'An indigo night garden lit by hanging lanterns, with a peony wreath and a letter RSVP', 'cinematic', '{
  "colors": {"primary": "#D8A45C", "secondary": "#171A24", "accent": "#9AA88B"},
  "fonts": {"display": "Italiana", "body": "Jost"},
  "animations": {"entrance": "fade", "scroll": "parallax"}
}'::jsonb, ARRAY['wedding', 'engagement', 'anniversary'], false)
ON CONFLICT (slug) DO NOTHING;

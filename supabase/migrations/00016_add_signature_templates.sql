-- Signature collection: 5 theatrical templates driven by the cinematic invitation
-- design system (src/components/invitation/styles.ts).
-- Rollback: DELETE FROM public.templates WHERE slug IN ('velvet','secret-garden','wax-seal','dusk','rosewindow');
-- (Only safe if no wedding references them: weddings.template_id is a foreign key.)

INSERT INTO public.templates (name, slug, description, animation_style, default_config) VALUES
('Velvet Curtain', 'velvet', 'Theatre night — velvet curtains draw apart under a golden spotlight', 'cinematic', '{
  "colors": {"primary": "#D9B56C", "secondary": "#1E0B10", "accent": "#8C1C2C"},
  "fonts": {"display": "Cinzel", "body": "Cormorant Garamond"},
  "animations": {"entrance": "curtain", "particles": "gold-dust"}
}'::jsonb),
('Secret Garden', 'secret-garden', 'Ivy garden gates swing open onto butterflies and blooming flowers', 'interactive', '{
  "colors": {"primary": "#6B8F5E", "secondary": "#F4F1E8", "accent": "#C9A27E"},
  "fonts": {"display": "Cormorant Garamond", "body": "Nunito"},
  "animations": {"entrance": "gates", "particles": "butterfly"}
}'::jsonb),
('Wax Seal', 'wax-seal', 'Ivory lace letter — the wax seal cracks and your invitation rises from the envelope', 'cinematic', '{
  "colors": {"primary": "#8E2F3A", "secondary": "#FBF7F0", "accent": "#C8A97E"},
  "fonts": {"display": "Playfair Display", "body": "Lato"},
  "animations": {"entrance": "envelope", "reveal": "scratch"}
}'::jsonb),
('Dusk till Dawn', 'dusk', 'Golden hour fades into a starry night as the sun sets over the hills', 'cinematic', '{
  "colors": {"primary": "#F2B880", "secondary": "#FFF7EE", "accent": "#6C5B9E"},
  "fonts": {"display": "Bodoni Moda", "body": "Outfit"},
  "animations": {"entrance": "sunset", "particles": "stars"}
}'::jsonb),
('Rose Window', 'rosewindow', 'Heirloom stained glass — a rose window draws its leading and glows in jewel tones', 'subtle', '{
  "colors": {"primary": "#2E5E8C", "secondary": "#F7F4EE", "accent": "#B4483C"},
  "fonts": {"display": "EB Garamond", "body": "Raleway"},
  "animations": {"entrance": "stained-glass", "reveal": "scratch"}
}'::jsonb)
ON CONFLICT (slug) DO NOTHING;
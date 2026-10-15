-- 00018: East Asian collection — Chinese, Japanese, Korean and Vietnamese-inspired templates.
-- Design language lives in src/components/invitation/styles.ts (heroes: doors, poster, enso,
-- shoji, bojagi; lanterns ambient; cloud ornament; month calendar). Data-only migration.
--
-- Rollback:
--   DELETE FROM public.templates WHERE slug IN ('double-happiness','crimson-keepsake','lantern-night',
--     'sakura','enso','seigaiha','seoul-studio','hanbok');

INSERT INTO public.templates (name, slug, description, animation_style, default_config, event_types, is_premium) VALUES
('Double Happiness', 'double-happiness', 'Chinese red lacquer doors with a gold 囍 medallion swing open onto hanging lanterns', 'cinematic', '{
  "colors": {"primary": "#E3B85C", "secondary": "#7E1518", "accent": "#C8323A"},
  "fonts": {"display": "Noto Serif SC", "body": "Lato"},
  "animations": {"entrance": "doors", "particles": "lanterns"}
}'::jsonb, ARRAY['wedding', 'engagement', 'anniversary'], false),
('Crimson Keepsake', 'crimson-keepsake', 'Vietnamese-style burgundy photo poster that opens like a cinema shutter, with a heart-marked calendar', 'cinematic', '{
  "colors": {"primary": "#F2D7A6", "secondary": "#6E1A22", "accent": "#C9302C"},
  "fonts": {"display": "Playfair Display", "body": "Lora"},
  "animations": {"entrance": "poster", "particles": "petals"}
}'::jsonb, ARRAY['wedding', 'engagement'], false),
('Lantern Night', 'lantern-night', 'Lunar New Year and Mid-Autumn nights - sky lanterns rise into a starry sky', 'cinematic', '{
  "colors": {"primary": "#F4C266", "secondary": "#14122B", "accent": "#D9443B"},
  "fonts": {"display": "Cormorant Garamond", "body": "Nunito"},
  "animations": {"entrance": "celestial", "particles": "lanterns"}
}'::jsonb, ARRAY['party', 'social', 'birthday', 'anniversary'], false),
('Sakura', 'sakura', 'Japanese shoji screens slide apart to reveal a cherry branch in bloom and a rising sun', 'cinematic', '{
  "colors": {"primary": "#C25B74", "secondary": "#FBF5EF", "accent": "#E9B7C3"},
  "fonts": {"display": "Shippori Mincho", "body": "Zen Kaku Gothic New"},
  "animations": {"entrance": "shoji", "particles": "petals"}
}'::jsonb, ARRAY['wedding', 'engagement', 'anniversary'], false),
('Ensō', 'enso', 'Zen ink - a brush circle paints itself and a red hanko seal stamps beside your names', 'subtle', '{
  "colors": {"primary": "#B23A2E", "secondary": "#F4EFE6", "accent": "#2B2B2B"},
  "fonts": {"display": "Noto Serif JP", "body": "Zen Kaku Gothic New"},
  "animations": {"entrance": "enso", "particles": "none"}
}'::jsonb, ARRAY['wedding', 'engagement', 'anniversary', 'social'], false),
('Seigaiha', 'seigaiha', 'Indigo night and gold - an ensō over rolling seigaiha waves', 'subtle', '{
  "colors": {"primary": "#D8B46A", "secondary": "#14213D", "accent": "#C0392B"},
  "fonts": {"display": "Noto Serif JP", "body": "Zen Kaku Gothic New"},
  "animations": {"entrance": "enso", "particles": "gold-dust"}
}'::jsonb, ARRAY['wedding', 'engagement', 'anniversary', 'social'], false),
('Seoul Studio', 'seoul-studio', 'Korean mobile invitation - full-bleed studio photo, quiet serif type, calendar with D-day and gift accounts', 'subtle', '{
  "colors": {"primary": "#8C7B6B", "secondary": "#FAF8F5", "accent": "#D8CFC4"},
  "fonts": {"display": "Nanum Myeongjo", "body": "Noto Sans KR"},
  "animations": {"entrance": "poster", "particles": "none"}
}'::jsonb, ARRAY['wedding', 'engagement'], false),
('Hanbok', 'hanbok', 'Korean bojagi wrapping cloth unfolds its patchwork flaps to reveal the names', 'cinematic', '{
  "colors": {"primary": "#B5322E", "secondary": "#FAF6EE", "accent": "#2F6B5A"},
  "fonts": {"display": "Gowun Batang", "body": "Gowun Dodum"},
  "animations": {"entrance": "bojagi", "particles": "petals"}
}'::jsonb, ARRAY['wedding', 'engagement', 'anniversary'], false)
ON CONFLICT (slug) DO NOTHING;

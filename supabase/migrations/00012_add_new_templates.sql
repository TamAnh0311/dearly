-- Add 10 new wedding templates to the platform.

INSERT INTO public.templates (name, slug, description, animation_style, default_config) VALUES
('Luxe', 'luxe', 'Luxury gold & marble — opulent elegance with laurel wreaths and gold accents', 'subtle', '{
  "colors": {"primary": "#D4AF37", "secondary": "#FAFAFA", "accent": "#2C2C2C"},
  "fonts": {"display": "Cormorant", "body": "Montserrat"},
  "animations": {"entrance": "fade", "scroll": "parallax"}
}'::jsonb),
('Boho', 'boho', 'Bohemian free-spirit — dreamcatcher motifs, earth tones, macramé patterns', 'subtle', '{
  "colors": {"primary": "#C4956A", "secondary": "#FDF6EC", "accent": "#8B6F5C"},
  "fonts": {"display": "Amatic SC", "body": "Quicksand"},
  "animations": {"entrance": "fade", "scroll": "reveal"}
}'::jsonb),
('Seaside', 'seaside', 'Coastal beach — ocean waves, seashells, sand tones, lighthouse motifs', 'cinematic', '{
  "colors": {"primary": "#2C5F7C", "secondary": "#F0F7FA", "accent": "#D4A574"},
  "fonts": {"display": "Playfair Display", "body": "Lato"},
  "animations": {"entrance": "wave", "scroll": "parallax"}
}'::jsonb),
('Cherry Blossom', 'cherry', 'Japanese cherry blossom — delicate sakura petals, ink-wash inspired elegance', 'cinematic', '{
  "colors": {"primary": "#D4728C", "secondary": "#FFF5F7", "accent": "#2D2D2D"},
  "fonts": {"display": "Cormorant Garamond", "body": "Noto Sans"},
  "animations": {"entrance": "bloom", "scroll": "reveal", "particles": "petals"}
}'::jsonb),
('Vineyard', 'vineyard', 'Wine country Tuscan — burgundy & cream, grapevine borders, rolling hills', 'subtle', '{
  "colors": {"primary": "#722F37", "secondary": "#F5F0E8", "accent": "#8B6F5C"},
  "fonts": {"display": "Libre Baskerville", "body": "Source Sans 3"},
  "animations": {"entrance": "fade", "scroll": "parallax"}
}'::jsonb),
('Nordic', 'nordic', 'Scandinavian minimalist — crisp geometry, pine motifs, muted blue-gray tones', 'subtle', '{
  "colors": {"primary": "#2C3E50", "secondary": "#FAFBFC", "accent": "#6B8F9E"},
  "fonts": {"display": "Sora", "body": "Inter"},
  "animations": {"entrance": "slide-up", "scroll": "stagger"}
}'::jsonb),
('Celestial', 'celestial', 'Starry night sky — constellations, crescent moon, shooting stars, midnight blue', 'interactive', '{
  "colors": {"primary": "#C9B06B", "secondary": "#0F1729", "accent": "#E8E0D0"},
  "fonts": {"display": "Cormorant Garamond", "body": "Raleway"},
  "animations": {"entrance": "cinematic-reveal", "scroll": "parallax", "particles": "stars"}
}'::jsonb),
('Terracotta', 'terracotta', 'Mediterranean warm earth — arch frames, dried botanicals, clay textures', 'subtle', '{
  "colors": {"primary": "#C67B5C", "secondary": "#FDF5EF", "accent": "#5C4033"},
  "fonts": {"display": "EB Garamond", "body": "Nunito"},
  "animations": {"entrance": "fade", "scroll": "reveal"}
}'::jsonb),
('Vintage', 'vintage', 'Old Hollywood glamour — Victorian filigree, sepia tones, ornate frames', 'cinematic', '{
  "colors": {"primary": "#5C4033", "secondary": "#F5F0E0", "accent": "#8B7355"},
  "fonts": {"display": "Playfair Display", "body": "Lato"},
  "animations": {"entrance": "cinematic-reveal", "scroll": "parallax"}
}'::jsonb),
('Whimsical', 'whimsical', 'Fairy tale enchanted — floating lanterns, enchanted forest, stardust, magical', 'interactive', '{
  "colors": {"primary": "#7B68AE", "secondary": "#F5F0FA", "accent": "#C9A96E"},
  "fonts": {"display": "Cormorant Garamond", "body": "Quicksand"},
  "animations": {"entrance": "float", "scroll": "reveal", "particles": "stardust"}
}'::jsonb);

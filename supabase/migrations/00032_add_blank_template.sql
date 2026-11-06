-- A blank template for fully custom events. Uses the garden base style
-- with minimal ambient effects so hosts start with a clean canvas.

INSERT INTO templates (id, slug, name, description, animation_style, default_config, event_types, is_premium, hidden)
VALUES (
  'ffffffff-ffff-4fff-8fff-ffffffffffff',
  'blank',
  'Blank Canvas',
  'Start from scratch — choose your own colours, fonts, sections and content with no preset design.',
  'subtle',
  '{"colors": {"primary": "#6B7280", "secondary": "#FAFAF9", "accent": "#A3A3A3"}, "fonts": {"display": "Inter", "body": "Inter"}, "animations": {}}',
  ARRAY['wedding', 'engagement', 'birthday', 'party', 'social', 'anniversary', 'baby-shower'],
  false,
  false
)
ON CONFLICT (slug) DO NOTHING;

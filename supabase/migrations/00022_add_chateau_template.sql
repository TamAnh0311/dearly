INSERT INTO public.templates (name, slug, description, animation_style, default_config)
VALUES (
  'Chateau',
  'chateau',
  'French garden estate — ornate gold arches, watercolour paintings, rich botanical layers',
  'cinematic',
  '{"colors": {"primary": "#B8943E", "secondary": "#FBF7EF", "accent": "#4A6741"}, "fonts": {"display": "Playfair Display", "body": "Jost"}, "animations": {"entrance": "fade", "scroll": "parallax"}}'::jsonb
);

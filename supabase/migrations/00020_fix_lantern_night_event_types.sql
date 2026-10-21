-- 00020: Fix lantern-night event types — add 'wedding' as primary type.
-- The template was originally listed as party/social only, but it's designed
-- as a wedding invitation (Chinese culture, families, celestial hero).
--
-- Rollback:
--   UPDATE public.templates SET event_types = ARRAY['party','social','birthday','anniversary']
--   WHERE slug = 'lantern-night';

UPDATE public.templates
SET event_types = ARRAY['wedding', 'engagement', 'anniversary', 'party', 'social']
WHERE slug = 'lantern-night';

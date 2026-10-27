-- Update Bloom's default palette to the ivory / sage / antique-gold artwork theme.
-- Rollback:
--   UPDATE public.templates
--   SET description = 'Romantic floral — watercolor flowers, soft pinks, greens',
--       default_config = jsonb_set(
--         jsonb_set(default_config, '{colors}', '{"primary":"#D4A0A0","secondary":"#FFF5F5","accent":"#7BA07B"}'::jsonb),
--         '{fonts}', '{"display":"Cormorant Garamond","body":"Quicksand"}'::jsonb
--       )
--   WHERE slug = 'bloom';

UPDATE public.templates
SET description = 'Hand-painted watercolour garden — ivory paper, sage and antique gold',
    default_config = jsonb_set(
      jsonb_set(
        default_config,
        '{colors}',
        '{"primary":"#A98B5D","secondary":"#F7F2E8","accent":"#71806A"}'::jsonb,
        true
      ),
      '{fonts}',
      '{"display":"Cormorant Garamond","body":"Jost"}'::jsonb,
      true
    )
WHERE slug = 'bloom';

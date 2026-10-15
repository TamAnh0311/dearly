-- Social events: event types, personalised guest list, plan scaffolding, and
-- event-type templates (birthday / party / social).
--
-- Rollback:
--   DELETE FROM public.templates WHERE slug IN ('confetti-pop','balloon-bash','neon-night','soiree');
--   ALTER TABLE public.rsvps DROP COLUMN IF EXISTS invitee_id;
--   DROP TABLE IF EXISTS public.invitees;
--   ALTER TABLE public.weddings DROP COLUMN IF EXISTS event_type, DROP COLUMN IF EXISTS event_title,
--     DROP COLUMN IF EXISTS plan, DROP COLUMN IF EXISTS plan_expires_at;
--   ALTER TABLE public.templates DROP COLUMN IF EXISTS event_types, DROP COLUMN IF EXISTS is_premium;

-- ─── Events (the weddings table now hosts every event type) ──────────────────
ALTER TABLE public.weddings
  ADD COLUMN IF NOT EXISTS event_type TEXT NOT NULL DEFAULT 'wedding'
    CHECK (event_type IN ('wedding', 'engagement', 'birthday', 'party', 'social', 'anniversary', 'baby-shower')),
  ADD COLUMN IF NOT EXISTS event_title TEXT CHECK (event_title IS NULL OR char_length(event_title) <= 120),
  -- Monetisation scaffold: 'free' | 'premium' | 'forever'. Billing is not wired yet.
  ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'premium', 'forever')),
  ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMPTZ;

COMMENT ON COLUMN public.weddings.event_type IS 'Kind of event this page is for (wedding, birthday, party, ...).';
COMMENT ON COLUMN public.weddings.plan IS 'Billing plan (scaffold). Limits live in src/lib/plans.ts.';

-- ─── Templates: which event types they suit + premium flag ───────────────────
ALTER TABLE public.templates
  ADD COLUMN IF NOT EXISTS event_types TEXT[] NOT NULL DEFAULT ARRAY['wedding', 'engagement', 'anniversary'],
  ADD COLUMN IF NOT EXISTS is_premium BOOLEAN NOT NULL DEFAULT false;

-- Signature collection is premium (scaffold — not enforced until billing ships).
UPDATE public.templates SET is_premium = true WHERE slug IN ('velvet', 'secret-garden', 'wax-seal', 'dusk', 'rosewindow');
-- Versatile designs also suit social events.
UPDATE public.templates SET event_types = event_types || ARRAY['social', 'party']
  WHERE slug IN ('minimal', 'noir', 'glass', 'celestial', 'velvet', 'dusk', 'polaroid', 'garden') AND NOT ('social' = ANY(event_types));
UPDATE public.templates SET event_types = event_types || ARRAY['birthday']
  WHERE slug IN ('whimsical', 'polaroid', 'glass', 'celestial', 'garden') AND NOT ('birthday' = ANY(event_types));

-- ─── Personalised guest list ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.invitees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  -- Total seats including the invitee (1 = no companion).
  max_party_size INT NOT NULL DEFAULT 1 CHECK (max_party_size BETWEEN 1 AND 20),
  token TEXT NOT NULL UNIQUE DEFAULT substr(replace(gen_random_uuid()::text, '-', ''), 1, 20),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'attending', 'declined')),
  party_size INT NOT NULL DEFAULT 0 CHECK (party_size BETWEEN 0 AND 20),
  responded_at TIMESTAMPTZ,
  -- Day-of check-in ("who actually showed up").
  checked_in_at TIMESTAMPTZ,
  arrived_count INT NOT NULL DEFAULT 0 CHECK (arrived_count BETWEEN 0 AND 20),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.invitees IS 'Named guests with personal invitation links (?i=token). Owner-only.';
CREATE INDEX IF NOT EXISTS idx_invitees_wedding ON public.invitees (wedding_id, created_at);

ALTER TABLE public.invitees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage their invitees" ON public.invitees FOR ALL
  USING (EXISTS (SELECT 1 FROM public.weddings WHERE weddings.id = invitees.wedding_id AND weddings.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.weddings WHERE weddings.id = invitees.wedding_id AND weddings.user_id = auth.uid()));
-- Guests never read this table directly; /[slug]?i=token is resolved server-side.

ALTER TABLE public.rsvps ADD COLUMN IF NOT EXISTS invitee_id UUID REFERENCES public.invitees(id) ON DELETE SET NULL;

-- ─── Event-type templates ────────────────────────────────────────────────────
INSERT INTO public.templates (name, slug, description, animation_style, default_config, event_types, is_premium) VALUES
('Confetti Pop', 'confetti-pop', 'Birthday bash — instant photos tumble in under a shower of confetti and balloons', 'interactive', '{
  "colors": {"primary": "#E8457A", "secondary": "#FFF7FB", "accent": "#7C5CFF"},
  "fonts": {"display": "Caveat", "body": "Poppins"},
  "animations": {"entrance": "scatter", "particles": "confetti"}
}'::jsonb, ARRAY['birthday', 'party', 'baby-shower'], false),
('Balloon Bash', 'balloon-bash', 'Playful party — balloons float up, flowers pop and the guest of honour takes centre stage', 'interactive', '{
  "colors": {"primary": "#FF8A3D", "secondary": "#FFFBF2", "accent": "#2EC4B6"},
  "fonts": {"display": "Fredoka", "body": "Nunito"},
  "animations": {"entrance": "rise", "particles": "balloons"}
}'::jsonb, ARRAY['birthday', 'party', 'baby-shower'], false),
('Neon Night', 'neon-night', 'After-dark party — bold magazine type, glowing gold dust and a confetti finale', 'cinematic', '{
  "colors": {"primary": "#F5D06F", "secondary": "#0E0B1A", "accent": "#FF4FA3"},
  "fonts": {"display": "Bebas Neue", "body": "Outfit"},
  "animations": {"entrance": "editorial", "particles": "gold-dust"}
}'::jsonb, ARRAY['party', 'birthday', 'social'], true),
('Soirée', 'soiree', 'Elegant social evening — a golden arch, soft bokeh and refined serif type', 'subtle', '{
  "colors": {"primary": "#A8875A", "secondary": "#F8F4EE", "accent": "#3E5C5A"},
  "fonts": {"display": "Cormorant Garamond", "body": "Jost"},
  "animations": {"entrance": "arch", "particles": "bokeh"}
}'::jsonb, ARRAY['social', 'party', 'anniversary', 'engagement'], false)
ON CONFLICT (slug) DO NOTHING;

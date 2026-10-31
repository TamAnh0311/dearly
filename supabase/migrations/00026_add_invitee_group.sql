-- Add guest group column so hosts can organise invitees into named groups
-- (e.g. "Family", "Colleagues", "University friends").

ALTER TABLE public.invitees
  ADD COLUMN guest_group TEXT DEFAULT NULL;

COMMENT ON COLUMN public.invitees.guest_group IS 'Optional label to organise guests into groups (e.g. "Gia đình", "Bạn bè").';

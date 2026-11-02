-- Track when a guest's invitation link was shared/sent.
ALTER TABLE public.invitees ADD COLUMN IF NOT EXISTS invited_at TIMESTAMPTZ;
COMMENT ON COLUMN public.invitees.invited_at IS 'When the host marked this invitation as sent/shared.';

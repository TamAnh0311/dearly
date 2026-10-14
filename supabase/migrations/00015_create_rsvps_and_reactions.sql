-- RSVPs, blessing reactions, and RSVP status on guestbook blessings.
-- Rollback:
--   DROP FUNCTION IF EXISTS public.increment_reaction(UUID, TEXT, INT);
--   DROP TABLE IF EXISTS public.wedding_reactions;
--   DROP TABLE IF EXISTS public.rsvps;
--   ALTER TABLE public.guestbook_entries DROP COLUMN IF EXISTS rsvp_status;

-- ─── RSVPs (private to the couple) ───────────────────────────────────────────
CREATE TABLE public.rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  attending BOOLEAN NOT NULL,
  party_size INT NOT NULL DEFAULT 1,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_rsvp_name_length CHECK (char_length(guest_name) BETWEEN 1 AND 100),
  CONSTRAINT chk_rsvp_message_length CHECK (message IS NULL OR char_length(message) <= 1000),
  CONSTRAINT chk_rsvp_party_size CHECK (party_size BETWEEN 0 AND 10)
);

COMMENT ON TABLE public.rsvps IS 'Guest RSVP responses. Readable only by the wedding owner.';
CREATE INDEX idx_rsvps_wedding ON public.rsvps (wedding_id, created_at DESC);

ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners can read RSVPs" ON public.rsvps FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.weddings WHERE weddings.id = rsvps.wedding_id AND weddings.user_id = auth.uid()));
CREATE POLICY "Owners can delete RSVPs" ON public.rsvps FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.weddings WHERE weddings.id = rsvps.wedding_id AND weddings.user_id = auth.uid()));
-- Inserts happen only through the /api/rsvp route (service role), which validates input.

-- ─── Blessings: tag guestbook entries with the sender's RSVP choice ──────────
ALTER TABLE public.guestbook_entries
  ADD COLUMN rsvp_status TEXT CHECK (rsvp_status IN ('attending', 'declined'));

-- ─── Reaction counters (public, anonymous) ───────────────────────────────────
CREATE TABLE public.wedding_reactions (
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('love', 'bloom', 'cheers', 'sparkle', 'rings')),
  count BIGINT NOT NULL DEFAULT 0,
  PRIMARY KEY (wedding_id, kind)
);

COMMENT ON TABLE public.wedding_reactions IS 'Aggregated blessing reaction counts per wedding.';

ALTER TABLE public.wedding_reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read reactions of published weddings" ON public.wedding_reactions FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.weddings WHERE weddings.id = wedding_reactions.wedding_id AND weddings.is_published = true));

-- Atomically adds `p_amount` (1..20) reactions of `p_kind` to a published wedding.
CREATE OR REPLACE FUNCTION public.increment_reaction(p_wedding_id UUID, p_kind TEXT, p_amount INT)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count BIGINT;
BEGIN
  IF p_amount < 1 OR p_amount > 20 THEN
    RAISE EXCEPTION 'amount out of range';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM weddings WHERE id = p_wedding_id AND is_published = true) THEN
    RAISE EXCEPTION 'wedding not found';
  END IF;

  INSERT INTO wedding_reactions (wedding_id, kind, count)
  VALUES (p_wedding_id, p_kind, p_amount)
  ON CONFLICT (wedding_id, kind)
  DO UPDATE SET count = wedding_reactions.count + EXCLUDED.count
  RETURNING count INTO new_count;

  RETURN new_count;
END;
$$;

REVOKE ALL ON FUNCTION public.increment_reaction(UUID, TEXT, INT) FROM PUBLIC, anon, authenticated;

CREATE TABLE public.guestbook_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_message_length CHECK (char_length(message) <= 1000),
  CONSTRAINT chk_name_length CHECK (char_length(guest_name) <= 100)
);

COMMENT ON TABLE public.guestbook_entries IS 'Guest book messages for weddings.';
CREATE INDEX idx_guestbook_wedding ON public.guestbook_entries (wedding_id);
CREATE INDEX idx_guestbook_created ON public.guestbook_entries (wedding_id, created_at DESC);

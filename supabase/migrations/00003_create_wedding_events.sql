CREATE TABLE public.wedding_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  icon TEXT NOT NULL DEFAULT 'calendar',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.wedding_events IS 'Timeline events for a wedding (ceremony, reception, etc.).';
CREATE INDEX idx_wedding_events_wedding ON public.wedding_events (wedding_id);
CREATE INDEX idx_wedding_events_sort ON public.wedding_events (wedding_id, sort_order);

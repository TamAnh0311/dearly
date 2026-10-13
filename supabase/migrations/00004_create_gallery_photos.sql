CREATE TABLE public.gallery_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  album TEXT NOT NULL DEFAULT 'other'
    CHECK (album IN ('pre-wedding', 'ceremony', 'reception', 'other')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  uploaded_by TEXT NOT NULL DEFAULT 'couple'
    CHECK (uploaded_by IN ('couple', 'guest')),
  guest_name TEXT,
  status TEXT NOT NULL DEFAULT 'approved'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.gallery_photos IS 'Wedding photos with album categorization and guest upload moderation.';
CREATE INDEX idx_gallery_photos_wedding ON public.gallery_photos (wedding_id);
CREATE INDEX idx_gallery_photos_album ON public.gallery_photos (wedding_id, album);
CREATE INDEX idx_gallery_photos_status ON public.gallery_photos (wedding_id, status);

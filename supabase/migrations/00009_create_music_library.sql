-- Built-in royalty-free music tracks for wedding sites.
CREATE TABLE public.music_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  artist TEXT NOT NULL,
  genre TEXT NOT NULL CHECK (genre IN ('piano', 'acoustic', 'orchestral', 'ambient', 'romantic')),
  duration_seconds INTEGER NOT NULL,
  url TEXT NOT NULL,
  preview_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.music_tracks IS 'Curated royalty-free music tracks for wedding background music.';

ALTER TABLE public.music_tracks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Music tracks are publicly readable" ON public.music_tracks FOR SELECT USING (true);

-- Add music_track_id to weddings as alternative to custom URL
ALTER TABLE public.weddings ADD COLUMN music_track_id UUID REFERENCES public.music_tracks(id);

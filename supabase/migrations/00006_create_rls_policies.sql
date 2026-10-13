-- Templates: readable by everyone
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Templates are publicly readable" ON public.templates FOR SELECT USING (true);

-- Weddings: owners can CRUD, public can read published
ALTER TABLE public.weddings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners can manage their wedding" ON public.weddings FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Published weddings are publicly readable" ON public.weddings FOR SELECT
  USING (is_published = true);

-- Wedding events: owners CRUD, public read via published wedding
ALTER TABLE public.wedding_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners can manage timeline events" ON public.wedding_events FOR ALL
  USING (EXISTS (SELECT 1 FROM public.weddings WHERE weddings.id = wedding_events.wedding_id AND weddings.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.weddings WHERE weddings.id = wedding_events.wedding_id AND weddings.user_id = auth.uid()));
CREATE POLICY "Public can read events of published weddings" ON public.wedding_events FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.weddings WHERE weddings.id = wedding_events.wedding_id AND weddings.is_published = true));

-- Gallery photos: owners CRUD, public read approved, guests can insert pending
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners can manage gallery photos" ON public.gallery_photos FOR ALL
  USING (EXISTS (SELECT 1 FROM public.weddings WHERE weddings.id = gallery_photos.wedding_id AND weddings.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.weddings WHERE weddings.id = gallery_photos.wedding_id AND weddings.user_id = auth.uid()));
CREATE POLICY "Public can read approved photos of published weddings" ON public.gallery_photos FOR SELECT
  USING (status = 'approved' AND EXISTS (SELECT 1 FROM public.weddings WHERE weddings.id = gallery_photos.wedding_id AND weddings.is_published = true));
CREATE POLICY "Anyone can insert guest photos to published weddings" ON public.gallery_photos FOR INSERT
  WITH CHECK (uploaded_by = 'guest' AND status = 'pending' AND EXISTS (SELECT 1 FROM public.weddings WHERE weddings.id = gallery_photos.wedding_id AND weddings.is_published = true AND weddings.guest_uploads_enabled = true));

-- Guestbook: anyone insert to published, public read, owners delete
ALTER TABLE public.guestbook_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit guestbook entries to published weddings" ON public.guestbook_entries FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.weddings WHERE weddings.id = guestbook_entries.wedding_id AND weddings.is_published = true));
CREATE POLICY "Public can read guestbook entries of published weddings" ON public.guestbook_entries FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.weddings WHERE weddings.id = guestbook_entries.wedding_id AND weddings.is_published = true));
CREATE POLICY "Owners can delete guestbook entries" ON public.guestbook_entries FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.weddings WHERE weddings.id = guestbook_entries.wedding_id AND weddings.user_id = auth.uid()));

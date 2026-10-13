-- Create storage buckets for the platform
INSERT INTO storage.buckets (id, name, public) VALUES ('wedding-photos', 'wedding-photos', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('wedding-music', 'wedding-music', true) ON CONFLICT DO NOTHING;

-- Storage policies for wedding-photos bucket
CREATE POLICY "Anyone can read wedding photos" ON storage.objects FOR SELECT USING (bucket_id = 'wedding-photos');
CREATE POLICY "Authenticated users can upload wedding photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'wedding-photos' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete their own wedding photos" ON storage.objects FOR DELETE USING (bucket_id = 'wedding-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for wedding-music bucket
CREATE POLICY "Anyone can read wedding music" ON storage.objects FOR SELECT USING (bucket_id = 'wedding-music');

-- Allow authenticated users to upload music files to the wedding-music bucket
CREATE POLICY "Authenticated users can upload wedding music"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'wedding-music' AND auth.role() = 'authenticated');

-- Allow users to delete their own uploaded music
CREATE POLICY "Users can delete their own wedding music"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'wedding-music' AND auth.uid()::text = (storage.foldername(name))[1]);

/**
 * Supabase Storage helpers for wedding photo uploads.
 */

import { createClient } from "./client";

const PHOTOS_BUCKET = "wedding-photos";

/**
 * Uploads a photo to the wedding-photos bucket. Returns the public URL.
 */
export async function uploadPhoto(weddingId: string, file: File, folder: string = "gallery"): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `${weddingId}/${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;

  const { error } = await supabase.storage.from(PHOTOS_BUCKET).upload(fileName, file, { upsert: false });
  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage.from(PHOTOS_BUCKET).getPublicUrl(fileName);
  return data.publicUrl;
}

/**
 * Deletes a photo from the wedding-photos bucket.
 */
export async function deletePhoto(filePath: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.storage.from(PHOTOS_BUCKET).remove([filePath]);
  if (error) throw new Error(`Delete failed: ${error.message}`);
}

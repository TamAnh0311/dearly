/**
 * Supabase Storage helpers for wedding photo and music uploads.
 */

import { createClient } from "./client";

const PHOTOS_BUCKET = "wedding-photos";
const MUSIC_BUCKET = "wedding-music";

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

const MAX_MUSIC_SIZE = 15 * 1024 * 1024; // 15 MB
const ALLOWED_MUSIC_TYPES = ["audio/mpeg", "audio/mp4", "audio/mp3", "audio/wav", "audio/ogg", "audio/aac", "video/mp4"];

/**
 * Uploads a music file to the wedding-music bucket. Returns the public URL.
 * Validates file size (max 15 MB) and MIME type before uploading.
 */
export async function uploadMusic(weddingId: string, file: File): Promise<string> {
  if (file.size > MAX_MUSIC_SIZE) {
    throw new Error("File too large — maximum 15 MB.");
  }
  if (!ALLOWED_MUSIC_TYPES.includes(file.type)) {
    throw new Error("Unsupported format. Please use MP3, MP4, WAV, OGG, or AAC.");
  }

  const supabase = createClient();
  const ext = file.name.split(".").pop() ?? "mp3";
  const fileName = `${weddingId}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;

  const { error } = await supabase.storage.from(MUSIC_BUCKET).upload(fileName, file, { upsert: false });
  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage.from(MUSIC_BUCKET).getPublicUrl(fileName);
  return data.publicUrl;
}

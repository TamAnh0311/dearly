"use client";

/**
 * useGallery — CRUD operations for wedding gallery photos.
 */

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { GalleryPhotoRow } from "@/types/database";

/**
 * Fetches and manages gallery photos for a wedding.
 */
export function useGallery(weddingId: string | undefined) {
  const [photos, setPhotos] = useState<GalleryPhotoRow[]>([]);
  const [pendingPhotos, setPendingPhotos] = useState<GalleryPhotoRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!weddingId) return;
    async function fetch() {
      const supabase = createClient();
      const { data } = await supabase
        .from("gallery_photos")
        .select("*")
        .eq("wedding_id", weddingId)
        .order("sort_order", { ascending: true });

      const all = (data ?? []) as GalleryPhotoRow[];
      setPhotos(all.filter((p) => p.status === "approved"));
      setPendingPhotos(all.filter((p) => p.status === "pending"));
      setLoading(false);
    }
    fetch();
  }, [weddingId]);

  /** Approves a pending guest photo. */
  async function approvePhoto(photoId: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from("gallery_photos")
      .update({ status: "approved" })
      .eq("id", photoId);
    if (error) throw new Error(error.message);

    setPendingPhotos((prev) => prev.filter((p) => p.id !== photoId));
    const approved = pendingPhotos.find((p) => p.id === photoId);
    if (approved) setPhotos((prev) => [...prev, { ...approved, status: "approved" }]);
  }

  /** Rejects a pending guest photo. */
  async function rejectPhoto(photoId: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from("gallery_photos")
      .update({ status: "rejected" })
      .eq("id", photoId);
    if (error) throw new Error(error.message);
    setPendingPhotos((prev) => prev.filter((p) => p.id !== photoId));
  }

  /** Deletes a photo. */
  async function deletePhoto(photoId: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from("gallery_photos")
      .delete()
      .eq("id", photoId);
    if (error) throw new Error(error.message);
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    setPendingPhotos((prev) => prev.filter((p) => p.id !== photoId));
  }

  /** Updates a photo's caption or album. */
  async function updatePhoto(photoId: string, updates: Partial<GalleryPhotoRow>): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from("gallery_photos")
      .update(updates)
      .eq("id", photoId);
    if (error) throw new Error(error.message);
    setPhotos((prev) => prev.map((p) => (p.id === photoId ? { ...p, ...updates } : p)));
  }

  return { photos, pendingPhotos, loading, approvePhoto, rejectPhoto, deletePhoto, updatePhoto };
}

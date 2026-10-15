"use client";

/**
 * useWedding — fetches and mutates a wedding by user ID or slug.
 */

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { WeddingRow } from "@/types/database";
import type { WeddingWithTemplate } from "@/types/wedding";

/**
 * Fetches the current user's wedding data.
 * Returns the wedding with its template joined.
 */
export function useMyWedding() {
  const [wedding, setWedding] = useState<WeddingWithTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data, error: queryError } = await supabase
        .from("weddings")
        .select("*, template:templates(*)")
        .eq("user_id", user.id)
        .maybeSingle();

      if (queryError) {
        setError(queryError.message);
      }
      setWedding(data as WeddingWithTemplate | null);
      setLoading(false);
    }
    fetch();
  }, []);

  /** Saves wedding data to Supabase. */
  async function saveWedding(updates: Partial<WeddingRow>): Promise<void> {
    if (!wedding) return;
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("weddings")
      .update(updates)
      .eq("id", wedding.id);
    if (updateError) throw new Error(updateError.message);
    setWedding({ ...wedding, ...updates });
  }

  /**
   * Creates a new wedding for the current user in a single insert.
   * `extra` lets onboarding set names, date and customisation atomically
   * (calling saveWedding right after would see stale state and no-op).
   */
  async function createWedding(
    templateId: string,
    slug: string,
    extra: Partial<Pick<WeddingRow, "partner1_name" | "partner2_name" | "wedding_date" | "customization" | "event_type" | "event_title">> = {}
  ): Promise<WeddingRow> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Please sign in again to create your wedding site.");

    const { data, error: insertError } = await supabase
      .from("weddings")
      .insert({ user_id: user.id, template_id: templateId, slug, ...extra })
      .select("*, template:templates(*)")
      .single();

    if (insertError) throw new Error(insertError.message);
    setWedding(data as WeddingWithTemplate);
    return data as WeddingRow;
  }

  return { wedding, loading, error, saveWedding, createWedding };
}

/**
 * Fetches a public wedding by slug (for guest-facing pages).
 */
export function usePublicWedding(slug: string) {
  const [wedding, setWedding] = useState<WeddingWithTemplate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const supabase = createClient();
      const { data } = await supabase
        .from("weddings")
        .select("*, template:templates(*)")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();
      setWedding(data as WeddingWithTemplate | null);
      setLoading(false);
    }
    fetch();
  }, [slug]);

  return { wedding, loading };
}

"use client";

/**
 * useGuestbook — fetches and manages guestbook entries for a wedding.
 */

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { GuestbookEntryRow } from "@/types/database";

/**
 * Fetches guestbook entries for a wedding. Newest first.
 */
export function useGuestbook(weddingId: string | undefined) {
  const [entries, setEntries] = useState<GuestbookEntryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!weddingId) return;
    async function fetch() {
      const supabase = createClient();
      const { data } = await supabase
        .from("guestbook_entries")
        .select("*")
        .eq("wedding_id", weddingId)
        .order("created_at", { ascending: false });
      setEntries((data ?? []) as GuestbookEntryRow[]);
      setLoading(false);
    }
    fetch();
  }, [weddingId]);

  /** Deletes a guestbook entry. */
  async function deleteEntry(entryId: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from("guestbook_entries")
      .delete()
      .eq("id", entryId);
    if (error) throw new Error(error.message);
    setEntries((prev) => prev.filter((e) => e.id !== entryId));
  }

  return { entries, loading, deleteEntry };
}

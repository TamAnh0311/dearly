"use client";

/**
 * useRealtimeBlessings — subscribes to live blessing inserts for a wedding.
 *
 * Returns an array of blessings that have arrived since the hook mounted.
 * Caller merges these with the initial server-rendered list.
 *
 * @param weddingId - UUID of the wedding to watch.
 * @param enabled   - Set to false in demo / preview mode (default: true).
 */

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { GuestbookEntryRow } from "@/types/database";

export function useRealtimeBlessings(weddingId: string, enabled = true) {
  const [newBlessings, setNewBlessings] = useState<GuestbookEntryRow[]>([]);

  useEffect(() => {
    if (!enabled || !weddingId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`blessings:${weddingId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "guestbook_entries",
          filter: `wedding_id=eq.${weddingId}`,
        },
        (payload) => {
          setNewBlessings((prev) => [...prev, payload.new as GuestbookEntryRow]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [weddingId, enabled]);

  return newBlessings;
}

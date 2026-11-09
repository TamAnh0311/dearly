"use client";

/**
 * useRealtimeRsvps — returns a live count of RSVP inserts since the page loaded.
 *
 * Useful for displaying a live "X more people just RSVP'd" indicator on the
 * invitation page without a full re-fetch.
 *
 * @param weddingId - UUID of the wedding to watch.
 * @param enabled   - Set to false in demo / preview mode (default: true).
 */

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useRealtimeRsvps(weddingId: string, enabled = true) {
  const [newCount, setNewCount] = useState(0);

  useEffect(() => {
    if (!enabled || !weddingId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`rsvps:${weddingId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "rsvps",
          filter: `wedding_id=eq.${weddingId}`,
        },
        () => {
          setNewCount((n) => n + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [weddingId, enabled]);

  return newCount;
}

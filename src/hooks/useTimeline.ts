"use client";

/**
 * useTimeline — CRUD operations for wedding timeline events.
 */

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { WeddingEventRow } from "@/types/database";

/**
 * Fetches and manages timeline events for a wedding.
 */
export function useTimeline(weddingId: string | undefined) {
  const [events, setEvents] = useState<WeddingEventRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!weddingId) return;
    async function fetch() {
      const supabase = createClient();
      const { data } = await supabase
        .from("wedding_events")
        .select("*")
        .eq("wedding_id", weddingId)
        .order("sort_order", { ascending: true });
      setEvents((data ?? []) as WeddingEventRow[]);
      setLoading(false);
    }
    fetch();
  }, [weddingId]);

  /** Adds a new timeline event. */
  async function addEvent(event: Omit<WeddingEventRow, "id" | "created_at">): Promise<void> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("wedding_events")
      .insert(event)
      .select()
      .single();
    if (error) throw new Error(error.message);
    setEvents((prev) => [...prev, data as WeddingEventRow]);
  }

  /** Updates a timeline event. */
  async function updateEvent(eventId: string, updates: Partial<WeddingEventRow>): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from("wedding_events")
      .update(updates)
      .eq("id", eventId);
    if (error) throw new Error(error.message);
    setEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, ...updates } : e)));
  }

  /** Deletes a timeline event. */
  async function deleteEvent(eventId: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from("wedding_events")
      .delete()
      .eq("id", eventId);
    if (error) throw new Error(error.message);
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
  }

  return { events, loading, addEvent, updateEvent, deleteEvent };
}

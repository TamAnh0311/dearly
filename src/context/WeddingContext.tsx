"use client";

/**
 * WeddingContext — shared wedding state for the dashboard.
 * Supports multiple weddings per user (e.g. Vietnamese nhà trai / nhà gái).
 * All dashboard components read from this context via useMyWedding().
 */

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import type { WeddingRow } from "@/types/database";
import type { WeddingWithTemplate } from "@/types/wedding";

interface WeddingContextValue {
  wedding: WeddingWithTemplate | null;
  allWeddings: WeddingWithTemplate[];
  loading: boolean;
  error: string | null;
  switchWedding: (id: string) => void;
  saveWedding: (updates: Partial<WeddingRow>) => Promise<void>;
  createWedding: (
    templateId: string,
    slug: string,
    extra?: Partial<Pick<WeddingRow, "partner1_name" | "partner2_name" | "wedding_date" | "customization" | "event_type" | "event_title">>
  ) => Promise<WeddingRow>;
}

const WeddingContext = createContext<WeddingContextValue | undefined>(undefined);

/** Wraps dashboard pages so all components share the same active wedding. */
export function WeddingProvider({ children }: { children: ReactNode }) {
  const STORAGE_KEY = "dearly:activeWedding";
  const [allWeddings, setAllWeddings] = useState<WeddingWithTemplate[]>([]);
  const [activeId, setActiveId] = useState<string | null>(() => {
    try { return sessionStorage.getItem(STORAGE_KEY); } catch { return null; }
  });
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
        .order("created_at", { ascending: true });

      if (queryError) setError(queryError.message);
      const list = (data ?? []) as WeddingWithTemplate[];
      setAllWeddings(list);
      // Restore saved selection, or default to the first wedding
      setActiveId((prev) => {
        const restored = prev && list.some((w) => w.id === prev) ? prev : null;
        return restored ?? (list.length > 0 ? list[0].id : null);
      });
      setLoading(false);
    }
    fetch();
  }, []);

  const wedding = allWeddings.find((w) => w.id === activeId) ?? allWeddings[0] ?? null;

  /** Switches the active wedding and persists the choice. */
  const switchWedding = useCallback((id: string) => {
    setActiveId(id);
    try { sessionStorage.setItem(STORAGE_KEY, id); } catch { /* private mode */ }
  }, []);

  /** Saves wedding data to Supabase and refreshes template if it changed. */
  async function saveWedding(updates: Partial<WeddingRow>): Promise<void> {
    if (!wedding) return;
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("weddings")
      .update(updates)
      .eq("id", wedding.id);
    if (updateError) throw new Error(updateError.message);

    if (updates.template_id && updates.template_id !== wedding.template_id) {
      const { data } = await supabase
        .from("weddings")
        .select("*, template:templates(*)")
        .eq("id", wedding.id)
        .single();
      if (data) {
        setAllWeddings((prev) => prev.map((w) => w.id === wedding.id ? data as WeddingWithTemplate : w));
        return;
      }
    }
    setAllWeddings((prev) => prev.map((w) => w.id === wedding.id ? { ...w, ...updates } : w));
  }

  /** Creates a new wedding for the current user. */
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
      .insert({
        user_id: user.id,
        template_id: templateId,
        slug,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        ...extra,
      })
      .select("*, template:templates(*)")
      .single();

    if (insertError) throw new Error(insertError.message);
    const created = data as WeddingWithTemplate;
    setAllWeddings((prev) => [...prev, created]);
    setActiveId(created.id);
    return data as WeddingRow;
  }

  return (
    <WeddingContext.Provider value={{ wedding, allWeddings, loading, error, switchWedding, saveWedding, createWedding }}>
      {children}
    </WeddingContext.Provider>
  );
}

/** Returns the shared wedding context. Must be used inside a WeddingProvider. */
export function useWeddingContext(): WeddingContextValue {
  const ctx = useContext(WeddingContext);
  if (!ctx) throw new Error("useWeddingContext must be used within a WeddingProvider");
  return ctx;
}

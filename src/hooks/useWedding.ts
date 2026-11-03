"use client";

/**
 * useWedding — fetches and mutates a wedding by user ID or slug.
 * Dashboard components share state via WeddingContext; this hook
 * delegates to the context when available, or fetches independently
 * for pages outside the dashboard layout.
 */

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { WeddingWithTemplate } from "@/types/wedding";
import { useWeddingContext } from "@/context/WeddingContext";

/**
 * Returns the active wedding from the shared WeddingContext.
 * All dashboard pages share the same state so switching in the
 * TopBar updates every component.
 */
export function useMyWedding() {
  return useWeddingContext();
}

/**
 * Fetches a public wedding by slug (for guest-facing pages).
 */
export function usePublicWedding(slug: string) {
  const [wedding, setWedding] = useState<WeddingWithTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      const supabase = createClient();
      const { data, error: queryError } = await supabase
        .from("weddings")
        .select("*, template:templates(*)")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();
      if (queryError && queryError.code !== "PGRST116") {
        setError(queryError.message);
      }
      setWedding(data as WeddingWithTemplate | null);
      setLoading(false);
    }
    fetch();
  }, [slug]);

  return { wedding, loading, error };
}

"use client";

/**
 * Editor store — manages the hybrid editor state.
 * Tracks the current wedding data, template selection, and customization.
 * Changes are debounced before being saved to Supabase.
 */

import { create } from "zustand";
import type { WeddingRow, WeddingCustomization } from "@/types/database";

interface EditorState {
  /** The wedding being edited. */
  wedding: WeddingRow | null;
  /** Whether data is being loaded. */
  loading: boolean;
  /** Whether unsaved changes exist. */
  dirty: boolean;
  /** Sets the wedding data (initial load). */
  setWedding: (wedding: WeddingRow) => void;
  /** Updates a field on the wedding. */
  updateField: <K extends keyof WeddingRow>(key: K, value: WeddingRow[K]) => void;
  /** Updates a nested customization field. */
  updateCustomization: (updates: Partial<WeddingCustomization>) => void;
  /** Marks the state as saved (no dirty changes). */
  markSaved: () => void;
  /** Sets loading state. */
  setLoading: (loading: boolean) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  wedding: null,
  loading: true,
  dirty: false,

  setWedding: (wedding) => set({ wedding, loading: false, dirty: false }),

  updateField: (key, value) =>
    set((state) => {
      if (!state.wedding) return state;
      return {
        wedding: { ...state.wedding, [key]: value },
        dirty: true,
      };
    }),

  updateCustomization: (updates) =>
    set((state) => {
      if (!state.wedding) return state;
      return {
        wedding: {
          ...state.wedding,
          customization: { ...state.wedding.customization, ...updates },
        },
        dirty: true,
      };
    }),

  markSaved: () => set({ dirty: false }),

  setLoading: (loading) => set({ loading }),
}));

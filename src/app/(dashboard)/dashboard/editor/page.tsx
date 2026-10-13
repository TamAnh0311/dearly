"use client";

/**
 * Editor page — split layout with EditorForm (left) and LivePreview (right).
 * Loads wedding data on mount and seeds the editor store.
 */

import { useEffect } from "react";
import { useMyWedding } from "@/hooks/useWedding";
import { useEditorStore } from "@/store/editorStore";
import EditorForm from "@/components/dashboard/editor/EditorForm";
import LivePreview from "@/components/dashboard/editor/LivePreview";

/**
 * Hybrid editor page that synchronises server data into the client editor store.
 */
export default function EditorPage() {
  const { wedding, loading } = useMyWedding();
  const { setWedding, setLoading } = useEditorStore();

  /** Seeds the editor store once wedding data arrives from Supabase. */
  useEffect(() => {
    if (loading) {
      setLoading(true);
      return;
    }
    if (wedding) {
      setWedding(wedding);
    } else {
      setLoading(false);
    }
  }, [wedding, loading, setWedding, setLoading]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-dearly-text-secondary">Loading editor…</p>
      </div>
    );
  }

  if (!wedding) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-dearly-text-secondary">
            No wedding found. Please create one to continue.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Left panel — editor controls */}
      <div className="w-80 shrink-0 overflow-hidden border-r border-dearly-border bg-dearly-cream">
        <EditorForm />
      </div>

      {/* Right panel — live preview */}
      <div className="flex-1 overflow-hidden bg-dearly-border/20">
        <LivePreview />
      </div>
    </div>
  );
}

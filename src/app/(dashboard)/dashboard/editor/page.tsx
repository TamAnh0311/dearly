"use client";

/**
 * Editor page — split layout with EditorForm (left) and LivePreview (right).
 * On mobile, shows one panel at a time with a toggle button.
 * Loads wedding data on mount and seeds the editor store.
 */

import { useEffect, useState } from "react";
import { Eye, SlidersHorizontal } from "lucide-react";
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
  const [mobileView, setMobileView] = useState<"form" | "preview">("form");

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
    <div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden md:flex-row">
      {/* Mobile toggle bar */}
      <div className="flex border-b border-dearly-border bg-dearly-card md:hidden">
        <button
          type="button"
          onClick={() => setMobileView("form")}
          className={`flex flex-1 items-center justify-center gap-2 py-3 text-sm font-semibold transition ${
            mobileView === "form" ? "bg-dearly-accent-soft text-dearly-accent" : "text-dearly-text-secondary"
          }`}
        >
          <SlidersHorizontal size={16} />
          Editor
        </button>
        <button
          type="button"
          onClick={() => setMobileView("preview")}
          className={`flex flex-1 items-center justify-center gap-2 py-3 text-sm font-semibold transition ${
            mobileView === "preview" ? "bg-dearly-accent-soft text-dearly-accent" : "text-dearly-text-secondary"
          }`}
        >
          <Eye size={16} />
          Preview
        </button>
      </div>

      {/* Left panel — editor controls */}
      <div className={`w-full shrink-0 overflow-hidden border-r border-dearly-border bg-dearly-cream md:block md:w-80 ${mobileView === "form" ? "flex-1" : "hidden"}`}>
        <EditorForm />
      </div>

      {/* Right panel — live preview */}
      <div className={`flex-1 overflow-hidden bg-dearly-border/20 md:block ${mobileView === "preview" ? "block" : "hidden"}`}>
        <LivePreview />
      </div>
    </div>
  );
}

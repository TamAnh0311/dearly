"use client";

/**
 * Preview route — live preview iframe target for the wedding editor.
 *
 * Protocol (same-origin postMessage):
 *  1. On mount this page posts `{ type: "preview-ready" }` to its parent.
 *  2. The editor (LivePreview) replies — and re-sends on every change — with
 *     `{ type: "preview-update", wedding, events, template }`.
 *
 * Renders the shared CinematicInvitation in demo mode (RSVPs and reactions
 * are simulated, never sent), using the template's design language and the
 * couple's colour/font customisation on top of the template defaults.
 */

import { useEffect, useState } from "react";
import type { TemplateRow, WeddingEventRow, WeddingRow } from "@/types/database";
import { resolveTheme, type ResolvedTheme } from "@/components/templates/types";
import CinematicInvitation from "@/components/invitation/CinematicInvitation";

/** Payload structure sent by the editor via postMessage. */
export interface PreviewUpdateMessage {
  type: "preview-update";
  wedding: WeddingRow;
  events: WeddingEventRow[];
  template: TemplateRow | null;
}

/** Validates that an incoming message matches the expected shape. */
function isPreviewUpdate(data: unknown): data is PreviewUpdateMessage {
  const d = data as PreviewUpdateMessage;
  return (
    typeof data === "object" &&
    data !== null &&
    d.type === "preview-update" &&
    typeof d.wedding === "object" &&
    d.wedding !== null &&
    Array.isArray(d.events)
  );
}

const FALLBACK_CONFIG: TemplateRow["default_config"] = {
  colors: { primary: "#B8860B", secondary: "#FFFFF0", accent: "#D4A574" },
  fonts: { display: "Playfair Display", body: "Lato" },
  animations: {},
};

/** Merges template defaults with the couple's customisation. */
function buildTheme(wedding: WeddingRow, template: TemplateRow | null): ResolvedTheme {
  const customization = wedding.customization ?? { colors: {}, fonts: {}, sections: { timeline: true, gallery: true, guestbook: true }, galleryLayout: "masonry" };
  return resolveTheme(template?.default_config ?? FALLBACK_CONFIG, {
    ...customization,
    colors: customization.colors ?? {},
    fonts: customization.fonts ?? {},
  });
}

export default function PreviewPage() {
  const [state, setState] = useState<{ wedding: WeddingRow; events: WeddingEventRow[]; template: TemplateRow | null } | null>(null);

  useEffect(() => {
    /** Accepts same-origin "preview-update" messages only. */
    function handleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (!isPreviewUpdate(event.data)) return;
      setState({ wedding: event.data.wedding, events: event.data.events, template: event.data.template ?? null });
    }

    window.addEventListener("message", handleMessage);
    // Tell the editor we're listening (avoids racing the iframe load event).
    window.parent?.postMessage({ type: "preview-ready" }, window.location.origin);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  /* ── Waiting state ──────────────────────────────────────────────── */
  if (!state) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-600" />
          <p className="text-sm text-gray-500">Waiting for editor data&hellip;</p>
          <p className="max-w-xs text-xs text-gray-400">If this doesn&apos;t go away, reload the editor page.</p>
        </div>
      </div>
    );
  }

  /* ── Live preview render ─────────────────────────────────────────── */
  return (
    <CinematicInvitation
      key={state.template?.slug ?? "default"}
      wedding={state.wedding}
      events={state.events}
      theme={buildTheme(state.wedding, state.template)}
      templateSlug={state.template?.slug}
      demo
    />
  );
}

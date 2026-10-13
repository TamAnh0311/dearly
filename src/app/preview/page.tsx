"use client";

/**
 * Preview route — live preview iframe target for the wedding editor.
 * Listens for postMessage events from the parent editor window,
 * extracts wedding + events data, loads the matching template, and
 * renders InvitationPage + TimelineSection side-by-side.
 *
 * Shows a waiting state until the first message is received.
 */

import { useEffect, useState, useCallback } from "react";
import type { WeddingRow, WeddingEventRow } from "@/types/database";
import type { TemplateComponents, ResolvedTheme } from "@/components/templates/types";
import { getTemplate } from "@/components/templates/registry";

/** Payload structure sent by the editor via postMessage. */
interface PreviewUpdateMessage {
  type: "preview-update";
  wedding: WeddingRow;
  events: WeddingEventRow[];
}

/** Validates that an incoming message matches the expected shape. */
function isPreviewUpdate(data: unknown): data is PreviewUpdateMessage {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as PreviewUpdateMessage).type === "preview-update" &&
    typeof (data as PreviewUpdateMessage).wedding === "object" &&
    Array.isArray((data as PreviewUpdateMessage).events)
  );
}

/** Builds a ResolvedTheme from wedding customization and template defaults. */
function buildTheme(wedding: WeddingRow, templateSlug: string): ResolvedTheme {
  const customization = wedding.customization ?? {};
  return {
    colors: {
      primary: customization.colors?.primary ?? "#B8860B",
      secondary: customization.colors?.secondary ?? "#FFFFF0",
      accent: customization.colors?.accent ?? "#D4A574",
    },
    fonts: {
      display: customization.fonts?.display ?? "Playfair Display",
      body: customization.fonts?.body ?? "Lato",
    },
    animations: {},
  };
}

export default function PreviewPage() {
  const [wedding, setWedding] = useState<WeddingRow | null>(null);
  const [events, setEvents] = useState<WeddingEventRow[]>([]);
  const [components, setComponents] = useState<TemplateComponents | null>(null);
  const [theme, setTheme] = useState<ResolvedTheme | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  /** Loads template components for the given slug and caches them. */
  const loadTemplateComponents = useCallback(async (slug: string) => {
    const definition = getTemplate(slug);
    if (!definition) {
      setLoadError(`Template "${slug}" not found in registry.`);
      return null;
    }
    try {
      const loaded = await definition.load();
      return loaded;
    } catch (err) {
      setLoadError(`Failed to load template "${slug}".`);
      return null;
    }
  }, []);

  useEffect(() => {
    /**
     * Handles postMessage from the parent editor window.
     * Only processes messages of type "preview-update".
     */
    async function handleMessage(event: MessageEvent) {
      if (!isPreviewUpdate(event.data)) return;

      const { wedding: newWedding, events: newEvents } = event.data;
      const slug = newWedding.template_id ?? "eternal";

      setWedding(newWedding);
      setEvents(newEvents);
      setTheme(buildTheme(newWedding, slug));
      setLoadError(null);

      const loaded = await loadTemplateComponents(slug);
      if (loaded) setComponents(loaded);
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [loadTemplateComponents]);

  /* ── Waiting state ──────────────────────────────────────────────── */
  if (!wedding || !components || !theme) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-center">
        {loadError ? (
          <div className="max-w-sm rounded-lg border border-red-200 bg-red-50 p-6">
            <p className="text-sm font-medium text-red-700">Preview Error</p>
            <p className="mt-1 text-sm text-red-600">{loadError}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-600" />
            <p className="text-sm text-gray-500">Waiting for editor data&hellip;</p>
          </div>
        )}
      </div>
    );
  }

  const { InvitationPage, TimelineSection } = components;

  /* ── Live preview render ─────────────────────────────────────────── */
  return (
    <div className="min-h-screen">
      <InvitationPage wedding={wedding} events={events} theme={theme} />
      {events.length > 0 && <TimelineSection events={events} theme={theme} />}
    </div>
  );
}

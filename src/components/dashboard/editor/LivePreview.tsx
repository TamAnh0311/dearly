"use client";

/**
 * LivePreview — right panel iframe pointing to /preview.
 * Posts the wedding, its timeline events and the selected template to the
 * iframe via postMessage whenever editor state changes. The message shape
 * is defined by PreviewUpdateMessage in src/app/preview/page.tsx.
 */

import { useCallback, useEffect, useRef } from "react";
import { useEditorStore } from "@/store/editorStore";
import { useTimeline } from "@/hooks/useTimeline";

/**
 * Renders a sandboxed iframe that displays the live wedding preview.
 */
export default function LivePreview() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const wedding = useEditorStore((s) => s.wedding);
  const template = useEditorStore((s) => s.template);
  const { events } = useTimeline(wedding?.id);

  /** Sends the current editor state to the preview iframe (same-origin only). */
  const send = useCallback(() => {
    const target = iframeRef.current?.contentWindow;
    if (!wedding || !target) return;
    target.postMessage({ type: "preview-update", wedding, events, template }, window.location.origin);
  }, [wedding, events, template]);

  useEffect(() => {
    send();
  }, [send]);

  // Re-send when the iframe announces it is ready to listen.
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin === window.location.origin && e.data?.type === "preview-ready") send();
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [send]);

  return (
    <div className="relative flex h-full flex-col">
      {/* Device frame header */}
      <div className="flex items-center gap-2 border-b border-dearly-border bg-dearly-card px-4 py-2">
        <span className="text-xs text-dearly-text-secondary">Live Preview</span>
        {template && <span className="text-xs font-semibold text-dearly-accent">· {template.name}</span>}
        <div className="ml-auto flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        </div>
      </div>

      <iframe
        ref={iframeRef}
        src="/preview"
        onLoad={send}
        title="Wedding preview"
        className="flex-1 border-0"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
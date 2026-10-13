"use client";

/**
 * LivePreview — right panel iframe pointing to /preview.
 * Posts wedding data to the iframe via postMessage whenever store state changes.
 */

import { useEffect, useRef } from "react";
import { useEditorStore } from "@/store/editorStore";

/**
 * Renders a sandboxed iframe that displays the live wedding preview.
 * Communicates state changes via postMessage.
 */
export default function LivePreview() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const wedding = useEditorStore((s) => s.wedding);

  /** Sends current wedding data to the preview iframe on every change. */
  useEffect(() => {
    if (!wedding || !iframeRef.current?.contentWindow) return;
    iframeRef.current.contentWindow.postMessage(
      { type: "WEDDING_UPDATE", payload: wedding },
      window.location.origin
    );
  }, [wedding]);

  /**
   * Sends the initial payload once the iframe has loaded.
   */
  function handleLoad() {
    if (!wedding || !iframeRef.current?.contentWindow) return;
    iframeRef.current.contentWindow.postMessage(
      { type: "WEDDING_UPDATE", payload: wedding },
      window.location.origin
    );
  }

  return (
    <div className="relative flex h-full flex-col">
      {/* Device frame header */}
      <div className="flex items-center gap-2 border-b border-dearly-border bg-dearly-card px-4 py-2">
        <span className="text-xs text-dearly-text-secondary">Live Preview</span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        </div>
      </div>

      <iframe
        ref={iframeRef}
        src="/preview"
        onLoad={handleLoad}
        title="Wedding preview"
        className="flex-1 border-0"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}

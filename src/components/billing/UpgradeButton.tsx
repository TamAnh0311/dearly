"use client";

/**
 * UpgradeButton — starts checkout for a paid plan. Billing is a scaffold, so
 * the API currently answers 501 and we show its friendly "coming soon" note.
 */

import { useState } from "react";
import type { PlanId } from "@/types/database";

export default function UpgradeButton({ plan, label, className = "" }: { plan: Exclude<PlanId, "free">; label: string; className?: string }) {
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  /** Requests a checkout session and surfaces the server's message. */
  async function start() {
    setBusy(true);
    setNote(null);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (res.ok && data.url) window.location.href = data.url;
      else setNote(data.error ?? "Upgrades aren't available yet — everything is free during early access.");
    } catch {
      setNote("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button type="button" onClick={start} disabled={busy} className={className}>
        {busy ? "One moment…" : label}
      </button>
      {note && (
        <p role="status" className="mt-2 text-xs text-dearly-text-secondary">
          {note}
        </p>
      )}
    </div>
  );
}

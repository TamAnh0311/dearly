"use client";

/**
 * GuestbookManager — table of guestbook entries with delete action per row.
 */

import { useState } from "react";
import { Trash2 } from "lucide-react";
import type { GuestbookEntryRow } from "@/types/database";

interface GuestbookManagerProps {
  /** The list of guestbook entries to display. */
  entries: GuestbookEntryRow[];
  /** Deletes an entry by ID. */
  onDelete: (entryId: string) => Promise<void>;
}

/**
 * Renders a scrollable table of guestbook entries.
 */
export default function GuestbookManager({ entries, onDelete }: GuestbookManagerProps) {
  const [busy, setBusy] = useState<string | null>(null);

  if (entries.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-dearly-text-secondary">
        No guest messages yet.
      </p>
    );
  }

  /**
   * Triggers deletion and tracks which row is loading.
   */
  async function handleDelete(id: string) {
    setBusy(id);
    try {
      await onDelete(id);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-dearly-border">
      <table className="w-full text-sm">
        <thead className="bg-dearly-border/40">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-dearly-text-secondary">
              Guest
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-dearly-text-secondary">
              Message
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-dearly-text-secondary">
              Date
            </th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-dearly-border bg-dearly-card">
          {entries.map((entry) => (
            <tr key={entry.id} className="transition hover:bg-dearly-accent-soft/20">
              <td className="max-w-[140px] truncate px-4 py-3 font-medium text-dearly-text">
                {entry.guest_name}
              </td>
              <td className="max-w-xs px-4 py-3 text-dearly-text-secondary">
                <p className="line-clamp-2">{entry.message}</p>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-dearly-text-secondary">
                {new Date(entry.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => handleDelete(entry.id)}
                  disabled={busy === entry.id}
                  className="rounded-lg p-1.5 text-red-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                  aria-label={`Delete message from ${entry.guest_name}`}
                >
                  {busy === entry.id ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

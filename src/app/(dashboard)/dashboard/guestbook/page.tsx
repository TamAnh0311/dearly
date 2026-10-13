"use client";

/**
 * Guestbook management page — view and delete guest messages.
 * Uses useGuestbook for entries and useMyWedding for the wedding ID.
 */

import { useMyWedding } from "@/hooks/useWedding";
import { useGuestbook } from "@/hooks/useGuestbook";
import GuestbookManager from "@/components/dashboard/guestbook/GuestbookManager";

/**
 * Dashboard guestbook page.
 */
export default function GuestbookPage() {
  const { wedding, loading: weddingLoading } = useMyWedding();
  const { entries, loading: entriesLoading, deleteEntry } = useGuestbook(wedding?.id);

  if (weddingLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <p className="text-sm text-dearly-text-secondary">Loading…</p>
      </div>
    );
  }

  if (!wedding) {
    return (
      <p className="text-sm text-dearly-text-secondary">
        No wedding found. Set one up in the Editor first.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dearly-text">Guest Book</h1>
        <p className="mt-1 text-sm text-dearly-text-secondary">
          Messages from your guests. Delete any that are inappropriate.
        </p>
      </div>

      {entriesLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-dearly-border" />
          ))}
        </div>
      ) : (
        <GuestbookManager entries={entries} onDelete={deleteEntry} />
      )}
    </div>
  );
}

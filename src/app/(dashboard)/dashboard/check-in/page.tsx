"use client";

/**
 * Check-in Kiosk — mobile-optimised day-of arrival screen for event greeters.
 *
 * Shows a live-searchable guest list with large touch-friendly buttons.
 * Tapping a guest toggles their checked_in_at timestamp (same logic as the
 * Guest list page). A counter at the top tracks overall arrival progress.
 *
 * Designed to be used on a phone held by a greeter at the door:
 *   - Large fonts and targets for easy one-handed use.
 *   - High-contrast status badges.
 *   - Auto-focuses the search bar on mount.
 *   - Auto-refreshes every 30 s to pick up changes from other devices.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Search, UserCheck, RefreshCw } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useMyWedding } from "@/hooks/useWedding";
import type { InviteeRow } from "@/types/database";

const AUTO_REFRESH_MS = 30_000;

export default function CheckInPage() {
  const { wedding, loading: weddingLoading } = useMyWedding();
  const [invitees, setInvitees] = useState<InviteeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  /** Fetches the full guest list ordered alphabetically by name. */
  const load = useCallback(async () => {
    if (!wedding) return;
    const { data, error: qErr } = await createClient()
      .from("invitees")
      .select("*")
      .eq("wedding_id", wedding.id)
      .order("name", { ascending: true });
    if (qErr) {
      setError("Couldn't load guests. Pull down to refresh.");
    } else {
      setInvitees((data ?? []) as InviteeRow[]);
      setError(null);
    }
    setLoading(false);
  }, [wedding]);

  // Initial load.
  useEffect(() => {
    void load();
  }, [load]);

  // Auto-focus search bar on mount.
  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  // Auto-refresh every 30 s so multiple greeter phones stay in sync.
  useEffect(() => {
    const timer = setInterval(() => {
      void load();
    }, AUTO_REFRESH_MS);
    return () => clearInterval(timer);
  }, [load]);

  /** Toggles check-in; arrivals default to confirmed seats (or 1). */
  async function toggleCheckIn(invitee: InviteeRow) {
    const checkedIn = !invitee.checked_in_at;
    const patch = {
      checked_in_at: checkedIn ? new Date().toISOString() : null,
      arrived_count: checkedIn ? Math.max(invitee.party_size, 1) : 0,
    };
    // Optimistic update.
    setInvitees((prev) =>
      prev.map((x) => (x.id === invitee.id ? { ...x, ...patch } : x))
    );
    const { error: upErr } = await createClient()
      .from("invitees")
      .update(patch)
      .eq("id", invitee.id);
    if (upErr) {
      setError("Couldn't update check-in. Please try again.");
      void load();
    }
  }

  /** Manual pull-to-refresh handler. */
  async function handleRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  if (weddingLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dearly-bg">
        <p className="text-dearly-text-secondary text-lg">Loading guest list…</p>
      </div>
    );
  }

  if (!wedding) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dearly-bg p-6">
        <p className="text-dearly-text-secondary text-center">
          Create your event first, then come back to check guests in.
        </p>
      </div>
    );
  }

  const checkedInCount = invitees.filter((i) => i.checked_in_at).length;
  const totalCount = invitees.length;

  const filtered = query.trim()
    ? invitees.filter((i) =>
        i.name.toLowerCase().includes(query.trim().toLowerCase())
      )
    : invitees;

  return (
    <div className="flex min-h-screen flex-col bg-dearly-bg">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-dearly-card border-b border-dearly-border px-4 pt-safe-top pb-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-bold text-dearly-text">Check-in</h1>
            <p className="text-sm text-dearly-text-secondary">
              {wedding.partner1_name}
              {wedding.partner2_name ? ` & ${wedding.partner2_name}` : ""}
            </p>
          </div>
          {/* Live counter */}
          <div className="text-right">
            <p className="text-3xl font-bold text-dearly-accent tabular-nums">
              {checkedInCount}
              <span className="text-dearly-text-secondary text-xl font-normal">
                /{totalCount}
              </span>
            </p>
            <p className="text-xs text-dearly-text-secondary uppercase tracking-wide">
              Arrived
            </p>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-dearly-text-secondary pointer-events-none"
          />
          <input
            ref={searchRef}
            type="search"
            placeholder="Search guest name…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-dearly-border bg-dearly-bg pl-10 pr-4 py-3 text-lg text-dearly-text placeholder:text-dearly-text-secondary focus:outline-none focus:ring-2 focus:ring-dearly-accent"
          />
        </div>

        {error && (
          <p className="mt-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
      </header>

      {/* Guest list */}
      <main className="flex-1 overflow-y-auto px-3 py-3 space-y-2 pb-safe-bottom">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-dearly-text-secondary">
            <UserCheck size={48} className="mb-3 opacity-30" />
            <p className="text-lg">
              {query ? "No guests match that name." : "No guests yet."}
            </p>
          </div>
        ) : (
          filtered.map((invitee) => {
            const isCheckedIn = !!invitee.checked_in_at;
            return (
              <div
                key={invitee.id}
                className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-4 transition ${
                  isCheckedIn
                    ? "border-green-200 bg-green-50"
                    : "border-dearly-border bg-dearly-card"
                }`}
              >
                {/* Guest info */}
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-xl font-semibold truncate ${
                      isCheckedIn ? "text-green-800" : "text-dearly-text"
                    }`}
                  >
                    {invitee.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm text-dearly-text-secondary">
                      Party of {Math.max(invitee.party_size, 1)}
                    </span>
                    {invitee.guest_group && (
                      <>
                        <span className="text-dearly-border">·</span>
                        <span className="text-sm text-dearly-text-secondary truncate">
                          {invitee.guest_group}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Status badge + check-in button */}
                <div className="flex items-center gap-2 shrink-0">
                  {isCheckedIn && (
                    <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                      <UserCheck size={12} />
                      Arrived
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => void toggleCheckIn(invitee)}
                    aria-pressed={isCheckedIn}
                    className={`min-w-[100px] rounded-xl px-4 py-3 text-base font-semibold transition active:scale-95 ${
                      isCheckedIn
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "border-2 border-dearly-accent text-dearly-accent hover:bg-dearly-accent hover:text-white"
                    }`}
                  >
                    {isCheckedIn ? "Undo" : "Check in"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </main>

      {/* Refresh button (fixed bottom) */}
      <div className="sticky bottom-0 bg-dearly-card border-t border-dearly-border px-4 py-3 pb-safe-bottom">
        <button
          type="button"
          onClick={() => void handleRefresh()}
          disabled={refreshing}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dearly-border py-3 text-sm font-medium text-dearly-text-secondary hover:bg-dearly-bg disabled:opacity-50 transition"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing…" : "Refresh list"}
        </button>
      </div>
    </div>
  );
}

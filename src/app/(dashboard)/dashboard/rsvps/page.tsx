"use client";

/**
 * Dashboard RSVP page — shows guest responses (attending / declined),
 * headcount totals, and any blessing each guest left.
 */

import { useEffect, useState } from "react";
import { PartyPopper, HeartHandshake, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useMyWedding } from "@/hooks/useWedding";
import type { RsvpRow } from "@/types/database";

/**
 * Loads the couple's RSVPs (RLS restricts rows to the wedding owner).
 */
function useRsvps(weddingId: string | undefined) {
  const [rsvps, setRsvps] = useState<RsvpRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!weddingId) return;
    let cancelled = false;
    async function load() {
      const { data, error: queryError } = await createClient()
        .from("rsvps")
        .select("*")
        .eq("wedding_id", weddingId)
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (queryError) setError("Couldn't load RSVPs. Make sure database migration 00015 has been applied, then refresh.");
      setRsvps((data ?? []) as RsvpRow[]);
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [weddingId]);

  return { rsvps, loading, error };
}

export default function RsvpsPage() {
  const { wedding, loading: weddingLoading } = useMyWedding();
  const { rsvps, loading, error } = useRsvps(wedding?.id);

  if (weddingLoading) {
    return <p className="text-sm text-dearly-text-secondary">Loading…</p>;
  }
  if (!wedding) {
    return <p className="text-sm text-dearly-text-secondary">No wedding found. Set one up in the Editor first.</p>;
  }

  const attending = rsvps.filter((r) => r.attending);
  const declined = rsvps.filter((r) => !r.attending);
  const headcount = attending.reduce((sum, r) => sum + r.party_size, 0);

  const stats = [
    { label: "Guests coming", value: headcount, icon: Users },
    { label: "Accepted", value: attending.length, icon: PartyPopper },
    { label: "Declined", value: declined.length, icon: HeartHandshake },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dearly-text">RSVPs</h1>
        <p className="mt-1 text-sm text-dearly-text-secondary">
          Replies from your invitation page. Blessings also appear on your invitation and in the Guest Book.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-dearly-border bg-dearly-card p-5">
            <Icon size={18} className="text-dearly-accent" />
            <p className="mt-3 text-3xl font-bold text-dearly-text">{value}</p>
            <p className="text-xs uppercase tracking-wider text-dearly-text-secondary">{label}</p>
          </div>
        ))}
      </div>

      {error && <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-dearly-border" />
          ))}
        </div>
      ) : rsvps.length === 0 ? (
        <p className="rounded-xl border border-dashed border-dearly-border p-8 text-center text-sm text-dearly-text-secondary">
          No replies yet. Share your invitation link with guests to start collecting RSVPs.
        </p>
      ) : (
        <ul className="divide-y divide-dearly-border overflow-hidden rounded-xl border border-dearly-border bg-dearly-card">
          {rsvps.map((r) => (
            <li key={r.id} className="flex items-start justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="font-medium text-dearly-text">{r.guest_name}</p>
                {r.message && <p className="mt-1 text-sm text-dearly-text-secondary">&ldquo;{r.message}&rdquo;</p>}
                <p className="mt-1 text-xs text-dearly-text-muted">{new Date(r.created_at).toLocaleString()}</p>
              </div>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                  r.attending ? "bg-green-50 text-green-700" : "bg-dearly-rose-soft text-dearly-rose"
                }`}
              >
                {r.attending ? `Attending · ${r.party_size}` : "Can't make it"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

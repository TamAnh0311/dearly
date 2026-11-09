"use client";

/**
 * Seating chart page — hosts can auto-assign attending guests to tables,
 * drag them between tables to fine-tune, and save or print the result.
 *
 * Data model: `invitees.table_number` (nullable integer). Only guests with
 * status === "attending" are eligible for seating.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { LayoutGrid, Printer, Save, Shuffle, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useMyWedding } from "@/hooks/useWedding";
import type { InviteeRow } from "@/types/database";
import { autoAssign, buildTables, type SeatingGuest } from "@/lib/seating";
import TableCard from "@/components/dashboard/seating/TableCard";
import GuestChip from "@/components/dashboard/seating/GuestChip";

/** Converts an InviteeRow to the leaner SeatingGuest shape. */
function toSeatingGuest(row: InviteeRow): SeatingGuest {
  return {
    id: row.id,
    name: row.name,
    party_size: row.party_size > 0 ? row.party_size : 1,
    guest_group: row.guest_group,
    table_number: row.table_number ?? null,
  };
}

export default function SeatingPage() {
  const { wedding, loading: weddingLoading } = useMyWedding();
  const [guests, setGuests] = useState<SeatingGuest[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seatsPerTable, setSeatsPerTable] = useState(10);
  const [dirty, setDirty] = useState(false);
  const [dragOverPool, setDragOverPool] = useState(false);
  const dragGuestId = useRef<string | null>(null);

  /** Fetches attending invitees for the current wedding. */
  const load = useCallback(async () => {
    if (!wedding) return;
    setLoading(true);
    const { data, error: qErr } = await createClient()
      .from("invitees")
      .select("*")
      .eq("wedding_id", wedding.id)
      .eq("status", "attending")
      .order("created_at", { ascending: true });
    if (qErr) {
      setError("Couldn't load guests. Refresh to try again.");
    } else {
      setGuests((data ?? []).map((row) => toSeatingGuest(row as InviteeRow)));
    }
    setLoading(false);
  }, [wedding]);

  useEffect(() => {
    void load();
  }, [load]);

  /** Runs the auto-assign algorithm and updates local state. */
  function handleAutoAssign() {
    setGuests((prev) => autoAssign(prev, seatsPerTable));
    setDirty(true);
  }

  /** Moves a guest to a specific table (or unassigns if tableNumber is null). */
  function reassign(guestId: string, tableNumber: number | null) {
    setGuests((prev) =>
      prev.map((g) => (g.id === guestId ? { ...g, table_number: tableNumber } : g)),
    );
    setDirty(true);
  }

  /** Batch-saves all table_number changes to Supabase. */
  async function handleSave() {
    if (!wedding) return;
    setSaving(true);
    setError(null);
    try {
      const updates = guests.map((g) =>
        createClient()
          .from("invitees")
          .update({ table_number: g.table_number })
          .eq("id", g.id)
          .eq("wedding_id", wedding.id),
      );
      const results = await Promise.all(updates);
      const failed = results.find((r) => r.error);
      if (failed?.error) {
        setError("Some updates failed. Please try saving again.");
      } else {
        setDirty(false);
      }
    } catch {
      setError("Save failed. Please check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  if (weddingLoading) {
    return <p className="text-sm text-dearly-text-secondary">Loading…</p>;
  }
  if (!wedding) {
    return (
      <p className="text-sm text-dearly-text-secondary">
        Create your event first, then come back to arrange seating.
      </p>
    );
  }

  const { tables, unseated } = buildTables(guests, seatsPerTable);
  const totalSeated = guests.filter((g) => g.table_number !== null).reduce((s, g) => s + g.party_size, 0);
  const totalAttending = guests.reduce((s, g) => s + g.party_size, 0);

  return (
    <>
      {/* Print-only styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          .print-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        }
      `}</style>

      <div className="mx-auto max-w-6xl space-y-6">
        {/* Page header */}
        <div className="no-print flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-dearly-text">
              <LayoutGrid size={22} /> Seating Chart
            </h1>
            <p className="mt-1 text-sm text-dearly-text-secondary">
              Auto-assign attending guests to tables, then drag to fine-tune.
              {guests.length > 0 && (
                <span className="ml-2 text-dearly-accent font-medium">
                  {totalSeated}/{totalAttending} seats assigned
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Seats per table input */}
            <label className="flex items-center gap-2 rounded-lg border border-dearly-border bg-dearly-card px-3 py-2 text-sm text-dearly-text-secondary">
              Seats per table:
              <input
                type="number"
                min={1}
                max={50}
                value={seatsPerTable}
                onChange={(e) => setSeatsPerTable(Math.max(1, Number(e.target.value) || 10))}
                className="w-14 rounded border border-dearly-border bg-dearly-cream px-1.5 py-0.5 text-center text-sm font-semibold text-dearly-text focus:outline-none focus:ring-1 focus:ring-dearly-accent"
              />
            </label>

            <button
              type="button"
              onClick={handleAutoAssign}
              disabled={loading || guests.length === 0}
              className="flex items-center gap-1.5 rounded-lg bg-dearly-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              <Shuffle size={15} /> Auto-assign
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={!dirty || saving}
              className="flex items-center gap-1.5 rounded-lg border border-dearly-accent px-4 py-2 text-sm font-semibold text-dearly-accent transition hover:bg-dearly-accent-soft disabled:opacity-40"
            >
              <Save size={15} /> {saving ? "Saving…" : "Save"}
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-lg border border-dearly-border px-4 py-2 text-sm font-medium text-dearly-text-secondary transition hover:bg-dearly-card"
            >
              <Printer size={15} /> Print
            </button>
          </div>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
        )}

        {/* Loading skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-40 animate-pulse rounded-2xl bg-dearly-border" />
            ))}
          </div>
        ) : guests.length === 0 ? (
          <div className="rounded-xl border border-dashed border-dearly-border p-12 text-center">
            <Users className="mx-auto mb-3 text-dearly-text-muted" size={28} />
            <p className="text-sm text-dearly-text-secondary">
              No attending guests yet. Once guests RSVP as attending they will appear here.
            </p>
          </div>
        ) : (
          <>
            {/* Table grid */}
            {tables.length === 0 ? (
              <div className="rounded-xl border border-dashed border-dearly-border p-8 text-center text-sm text-dearly-text-secondary">
                Click <strong>Auto-assign</strong> to seat your guests, or drag them from the pool below.
              </div>
            ) : (
              <div className="print-grid grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tables.map((table) => (
                  <TableCard
                    key={table.number}
                    table={table}
                    onDrop={(guestId, tableNumber) => reassign(guestId, tableNumber)}
                    onDragStart={(id) => { dragGuestId.current = id; }}
                    onDragEnd={() => { dragGuestId.current = null; }}
                  />
                ))}
              </div>
            )}

            {/* Unassigned guest pool */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                setDragOverPool(true);
              }}
              onDragLeave={() => setDragOverPool(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOverPool(false);
                const guestId = e.dataTransfer.getData("guestId");
                if (guestId) reassign(guestId, null);
              }}
              className={`no-print rounded-2xl border p-4 transition-colors ${
                dragOverPool
                  ? "border-dearly-accent bg-dearly-accent-soft/30"
                  : "border-dashed border-dearly-border"
              }`}
            >
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-dearly-text-secondary">
                Not seated ({unseated.length})
              </p>
              {unseated.length === 0 ? (
                <p className="text-xs italic text-dearly-text-muted">
                  All guests are seated. Drop a chip here to unassign.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {unseated.map((g) => (
                    <GuestChip
                      key={g.id}
                      guest={g}
                      onDragStart={(id) => { dragGuestId.current = id; }}
                      onDragEnd={() => { dragGuestId.current = null; }}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

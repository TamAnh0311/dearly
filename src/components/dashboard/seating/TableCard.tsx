"use client";

/**
 * TableCard — displays one seating table as a card with a fill indicator.
 * Acts as a drag-and-drop drop zone; fires onDrop with the guest ID on drop.
 */

import { useState } from "react";
import type { SeatingTable } from "@/lib/seating";
import GuestChip from "./GuestChip";

interface TableCardProps {
  table: SeatingTable;
  onDrop: (guestId: string, tableNumber: number) => void;
  onDragStart: (guestId: string) => void;
  onDragEnd: () => void;
}

/**
 * Renders a table card with seated guests, fill progress bar, and drop-zone support.
 */
export default function TableCard({ table, onDrop, onDragStart, onDragEnd }: TableCardProps) {
  const [dragOver, setDragOver] = useState(false);
  const used = table.guests.reduce((s, g) => s + g.party_size, 0);
  const fillPct = Math.min((used / table.totalSeats) * 100, 100);
  const full = used >= table.totalSeats;

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const guestId = e.dataTransfer.getData("guestId");
        if (guestId) onDrop(guestId, table.number);
      }}
      className={`flex flex-col rounded-2xl border bg-dearly-card p-4 transition-colors ${
        dragOver
          ? "border-dearly-accent bg-dearly-accent-soft/30"
          : "border-dearly-border"
      }`}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-dearly-text">Table {table.number}</h3>
        <span
          className={`text-xs font-semibold tabular-nums ${
            full ? "text-amber-600" : "text-dearly-text-secondary"
          }`}
        >
          {used}/{table.totalSeats}
        </span>
      </div>

      {/* Fill progress bar */}
      <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-dearly-border">
        <div
          className={`h-full rounded-full transition-all ${full ? "bg-amber-400" : "bg-dearly-accent"}`}
          style={{ width: `${fillPct}%` }}
        />
      </div>

      {/* Guest chips */}
      <div className="flex min-h-[3rem] flex-wrap gap-1.5">
        {table.guests.length === 0 ? (
          <p className="text-xs text-dearly-text-muted italic">Empty — drop guests here</p>
        ) : (
          table.guests.map((g) => (
            <GuestChip key={g.id} guest={g} onDragStart={onDragStart} onDragEnd={onDragEnd} />
          ))
        )}
      </div>
    </div>
  );
}

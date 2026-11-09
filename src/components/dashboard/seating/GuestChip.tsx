"use client";

/**
 * GuestChip — a compact, draggable pill representing one invitee.
 * Color is derived from the guest_group name so members of the same
 * group share a consistent pastel hue across tables.
 */

import type { SeatingGuest } from "@/lib/seating";

/** Hashes a string to a 0-359 hue value using djb2. */
function hashHue(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return Math.abs(hash) % 360;
}

/** Derives a pastel background and foreground CSS color from a group name. */
function groupColor(group: string | null): { bg: string; text: string } {
  if (!group) return { bg: "#f3f4f6", text: "#6b7280" };
  const hue = hashHue(group);
  return { bg: `hsl(${hue} 60% 90%)`, text: `hsl(${hue} 50% 35%)` };
}

interface GuestChipProps {
  guest: SeatingGuest;
  onDragStart: (guestId: string) => void;
  onDragEnd: () => void;
}

/**
 * Renders a draggable chip for a single guest with group-based pastel coloring.
 */
export default function GuestChip({ guest, onDragStart, onDragEnd }: GuestChipProps) {
  const { bg, text } = groupColor(guest.guest_group);

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("guestId", guest.id);
        e.dataTransfer.effectAllowed = "move";
        onDragStart(guest.id);
      }}
      onDragEnd={onDragEnd}
      title={guest.guest_group ? `Group: ${guest.guest_group}` : undefined}
      className="inline-flex cursor-grab items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium active:cursor-grabbing select-none"
      style={{ backgroundColor: bg, color: text }}
    >
      <span className="max-w-[120px] truncate">{guest.name}</span>
      <span className="shrink-0 opacity-70">({guest.party_size})</span>
    </div>
  );
}

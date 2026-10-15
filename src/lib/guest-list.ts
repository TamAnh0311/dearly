/**
 * Guest list helpers: parse a pasted name list into invitees and summarise
 * responses ("who's coming, with how many companions, who showed up").
 */

import type { InviteeRow } from "@/types/database";

export interface ParsedInvitee {
  name: string;
  /** Total seats including the guest (1 = no companion). */
  maxPartySize: number;
}

/**
 * Parses one guest per line. Supported companion syntaxes:
 *   "Anna Lee"            → 1 seat
 *   "Anna Lee +1"         → 2 seats (guest + 1 companion)
 *   "The Nguyen family, 4" / "The Nguyen family (4)" / "Tab-separated\t4" → 4 seats
 * Blank lines, duplicates (case-insensitive) and lines over 120 chars are skipped.
 */
export function parseGuestList(text: string, maxSeats = 20): ParsedInvitee[] {
  const seen = new Set<string>();
  const out: ParsedInvitee[] = [];
  for (const raw of text.split(/\r?\n/)) {
    let line = raw.trim();
    if (!line) continue;
    let seats = 1;
    const plus = line.match(/\s*\+\s*(\d{1,2})\s*$/);
    const total = line.match(/(?:[,\t;]|\()\s*(\d{1,2})\s*\)?\s*$/);
    if (plus) {
      seats = 1 + Number(plus[1]);
      line = line.slice(0, plus.index).trim();
    } else if (total) {
      seats = Number(total[1]);
      line = line.slice(0, total.index).trim();
    }
    line = line.replace(/[,;]+$/, "").trim();
    if (!line || line.length > 120) continue;
    const key = line.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ name: line, maxPartySize: Math.min(Math.max(seats, 1), maxSeats) });
  }
  return out;
}

export interface GuestListSummary {
  invited: number;
  seatsInvited: number;
  attending: number;
  seatsConfirmed: number;
  declined: number;
  pending: number;
  checkedIn: number;
  arrived: number;
}

/** Totals for the results dashboard. */
export function summarizeGuestList(invitees: InviteeRow[]): GuestListSummary {
  return invitees.reduce<GuestListSummary>(
    (s, i) => ({
      invited: s.invited + 1,
      seatsInvited: s.seatsInvited + i.max_party_size,
      attending: s.attending + (i.status === "attending" ? 1 : 0),
      seatsConfirmed: s.seatsConfirmed + (i.status === "attending" ? i.party_size : 0),
      declined: s.declined + (i.status === "declined" ? 1 : 0),
      pending: s.pending + (i.status === "pending" ? 1 : 0),
      checkedIn: s.checkedIn + (i.checked_in_at ? 1 : 0),
      arrived: s.arrived + (i.checked_in_at ? i.arrived_count : 0),
    }),
    { invited: 0, seatsInvited: 0, attending: 0, seatsConfirmed: 0, declined: 0, pending: 0, checkedIn: 0, arrived: 0 }
  );
}

/** Personal invitation URL for an invitee. */
export function inviteUrl(origin: string, slug: string, token: string): string {
  return `${origin}/${slug}?i=${token}`;
}

/** CSV export of the guest list (RFC 4180 quoting). */
export function guestListCsv(invitees: InviteeRow[], origin: string, slug: string): string {
  const q = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const rows = [["Name", "Seats invited", "Status", "Seats confirmed", "Checked in", "Arrived", "Link"]];
  for (const i of invitees) {
    rows.push([i.name, String(i.max_party_size), i.status, String(i.party_size), i.checked_in_at ? "yes" : "no", String(i.arrived_count), inviteUrl(origin, slug, i.token)]);
  }
  return rows.map((r) => r.map(q).join(",")).join("\n");
}

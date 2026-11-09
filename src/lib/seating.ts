/**
 * Pure seating-chart utilities — auto-assign guests to tables while keeping
 * guest_group members together. No side-effects; all functions are deterministic.
 */

export interface SeatingGuest {
  id: string;
  name: string;
  party_size: number;
  guest_group: string | null;
  table_number: number | null;
}

export interface SeatingTable {
  number: number;
  guests: SeatingGuest[];
  totalSeats: number;
}

/**
 * Returns the total seats already occupied on a table.
 */
function usedSeats(table: SeatingTable): number {
  return table.guests.reduce((sum, g) => sum + g.party_size, 0);
}

/**
 * Auto-assigns guests to tables, keeping guest_group members together.
 * Returns a new array of guests with table_number set; the input is not mutated.
 *
 * Algorithm:
 * 1. Group guests by guest_group (null guests are treated as individual groups).
 * 2. Sort groups largest-first so big parties claim tables early.
 * 3. For each group, prefer the table with the most remaining space that still fits.
 * 4. If no existing table fits, open a new table.
 * 5. Groups that exceed a single table are split across sequential tables.
 */
export function autoAssign(guests: SeatingGuest[], seatsPerTable: number): SeatingGuest[] {
  if (guests.length === 0) return [];

  // Build group buckets; each null-group guest becomes its own singleton.
  const groupMap = new Map<string, SeatingGuest[]>();
  for (const guest of guests) {
    const key = guest.guest_group ?? `__solo__${guest.id}`;
    const bucket = groupMap.get(key) ?? [];
    bucket.push(guest);
    groupMap.set(key, bucket);
  }

  // Sort groups by total seats descending so large groups seat first.
  const groups = Array.from(groupMap.values()).sort((a, b) => {
    const totalA = a.reduce((s, g) => s + g.party_size, 0);
    const totalB = b.reduce((s, g) => s + g.party_size, 0);
    return totalB - totalA;
  });

  const tables: SeatingTable[] = [];
  const assignments = new Map<string, number>(); // guest.id -> table_number

  /** Opens a new table and returns it. */
  function openTable(): SeatingTable {
    const t: SeatingTable = { number: tables.length + 1, guests: [], totalSeats: seatsPerTable };
    tables.push(t);
    return t;
  }

  /** Finds the table with the most remaining space that can seat `needed` seats. */
  function bestFit(needed: number): SeatingTable | null {
    let best: SeatingTable | null = null;
    let bestRemaining = -1;
    for (const t of tables) {
      const remaining = t.totalSeats - usedSeats(t);
      if (remaining >= needed && remaining > bestRemaining) {
        best = t;
        bestRemaining = remaining;
      }
    }
    return best;
  }

  /** Seats one guest on a specific table, recording the assignment. */
  function seat(guest: SeatingGuest, table: SeatingTable): void {
    table.guests.push(guest);
    assignments.set(guest.id, table.number);
  }

  for (const group of groups) {
    // Split the group into chunks that fit within one table.
    let chunk: SeatingGuest[] = [];
    let chunkSize = 0;

    for (const guest of group) {
      if (chunkSize + guest.party_size > seatsPerTable && chunk.length > 0) {
        // Flush current chunk.
        const target = bestFit(chunkSize) ?? openTable();
        for (const g of chunk) seat(g, target);
        chunk = [];
        chunkSize = 0;
      }
      chunk.push(guest);
      chunkSize += guest.party_size;
    }

    if (chunk.length > 0) {
      const target = bestFit(chunkSize) ?? openTable();
      for (const g of chunk) seat(g, target);
    }
  }

  // Return updated guest list.
  return guests.map((g) => ({
    ...g,
    table_number: assignments.get(g.id) ?? null,
  }));
}

/**
 * Builds a list of SeatingTable objects from guest assignments and collects
 * guests without a table_number into the unseated pool.
 */
export function buildTables(
  guests: SeatingGuest[],
  seatsPerTable: number,
): { tables: SeatingTable[]; unseated: SeatingGuest[] } {
  const tableMap = new Map<number, SeatingGuest[]>();
  const unseated: SeatingGuest[] = [];

  for (const guest of guests) {
    if (guest.table_number === null) {
      unseated.push(guest);
    } else {
      const bucket = tableMap.get(guest.table_number) ?? [];
      bucket.push(guest);
      tableMap.set(guest.table_number, bucket);
    }
  }

  const tableNumbers = Array.from(tableMap.keys()).sort((a, b) => a - b);
  const tables: SeatingTable[] = tableNumbers.map((num) => ({
    number: num,
    guests: tableMap.get(num) ?? [],
    totalSeats: seatsPerTable,
  }));

  return { tables, unseated };
}

/**
 * Tests for the seating algorithm.
 */
import { describe, it, expect } from "vitest";
import { autoAssign, buildTables, type SeatingGuest } from "./seating";

function makeGuest(
  id: string,
  name: string,
  partySize: number,
  group: string | null = null,
  tableNumber: number | null = null,
): SeatingGuest {
  return { id, name, party_size: partySize, guest_group: group, table_number: tableNumber };
}

describe("autoAssign", () => {
  it("returns empty array for empty guest list", () => {
    expect(autoAssign([], 10)).toEqual([]);
  });

  it("assigns all guests to tables", () => {
    const guests = [
      makeGuest("1", "Alice", 2),
      makeGuest("2", "Bob", 1),
      makeGuest("3", "Charlie", 3),
    ];
    const result = autoAssign(guests, 10);
    expect(result.every((g) => g.table_number !== null)).toBe(true);
  });

  it("keeps same guest_group on the same table when they fit", () => {
    const guests = [
      makeGuest("1", "Alice", 2, "Family"),
      makeGuest("2", "Bob", 3, "Family"),
      makeGuest("3", "Charlie", 1, "Friends"),
    ];
    const result = autoAssign(guests, 10);
    const alice = result.find((g) => g.id === "1")!;
    const bob = result.find((g) => g.id === "2")!;
    expect(alice.table_number).toBe(bob.table_number);
  });

  it("does not exceed seatsPerTable on any table", () => {
    const guests = [
      makeGuest("1", "A", 4),
      makeGuest("2", "B", 4),
      makeGuest("3", "C", 4),
      makeGuest("4", "D", 4),
    ];
    const result = autoAssign(guests, 8);
    const { tables } = buildTables(result, 8);
    for (const table of tables) {
      const used = table.guests.reduce((s, g) => s + g.party_size, 0);
      expect(used).toBeLessThanOrEqual(8);
    }
  });

  it("splits a group larger than one table across multiple tables", () => {
    // 5 guests each with 3 seats — group total = 15, table cap = 10 → must split.
    const guests = [
      makeGuest("1", "A", 3, "BigFamily"),
      makeGuest("2", "B", 3, "BigFamily"),
      makeGuest("3", "C", 3, "BigFamily"),
      makeGuest("4", "D", 3, "BigFamily"),
      makeGuest("5", "E", 3, "BigFamily"),
    ];
    const result = autoAssign(guests, 10);
    // All guests should be seated.
    expect(result.every((g) => g.table_number !== null)).toBe(true);
    // No table should exceed seatsPerTable.
    const { tables } = buildTables(result, 10);
    for (const table of tables) {
      const used = table.guests.reduce((s, g) => s + g.party_size, 0);
      expect(used).toBeLessThanOrEqual(10);
    }
  });

  it("packs guests efficiently — fills tables before opening new ones", () => {
    // 10 guests with 1 seat each, table cap = 10 → should all fit in 1 table.
    const guests = Array.from({ length: 10 }, (_, i) => makeGuest(String(i), `Guest ${i}`, 1));
    const result = autoAssign(guests, 10);
    const { tables } = buildTables(result, 10);
    expect(tables.length).toBe(1);
    expect(tables[0].guests.length).toBe(10);
  });

  it("does not mutate the input array", () => {
    const guests = [makeGuest("1", "Alice", 2)];
    const original = guests[0].table_number;
    autoAssign(guests, 10);
    expect(guests[0].table_number).toBe(original);
  });
});

describe("buildTables", () => {
  it("separates assigned and unassigned guests", () => {
    const guests = [
      makeGuest("1", "Alice", 2, null, 1),
      makeGuest("2", "Bob", 1, null, null),
      makeGuest("3", "Charlie", 3, null, 1),
    ];
    const { tables, unseated } = buildTables(guests, 10);
    expect(tables.length).toBe(1);
    expect(tables[0].number).toBe(1);
    expect(tables[0].guests.length).toBe(2);
    expect(unseated.length).toBe(1);
    expect(unseated[0].id).toBe("2");
  });

  it("returns empty tables and all guests unseated for null table_numbers", () => {
    const guests = [makeGuest("1", "Alice", 2), makeGuest("2", "Bob", 1)];
    const { tables, unseated } = buildTables(guests, 10);
    expect(tables.length).toBe(0);
    expect(unseated.length).toBe(2);
  });

  it("sorts tables by number ascending", () => {
    const guests = [
      makeGuest("1", "A", 1, null, 3),
      makeGuest("2", "B", 1, null, 1),
      makeGuest("3", "C", 1, null, 2),
    ];
    const { tables } = buildTables(guests, 10);
    expect(tables.map((t) => t.number)).toEqual([1, 2, 3]);
  });
});

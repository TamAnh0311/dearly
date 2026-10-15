import { describe, expect, it } from "vitest";
import { monthGrid, resolveFamilies, resolveGift, safeHttpsUrl } from "./invitation-extras";

describe("resolveFamilies", () => {
  it("returns null when nothing is filled in", () => {
    expect(resolveFamilies(undefined)).toBeNull();
    expect(resolveFamilies({ side1: "  ", side2: "" })).toBeNull();
    expect(resolveFamilies("nope")).toBeNull();
  });

  it("trims and keeps one side", () => {
    expect(resolveFamilies({ side1: "  Mr. Minh  &  Mrs. Lan " })).toEqual({ side1: "Mr. Minh & Mrs. Lan", side2: undefined });
  });

  it("caps very long text", () => {
    expect(resolveFamilies({ side2: "x".repeat(500) })!.side2!.length).toBe(120);
  });
});

describe("safeHttpsUrl", () => {
  it("accepts https only", () => {
    expect(safeHttpsUrl("https://img.example.com/qr.png")).toBe("https://img.example.com/qr.png");
    expect(safeHttpsUrl("http://img.example.com/qr.png")).toBeUndefined();
    expect(safeHttpsUrl("javascript:alert(1)")).toBeUndefined();
    expect(safeHttpsUrl("not a url")).toBeUndefined();
  });
});

describe("resolveGift", () => {
  it("drops accounts without a label or a way to pay", () => {
    expect(resolveGift({ accounts: [{ label: "Groom" }, { label: "", number: "123" }] })).toBeNull();
  });

  it("keeps at most two valid accounts and strips unsafe QR urls", () => {
    const out = resolveGift({
      note: " With love ",
      accounts: [
        { label: "Groom's family", bank: "VCB", number: "0123", qrUrl: "http://x/qr.png" },
        { label: "Bride's family", qrUrl: "https://x/qr.png" },
        { label: "Extra", number: "999" },
      ],
    });
    expect(out!.note).toBe("With love");
    expect(out!.accounts).toHaveLength(2);
    expect(out!.accounts[0].qrUrl).toBeUndefined();
    expect(out!.accounts[1].qrUrl).toBe("https://x/qr.png");
  });
});

describe("monthGrid", () => {
  it("starts on Monday with leading blanks", () => {
    // 1 Nov 2025 is a Saturday → 5 blanks (Mon..Fri)
    const grid = monthGrid(new Date(2025, 10, 16));
    expect(grid.slice(0, 6)).toEqual([null, null, null, null, null, 1]);
    expect(grid.filter(Boolean)).toHaveLength(30);
  });
});

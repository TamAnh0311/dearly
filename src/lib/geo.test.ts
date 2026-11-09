import { describe, it, expect } from "vitest";
import { hashIp } from "./geo";

describe("hashIp", () => {
  it("returns a consistent hash for the same IP", () => {
    const h1 = hashIp("192.168.1.1");
    const h2 = hashIp("192.168.1.1");
    expect(h1).toBe(h2);
  });

  it("returns different hashes for different IPs", () => {
    expect(hashIp("192.168.1.1")).not.toBe(hashIp("10.0.0.1"));
  });

  it("does not expose the raw IP", () => {
    const hash = hashIp("192.168.1.1");
    expect(hash).not.toContain("192");
  });
});

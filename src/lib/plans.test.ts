import { describe, expect, it } from "vitest";
import { EARLY_ACCESS, PLANS_ENABLED, canUseTemplate, planOf } from "./plans";

describe("plans (early access)", () => {
  it("plans are switched off while growing the user base", () => {
    expect(PLANS_ENABLED).toBe(false);
  });

  it("every event gets early access regardless of its stored plan", () => {
    expect(planOf({ plan: "free", plan_expires_at: null })).toBe(EARLY_ACCESS);
    expect(planOf({ plan: "premium", plan_expires_at: "2000-01-01" })).toBe(EARLY_ACCESS);
    expect(planOf(null)).toBe(EARLY_ACCESS);
  });

  it("early access unlocks premium templates and keeps pages online", () => {
    expect(canUseTemplate(EARLY_ACCESS, { is_premium: true })).toBe(true);
    expect(EARLY_ACCESS.retentionDays).toBeNull();
    expect(EARLY_ACCESS.maxPhotos).toBeGreaterThanOrEqual(1000);
  });
});

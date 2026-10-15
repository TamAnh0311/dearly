/**
 * Plans & limits — monetisation scaffold.
 *
 * Billing is not wired yet: every event is on "free" unless its `plan` column
 * is changed manually. Limits are enforced where cheap (guest list size,
 * photo uploads) and surfaced in the UI as upgrade prompts elsewhere.
 * When billing ships, set weddings.plan / plan_expires_at from the payment
 * webhook (see src/app/api/billing/checkout/route.ts).
 */

import type { PlanId, TemplateRow, WeddingRow } from "@/types/database";

export interface PlanLimits {
  id: PlanId;
  name: string;
  /** Display price (not charged yet). */
  price: string;
  priceNote: string;
  /** Approved photos stored per event. */
  maxPhotos: number;
  /** Named invitees on the personalised guest list. */
  maxInvitees: number;
  /** Days the event page stays online after the event date (null = forever). */
  retentionDays: number | null;
  premiumTemplates: boolean;
  removeBranding: boolean;
  highlights: string[];
}

export const PLANS: Record<PlanId, PlanLimits> = {
  free: {
    id: "free",
    name: "Free",
    price: "$0",
    priceNote: "forever",
    maxPhotos: 50,
    maxInvitees: 50,
    retentionDays: 90,
    premiumTemplates: false,
    removeBranding: false,
    highlights: ["All standard designs", "RSVP, blessings & reactions", "50 named guests", "50 photos", "Online 90 days after the event"],
  },
  premium: {
    id: "premium",
    name: "Premium",
    price: "$29",
    priceNote: "per event",
    maxPhotos: 1000,
    maxInvitees: 500,
    retentionDays: 365 * 2,
    premiumTemplates: true,
    removeBranding: true,
    highlights: ["Signature openings (curtain, wax seal…)", "500 named guests + check-in", "1,000 photos", "Online for 2 years", "No Dearly branding"],
  },
  forever: {
    id: "forever",
    name: "Forever",
    price: "$59",
    priceNote: "one time",
    maxPhotos: 5000,
    maxInvitees: 2000,
    retentionDays: null,
    premiumTemplates: true,
    removeBranding: true,
    highlights: ["Everything in Premium", "2,000 named guests", "5,000 photos", "Your memory book online forever"],
  },
};

/**
 * Master switch for paid plans. While false (early access, growing the user
 * base) every event gets EARLY_ACCESS, all pricing UI is hidden and /pricing
 * returns 404. Flip to true once billing is wired to turn plans back on.
 */
export const PLANS_ENABLED = false;

/**
 * Everything unlocked during early access. Caps are abuse guards only
 * (storage and spam), not upsell limits.
 */
export const EARLY_ACCESS: PlanLimits = {
  id: "free",
  name: "Early access",
  price: "$0",
  priceNote: "free during early access",
  maxPhotos: 2000,
  maxInvitees: 1000,
  retentionDays: null,
  premiumTemplates: true,
  removeBranding: false,
  highlights: [],
};

/** Resolves an event's effective plan (expired paid plans fall back to free; early access when plans are off). */
export function planOf(event: Pick<WeddingRow, "plan" | "plan_expires_at"> | null | undefined, now: Date = new Date()): PlanLimits {
  if (!PLANS_ENABLED) return EARLY_ACCESS;
  const id = event?.plan ?? "free";
  if (id !== "free" && event?.plan_expires_at && new Date(event.plan_expires_at) < now) return PLANS.free;
  return PLANS[id] ?? PLANS.free;
}

/** Whether a template can be published on this plan. */
export function canUseTemplate(plan: PlanLimits, template: Pick<TemplateRow, "is_premium">): boolean {
  return !template.is_premium || plan.premiumTemplates;
}

/** Date after which the event page should go offline (null = never). */
export function retentionEndsAt(plan: PlanLimits, eventDate: string | null): Date | null {
  if (plan.retentionDays === null || !eventDate) return null;
  const d = new Date(`${eventDate.slice(0, 10)}T00:00:00`);
  d.setDate(d.getDate() + plan.retentionDays);
  return d;
}

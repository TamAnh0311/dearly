"use client";

/**
 * FunnelPanel — 4-step RSVP conversion funnel:
 * Invited → Viewed → RSVP opened → Submitted.
 */

import { Filter } from "lucide-react";

interface AnalyticsEvent {
  event: string;
  guest_token: string | null;
  ip_hash: string | null;
  country: string | null;
  city: string | null;
  created_at: string;
}

interface Invitee {
  id: string;
  name: string;
  status: "pending" | "attending" | "declined";
  token: string;
}

interface FunnelPanelProps {
  /** All analytics events for the wedding. */
  events: AnalyticsEvent[];
  /** All invitees for the wedding. */
  invitees: Invitee[];
}

interface FunnelStep {
  label: string;
  count: number;
  percent: number;
}

/**
 * Builds the 4-step funnel from events and invitees.
 * Each step is expressed as a count and a percentage relative to step 1.
 */
function buildFunnel(events: AnalyticsEvent[], invitees: Invitee[]): FunnelStep[] {
  const invited = invitees.length;

  const viewedTokens = new Set(
    events.filter((e) => e.event === "page_view" && e.guest_token).map((e) => e.guest_token!)
  );
  const viewed = viewedTokens.size;

  const rsvpOpenedTokens = new Set(
    events.filter((e) => e.event === "rsvp_opened" && e.guest_token).map((e) => e.guest_token!)
  );
  const rsvpOpened = rsvpOpenedTokens.size;

  const submitted = invitees.filter((inv) => inv.status !== "pending").length;

  const base = Math.max(1, invited);
  return [
    { label: "Invited", count: invited, percent: 100 },
    { label: "Viewed", count: viewed, percent: Math.round((viewed / base) * 100) },
    { label: "RSVP opened", count: rsvpOpened, percent: Math.round((rsvpOpened / base) * 100) },
    { label: "Submitted", count: submitted, percent: Math.round((submitted / base) * 100) },
  ];
}

export default function FunnelPanel({ events, invitees }: FunnelPanelProps) {
  const steps = buildFunnel(events, invitees);

  return (
    <div className="rounded-2xl border border-dearly-border bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <Filter size={18} className="text-dearly-accent" />
        <h2 className="text-base font-semibold text-dearly-text">RSVP Funnel</h2>
      </div>

      <div className="space-y-3">
        {steps.map((step) => (
          <div key={step.label}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-dearly-text">{step.label}</span>
              <span className="font-medium text-dearly-text">
                {step.count}
                <span className="ml-1 text-xs font-normal text-dearly-text-secondary">({step.percent}%)</span>
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-dearly-accent-soft">
              <div
                className="h-3 rounded-full bg-dearly-accent transition-all"
                style={{ width: `${step.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

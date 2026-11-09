"use client";

/**
 * TimingPanel — bar chart of page_view and rsvp_submitted events
 * grouped by days relative to the wedding date. Falls back to raw
 * calendar dates when no wedding date is set.
 */

import { Clock } from "lucide-react";

interface AnalyticsEvent {
  event: string;
  guest_token: string | null;
  ip_hash: string | null;
  country: string | null;
  city: string | null;
  created_at: string;
}

interface TimingPanelProps {
  /** All analytics events for the wedding. */
  events: AnalyticsEvent[];
  /** ISO date string for the wedding (YYYY-MM-DD), or null if not set. */
  weddingDate: string | null;
}

interface TimingBucket {
  label: string;
  count: number;
}

/**
 * Groups targeted events by days-before-event when a wedding date is available,
 * or by calendar date otherwise.
 */
function buildTimingBuckets(events: AnalyticsEvent[], weddingDate: string | null): TimingBucket[] {
  const targeted = events.filter((e) => e.event === "page_view" || e.event === "rsvp_submitted");

  if (targeted.length === 0) return [];

  if (!weddingDate) {
    // Fall back to raw date grouping.
    const counts: Record<string, number> = {};
    for (const e of targeted) {
      const date = e.created_at.slice(0, 10);
      counts[date] = (counts[date] ?? 0) + 1;
    }
    return Object.entries(counts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ label: date.slice(5), count }));
  }

  const eventMs = new Date(weddingDate).getTime();
  const counts: Record<number, number> = {};
  for (const e of targeted) {
    const eventDate = new Date(e.created_at);
    const daysDiff = Math.round((eventMs - eventDate.getTime()) / 86_400_000);
    counts[daysDiff] = (counts[daysDiff] ?? 0) + 1;
  }

  return Object.entries(counts)
    .map(([days, count]) => ({ days: Number(days), count }))
    .sort((a, b) => b.days - a.days)
    .map(({ days, count }) => ({
      label: days === 0 ? "Day of" : days > 0 ? `${days}d before` : `${Math.abs(days)}d after`,
      count,
    }));
}

export default function TimingPanel({ events, weddingDate }: TimingPanelProps) {
  const buckets = buildTimingBuckets(events, weddingDate);
  const maxCount = Math.max(1, ...buckets.map((b) => b.count));

  return (
    <div className="rounded-2xl border border-dearly-border bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <Clock size={18} className="text-dearly-accent" />
        <h2 className="text-base font-semibold text-dearly-text">Activity Timing</h2>
      </div>
      <p className="mb-4 text-xs text-dearly-text-secondary">
        {weddingDate ? "Page views and RSVPs relative to your event date." : "Page views and RSVPs by date (set an event date to see relative timing)."}
      </p>

      {buckets.length === 0 ? (
        <p className="text-sm text-dearly-text-secondary">No activity recorded yet.</p>
      ) : (
        <div className="space-y-1.5">
          {buckets.map(({ label, count }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="w-20 shrink-0 text-xs text-dearly-text-secondary">{label}</span>
              <div className="flex-1 overflow-hidden rounded-full bg-dearly-accent-soft">
                <div
                  className="h-4 rounded-full bg-dearly-accent"
                  style={{ width: `${Math.round((count / maxCount) * 100)}%` }}
                />
              </div>
              <span className="w-6 text-right text-xs font-medium text-dearly-text">{count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

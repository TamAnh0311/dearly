"use client";

/**
 * PageViewsPanel — shows total page views, unique visitors, and a CSS bar
 * chart of page_view events grouped by date.
 */

import { Eye } from "lucide-react";

interface AnalyticsEvent {
  event: string;
  guest_token: string | null;
  country: string | null;
  city: string | null;
  ip_hash: string | null;
  created_at: string;
}

interface PageViewsPanelProps {
  /** All analytics events for the wedding. */
  events: AnalyticsEvent[];
}

/**
 * Groups page_view events by calendar date (YYYY-MM-DD) and returns
 * an array of { date, count } pairs sorted ascending.
 */
function groupByDate(events: AnalyticsEvent[]): { date: string; count: number }[] {
  const counts: Record<string, number> = {};
  for (const e of events) {
    if (e.event !== "page_view") continue;
    const date = e.created_at.slice(0, 10);
    counts[date] = (counts[date] ?? 0) + 1;
  }
  return Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));
}

export default function PageViewsPanel({ events }: PageViewsPanelProps) {
  const pageViews = events.filter((e) => e.event === "page_view");
  const totalViews = pageViews.length;
  const uniqueVisitors = new Set(pageViews.map((e) => e.ip_hash).filter(Boolean)).size;
  const guestsWhoViewed = new Set(pageViews.map((e) => e.guest_token).filter(Boolean)).size;
  const byDate = groupByDate(events);
  const maxCount = Math.max(1, ...byDate.map((d) => d.count));

  return (
    <div className="rounded-2xl border border-dearly-border bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <Eye size={18} className="text-dearly-accent" />
        <h2 className="text-base font-semibold text-dearly-text">Page Views</h2>
      </div>

      <div className="mb-5 grid grid-cols-3 gap-3">
        <div>
          <p className="text-2xl font-bold text-dearly-text">{totalViews}</p>
          <p className="text-xs text-dearly-text-secondary">Total views</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-dearly-text">{uniqueVisitors}</p>
          <p className="text-xs text-dearly-text-secondary">Unique visitors</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-dearly-text">{guestsWhoViewed}</p>
          <p className="text-xs text-dearly-text-secondary">Guests viewed</p>
        </div>
      </div>

      {byDate.length === 0 ? (
        <p className="text-sm text-dearly-text-secondary">No page views recorded yet.</p>
      ) : (
        <div className="space-y-1.5">
          {byDate.map(({ date, count }) => (
            <div key={date} className="flex items-center gap-2">
              <span className="w-20 shrink-0 text-xs text-dearly-text-secondary">{date.slice(5)}</span>
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

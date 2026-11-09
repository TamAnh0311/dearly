"use client";

/**
 * GeoPanel — groups page_view events by country and city, then renders
 * a sorted table (Country, City, Views) in descending view order.
 */

import { Globe } from "lucide-react";

interface AnalyticsEvent {
  event: string;
  guest_token: string | null;
  ip_hash: string | null;
  country: string | null;
  city: string | null;
  created_at: string;
}

interface GeoPanelProps {
  /** All analytics events for the wedding. */
  events: AnalyticsEvent[];
}

interface GeoRow {
  country: string;
  city: string;
  views: number;
}

/**
 * Builds a sorted list of country + city view counts from page_view events.
 * Rows with unknown location are grouped under "Unknown".
 */
function buildGeoRows(events: AnalyticsEvent[]): GeoRow[] {
  const counts: Record<string, number> = {};
  for (const e of events) {
    if (e.event !== "page_view") continue;
    const country = e.country ?? "Unknown";
    const city = e.city ?? "Unknown";
    const key = `${country}|||${city}`;
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return Object.entries(counts)
    .map(([key, views]) => {
      const [country, city] = key.split("|||");
      return { country, city, views };
    })
    .sort((a, b) => b.views - a.views);
}

export default function GeoPanel({ events }: GeoPanelProps) {
  const rows = buildGeoRows(events);

  return (
    <div className="rounded-2xl border border-dearly-border bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <Globe size={18} className="text-dearly-accent" />
        <h2 className="text-base font-semibold text-dearly-text">Geographic Reach</h2>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-dearly-text-secondary">No location data available yet.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-dearly-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dearly-border bg-dearly-accent-soft/40">
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-dearly-text-secondary">
                  Country
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-dearly-text-secondary">
                  City
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wider text-dearly-text-secondary">
                  Views
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dearly-border">
              {rows.map(({ country, city, views }) => (
                <tr key={`${country}-${city}`} className="hover:bg-dearly-accent-soft/20">
                  <td className="px-3 py-2 text-dearly-text">{country}</td>
                  <td className="px-3 py-2 text-dearly-text-secondary">{city}</td>
                  <td className="px-3 py-2 text-right font-medium text-dearly-text">{views}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

"use client";

/**
 * Analytics dashboard page — fetches aggregated analytics data from the API
 * and renders 6 panels covering page views, funnel, timing, engagement,
 * gallery statistics, and geographic reach.
 */

import { useEffect, useState } from "react";
import { useMyWedding } from "@/hooks/useWedding";
import PageViewsPanel from "@/components/dashboard/analytics/PageViewsPanel";
import FunnelPanel from "@/components/dashboard/analytics/FunnelPanel";
import TimingPanel from "@/components/dashboard/analytics/TimingPanel";
import EngagementPanel from "@/components/dashboard/analytics/EngagementPanel";
import GalleryStatsPanel from "@/components/dashboard/analytics/GalleryStatsPanel";
import GeoPanel from "@/components/dashboard/analytics/GeoPanel";

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

interface Blessing {
  id: string;
  guest_name: string;
  created_at: string;
}

interface Reaction {
  kind: string;
  count: number;
}

interface Photo {
  id: string;
  uploaded_by: "couple" | "guest";
  status: "pending" | "approved" | "rejected";
}

interface AnalyticsData {
  events: AnalyticsEvent[];
  invitees: Invitee[];
  blessings: Blessing[];
  reactions: Reaction[];
  photos: Photo[];
}

/**
 * Fetches analytics data from the API for the given wedding ID.
 * Throws on non-OK responses so the caller can handle errors uniformly.
 */
async function fetchAnalytics(weddingId: string): Promise<AnalyticsData> {
  const res = await fetch(`/api/analytics/${weddingId}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? "Failed to load analytics.");
  }
  return res.json() as Promise<AnalyticsData>;
}

export default function AnalyticsPage() {
  const { wedding, loading: weddingLoading } = useMyWedding();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!wedding?.id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchAnalytics(wedding.id)
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load analytics.");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [wedding?.id]);

  if (weddingLoading) {
    return (
      <div className="p-6">
        <p className="text-sm text-dearly-text-secondary">Loading…</p>
      </div>
    );
  }

  if (!wedding) {
    return (
      <div className="p-6">
        <p className="text-sm text-dearly-text-secondary">
          No event found. Set one up in the Editor first.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <h1 className="text-2xl font-semibold text-dearly-text">Analytics</h1>
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 animate-pulse rounded-2xl bg-dearly-border" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="mb-4 text-2xl font-semibold text-dearly-text">Analytics</h1>
        <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold text-dearly-text">Analytics</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <PageViewsPanel events={data.events} />
        <FunnelPanel events={data.events} invitees={data.invitees} />
        <TimingPanel events={data.events} weddingDate={wedding.wedding_date ?? null} />
        <EngagementPanel blessings={data.blessings} reactions={data.reactions} />
        <GalleryStatsPanel photos={data.photos} />
        <GeoPanel events={data.events} />
      </div>
    </div>
  );
}

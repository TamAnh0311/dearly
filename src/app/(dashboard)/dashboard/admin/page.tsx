"use client";

/**
 * Admin dashboard — overview of all events, users and platform health.
 * Restricted to users with app_metadata.role === "admin".
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { Shield, Users, Calendar, Image, MessageSquare, BarChart3 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";

interface AdminStats {
  totalEvents: number;
  publishedEvents: number;
  totalRsvps: number;
  totalPhotos: number;
  totalBlessings: number;
  recentEvents: { id: string; slug: string; partner1_name: string; partner2_name: string; is_published: boolean; created_at: string; event_type: string }[];
}

export default function AdminPage() {
  const { user } = useAuth();
  const isAdmin = user?.app_metadata?.role === "admin";
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) { setLoading(false); return; }
    async function load() {
      const supabase = createClient();
      const [events, rsvps, photos, blessings] = await Promise.all([
        supabase.from("weddings").select("id, slug, partner1_name, partner2_name, is_published, created_at, event_type").order("created_at", { ascending: false }).limit(50),
        supabase.from("rsvps").select("id", { count: "exact", head: true }),
        supabase.from("gallery_photos").select("id", { count: "exact", head: true }),
        supabase.from("guestbook_entries").select("id", { count: "exact", head: true }),
      ]);
      const allEvents = (events.data ?? []) as AdminStats["recentEvents"];
      setStats({
        totalEvents: allEvents.length,
        publishedEvents: allEvents.filter((e) => e.is_published).length,
        totalRsvps: rsvps.count ?? 0,
        totalPhotos: photos.count ?? 0,
        totalBlessings: blessings.count ?? 0,
        recentEvents: allEvents.slice(0, 20),
      });
      setLoading(false);
    }
    load();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Shield size={32} className="mx-auto text-dearly-text-muted" />
          <p className="mt-3 text-sm text-dearly-text-secondary">Admin access only.</p>
        </div>
      </div>
    );
  }

  if (loading) return <p className="text-sm text-dearly-text-secondary">Loading admin data…</p>;
  if (!stats) return <p className="text-sm text-dearly-text-secondary">Failed to load admin data.</p>;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-2">
        <Shield size={20} className="text-dearly-accent" />
        <h1 className="text-2xl font-bold text-dearly-text">Admin Dashboard</h1>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {[
          { label: "Total Events", value: stats.totalEvents, Icon: Calendar },
          { label: "Published", value: stats.publishedEvents, Icon: Calendar },
          { label: "RSVPs", value: stats.totalRsvps, Icon: Users },
          { label: "Photos", value: stats.totalPhotos, Icon: Image },
          { label: "Blessings", value: stats.totalBlessings, Icon: MessageSquare },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-dearly-border bg-dearly-card p-4">
            <s.Icon size={16} className="text-dearly-accent" />
            <p className="mt-2 text-2xl font-bold text-dearly-text">{s.value}</p>
            <p className="text-xs text-dearly-text-secondary">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent events table */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-dearly-text">
          <BarChart3 size={16} /> Recent Events
        </h2>
        <div className="overflow-x-auto rounded-xl border border-dearly-border">
          <table className="w-full text-sm">
            <thead className="border-b border-dearly-border bg-dearly-cream text-xs text-dearly-text-secondary">
              <tr>
                <th className="px-4 py-2 text-left">Event</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Slug</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dearly-border bg-dearly-card">
              {stats.recentEvents.map((e) => (
                <tr key={e.id} className="hover:bg-dearly-cream/50">
                  <td className="px-4 py-2 font-medium text-dearly-text">{e.partner1_name}{e.partner2_name ? ` & ${e.partner2_name}` : ""}</td>
                  <td className="px-4 py-2 text-dearly-text-secondary capitalize">{e.event_type ?? "wedding"}</td>
                  <td className="px-4 py-2">
                    <Link href={`/${e.slug}`} target="_blank" className="font-mono text-xs text-dearly-accent hover:underline">/{e.slug}</Link>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${e.is_published ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                      {e.is_published ? "Live" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs text-dearly-text-muted">{new Date(e.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";

/**
 * Admin dashboard — tabbed interface for platform management.
 * Restricted to users with app_metadata.role === "admin".
 */

import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Image,
  Shield,
  ScrollText,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import UsersTab from "@/components/dashboard/admin/UsersTab";
import EventsTab from "@/components/dashboard/admin/EventsTab";
import ContentTab from "@/components/dashboard/admin/ContentTab";
import SpamTab from "@/components/dashboard/admin/SpamTab";
import AuditTab from "@/components/dashboard/admin/AuditTab";

interface AdminStats {
  totalUsers: number;
  totalEvents: number;
  publishedEvents: number;
  totalRsvps: number;
  totalPhotos: number;
  totalBlessings: number;
  activeUsers7d: number;
  activeUsers30d: number;
}

type TabId = "overview" | "users" | "events" | "content" | "spam" | "audit";

const TABS: { id: TabId; label: string; Icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", Icon: LayoutDashboard },
  { id: "users", label: "Users", Icon: Users },
  { id: "events", label: "Events", Icon: Calendar },
  { id: "content", label: "Content", Icon: Image },
  { id: "spam", label: "Spam Controls", Icon: Shield },
  { id: "audit", label: "Audit Log", Icon: ScrollText },
];

/** Inline overview panel — fetches platform stats and renders stat cards. */
function OverviewTab() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/stats");
        if (!res.ok) throw new Error("Failed to load stats.");
        const json = await res.json() as AdminStats;
        setStats(json);
      } catch {
        setError("Failed to load admin stats.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p className="text-sm text-dearly-text-secondary">Loading stats…</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!stats) return null;

  const statCards = [
    { label: "Total Users", value: stats.totalUsers },
    { label: "Total Events", value: stats.totalEvents },
    { label: "Published Events", value: stats.publishedEvents },
    { label: "Total RSVPs", value: stats.totalRsvps },
    { label: "Total Photos", value: stats.totalPhotos },
    { label: "Total Blessings", value: stats.totalBlessings },
    { label: "Active Users (7d)", value: stats.activeUsers7d },
    { label: "Active Users (30d)", value: stats.activeUsers30d },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {statCards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-dearly-border bg-dearly-card p-4"
        >
          <p className="text-2xl font-bold text-dearly-text">{card.value}</p>
          <p className="mt-1 text-xs text-dearly-text-secondary">{card.label}</p>
        </div>
      ))}
    </div>
  );
}

/** Root admin page with tab navigation. */
export default function AdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  if (user?.app_metadata?.role !== "admin") {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Shield size={32} className="mx-auto text-dearly-text-muted" />
          <p className="mt-3 text-sm text-dearly-text-secondary">Access denied.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Page heading */}
      <div className="flex items-center gap-2">
        <Shield size={20} className="text-dearly-accent" />
        <h1 className="text-2xl font-bold text-dearly-text">Admin Dashboard</h1>
      </div>

      {/* Tab bar */}
      <div className="rounded-xl border border-dearly-border bg-dearly-cream p-1">
        <nav className="flex flex-wrap gap-1">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === id
                  ? "bg-white text-dearly-accent shadow-sm"
                  : "text-dearly-text-secondary hover:text-dearly-text"
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "users" && <UsersTab />}
        {activeTab === "events" && <EventsTab />}
        {activeTab === "content" && <ContentTab />}
        {activeTab === "spam" && <SpamTab />}
        {activeTab === "audit" && <AuditTab />}
      </div>
    </div>
  );
}

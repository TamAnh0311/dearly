"use client";

/**
 * EventsTab — filterable event table for the admin panel.
 * Fetches from /api/admin/events and supports unpublish and delete actions.
 */

import { useEffect, useState } from "react";
import { ExternalLink, Trash2, EyeOff } from "lucide-react";

interface AdminEvent {
  id: string;
  partner1_name: string;
  partner2_name: string | null;
  event_type: string | null;
  is_published: boolean;
  created_at: string;
  slug: string;
  inviteeCount: number;
}

interface EventsResponse {
  events: AdminEvent[];
  total: number;
}

/** Fetches and displays all events with filter and action controls. */
export default function EventsTab() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [actionPending, setActionPending] = useState<string | null>(null);

  async function loadEvents() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (typeFilter) params.set("type", typeFilter);
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/admin/events?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load events.");
      const json = await res.json() as EventsResponse;
      setEvents(json.events);
    } catch {
      setError("Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadEvents(); }, [typeFilter, statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleAction(action: "unpublish" | "delete", eventId: string) {
    if (action === "delete") {
      const confirmed = window.confirm("Permanently delete this event?");
      if (!confirmed) return;
    }
    setActionPending(eventId);
    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, eventId }),
      });
      if (!res.ok) {
        const json = await res.json() as { error?: string };
        throw new Error(json.error ?? "Action failed.");
      }
      await loadEvents();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Action failed.");
    } finally {
      setActionPending(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-dearly-border bg-white px-3 py-2 text-sm text-dearly-text focus:outline-none focus:ring-2 focus:ring-dearly-accent/30"
        >
          <option value="">All types</option>
          <option value="wedding">Wedding</option>
          <option value="birthday">Birthday</option>
          <option value="memorial">Memorial</option>
          <option value="celebration">Celebration</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-dearly-border bg-white px-3 py-2 text-sm text-dearly-text focus:outline-none focus:ring-2 focus:ring-dearly-accent/30"
        >
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Loading / Error states */}
      {loading && <p className="text-sm text-dearly-text-secondary">Loading events…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Table */}
      {!loading && !error && (
        <div className="overflow-x-auto rounded-xl border border-dearly-border">
          <table className="w-full text-sm">
            <thead className="border-b border-dearly-border bg-dearly-cream text-xs text-dearly-text-secondary">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Published</th>
                <th className="px-4 py-2 text-left">Created</th>
                <th className="px-4 py-2 text-left">Guests</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dearly-border bg-dearly-card">
              {events.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-sm text-dearly-text-muted">
                    No events found.
                  </td>
                </tr>
              ) : (
                events.map((e) => (
                  <tr key={e.id} className="hover:bg-dearly-cream/50">
                    <td className="px-4 py-2 font-medium text-dearly-text">
                      {e.partner1_name}
                      {e.partner2_name ? ` & ${e.partner2_name}` : ""}
                    </td>
                    <td className="px-4 py-2 capitalize text-dearly-text-secondary">
                      {e.event_type ?? "wedding"}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          e.is_published
                            ? "bg-green-50 text-green-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {e.is_published ? "Live" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-xs text-dearly-text-muted">
                      {new Date(e.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-dearly-text-secondary">{e.inviteeCount}</td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        {e.is_published && (
                          <button
                            onClick={() => handleAction("unpublish", e.id)}
                            disabled={actionPending === e.id}
                            title="Unpublish event"
                            className="rounded p-1 text-amber-600 hover:bg-amber-50 disabled:opacity-50"
                          >
                            <EyeOff size={14} />
                          </button>
                        )}
                        <a
                          href={`/${e.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View as guest"
                          className="rounded p-1 text-dearly-accent hover:bg-dearly-accent/10"
                        >
                          <ExternalLink size={14} />
                        </a>
                        <button
                          onClick={() => handleAction("delete", e.id)}
                          disabled={actionPending === e.id}
                          title="Delete event"
                          className="rounded p-1 text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

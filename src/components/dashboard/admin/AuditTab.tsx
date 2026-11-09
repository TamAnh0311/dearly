"use client";

/**
 * AuditTab — paginated audit log viewer for the admin panel.
 * Fetches from /api/admin/audit with optional action and date range filters.
 */

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AuditLog {
  id: string;
  actor_id: string;
  actorEmail: string | null;
  action: string;
  target_type: string;
  target_id: string;
  ip_address: string | null;
  created_at: string;
}

interface AuditResponse {
  logs: AuditLog[];
  total: number;
}

const PAGE_SIZE = 50;

/** Displays paginated audit log entries with action and date range filtering. */
export default function AuditTab() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  async function loadLogs(currentPage: number) {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(currentPage) });
      if (actionFilter) params.set("action", actionFilter);
      if (dateFrom) params.set("from", dateFrom);
      if (dateTo) params.set("to", dateTo);
      const res = await fetch(`/api/admin/audit?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load audit logs.");
      const json = await res.json() as AuditResponse;
      setLogs(json.logs);
      setTotal(json.total);
    } catch {
      setError("Failed to load audit logs. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setPage(1);
    loadLogs(1);
  }, [actionFilter, dateFrom, dateTo]); // eslint-disable-line react-hooks/exhaustive-deps

  function handlePageChange(newPage: number) {
    setPage(newPage);
    loadLogs(newPage);
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-dearly-text-secondary">Action type</label>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="rounded-lg border border-dearly-border bg-white px-3 py-2 text-sm text-dearly-text focus:outline-none focus:ring-2 focus:ring-dearly-accent/30"
          >
            <option value="">All actions</option>
            <option value="admin.user.disable">user.disable</option>
            <option value="admin.user.enable">user.enable</option>
            <option value="admin.user.delete">user.delete</option>
            <option value="admin.event.unpublish">event.unpublish</option>
            <option value="admin.event.delete">event.delete</option>
            <option value="admin.content.approve">content.approve</option>
            <option value="admin.content.reject">content.reject</option>
            <option value="admin.content.delete">content.delete</option>
            <option value="admin.spam.add">spam.add</option>
            <option value="admin.spam.remove">spam.remove</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-dearly-text-secondary">From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded-lg border border-dearly-border bg-white px-3 py-2 text-sm text-dearly-text focus:outline-none focus:ring-2 focus:ring-dearly-accent/30"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-dearly-text-secondary">To</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded-lg border border-dearly-border bg-white px-3 py-2 text-sm text-dearly-text focus:outline-none focus:ring-2 focus:ring-dearly-accent/30"
          />
        </div>
      </div>

      {/* Loading / Error */}
      {loading && <p className="text-sm text-dearly-text-secondary">Loading audit logs…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Table */}
      {!loading && !error && (
        <>
          <div className="overflow-x-auto rounded-xl border border-dearly-border">
            <table className="w-full text-sm">
              <thead className="border-b border-dearly-border bg-dearly-cream text-xs text-dearly-text-secondary">
                <tr>
                  <th className="px-4 py-2 text-left">Timestamp</th>
                  <th className="px-4 py-2 text-left">Admin</th>
                  <th className="px-4 py-2 text-left">Action</th>
                  <th className="px-4 py-2 text-left">Target</th>
                  <th className="px-4 py-2 text-left">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dearly-border bg-dearly-card">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-sm text-dearly-text-muted">
                      No audit log entries found.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-dearly-cream/50">
                      <td className="px-4 py-2 text-xs text-dearly-text-muted whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-xs text-dearly-text-secondary">
                        {log.actorEmail ?? log.actor_id.slice(0, 8)}
                      </td>
                      <td className="px-4 py-2">
                        <span className="rounded bg-dearly-cream px-2 py-0.5 font-mono text-[11px] text-dearly-text">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-xs text-dearly-text-secondary capitalize">
                        {log.target_type}
                      </td>
                      <td className="px-4 py-2 font-mono text-[11px] text-dearly-text-muted max-w-[160px] truncate">
                        {log.target_id}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between text-sm text-dearly-text-secondary">
            <span>
              Page {page} of {totalPages} ({total} entries)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="flex items-center gap-1 rounded-lg border border-dearly-border px-3 py-1.5 text-xs hover:bg-dearly-cream disabled:opacity-40"
              >
                <ChevronLeft size={13} /> Prev
              </button>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
                className="flex items-center gap-1 rounded-lg border border-dearly-border px-3 py-1.5 text-xs hover:bg-dearly-cream disabled:opacity-40"
              >
                Next <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

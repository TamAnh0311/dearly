"use client";

/**
 * UsersTab — searchable user management table for the admin panel.
 * Fetches from /api/admin/users and supports disable/enable/delete actions.
 */

import { useEffect, useState } from "react";
import { Search, Trash2, Ban, CheckCircle } from "lucide-react";

interface AdminUser {
  id: string;
  email: string | null;
  displayName: string | null;
  eventCount: number;
  role: string;
  disabled: boolean;
  createdAt: string;
}

/** Fetches the user list from the admin API and handles action mutations. */
export default function UsersTab() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [actionPending, setActionPending] = useState<string | null>(null);

  async function loadUsers() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to load users.");
      const json = await res.json() as { users: AdminUser[] };
      setUsers(json.users);
    } catch {
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadUsers(); }, []);

  async function handleAction(action: "disable" | "enable" | "delete", userId: string) {
    if (action === "delete") {
      const confirmed = window.confirm("Permanently delete this user and all their events?");
      if (!confirmed) return;
    }
    setActionPending(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, userId }),
      });
      if (!res.ok) {
        const json = await res.json() as { error?: string };
        throw new Error(json.error ?? "Action failed.");
      }
      await loadUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Action failed.");
    } finally {
      setActionPending(null);
    }
  }

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      (u.email ?? "").toLowerCase().includes(q) ||
      (u.displayName ?? "").toLowerCase().includes(q)
    );
  });

  if (loading) {
    return <p className="text-sm text-dearly-text-secondary">Loading users…</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-dearly-text-muted" />
        <input
          type="text"
          placeholder="Search by email or name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-dearly-border bg-white py-2 pl-9 pr-3 text-sm text-dearly-text placeholder:text-dearly-text-muted focus:outline-none focus:ring-2 focus:ring-dearly-accent/30"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-dearly-border">
        <table className="w-full text-sm">
          <thead className="border-b border-dearly-border bg-dearly-cream text-xs text-dearly-text-secondary">
            <tr>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Events</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Created</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dearly-border bg-dearly-card">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-sm text-dearly-text-muted">
                  No users found.
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id} className="hover:bg-dearly-cream/50">
                  <td className="px-4 py-2 font-medium text-dearly-text">{u.email ?? "—"}</td>
                  <td className="px-4 py-2 text-dearly-text-secondary">{u.displayName ?? "—"}</td>
                  <td className="px-4 py-2 text-dearly-text-secondary">{u.eventCount}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        u.disabled
                          ? "bg-red-50 text-red-700"
                          : "bg-green-50 text-green-700"
                      }`}
                    >
                      {u.disabled ? "Disabled" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs text-dearly-text-muted">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      {u.disabled ? (
                        <button
                          onClick={() => handleAction("enable", u.id)}
                          disabled={actionPending === u.id}
                          title="Enable user"
                          className="rounded p-1 text-green-600 hover:bg-green-50 disabled:opacity-50"
                        >
                          <CheckCircle size={14} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAction("disable", u.id)}
                          disabled={actionPending === u.id}
                          title="Disable user"
                          className="rounded p-1 text-amber-600 hover:bg-amber-50 disabled:opacity-50"
                        >
                          <Ban size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => handleAction("delete", u.id)}
                        disabled={actionPending === u.id}
                        title="Delete user"
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
    </div>
  );
}

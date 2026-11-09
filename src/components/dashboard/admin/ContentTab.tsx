"use client";

/**
 * ContentTab — content browser with sub-tabs for Photos, Blessings, and Guestbook.
 * Supports checkbox selection and bulk approve/reject/delete actions.
 */

import { useEffect, useState } from "react";
import { CheckSquare, Square, Trash2, CheckCircle2, XCircle } from "lucide-react";

type ContentType = "photo" | "blessing" | "guestbook";

interface ContentItem {
  id: string;
  wedding_id: string;
  created_at: string;
  status?: string;
  // Photo-specific
  file_path?: string;
  caption?: string;
  // Guestbook/blessing-specific
  guest_name?: string;
  message?: string;
  weddings?: { partner1_name: string; partner2_name: string | null; slug: string } | null;
}

interface ContentResponse {
  content: ContentItem[];
  total: number;
}

const SUB_TABS: { label: string; value: ContentType }[] = [
  { label: "Photos", value: "photo" },
  { label: "Blessings", value: "blessing" },
  { label: "Guestbook", value: "guestbook" },
];

/** Displays content items with sub-tab switching and bulk action toolbar. */
export default function ContentTab() {
  const [activeType, setActiveType] = useState<ContentType>("photo");
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [actionPending, setActionPending] = useState(false);

  async function loadContent(type: ContentType) {
    setLoading(true);
    setError(null);
    setSelected(new Set());
    try {
      const res = await fetch(`/api/admin/content?type=${type}`);
      if (!res.ok) throw new Error("Failed to load content.");
      const json = await res.json() as ContentResponse;
      setItems(json.content);
    } catch {
      setError("Failed to load content. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadContent(activeType); }, [activeType]);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }

  function toggleSelectAll() {
    if (selected.size === items.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(items.map((i) => i.id)));
    }
  }

  async function handleBulkAction(action: "approve" | "reject" | "delete") {
    if (selected.size === 0) return;
    if (action === "delete") {
      const confirmed = window.confirm(`Delete ${selected.size} item(s)?`);
      if (!confirmed) return;
    }
    setActionPending(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          contentType: activeType,
          ids: Array.from(selected),
        }),
      });
      if (!res.ok) {
        const json = await res.json() as { error?: string };
        throw new Error(json.error ?? "Action failed.");
      }
      await loadContent(activeType);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Action failed.");
    } finally {
      setActionPending(false);
    }
  }

  const allSelected = items.length > 0 && selected.size === items.length;

  return (
    <div className="space-y-4">
      {/* Sub-tab switcher */}
      <div className="flex gap-1 rounded-lg border border-dearly-border bg-dearly-cream p-1 w-fit">
        {SUB_TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setActiveType(t.value)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              activeType === t.value
                ? "bg-white text-dearly-accent shadow-sm"
                : "text-dearly-text-secondary hover:text-dearly-text"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Bulk toolbar — shown only when items are selected */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-dearly-border bg-dearly-cream px-4 py-2">
          <span className="text-xs text-dearly-text-secondary">{selected.size} selected</span>
          {activeType === "photo" && (
            <>
              <button
                onClick={() => handleBulkAction("approve")}
                disabled={actionPending}
                className="flex items-center gap-1 rounded px-2 py-1 text-xs text-green-700 hover:bg-green-50 disabled:opacity-50"
              >
                <CheckCircle2 size={13} /> Approve
              </button>
              <button
                onClick={() => handleBulkAction("reject")}
                disabled={actionPending}
                className="flex items-center gap-1 rounded px-2 py-1 text-xs text-amber-700 hover:bg-amber-50 disabled:opacity-50"
              >
                <XCircle size={13} /> Reject
              </button>
            </>
          )}
          <button
            onClick={() => handleBulkAction("delete")}
            disabled={actionPending}
            className="flex items-center gap-1 rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 size={13} /> Delete
          </button>
        </div>
      )}

      {/* Loading / Error */}
      {loading && <p className="text-sm text-dearly-text-secondary">Loading content…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Content list */}
      {!loading && !error && (
        <div className="overflow-x-auto rounded-xl border border-dearly-border">
          <table className="w-full text-sm">
            <thead className="border-b border-dearly-border bg-dearly-cream text-xs text-dearly-text-secondary">
              <tr>
                <th className="px-4 py-2 text-left w-8">
                  <button onClick={toggleSelectAll} className="text-dearly-text-muted hover:text-dearly-text">
                    {allSelected ? <CheckSquare size={14} /> : <Square size={14} />}
                  </button>
                </th>
                <th className="px-4 py-2 text-left">Preview</th>
                <th className="px-4 py-2 text-left">Event</th>
                <th className="px-4 py-2 text-left">Date</th>
                {activeType === "photo" && <th className="px-4 py-2 text-left">Status</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-dearly-border bg-dearly-card">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={activeType === "photo" ? 5 : 4} className="px-4 py-6 text-center text-sm text-dearly-text-muted">
                    No content found.
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const eventName = item.weddings
                    ? `${item.weddings.partner1_name}${item.weddings.partner2_name ? ` & ${item.weddings.partner2_name}` : ""}`
                    : "—";
                  const preview = item.file_path
                    ? item.caption ?? item.file_path.split("/").pop() ?? "photo"
                    : item.message ?? "—";
                  return (
                    <tr key={item.id} className="hover:bg-dearly-cream/50">
                      <td className="px-4 py-2">
                        <button onClick={() => toggleSelect(item.id)} className="text-dearly-text-muted hover:text-dearly-text">
                          {selected.has(item.id) ? <CheckSquare size={14} className="text-dearly-accent" /> : <Square size={14} />}
                        </button>
                      </td>
                      <td className="px-4 py-2 text-dearly-text-secondary max-w-xs truncate">{preview}</td>
                      <td className="px-4 py-2 text-dearly-text-secondary">{eventName}</td>
                      <td className="px-4 py-2 text-xs text-dearly-text-muted">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      {activeType === "photo" && (
                        <td className="px-4 py-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              item.status === "approved"
                                ? "bg-green-50 text-green-700"
                                : item.status === "rejected"
                                ? "bg-red-50 text-red-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {item.status ?? "pending"}
                          </span>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

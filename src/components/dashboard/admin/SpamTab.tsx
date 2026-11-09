"use client";

/**
 * SpamTab — spam rules manager for the admin panel.
 * Displays and manages blocked IPs and banned domains via /api/admin/spam.
 */

import { useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";

interface SpamRule {
  id: string;
  rule_type: "ip" | "domain";
  value: string;
  created_at: string;
}

interface SpamResponse {
  rules: SpamRule[];
}

/** Fetches spam rules and provides add/remove controls for IPs and domains. */
export default function SpamTab() {
  const [rules, setRules] = useState<SpamRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newIp, setNewIp] = useState("");
  const [newDomain, setNewDomain] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [removePending, setRemovePending] = useState<string | null>(null);

  async function loadRules() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/spam");
      if (!res.ok) throw new Error("Failed to load spam rules.");
      const json = await res.json() as SpamResponse;
      setRules(json.rules);
    } catch {
      setError("Failed to load spam rules. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadRules(); }, []);

  async function handleAdd(ruleType: "ip" | "domain") {
    const value = ruleType === "ip" ? newIp.trim() : newDomain.trim();
    if (!value) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/spam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ruleType, value }),
      });
      if (!res.ok) {
        const json = await res.json() as { error?: string };
        throw new Error(json.error ?? "Failed to add rule.");
      }
      if (ruleType === "ip") setNewIp("");
      else setNewDomain("");
      await loadRules();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add rule.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemove(id: string) {
    setRemovePending(id);
    try {
      const res = await fetch("/api/admin/spam", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const json = await res.json() as { error?: string };
        throw new Error(json.error ?? "Failed to remove rule.");
      }
      await loadRules();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to remove rule.");
    } finally {
      setRemovePending(null);
    }
  }

  const ips = rules.filter((r) => r.rule_type === "ip");
  const domains = rules.filter((r) => r.rule_type === "domain");

  if (loading) return <p className="text-sm text-dearly-text-secondary">Loading spam rules…</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Blocked IPs */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-dearly-text">Blocked IPs</h2>
        <ul className="divide-y divide-dearly-border rounded-xl border border-dearly-border bg-dearly-card">
          {ips.length === 0 ? (
            <li className="px-4 py-3 text-sm text-dearly-text-muted">No blocked IPs.</li>
          ) : (
            ips.map((r) => (
              <li key={r.id} className="flex items-center justify-between px-4 py-2">
                <span className="font-mono text-sm text-dearly-text">{r.value}</span>
                <button
                  onClick={() => handleRemove(r.id)}
                  disabled={removePending === r.id}
                  className="rounded p-1 text-red-600 hover:bg-red-50 disabled:opacity-50"
                  title="Remove rule"
                >
                  <Trash2 size={13} />
                </button>
              </li>
            ))
          )}
        </ul>
        {/* Add IP form */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newIp}
            onChange={(e) => setNewIp(e.target.value)}
            placeholder="e.g. 192.168.1.1"
            onKeyDown={(e) => { if (e.key === "Enter") handleAdd("ip"); }}
            className="flex-1 rounded-lg border border-dearly-border bg-white px-3 py-2 text-sm text-dearly-text placeholder:text-dearly-text-muted focus:outline-none focus:ring-2 focus:ring-dearly-accent/30"
          />
          <button
            onClick={() => handleAdd("ip")}
            disabled={submitting || !newIp.trim()}
            className="flex items-center gap-1 rounded-lg bg-dearly-accent px-3 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            <Plus size={14} /> Add
          </button>
        </div>
      </section>

      {/* Banned Domains */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-dearly-text">Banned Domains</h2>
        <ul className="divide-y divide-dearly-border rounded-xl border border-dearly-border bg-dearly-card">
          {domains.length === 0 ? (
            <li className="px-4 py-3 text-sm text-dearly-text-muted">No banned domains.</li>
          ) : (
            domains.map((r) => (
              <li key={r.id} className="flex items-center justify-between px-4 py-2">
                <span className="font-mono text-sm text-dearly-text">{r.value}</span>
                <button
                  onClick={() => handleRemove(r.id)}
                  disabled={removePending === r.id}
                  className="rounded p-1 text-red-600 hover:bg-red-50 disabled:opacity-50"
                  title="Remove rule"
                >
                  <Trash2 size={13} />
                </button>
              </li>
            ))
          )}
        </ul>
        {/* Add domain form */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            placeholder="e.g. spam.example.com"
            onKeyDown={(e) => { if (e.key === "Enter") handleAdd("domain"); }}
            className="flex-1 rounded-lg border border-dearly-border bg-white px-3 py-2 text-sm text-dearly-text placeholder:text-dearly-text-muted focus:outline-none focus:ring-2 focus:ring-dearly-accent/30"
          />
          <button
            onClick={() => handleAdd("domain")}
            disabled={submitting || !newDomain.trim()}
            className="flex items-center gap-1 rounded-lg bg-dearly-accent px-3 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            <Plus size={14} /> Add
          </button>
        </div>
      </section>
    </div>
  );
}

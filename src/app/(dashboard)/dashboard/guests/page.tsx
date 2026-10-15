"use client";

/**
 * Guest list — paste names to generate personal invitation links, then track
 * the results: who's coming (and with how many companions), who declined,
 * who hasn't answered, and on the day, who actually showed up (check-in).
 *
 * Data: `invitees` table (owner-only RLS). Guests open `/<slug>?i=<token>`,
 * get greeted by name, and their RSVP updates their row via /api/rsvp.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, Copy, Download, MessageCircle, Search, Trash2, UserCheck, UserPlus, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useMyWedding } from "@/hooks/useWedding";
import { guestListCsv, inviteUrl, parseGuestList, summarizeGuestList } from "@/lib/guest-list";
import { PLANS_ENABLED, planOf } from "@/lib/plans";
import type { InviteeRow } from "@/types/database";

type Filter = "all" | "attending" | "declined" | "pending" | "checked-in";

const STATUS_STYLE: Record<InviteeRow["status"], string> = {
  attending: "bg-green-50 text-green-700",
  declined: "bg-dearly-rose-soft text-dearly-rose",
  pending: "bg-dearly-cream text-dearly-text-secondary",
};

export default function GuestsPage() {
  const { wedding, loading: weddingLoading } = useMyWedding();
  const [invitees, setInvitees] = useState<InviteeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paste, setPaste] = useState("");
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const plan = planOf(wedding);
  const origin = typeof window === "undefined" ? "" : window.location.origin;

  /** Loads the guest list for the current event. */
  const load = useCallback(async () => {
    if (!wedding) return;
    const { data, error: qErr } = await createClient()
      .from("invitees")
      .select("*")
      .eq("wedding_id", wedding.id)
      .order("created_at", { ascending: true });
    if (qErr) setError("Couldn't load your guest list. Refresh the page to try again.");
    setInvitees((data ?? []) as InviteeRow[]);
    setLoading(false);
  }, [wedding]);

  useEffect(() => {
    void load();
  }, [load]);

  const parsed = useMemo(() => parseGuestList(paste), [paste]);
  const remaining = plan.maxInvitees - invitees.length;
  const summary = useMemo(() => summarizeGuestList(invitees), [invitees]);

  /** Creates personal invitations for every pasted name (within the plan limit). */
  async function addGuests() {
    if (!wedding || parsed.length === 0) return;
    setError(null);
    const existing = new Set(invitees.map((i) => i.name.toLowerCase()));
    const fresh = parsed.filter((p) => !existing.has(p.name.toLowerCase()));
    if (fresh.length === 0) {
      setError("Everyone in that list is already on your guest list.");
      return;
    }
    if (fresh.length > remaining) {
      setError(
        PLANS_ENABLED
          ? `Your ${plan.name} plan allows ${plan.maxInvitees} named guests — ${Math.max(remaining, 0)} left. Upgrade on the Pricing page to invite more.`
          : `A guest list can hold up to ${plan.maxInvitees} names — ${Math.max(remaining, 0)} left.`
      );
      return;
    }
    setSaving(true);
    const { data, error: insErr } = await createClient()
      .from("invitees")
      .insert(fresh.map((p) => ({ wedding_id: wedding.id, name: p.name, max_party_size: p.maxPartySize })))
      .select("*");
    setSaving(false);
    if (insErr) {
      setError("Couldn't save those guests. Please try again.");
      return;
    }
    setInvitees((prev) => [...prev, ...((data ?? []) as InviteeRow[])]);
    setPaste("");
  }

  /** Copies an invitee's personal link. */
  async function copyLink(i: InviteeRow) {
    if (!wedding) return;
    try {
      await navigator.clipboard.writeText(inviteUrl(origin, wedding.slug, i.token));
      setCopied(i.id);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      setError("Couldn't copy — your browser blocked clipboard access.");
    }
  }

  /** Toggles day-of check-in; arrivals default to confirmed seats (or 1). */
  async function toggleCheckIn(i: InviteeRow) {
    const checkedIn = !i.checked_in_at;
    const patch = {
      checked_in_at: checkedIn ? new Date().toISOString() : null,
      arrived_count: checkedIn ? Math.max(i.party_size, 1) : 0,
    };
    setInvitees((prev) => prev.map((x) => (x.id === i.id ? { ...x, ...patch } : x)));
    const { error: upErr } = await createClient().from("invitees").update(patch).eq("id", i.id);
    if (upErr) {
      setError("Couldn't update check-in. Please try again.");
      void load();
    }
  }

  /** Adjusts how many people actually arrived with a checked-in guest. */
  async function setArrived(i: InviteeRow, count: number) {
    const arrived_count = Math.min(Math.max(count, 1), 20);
    setInvitees((prev) => prev.map((x) => (x.id === i.id ? { ...x, arrived_count } : x)));
    await createClient().from("invitees").update({ arrived_count }).eq("id", i.id);
  }

  /** Removes a guest from the list. */
  async function remove(i: InviteeRow) {
    if (!window.confirm(`Remove ${i.name} from your guest list? Their personal link will stop working.`)) return;
    setInvitees((prev) => prev.filter((x) => x.id !== i.id));
    const { error: delErr } = await createClient().from("invitees").delete().eq("id", i.id);
    if (delErr) {
      setError("Couldn't remove that guest.");
      void load();
    }
  }

  /** Downloads the guest list (with links and results) as CSV. */
  function exportCsv() {
    if (!wedding) return;
    const blob = new Blob([guestListCsv(invitees, origin, wedding.slug)], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${wedding.slug}-guest-list.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  if (weddingLoading) return <p className="text-sm text-dearly-text-secondary">Loading…</p>;
  if (!wedding) return <p className="text-sm text-dearly-text-secondary">Create your event first, then come back to add guests.</p>;

  const shown = invitees.filter((i) => {
    if (query && !i.name.toLowerCase().includes(query.toLowerCase())) return false;
    if (filter === "checked-in") return !!i.checked_in_at;
    return filter === "all" || i.status === filter;
  });

  const stats = [
    { label: "Invited", value: summary.invited, sub: `${summary.seatsInvited} seats` },
    { label: "Coming", value: summary.attending, sub: `${summary.seatsConfirmed} people` },
    { label: "Can't make it", value: summary.declined, sub: "declined" },
    { label: "No reply yet", value: summary.pending, sub: "pending" },
    { label: "Showed up", value: summary.checkedIn, sub: `${summary.arrived} people arrived` },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-dearly-text">Guest list</h1>
          <p className="mt-1 text-sm text-dearly-text-secondary">
            Paste names to create personal invitations — each guest gets their own link, greeted by name, with their seats reserved.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/rsvps" className="rounded-lg border border-dearly-border px-3 py-2 text-sm font-medium text-dearly-text-secondary hover:bg-dearly-card">
            All RSVPs
          </Link>
          <button
            type="button"
            onClick={exportCsv}
            disabled={invitees.length === 0}
            className="flex items-center gap-1.5 rounded-lg border border-dearly-border px-3 py-2 text-sm font-medium text-dearly-text-secondary hover:bg-dearly-card disabled:opacity-40"
          >
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-dearly-border bg-dearly-card p-4">
            <p className="text-2xl font-bold text-dearly-text">{s.value}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-dearly-text-secondary">{s.label}</p>
            <p className="mt-0.5 text-[11px] text-dearly-text-muted">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Add guests */}
      <div className="rounded-2xl border border-dearly-border bg-dearly-card p-5">
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="guest-paste" className="flex items-center gap-2 text-sm font-semibold text-dearly-text">
            <UserPlus size={16} /> Add guests — one per line
          </label>
          <span className="text-xs text-dearly-text-muted">
            {PLANS_ENABLED ? `${invitees.length}/${plan.maxInvitees} on the ${plan.name} plan` : `${invitees.length} guest${invitees.length === 1 ? "" : "s"}`}
          </span>
        </div>
        <textarea
          id="guest-paste"
          value={paste}
          onChange={(e) => setPaste(e.target.value)}
          rows={5}
          placeholder={"Anna Lee\nMinh Tran +1\nThe Nguyen family, 4"}
          className="w-full rounded-xl border border-dearly-border bg-dearly-cream px-3 py-2.5 font-mono text-sm text-dearly-text outline-none focus:border-dearly-accent focus:ring-2 focus:ring-dearly-accent/20"
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-dearly-text-secondary">
            Tip: <code>+1</code> adds a companion, <code>, 4</code> reserves 4 seats.
            {parsed.length > 0 && <span className="ml-2 font-semibold text-dearly-accent">{parsed.length} guest{parsed.length > 1 ? "s" : ""} ready</span>}
          </p>
          <button
            type="button"
            onClick={addGuests}
            disabled={saving || parsed.length === 0}
            className="rounded-lg bg-dearly-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Creating…" : `Create ${parsed.length || ""} invitation${parsed.length === 1 ? "" : "s"}`}
          </button>
        </div>
      </div>

      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <label className="relative flex items-center">
          <Search size={14} className="absolute left-3 text-dearly-text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a guest"
            className="rounded-full border border-dearly-border bg-dearly-card py-1.5 pl-8 pr-3 text-sm outline-none focus:border-dearly-accent"
          />
        </label>
        {(["all", "attending", "declined", "pending", "checked-in"] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${filter === f ? "bg-dearly-accent text-white" : "border border-dearly-border bg-dearly-card text-dearly-text-secondary"}`}
          >
            {f.replace("-", " ")}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="h-32 animate-pulse rounded-xl bg-dearly-border" />
      ) : shown.length === 0 ? (
        <p className="rounded-xl border border-dashed border-dearly-border p-8 text-center text-sm text-dearly-text-secondary">
          <Users className="mx-auto mb-2" size={22} />
          {invitees.length === 0 ? "No guests yet — paste your list above to create personal invitations." : "No guests match this filter."}
        </p>
      ) : (
        <ul className="divide-y divide-dearly-border overflow-hidden rounded-xl border border-dearly-border bg-dearly-card">
          {shown.map((i) => {
            const link = inviteUrl(origin, wedding.slug, i.token);
            const wa = `https://wa.me/?text=${encodeURIComponent(`Hi ${i.name}! You're invited: ${link}`)}`;
            return (
              <li key={i.id} className="flex flex-wrap items-center gap-3 p-3 sm:flex-nowrap">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-dearly-text">{i.name}</p>
                  <p className="text-xs text-dearly-text-muted">
                    {i.max_party_size > 1 ? `${i.max_party_size} seats (with ${i.max_party_size - 1} companion${i.max_party_size > 2 ? "s" : ""})` : "1 seat"}
                    {i.status === "attending" && ` · coming with ${Math.max(i.party_size - 1, 0)} companion${i.party_size - 1 === 1 ? "" : "s"}`}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLE[i.status]}`}>
                  {i.status === "attending" ? `Coming · ${i.party_size}` : i.status === "declined" ? "Can't make it" : "No reply"}
                </span>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => toggleCheckIn(i)}
                    title={i.checked_in_at ? "Undo check-in" : "Check in (showed up)"}
                    aria-pressed={!!i.checked_in_at}
                    className={`flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold ${i.checked_in_at ? "bg-green-600 text-white" : "border border-dearly-border text-dearly-text-secondary hover:bg-dearly-cream"}`}
                  >
                    <UserCheck size={14} /> {i.checked_in_at ? "Arrived" : "Check in"}
                  </button>
                  {i.checked_in_at && (
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={i.arrived_count}
                      onChange={(e) => setArrived(i, Number(e.target.value))}
                      aria-label={`People who arrived with ${i.name}`}
                      className="w-14 rounded-lg border border-dearly-border px-2 py-1 text-xs"
                    />
                  )}
                  <button type="button" onClick={() => copyLink(i)} title="Copy personal link" className="rounded-lg p-2 text-dearly-text-secondary hover:bg-dearly-cream">
                    {copied === i.id ? <Check size={15} className="text-green-600" /> : <Copy size={15} />}
                  </button>
                  <a href={wa} target="_blank" rel="noopener noreferrer" title="Send on WhatsApp" className="rounded-lg p-2 text-dearly-text-secondary hover:bg-dearly-cream">
                    <MessageCircle size={15} />
                  </a>
                  <button type="button" onClick={() => remove(i)} title="Remove guest" className="rounded-lg p-2 text-dearly-text-muted hover:bg-red-50 hover:text-red-600">
                    <Trash2 size={15} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

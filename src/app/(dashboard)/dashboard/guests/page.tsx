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
import { Check, Copy, Download, Mail, MessageCircle, QrCode, Search, Trash2, Upload, UserCheck, UserPlus, Users } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { createClient } from "@/lib/supabase/client";
import { useMyWedding } from "@/hooks/useWedding";
import { guestListCsv, inviteUrl, parseGuestList, summarizeGuestList } from "@/lib/guest-list";
import HelpTip from "@/components/dashboard/HelpTip";
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
  const [groupInput, setGroupInput] = useState("");
  const [groupFilter, setGroupFilter] = useState<string | null>(null);
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
  const groups = useMemo(() => {
    const set = new Set<string>();
    invitees.forEach((i) => { if (i.guest_group) set.add(i.guest_group); });
    return Array.from(set).sort();
  }, [invitees]);

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
      .insert(fresh.map((p) => ({ wedding_id: wedding.id, name: p.name, max_party_size: p.maxPartySize, guest_group: groupInput.trim() || null })))
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

  /** Downloads a QR code PNG for the guest's personal invitation link. */
  function downloadQr(i: InviteeRow) {
    if (!wedding) return;
    const canvas = document.getElementById(`qr-${i.id}`) as HTMLCanvasElement | null;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `${i.name.replace(/\s+/g, "-").toLowerCase()}-qr.png`;
    a.click();
  }

  /** Opens the user's email client with a pre-filled invitation email. */
  function emailLink(i: InviteeRow) {
    if (!wedding) return;
    const link = inviteUrl(origin, wedding.slug, i.token);
    const subject = encodeURIComponent(`You're invited — ${wedding.partner1_name}${wedding.partner2_name ? ` & ${wedding.partner2_name}` : ""}`);
    const body = encodeURIComponent(`Hi ${i.name},\n\nYou're invited! Open your personal invitation here:\n${link}\n\nWe hope to see you there.`);
    window.open(`mailto:?subject=${subject}&body=${body}`, "_self");
  }

  /** Parses a CSV file into guest entries. */
  async function handleCsvImport(file: File) {
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    // Skip header if first line looks like column names.
    const start = /^name/i.test(lines[0]) ? 1 : 0;
    const names: string[] = [];
    for (let idx = start; idx < lines.length; idx++) {
      const cols = lines[idx].split(",");
      const name = cols[0]?.trim();
      if (name) names.push(cols.length > 1 ? `${name}, ${cols[1].trim()}` : name);
    }
    if (names.length > 0) setPaste(names.join("\n"));
  }

  /** Marks or unmarks an invitation as sent. */
  async function toggleInvited(i: InviteeRow) {
    const invited = !i.invited_at;
    const patch = { invited_at: invited ? new Date().toISOString() : null };
    setInvitees((prev) => prev.map((x) => (x.id === i.id ? { ...x, ...patch } : x)));
    const { error: upErr } = await createClient().from("invitees").update(patch).eq("id", i.id);
    if (upErr) {
      setError("Couldn't update invitation status. Please try again.");
      void load();
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
    if (groupFilter && i.guest_group !== groupFilter) return false;
    if (filter === "checked-in") return !!i.checked_in_at;
    return filter === "all" || i.status === filter;
  });

  const stats = [
    { label: "Invited", value: summary.invited, sub: `${summary.seatsInvited} seats` },
    { label: "Sent", value: summary.sent, sub: `${summary.invited - summary.sent} not sent` },
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
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
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
          <div className="flex items-center gap-2">
            <label htmlFor="guest-paste" className="flex items-center gap-2 text-sm font-semibold text-dearly-text">
              <UserPlus size={16} /> Add guests — one per line
            </label>
            <HelpTip label="Adding guests" guide="guest-list">
              Use +1 for a companion, or a comma and number for seats: “The Nguyen family, 4”.
              Each line gets its own personal link.
            </HelpTip>
          </div>
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
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-dearly-text-secondary">
            <Users size={14} />
            <input
              value={groupInput}
              onChange={(e) => setGroupInput(e.target.value)}
              placeholder="Group (e.g. Family, Colleagues)"
              list="guest-groups"
              className="rounded-lg border border-dearly-border bg-dearly-cream px-2.5 py-1.5 text-sm text-dearly-text outline-none focus:border-dearly-accent"
            />
            <datalist id="guest-groups">
              {groups.map((g) => <option key={g} value={g} />)}
            </datalist>
          </label>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs text-dearly-text-secondary">
              Tip: <code>+1</code> adds a companion, <code>, 4</code> reserves 4 seats.
              {parsed.length > 0 && <span className="ml-2 font-semibold text-dearly-accent">{parsed.length} guest{parsed.length > 1 ? "s" : ""} ready</span>}
            </p>
            <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-dearly-border px-2.5 py-1.5 text-xs font-medium text-dearly-text-secondary hover:bg-dearly-cream">
              <Upload size={13} /> Import CSV
              <input type="file" accept=".csv,.txt" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCsvImport(f); e.target.value = ""; }} />
            </label>
          </div>
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
        {groups.length > 0 && (
          <>
            <span className="mx-1 text-dearly-border">|</span>
            <button
              type="button"
              onClick={() => setGroupFilter(null)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${!groupFilter ? "bg-dearly-accent text-white" : "border border-dearly-border bg-dearly-card text-dearly-text-secondary"}`}
            >
              All groups
            </button>
            {groups.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGroupFilter(g)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${groupFilter === g ? "bg-dearly-accent text-white" : "border border-dearly-border bg-dearly-card text-dearly-text-secondary"}`}
              >
                {g}
              </button>
            ))}
          </>
        )}
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
              <li key={i.id} className="space-y-2 p-3 sm:flex sm:flex-nowrap sm:items-center sm:gap-3 sm:space-y-0">
                {/* Row 1 (mobile) / Left column: name + seats */}
                <div className="flex items-start justify-between gap-2 sm:min-w-0 sm:flex-1">
                  <div className="min-w-0">
                    <p className="font-medium text-dearly-text">
                      {i.name}
                      {i.guest_group && <span className="ml-2 rounded-full bg-dearly-cream px-2 py-0.5 text-[10px] font-medium text-dearly-text-secondary">{i.guest_group}</span>}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-dearly-text-muted">
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={i.max_party_size}
                        onChange={async (e) => {
                          const v = Math.min(Math.max(Number(e.target.value) || 1, 1), 20);
                          setInvitees((prev) => prev.map((x) => (x.id === i.id ? { ...x, max_party_size: v } : x)));
                          await createClient().from("invitees").update({ max_party_size: v }).eq("id", i.id);
                        }}
                        className="w-12 rounded border border-dearly-border bg-dearly-cream px-1.5 py-0.5 text-center text-xs text-dearly-text tabular-nums focus:outline-none focus:ring-1 focus:ring-dearly-accent"
                        title="Max party size"
                      />
                      <span>seats</span>
                      {i.status === "attending" && <span>· {i.party_size} coming</span>}
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium sm:hidden ${STATUS_STYLE[i.status]}`}>
                    {i.status === "attending" ? `Coming · ${i.party_size}` : i.status === "declined" ? "Declined" : "No reply"}
                  </span>
                </div>
                {/* Desktop-only status badge */}
                <span className={`hidden shrink-0 rounded-full px-2.5 py-1 text-xs font-medium sm:inline-flex ${STATUS_STYLE[i.status]}`}>
                  {i.status === "attending" ? `Coming · ${i.party_size}` : i.status === "declined" ? "Can't make it" : "No reply"}
                </span>
                {/* Row 2 (mobile) / Right column: actions */}
                <div className="flex flex-wrap items-center gap-1">
                  <button
                    type="button"
                    onClick={() => toggleInvited(i)}
                    title={i.invited_at ? "Mark as not sent" : "Mark invitation as sent"}
                    aria-pressed={!!i.invited_at}
                    className={`flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold ${i.invited_at ? "bg-blue-600 text-white" : "border border-dearly-border text-dearly-text-secondary hover:bg-dearly-cream"}`}
                  >
                    <Mail size={14} /> {i.invited_at ? "Sent" : "Not sent"}
                  </button>
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
                  <button type="button" onClick={() => emailLink(i)} title="Send via email" className="rounded-lg p-2 text-dearly-text-secondary hover:bg-dearly-cream">
                    <Mail size={15} />
                  </button>
                  <button type="button" onClick={() => downloadQr(i)} title="Download QR code" className="rounded-lg p-2 text-dearly-text-secondary hover:bg-dearly-cream">
                    <QrCode size={15} />
                  </button>
                  {/* Hidden QR canvas for download */}
                  <QRCodeCanvas id={`qr-${i.id}`} value={link} size={512} className="hidden" />
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

"use client";

/**
 * Settings page — manage wedding slug, publish state, guest upload toggle,
 * and background music (library track or custom URL).
 * Uses useMyWedding for data fetching and saving.
 */

import { useEffect, useState } from "react";
import { useMyWedding } from "@/hooks/useWedding";
import MusicPicker from "@/components/dashboard/editor/MusicPicker";
import EmailSettings from "@/components/dashboard/settings/EmailSettings";
import HelpTip from "@/components/dashboard/HelpTip";
import { isReservedSlug } from "@/lib/reserved-slugs";

/**
 * Validates a slug: lowercase alphanumeric with hyphens, 3-60 chars, not a reserved app route.
 */
function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]{3,60}$/.test(slug) && !isReservedSlug(slug);
}

/**
 * Dashboard settings page.
 */
export default function SettingsPage() {
  const { wedding, loading, saveWedding } = useMyWedding();

  const [slug, setSlug] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [guestUploadsEnabled, setGuestUploadsEnabled] = useState(false);
  const [timezone, setTimezone] = useState("");
  const [musicTrackId, setMusicTrackId] = useState<string | null>(null);
  const [musicUrl, setMusicUrl] = useState("");
  const [reminderDays, setReminderDays] = useState<number[]>([7]);
  const [weeklyDigestEnabled, setWeeklyDigestEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Populates local state from wedding data once loaded. */
  useEffect(() => {
    if (!wedding) return;
    setSlug(wedding.slug ?? "");
    setIsPublished(wedding.is_published ?? false);
    setGuestUploadsEnabled(wedding.guest_uploads_enabled ?? false);
    setTimezone(wedding.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone);
    setMusicTrackId(wedding.music_track_id ?? null);
    setMusicUrl(wedding.music_url ?? "");
    setReminderDays(wedding.reminder_days ?? [7]);
    setWeeklyDigestEnabled(wedding.weekly_digest_enabled ?? true);
  }, [wedding]);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <p className="text-sm text-dearly-text-secondary">Loading…</p>
      </div>
    );
  }

  if (!wedding) {
    return (
      <p className="text-sm text-dearly-text-secondary">
        No event found. Set one up in the Editor first.
      </p>
    );
  }

  const slugValid = isValidSlug(slug);

  /**
   * Saves settings to Supabase.
   * music_track_id takes priority; if a track is selected the custom URL is cleared.
   */
  async function handleSave() {
    if (!slugValid) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await saveWedding({
        slug,
        is_published: isPublished,
        guest_uploads_enabled: guestUploadsEnabled,
        timezone: timezone || null,
        music_track_id: musicTrackId,
        music_url: musicTrackId ? null : (musicUrl.trim() || null),
        reminder_days: reminderDays,
        weekly_digest_enabled: weeklyDigestEnabled,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-dearly-text">Settings</h1>
        <p className="mt-1 text-sm text-dearly-text-secondary">
          Configure your event page URL and visibility.
        </p>
      </div>

      <div className="space-y-6 rounded-xl border border-dearly-border bg-dearly-card p-6">
        {/* Slug */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <label className="text-sm font-medium text-dearly-text">Event URL Slug</label>
            <HelpTip label="Event URL slug" guide="publish-and-share">
              3–60 lowercase letters, numbers or hyphens. Old links stop working after a change.
            </HelpTip>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-dearly-border bg-dearly-cream px-3 py-2">
            <span className="text-sm text-dearly-text-secondary">dearly.app/</span>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase())}
              placeholder="alex-and-jordan"
              className="flex-1 bg-transparent text-sm text-dearly-text focus:outline-none"
            />
          </div>
          {slug.length > 0 && !slugValid && (
            <p className="text-xs text-red-500">
              {isReservedSlug(slug)
                ? "That address is used by a Dearly page. Try adding your names or a date."
                : "Slug must be 3-60 lowercase letters, numbers, or hyphens."}
            </p>
          )}
          {slugValid && (
            <p className="text-xs text-green-600">
              Your site will be at{" "}
              <span className="font-medium">dearly.app/{slug}</span>
            </p>
          )}
        </div>

        {/* Publish toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="flex items-center gap-1.5 text-sm font-medium text-dearly-text">
              Published
              <HelpTip label="Published" guide="publish-and-share">
                Drafts stay private. Preview still works while the page is unpublished.
              </HelpTip>
            </p>
            <p className="text-xs text-dearly-text-secondary">
              Make your event page visible to guests.
            </p>
          </div>
          <button
            role="switch"
            aria-checked={isPublished}
            onClick={() => setIsPublished((v) => !v)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              isPublished ? "bg-dearly-accent" : "bg-dearly-border"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                isPublished ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Share preview link */}
        {!isPublished && (
          <div className="rounded-xl border border-dashed border-dearly-border bg-dearly-cream/50 p-4">
            <p className="text-sm font-medium text-dearly-text">Share a preview</p>
            <p className="mt-1 text-xs text-dearly-text-secondary">
              Your invitation isn&apos;t published yet. Share this link with your partner to review the draft:
            </p>
            <div className="mt-2 flex items-center gap-2">
              <code className="flex-1 truncate rounded-lg bg-dearly-card px-3 py-2 text-xs text-dearly-text-secondary">
                {typeof window !== "undefined" ? `${window.location.origin}/${wedding.slug}?preview=${wedding.id}` : `/${wedding.slug}?preview=...`}
              </code>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/${wedding.slug}?preview=${wedding.id}`);
                }}
                className="shrink-0 rounded-lg border border-dearly-border px-3 py-2 text-xs font-medium text-dearly-text-secondary hover:bg-dearly-card"
              >
                Copy
              </button>
            </div>
          </div>
        )}

        {/* Guest uploads toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="flex items-center gap-1.5 text-sm font-medium text-dearly-text">
              Guest Photo Uploads
              <HelpTip label="Guest photo uploads" guide="photos-and-memories">
                Adds Share your photos to the Moments section. You approve every upload before it appears.
              </HelpTip>
            </p>
            <p className="text-xs text-dearly-text-secondary">
              Allow guests to submit photos to your gallery.
            </p>
          </div>
          <button
            role="switch"
            aria-checked={guestUploadsEnabled}
            onClick={() => setGuestUploadsEnabled((v) => !v)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              guestUploadsEnabled ? "bg-dearly-accent" : "bg-dearly-border"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                guestUploadsEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Event Timezone */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <label className="text-sm font-medium text-dearly-text">Event Timezone</label>
            <HelpTip label="Event timezone" guide="content-story-venue-schedule">
              Schedule times display in this timezone for every guest.
            </HelpTip>
          </div>
          <p className="text-xs text-dearly-text-secondary">
            Schedule times on your invitation display in this timezone.
          </p>
          <input
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            placeholder="Asia/Ho_Chi_Minh"
            className="w-full rounded-lg border border-dearly-border bg-dearly-cream px-3 py-2 text-sm text-dearly-text focus:outline-none"
          />
        </div>

        {/* Background Music */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <label className="text-sm font-medium text-dearly-text">Background Music</label>
            <HelpTip label="Background music" guide="background-music">
              Music waits for the guest&apos;s first tap. A library track and a custom URL cannot both be active.
            </HelpTip>
          </div>
          <MusicPicker
            selectedTrackId={musicTrackId}
            customUrl={musicUrl}
            weddingId={wedding.id}
            onSelectTrack={(id) => {
              setMusicTrackId(id);
              // Clear custom URL when a library track is chosen.
              if (id) setMusicUrl("");
            }}
            onCustomUrl={(url) => {
              setMusicUrl(url);
              // Clear track selection when a custom URL is entered.
              if (url) setMusicTrackId(null);
            }}
          />
        </div>

        {/* Error */}
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
        )}

        {/* Save button */}
        <div className="flex items-center justify-end gap-3">
          {saved && (
            <p className="text-xs text-green-600">Settings saved.</p>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !slugValid}
            className="rounded-lg bg-dearly-accent px-5 py-2 text-sm font-medium text-white transition hover:bg-dearly-accent/90 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Settings"}
          </button>
        </div>
      </div>

      {/* Email Automation */}
      <div>
        <h2 className="mb-1 text-lg font-semibold text-dearly-text">Email Automation</h2>
        <p className="mb-4 text-sm text-dearly-text-secondary">
          Control when automated emails are sent to your guests and to you.
        </p>
        <EmailSettings
          reminderDays={reminderDays}
          weeklyDigestEnabled={weeklyDigestEnabled}
          onUpdateReminders={setReminderDays}
          onUpdateDigest={setWeeklyDigestEnabled}
        />
        <div className="mt-4 flex items-center justify-end gap-3">
          {saved && (
            <p className="text-xs text-green-600">Settings saved.</p>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !slugValid}
            className="rounded-lg bg-dearly-accent px-5 py-2 text-sm font-medium text-white transition hover:bg-dearly-accent/90 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}

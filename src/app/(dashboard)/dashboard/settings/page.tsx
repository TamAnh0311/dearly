"use client";

/**
 * Settings page — manage wedding slug, publish state, guest upload toggle,
 * and background music (library track or custom URL).
 * Uses useMyWedding for data fetching and saving.
 */

import { useEffect, useState } from "react";
import { useMyWedding } from "@/hooks/useWedding";
import MusicPicker from "@/components/dashboard/editor/MusicPicker";

/**
 * Validates a slug: lowercase alphanumeric with hyphens, 3-60 chars.
 */
function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]{3,60}$/.test(slug);
}

/**
 * Dashboard settings page.
 */
export default function SettingsPage() {
  const { wedding, loading, saveWedding } = useMyWedding();

  const [slug, setSlug] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [guestUploadsEnabled, setGuestUploadsEnabled] = useState(false);
  const [musicTrackId, setMusicTrackId] = useState<string | null>(null);
  const [musicUrl, setMusicUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Populates local state from wedding data once loaded. */
  useEffect(() => {
    if (!wedding) return;
    setSlug(wedding.slug ?? "");
    setIsPublished(wedding.is_published ?? false);
    setGuestUploadsEnabled(wedding.guest_uploads_enabled ?? false);
    setMusicTrackId(wedding.music_track_id ?? null);
    setMusicUrl(wedding.music_url ?? "");
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
        No wedding found. Set one up in the Editor first.
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
        music_track_id: musicTrackId,
        music_url: musicTrackId ? null : (musicUrl.trim() || null),
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
          Configure your wedding site URL and visibility.
        </p>
      </div>

      <div className="space-y-6 rounded-xl border border-dearly-border bg-dearly-card p-6">
        {/* Slug */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-dearly-text">
            Wedding URL Slug
          </label>
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
              Slug must be 3-60 lowercase letters, numbers, or hyphens.
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
            <p className="text-sm font-medium text-dearly-text">Published</p>
            <p className="text-xs text-dearly-text-secondary">
              Make your wedding site visible to guests.
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

        {/* Guest uploads toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-dearly-text">Guest Photo Uploads</p>
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

        {/* Background Music */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-dearly-text">
            Background Music
          </label>
          <MusicPicker
            selectedTrackId={musicTrackId}
            customUrl={musicUrl}
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
    </div>
  );
}

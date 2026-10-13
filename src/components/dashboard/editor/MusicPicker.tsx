"use client";

/**
 * MusicPicker — two-tab component for selecting background music.
 * "Library" tab lets users choose from curated royalty-free tracks.
 * "Custom URL" tab accepts a direct MP3 link.
 */

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { MusicTrackRow } from "@/types/database";
import { Music2, Play, Square, Star } from "lucide-react";

type Genre = MusicTrackRow["genre"] | "all";

interface MusicPickerProps {
  /** Currently selected library track ID, or null if none / using custom URL. */
  selectedTrackId: string | null;
  /** Current custom music URL value. */
  customUrl: string;
  /** Called when a library track is selected or deselected (null to deselect). */
  onSelectTrack: (trackId: string | null) => void;
  /** Called when the custom URL input changes. */
  onCustomUrl: (url: string) => void;
}

type Tab = "library" | "custom";

const GENRES: { value: Genre; label: string }[] = [
  { value: "all", label: "All" },
  { value: "piano", label: "Piano" },
  { value: "acoustic", label: "Acoustic" },
  { value: "orchestral", label: "Orchestral" },
  { value: "ambient", label: "Ambient" },
  { value: "romantic", label: "Romantic" },
];

/**
 * Formats a duration in seconds to M:SS string.
 */
function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Inline audio preview player for a single track.
 * Creates / destroys an Audio element on mount/unmount.
 */
function TrackPreview({ url }: { url: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio(url);
    audio.loop = false;
    audioRef.current = audio;
    audio.addEventListener("ended", () => setPlaying(false));
    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [url]);

  /**
   * Toggles preview playback.
   */
  function handleToggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      audio.currentTime = 0;
      setPlaying(false);
    } else {
      audio.play().catch(() => {
        // Ignore autoplay policy errors silently.
      });
      setPlaying(true);
    }
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleToggle();
      }}
      aria-label={playing ? "Stop preview" : "Play preview"}
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-dearly-border bg-dearly-cream text-dearly-text-secondary transition hover:bg-dearly-accent hover:text-white"
    >
      {playing ? <Square size={12} /> : <Play size={12} />}
    </button>
  );
}

/**
 * Genre badge pill.
 */
function GenreBadge({ genre }: { genre: MusicTrackRow["genre"] }) {
  return (
    <span className="rounded-full bg-dearly-cream px-2 py-0.5 text-xs capitalize text-dearly-text-secondary">
      {genre}
    </span>
  );
}

/**
 * MusicPicker with Library and Custom URL tabs.
 */
export default function MusicPicker({
  selectedTrackId,
  customUrl,
  onSelectTrack,
  onCustomUrl,
}: MusicPickerProps) {
  const [tab, setTab] = useState<Tab>("library");
  const [tracks, setTracks] = useState<MusicTrackRow[]>([]);
  const [loadingTracks, setLoadingTracks] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [genreFilter, setGenreFilter] = useState<Genre>("all");

  /** Fetches all tracks from Supabase on mount. */
  useEffect(() => {
    async function fetchTracks() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("music_tracks")
        .select("*")
        .order("is_featured", { ascending: false })
        .order("name", { ascending: true });

      if (error) {
        setFetchError(error.message);
      } else {
        setTracks((data as MusicTrackRow[]) ?? []);
      }
      setLoadingTracks(false);
    }
    fetchTracks();
  }, []);

  const visibleTracks =
    genreFilter === "all"
      ? tracks
      : tracks.filter((t) => t.genre === genreFilter);

  return (
    <div className="space-y-3">
      {/* Tab switcher */}
      <div className="flex rounded-lg border border-dearly-border bg-dearly-cream p-1 text-sm">
        {(["library", "custom"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-md py-1.5 capitalize transition ${
              tab === t
                ? "bg-white font-medium text-dearly-text shadow-sm"
                : "text-dearly-text-secondary hover:text-dearly-text"
            }`}
          >
            {t === "library" ? "Library" : "Custom URL"}
          </button>
        ))}
      </div>

      {/* Library tab */}
      {tab === "library" && (
        <div className="space-y-3">
          {/* Genre filter */}
          <div className="flex flex-wrap gap-1.5">
            {GENRES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setGenreFilter(value)}
                className={`rounded-full px-3 py-1 text-xs transition ${
                  genreFilter === value
                    ? "bg-dearly-accent text-white"
                    : "border border-dearly-border bg-dearly-cream text-dearly-text-secondary hover:bg-dearly-border"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Track list */}
          {loadingTracks && (
            <p className="py-4 text-center text-xs text-dearly-text-secondary">
              Loading tracks…
            </p>
          )}
          {fetchError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
              {fetchError}
            </p>
          )}
          {!loadingTracks && !fetchError && visibleTracks.length === 0 && (
            <p className="py-4 text-center text-xs text-dearly-text-secondary">
              No tracks in this genre yet.
            </p>
          )}

          <div className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
            {visibleTracks.map((track) => {
              const isSelected = track.id === selectedTrackId;
              return (
                <button
                  key={track.id}
                  onClick={() => onSelectTrack(isSelected ? null : track.id)}
                  className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition ${
                    isSelected
                      ? "border-dearly-accent bg-dearly-accent/10"
                      : "border-dearly-border bg-dearly-card hover:bg-dearly-cream"
                  }`}
                >
                  {/* Play preview */}
                  <TrackPreview url={track.url} />

                  {/* Track info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-sm font-medium text-dearly-text">
                        {track.name}
                      </span>
                      {track.is_featured && (
                        <Star
                          size={11}
                          className="shrink-0 text-amber-400"
                          fill="currentColor"
                          aria-label="Featured"
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="text-xs text-dearly-text-secondary">
                        {track.artist}
                      </span>
                      <GenreBadge genre={track.genre} />
                    </div>
                  </div>

                  {/* Duration */}
                  <span className="shrink-0 font-mono text-xs text-dearly-text-secondary">
                    {formatDuration(track.duration_seconds)}
                  </span>

                  {/* Selected indicator */}
                  {isSelected && (
                    <Music2 size={14} className="shrink-0 text-dearly-accent" />
                  )}
                </button>
              );
            })}
          </div>

          {selectedTrackId && (
            <button
              onClick={() => onSelectTrack(null)}
              className="text-xs text-dearly-text-secondary underline underline-offset-2 hover:text-dearly-text"
            >
              Remove selection
            </button>
          )}
        </div>
      )}

      {/* Custom URL tab */}
      {tab === "custom" && (
        <div className="space-y-2">
          <input
            type="url"
            value={customUrl}
            onChange={(e) => onCustomUrl(e.target.value)}
            placeholder="https://example.com/music.mp3"
            className="w-full rounded-lg border border-dearly-border bg-dearly-cream px-3 py-2 text-sm text-dearly-text placeholder:text-dearly-text-muted focus:outline-none focus:ring-2 focus:ring-dearly-accent/40"
          />
          <p className="text-xs text-dearly-text-secondary">
            Paste a link to an MP3 file. Leave blank to disable ambient music.
          </p>
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
            You are responsible for ensuring you have the rights to use custom music.
          </p>
        </div>
      )}
    </div>
  );
}

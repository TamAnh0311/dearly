"use client";

/**
 * MusicPicker — two-tab component for selecting background music.
 * "Library" tab lets users choose from curated royalty-free tracks.
 * "Custom URL" tab accepts a direct MP3 link.
 */

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { MusicTrackRow } from "@/types/database";
import { Music2, Play, Square, Star, Upload, AlertTriangle } from "lucide-react";
import { createAmbientMusic, toMusicPreset } from "@/lib/ambient-music";
import { uploadMusic } from "@/lib/supabase/storage";

type Genre = MusicTrackRow["genre"] | "all";

interface MusicPickerProps {
  /** Currently selected library track ID, or null if none / using custom URL. */
  selectedTrackId: string | null;
  /** Current custom music URL value. */
  customUrl: string;
  /** Wedding ID for file uploads. */
  weddingId?: string;
  /** Called when a library track is selected or deselected (null to deselect). */
  onSelectTrack: (trackId: string | null) => void;
  /** Called when the custom URL input changes. */
  onCustomUrl: (url: string) => void;
}

type Tab = "library" | "upload" | "custom";

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
 * Inline preview for a library track. Bundled `/music/*` tracks have no audio
 * file, so they preview as the generative piece for their genre (the same
 * music guests will hear); external URLs play as files.
 */
function TrackPreview({ url, genre }: { url: string; genre: string }) {
  const engineRef = useRef<{ start: () => Promise<void>; stop: () => void } | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (url.startsWith("/music/")) {
      engineRef.current = createAmbientMusic(toMusicPreset(genre), 0.45);
    } else {
      const audio = new Audio(url);
      audio.addEventListener("ended", () => setPlaying(false));
      engineRef.current = {
        start: () => audio.play(),
        stop: () => {
          audio.pause();
          audio.currentTime = 0;
        },
      };
    }
    return () => {
      engineRef.current?.stop();
      engineRef.current = null;
    };
  }, [url, genre]);

  /** Toggles preview playback. */
  function handleToggle() {
    const engine = engineRef.current;
    if (!engine) return;
    if (playing) {
      engine.stop();
      setPlaying(false);
    } else {
      engine.start().then(
        () => setPlaying(true),
        () => setPlaying(false)
      );
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
  weddingId,
  onSelectTrack,
  onCustomUrl,
}: MusicPickerProps) {
  const [tab, setTab] = useState<Tab>("library");
  const [tracks, setTracks] = useState<MusicTrackRow[]>([]);
  const [loadingTracks, setLoadingTracks] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [genreFilter, setGenreFilter] = useState<Genre>("all");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        {(["library", "upload", "custom"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-md py-1.5 capitalize transition ${
              tab === t
                ? "bg-white font-medium text-dearly-text shadow-sm"
                : "text-dearly-text-secondary hover:text-dearly-text"
            }`}
          >
            {t === "library" ? "Library" : t === "upload" ? "Upload" : "Custom URL"}
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
                  <TrackPreview url={track.url} genre={track.genre} />

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

      {/* Upload tab */}
      {tab === "upload" && (
        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,video/mp4"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file || !weddingId) return;
              setUploading(true);
              setUploadError(null);
              try {
                const url = await uploadMusic(weddingId, file);
                onCustomUrl(url);
                onSelectTrack(null);
              } catch (err) {
                setUploadError(err instanceof Error ? err.message : "Upload failed");
              } finally {
                setUploading(false);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || !weddingId}
            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-dearly-border bg-dearly-cream px-4 py-6 text-sm text-dearly-text-secondary transition hover:border-dearly-accent hover:text-dearly-text disabled:opacity-50"
          >
            <Upload size={18} />
            {uploading ? "Uploading…" : "Choose an audio file (max 15 MB)"}
          </button>
          {uploadError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{uploadError}</p>
          )}
          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5">
            <AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber-600" />
            <p className="text-xs leading-relaxed text-amber-700">
              <strong>Copyright notice:</strong> By uploading music you confirm that you own the
              rights or have a valid licence to use it. Dearly is not responsible for
              any copyright claims arising from user-uploaded content.
            </p>
          </div>
          <p className="text-xs text-dearly-text-secondary">
            Supported formats: MP3, MP4, WAV, OGG, AAC.
          </p>
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

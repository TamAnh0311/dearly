"use client";

/**
 * MusicPlayer — background music for invitation pages.
 *
 * - Plays an audio file (`musicUrl`) or, when there is no file / it fails to
 *   load, a generative ambient piece (`preset`) rendered with Web Audio.
 * - Browsers block autoplay, so music starts on the guest's first tap, click
 *   or key press anywhere on the page. A "Tap anywhere for music" pill makes
 *   that obvious for the first few seconds.
 * - A floating button toggles play/pause; a guest who pauses is remembered
 *   (localStorage `dearly-music`) and won't be auto-started again.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Music2 } from "lucide-react";
import { createAmbientMusic, type AmbientMusic, type MusicPreset } from "@/lib/ambient-music";
import { useInvitationCopy } from "@/components/invitation/sections/HeroParts";

interface MusicPlayerProps {
  /** Audio file URL. Optional — falls back to `preset`. */
  musicUrl?: string | null;
  /** Generative preset used when there is no file or it fails to load. */
  preset?: MusicPreset | null;
  theme: { colors: { primary: string; secondary: string; accent: string } };
}

const PREF_KEY = "dearly-music";

/** True unless the guest previously paused the music. */
function wantsMusic(): boolean {
  try {
    return window.localStorage.getItem(PREF_KEY) !== "off";
  } catch {
    return true;
  }
}

/** Remembers the guest's play/pause choice (non-fatal if storage is blocked). */
function rememberMusic(on: boolean) {
  try {
    window.localStorage.setItem(PREF_KEY, on ? "on" : "off");
  } catch {
    /* ignore */
  }
}

/** Common interface over an <audio> element and the generative engine. */
interface Engine {
  start(): Promise<void>;
  stop(): void;
}

/** Wraps an HTMLAudioElement with fade in/out. Rejects if the file can't play. */
function fileEngine(url: string): Engine {
  const audio = new Audio(url);
  audio.loop = true;
  audio.volume = 0;
  let fade: ReturnType<typeof setInterval> | null = null;
  const ramp = (to: number, done?: () => void) => {
    if (fade) clearInterval(fade);
    fade = setInterval(() => {
      const next = audio.volume + (to > audio.volume ? 0.05 : -0.05);
      audio.volume = Math.min(1, Math.max(0, next));
      if ((to > 0 && audio.volume >= to) || (to === 0 && audio.volume <= 0)) {
        if (fade) clearInterval(fade);
        done?.();
      }
    }, 40);
  };
  return {
    async start() {
      await audio.play();
      ramp(0.8);
    },
    stop() {
      ramp(0, () => audio.pause());
    },
  };
}

/** Adapts the generative engine to the Engine interface. */
function generativeEngine(preset: MusicPreset): Engine {
  const m: AmbientMusic = createAmbientMusic(preset);
  return { start: () => m.start(), stop: () => m.stop() };
}

export default function MusicPlayer({ musicUrl, preset, theme }: MusicPlayerProps) {
  const ui = useInvitationCopy();
  const engineRef = useRef<Engine | null>(null);
  const [playing, setPlaying] = useState(false);
  const [hint, setHint] = useState(false);
  const available = Boolean(musicUrl || preset);

  /** Starts playback, falling back from file to generative music on failure. */
  const play = useCallback(async () => {
    try {
      if (!engineRef.current) engineRef.current = musicUrl ? fileEngine(musicUrl) : generativeEngine(preset ?? "piano");
      await engineRef.current.start();
      setPlaying(true);
    } catch {
      if (musicUrl && preset !== null) {
        // File missing or blocked — switch to the generative piece.
        engineRef.current = generativeEngine(preset ?? "piano");
        try {
          await engineRef.current.start();
          setPlaying(true);
        } catch {
          console.warn("[WARNING] background music could not start");
        }
      }
    }
    setHint(false);
  }, [musicUrl, preset]);

  /** Pauses playback. */
  const pause = useCallback(() => {
    engineRef.current?.stop();
    setPlaying(false);
  }, []);

  // Start on the first user gesture anywhere (autoplay policy), unless the guest opted out.
  useEffect(() => {
    if (!available || !wantsMusic()) return;
    setHint(true);
    const hideHint = setTimeout(() => setHint(false), 9000);
    const onGesture = (e: Event) => {
      // The music button handles its own clicks (avoids a double start).
      if ((e.target as Element | null)?.closest?.("[data-music-button]")) return;
      remove();
      void play();
    };
    const remove = () => {
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
    };
    window.addEventListener("pointerdown", onGesture);
    window.addEventListener("keydown", onGesture);
    return () => {
      clearTimeout(hideHint);
      remove();
    };
  }, [available, play]);

  // Stop music when leaving the page.
  useEffect(() => () => engineRef.current?.stop(), []);

  if (!available) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
      <AnimatePresence>
        {hint && !playing && (
          <motion.span
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            className="rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] shadow-lg backdrop-blur-md"
            style={{ background: `${theme.colors.secondary}e6`, color: theme.colors.primary, border: `1px solid ${theme.colors.primary}40` }}
          >
            {ui.music.tap}
          </motion.span>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (playing) {
            pause();
            rememberMusic(false);
          } else {
            rememberMusic(true);
            void play();
          }
        }}
        data-music-button
        aria-label={playing ? ui.music.pause : ui.music.play}
        aria-pressed={playing}
        className="relative flex h-12 w-12 items-center justify-center rounded-full shadow-xl transition hover:scale-105"
        style={{ backgroundColor: theme.colors.primary, color: theme.colors.secondary }}
      >
        {!playing && (
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: theme.colors.primary }}
            animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
        )}
        {playing ? (
          <span className="relative flex h-4 items-end gap-[3px]" aria-hidden>
            {[0, 0.2, 0.4].map((d) => (
              <motion.span
                key={d}
                className="block w-[3px] rounded-full"
                style={{ backgroundColor: theme.colors.secondary }}
                animate={{ height: [6, 16, 6] }}
                transition={{ duration: 0.9, delay: d, repeat: Infinity }}
              />
            ))}
          </span>
        ) : (
          <Music2 size={18} className="relative" />
        )}
     </button>
    </div>
  );
}

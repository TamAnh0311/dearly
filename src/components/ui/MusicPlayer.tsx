"use client";

/**
 * MusicPlayer — invisible background music for invitation pages.
 *
 * Attempts autoplay on mount with a slow volume ramp (0 → 0.8 over ~4 s).
 * If the browser blocks autoplay, silently waits for the first user gesture
 * (tap / click / key) anywhere on the page, then starts with the same ramp.
 * No visible UI — music is ambient atmosphere, not a feature guests toggle.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { createAmbientMusic, type AmbientMusic, type MusicPreset } from "@/lib/ambient-music";

interface MusicPlayerProps {
  /** Audio file URL. Optional — falls back to `preset`. */
  musicUrl?: string | null;
  /** Generative preset used when there is no file or it fails to load. */
  preset?: MusicPreset | null;
  theme: { colors: { primary: string; secondary: string; accent: string } };
}

/** Common interface over an <audio> element and the generative engine. */
interface Engine {
  start(): Promise<void>;
  stop(): void;
}

/** Wraps an HTMLAudioElement with a slow fade-in from silence. */
function fileEngine(url: string): Engine {
  const audio = new Audio(url);
  audio.loop = true;
  audio.volume = 0;
  let fade: ReturnType<typeof setInterval> | null = null;
  const ramp = (to: number, step: number, done?: () => void) => {
    if (fade) clearInterval(fade);
    fade = setInterval(() => {
      const next = audio.volume + (to > audio.volume ? step : -step);
      audio.volume = Math.min(1, Math.max(0, next));
      if ((to > 0 && audio.volume >= to) || (to === 0 && audio.volume <= 0)) {
        if (fade) clearInterval(fade);
        done?.();
      }
    }, 80);
  };
  return {
    async start() {
      await audio.play();
      // Quick ramp: ~0.04 every 80 ms → reaches 0.8 in ~1.6 s
      ramp(0.8, 0.04);
    },
    stop() {
      ramp(0, 0.05, () => audio.pause());
    },
  };
}

/** Adapts the generative engine to the Engine interface. */
function generativeEngine(preset: MusicPreset): Engine {
  const m: AmbientMusic = createAmbientMusic(preset);
  return { start: () => m.start(), stop: () => m.stop() };
}

export default function MusicPlayer({ musicUrl, preset, visible = false }: MusicPlayerProps & { visible?: boolean }) {
  const engineRef = useRef<Engine | null>(null);
  const startedRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const available = Boolean(musicUrl || preset);

  /** Starts playback, falling back from file to generative music on failure. */
  const play = useCallback(async () => {
    if (startedRef.current) return;
    try {
      if (!engineRef.current) engineRef.current = musicUrl ? fileEngine(musicUrl) : generativeEngine(preset ?? "piano");
      await engineRef.current.start();
      startedRef.current = true;
      setPlaying(true);
    } catch {
      // File failed — fall back to generative; or generative failed — retry once
      if (!startedRef.current) {
        try {
          engineRef.current = generativeEngine(preset ?? "piano");
          await engineRef.current.start();
          startedRef.current = true;
          setPlaying(true);
        } catch {
          /* browser blocked all audio — give up silently */
        }
      }
    }
  }, [musicUrl, preset]);

  /** Stops playback. */
  const stop = useCallback(() => {
    engineRef.current?.stop();
    startedRef.current = false;
    engineRef.current = null;
    setPlaying(false);
  }, []);

  // Try autoplay on mount; if blocked, start on first user gesture.
  useEffect(() => {
    if (!available) return;

    void play().catch(() => {
      const onGesture = () => {
        remove();
        void play();
      };
      const remove = () => {
        window.removeEventListener("pointerdown", onGesture);
        window.removeEventListener("keydown", onGesture);
        window.removeEventListener("scroll", onGesture);
        window.removeEventListener("touchstart", onGesture);
      };
      window.addEventListener("pointerdown", onGesture);
      window.addEventListener("keydown", onGesture);
      window.addEventListener("scroll", onGesture, { passive: true });
      window.addEventListener("touchstart", onGesture, { passive: true });
      cleanups.push(remove);
    });

    const cleanups: (() => void)[] = [];
    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [available, play]);

  // Stop music when unmounting.
  useEffect(() => () => engineRef.current?.stop(), []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); if (playing) stop(); else void play(); }}
      aria-label={playing ? "Tắt nhạc" : "Bật nhạc"}
      className={`sb-music-btn ${playing ? "sb-music-playing" : ""}`}
    >
      <span className="sb-music-bars">
        <span /><span /><span /><span />
      </span>
    </button>
  );
}

"use client";

/**
 * Floating ambient music player widget for guest-facing wedding pages.
 * Renders a fixed circular button in the bottom-right corner that toggles
 * audio playback with animated visual feedback.
 */

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Music2 } from "lucide-react";

interface MusicPlayerProps {
  /** URL to the audio file. If omitted the component renders nothing. */
  musicUrl?: string;
  theme: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
    };
  };
}

/** Duration in ms over which volume ramps up or down on play/pause. */
const FADE_DURATION_MS = 500;
/** Volume step applied per tick during fade (50 ticks over FADE_DURATION_MS). */
const FADE_STEPS = 50;
const FADE_INTERVAL_MS = FADE_DURATION_MS / FADE_STEPS;

/**
 * Ramps audio volume from its current value toward `target` over FADE_DURATION_MS.
 * Resolves once the ramp completes. Clears any pending ramp via the returned cleanup fn.
 */
function fadeVolume(
  audio: HTMLAudioElement,
  target: number,
  onComplete?: () => void
): () => void {
  const start = audio.volume;
  const delta = (target - start) / FADE_STEPS;
  let step = 0;
  const id = setInterval(() => {
    step += 1;
    const next = start + delta * step;
    audio.volume = Math.min(1, Math.max(0, next));
    if (step >= FADE_STEPS) {
      audio.volume = target;
      clearInterval(id);
      onComplete?.();
    }
  }, FADE_INTERVAL_MS);
  return () => clearInterval(id);
}

/**
 * Floating music player — shows only when `musicUrl` is provided.
 */
export default function MusicPlayer({ musicUrl, theme }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeCleanupRef = useRef<(() => void) | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  /** True until the user first interacts with the button. */
  const [hasInteracted, setHasInteracted] = useState(false);

  /** Initialise the Audio element once the URL is known. */
  useEffect(() => {
    if (!musicUrl) return;

    const audio = new Audio(musicUrl);
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [musicUrl]);

  /** Clean up any pending fade timers on unmount. */
  useEffect(() => {
    return () => {
      fadeCleanupRef.current?.();
    };
  }, []);

  if (!musicUrl) return null;

  /**
   * Toggles playback with a smooth volume fade.
   * First interaction removes the attention pulse ring.
   */
  function handleToggle() {
    const audio = audioRef.current;
    if (!audio) return;

    if (!hasInteracted) setHasInteracted(true);

    // Cancel any in-progress fade before starting a new one.
    fadeCleanupRef.current?.();

    if (isPlaying) {
      const cleanup = fadeVolume(audio, 0, () => audio.pause());
      fadeCleanupRef.current = cleanup;
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {
        // Autoplay may still be blocked; silently ignore.
      });
      const cleanup = fadeVolume(audio, 1);
      fadeCleanupRef.current = cleanup;
      setIsPlaying(true);
    }
  }

  return (
    <>
      {/* Scoped keyframe animations */}
      <style>{`
        @keyframes dearly-wave {
          0%, 100% { height: 8px; }
          50% { height: 16px; }
        }
        @keyframes dearly-pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        .dearly-bar {
          width: 3px;
          background: white;
          border-radius: 2px;
          display: inline-block;
        }
        .dearly-bar:nth-child(1) { height: 8px; }
        .dearly-bar:nth-child(2) { height: 14px; }
        .dearly-bar:nth-child(3) { height: 10px; }
        .dearly-bar-playing:nth-child(1) {
          animation: dearly-wave 0.8s ease-in-out infinite;
        }
        .dearly-bar-playing:nth-child(2) {
          animation: dearly-wave 0.8s ease-in-out 0.2s infinite;
        }
        .dearly-bar-playing:nth-child(3) {
          animation: dearly-wave 0.8s ease-in-out 0.4s infinite;
        }
        .dearly-pulse-ring {
          animation: dearly-pulse-ring 1.8s ease-out infinite;
        }
      `}</style>

      <div className="fixed bottom-6 right-6 z-50 flex items-center justify-center">
        {/* Attention pulse ring — visible until first interaction */}
        {!hasInteracted && (
          <span
            className="dearly-pulse-ring absolute inset-0 rounded-full"
            style={{ backgroundColor: theme.colors.primary, opacity: 0.4 }}
            aria-hidden="true"
          />
        )}

        <motion.button
          onClick={handleToggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          aria-label={isPlaying ? "Pause background music" : "Play background music"}
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            backgroundColor: theme.colors.primary,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            position: "relative",
          }}
        >
          {isPlaying ? (
            /* Sound wave bars when playing */
            <span
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 3,
                height: 20,
              }}
              aria-hidden="true"
            >
              <span className={`dearly-bar dearly-bar-playing`} />
              <span className={`dearly-bar dearly-bar-playing`} />
              <span className={`dearly-bar dearly-bar-playing`} />
            </span>
          ) : (
            <Music2 size={20} color="white" aria-hidden="true" />
          )}

          {/* Accessible state label for screen readers */}
          <span className="sr-only">{isPlaying ? "Pause music" : "Play music"}</span>
        </motion.button>
      </div>
    </>
  );
}

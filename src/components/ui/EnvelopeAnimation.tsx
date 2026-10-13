"use client";

/**
 * EnvelopeAnimation — Animated envelope that opens to reveal the invitation.
 * Uses Framer Motion for the wax seal break, flap rotation, card slide-up, and fade-out.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EnvelopeAnimationProps {
  /** Called when the full animation sequence completes. */
  onComplete: () => void;
  theme: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
    };
  };
  partnerNames: [string, string];
}

type Stage = "idle" | "opening" | "done";

export default function EnvelopeAnimation({
  onComplete,
  theme,
  partnerNames,
}: EnvelopeAnimationProps) {
  const [stage, setStage] = useState<Stage>("idle");

  /** Kicks off the full animation chain on click. */
  function handleOpen() {
    if (stage !== "idle") return;
    setStage("opening");

    // After seal(0.4) + flap(0.6) + card(0.5) + hold(1.0) + fade(0.5) = ~2.5 s
    setTimeout(() => {
      setStage("done");
      onComplete();
    }, 2800);
  }

  /** Immediately skip the animation. */
  function handleSkip() {
    setStage("done");
    onComplete();
  }

  const isOpening = stage === "opening";

  return (
    <AnimatePresence>
      {stage !== "done" && (
        <motion.div
          key="envelope-overlay"
          className="envelope-overlay"
          style={{ background: theme.colors.secondary }}
          initial={{ opacity: 1 }}
          animate={isOpening ? { opacity: 1 } : { opacity: 1 }}
          exit={{ opacity: 0, scale: 1.06, transition: { duration: 0.5, ease: "easeInOut" } }}
        >
          {/* Skip button */}
          <button
            onClick={handleSkip}
            className="envelope-skip"
            aria-label="Skip envelope animation"
          >
            Skip
          </button>

          {/* Outer wrapper — fade + scale on exit */}
          <motion.div
            className="envelope-scene"
            animate={
              isOpening
                ? { opacity: [1, 1, 1, 0], scale: [1, 1, 1, 1.08], transition: { duration: 2.5, times: [0, 0.6, 0.8, 1] } }
                : {}
            }
          >
            {/* Card that slides up from inside the envelope */}
            <motion.div
              className="envelope-card"
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={
                isOpening
                  ? {
                      y: [-20],
                      opacity: [1],
                      scale: [1],
                      transition: { delay: 0.9, duration: 0.5, ease: "easeOut" },
                    }
                  : { y: 50, opacity: 0 }
              }
            >
              <p className="envelope-card-ampersand" style={{ color: theme.colors.accent }}>
                &
              </p>
              <p className="envelope-card-name">{partnerNames[0]}</p>
              <p className="envelope-card-name">{partnerNames[1]}</p>
            </motion.div>

            {/* Envelope body */}
            <div
              className="envelope-body"
              onClick={handleOpen}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleOpen()}
              aria-label="Open your invitation"
            >
              {/* Back panel */}
              <div className="envelope-back" />

              {/* Left wing */}
              <div className="envelope-wing envelope-wing--left" />

              {/* Right wing */}
              <div className="envelope-wing envelope-wing--right" />

              {/* Bottom triangle fold */}
              <div className="envelope-bottom-fold" />

              {/* Flap (top) — rotates open around top edge */}
              <motion.div
                className="envelope-flap"
                style={{ originY: 0, originX: 0.5 }}
                initial={{ rotateX: 0 }}
                animate={
                  isOpening
                    ? { rotateX: 180, transition: { delay: 0.45, duration: 0.6, ease: "easeInOut" } }
                    : { rotateX: 0 }
                }
              />

              {/* Wax seal — sits on flap */}
              <motion.div
                className="envelope-seal"
                style={{ background: theme.colors.primary }}
                initial={{ scale: 1, opacity: 1, rotate: 0 }}
                animate={
                  isOpening
                    ? {
                        scale: [1, 1.35, 0],
                        opacity: [1, 1, 0],
                        rotate: [0, -8, 12],
                        transition: { duration: 0.4, ease: "easeOut" },
                      }
                    : { scale: 1, opacity: 1 }
                }
              >
                <span className="envelope-seal-monogram">
                  {partnerNames[0][0]}
                  {partnerNames[1][0]}
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Tap prompt shown when idle */}
          <motion.p
            className="envelope-prompt"
            animate={isOpening ? { opacity: 0, y: -4 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Tap to open your invitation
          </motion.p>
        </motion.div>
      )}

      <style>{`
        .envelope-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          /* subtle texture */
          background-image: radial-gradient(ellipse at 60% 40%, rgba(255,255,255,0.12) 0%, transparent 70%);
        }

        .envelope-skip {
          position: absolute;
          top: 1.25rem;
          right: 1.5rem;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Georgia', serif;
          font-size: 0.8rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          transition: color 0.2s;
          padding: 0.25rem 0.5rem;
        }
        .envelope-skip:hover { color: rgba(255,255,255,0.9); }

        .envelope-scene {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* ── Card (behind the envelope in z-order, slides up) ── */
        .envelope-card {
          position: absolute;
          bottom: calc(100% - 56px);
          left: 50%;
          transform: translateX(-50%);
          width: 220px;
          background: #fffef9;
          border-radius: 2px;
          padding: 1.5rem 1rem;
          text-align: center;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18);
          z-index: 1;
          pointer-events: none;
        }
        .envelope-card-ampersand {
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: 1.5rem;
          font-style: italic;
          margin: 0 0 0.25rem;
          line-height: 1;
        }
        .envelope-card-name {
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: 1rem;
          letter-spacing: 0.08em;
          color: #2d2520;
          margin: 0.15rem 0;
          font-weight: 400;
        }

        /* ── Envelope body (click target) ── */
        .envelope-body {
          position: relative;
          width: 300px;
          height: 210px;
          cursor: pointer;
          perspective: 600px;
          z-index: 2;
          outline: none;
        }
        @media (max-width: 380px) {
          .envelope-body { width: 260px; height: 182px; }
          .envelope-card { width: 190px; }
        }

        .envelope-back {
          position: absolute;
          inset: 0;
          background: #f5efe0;
          border-radius: 2px;
          box-shadow:
            0 20px 60px rgba(0,0,0,0.28),
            0 4px 16px rgba(0,0,0,0.14),
            inset 0 1px 0 rgba(255,255,255,0.6);
        }

        /* Left and right inner fold lines — create the diamond/V shape on envelope face */
        .envelope-wing {
          position: absolute;
          bottom: 0;
          width: 0;
          height: 0;
          border-bottom: 105px solid #e8dfc8;
          z-index: 1;
        }
        .envelope-wing--left {
          left: 0;
          border-right: 150px solid transparent;
        }
        .envelope-wing--right {
          right: 0;
          border-left: 150px solid transparent;
        }

        .envelope-bottom-fold {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 0;
          border-bottom: 90px solid #ddd5bb;
          border-right: 150px solid transparent;
          border-left: 150px solid transparent;
          z-index: 2;
        }

        /* Flap — triangle pointing down, rotates on X axis */
        .envelope-flap {
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 0;
          border-top: 110px solid #ede4cf;
          border-right: 150px solid transparent;
          border-left: 150px solid transparent;
          transform-origin: top center;
          z-index: 5;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.12));
        }

        /* ── Wax seal ── */
        .envelope-seal {
          position: absolute;
          top: 64px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 60px;
          border-radius: 50%;
          z-index: 6;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 2px 12px rgba(0,0,0,0.3),
            0 0 0 3px rgba(255,255,255,0.25) inset,
            0 0 0 1px rgba(0,0,0,0.1);
          cursor: pointer;
          /* Rough wax texture via radial gradient */
          background-image: radial-gradient(circle at 35% 35%, rgba(255,255,255,0.25), transparent 60%),
                            radial-gradient(circle at 70% 70%, rgba(0,0,0,0.12), transparent 50%);
        }
        .envelope-seal-monogram {
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: 0.85rem;
          font-style: italic;
          color: rgba(255,255,255,0.92);
          letter-spacing: 0.04em;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
          user-select: none;
        }

        /* ── Tap prompt ── */
        .envelope-prompt {
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: 0.85rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.65);
          margin: 0;
          font-style: italic;
        }
      `}</style>
    </AnimatePresence>
  );
}

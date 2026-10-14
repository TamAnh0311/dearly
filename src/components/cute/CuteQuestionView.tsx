"use client";

/**
 * CuteQuestionView — the viral "Yes Only" question page.
 *
 * Renders a full-viewport interactive experience where the recipient sees a
 * cute question with "Yes" and "No" buttons. The "No" button uses three
 * randomised escape animations (evade, shrink, teleport) so it can never
 * be clicked. When "Yes" is pressed, a celebration explosion takes over.
 */

import { useState, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import type { CuteQuestionRow } from "@/types/database";

// ---------------------------------------------------------------------------
// Theme configuration
// ---------------------------------------------------------------------------

interface ThemeConfig {
  emojis: string[];
  fontClass: string;
  particleColors: string[];
}

const THEME_MAP: Record<CuteQuestionRow["theme"], ThemeConfig> = {
  hearts: {
    emojis: ["\u2764\uFE0F", "\uD83D\uDC95", "\uD83D\uDC96", "\uD83D\uDC97", "\uD83D\uDC93", "\uD83E\uDE77"],
    fontClass: "font-body",
    particleColors: ["#FF69B4", "#FF1493", "#FF6B9D", "#E91E90", "#FFB6C1"],
  },
  roses: {
    emojis: ["\uD83C\uDF39", "\uD83C\uDF3A", "\uD83C\uDF37", "\uD83C\uDF38", "\uD83C\uDF3C", "\uD83E\uDEB7"],
    fontClass: "font-body",
    particleColors: ["#DC143C", "#C41E3A", "#FF2D55", "#B22222", "#FF6B6B"],
  },
  stars: {
    emojis: ["\u2B50", "\u2728", "\uD83C\uDF1F", "\uD83D\uDCAB", "\uD83C\uDF20", "\u26A1"],
    fontClass: "font-body",
    particleColors: ["#FFD700", "#9B59B6", "#8E44AD", "#F39C12", "#E74C3C"],
  },
  kawaii: {
    emojis: ["\uD83E\uDD70", "\uD83D\uDE0A", "\uD83D\uDC97", "\uD83C\uDF1F", "\uD83C\uDF80", "\uD83C\uDF6C"],
    fontClass: "font-body",
    particleColors: ["#FFB7D5", "#B5EAD7", "#C7CEEA", "#FFDAC1", "#E2F0CB"],
  },
  classic: {
    emojis: ["\u2661", "\u2605", "\u2726", "\u2727"],
    fontClass: "font-display",
    particleColors: ["#2C3E50", "#8E7CC3", "#BFA882", "#A0522D", "#D4A574"],
  },
};

const NO_MESSAGES = [
  "No \uD83D\uDE22",
  "Are you sure? \uD83E\uDD7A",
  "Please? \uD83E\uDD79",
  "Pretty please? \uD83D\uDE2D",
];

// ---------------------------------------------------------------------------
// Floating decoration
// ---------------------------------------------------------------------------

/**
 * A single floating emoji decoration that drifts around the viewport.
 */
function FloatingDecoration({
  emoji,
  index,
  total,
}: {
  emoji: string;
  index: number;
  total: number;
}) {
  const size = 16 + Math.random() * 24;
  const startX = Math.random() * 100;
  const startY = Math.random() * 100;
  const duration = 8 + Math.random() * 12;
  const delay = (index / total) * 4;

  return (
    <motion.div
      className="pointer-events-none fixed select-none"
      style={{ fontSize: size, left: `${startX}%`, top: `${startY}%`, zIndex: 0 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.6, 0.4, 0.6, 0],
        scale: [0.5, 1, 0.8, 1, 0.5],
        x: [0, 30, -20, 40, 0],
        y: [0, -40, -80, -120, -160],
        rotate: [0, 15, -10, 20, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {emoji}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Celebration particles
// ---------------------------------------------------------------------------

/**
 * Generates a burst of falling confetti rectangles and themed emoji particles.
 */
function CelebrationExplosion({
  theme,
  accentColor,
}: {
  theme: CuteQuestionRow["theme"];
  accentColor: string;
}) {
  const config = THEME_MAP[theme];
  const particles = useMemo(() => {
    const items: Array<{
      id: number;
      emoji: string | null;
      color: string;
      x: number;
      y: number;
      size: number;
      rotation: number;
      delay: number;
    }> = [];

    // Confetti rectangles
    for (let i = 0; i < 60; i++) {
      items.push({
        id: i,
        emoji: null,
        color: config.particleColors[i % config.particleColors.length],
        x: Math.random() * 100,
        y: -10 - Math.random() * 30,
        size: 6 + Math.random() * 8,
        rotation: Math.random() * 360,
        delay: Math.random() * 1.5,
      });
    }

    // Theme emoji particles
    for (let i = 0; i < 30; i++) {
      items.push({
        id: 60 + i,
        emoji: config.emojis[i % config.emojis.length],
        color: accentColor,
        x: 30 + Math.random() * 40,
        y: 40 + Math.random() * 20,
        size: 20 + Math.random() * 24,
        rotation: 0,
        delay: Math.random() * 0.5,
      });
    }

    return items;
  }, [config, accentColor]);

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {particles.map((p) =>
        p.emoji ? (
          <motion.div
            key={p.id}
            className="absolute select-none"
            style={{ left: `${p.x}%`, top: `${p.y}%`, fontSize: p.size }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0, 1.5, 1, 0],
              x: (Math.random() - 0.5) * 300,
              y: (Math.random() - 0.5) * 300,
            }}
            transition={{ duration: 2 + Math.random(), delay: p.delay, ease: "easeOut" }}
          >
            {p.emoji}
          </motion.div>
        ) : (
          <motion.div
            key={p.id}
            className="absolute rounded-sm"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size * 0.6,
              backgroundColor: p.color,
            }}
            initial={{ opacity: 1, y: 0, rotate: p.rotation }}
            animate={{
              y: [0, window.innerHeight + 100],
              rotate: p.rotation + 720,
              x: (Math.random() - 0.5) * 200,
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: p.delay,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          />
        )
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Typewriter text
// ---------------------------------------------------------------------------

/**
 * Reveals text word-by-word with a typewriter-style animation.
 */
function TypewriterText({
  text,
  className,
  style,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const words = text.split(" ");

  return (
    <span className={className} style={style}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.3 + i * 0.15, duration: 0.5, ease: "easeOut" }}
        >
          {word}
          {i < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface Props {
  question: CuteQuestionRow;
}

export default function CuteQuestionView({ question }: Props) {
  const config = THEME_MAP[question.theme];

  const [noAttempts, setNoAttempts] = useState(0);
  const [answered, setAnswered] = useState(question.answered);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [noScale, setNoScale] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const noBtnRef = useRef<HTMLButtonElement>(null);
  const escapeIndexRef = useRef(0);
  const yesBtnControls = useAnimation();

  // Decorations — generate a fixed set on mount
  const decorations = useMemo(() => {
    const count = question.theme === "classic" ? 8 : 16;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji: config.emojis[i % config.emojis.length],
    }));
  }, [config.emojis, question.theme]);

  /**
   * Picks a random escape strategy and applies it to the No button.
   */
  const triggerEscape = useCallback(() => {
    if (answered) return;

    const strategies = ["evade", "shrink", "teleport"] as const;
    const strategy = strategies[escapeIndexRef.current % strategies.length];
    escapeIndexRef.current += 1;

    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const padding = 60;

    setNoAttempts((prev) => prev + 1);

    switch (strategy) {
      case "evade": {
        // Move to a random position biased away from center
        const newX = padding + Math.random() * (rect.width - padding * 2 - 120);
        const newY = padding + Math.random() * (rect.height - padding * 2 - 50);
        setNoPosition({ x: newX - rect.width / 2 + 60, y: newY - rect.height / 2 + 25 });
        break;
      }
      case "shrink": {
        // Shrink the button by 20%
        setNoScale((prev) => Math.max(0.15, prev * 0.8));
        // Also teleport slightly
        const offsetX = (Math.random() - 0.5) * 200;
        const offsetY = (Math.random() - 0.5) * 150;
        setNoPosition((prev) => ({ x: prev.x + offsetX, y: prev.y + offsetY }));
        break;
      }
      case "teleport": {
        // Jump to a completely random spot
        const tx = (Math.random() - 0.5) * (rect.width - 200);
        const ty = (Math.random() - 0.5) * (rect.height - 120);
        setNoPosition({ x: tx, y: ty });
        break;
      }
    }

    // Grow the yes button slightly
    yesBtnControls.start({ scale: 1 + (noAttempts + 1) * 0.05 });
  }, [answered, noAttempts, yesBtnControls]);

  /**
   * Desktop: triggers escape when mouse gets within 80px of the No button.
   */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (answered) return;
      const btn = noBtnRef.current;
      if (!btn) return;

      const btnRect = btn.getBoundingClientRect();
      const btnCenterX = btnRect.left + btnRect.width / 2;
      const btnCenterY = btnRect.top + btnRect.height / 2;

      const dist = Math.sqrt(
        (e.clientX - btnCenterX) ** 2 + (e.clientY - btnCenterY) ** 2
      );

      if (dist < 80) {
        triggerEscape();
      }
    },
    [answered, triggerEscape]
  );

  /**
   * Marks the question as answered via the API and triggers the celebration.
   */
  const handleYes = useCallback(async () => {
    if (answered) return;
    setAnswered(true);
    setShowCelebration(true);

    try {
      await fetch("/api/questions/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: question.id }),
      });
    } catch {
      // Silent — celebration still shows even if the API call fails
    }
  }, [answered, question.id]);

  // Determine the No button label based on attempt count
  const noLabel =
    noAttempts >= 4
      ? "..."
      : noAttempts < NO_MESSAGES.length
        ? NO_MESSAGES[noAttempts]
        : NO_MESSAGES[NO_MESSAGES.length - 1];

  // Classic theme uses serif, others use body
  const questionFontClass =
    question.theme === "classic" ? "font-display italic" : "font-body";

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden px-4"
      style={{ backgroundColor: question.background_color }}
    >
      {/* Floating decorations */}
      {decorations.map((d) => (
        <FloatingDecoration
          key={d.id}
          emoji={d.emoji}
          index={d.id}
          total={decorations.length}
        />
      ))}

      {/* Warm glow behind content */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[120px]"
        style={{
          width: 400,
          height: 400,
          backgroundColor: question.accent_color,
        }}
      />

      {/* Main content */}
      <AnimatePresence mode="wait">
        {!answered ? (
          <motion.div
            key="question"
            className="relative z-10 flex flex-col items-center gap-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -40 }}
            transition={{ duration: 0.5 }}
          >
            {/* Recipient greeting */}
            {question.recipient_name && (
              <motion.p
                className={`text-lg sm:text-xl ${questionFontClass}`}
                style={{ color: question.accent_color }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
              >
                Hey {question.recipient_name}!
              </motion.p>
            )}

            {/* Question text — typewriter reveal */}
            <h1
              className={`max-w-lg text-3xl font-bold leading-tight sm:text-4xl md:text-5xl ${questionFontClass}`}
              style={{ color: question.accent_color }}
            >
              <TypewriterText text={question.question} />
            </h1>

            {/* Buttons */}
            <div className="relative mt-4 flex items-center gap-6">
              {/* Yes button */}
              <motion.button
                animate={yesBtnControls}
                initial={{ opacity: 0, y: 40, scale: 1 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: 0.8 + (question.question.split(" ").length * 0.15),
                }}
                whileHover={{ scale: (1 + noAttempts * 0.05) * 1.08 }}
                whileTap={{ scale: (1 + noAttempts * 0.05) * 0.95 }}
                onClick={handleYes}
                className="relative rounded-2xl px-10 py-4 text-xl font-bold text-white shadow-lg transition-shadow hover:shadow-xl sm:text-2xl"
                style={{ backgroundColor: question.accent_color }}
              >
                {/* Pulsing ring */}
                <motion.span
                  className="absolute inset-0 rounded-2xl"
                  style={{ border: `2px solid ${question.accent_color}` }}
                  animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                Yes {"\uD83D\uDC95"}
              </motion.button>

              {/* No button — the escapee */}
              <motion.button
                ref={noBtnRef}
                initial={{ opacity: 0, y: 40 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  x: noPosition.x,
                  scale: noScale,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                  opacity: { delay: 1 + (question.question.split(" ").length * 0.15) },
                  y: {
                    delay: 1 + (question.question.split(" ").length * 0.15),
                  },
                }}
                // Mobile: escape on touch start
                onTouchStart={(e) => {
                  e.preventDefault();
                  triggerEscape();
                }}
                className="rounded-2xl border-2 bg-white/80 px-10 py-4 text-xl font-bold backdrop-blur-sm transition-colors hover:bg-white sm:text-2xl"
                style={{
                  borderColor: question.accent_color,
                  color: question.accent_color,
                }}
              >
                {noLabel}
              </motion.button>
            </div>

            {/* Hint after a few attempts */}
            <AnimatePresence>
              {noAttempts >= 3 && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm"
                  style={{ color: question.accent_color, opacity: 0.6 }}
                >
                  {noAttempts >= 5
                    ? "There is only one answer here..."
                    : "That button seems to have a mind of its own..."}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* ---- Celebration state ---- */
          <motion.div
            key="celebration"
            className="relative z-10 flex flex-col items-center gap-6 text-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            {/* Pulsing background glow */}
            <motion.div
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ backgroundColor: question.accent_color }}
              animate={{
                width: [200, 500, 300, 500],
                height: [200, 500, 300, 500],
                opacity: [0.15, 0.3, 0.15, 0.3],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Yes message */}
            <motion.div
              initial={{ y: 30 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <h1
                className={`max-w-lg text-3xl font-bold leading-tight sm:text-4xl md:text-5xl ${questionFontClass}`}
                style={{ color: question.accent_color }}
              >
                {question.yes_message}
              </h1>
            </motion.div>

            {/* From sender */}
            {question.sender_name && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className={`text-lg sm:text-xl ${questionFontClass}`}
                style={{ color: question.accent_color, opacity: 0.8 }}
              >
                From {question.sender_name}
              </motion.p>
            )}

            {/* Big theme emoji */}
            <motion.div
              className="text-6xl sm:text-8xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 12 }}
            >
              {config.emojis[0]}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebration confetti overlay */}
      {showCelebration && (
        <CelebrationExplosion theme={question.theme} accentColor={question.accent_color} />
      )}

      {/* Subtle footer */}
      <motion.a
        href="/"
        className="fixed bottom-4 text-xs opacity-30 transition-opacity hover:opacity-60"
        style={{ color: question.accent_color }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 2 }}
      >
        Made with Dearly
      </motion.a>
    </div>
  );
}

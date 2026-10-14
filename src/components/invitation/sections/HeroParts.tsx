"use client";

/**
 * Shared hero building blocks: rising letter text, script ampersand,
 * date line, small-caps eyebrow, scroll cue and the centred names block.
 */

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { EASE_OUT, formatDotDate, type InvitationPalette } from "../utils";
import type { LayoutProps } from "./Hero";
/* ─── Shared pieces ───────────────────────────────────────────────────────── */

/** Splits text into letters that rise into place with a stagger. */
export function RisingText({ text, delay, stagger = 0.05 }: { text: string; delay: number; stagger?: number }) {
  return (
    <span className="-mx-[0.12em] inline-flex overflow-hidden px-[0.12em] pb-[0.08em]">
      {Array.from(text).map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block"
          style={{ whiteSpace: "pre" }}
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          transition={{ duration: 1.1, delay: delay + i * stagger, ease: EASE_OUT }}
        >
          {ch}
        </motion.span>
      ))}
      <span className="sr-only">{text}</span>
    </span>
  );
}

/** Script ampersand that springs in. */
export function Ampersand({ palette, delay, className = "" }: { palette: InvitationPalette; delay: number; className?: string }) {
  return (
    <motion.span
      className={`block ${className}`}
      style={{ fontFamily: palette.scriptFont, color: palette.primary }}
      initial={{ opacity: 0, scale: 0.4, rotate: -20 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 90, damping: 12, delay }}
    >
      &amp;
    </motion.span>
  );
}

/** "—— 15 · 06 · 2027 ——" with lines that extend outward. */
export function DateLine({ date, palette, delay, color }: { date: string; palette: InvitationPalette; delay: number; color?: string }) {
  return (
    <motion.div className="flex items-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay }}>
      {[1, 0].map((origin, i) => (
        <motion.span
          key={i}
          className={`h-px w-12 md:w-20 ${i === 1 ? "order-last" : ""}`}
          style={{ backgroundColor: palette.primary, originX: origin }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: delay + 0.1, ease: EASE_OUT }}
        />
      ))}
      <span className="order-1 text-sm tracking-[0.35em] md:text-base" style={{ fontFamily: palette.displayFont, color: color ?? palette.ink }}>
        {formatDotDate(date)}
      </span>
    </motion.div>
  );
}

/** Bouncing "Scroll" cue anchored to the bottom of the hero. */
export function ScrollCue({ color }: { color: string }) {
  return (
    <motion.a
      href="#celebrate"
      aria-label="Scroll to details"
      className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1 text-[10px] uppercase tracking-[0.3em]"
      style={{ color }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3.2 }}
    >
      Scroll
      <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
        <ChevronDown size={18} />
      </motion.span>
    </motion.a>
  );
}

/** Small caps line that settles from wide letter-spacing. */
export function Eyebrow({ text, color, delay = 0.2 }: { text: string; color: string; delay?: number }) {
  return (
    <motion.p
      className="text-[11px] uppercase tracking-[0.5em] md:text-xs"
      style={{ color }}
      initial={{ opacity: 0, letterSpacing: "0.9em" }}
      animate={{ opacity: 1, letterSpacing: "0.5em" }}
      transition={{ duration: 1.8, delay, ease: EASE_OUT }}
    >
      {text}
    </motion.p>
  );
}


/** Centred names block reused by several signature layouts. */
export function CenterNames({
  palette,
  wedding,
  delay,
  eyebrow,
  ink,
  muted,
  size = "text-6xl md:text-8xl",
}: {
  palette: InvitationPalette;
  wedding: LayoutProps["wedding"];
  delay: number;
  eyebrow: string;
  ink?: string;
  muted?: string;
  size?: string;
}) {
  const upper = palette.style.headingCase === "upper";
  return (
    <div className="flex flex-col items-center text-center">
      <Eyebrow text={eyebrow} color={muted ?? palette.inkMuted} delay={delay} />
      <h1 className="mt-6 font-light leading-[0.95]" style={{ fontFamily: palette.displayFont, color: ink ?? palette.ink }}>
        <span className={`block ${size} ${upper ? "uppercase tracking-[0.1em]" : ""}`}>
          <RisingText text={wedding.partner1_name} delay={delay + 0.3} />
        </span>
        <Ampersand palette={palette} delay={delay + 0.9} className="my-1 text-5xl md:text-7xl" />
        <span className={`block ${size} ${upper ? "uppercase tracking-[0.1em]" : ""}`}>
          <RisingText text={wedding.partner2_name} delay={delay + 1.1} />
        </span>
      </h1>
      {wedding.wedding_date && (
        <div className="mt-8">
          <DateLine date={wedding.wedding_date} palette={palette} delay={delay + 1.6} color={ink} />
        </div>
      )}
      {wedding.venue_name && (
        <motion.p
          className="mt-4 text-xs uppercase tracking-[0.3em]"
          style={{ color: muted ?? palette.inkMuted }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 1.9 }}
        >
          {wedding.venue_name}
        </motion.p>
      )}
    </div>
  );
}


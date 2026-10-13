"use client";

/**
 * Noir invitation page — dark cinematic atmosphere with letter-by-letter
 * reveal on names, vignette overlay, and spotlight glow effects.
 */

import { motion } from "framer-motion";
import { MapPin, Calendar } from "lucide-react";
import CountdownTimer from "@/components/ui/CountdownTimer";
import type { InvitationPageProps } from "../types";

/** Cinematic letter-by-letter reveal component. */
function CinematicTitle({
  text,
  theme,
  baseDelay = 0,
}: {
  text: string;
  theme: { fonts: { display: string }; colors: { primary: string } };
  baseDelay?: number;
}) {
  return (
    <span className="inline-flex flex-wrap justify-center overflow-hidden">
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 80, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.6,
            delay: baseDelay + i * 0.06,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            fontFamily: `'${theme.fonts.display}', serif`,
            color: theme.colors.primary,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

export default function NoirInvitationPage({ wedding, events, theme }: InvitationPageProps) {
  const weddingDate = wedding.wedding_date
    ? new Date(wedding.wedding_date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const partner1Delay = 0.3;
  const partner2Delay = partner1Delay + wedding.partner1_name.length * 0.06 + 0.4;

  return (
    <div
      className="min-h-screen overflow-hidden"
      style={{
        backgroundColor: theme.colors.secondary,
        fontFamily: `'${theme.fonts.body}', sans-serif`,
      }}
    >
      {/* Vignette overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-10"
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
        {/* Spotlight glow */}
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full"
          animate={{
            width: ["300px", "400px", "300px"],
            height: ["300px", "400px", "300px"],
            opacity: [0.06, 0.1, 0.06],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: `radial-gradient(circle, ${theme.colors.primary} 0%, transparent 70%)`,
          }}
        />

        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.8em" }}
          animate={{ opacity: 1, letterSpacing: "0.4em" }}
          transition={{ duration: 1.5, delay: 0.1, ease: "easeOut" }}
          className="mb-10 text-xs uppercase"
          style={{ color: theme.colors.accent }}
        >
          A wedding invitation
        </motion.p>

        {/* Names with cinematic character reveal */}
        <div className="mb-2 text-5xl font-light md:text-7xl" style={{ perspective: "800px" }}>
          <CinematicTitle text={wedding.partner1_name} theme={theme} baseDelay={partner1Delay} />
        </div>

        <motion.p
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: partner2Delay - 0.2 }}
          className="my-6"
          style={{ color: theme.colors.accent }}
        >
          <span style={{ fontFamily: `'${theme.fonts.display}', serif`, fontSize: "1.5rem" }}>
            &amp;
          </span>
        </motion.p>

        <div className="mb-10 text-5xl font-light md:text-7xl" style={{ perspective: "800px" }}>
          <CinematicTitle text={wedding.partner2_name} theme={theme} baseDelay={partner2Delay} />
        </div>

        {/* Horizontal rule with dots */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: partner2Delay + 0.5 }}
          className="mb-8 flex items-center gap-4"
        >
          <div className="h-px w-16" style={{ backgroundColor: theme.colors.accent, opacity: 0.4 }} />
          <div className="h-1 w-1 rounded-full" style={{ backgroundColor: theme.colors.accent }} />
          <div className="h-px w-16" style={{ backgroundColor: theme.colors.accent, opacity: 0.4 }} />
        </motion.div>

        {weddingDate && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: partner2Delay + 0.7 }}
            className="flex items-center gap-3"
          >
            <Calendar size={16} style={{ color: theme.colors.accent }} />
            <p className="text-sm uppercase tracking-[0.2em]" style={{ color: theme.colors.primary, opacity: 0.8 }}>
              {weddingDate}
            </p>
          </motion.div>
        )}

        {wedding.venue_name && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: partner2Delay + 0.9 }}
            className="mt-3 flex items-center gap-3"
          >
            <MapPin size={16} style={{ color: theme.colors.accent }} />
            <p className="text-sm uppercase tracking-[0.15em]" style={{ color: theme.colors.primary, opacity: 0.7 }}>
              {wedding.venue_name}
            </p>
          </motion.div>
        )}

        {wedding.wedding_date && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: partner2Delay + 1.1 }}
            className="mt-12"
          >
            <CountdownTimer
              targetDate={wedding.wedding_date}
              numberClassName="text-dearly-text"
              labelClassName="text-dearly-text-muted"
            />
          </motion.div>
        )}
      </section>

      {/* Story */}
      {wedding.story_text && (
        <motion.section
          className="relative mx-auto max-w-2xl px-6 py-20 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.2 }}
        >
          <h2
            className="mb-8 text-3xl font-light uppercase tracking-widest"
            style={{ fontFamily: `'${theme.fonts.display}', serif`, color: theme.colors.primary }}
          >
            Our Story
          </h2>
          <p className="whitespace-pre-line text-base leading-loose" style={{ color: theme.colors.accent }}>
            {wedding.story_text}
          </p>
        </motion.section>
      )}
    </div>
  );
}

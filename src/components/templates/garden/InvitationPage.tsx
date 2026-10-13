"use client";

/**
 * Garden invitation page — English garden charm with animated vine borders
 * growing in on mount, fluttering butterfly particles, and gentle reveals.
 */

import { motion } from "framer-motion";
import { MapPin, Calendar } from "lucide-react";
import CountdownTimer from "@/components/ui/CountdownTimer";
import type { InvitationPageProps } from "../types";

/** Butterfly particle config. */
const butterflies = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  startX: `${10 + i * 15}%`,
  delay: i * 1.2,
  duration: 8 + (i % 3) * 2,
}));

/** Vine path draw animation. */
const vinePath = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1, transition: { duration: 2.5, ease: "easeInOut", delay: 0.2 } },
};

/** Gentle rise from below. */
const gentleRise = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.2, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function GardenInvitationPage({ wedding, events, theme }: InvitationPageProps) {
  const weddingDate = wedding.wedding_date
    ? new Date(wedding.wedding_date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div
      className="min-h-screen overflow-hidden"
      style={{
        backgroundColor: theme.colors.secondary,
        fontFamily: `'${theme.fonts.body}', sans-serif`,
      }}
    >
      {/* Butterfly particles */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {butterflies.map((b) => (
          <motion.div
            key={b.id}
            className="absolute text-base"
            style={{ left: b.startX, top: "20%" }}
            animate={{
              y: [-20, -80, -20, -60, -20],
              x: [0, 30, -20, 50, 0],
              rotate: [0, 15, -15, 10, 0],
              opacity: [0, 0.6, 0.4, 0.6, 0],
            }}
            transition={{
              duration: b.duration,
              delay: b.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span style={{ filter: `hue-rotate(${b.id * 30}deg)`, fontSize: "20px" }}>🦋</span>
          </motion.div>
        ))}
      </div>

      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-8 text-center">
        {/* Vine SVG border — top-left corner */}
        <div className="pointer-events-none absolute left-0 top-0 h-48 w-48">
          <svg viewBox="0 0 200 200" width="100%" height="100%">
            <motion.path
              d="M0,0 Q50,100 100,80 Q150,60 180,30"
              fill="none"
              stroke={theme.colors.primary}
              strokeWidth="2"
              strokeLinecap="round"
              variants={vinePath}
              initial="hidden"
              animate="visible"
              style={{ opacity: 0.5 }}
            />
            <motion.circle cx="100" cy="80" r="4" fill={theme.colors.primary}
              initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 1.5 }} />
            <motion.circle cx="50" cy="90" r="3" fill={theme.colors.accent}
              initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 1.8 }} />
          </svg>
        </div>

        {/* Vine SVG border — bottom-right corner */}
        <div className="pointer-events-none absolute bottom-0 right-0 h-48 w-48">
          <svg viewBox="0 0 200 200" width="100%" height="100%">
            <motion.path
              d="M200,200 Q150,100 100,120 Q50,140 20,170"
              fill="none"
              stroke={theme.colors.primary}
              strokeWidth="2"
              strokeLinecap="round"
              variants={vinePath}
              initial="hidden"
              animate="visible"
              style={{ opacity: 0.5 }}
            />
          </svg>
        </div>

        <motion.p
          custom={0}
          variants={gentleRise}
          initial="hidden"
          animate="visible"
          className="mb-6 text-xs uppercase tracking-[0.4em]"
          style={{ color: theme.colors.accent }}
        >
          In the garden of love
        </motion.p>

        <motion.h1
          custom={1}
          variants={gentleRise}
          initial="hidden"
          animate="visible"
          className="mb-2 text-6xl md:text-8xl"
          style={{ fontFamily: `'${theme.fonts.display}', serif`, color: theme.colors.primary }}
        >
          {wedding.partner1_name}
        </motion.h1>

        <motion.div
          custom={2}
          variants={gentleRise}
          initial="hidden"
          animate="visible"
          className="my-6 flex items-center gap-4"
        >
          <div className="h-px w-14" style={{ backgroundColor: theme.colors.primary, opacity: 0.4 }} />
          <span className="text-2xl" style={{ color: theme.colors.accent }}>🌿</span>
          <div className="h-px w-14" style={{ backgroundColor: theme.colors.primary, opacity: 0.4 }} />
        </motion.div>

        <motion.h1
          custom={3}
          variants={gentleRise}
          initial="hidden"
          animate="visible"
          className="mb-10 text-6xl md:text-8xl"
          style={{ fontFamily: `'${theme.fonts.display}', serif`, color: theme.colors.primary }}
        >
          {wedding.partner2_name}
        </motion.h1>

        {weddingDate && (
          <motion.div
            custom={4}
            variants={gentleRise}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-3"
          >
            <Calendar size={17} style={{ color: theme.colors.accent }} />
            <p className="text-base" style={{ color: theme.colors.primary, fontFamily: `'${theme.fonts.display}', serif` }}>
              {weddingDate}
            </p>
          </motion.div>
        )}

        {wedding.venue_name && (
          <motion.div
            custom={5}
            variants={gentleRise}
            initial="hidden"
            animate="visible"
            className="mt-3 flex items-center gap-3"
          >
            <MapPin size={17} style={{ color: theme.colors.accent }} />
            <p className="text-base" style={{ color: theme.colors.accent }}>{wedding.venue_name}</p>
          </motion.div>
        )}

        {wedding.wedding_date && (
          <motion.div
            custom={6}
            variants={gentleRise}
            initial="hidden"
            animate="visible"
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
          className="mx-auto max-w-2xl px-8 py-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="h-px w-12" style={{ backgroundColor: theme.colors.primary, opacity: 0.4 }} />
            <span>🌿</span>
            <div className="h-px w-12" style={{ backgroundColor: theme.colors.primary, opacity: 0.4 }} />
          </div>
          <h2
            className="mb-8 text-3xl"
            style={{ fontFamily: `'${theme.fonts.display}', serif`, color: theme.colors.primary }}
          >
            Our Story
          </h2>
          <p className="whitespace-pre-line text-base leading-relaxed" style={{ color: theme.colors.accent }}>
            {wedding.story_text}
          </p>
        </motion.section>
      )}
    </div>
  );
}

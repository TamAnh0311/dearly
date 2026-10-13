"use client";

/**
 * Polaroid invitation page — retro photo aesthetic with polaroid-frame
 * hero card that flies in from above with tilt, scattered decorative
 * photos at edges, and handwritten-style typography.
 */

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import CountdownTimer from "@/components/ui/CountdownTimer";
import type { InvitationPageProps } from "../types";

/** Scattered background "polaroid" decoration data. */
const decorPhotos = [
  { top: "8%", left: "5%", rotate: -12, delay: 0.3, scale: 0.85 },
  { top: "5%", right: "7%", rotate: 8, delay: 0.5, scale: 0.8 },
  { bottom: "10%", left: "4%", rotate: 15, delay: 0.7, scale: 0.9 },
  { bottom: "8%", right: "5%", rotate: -9, delay: 0.4, scale: 0.82 },
];

/** Main polaroid card flies in from top with overshoot. */
const mainCard = {
  hidden: { opacity: 0, y: -120, rotate: -5 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { type: "spring", stiffness: 80, damping: 14, delay: 0.2 },
  },
};

/** Info lines tape-peel from top. */
const tapePeel = {
  hidden: { opacity: 0, scaleY: 0, originY: 0 },
  visible: (i: number) => ({
    opacity: 1,
    scaleY: 1,
    transition: { duration: 0.5, delay: 0.9 + i * 0.15, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function PolaroidInvitationPage({ wedding, events: _events, theme }: InvitationPageProps) {
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
      className="relative min-h-screen overflow-hidden"
      style={{
        backgroundColor: theme.colors.secondary,
        fontFamily: `'${theme.fonts.body}', sans-serif`,
        backgroundImage: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 40px,
          ${theme.colors.primary}05 40px,
          ${theme.colors.primary}05 80px
        )`,
      }}
    >
      {/* Scattered decorative polaroid shadows */}
      {decorPhotos.map((p, i) => (
        <motion.div
          key={i}
          className="absolute hidden md:block"
          style={{
            top: p.top,
            left: (p as Record<string, string | number>).left as string | undefined,
            right: (p as Record<string, string | number>).right as string | undefined,
            bottom: p.bottom,
            width: "120px",
            height: "140px",
            backgroundColor: "#fff",
            boxShadow: "3px 3px 10px rgba(0,0,0,0.15)",
            padding: "8px 8px 28px",
            transform: `rotate(${p.rotate}deg)`,
          }}
          initial={{ opacity: 0, y: -40, rotate: p.rotate - 10 }}
          animate={{ opacity: 1, y: 0, rotate: p.rotate }}
          transition={{ type: "spring", stiffness: 70, damping: 12, delay: p.delay }}
        >
          <div
            className="h-full w-full"
            style={{ backgroundColor: `${theme.colors.primary}15` }}
          />
        </motion.div>
      ))}

      {/* Hero */}
      <section className="flex min-h-screen flex-col items-center justify-center px-6">
        {/* Main polaroid card */}
        <motion.div
          variants={mainCard}
          initial="hidden"
          animate="visible"
          className="w-full max-w-xs text-center"
          style={{
            backgroundColor: "#fff",
            boxShadow: "6px 6px 20px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)",
            padding: "20px 20px 50px",
          }}
        >
          {/* Photo area */}
          <div
            className="mb-5 flex flex-col items-center justify-center"
            style={{
              backgroundColor: `${theme.colors.primary}12`,
              padding: "32px 16px",
              minHeight: "200px",
            }}
          >
            <p
              className="text-5xl"
              style={{ fontFamily: `'${theme.fonts.display}', cursive`, color: theme.colors.primary }}
            >
              {wedding.partner1_name}
            </p>
            <p className="my-2 text-xl" style={{ color: theme.colors.accent, fontFamily: `'${theme.fonts.display}', cursive` }}>
              &amp;
            </p>
            <p
              className="text-5xl"
              style={{ fontFamily: `'${theme.fonts.display}', cursive`, color: theme.colors.primary }}
            >
              {wedding.partner2_name}
            </p>
          </div>

          {/* Handwritten caption below photo strip */}
          <p
            className="text-xl"
            style={{ fontFamily: `'${theme.fonts.display}', cursive`, color: theme.colors.primary }}
          >
            {weddingDate ?? "Save the Date"}
          </p>
        </motion.div>

        {/* Tape strip accent */}
        <motion.div
          custom={0}
          variants={tapePeel}
          initial="hidden"
          animate="visible"
          className="mt-0 h-6 w-16 opacity-70"
          style={{ backgroundColor: theme.colors.accent, marginTop: "-12px" }}
        />

        {/* Details below */}
        <motion.div
          className="mt-8 flex flex-col items-center gap-3 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          {wedding.venue_name && (
            <div className="flex items-center gap-2">
              <MapPin size={16} style={{ color: theme.colors.accent }} />
              <p className="text-sm" style={{ color: theme.colors.primary }}>{wedding.venue_name}</p>
            </div>
          )}

          {wedding.wedding_date && (
            <div className="mt-8">
              <CountdownTimer
                targetDate={wedding.wedding_date}
                numberClassName="text-dearly-text"
                labelClassName="text-dearly-text-muted"
              />
            </div>
          )}
        </motion.div>
      </section>

      {/* Story */}
      {wedding.story_text && (
        <motion.section
          className="mx-auto max-w-lg px-6 py-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
        >
          <div
            className="inline-block p-8"
            style={{
              backgroundColor: "#fff",
              boxShadow: "4px 4px 14px rgba(0,0,0,0.12)",
              transform: "rotate(-1deg)",
            }}
          >
            <h2
              className="mb-6 text-3xl"
              style={{ fontFamily: `'${theme.fonts.display}', cursive`, color: theme.colors.primary }}
            >
              Our Story
            </h2>
            <p
              className="whitespace-pre-line text-sm leading-loose"
              style={{ fontFamily: `'${theme.fonts.display}', cursive`, color: theme.colors.primary, opacity: 0.8 }}
            >
              {wedding.story_text}
            </p>
          </div>
        </motion.section>
      )}
    </div>
  );
}

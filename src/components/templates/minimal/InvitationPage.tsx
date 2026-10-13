"use client";

/**
 * Minimal invitation page — stark modern typography with crisp slide-up
 * stagger reveals, clean geometric dividers, and precise spacing.
 */

import { motion } from "framer-motion";
import { MapPin, Calendar } from "lucide-react";
import CountdownTimer from "@/components/ui/CountdownTimer";
import type { InvitationPageProps } from "../types";

/** Stagger container — each child slides up with tight timing. */
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

/** Crisp slide-up with no bounce. */
const slideUp = {
  hidden: { opacity: 0, y: 32, clipPath: "inset(0 0 100% 0)" },
  visible: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

/** Name characters stagger for dramatic effect. */
function AnimatedName({ name, theme }: { name: string; theme: { fonts: { display: string }; colors: { primary: string } } }) {
  return (
    <span className="inline-flex overflow-hidden">
      {name.split("").map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: `'${theme.fonts.display}', sans-serif`, color: theme.colors.primary }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

export default function MinimalInvitationPage({ wedding, events, theme }: InvitationPageProps) {
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
      className="min-h-screen"
      style={{ backgroundColor: theme.colors.secondary, fontFamily: `'${theme.fonts.body}', sans-serif` }}
    >
      {/* Hero */}
      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          <motion.p
            variants={slideUp}
            className="mb-10 text-xs uppercase tracking-[0.5em]"
            style={{ color: theme.colors.accent }}
          >
            You are invited
          </motion.p>

          {/* Names with character-by-character animation */}
          <div
            className="mb-0 text-5xl font-bold tracking-tight md:text-8xl"
            style={{ color: theme.colors.primary }}
          >
            <AnimatedName name={wedding.partner1_name} theme={theme} />
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.8, ease: "easeInOut" }}
            className="my-6 h-px w-24 origin-left"
            style={{ backgroundColor: theme.colors.primary }}
          />

          <div
            className="mb-12 text-5xl font-bold tracking-tight md:text-8xl"
            style={{ color: theme.colors.primary }}
          >
            <AnimatedName name={wedding.partner2_name} theme={theme} />
          </div>

          {weddingDate && (
            <motion.div
              variants={slideUp}
              className="flex items-center gap-3"
            >
              <Calendar size={16} style={{ color: theme.colors.accent }} />
              <p className="text-sm uppercase tracking-[0.2em]" style={{ color: theme.colors.accent }}>
                {weddingDate}
              </p>
            </motion.div>
          )}

          {wedding.venue_name && (
            <motion.div
              variants={slideUp}
              className="mt-3 flex items-center gap-3"
            >
              <MapPin size={16} style={{ color: theme.colors.accent }} />
              <p className="text-sm uppercase tracking-[0.2em]" style={{ color: theme.colors.accent }}>
                {wedding.venue_name}
              </p>
            </motion.div>
          )}

          {wedding.wedding_date && (
            <motion.div variants={slideUp} className="mt-14">
              <CountdownTimer
                targetDate={wedding.wedding_date}
                numberClassName="text-dearly-text"
                labelClassName="text-dearly-text-muted"
              />
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Story section */}
      {wedding.story_text && (
        <section className="mx-auto max-w-2xl px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-8 h-px w-12" style={{ backgroundColor: theme.colors.primary }} />
            <h2 className="mb-8 text-2xl font-bold uppercase tracking-widest" style={{ color: theme.colors.primary }}>
              Our Story
            </h2>
            <p className="whitespace-pre-line text-base leading-relaxed" style={{ color: theme.colors.accent }}>
              {wedding.story_text}
            </p>
          </motion.div>
        </section>
      )}
    </div>
  );
}

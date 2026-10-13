"use client";

/**
 * Eternal invitation page — classic elegant design with serif typography,
 * gold accents, subtle fade-in animations, and gentle parallax scrolling.
 */

import { motion } from "framer-motion";
import { MapPin, Calendar } from "lucide-react";
import CountdownTimer from "@/components/ui/CountdownTimer";
import type { InvitationPageProps } from "../types";

/** Staggered fade-in container for child elements. */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3, delayChildren: 0.2 },
  },
};

/** Individual element fade-in from below. */
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function EternalInvitationPage({ wedding, events: _events, theme }: InvitationPageProps) {
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
      style={{
        backgroundColor: theme.colors.secondary,
        fontFamily: `'${theme.fonts.body}', sans-serif`,
      }}
    >
      {/* Hero section */}
      <motion.section
        className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Decorative line */}
        <motion.div
          variants={itemVariants}
          className="mb-8 h-px w-24"
          style={{ backgroundColor: theme.colors.primary }}
        />

        <motion.p
          variants={itemVariants}
          className="mb-4 text-sm uppercase tracking-[0.3em]"
          style={{ color: theme.colors.primary }}
        >
          Together with their families
        </motion.p>

        <motion.h1
          variants={itemVariants}
          className="mb-2 text-5xl font-light md:text-7xl"
          style={{
            fontFamily: `'${theme.fonts.display}', serif`,
            color: theme.colors.primary,
          }}
        >
          {wedding.partner1_name}
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mb-2 text-2xl italic"
          style={{ color: theme.colors.accent, fontFamily: `'${theme.fonts.display}', serif` }}
        >
          &amp;
        </motion.p>

        <motion.h1
          variants={itemVariants}
          className="mb-8 text-5xl font-light md:text-7xl"
          style={{
            fontFamily: `'${theme.fonts.display}', serif`,
            color: theme.colors.primary,
          }}
        >
          {wedding.partner2_name}
        </motion.h1>

        <motion.div
          variants={itemVariants}
          className="mb-6 h-px w-24"
          style={{ backgroundColor: theme.colors.primary }}
        />

        <motion.p
          variants={itemVariants}
          className="text-sm uppercase tracking-[0.2em]"
          style={{ color: theme.colors.accent }}
        >
          Request the pleasure of your company
        </motion.p>

        {weddingDate && (
          <motion.div variants={itemVariants} className="mt-8 flex flex-col items-center gap-2">
            <Calendar size={20} style={{ color: theme.colors.primary }} />
            <p
              className="text-lg"
              style={{ color: theme.colors.primary, fontFamily: `'${theme.fonts.display}', serif` }}
            >
              {weddingDate}
            </p>
          </motion.div>
        )}

        {wedding.venue_name && (
          <motion.div variants={itemVariants} className="mt-4 flex flex-col items-center gap-2">
            <MapPin size={20} style={{ color: theme.colors.primary }} />
            <p className="text-base" style={{ color: theme.colors.accent }}>
              {wedding.venue_name}
            </p>
            {wedding.venue_address && (
              <p className="text-sm" style={{ color: theme.colors.accent, opacity: 0.7 }}>
                {wedding.venue_address}
              </p>
            )}
          </motion.div>
        )}

        {wedding.wedding_date && (
          <motion.div variants={itemVariants} className="mt-12">
            <CountdownTimer
              targetDate={wedding.wedding_date}
              numberClassName="text-dearly-text"
              labelClassName="text-dearly-text-muted"
            />
          </motion.div>
        )}
      </motion.section>

      {/* Story section */}
      {wedding.story_text && (
        <motion.section
          className="mx-auto max-w-2xl px-6 py-20 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
        >
          <h2
            className="mb-8 text-3xl"
            style={{ fontFamily: `'${theme.fonts.display}', serif`, color: theme.colors.primary }}
          >
            Our Story
          </h2>
          <p
            className="whitespace-pre-line text-base leading-relaxed"
            style={{ color: theme.colors.accent }}
          >
            {wedding.story_text}
          </p>
        </motion.section>
      )}
    </div>
  );
}

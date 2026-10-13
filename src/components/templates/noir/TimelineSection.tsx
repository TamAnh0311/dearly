"use client";

/**
 * Noir timeline — dark background with glowing ivory markers,
 * cinematic fade-in from below with spotlight glow on each event.
 */

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import type { TimelineSectionProps } from "../types";

export default function NoirTimelineSection({ events, theme }: TimelineSectionProps) {
  if (events.length === 0) return null;

  return (
    <section
      className="mx-auto max-w-2xl px-6 py-20"
      style={{ backgroundColor: theme.colors.secondary }}
    >
      <div className="mb-12 text-center">
        <div className="mx-auto mb-4 flex items-center justify-center gap-4">
          <div className="h-px w-12" style={{ backgroundColor: theme.colors.accent, opacity: 0.4 }} />
          <div className="h-1 w-1 rounded-full" style={{ backgroundColor: theme.colors.accent }} />
          <div className="h-px w-12" style={{ backgroundColor: theme.colors.accent, opacity: 0.4 }} />
        </div>
        <h2
          className="text-3xl font-light uppercase tracking-widest"
          style={{ fontFamily: `'${theme.fonts.display}', serif`, color: theme.colors.primary }}
        >
          The Programme
        </h2>
      </div>

      <div className="relative">
        {/* Glowing vertical connector */}
        <div
          className="absolute left-5 top-0 h-full w-px"
          style={{
            background: `linear-gradient(to bottom, transparent, ${theme.colors.primary}30, transparent)`,
          }}
        />

        <div className="flex flex-col gap-10">
          {events.map((event, i) => {
            const IconComponent = (LucideIcons as Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>>)[
              event.icon.charAt(0).toUpperCase() + event.icon.slice(1)
            ] ?? LucideIcons.Calendar;

            return (
              <motion.div
                key={event.id}
                className="flex gap-6"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.8, delay: i * 0.12 }}
              >
                {/* Glowing marker */}
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: `${theme.colors.primary}15`,
                    border: `1px solid ${theme.colors.primary}40`,
                    boxShadow: `0 0 16px ${theme.colors.primary}20`,
                  }}
                >
                  <IconComponent size={16} style={{ color: theme.colors.primary }} />
                </div>

                <div>
                  <h3
                    className="text-lg font-light uppercase tracking-widest"
                    style={{ color: theme.colors.primary, fontFamily: `'${theme.fonts.display}', serif` }}
                  >
                    {event.title}
                  </h3>
                  <p className="mt-1 text-xs uppercase tracking-wider" style={{ color: theme.colors.accent }}>
                    {new Date(event.start_time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                    {event.end_time && (
                      <> — {new Date(event.end_time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</>
                    )}
                  </p>
                  {event.location && (
                    <p className="mt-1 text-xs uppercase tracking-wider" style={{ color: theme.colors.accent, opacity: 0.6 }}>
                      {event.location}
                    </p>
                  )}
                  {event.description && (
                    <p className="mt-2 text-sm leading-loose" style={{ color: theme.colors.accent }}>
                      {event.description}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

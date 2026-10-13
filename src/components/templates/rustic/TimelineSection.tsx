"use client";

/**
 * Rustic timeline — hand-drawn dashed connecting line with earthy markers,
 * events revealed with a rough sketch-feel stagger.
 */

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import type { TimelineSectionProps } from "../types";

export default function RusticTimelineSection({ events, theme }: TimelineSectionProps) {
  if (events.length === 0) return null;

  return (
    <section className="mx-auto max-w-2xl px-6 py-20">
      <div className="mb-12 text-center">
        <div className="mb-3 flex items-center justify-center gap-4">
          <div className="h-px w-12" style={{ backgroundColor: theme.colors.accent, opacity: 0.4 }} />
          <span style={{ color: theme.colors.accent }}>✦</span>
          <div className="h-px w-12" style={{ backgroundColor: theme.colors.accent, opacity: 0.4 }} />
        </div>
        <h2
          className="text-4xl"
          style={{ fontFamily: `'${theme.fonts.display}', cursive`, color: theme.colors.primary }}
        >
          Schedule of Events
        </h2>
      </div>

      <div className="relative">
        {/* Hand-drawn dashed vertical line */}
        <div
          className="absolute left-5 top-0 h-full w-0.5"
          style={{
            backgroundImage: `repeating-linear-gradient(to bottom, ${theme.colors.accent}60 0px, ${theme.colors.accent}60 8px, transparent 8px, transparent 14px)`,
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
                initial={{ opacity: 0, x: -16, skewX: 2 }}
                whileInView={{ opacity: 1, x: 0, skewX: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, delay: i * 0.12 }}
              >
                {/* Rustic marker — diamond shape */}
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center"
                  style={{
                    backgroundColor: theme.colors.secondary,
                    border: `2px dashed ${theme.colors.accent}`,
                    transform: "rotate(45deg)",
                    borderRadius: "2px",
                  }}
                >
                  <div style={{ transform: "rotate(-45deg)" }}>
                    <IconComponent size={14} style={{ color: theme.colors.primary }} />
                  </div>
                </div>

                <div
                  className="flex-1 rounded-sm p-5"
                  style={{
                    backgroundColor: `${theme.colors.accent}10`,
                    border: `1px dashed ${theme.colors.accent}40`,
                  }}
                >
                  <h3
                    className="text-2xl"
                    style={{ fontFamily: `'${theme.fonts.display}', cursive`, color: theme.colors.primary }}
                  >
                    {event.title}
                  </h3>
                  <p className="mt-1 text-xs tracking-wider" style={{ color: theme.colors.accent }}>
                    {new Date(event.start_time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                    {event.end_time && (
                      <> – {new Date(event.end_time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</>
                    )}
                  </p>
                  {event.location && (
                    <p className="mt-1 text-xs" style={{ color: theme.colors.accent, opacity: 0.7 }}>
                      {event.location}
                    </p>
                  )}
                  {event.description && (
                    <p className="mt-2 text-xs leading-loose" style={{ color: theme.colors.accent }}>
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

"use client";

/**
 * Bloom timeline — floral dot markers with soft scale-reveal on scroll.
 * Each event card blooms into view with a spring transition.
 */

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import type { TimelineSectionProps } from "../types";

export default function BloomTimelineSection({ events, theme }: TimelineSectionProps) {
  if (events.length === 0) return null;

  return (
    <section className="mx-auto max-w-2xl px-6 py-20">
      <div className="mb-12 flex flex-col items-center gap-3 text-center">
        <span className="text-2xl" style={{ color: theme.colors.primary }}>✿</span>
        <h2
          className="text-3xl font-light"
          style={{ fontFamily: `'${theme.fonts.display}', serif`, color: theme.colors.primary }}
        >
          Schedule of Events
        </h2>
      </div>

      <div className="relative">
        {/* Soft vertical line */}
        <div
          className="absolute left-5 top-0 h-full w-0.5 rounded-full"
          style={{ background: `linear-gradient(to bottom, transparent, ${theme.colors.primary}60, transparent)` }}
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
                initial={{ opacity: 0, scale: 0.82 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Floral marker */}
                <div className="flex flex-col items-center">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm"
                    style={{ backgroundColor: theme.colors.primary, boxShadow: `0 0 0 4px ${theme.colors.primary}30` }}
                  >
                    <IconComponent size={16} style={{ color: theme.colors.secondary }} />
                  </div>
                </div>

                <div
                  className="flex-1 rounded-2xl p-5"
                  style={{ backgroundColor: `${theme.colors.primary}12`, border: `1px solid ${theme.colors.primary}25` }}
                >
                  <h3
                    className="text-lg font-medium"
                    style={{ color: theme.colors.primary, fontFamily: `'${theme.fonts.display}', serif` }}
                  >
                    {event.title}
                  </h3>
                  <p className="mt-1 text-sm" style={{ color: theme.colors.accent }}>
                    {new Date(event.start_time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                    {event.end_time && (
                      <> – {new Date(event.end_time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</>
                    )}
                  </p>
                  {event.location && (
                    <p className="mt-1 text-sm" style={{ color: theme.colors.accent, opacity: 0.7 }}>
                      {event.location}
                    </p>
                  )}
                  {event.description && (
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: theme.colors.accent }}>
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

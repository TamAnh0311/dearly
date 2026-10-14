"use client";

/**
 * Nordic timeline — clean vertical timeline with geometric nodes,
 * crisp borders, and precise slide-in animations.
 */

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import type { TimelineSectionProps } from "../types";

export default function NordicTimelineSection({ events, theme }: TimelineSectionProps) {
  if (events.length === 0) return null;

  return (
    <section
      className="mx-auto max-w-2xl px-6 py-20"
      style={{ backgroundColor: theme.colors.secondary }}
    >
      <h2
        className="mb-12 text-center text-3xl font-medium tracking-wide"
        style={{ fontFamily: `'${theme.fonts.display}', sans-serif`, color: theme.colors.primary }}
      >
        Schedule of Events
      </h2>

      <div className="relative">
        {/* Vertical connecting line — thin, precise */}
        <div
          className="absolute left-6 top-0 h-full w-px"
          style={{ backgroundColor: theme.colors.accent, opacity: 0.3 }}
        />

        <div className="flex flex-col gap-8">
          {events.map((event, i) => {
            const IconComponent = (LucideIcons as Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>>)[
              event.icon.charAt(0).toUpperCase() + event.icon.slice(1)
            ] ?? LucideIcons.Calendar;

            return (
              <motion.div
                key={event.id}
                className="flex gap-6 pl-2"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                {/* Square node — Nordic geometric */}
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center border"
                  style={{
                    borderColor: theme.colors.accent,
                    backgroundColor: theme.colors.secondary,
                  }}
                >
                  <IconComponent size={16} style={{ color: theme.colors.primary }} />
                </div>

                <div>
                  <h3
                    className="text-lg font-medium"
                    style={{ color: theme.colors.primary, fontFamily: `'${theme.fonts.display}', sans-serif` }}
                  >
                    {event.title}
                  </h3>
                  <p className="mt-1 text-sm" style={{ color: theme.colors.accent }}>
                    {new Date(event.start_time).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                    {event.end_time && (
                      <> &ndash; {new Date(event.end_time).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}</>
                    )}
                  </p>
                  {event.location && (
                    <p className="mt-1 text-sm" style={{ color: theme.colors.accent, opacity: 0.7 }}>
                      {event.location}
                    </p>
                  )}
                  {event.description && (
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: theme.colors.primary, opacity: 0.7 }}>
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

"use client";

/**
 * Sunset timeline — warm gradient vertical line with coral event cards,
 * wave-rise reveal on scroll.
 */

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import type { TimelineSectionProps } from "../types";

export default function SunsetTimelineSection({ events, theme }: TimelineSectionProps) {
  if (events.length === 0) return null;

  return (
    <section className="mx-auto max-w-2xl px-6 py-20" style={{ backgroundColor: theme.colors.secondary }}>
      <div className="mb-12 text-center">
        <div className="mx-auto mb-4 h-1 w-16 rounded-full" style={{ backgroundColor: theme.colors.accent }} />
        <h2
          className="text-3xl"
          style={{ fontFamily: `'${theme.fonts.display}', serif`, color: theme.colors.primary }}
        >
          Schedule
        </h2>
      </div>

      <div className="relative">
        {/* Warm gradient vertical line */}
        <div
          className="absolute left-5 top-0 h-full w-1 rounded-full"
          style={{
            background: `linear-gradient(to bottom, ${theme.colors.primary}, ${theme.colors.accent}, ${theme.colors.primary})`,
            opacity: 0.5,
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
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.8, delay: i * 0.12, ease: [0.34, 1.56, 0.64, 1] }}
              >
                {/* Sun-glow circular marker */}
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
                    boxShadow: `0 0 16px ${theme.colors.primary}50`,
                  }}
                >
                  <IconComponent size={16} style={{ color: "#fff" }} />
                </div>

                <div
                  className="flex-1 rounded-2xl p-5"
                  style={{
                    background: `linear-gradient(135deg, ${theme.colors.primary}12, ${theme.colors.accent}12)`,
                    border: `1px solid ${theme.colors.primary}25`,
                  }}
                >
                  <h3
                    className="text-lg"
                    style={{ fontFamily: `'${theme.fonts.display}', serif`, color: theme.colors.primary }}
                  >
                    {event.title}
                  </h3>
                  <p className="mt-1 text-sm" style={{ color: theme.colors.primary, opacity: 0.7 }}>
                    {new Date(event.start_time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                    {event.end_time && (
                      <> – {new Date(event.end_time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</>
                    )}
                  </p>
                  {event.location && (
                    <p className="mt-1 text-sm" style={{ color: theme.colors.accent, opacity: 0.8 }}>
                      {event.location}
                    </p>
                  )}
                  {event.description && (
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: theme.colors.primary, opacity: 0.75 }}>
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

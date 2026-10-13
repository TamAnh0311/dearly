"use client";

/**
 * Boho timeline — earth-toned vertical timeline with organic rounded cards,
 * handwritten headings, and gentle fade-in reveal on scroll.
 */

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import type { TimelineSectionProps } from "../types";

export default function BohoTimelineSection({ events, theme }: TimelineSectionProps) {
  if (events.length === 0) return null;

  return (
    <section
      className="mx-auto max-w-2xl px-6 py-20"
      style={{ backgroundColor: theme.colors.secondary }}
    >
      <div className="mb-12 text-center">
        <h2
          className="text-4xl"
          style={{ fontFamily: `'${theme.fonts.display}', cursive`, color: theme.colors.primary }}
        >
          The Day
        </h2>
        <svg viewBox="0 0 160 8" className="mx-auto mt-3" style={{ width: 120, height: 8 }}>
          <path
            d="M0 4 Q20 0 40 4 Q60 8 80 4 Q100 0 120 4 Q140 8 160 4"
            stroke={theme.colors.primary}
            strokeWidth="1"
            fill="none"
            opacity="0.4"
          />
        </svg>
      </div>

      <div className="relative">
        {/* Organic vertical connector */}
        <div
          className="absolute left-6 top-0 h-full w-px"
          style={{ backgroundColor: theme.colors.primary, opacity: 0.25 }}
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
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  <IconComponent size={18} style={{ color: theme.colors.secondary }} />
                </div>

                <div
                  className="flex-1 rounded-xl p-5"
                  style={{ backgroundColor: "#FFF8F0" }}
                >
                  <h3
                    className="text-xl"
                    style={{ color: theme.colors.primary, fontFamily: `'${theme.fonts.display}', cursive` }}
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
                    <p className="mt-1 text-sm" style={{ color: theme.colors.accent, opacity: 0.65 }}>
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

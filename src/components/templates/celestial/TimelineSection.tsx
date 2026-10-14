"use client";

/**
 * Celestial timeline — vertical timeline with constellation-style
 * connecting line and star markers, events fade in on scroll.
 */

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import type { TimelineSectionProps } from "../types";

/** Small star SVG used as a timeline node marker. */
function StarMarker({ color, size = 28 }: { color: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill={color} style={{ width: size, height: size }}>
      <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4 5.6 21.2 8 14 2 9.2h7.6z" />
    </svg>
  );
}

export default function CelestialTimelineSection({ events, theme }: TimelineSectionProps) {
  if (events.length === 0) return null;

  return (
    <section
      className="mx-auto max-w-2xl px-6 py-20"
      style={{ fontFamily: `'${theme.fonts.body}', sans-serif` }}
    >
      <h2
        className="mb-12 text-center text-3xl tracking-wide"
        style={{
          fontFamily: `'${theme.fonts.display}', serif`,
          color: theme.colors.primary,
        }}
      >
        Schedule of Events
      </h2>

      <div className="relative">
        {/* Constellation-style connecting line */}
        <div
          className="absolute left-5 top-0 h-full w-px"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${theme.colors.primary}60 10%, ${theme.colors.primary}60 90%, transparent 100%)`,
          }}
        />

        <div className="flex flex-col gap-8">
          {events.map((event, i) => {
            const _IconComponent = (LucideIcons as Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>>)[
              event.icon.charAt(0).toUpperCase() + event.icon.slice(1)
            ] ?? LucideIcons.Calendar;

            return (
              <motion.div
                key={event.id}
                className="flex gap-6 pl-0"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                {/* Star marker node */}
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center">
                  <StarMarker color={theme.colors.primary} />
                </div>

                <div>
                  <h3
                    className="text-lg font-semibold"
                    style={{
                      color: theme.colors.primary,
                      fontFamily: `'${theme.fonts.display}', serif`,
                    }}
                  >
                    {event.title}
                  </h3>
                  <p className="mt-1 text-sm" style={{ color: theme.colors.accent }}>
                    {new Date(event.start_time).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                    {event.end_time && (
                      <> – {new Date(event.end_time).toLocaleTimeString("en-US", {
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

"use client";

/**
 * Seaside timeline — vertical timeline with ocean-blue connecting line,
 * shell-shaped icons, and wave-inspired reveal animations.
 */

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import type { TimelineSectionProps } from "../types";

export default function SeasideTimelineSection({ events, theme }: TimelineSectionProps) {
  if (events.length === 0) return null;

  return (
    <section className="mx-auto max-w-2xl px-6 py-20">
      <h2
        className="mb-12 text-center text-3xl"
        style={{ fontFamily: `'${theme.fonts.display}', serif`, color: theme.colors.primary }}
      >
        Schedule of Events
      </h2>

      <div className="relative">
        {/* Vertical connecting line — ocean blue */}
        <div
          className="absolute left-6 top-0 h-full w-px"
          style={{ backgroundColor: theme.colors.primary, opacity: 0.2 }}
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
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2"
                  style={{
                    borderColor: theme.colors.primary,
                    backgroundColor: "#F5E6D3",
                  }}
                >
                  <IconComponent size={18} style={{ color: theme.colors.primary }} />
                </div>

                <div>
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: theme.colors.primary, fontFamily: `'${theme.fonts.display}', serif` }}
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

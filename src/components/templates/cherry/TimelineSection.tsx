"use client";

/**
 * Cherry timeline — vertical timeline with sakura-pink connecting line,
 * blossom nodes, and gentle fade-in animations.
 */

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import type { TimelineSectionProps } from "../types";

export default function CherryTimelineSection({ events, theme }: TimelineSectionProps) {
  if (events.length === 0) return null;

  return (
    <section className="mx-auto max-w-2xl px-6 py-20">
      <h2
        className="mb-12 text-center text-3xl tracking-wide"
        style={{ fontFamily: `'${theme.fonts.display}', serif`, color: theme.colors.accent }}
      >
        Schedule of Events
      </h2>

      <div className="relative">
        {/* Vertical connecting line — sakura pink */}
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
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.12 }}
              >
                <div
                  className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  <IconComponent size={18} style={{ color: "#FFF5F7" }} />
                  {/* Blossom glow ring */}
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      boxShadow: `0 0 12px ${theme.colors.primary}40`,
                    }}
                  />
                </div>

                <div>
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: theme.colors.accent, fontFamily: `'${theme.fonts.display}', serif` }}
                  >
                    {event.title}
                  </h3>
                  <p className="mt-1 text-sm" style={{ color: theme.colors.primary }}>
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
                    <p className="mt-1 text-sm" style={{ color: theme.colors.accent, opacity: 0.6 }}>
                      {event.location}
                    </p>
                  )}
                  {event.description && (
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: theme.colors.accent, opacity: 0.8 }}>
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

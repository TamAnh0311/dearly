"use client";

/**
 * Garden timeline — vine-like curved connecting path with leaf markers,
 * gentle stagger reveal on scroll.
 */

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import type { TimelineSectionProps } from "../types";

export default function GardenTimelineSection({ events, theme }: TimelineSectionProps) {
  if (events.length === 0) return null;

  return (
    <section className="mx-auto max-w-2xl px-6 py-20" style={{ backgroundColor: theme.colors.secondary }}>
      <div className="mb-12 text-center">
        <div className="mb-4 flex items-center justify-center gap-4">
          <div className="h-px w-12" style={{ backgroundColor: theme.colors.primary, opacity: 0.4 }} />
          <span>🌿</span>
          <div className="h-px w-12" style={{ backgroundColor: theme.colors.primary, opacity: 0.4 }} />
        </div>
        <h2
          className="text-3xl"
          style={{ fontFamily: `'${theme.fonts.display}', serif`, color: theme.colors.primary }}
        >
          Schedule
        </h2>
      </div>

      <div className="relative">
        {/* Vine-like vertical line — wavy gradient */}
        <div
          className="absolute left-5 top-0 h-full w-0.5"
          style={{
            background: `repeating-linear-gradient(
              to bottom,
              ${theme.colors.primary}70 0px, ${theme.colors.primary}30 20px,
              ${theme.colors.accent}50 40px, ${theme.colors.primary}70 60px
            )`,
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
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Leaf-style marker */}
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: theme.colors.primary,
                    boxShadow: `0 0 0 3px ${theme.colors.secondary}, 0 0 0 5px ${theme.colors.primary}40`,
                  }}
                >
                  <IconComponent size={16} style={{ color: theme.colors.secondary }} />
                </div>

                <div
                  className="flex-1 rounded-2xl p-5"
                  style={{
                    backgroundColor: `${theme.colors.primary}10`,
                    border: `1px solid ${theme.colors.primary}25`,
                  }}
                >
                  <h3
                    className="text-xl"
                    style={{ fontFamily: `'${theme.fonts.display}', serif`, color: theme.colors.primary }}
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

"use client";

/**
 * Whimsical timeline — vertical timeline with magical glowing markers,
 * enchanted connecting line, and dreamy float-in animations.
 */

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import type { TimelineSectionProps } from "../types";

export default function WhimsicalTimelineSection({ events, theme }: TimelineSectionProps) {
  if (events.length === 0) return null;

  return (
    <section
      className="mx-auto max-w-2xl px-6 py-20"
      style={{ fontFamily: `'${theme.fonts.body}', sans-serif` }}
    >
      <h2
        className="mb-12 text-center text-3xl"
        style={{
          fontFamily: `'${theme.fonts.display}', serif`,
          color: theme.colors.primary,
        }}
      >
        Schedule of Events
      </h2>

      <div className="relative">
        {/* Enchanted glowing connecting line */}
        <div
          className="absolute left-6 top-0 h-full w-px"
          style={{
            background: `linear-gradient(180deg, ${theme.colors.primary}20 0%, ${theme.colors.primary}50 20%, ${theme.colors.accent}40 50%, ${theme.colors.primary}50 80%, ${theme.colors.primary}20 100%)`,
          }}
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
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
              >
                {/* Glowing magical marker */}
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      backgroundColor: `${theme.colors.primary}20`,
                      boxShadow: `0 0 12px ${theme.colors.primary}30`,
                    }}
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.5,
                    }}
                  />
                  <div
                    className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full"
                    style={{ backgroundColor: theme.colors.primary }}
                  >
                    <IconComponent size={16} style={{ color: theme.colors.secondary }} />
                  </div>
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

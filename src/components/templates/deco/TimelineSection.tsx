"use client";

/**
 * Deco timeline — geometric step markers with gold diamond connectors,
 * events build in sequentially from the left.
 */

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import type { TimelineSectionProps } from "../types";

export default function DecoTimelineSection({ events, theme }: TimelineSectionProps) {
  if (events.length === 0) return null;

  return (
    <section className="mx-auto max-w-2xl px-6 py-20" style={{ backgroundColor: theme.colors.secondary }}>
      <div className="mb-12 text-center">
        <div className="mb-4 flex items-center justify-center gap-6">
          <div className="h-px w-16" style={{ backgroundColor: theme.colors.primary, opacity: 0.5 }} />
          <div className="h-3 w-3 rotate-45" style={{ backgroundColor: theme.colors.primary }} />
          <div className="h-px w-16" style={{ backgroundColor: theme.colors.primary, opacity: 0.5 }} />
        </div>
        <h2
          className="text-4xl font-light uppercase tracking-[0.3em]"
          style={{ fontFamily: `'${theme.fonts.display}', sans-serif`, color: theme.colors.primary }}
        >
          Programme
        </h2>
      </div>

      <div className="relative">
        {/* Gold vertical connector */}
        <div
          className="absolute left-5 top-0 h-full w-px"
          style={{ background: `linear-gradient(to bottom, transparent, ${theme.colors.primary}80, transparent)` }}
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
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Gold diamond marker */}
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center"
                  style={{
                    backgroundColor: theme.colors.primary,
                    transform: "rotate(45deg)",
                    boxShadow: `0 0 12px ${theme.colors.primary}60`,
                  }}
                >
                  <div style={{ transform: "rotate(-45deg)" }}>
                    <IconComponent size={14} style={{ color: theme.colors.secondary }} />
                  </div>
                </div>

                <div
                  className="flex-1 p-5"
                  style={{
                    border: `1px solid ${theme.colors.primary}30`,
                    backgroundColor: `${theme.colors.primary}08`,
                  }}
                >
                  <h3
                    className="text-xl font-light uppercase tracking-widest"
                    style={{ color: theme.colors.primary, fontFamily: `'${theme.fonts.display}', sans-serif` }}
                  >
                    {event.title}
                  </h3>
                  <p className="mt-2 text-xs uppercase tracking-wider" style={{ color: theme.colors.accent }}>
                    {new Date(event.start_time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                    {event.end_time && (
                      <> — {new Date(event.end_time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</>
                    )}
                  </p>
                  {event.location && (
                    <p className="mt-1 text-xs uppercase tracking-wider" style={{ color: theme.colors.accent, opacity: 0.6 }}>
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

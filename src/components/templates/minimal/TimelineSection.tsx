"use client";

/**
 * Minimal timeline — clean horizontal layout on larger screens,
 * vertical on mobile, with precise geometric step markers.
 */

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import type { TimelineSectionProps } from "../types";

export default function MinimalTimelineSection({ events, theme }: TimelineSectionProps) {
  if (events.length === 0) return null;

  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <div className="mb-12">
        <div className="mb-4 h-px w-12" style={{ backgroundColor: theme.colors.primary }} />
        <h2 className="text-2xl font-bold uppercase tracking-widest" style={{ color: theme.colors.primary }}>
          Schedule
        </h2>
      </div>

      <div className="flex flex-col gap-0">
        {events.map((event, i) => {
          const IconComponent = (LucideIcons as Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>>)[
            event.icon.charAt(0).toUpperCase() + event.icon.slice(1)
          ] ?? LucideIcons.Calendar;

          return (
            <motion.div
              key={event.id}
              className="flex gap-8 border-b py-8"
              style={{ borderColor: `${theme.colors.primary}15` }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Step number */}
              <div className="flex shrink-0 flex-col items-center">
                <span
                  className="text-4xl font-bold tabular-nums"
                  style={{ color: `${theme.colors.primary}18`, fontVariantNumeric: "tabular-nums" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="flex flex-1 items-start gap-4">
                <div
                  className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  <IconComponent size={14} style={{ color: theme.colors.secondary }} />
                </div>
                <div>
                  <h3 className="text-base font-semibold uppercase tracking-wider" style={{ color: theme.colors.primary }}>
                    {event.title}
                  </h3>
                  <p className="mt-1 text-sm" style={{ color: theme.colors.accent }}>
                    {new Date(event.start_time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                    {event.end_time && (
                      <> – {new Date(event.end_time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</>
                    )}
                  </p>
                  {event.location && (
                    <p className="mt-1 text-sm uppercase tracking-wide" style={{ color: theme.colors.accent, opacity: 0.6 }}>
                      {event.location}
                    </p>
                  )}
                  {event.description && (
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: theme.colors.accent }}>
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

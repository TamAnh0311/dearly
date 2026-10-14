"use client";

/**
 * Vintage timeline — vertical timeline with ornate sepia-toned markers,
 * filigree connecting accents, and elegant fade-in reveals.
 */

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import type { TimelineSectionProps } from "../types";

export default function VintageTimelineSection({ events, theme }: TimelineSectionProps) {
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
        {/* Ornate connecting line */}
        <div
          className="absolute left-6 top-0 h-full w-px"
          style={{
            background: `repeating-linear-gradient(180deg, ${theme.colors.primary}40 0px, ${theme.colors.primary}40 8px, transparent 8px, transparent 14px)`,
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
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                {/* Ornate circular marker */}
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
                  <div
                    className="absolute inset-0 rounded-full border-2"
                    style={{ borderColor: theme.colors.primary }}
                  />
                  <div
                    className="absolute inset-1 rounded-full border"
                    style={{ borderColor: `${theme.colors.accent}60` }}
                  />
                  <IconComponent size={16} style={{ color: theme.colors.primary }} />
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
                    <p className="mt-1 text-sm italic" style={{ color: theme.colors.accent, opacity: 0.7 }}>
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

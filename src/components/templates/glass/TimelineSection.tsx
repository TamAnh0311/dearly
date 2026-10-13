"use client";

/**
 * Glass timeline — frosted glass event cards on gradient background,
 * floating-in reveal with blur transition on scroll.
 */

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import type { TimelineSectionProps } from "../types";

export default function GlassTimelineSection({ events, theme }: TimelineSectionProps) {
  if (events.length === 0) return null;

  return (
    <section
      className="px-6 py-20"
      style={{ background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.accent} 100%)` }}
    >
      <div className="mx-auto max-w-2xl">
        <div className="mb-12 text-center">
          <h2
            className="text-3xl font-bold text-white"
            style={{ fontFamily: `'${theme.fonts.display}', sans-serif` }}
          >
            Schedule
          </h2>
          <div className="mx-auto mt-3 h-px w-24 bg-white/30" />
        </div>

        <div className="relative">
          {/* Frosted vertical connector */}
          <div
            className="absolute left-5 top-0 h-full w-px"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.3), transparent)" }}
          />

          <div className="flex flex-col gap-8">
            {events.map((event, i) => {
              const IconComponent = (LucideIcons as Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>>)[
                event.icon.charAt(0).toUpperCase() + event.icon.slice(1)
              ] ?? LucideIcons.Calendar;

              return (
                <motion.div
                  key={event.id}
                  className="flex gap-6"
                  initial={{ opacity: 0, x: -30, filter: "blur(8px)" }}
                  whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Glass marker */}
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                    style={{
                      backdropFilter: "blur(10px)",
                      backgroundColor: "rgba(255,255,255,0.2)",
                      border: "1px solid rgba(255,255,255,0.35)",
                    }}
                  >
                    <IconComponent size={16} style={{ color: "white" }} />
                  </div>

                  {/* Frosted card */}
                  <div
                    className="flex-1 rounded-2xl p-5"
                    style={{
                      backdropFilter: "blur(16px)",
                      WebkitBackdropFilter: "blur(16px)",
                      backgroundColor: "rgba(255,255,255,0.12)",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    <h3
                      className="text-lg font-semibold text-white"
                      style={{ fontFamily: `'${theme.fonts.display}', sans-serif` }}
                    >
                      {event.title}
                    </h3>
                    <p className="mt-1 text-sm text-white/70">
                      {new Date(event.start_time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                      {event.end_time && (
                        <> – {new Date(event.end_time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</>
                      )}
                    </p>
                    {event.location && (
                      <p className="mt-1 text-sm text-white/55">{event.location}</p>
                    )}
                    {event.description && (
                      <p className="mt-2 text-sm leading-relaxed text-white/65">{event.description}</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

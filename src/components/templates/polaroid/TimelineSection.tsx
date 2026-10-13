"use client";

/**
 * Polaroid timeline — each event in a polaroid-frame card with tilt,
 * stacking/scattering animation on scroll reveal.
 */

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import type { TimelineSectionProps } from "../types";

const tilts = [-2, 1, -1, 2, -1.5, 1.5, -2, 1];

export default function PolaroidTimelineSection({ events, theme }: TimelineSectionProps) {
  if (events.length === 0) return null;

  return (
    <section className="mx-auto max-w-2xl px-6 py-20" style={{ backgroundColor: theme.colors.secondary }}>
      <div className="mb-12 text-center">
        <div className="mx-auto mb-2 h-4 w-20 opacity-70" style={{ backgroundColor: theme.colors.accent }} />
        <h2
          className="text-4xl"
          style={{ fontFamily: `'${theme.fonts.display}', cursive`, color: theme.colors.primary }}
        >
          The Day
        </h2>
      </div>

      <div className="flex flex-col gap-8">
        {events.map((event, i) => {
          const IconComponent = (LucideIcons as Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>>)[
            event.icon.charAt(0).toUpperCase() + event.icon.slice(1)
          ] ?? LucideIcons.Calendar;

          const tilt = tilts[i % tilts.length];

          return (
            <motion.div
              key={event.id}
              style={{
                backgroundColor: "#fff",
                boxShadow: "4px 4px 14px rgba(0,0,0,0.12)",
                padding: "16px 16px 36px",
                rotate: tilt,
              }}
              initial={{ opacity: 0, y: 40, rotate: tilt + 8 }}
              whileInView={{ opacity: 1, y: 0, rotate: tilt }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ type: "spring", stiffness: 80, damping: 14, delay: i * 0.1 }}
              whileHover={{ rotate: 0, scale: 1.02, transition: { duration: 0.2 } }}
            >
              {/* "Photo" area */}
              <div
                className="mb-4 flex items-center justify-center gap-3 p-6"
                style={{ backgroundColor: `${theme.colors.primary}10` }}
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: theme.colors.accent }}
                >
                  <IconComponent size={18} style={{ color: "#fff" }} />
                </div>
                <div>
                  <h3
                    className="text-2xl"
                    style={{ fontFamily: `'${theme.fonts.display}', cursive`, color: theme.colors.primary }}
                  >
                    {event.title}
                  </h3>
                  <p className="text-xs" style={{ color: theme.colors.accent }}>
                    {new Date(event.start_time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                    {event.end_time && (
                      <> – {new Date(event.end_time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</>
                    )}
                  </p>
                </div>
              </div>

              {/* Handwritten caption */}
              {(event.location || event.description) && (
                <p
                  className="text-center text-sm"
                  style={{ fontFamily: `'${theme.fonts.display}', cursive`, color: theme.colors.primary, opacity: 0.75 }}
                >
                  {event.location ?? event.description}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

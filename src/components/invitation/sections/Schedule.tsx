"use client";

/**
 * Schedule — vertical timeline of the day's events. The centre line draws
 * itself as you scroll; each event card slides in from alternating sides.
 */

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Camera,
  Church,
  Clock,
  GlassWater,
  Heart,
  Music,
  Sparkles,
  Utensils,
  Wine,
  type LucideIcon,
} from "lucide-react";
import type { WeddingEventRow } from "@/types/database";
import { SectionHeading } from "./Primitives";
import { EASE_OUT, alpha, formatTime, type InvitationPalette } from "../utils";

const ICONS: Record<string, LucideIcon> = {
  heart: Heart,
  ring: Heart,
  ceremony: Church,
  church: Church,
  glass: GlassWater,
  cocktail: Wine,
  wine: Wine,
  music: Music,
  party: Music,
  dinner: Utensils,
  food: Utensils,
  camera: Camera,
  photo: Camera,
};

/** Resolves an event icon name to a Lucide icon, defaulting to Sparkles. */
function iconFor(name: string): LucideIcon {
  return ICONS[name?.toLowerCase()] ?? Sparkles;
}

export default function Schedule({ events, palette, timeZone }: { events: WeddingEventRow[]; palette: InvitationPalette; timeZone?: string | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="schedule" className="relative px-6 py-28 md:py-36" style={{ backgroundColor: palette.surface }}>
      <SectionHeading eyebrow="The celebration" title="Order of the Day" palette={palette} />

      <div ref={ref} className="relative mx-auto max-w-4xl">
        {/* Track + animated fill */}
        <div className="absolute bottom-0 left-6 top-0 w-px md:left-1/2" style={{ backgroundColor: alpha(palette.primary, 0.15) }} />
        <motion.div
          className="absolute bottom-0 left-6 top-0 w-px md:left-1/2"
          style={{ backgroundColor: palette.primary, scaleY: lineScale, originY: 0 }}
        />

        <ol className="space-y-14 md:space-y-20">
          {events.map((ev, i) => {
            const Icon = iconFor(ev.icon);
            const right = i % 2 === 1;
            return (
              <li key={ev.id} className="relative md:grid md:grid-cols-2 md:gap-16">
                {/* Node */}
                <motion.div
                  className="absolute left-6 top-2 z-10 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border md:left-1/2"
                  style={{ backgroundColor: palette.background, borderColor: palette.primary, color: palette.primary }}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ type: "spring", stiffness: 220, damping: 16 }}
                >
                  <Icon size={18} />
                </motion.div>

                <motion.div
                  className={`ml-16 md:ml-0 ${right ? "md:col-start-2" : "md:col-start-1 md:text-right"}`}
                  initial={{ opacity: 0, x: right ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.9, ease: EASE_OUT }}
                >
                  <p className="text-2xl" style={{ fontFamily: palette.scriptFont, color: palette.primary }}>
                    {formatTime(ev.start_time, timeZone)}
                    {ev.end_time ? ` – ${formatTime(ev.end_time, timeZone)}` : ""}
                  </p>
                  <h3
                    className="mt-1 text-2xl uppercase tracking-[0.12em] md:text-3xl"
                    style={{ fontFamily: palette.displayFont, color: palette.ink }}
                  >
                    {ev.title}
                  </h3>
                  {ev.description && (
                    <p className="mt-3 leading-relaxed" style={{ color: palette.inkMuted }}>
                      {ev.description}
                    </p>
                  )}
                  {ev.location && (
                    <p
                      className={`mt-3 text-xs uppercase tracking-[0.2em] ${right ? "" : "md:text-right"}`}
                      style={{ color: palette.inkMuted }}
                    >
                      {ev.location}
                    </p>
                  )}
                </motion.div>
              </li>
            );
          })}
        </ol>

        <div className="mt-14 flex justify-center">
          <span className="flex items-center gap-2 text-xs uppercase tracking-[0.3em]" style={{ color: palette.inkMuted }}>
            <Clock size={14} /> Times are local
          </span>
        </div>
      </div>
    </section>
  );
}

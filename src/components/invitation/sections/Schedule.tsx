"use client";

/**
 * Schedule — vertical timeline of the day's events. The centre line draws
 * itself as you scroll; each event card slides in from alternating sides.
 */

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Clock } from "lucide-react";
import type { WeddingEventRow } from "@/types/database";
import { SectionHeading } from "./Primitives";
import { useInvitationCopy } from "./HeroParts";
import { EASE_OUT, alpha, formatTime, type InvitationPalette } from "../utils";
import { BotanicalVine, ChateauCorners } from "./ChateauDecor";

export default function Schedule({ events, palette, timeZone }: { events: WeddingEventRow[]; palette: InvitationPalette; timeZone?: string | null }) {
  const ui = useInvitationCopy();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const atelier = palette.style.hero === "atelier";
  const chateau = palette.style.hero === "chateau";

  return (
    <section id="schedule" className="relative overflow-hidden px-6 py-28 md:py-36" style={{ backgroundColor: palette.surface }}>
      {chateau && <ChateauCorners palette={palette} />}
      <SectionHeading eyebrow={ui.schedule.eyebrow} title={ui.schedule.title} palette={palette} />

      {atelier || chateau ? (
        <div ref={ref} className="relative mx-auto max-w-xl">
          {chateau && (
            <div className="pointer-events-none absolute -left-4 top-0 bottom-0 hidden md:block" aria-hidden>
              <BotanicalVine palette={palette} height={Math.max(450, events.length * 120)} />
            </div>
          )}
          <ol>
            {events.map((ev, i) => (
              <motion.li
                key={ev.id}
                className="grid grid-cols-[6rem_1fr] items-start gap-5 border-b py-6 md:grid-cols-[8rem_1fr] md:gap-8 md:py-7"
                style={{ borderColor: alpha(palette.primary, 0.18) }}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, delay: i * 0.08, ease: EASE_OUT }}
              >
                <div className="relative text-right">
                  {chateau && (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      className="pointer-events-none absolute -left-7 top-1.5"
                      aria-hidden
                    >
                      <ellipse cx="9" cy="9" rx="3.5" ry="7" fill={alpha(palette.leaf, 0.5)} transform="rotate(-30 9 9)" />
                      <ellipse cx="9" cy="9" rx="3.5" ry="7" fill={alpha(palette.leaf, 0.35)} transform="rotate(30 9 9)" />
                      <circle cx="9" cy="9" r="1.5" fill={alpha(palette.primary, 0.5)} />
                    </svg>
                  )}
                  <p className="whitespace-nowrap text-xl tracking-[0.02em] md:text-2xl" style={{ fontFamily: palette.displayFont, color: palette.primary }}>
                    {formatTime(ev.start_time, timeZone, ui.dateLocale)}
                  </p>
                  {ev.end_time && (
                    <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em]" style={{ color: palette.inkMuted }}>
                      {formatTime(ev.end_time, timeZone, ui.dateLocale)}
                    </p>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] md:text-base" style={{ fontFamily: palette.bodyFont, color: palette.ink }}>
                    {ev.title}
                  </h3>
                  {ev.description && (
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: palette.inkMuted }}>
                      {ev.description}
                    </p>
                  )}
                  {ev.location && (
                    <p className="mt-2 text-[10px] uppercase tracking-[0.2em]" style={{ color: palette.primary }}>
                      {ev.location}
                    </p>
                  )}
                </div>
              </motion.li>
            ))}
          </ol>
          <div className="mt-10 flex justify-center">
            <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em]" style={{ color: palette.inkMuted }}>
              <Clock size={13} /> {ui.schedule.timesLocal}
            </span>
          </div>
        </div>
      ) : (
      <div ref={ref} className="relative mx-auto max-w-4xl">
        {/* Track + animated fill */}
        <div className="absolute bottom-0 left-6 top-0 w-px md:left-1/2" style={{ backgroundColor: alpha(palette.primary, 0.15) }} />
        <motion.div
          className="absolute bottom-0 left-6 top-0 w-px md:left-1/2"
          style={{ backgroundColor: palette.primary, scaleY: lineScale, originY: 0 }}
        />

        <ol className="space-y-14 md:space-y-20">
          {events.map((ev, i) => {
            const right = i % 2 === 1;
            return (
              <li key={ev.id} className="relative md:grid md:grid-cols-2 md:gap-16">
                {/* Dot on the timeline */}
                <motion.div
                  className="absolute left-6 top-3 z-10 h-3 w-3 -translate-x-1/2 rounded-full md:left-1/2"
                  style={{ backgroundColor: palette.primary }}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ type: "spring", stiffness: 220, damping: 16 }}
                />

                <motion.div
                  className={`ml-16 md:ml-0 ${right ? "md:col-start-2" : "md:col-start-1 md:text-right"}`}
                  initial={{ opacity: 0, x: right ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.9, ease: EASE_OUT }}
                >
                  <p className="text-2xl" style={{ fontFamily: palette.scriptFont, color: palette.primary }}>
                    {formatTime(ev.start_time, timeZone, ui.dateLocale)}
                    {ev.end_time ? ` – ${formatTime(ev.end_time, timeZone, ui.dateLocale)}` : ""}
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
            <Clock size={14} /> {ui.schedule.timesLocal}
          </span>
        </div>
      </div>
      )}
    </section>
  );
}

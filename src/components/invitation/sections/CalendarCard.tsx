"use client";

/**
 * CalendarCard — month grid with the event day circled by a heart and a
 * faint year watermark, as on Chinese / Japanese / Korean / Vietnamese
 * invitations. Shown in the countdown section when `style.calendar` is on.
 */

import { motion, useReducedMotion } from "framer-motion";
import { monthGrid } from "@/lib/invitation-extras";
import { alpha, luminance, mix, parseWeddingDate, type InvitationPalette } from "../utils";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Month calendar card with the event day highlighted; `daysLeft` adds a D-day chip. */
export default function CalendarCard({ date, palette, daysLeft }: { date: string; palette: InvitationPalette; daysLeft?: number | null }) {
  const reduce = useReducedMotion();
  const d = parseWeddingDate(date);
  const day = d.getDate();
  const cells = monthGrid(d);
  const month = d.toLocaleDateString("en-US", { month: "long" });
  const headInk = luminance(palette.primary) > 0.45 ? mix(palette.primary, "#000000", 0.75) : "#ffffff";
  const card = palette.isDark ? mix(palette.background, "#ffffff", 0.06) : mix(palette.background, "#ffffff", 0.7);

  return (
    <div
      className="relative mx-auto w-full max-w-sm overflow-hidden border"
      style={{ borderRadius: palette.radius.card, borderColor: alpha(palette.primary, 0.3), background: card, boxShadow: `0 24px 50px -30px ${alpha(palette.primary, 0.6)}` }}
    >
      <div className="flex items-baseline justify-between px-5 py-3" style={{ background: palette.primary, color: headInk }}>
        <span className="text-2xl" style={{ fontFamily: palette.displayFont }}>
          {month}
        </span>
        <span className="text-sm tracking-[0.3em]">{d.getFullYear()}</span>
      </div>

      <div className="relative px-4 pb-5 pt-3">
        {/* Year watermark */}
        <span aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center text-[5.5rem] font-light leading-none" style={{ fontFamily: palette.displayFont, color: alpha(palette.primary, 0.1) }}>
          {d.getFullYear()}
        </span>
        <div className="relative grid grid-cols-7 gap-y-1 text-center text-sm" role="grid" aria-label={`${month} ${d.getFullYear()}`}>
          {WEEKDAYS.map((w, i) => (
            <span key={w} className="pb-1 text-[10px] uppercase tracking-wider" style={{ color: i === 6 ? palette.primary : palette.inkMuted }}>
              {w}
            </span>
          ))}
          {cells.map((n, i) =>
            n === null ? (
              <span key={`b${i}`} />
            ) : n === day ? (
              <span key={n} className="relative flex h-9 items-center justify-center" aria-current="date">
                <motion.svg
                  viewBox="0 0 24 24"
                  className="absolute h-10 w-10"
                  aria-hidden
                  initial={{ scale: reduce ? 1 : 0 }}
                  whileInView={{ scale: reduce ? 1 : [0, 1.25, 1] }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.4 }}
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={palette.primary} />
                </motion.svg>
                <span className="relative text-sm font-semibold" style={{ color: headInk }}>
                  {n}
                </span>
              </span>
            ) : (
              <span key={n} className="flex h-9 items-center justify-center" style={{ color: i % 7 === 6 ? palette.primary : palette.ink }}>
                {n}
              </span>
            )
          )}
        </div>
        {typeof daysLeft === "number" && daysLeft > 0 && (
          <p className="relative mt-3 text-center text-xs uppercase tracking-[0.3em]" style={{ color: palette.inkMuted }} suppressHydrationWarning>
            D-{daysLeft}
          </p>
        )}
      </div>
    </div>
  );
}

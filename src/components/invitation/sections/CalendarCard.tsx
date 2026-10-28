"use client";

/**
 * CalendarCard — month grid with the event day circled by a heart and a
 * faint year watermark. Atelier templates get an arched, double-ruled card
 * in the style of a printed Vietnamese / East Asian invitation.
 */

import { motion, useReducedMotion } from "framer-motion";
import { monthGrid } from "@/lib/invitation-extras";
import { useEventCopy } from "./HeroParts";
import { invitationLocale } from "../i18n";
import { alpha, luminance, mix, parseWeddingDate, type InvitationPalette } from "../utils";
import { GoldenArchFrame } from "./ChateauDecor";

const WEEKDAYS_EN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEKDAYS_VI = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

/** Month calendar card with the event day highlighted; `daysLeft` adds a D-day chip. */
export default function CalendarCard({ date, palette, daysLeft }: { date: string; palette: InvitationPalette; daysLeft?: number | null }) {
  const { lang } = useEventCopy();
  const locale = invitationLocale(lang);
  const weekdays = lang === "vi" ? WEEKDAYS_VI : WEEKDAYS_EN;
  const reduce = useReducedMotion();
  const d = parseWeddingDate(date);
  const day = d.getDate();
  const cells = monthGrid(d);
  const rawMonth = d.toLocaleDateString(locale, { month: "long" });
  const month = rawMonth.charAt(0).toUpperCase() + rawMonth.slice(1);
  const headInk = luminance(palette.primary) > 0.45 ? mix(palette.primary, "#000000", 0.75) : "#ffffff";
  const atelier = palette.style.hero === "atelier";
  const chateau = palette.style.hero === "chateau";
  const arched = atelier || chateau;
  const card = arched
    ? palette.isDark
      ? mix(palette.background, "#ffffff", 0.08)
      : mix(palette.background, "#ffffff", 0.48)
    : palette.isDark
      ? mix(palette.background, "#ffffff", 0.06)
      : mix(palette.background, "#ffffff", 0.7);

  /** Shared calendar grid content used by both chateau and non-chateau layouts. */
  const calendarGrid = (
    <div className="relative px-4 pb-6 pt-4">
      {/* Year watermark */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center text-[5.5rem] font-light leading-none"
        style={{ fontFamily: palette.displayFont, color: alpha(palette.primary, arched ? 0.07 : 0.1) }}
      >
        {d.getFullYear()}
      </span>
      <div className="relative grid grid-cols-7 gap-y-1 text-center text-sm" role="grid" aria-label={`${month} ${d.getFullYear()}`}>
        {weekdays.map((w, i) => (
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
        <p className="relative mt-3 text-center text-[11px] uppercase tracking-[0.34em]" style={{ color: palette.inkMuted }} suppressHydrationWarning>
          D-{daysLeft}
        </p>
      )}
    </div>
  );

  /* Chateau: wrap the entire calendar in the ornate GoldenArchFrame. */
  if (chateau) {
    return (
      <GoldenArchFrame palette={palette}>
        <span className="text-3xl md:text-4xl" style={{ fontFamily: palette.displayFont, color: palette.ink }}>
          {month}
        </span>
        <span className="mt-1 text-[11px] tracking-[0.42em]" style={{ color: palette.primary }}>
          {d.getFullYear()}
        </span>
        <span className="mt-3 h-px w-16" style={{ backgroundColor: alpha(palette.primary, 0.4) }} />
        {calendarGrid}
      </GoldenArchFrame>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-sm">
      {atelier && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-2 border"
          style={{ borderRadius: "12rem 12rem 1rem 1rem", borderColor: alpha(palette.primary, 0.22) }}
        />
      )}
      <div
        className="relative overflow-hidden border"
        style={{
          borderRadius: atelier ? "12rem 12rem 1.1rem 1.1rem" : palette.radius.card,
          borderColor: alpha(palette.primary, atelier ? 0.38 : 0.3),
          background: card,
          boxShadow: `0 30px 60px -34px ${alpha(palette.primary, 0.6)}`,
        }}
      >
        {atelier ? (
          <div className="flex flex-col items-center px-5 pb-2 pt-9">
            {/* Atelier: simple vine arc */}
            <svg viewBox="0 0 80 18" className="h-4 w-20" fill="none" aria-hidden>
              <path d="M4 14 C 24 2, 56 2, 76 14" stroke={alpha(palette.primary, 0.6)} strokeWidth="0.8" />
              {[22, 34, 46, 58].map((x, i) => (
                <ellipse key={x} cx={x} cy={9 - i * 0.6} rx={1.8} ry={3.2} fill={alpha(palette.leaf, 0.8)} transform={`rotate(${i < 2 ? -40 : 40} ${x} ${9 - i * 0.6})`} />
              ))}
            </svg>
            <span className="mt-2 text-3xl md:text-4xl" style={{ fontFamily: palette.displayFont, color: palette.ink }}>
              {month}
            </span>
            <span className="mt-1 text-[11px] tracking-[0.42em]" style={{ color: palette.primary }}>
              {d.getFullYear()}
            </span>
            <span className="mt-3 h-px w-16" style={{ backgroundColor: alpha(palette.primary, 0.4) }} />
          </div>
        ) : (
          <div className="flex items-baseline justify-between px-5 py-3" style={{ background: palette.primary, color: headInk }}>
            <span className="text-2xl" style={{ fontFamily: palette.displayFont }}>
              {month}
            </span>
            <span className="text-sm tracking-[0.3em]">{d.getFullYear()}</span>
          </div>
        )}

        {calendarGrid}
      </div>
    </div>
  );
}

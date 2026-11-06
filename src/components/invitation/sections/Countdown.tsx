"use client";

/**
 * Countdown — animated digit tiles counting down to the wedding day.
 * Renders nothing on the server to avoid hydration mismatches on time.
 */

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Reveal, SectionHeading } from "./Primitives";
import { alpha, calendarUrl, formatLongDate, parseWeddingDate, type InvitationPalette } from "../utils";
import { CalendarPlus } from "lucide-react";
import ScratchReveal from "./ScratchReveal";
import CalendarCard from "./CalendarCard";
import { useEventCopy, useUI } from "./HeroParts";
import { ChateauCorners, ChateauDivider } from "./ChateauDecor";
import type { CountdownStyle } from "../styles";
import type { InvitationCopy } from "../i18n";

interface Parts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/** Splits the remaining milliseconds until `target` into d/h/m/s (clamped at 0). */
function remaining(target: Date): Parts {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

/** One tile whose number slides when it changes. */
function Tile({ value, label, palette }: { value: number; label: string; palette: InvitationPalette }) {
  const text = String(value).padStart(2, "0");
  return (
    <div
      className="relative flex w-[4.5rem] flex-col items-center overflow-hidden border px-2 py-5 backdrop-blur-sm sm:w-24 md:w-32 md:py-7"
      style={{
        borderRadius: palette.radius.card,
        borderColor: alpha(palette.primary, 0.3),
        backgroundColor: alpha("#ffffff", palette.isDark ? 0.04 : 0.55),
        boxShadow: `0 20px 40px -24px ${alpha(palette.primary, 0.5)}`,
      }}
    >
      <div className="relative h-10 overflow-hidden md:h-16">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={text}
            className="block text-4xl font-light tabular-nums md:text-6xl"
            style={{ fontFamily: palette.displayFont, color: palette.ink }}
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-2 text-[10px] uppercase tracking-[0.25em] md:text-xs" style={{ color: palette.inkMuted }}>
        {label}
      </span>
    </div>
  );
}

const RING_RADIUS = 44;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

/** One orbit ring: a circular progress track with the value in the middle. */
function Ring({
  value,
  max,
  label,
  palette,
  reduce,
}: {
  value: number;
  max: number;
  label: string;
  palette: InvitationPalette;
  reduce: boolean | null;
}) {
  const offset = RING_CIRCUMFERENCE * (1 - Math.min(1, Math.max(0, value / max)));
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-[4.5rem] w-[4.5rem] sm:h-20 sm:w-20 md:h-28 md:w-28">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden>
          <circle
            cx="50"
            cy="50"
            r={RING_RADIUS}
            fill="none"
            stroke={alpha(palette.primary, palette.isDark ? 0.22 : 0.14)}
            strokeWidth={3}
          />
          <motion.circle
            cx="50"
            cy="50"
            r={RING_RADIUS}
            fill="none"
            stroke={palette.primary}
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={RING_CIRCUMFERENCE}
            initial={false}
            animate={{ strokeDashoffset: offset }}
            transition={reduce ? { duration: 0 } : { duration: 0.9, ease: "linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-xl font-light tabular-nums sm:text-2xl md:text-4xl"
            style={{ fontFamily: palette.displayFont, color: palette.ink }}
          >
            {String(value).padStart(2, "0")}
          </span>
        </div>
      </div>
      <span className="text-[10px] uppercase tracking-[0.25em] md:text-xs" style={{ color: palette.inkMuted }}>
        {label}
      </span>
    </div>
  );
}

/** The live countdown face, drawn as sliding tiles or orbit rings. */
function CountdownFace({
  parts,
  palette,
  style,
  labels,
}: {
  parts: Parts | null;
  palette: InvitationPalette;
  style: CountdownStyle;
  labels: Pick<InvitationCopy, "days" | "hours" | "minutes" | "seconds">;
}) {
  const reduce = useReducedMotion();

  if (!parts) return <div className="h-[7.5rem] md:h-[10rem]" />;

  if (style === "rings") {
    return (
      <>
        <Ring value={parts.days} max={365} label={labels.days} palette={palette} reduce={reduce} />
        <Ring value={parts.hours} max={24} label={labels.hours} palette={palette} reduce={reduce} />
        <Ring value={parts.minutes} max={60} label={labels.minutes} palette={palette} reduce={reduce} />
        <Ring value={parts.seconds} max={60} label={labels.seconds} palette={palette} reduce={reduce} />
      </>
    );
  }

  return (
    <>
      <Tile value={parts.days} label={labels.days} palette={palette} />
      <Tile value={parts.hours} label={labels.hours} palette={palette} />
      <Tile value={parts.minutes} label={labels.minutes} palette={palette} />
      <Tile value={parts.seconds} label={labels.seconds} palette={palette} />
    </>
  );
}

export default function Countdown({
  date,
  title,
  venue,
  palette,
  styleOverride,
}: {
  date: string;
  title: string;
  venue?: string | null;
  palette: InvitationPalette;
  /** Host's countdown style choice; falls back to the template's design language. */
  styleOverride?: CountdownStyle;
}) {
  const [parts, setParts] = useState<Parts | null>(null);

  useEffect(() => {
    const target = parseWeddingDate(date);
    setParts(remaining(target));
    const id = setInterval(() => setParts(remaining(target)), 1000);
    return () => clearInterval(id);
  }, [date]);

  const isPast = parts !== null && parts.days + parts.hours + parts.minutes + parts.seconds === 0;

  const ui = useUI();
  const { lang } = useEventCopy();
  const dateLocale = lang === "vi" ? "vi-VN" : undefined;
  const atelier = palette.style.hero === "atelier";
  const chateau = palette.style.hero === "chateau";
  const countdownStyle = styleOverride ?? palette.style.countdown;
  const daysLeft = parts && !isPast ? parts.days + (parts.hours + parts.minutes + parts.seconds > 0 ? 1 : 0) : null;
  const face = (
    <Reveal className={`flex justify-center ${countdownStyle === "rings" ? "gap-4 sm:gap-6 md:gap-10" : "gap-3 md:gap-6"}`}>
      <CountdownFace parts={parts} palette={palette} style={countdownStyle} labels={ui} />
    </Reveal>
  );

  return (
    <section id="celebrate" className="relative overflow-hidden px-6 py-28 md:py-36" style={{ backgroundColor: palette.surface }}>
      {chateau && <ChateauCorners palette={palette} />}
      <SectionHeading
        eyebrow={isPast ? ui.weSaidYes : palette.style.scratchReveal ? ui.aLittleSecret : ui.saveTheDate}
        title={palette.style.scratchReveal ? ui.saveTheDate : formatLongDate(date, null, dateLocale)}
        palette={palette}
      />
      {palette.style.scratchReveal && (
        <Reveal className="mb-14">
          <ScratchReveal palette={palette}>
            <p className="text-xs uppercase tracking-[0.35em]" style={{ color: palette.inkMuted }}>
              {ui.weSayIDo}
            </p>
            <p className="mt-3 text-3xl md:text-4xl" style={{ fontFamily: palette.displayFont, color: palette.ink }}>
              {formatLongDate(date, null, dateLocale)}
            </p>
          </ScratchReveal>
        </Reveal>
      )}
      {palette.style.calendar && !palette.style.scratchReveal && (
        <Reveal className="mb-10">
          <CalendarCard date={date} palette={palette} daysLeft={daysLeft} />
        </Reveal>
      )}
      {atelier ? (
        <>
          {/* Atelier keeps the page minimal; the orbit rings are opt-in there. */}
          {countdownStyle === "rings" && face}
          {!isPast && (
            <Reveal delay={0.2} className="flex justify-center">
              <a
                href={calendarUrl(title, date, venue)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border-b px-1 py-2 text-[11px] uppercase tracking-[0.3em] transition hover:opacity-70"
                style={{ borderColor: alpha(palette.primary, 0.4), color: palette.primary }}
              >
                <CalendarPlus size={14} /> {ui.addToCalendar}
              </a>
            </Reveal>
          )}
        </>
      ) : chateau ? (
        <>
          {/* Chateau: countdown with ornate divider before the CTA */}
          {face}
          {!isPast && (
            <>
              <ChateauDivider palette={palette} />
              <Reveal delay={0.2} className="flex justify-center">
                <a
                  href={calendarUrl(title, date, venue)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border px-6 py-3 text-xs uppercase tracking-[0.25em] transition hover:-translate-y-0.5"
                  style={{ borderRadius: palette.radius.sm, borderColor: alpha(palette.primary, 0.5), color: palette.primary }}
                >
                  <CalendarPlus size={16} /> {ui.addToCalendar}
                </a>
              </Reveal>
            </>
          )}
        </>
      ) : (
        <>
          {face}
          {!isPast && (
            <Reveal delay={0.2} className="mt-12 flex justify-center">
              <a
                href={calendarUrl(title, date, venue)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border px-6 py-3 text-xs uppercase tracking-[0.25em] transition hover:-translate-y-0.5"
                style={{ borderRadius: palette.radius.sm, borderColor: alpha(palette.primary, 0.5), color: palette.primary }}
              >
                <CalendarPlus size={16} /> {ui.addToCalendar}
              </a>
            </Reveal>
          )}
        </>
      )}
    </section>
  );
}

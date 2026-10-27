"use client";

/**
 * Countdown — animated digit tiles counting down to the wedding day.
 * Renders nothing on the server to avoid hydration mismatches on time.
 */

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal, SectionHeading } from "./Primitives";
import { alpha, calendarUrl, formatLongDate, parseWeddingDate, type InvitationPalette } from "../utils";
import { CalendarPlus } from "lucide-react";
import ScratchReveal from "./ScratchReveal";
import CalendarCard from "./CalendarCard";
import { useEventCopy, useUI } from "./HeroParts";

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

export default function Countdown({
  date,
  title,
  venue,
  palette,
}: {
  date: string;
  title: string;
  venue?: string | null;
  palette: InvitationPalette;
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
  const daysLeft = parts && !isPast ? parts.days + (parts.hours + parts.minutes + parts.seconds > 0 ? 1 : 0) : null;

  return (
    <section id="celebrate" className="relative overflow-hidden px-6 py-28 md:py-36" style={{ backgroundColor: palette.surface }}>
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
        !isPast && (
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
        )
      ) : (
        <>
          <Reveal className="flex justify-center gap-3 md:gap-6">
            {parts ? (
              <>
                <Tile value={parts.days} label={ui.days} palette={palette} />
                <Tile value={parts.hours} label={ui.hours} palette={palette} />
                <Tile value={parts.minutes} label={ui.minutes} palette={palette} />
                <Tile value={parts.seconds} label={ui.seconds} palette={palette} />
              </>
            ) : (
              <div className="h-[7.5rem] md:h-[10rem]" />
            )}
          </Reveal>
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

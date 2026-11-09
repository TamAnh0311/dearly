"use client";

/**
 * CalendarButton — "Add to Calendar" dropdown for invitation pages.
 * Offers Google Calendar (opens in new tab) and .ics download options.
 * Styled using the invitation palette rather than dashboard design tokens.
 */

import { useEffect, useRef, useState } from "react";
import { CalendarPlus, ChevronDown } from "lucide-react";
import { buildGoogleCalendarUrl, buildIcsContent, type CalendarEvent } from "@/lib/calendar";
import { alpha, type InvitationPalette } from "../utils";

interface Props {
  /** Event data used to build both calendar export formats. */
  event: CalendarEvent;
  /** Invitation palette for consistent in-page styling. */
  palette: InvitationPalette;
}

/**
 * Triggers a browser download of the given ICS content as a .ics file.
 */
function downloadIcs(event: CalendarEvent): void {
  const content = buildIcsContent(event);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${event.title.replace(/[^a-z0-9]/gi, "_")}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

/** "Add to Calendar" dropdown button styled with the invitation palette. */
export default function CalendarButton({ event, palette }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  /** Closes the dropdown when the user clicks outside the component. */
  useEffect(() => {
    if (!open) return;

    function handleOutsideClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  const borderColor = alpha(palette.primary, 0.4);
  const dropdownBg = palette.isDark
    ? alpha(palette.background, 0.96)
    : palette.background;

  return (
    <div ref={containerRef} className="relative inline-block">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 border px-4 py-2 text-sm transition hover:-translate-y-0.5"
        style={{
          borderRadius: palette.radius.card,
          borderColor,
          color: palette.ink,
          backgroundColor: alpha(palette.primary, 0.06),
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <CalendarPlus size={16} style={{ color: palette.primary }} aria-hidden />
        <span>Add to Calendar</span>
        <ChevronDown
          size={14}
          style={{
            color: palette.inkMuted,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
          aria-hidden
        />
      </button>

      {/* Dropdown menu */}
      {open && (
        <div
          role="listbox"
          aria-label="Calendar export options"
          className="absolute left-0 top-full z-50 mt-1 min-w-[180px] border py-1 shadow-lg"
          style={{
            borderRadius: palette.radius.card,
            borderColor,
            backgroundColor: dropdownBg,
          }}
        >
          {/* Google Calendar */}
          <a
            role="option"
            aria-selected={false}
            href={buildGoogleCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm transition hover:opacity-80"
            style={{ color: palette.ink }}
          >
            <CalendarPlus size={15} style={{ color: palette.primary }} aria-hidden />
            Google Calendar
          </a>

          {/* .ics download */}
          <button
            type="button"
            role="option"
            aria-selected={false}
            onClick={() => {
              downloadIcs(event);
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm transition hover:opacity-80"
            style={{ color: palette.ink }}
          >
            <CalendarPlus size={15} style={{ color: palette.inkMuted }} aria-hidden />
            Download .ics file
          </button>
        </div>
      )}
    </div>
  );
}

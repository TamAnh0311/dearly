/**
 * Calendar export utilities: Google Calendar URL and ICS file generation.
 * Pure functions — no external dependencies, safe to call from client or server.
 */

/** Event data shape accepted by both calendar export functions. */
export interface CalendarEvent {
  /** Event display title. */
  title: string;
  /** ISO date string in YYYY-MM-DD format. */
  date: string;
  /** Optional 24-hour start time in HH:MM format. Defaults to all-day if omitted. */
  startTime?: string;
  /** Optional 24-hour end time in HH:MM format. */
  endTime?: string;
  /** IANA timezone identifier (e.g. "Asia/Ho_Chi_Minh"). Defaults to UTC if omitted. */
  timezone?: string;
  /** Venue name shown as the event location. */
  venue?: string;
  /** Street address appended to the venue name in location fields. */
  address?: string;
  /** Free-text event description / notes. */
  description?: string;
}

/**
 * Formats a YYYY-MM-DD date and optional HH:MM time into a compact
 * Google Calendar datetime string (YYYYMMDDTHHMMSS or YYYYMMDD for all-day).
 */
function toGoogleDatetime(date: string, time?: string): string {
  const datePart = date.replace(/-/g, "");
  if (!time) return datePart;
  const timePart = time.replace(":", "") + "00";
  return `${datePart}T${timePart}`;
}

/**
 * Formats a YYYY-MM-DD date and optional HH:MM time into an ICS datetime
 * string with optional TZID prefix (YYYYMMDDTHHMMSS).
 */
function toIcsDatetime(date: string, time?: string): string {
  const datePart = date.replace(/-/g, "");
  if (!time) return datePart;
  const timePart = time.replace(":", "") + "00";
  return `${datePart}T${timePart}`;
}

/**
 * Builds the location string from optional venue and address fields.
 */
function buildLocation(venue?: string, address?: string): string {
  if (venue && address) return `${venue}, ${address}`;
  return venue ?? address ?? "";
}

/**
 * Generates a Google Calendar event creation URL for the given event.
 * Uses `encodeURIComponent` directly (not URLSearchParams) so the resulting
 * query string uses percent-encoding (%20, %26) rather than plus-encoding (+).
 *
 * @param event - Calendar event data.
 * @returns A fully-encoded URL that opens Google Calendar's "new event" page.
 */
export function buildGoogleCalendarUrl(event: CalendarEvent): string {
  const start = toGoogleDatetime(event.date, event.startTime);
  const end = event.endTime
    ? toGoogleDatetime(event.date, event.endTime)
    : start;

  const parts: string[] = [
    `action=TEMPLATE`,
    `text=${encodeURIComponent(event.title)}`,
    `dates=${encodeURIComponent(`${start}/${end}`)}`,
  ];

  const location = buildLocation(event.venue, event.address);
  if (location) parts.push(`location=${encodeURIComponent(location)}`);
  if (event.description) parts.push(`details=${encodeURIComponent(event.description)}`);
  if (event.timezone) parts.push(`ctz=${encodeURIComponent(event.timezone)}`);

  return `https://calendar.google.com/calendar/render?${parts.join("&")}`;
}

/**
 * Generates a valid iCalendar (ICS) string for the given event, suitable
 * for download and import into Apple Calendar, Outlook, or any RFC 5545
 * compatible client.
 *
 * @param event - Calendar event data.
 * @returns A VCALENDAR/VEVENT formatted string.
 */
export function buildIcsContent(event: CalendarEvent): string {
  const tzid = event.timezone ?? "UTC";
  const dtstart = toIcsDatetime(event.date, event.startTime);
  const dtend = event.endTime
    ? toIcsDatetime(event.date, event.endTime)
    : dtstart;

  const dtStartLine = event.startTime
    ? `DTSTART;TZID=${tzid}:${dtstart}`
    : `DTSTART:${dtstart}`;

  const dtEndLine = event.endTime
    ? `DTEND;TZID=${tzid}:${dtend}`
    : `DTEND:${dtend}`;

  const location = event.venue ?? "";

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Dearly//Calendar Export//EN",
    "BEGIN:VEVENT",
    dtStartLine,
    dtEndLine,
    `SUMMARY:${event.title}`,
  ];

  if (location) lines.push(`LOCATION:${location}`);
  if (event.description) lines.push(`DESCRIPTION:${event.description}`);

  lines.push("END:VEVENT", "END:VCALENDAR");

  return lines.join("\r\n");
}

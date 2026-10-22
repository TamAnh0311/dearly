/**
 * Event types — copy and defaults that adapt the shared invitation to
 * weddings, birthdays, parties and social events. Wedding is the flagship
 * and the default everywhere (older rows have no event_type).
 */

import type { EventType, WeddingRow } from "@/types/database";

export interface EventCopy {
  /** Display name, e.g. "Wedding". */
  label: string;
  /** Short marketing blurb. */
  blurb: string;
  /** Hero kicker above the names. */
  eyebrow: string;
  /** Script line under the names. */
  tagline: (names: string) => string;
  /** Label for the honoree/host name fields in onboarding. */
  hostLabel: [string, string | null];
  /** Section titles. */
  storyTitle: string;
  rsvpEyebrow: string;
  rsvpTitle: string;
  blessingsTitle: string;
  /** What guests leave (blessing / wish / message). */
  wishNoun: string;
  /** Calendar entry title. */
  calendarTitle: (names: string) => string;
  /** Marketing landing path. */
  seoPath: string;
}

/** Copy per event type. */
export const EVENT_COPY: Record<EventType, EventCopy> = {
  wedding: {
    label: "Wedding",
    blurb: "Cinematic wedding invitations with RSVP, blessings and a memory album.",
    eyebrow: "Together with their families",
    tagline: () => "are getting married",
    hostLabel: ["Partner 1 name", "Partner 2 name"],
    storyTitle: "Our Story",
    rsvpEyebrow: "Kindly reply",
    rsvpTitle: "Will you join us?",
    blessingsTitle: "Blessings",
    wishNoun: "blessing",
    calendarTitle: (n) => `${n}'s Wedding`,
    seoPath: "/invitations/wedding",
  },
  engagement: {
    label: "Engagement",
    blurb: "Announce your engagement and gather everyone's congratulations.",
    eyebrow: "She said yes",
    tagline: () => "are engaged",
    hostLabel: ["Partner 1 name", "Partner 2 name"],
    storyTitle: "How it happened",
    rsvpEyebrow: "Celebrate with us",
    rsvpTitle: "Will you join the party?",
    blessingsTitle: "Congratulations",
    wishNoun: "wish",
    calendarTitle: (n) => `${n}'s Engagement Party`,
    seoPath: "/invitations/wedding",
  },
  anniversary: {
    label: "Anniversary",
    blurb: "Celebrate years together with the people who were there.",
    eyebrow: "Still choosing each other",
    tagline: () => "are celebrating their anniversary",
    hostLabel: ["Partner 1 name", "Partner 2 name"],
    storyTitle: "Our years together",
    rsvpEyebrow: "Kindly reply",
    rsvpTitle: "Will you celebrate with us?",
    blessingsTitle: "Wishes",
    wishNoun: "wish",
    calendarTitle: (n) => `${n}'s Anniversary`,
    seoPath: "/invitations/party",
  },
  birthday: {
    label: "Birthday",
    blurb: "Birthday invitations that pop — RSVP, wishes and a photo wall.",
    eyebrow: "You're invited to celebrate",
    tagline: () => "is having a birthday!",
    hostLabel: ["Birthday star", null],
    storyTitle: "A few words",
    rsvpEyebrow: "Are you in?",
    rsvpTitle: "Coming to the party?",
    blessingsTitle: "Birthday wishes",
    wishNoun: "wish",
    calendarTitle: (n) => `${n}'s Birthday`,
    seoPath: "/invitations/birthday",
  },
  party: {
    label: "Party",
    blurb: "Party invitations with RSVPs, a guest list and a shared photo album.",
    eyebrow: "You're on the list",
    tagline: () => "invites you to a party",
    hostLabel: ["Host name", "Co-host (optional)"],
    storyTitle: "The details",
    rsvpEyebrow: "Are you in?",
    rsvpTitle: "Can you make it?",
    blessingsTitle: "The guest wall",
    wishNoun: "message",
    calendarTitle: (n) => `Party with ${n}`,
    seoPath: "/invitations/party",
  },
  social: {
    label: "Social event",
    blurb: "Elegant invitations for dinners, galas, reunions and gatherings.",
    eyebrow: "The pleasure of your company is requested",
    tagline: () => "invites you",
    hostLabel: ["Host name", "Co-host (optional)"],
    storyTitle: "About the evening",
    rsvpEyebrow: "Kindly reply",
    rsvpTitle: "Will you attend?",
    blessingsTitle: "Guest messages",
    wishNoun: "message",
    calendarTitle: (n) => `Event hosted by ${n}`,
    seoPath: "/invitations/social-event",
  },
  "baby-shower": {
    label: "Baby shower",
    blurb: "Sweet baby shower invitations with RSVP and wishes for the little one.",
    eyebrow: "A little one is on the way",
    tagline: () => "invites you to a baby shower",
    hostLabel: ["Parent-to-be", "Partner (optional)"],
    storyTitle: "Our little news",
    rsvpEyebrow: "Kindly reply",
    rsvpTitle: "Will you join us?",
    blessingsTitle: "Wishes for baby",
    wishNoun: "wish",
    calendarTitle: (n) => `${n}'s Baby Shower`,
    seoPath: "/invitations/birthday",
  },
};

/** Vietnamese copy for wedding events. Other event types fall back to English. */
const EVENT_COPY_VI: Partial<Record<EventType, EventCopy>> = {
  wedding: {
    label: "Đám cưới",
    blurb: "Thiệp mời đám cưới với RSVP, lời chúc và album ảnh kỷ niệm.",
    eyebrow: "Trân trọng kính mời",
    tagline: () => "hân hạnh báo tin hỷ",
    hostLabel: ["Tên chú rể", "Tên cô dâu"],
    storyTitle: "Câu chuyện tình yêu",
    rsvpEyebrow: "Kính mời",
    rsvpTitle: "Quý khách có tham dự được không?",
    blessingsTitle: "Lời chúc",
    wishNoun: "lời chúc",
    calendarTitle: (n) => `Đám cưới ${n}`,
    seoPath: "/invitations/wedding",
  },
};

/** Returns event copy for the given language. Falls back to English for untranslated event types. */
export function getEventCopy(eventType: EventType, lang?: string): EventCopy {
  if (lang === "vi") return EVENT_COPY_VI[eventType] ?? EVENT_COPY[eventType];
  return EVENT_COPY[eventType];
}

/** Event types offered in onboarding, flagship first. */
export const EVENT_TYPE_ORDER: EventType[] = ["wedding", "engagement", "birthday", "party", "social", "anniversary", "baby-shower"];

/** Resolves an event's type (older rows default to wedding). */
export function eventTypeOf(event: Pick<WeddingRow, "event_type"> | null | undefined): EventType {
  const t = event?.event_type;
  return t && t in EVENT_COPY ? t : "wedding";
}

/** Joins host names: "Emma & James", or just "Emma" when the second is empty. */
export function hostNames(event: Pick<WeddingRow, "partner1_name" | "partner2_name">): string {
  const a = event.partner1_name?.trim();
  const b = event.partner2_name?.trim();
  return a && b ? `${a} & ${b}` : a || b || "";
}

/** True when the event date is before today (memories mode). */
export function isPastEvent(date: string | null | undefined, now: Date = new Date()): boolean {
  if (!date) return false;
  const d = /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(`${date}T23:59:59`) : new Date(date);
  return d.getTime() < now.getTime();
}

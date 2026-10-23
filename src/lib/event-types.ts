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

/** Vietnamese copy for every event type. */
const EVENT_COPY_VI: Record<EventType, EventCopy> = {
  wedding: {
    label: "Đám cưới",
    blurb: "Thiệp mời đám cưới với RSVP, lời chúc và album ảnh kỷ niệm.",
    eyebrow: "Trân trọng kính mời",
    tagline: () => "hân hạnh báo tin hỷ",
    hostLabel: ["Tên chú rể", "Tên cô dâu"],
    storyTitle: "Câu chuyện tình yêu",
    rsvpEyebrow: "Kính mời",
    rsvpTitle: "Xác Nhận Tham Dự",
    blessingsTitle: "Sổ Lời Chúc",
    wishNoun: "lời chúc",
    calendarTitle: (n) => `Đám cưới ${n}`,
    seoPath: "/invitations/wedding",
  },
  engagement: {
    label: "Đính hôn",
    blurb: "Thông báo ngày đính hôn và nhận lời chúc từ mọi người.",
    eyebrow: "Lời cầu hôn đã được đồng ý",
    tagline: () => "đã đính hôn",
    hostLabel: ["Tên người thứ nhất", "Tên người thứ hai"],
    storyTitle: "Chuyện chúng tôi",
    rsvpEyebrow: "Cùng chung vui",
    rsvpTitle: "Bạn sẽ tham dự chứ?",
    blessingsTitle: "Lời chúc mừng",
    wishNoun: "lời chúc",
    calendarTitle: (n) => `Tiệc đính hôn ${n}`,
    seoPath: "/invitations/wedding",
  },
  anniversary: {
    label: "Kỷ niệm",
    blurb: "Kỷ niệm những năm tháng bên nhau cùng những người thân yêu.",
    eyebrow: "Vẫn chọn nhau mỗi ngày",
    tagline: () => "kỷ niệm ngày cưới",
    hostLabel: ["Tên người thứ nhất", "Tên người thứ hai"],
    storyTitle: "Những năm tháng bên nhau",
    rsvpEyebrow: "Kính mời",
    rsvpTitle: "Bạn sẽ cùng chung vui chứ?",
    blessingsTitle: "Lời chúc",
    wishNoun: "lời chúc",
    calendarTitle: (n) => `Kỷ niệm ngày cưới ${n}`,
    seoPath: "/invitations/party",
  },
  birthday: {
    label: "Sinh nhật",
    blurb: "Thiệp mời sinh nhật rộn ràng — RSVP, lời chúc và tường ảnh.",
    eyebrow: "Mời bạn đến chung vui",
    tagline: () => "sắp đón sinh nhật!",
    hostLabel: ["Tên nhân vật chính", null],
    storyTitle: "Đôi lời",
    rsvpEyebrow: "Bạn tham gia chứ?",
    rsvpTitle: "Đến dự tiệc nhé?",
    blessingsTitle: "Lời chúc sinh nhật",
    wishNoun: "lời chúc",
    calendarTitle: (n) => `Sinh nhật ${n}`,
    seoPath: "/invitations/birthday",
  },
  party: {
    label: "Tiệc",
    blurb: "Thiệp mời tiệc với RSVP, danh sách khách và album ảnh chung.",
    eyebrow: "Bạn có tên trong danh sách",
    tagline: () => "mời bạn đến dự tiệc",
    hostLabel: ["Tên người tổ chức", "Đồng tổ chức (không bắt buộc)"],
    storyTitle: "Thông tin buổi tiệc",
    rsvpEyebrow: "Bạn tham gia chứ?",
    rsvpTitle: "Bạn có thể đến không?",
    blessingsTitle: "Lời nhắn của khách",
    wishNoun: "lời nhắn",
    calendarTitle: (n) => `Tiệc cùng ${n}`,
    seoPath: "/invitations/party",
  },
  social: {
    label: "Sự kiện xã hội",
    blurb: "Thiệp mời trang trọng cho bữa tối, dạ tiệc, họp mặt và gặp gỡ.",
    eyebrow: "Trân trọng kính mời quý khách",
    tagline: () => "trân trọng kính mời",
    hostLabel: ["Tên người tổ chức", "Đồng tổ chức (không bắt buộc)"],
    storyTitle: "Về buổi tối này",
    rsvpEyebrow: "Kính mời",
    rsvpTitle: "Quý khách sẽ tham dự chứ?",
    blessingsTitle: "Lời nhắn của khách",
    wishNoun: "lời nhắn",
    calendarTitle: (n) => `Sự kiện do ${n} tổ chức`,
    seoPath: "/invitations/social-event",
  },
  "baby-shower": {
    label: "Tiệc mừng em bé",
    blurb: "Thiệp mời tiệc mừng em bé với RSVP và lời chúc cho thiên thần nhỏ.",
    eyebrow: "Một thiên thần nhỏ sắp chào đời",
    tagline: () => "mời bạn đến tiệc mừng em bé",
    hostLabel: ["Tên bố/mẹ", "Bạn đời (không bắt buộc)"],
    storyTitle: "Tin vui nhỏ",
    rsvpEyebrow: "Kính mời",
    rsvpTitle: "Bạn sẽ cùng chung vui chứ?",
    blessingsTitle: "Lời chúc cho em bé",
    wishNoun: "lời chúc",
    calendarTitle: (n) => `Tiệc mừng em bé của ${n}`,
    seoPath: "/invitations/birthday",
  },
};

/** Returns event copy for the given language. */
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

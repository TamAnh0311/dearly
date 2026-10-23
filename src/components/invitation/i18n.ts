/**
 * Invitation i18n — every guest-facing string that is not couple-entered data.
 *
 * Event-type copy (titles such as "Our Story" or "Xác Nhận Tham Dự") lives in
 * src/lib/event-types.ts. This module covers the shared chrome and form copy
 * that used to be hard-coded in English across the sections.
 */

/** Supported invitation display languages. */
export type InvitationLang = "en" | "vi";

export interface InvitationLanguageOption {
  code: InvitationLang;
  /** English name, used in aria labels. */
  label: string;
  /** Name in its own language, shown to the couple. */
  nativeLabel: string;
  /** BCP 47 locale for dates and times. */
  locale: string;
}

/** Languages shown in the editor and preview pickers. */
export const INVITATION_LANGUAGES: InvitationLanguageOption[] = [
  { code: "en", label: "English", nativeLabel: "English", locale: "en-US" },
  { code: "vi", label: "Vietnamese", nativeLabel: "Tiếng Việt", locale: "vi-VN" },
];

/** Returns the BCP 47 locale for a language. */
export function invitationLocale(lang?: InvitationLang): string {
  return lang === "vi" ? "vi-VN" : "en-US";
}

/** Narrows an arbitrary value to a supported invitation language. */
export function isInvitationLang(value: unknown): value is InvitationLang {
  return value === "en" || value === "vi";
}

export interface RsvpCopy {
  subtitle: (names: string) => string;
  inviteeSubtitle: (name: string, names: string, maxPartySize: number) => string;
  attendingTitle: string;
  attendingSubtitle: string;
  declinedTitle: string;
  declinedSubtitle: string;
  successAttending: string;
  successDeclined: string;
  thanksAttending: (name: string) => string;
  thanksDeclined: (name: string) => string;
  changeReply: string;
  yourName: string;
  namePlaceholder: string;
  guests: string;
  fewerGuests: string;
  moreGuests: string;
  blessingOptional: string;
  blessingPrompt: string;
  attendingPlaceholder: string;
  declinedPlaceholder: string;
  charCount: string;
  sending: string;
  sendRsvp: string;
  sendLove: string;
  nameError: string;
  genericError: string;
  timeoutError: string;
  sendGift: string;
  qrAlt: (label: string) => string;
  copyAccount: (number: string) => string;
}

export interface BlessingsCopy {
  withLove: string;
  tapToSend: string;
  sentSoFar: (count: number) => string;
  reactions: Record<string, string>;
  willBeThere: string;
  sendingLove: string;
  firstBlessing: string;
  writeBlessing: string;
  showMore: (remaining: number) => string;
  wishes: (count: number) => string;
}

export interface InvitationCopy {
  lang: InvitationLang;
  dateLocale: string;
  scroll: string;
  scrollToDetails: string;
  saveTheDate: string;
  aLittleSecret: string;
  weSaidYes: string;
  addToCalendar: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  dear: (name: string) => string;
  youAreInvitedTo: (label: string) => string;
  youAreInvited: string;
  weSayIDo: string;
  dateToBeAnnounced: string;
  requestPleasure: string;
  theWedding: string;
  dragPhotos: string;
  photoCaptions: string[];
  invitationLabel: (label: string) => string;
  nav: {
    schedule: string;
    venue: string;
    memories: string;
    gift: string;
    rsvp: string;
  };
  story: { eyebrow: string; genericEyebrow: string };
  schedule: { eyebrow: string; title: string; timesLocal: string };
  venue: { eyebrow: string; title: string; directions: string };
  moments: {
    eyebrow: string;
    title: string;
    shareSubtitle: string;
    sharePhotos: string;
    viewAlbum: string;
  };
  rsvp: RsvpCopy;
  blessings: BlessingsCopy;
  chrome: {
    thankYou: string;
    gallery: string;
    guestbook: string;
    sectionsAria: string;
  };
  blessingShower: {
    show: string;
    hide: string;
    count: (count: number) => string;
  };
  music: {
    tap: string;
    play: string;
    pause: string;
  };
  scratch: {
    label: string;
    orTap: string;
  };
}

const EN: InvitationCopy = {
  lang: "en",
  dateLocale: "en-US",
  scroll: "Scroll",
  scrollToDetails: "Scroll to details",
  saveTheDate: "Save the date",
  aLittleSecret: "A little secret",
  weSaidYes: "We said yes",
  addToCalendar: "Add to calendar",
  days: "Days",
  hours: "Hours",
  minutes: "Minutes",
  seconds: "Seconds",
  dear: (name) => `Dear ${name}`,
  youAreInvitedTo: (label) => `You have been invited to ${label.toLowerCase()}`,
  youAreInvited: "You are invited",
  weSayIDo: "We say \u201CI do\u201D on",
  dateToBeAnnounced: "Date to be announced",
  requestPleasure: "Request the pleasure of your company",
  theWedding: "The Wedding",
  dragPhotos: "psst — you can drag the photos",
  photoCaptions: ["first date", "the proposal", "us", "adventures", "forever"],
  invitationLabel: (label) => `${label} Invitation`,
  nav: {
    schedule: "Schedule",
    venue: "Venue",
    memories: "Memories",
    gift: "Gift",
    rsvp: "RSVP",
  },
  story: { eyebrow: "How it began", genericEyebrow: "Hello" },
  schedule: { eyebrow: "The celebration", title: "Order of the Day", timesLocal: "Times are local" },
  venue: { eyebrow: "Where", title: "The Venue", directions: "Get directions" },
  moments: {
    eyebrow: "Our memories",
    title: "Moments",
    shareSubtitle: "Captured a moment with us? Add it to our album — every photo becomes part of our story.",
    sharePhotos: "Share your photos",
    viewAlbum: "View the full album",
  },
  rsvp: {
    subtitle: (names) => `${names} would be honoured by your presence — and cherish your message either way.`,
    inviteeSubtitle: (name, names, max) =>
      `Dear ${name}, ${names} would love to have you there${max > 1 ? ` — your invitation is for ${max} guests` : ""}.`,
    attendingTitle: "I'll be there",
    attendingSubtitle: "Joyfully accepts",
    declinedTitle: "Can't make it",
    declinedSubtitle: "Sending my blessing",
    successAttending: "See you there!",
    successDeclined: "You'll be missed",
    thanksAttending: (name) => `Thank you, ${name}. We can't wait to celebrate with you.`,
    thanksDeclined: (name) => `Thank you, ${name}. Your love means the world to us, even from afar.`,
    changeReply: "Change my reply or send another blessing",
    yourName: "Your name",
    namePlaceholder: "e.g. Olivia & Noah Bennett",
    guests: "Number of guests (including you)",
    fewerGuests: "Fewer guests",
    moreGuests: "More guests",
    blessingOptional: "A blessing for the couple (optional)",
    blessingPrompt: "Send your blessing",
    attendingPlaceholder: "Wishing you a lifetime of love and laughter…",
    declinedPlaceholder: "So sorry to miss your big day. Sending you all my love…",
    charCount: "Blessings appear on this page",
    sending: "Sending…",
    sendRsvp: "Send my RSVP",
    sendLove: "Send my love",
    nameError: "Please tell us your name so the couple knows who replied.",
    genericError: "Something went wrong. Please try again.",
    timeoutError: "The connection timed out. Please check your internet and try again.",
    sendGift: "Send a gift",
    qrAlt: (label) => `QR code for ${label}`,
    copyAccount: (number) => `Copy account number ${number}`,
  },
  blessings: {
    withLove: "With love",
    tapToSend: "Tap to send your love",
    sentSoFar: (count) => `${count.toLocaleString("en-US")} sent so far`,
    reactions: { love: "Love", bloom: "Bloom", cheers: "Cheers", sparkle: "Joy", rings: "Forever" },
    willBeThere: "Will be there",
    sendingLove: "Sending love from afar",
    firstBlessing: "Be the first to leave a blessing",
    writeBlessing: "Write a blessing",
    showMore: (remaining) => `Show more blessings (${remaining})`,
    wishes: (count) => `${count} heartfelt ${count === 1 ? "wish" : "wishes"}`,
  },
  chrome: {
    thankYou: "Thank you for being part of our story",
    gallery: "Gallery",
    guestbook: "Guest book",
    sectionsAria: "Invitation sections",
  },
  blessingShower: {
    show: "Show blessings",
    hide: "Hide blessings",
    count: (count) => `${count} ${count === 1 ? "blessing" : "blessings"}`,
  },
  music: {
    tap: "Tap anywhere for music ♪",
    play: "Play background music",
    pause: "Pause background music",
  },
  scratch: {
    label: "Scratch to reveal",
    orTap: "Or tap here to reveal",
  },
};

const VI: InvitationCopy = {
  lang: "vi",
  dateLocale: "vi-VN",
  scroll: "Xem thêm",
  scrollToDetails: "Xem chi tiết",
  saveTheDate: "Ngày trọng đại",
  aLittleSecret: "Bí mật nhỏ",
  weSaidYes: "Chúng tôi đã nên duyên",
  addToCalendar: "Thêm vào lịch",
  days: "Ngày",
  hours: "Giờ",
  minutes: "Phút",
  seconds: "Giây",
  dear: (name) => `Kính gửi ${name}`,
  youAreInvitedTo: (label) => `Quý khách được mời đến ${label.toLowerCase()}`,
  youAreInvited: "Trân trọng kính mời",
  weSayIDo: "Ngày cưới",
  dateToBeAnnounced: "Ngày sẽ được thông báo",
  requestPleasure: "Trân trọng kính mời quý khách đến chung vui",
  theWedding: "Đám cưới",
  dragPhotos: "kéo ảnh để xem",
  photoCaptions: ["lần hẹn đầu", "lời cầu hôn", "chúng tôi", "những chuyến đi", "mãi mãi"],
  invitationLabel: (label) => `Thiệp mời ${label}`,
  nav: {
    schedule: "Lịch trình",
    venue: "Địa điểm",
    memories: "Kỷ niệm",
    gift: "Mừng cưới",
    rsvp: "Xác nhận",
  },
  story: { eyebrow: "Story of us", genericEyebrow: "Xin chào" },
  schedule: { eyebrow: "Wedding timeline", title: "Lịch trình hôn lễ", timesLocal: "Giờ địa phương" },
  venue: { eyebrow: "Tổ chức tại", title: "Nhà hàng tiệc cưới", directions: "Chỉ đường" },
  moments: {
    eyebrow: "Kỷ niệm của chúng tôi",
    title: "Khoảnh khắc đáng nhớ",
    shareSubtitle: "Cùng chia sẻ những bức ảnh đẹp để lưu giữ kỷ niệm trong ngày vui của chúng mình nhé!",
    sharePhotos: "Chia sẻ ảnh",
    viewAlbum: "Xem toàn bộ album",
  },
  rsvp: {
    subtitle: () => "Sự hiện diện của Quý khách chính là món quà quý giá nhất đối với gia đình chúng tôi. Vô cùng trân quý khi được cùng Quý khách chia sẻ niềm hạnh phúc trong ngày trọng đại này",
    inviteeSubtitle: (name, names, max) =>
      `Kính gửi ${name}, ${names} rất mong được đón tiếp quý khách${max > 1 ? ` — thiệp mời dành cho ${max} khách` : ""}.`,
    attendingTitle: "Có, chắc chắn rồi!",
    attendingSubtitle: "Vui mừng xác nhận",
    declinedTitle: "Xin lỗi, tôi không thể tham dự",
    declinedSubtitle: "Gửi lời chúc từ xa",
    successAttending: "Hẹn gặp quý khách!",
    successDeclined: "Chúng tôi sẽ nhớ quý khách",
    thanksAttending: (name) => `Cảm ơn ${name}. Chúng tôi mong được sum họp cùng quý khách.`,
    thanksDeclined: (name) => `Cảm ơn ${name}. Tình cảm của quý khách luôn quý giá với chúng tôi, dù xa cách.`,
    changeReply: "Đổi câu trả lời hoặc gửi thêm lời chúc",
    yourName: "Tên của quý khách",
    namePlaceholder: "Ví dụ: Nguyễn Văn An & Trần Thị Bình",
    guests: "Số lượng khách (bao gồm quý khách)",
    fewerGuests: "Bớt khách",
    moreGuests: "Thêm khách",
    blessingOptional: "Lời chúc dành cho cô dâu chú rể (không bắt buộc)",
    blessingPrompt: "Gửi lời chúc của quý khách",
    attendingPlaceholder: "Chúc hai bạn một đời yêu thương và tiếng cười…",
    declinedPlaceholder: "Rất tiếc vì không thể đến chung vui. Xin gửi đến hai bạn tất cả yêu thương…",
    charCount: "Lời chúc sẽ xuất hiện trên trang này",
    sending: "Đang gửi…",
    sendRsvp: "Gửi xác nhận",
    sendLove: "Gửi lời chúc",
    nameError: "Vui lòng cho chúng tôi biết tên của quý khách để cô dâu chú rể biết ai đã phản hồi.",
    genericError: "Đã có lỗi xảy ra. Vui lòng thử lại.",
    timeoutError: "Kết nối quá thời gian. Vui lòng kiểm tra mạng và thử lại.",
    sendGift: "Gửi quà mừng cưới",
    qrAlt: (label) => `Mã QR cho ${label}`,
    copyAccount: (number) => `Sao chép số tài khoản ${number}`,
  },
  blessings: {
    withLove: "Với tất cả yêu thương",
    tapToSend: "Chạm để gửi lời chúc",
    sentSoFar: (count) => (count === 0 ? "Chưa có lời chúc nào" : `${count.toLocaleString("vi-VN")} lời chúc đã gửi`),
    reactions: { love: "Yêu thương", bloom: "Nở hoa", cheers: "Cạn ly", sparkle: "Niềm vui", rings: "Mãi mãi" },
    willBeThere: "Sẽ đến dự",
    sendingLove: "Gửi yêu thương từ xa",
    firstBlessing: "Gửi lời chúc đến Dâu Rể",
    writeBlessing: "Viết lời chúc",
    showMore: (remaining) => `Xem thêm lời chúc (${remaining})`,
    wishes: (count) => `${count} lời chúc chân thành`,
  },
  chrome: {
    thankYou: "Cảm ơn quý khách đã là một phần trong câu chuyện của chúng tôi",
    gallery: "Album ảnh",
    guestbook: "Sổ lời chúc",
    sectionsAria: "Các mục trong thiệp mời",
  },
  blessingShower: {
    show: "Hiện lời chúc",
    hide: "Ẩn lời chúc",
    count: (count) => `${count} lời chúc`,
  },
  music: {
    tap: "Chạm để bật nhạc ♪",
    play: "Bật nhạc nền",
    pause: "Tạm dừng nhạc nền",
  },
  scratch: {
    label: "Cào để mở",
    orTap: "Hoặc chạm vào đây để mở",
  },
};

/** Returns the copy bundle for a language (English fallback). */
export function getInvitationCopy(lang?: InvitationLang): InvitationCopy {
  return lang === "vi" ? VI : EN;
}

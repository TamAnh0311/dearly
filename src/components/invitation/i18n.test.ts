/**
 * Unit tests for the invitation i18n bundle.
 */

import { describe, expect, it } from "vitest";
import { EVENT_COPY, getEventCopy } from "@/lib/event-types";
import { eventTypeOf } from "@/lib/event-types";
import { INVITATION_LANGUAGES, getInvitationCopy, invitationLocale, isInvitationLang } from "./i18n";

describe("invitation i18n", () => {
  it("defaults to English", () => {
    expect(getInvitationCopy(undefined).lang).toBe("en");
    expect(getInvitationCopy("en").dateLocale).toBe("en-US");
  });

  it("returns Vietnamese copy and locale", () => {
    const vi = getInvitationCopy("vi");
    expect(vi.lang).toBe("vi");
    expect(vi.dateLocale).toBe("vi-VN");
    expect(vi.saveTheDate).toBe("Ngày trọng đại");
    expect(vi.nav.rsvp).toBe("Xác nhận");
    expect(vi.story.eyebrow).toBe("Story of us");
    expect(vi.schedule.eyebrow).toBe("Wedding timeline");
    expect(vi.schedule.title).toBe("Lịch trình hôn lễ");
    expect(vi.venue.eyebrow).toBe("Tổ chức tại");
    expect(vi.venue.title).toBe("Nhà hàng tiệc cưới");
    expect(vi.moments.title).toBe("Khoảnh khắc đáng nhớ");
    expect(vi.rsvp.attendingTitle).toBe("Có, chắc chắn rồi!");
    expect(vi.rsvp.declinedTitle).toBe("Xin lỗi, tôi không thể tham dự");
    expect(vi.blessings.tapToSend).toBe("Chạm để gửi lời chúc");
    expect(vi.blessings.firstBlessing).toBe("Gửi lời chúc đến Dâu Rể");
  });

  it("interpolates names and counts", () => {
    const vi = getInvitationCopy("vi");
    expect(vi.dear("An")).toBe("Thân gửi An");
    expect(vi.blessingShower.count(2)).toBe("2 lời chúc");
    const en = getInvitationCopy("en");
    expect(en.blessings.wishes(1)).toBe("1 heartfelt wish");
    expect(en.blessings.wishes(4)).toBe("4 heartfelt wishes");
  });

  it("exposes locales and narrows language codes", () => {
    expect(invitationLocale("vi")).toBe("vi-VN");
    expect(invitationLocale("en")).toBe("en-US");
    expect(isInvitationLang("vi")).toBe(true);
    expect(isInvitationLang("fr")).toBe(false);
    expect(INVITATION_LANGUAGES.map((l) => l.code)).toEqual(["en", "vi"]);
  });

  it("translates every event type into Vietnamese", () => {
    for (const type of Object.keys(EVENT_COPY) as (keyof typeof EVENT_COPY)[]) {
      const copy = getEventCopy(type, "vi");
      expect(copy.eyebrow.length).toBeGreaterThan(0);
      expect(copy.rsvpTitle.length).toBeGreaterThan(0);
      expect(copy.blessingsTitle.length).toBeGreaterThan(0);
    }
    expect(getEventCopy(eventTypeOf(null), "vi").label).toBe("Đám cưới");
    expect(getEventCopy("wedding", "vi").rsvpEyebrow).toBe("Kindly reply");
  });
});

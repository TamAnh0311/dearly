import { describe, it, expect } from "vitest";
import { buildGoogleCalendarUrl, buildIcsContent } from "./calendar";

const EVENT = {
  title: "Emma & James Wedding",
  date: "2027-06-15",
  startTime: "14:00",
  endTime: "22:00",
  timezone: "Asia/Ho_Chi_Minh",
  venue: "The Grand Estate",
  address: "123 Garden Lane, Da Lat",
  description: "You are cordially invited to celebrate with us.",
};

describe("buildGoogleCalendarUrl", () => {
  it("returns a valid Google Calendar URL", () => {
    const url = buildGoogleCalendarUrl(EVENT);
    expect(url).toContain("calendar.google.com/calendar/render");
    expect(url).toContain("action=TEMPLATE");
    expect(url).toContain("Emma");
    expect(url).toContain("20270615");
  });

  it("encodes special characters in the title", () => {
    const url = buildGoogleCalendarUrl({ ...EVENT, title: "A & B's Party" });
    expect(url).toContain(encodeURIComponent("A & B's Party"));
  });
});

describe("buildIcsContent", () => {
  it("returns valid ICS format", () => {
    const ics = buildIcsContent(EVENT);
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("SUMMARY:Emma & James Wedding");
    expect(ics).toContain("END:VCALENDAR");
  });

  it("includes the venue as location", () => {
    const ics = buildIcsContent(EVENT);
    expect(ics).toContain("LOCATION:The Grand Estate");
  });
});

import { describe, it, expect } from "vitest";
import { rsvpReminderHtml, weeklyDigestHtml, thankYouHtml } from "./email-templates";

describe("rsvpReminderHtml", () => {
  it("includes the guest name and event name", () => {
    const html = rsvpReminderHtml({ guestName: "Alice", eventName: "Emma & James", eventDate: "June 15, 2027", rsvpUrl: "https://dearly.app/emma-james?i=abc123" });
    expect(html).toContain("Alice");
    expect(html).toContain("Emma &amp; James");
    expect(html).toContain("June 15, 2027");
    expect(html).toContain("abc123");
  });
});

describe("weeklyDigestHtml", () => {
  it("includes activity counts", () => {
    const html = weeklyDigestHtml({ eventName: "Wedding", attending: 5, declined: 2, blessings: 3, photos: 1, totalGuests: 50 });
    expect(html).toContain("5");
    expect(html).toContain("Wedding");
  });
});

describe("thankYouHtml", () => {
  it("includes the memory page link", () => {
    const html = thankYouHtml({ guestName: "Bob", eventName: "Wedding", memoryUrl: "https://dearly.app/emma-james" });
    expect(html).toContain("Bob");
    expect(html).toContain("emma-james");
  });
});

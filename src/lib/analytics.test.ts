import { describe, expect, it } from "vitest";
import { sanitizeAnalyticsUrl, shouldSkipAnalyticsUrl } from "./analytics";

describe("sanitizeAnalyticsUrl", () => {
  it("strips personal invitation tokens and fragments", () => {
    expect(sanitizeAnalyticsUrl("https://dearly.app/emma-and-james?i=secret-token#rsvp")).toBe(
      "https://dearly.app/emma-and-james"
    );
  });

  it("keeps the path when there is no query string", () => {
    expect(sanitizeAnalyticsUrl("https://dearly.app/templates/velvet")).toBe(
      "https://dearly.app/templates/velvet"
    );
  });

  it("falls back safely for malformed input", () => {
    expect(sanitizeAnalyticsUrl("not a url?i=secret")).toBe("not a url");
  });
});

describe("shouldSkipAnalyticsUrl", () => {
  it("skips dashboard and auth screens", () => {
    expect(shouldSkipAnalyticsUrl("https://dearly.app/dashboard/editor")).toBe(true);
    expect(shouldSkipAnalyticsUrl("https://dearly.app/login")).toBe(true);
    expect(shouldSkipAnalyticsUrl("https://dearly.app/signup")).toBe(true);
  });

  it("skips embedded previews but counts public pages", () => {
    expect(shouldSkipAnalyticsUrl("https://dearly.app/templates/velvet?embed=1")).toBe(true);
    expect(shouldSkipAnalyticsUrl("https://dearly.app/templates/velvet")).toBe(false);
    expect(shouldSkipAnalyticsUrl("https://dearly.app/emma-and-james?i=token")).toBe(false);
  });
});

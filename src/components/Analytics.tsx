"use client";

/**
 * Vercel Web Analytics wrapper.
 *
 * Runs in production and in development (debug mode) so funnel events can be
 * verified locally. Personal invitation tokens and embedded previews are
 * stripped before any page view is sent.
 */

import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { sanitizeAnalyticsUrl, shouldSkipAnalyticsUrl } from "@/lib/analytics";

export default function Analytics() {
  return (
    <VercelAnalytics
      mode={process.env.NODE_ENV === "production" ? "production" : "development"}
      debug={process.env.NODE_ENV !== "production"}
      beforeSend={(event) => {
        if (shouldSkipAnalyticsUrl(event.url)) return null;
        return { ...event, url: sanitizeAnalyticsUrl(event.url) };
      }}
    />
  );
}

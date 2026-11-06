"use client";

/**
 * Privacy-friendly funnel analytics.
 *
 * Vercel Web Analytics is cookie-free and aggregates page views. These helpers
 * only send event names and non-identifying properties; never pass guest names,
 * messages, emails, invitation tokens or any other personal data.
 */

import { track } from "@vercel/analytics";
import { createClient } from "@/lib/supabase/client";

/** Events used to measure the host and guest funnel. */
export type FunnelEvent =
  | "signup_started"
  | "signup_completed"
  | "signup_failed"
  | "onboarding_started"
  | "onboarding_step_viewed"
  | "onboarding_occasion_selected"
  | "onboarding_template_selected"
  | "event_created"
  | "event_published"
  | "event_unpublished"
  | "invitation_viewed"
  | "rsvp_submitted"
  | "blessing_submitted"
  | "photo_uploaded";

/** Primitive values accepted by Vercel custom events. */
export type FunnelProperties = Record<string, string | number | boolean | null | undefined>;

/**
 * Sends a custom analytics event. Analytics must never break the user journey,
 * so any tracking error is swallowed.
 */
export function trackEvent(name: FunnelEvent, properties?: FunnelProperties): void {
  try {
    track(name, properties);
  } catch {
    /* analytics is best-effort */
  }
  // Also persist to Supabase for funnel analysis. Fire-and-forget.
  try {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      supabase.from("analytics_events").insert({
        event: name,
        properties: properties ?? {},
        user_id: data.user?.id ?? null,
      }).then(() => {});
    });
  } catch {
    /* best-effort */
  }
}

/**
 * Removes query strings and fragments from an analytics URL. Personal invitation
 * links carry `?i=<token>`, which must never leave the browser.
 */
export function sanitizeAnalyticsUrl(raw: string): string {
  try {
    const url = new URL(raw);
    return `${url.origin}${url.pathname}`;
  } catch {
    return raw.split("?")[0].split("#")[0];
  }
}

/**
 * Returns true for URLs that should not be counted as public page views:
 * dashboard/editor screens and embedded template previews.
 */
export function shouldSkipAnalyticsUrl(raw: string): boolean {
  try {
    const url = new URL(raw);
    if (url.searchParams.get("embed") === "1") return true;
    return (
      url.pathname.startsWith("/dashboard") ||
      url.pathname === "/login" ||
      url.pathname === "/signup"
    );
  } catch {
    return false;
  }
}

/**
 * Shared Sentry configuration for browser, Node and edge runtimes.
 *
 * Monitoring must never collect personal data: DSNs are optional, replay and
 * performance sampling default to zero, and URLs are stripped of query strings
 * before an event leaves the app.
 */

import type { ErrorEvent } from "@sentry/nextjs";

/** Removes query strings and fragments from a URL so invitation tokens never leave the app. */
export function scrubUrl(raw: string): string {
  try {
    const url = new URL(raw);
    return `${url.origin}${url.pathname}`;
  } catch {
    return raw.split("?")[0].split("#")[0];
  }
}

/** Scrubs URLs and breadcrumb metadata from a Sentry event and removes user identity. */
export function scrubEvent(event: ErrorEvent): ErrorEvent {
  if (event.request?.url) event.request.url = scrubUrl(event.request.url);
  if (event.request) delete event.request.query_string;
  delete event.user;

  for (const breadcrumb of event.breadcrumbs ?? []) {
    if (!breadcrumb.data) continue;
    for (const key of ["url", "from", "to"]) {
      const value = breadcrumb.data[key];
      if (typeof value === "string") breadcrumb.data[key] = scrubUrl(value);
    }
  }

  return event;
}

/** DSN for the current runtime, or undefined when monitoring is not configured. */
export function sentryDsn(): string | undefined {
  return process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN;
}

/** Base options shared by every runtime. Sampling defaults to errors only. */
export function baseSentryOptions() {
  const tracesSampleRate = Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 0);
  return {
    dsn: sentryDsn(),
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
    release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
    sendDefaultPii: false,
    tracesSampleRate: Number.isFinite(tracesSampleRate) ? tracesSampleRate : 0,
    maxBreadcrumbs: 50,
    beforeSend: (event: ErrorEvent) => scrubEvent(event),
    ignoreErrors: [
      "ResizeObserver loop limit exceeded",
      "ResizeObserver loop completed with undelivered notifications",
      "Non-Error promise rejection captured",
    ],
  };
}

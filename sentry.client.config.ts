/**
 * Browser Sentry setup. No-op unless NEXT_PUBLIC_SENTRY_DSN is configured.
 * Session replay is disabled so guest RSVPs, blessings and photos are never recorded.
 */

import * as Sentry from "@sentry/nextjs";
import { baseSentryOptions, sentryDsn } from "@/lib/sentry-options";

if (sentryDsn()) {
  Sentry.init({
    ...baseSentryOptions(),
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
  });
}

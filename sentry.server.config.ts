/**
 * Node.js server Sentry setup. No-op unless SENTRY_DSN is configured.
 */

import * as Sentry from "@sentry/nextjs";
import { baseSentryOptions, sentryDsn } from "@/lib/sentry-options";

if (sentryDsn()) {
  Sentry.init(baseSentryOptions());
}

/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  compress: true,
  staticPageGenerationTimeout: 180,
  modularizeImports: {
    "lucide-react": {
      transform: "lucide-react/dist/esm/icons/{{ kebabCase member }}",
    },
  },
  experimental: {
    instrumentationHook: true,
  },
};

// Sentry is optional: wraps the config for source-map upload when configured.
// Falls back to bare nextConfig when the SDK doesn't export withSentryConfig
// (e.g. version mismatch or missing auth token).
let config = nextConfig;
try {
  const sentry = await import("@sentry/nextjs");
  if (typeof sentry.withSentryConfig === "function") {
    config = sentry.withSentryConfig(nextConfig, {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      silent: true,
      widenClientFileUpload: true,
      hideSourceMaps: true,
      disableLogger: true,
      automaticVercelMonitors: false,
    });
  }
} catch {
  // @sentry/nextjs not installed or broken — proceed without it.
}

export default config;

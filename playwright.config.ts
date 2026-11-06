/**
 * Playwright config for critical-path E2E tests.
 *
 * Reads .env.local so Supabase keys are available to test helpers
 * without requiring dotenv as a runtime dependency.
 */

import { defineConfig } from "@playwright/test";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

// ── Load .env.local (if present) without overriding existing env vars ────────

const envPath = resolve(__dirname, ".env.local");
if (existsSync(envPath)) {
  const lines = readFileSync(envPath, "utf-8").split("\n");
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq < 1) continue;
    const key = line.slice(0, eq).trim();
    const value = line.slice(eq + 1).trim();
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

// ── Config ───────────────────────────────────────────────────────────────────

const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:3000";
const isLocal = /^http:\/\/(localhost|127\.0\.0\.1)/.test(baseURL);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
  webServer: isLocal
    ? {
        command: "npm run dev",
        url: baseURL,
        reuseExistingServer: true,
        timeout: 180_000,
      }
    : undefined,
});

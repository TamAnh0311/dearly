/**
 * Vitest config — unit tests for pure helpers and API route validation.
 * Run with `npm test`.
 */
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  test: { environment: "node", include: ["src/**/*.test.ts"] },
});
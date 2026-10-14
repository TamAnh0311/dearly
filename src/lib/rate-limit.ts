/**
 * Minimal in-memory sliding-window rate limiter for API routes.
 * Note: state is per server instance — good enough for abuse dampening,
 * not a security boundary.
 */

import type { NextRequest } from "next/server";

interface Bucket {
  hits: number[];
}

const buckets = new Map<string, Bucket>();
const MAX_KEYS = 10_000;

/**
 * Records a hit for `key` and returns how many seconds the caller must wait,
 * or 0 if the request is allowed.
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): number {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => now - t < windowMs);

  if (bucket.hits.length >= limit) {
    return Math.ceil((windowMs - (now - bucket.hits[0])) / 1000);
  }

  bucket.hits.push(now);
  if (buckets.size >= MAX_KEYS && !buckets.has(key)) buckets.clear();
  buckets.set(key, bucket);
  return 0;
}

/** Best-effort client IP from proxy headers. */
export function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

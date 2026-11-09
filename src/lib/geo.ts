/**
 * GeoIP lookup (free ip-api.com) and IP hashing for analytics.
 */

import { createHash } from "crypto";

const GEO_SALT = "dearly-geo-2026";

/** One-way hash of an IP address for deduplication without storing PII. */
export function hashIp(ip: string): string {
  return createHash("sha256").update(`${GEO_SALT}:${ip}`).digest("hex").slice(0, 16);
}

export interface GeoResult {
  country: string | null;
  city: string | null;
}

/** Resolves country and city from an IP address using ip-api.com. Returns nulls on failure. */
export async function lookupGeo(ip: string): Promise<GeoResult> {
  if (ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.") || ip.startsWith("10.")) {
    return { country: null, city: null };
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return { country: null, city: null };
    const data = (await res.json()) as { status: string; country?: string; city?: string };
    if (data.status !== "success") return { country: null, city: null };
    return { country: data.country ?? null, city: data.city ?? null };
  } catch {
    return { country: null, city: null };
  }
}

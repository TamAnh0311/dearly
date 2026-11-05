/**
 * Supabase-backed sliding-window rate limiter for API routes.
 * Calls a Postgres RPC so limits survive serverless cold starts
 * and work consistently across all function instances.
 */

import type { NextRequest } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

/**
 * Records a hit for `key` and returns how many seconds the caller must wait,
 * or 0 if the request is allowed. Fails open on database errors so a broken
 * rate limiter never blocks legitimate traffic.
 */
export async function checkRateLimit(key: string, limit: number, windowMs: number): Promise<number> {
  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase.rpc("check_rate_limit", {
      p_key: key,
      p_limit: limit,
      p_window_ms: windowMs,
    });

    if (error) {
      console.error("[ERROR] rate limit RPC failed", { key, code: error.code });
      return 0;
    }

    return typeof data === "number" ? data : 0;
  } catch (err) {
    console.error("[ERROR] rate limit check threw", { key, err });
    return 0;
  }
}

/** Best-effort client IP from proxy headers. */
export function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

/**
 * Pending design choice — remembers the template + colour scheme a visitor
 * picked on the public gallery/preview so onboarding can pre-select it after
 * signup (survives email confirmation and OAuth redirects via localStorage).
 */

import { COLOR_SCHEMES, type ColorScheme } from "@/components/invitation/styles";

const KEY = "dearly-pending-design";
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const SLUG_RE = /^[a-z0-9-]{1,40}$/;

export interface PendingDesign {
  template: string;
  scheme: string | null;
  savedAt: number;
}

/** Reads `?template=&scheme=` from a URL search string and stores it if valid. */
export function capturePendingDesign(search: string, storage: Storage = window.localStorage): PendingDesign | null {
  const params = new URLSearchParams(search);
  const template = params.get("template");
  if (!template || !SLUG_RE.test(template)) return null;
  const schemeRaw = params.get("scheme");
  const scheme = schemeRaw && SLUG_RE.test(schemeRaw) ? schemeRaw : null;
  const value: PendingDesign = { template, scheme, savedAt: Date.now() };
  try {
    storage.setItem(KEY, JSON.stringify(value));
  } catch {
    return value; // storage unavailable — non-fatal
  }
  return value;
}

/** Returns the stored choice if present, well-formed and not expired. */
export function readPendingDesign(storage: Storage = window.localStorage, now: number = Date.now()): PendingDesign | null {
  try {
    const raw = storage.getItem(KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as PendingDesign;
    if (typeof v.template !== "string" || !SLUG_RE.test(v.template)) return null;
    if (typeof v.savedAt !== "number" || now - v.savedAt > MAX_AGE_MS) return null;
    return { template: v.template, scheme: typeof v.scheme === "string" ? v.scheme : null, savedAt: v.savedAt };
  } catch {
    return null;
  }
}

/** Removes the stored choice (after it has been applied). */
export function clearPendingDesign(storage: Storage = window.localStorage): void {
  try {
    storage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

/** Resolves a scheme id to its colours ("original" or unknown → null = keep template defaults). */
export function schemeColors(id: string | null): ColorScheme["colors"] | null {
  if (!id || id === "original") return null;
  return COLOR_SCHEMES.find((s) => s.id === id)?.colors ?? null;
}

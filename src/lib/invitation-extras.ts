/**
 * Invitation extras common in East Asian invitations: the hosts' families
 * (parents' names) and gift details (bank account / payment QR for the red
 * envelope, 축의금, mừng cưới). Both live in `weddings.customization` (JSONB),
 * so everything is re-validated here before it reaches the guest page.
 */

import type { DressSwatch, GiftAccount, WeddingCustomization } from "@/types/database";

const MAX_TEXT = 120;
const MAX_NOTE = 280;
export const MAX_GIFT_ACCOUNTS = 2;

/** Trims, collapses whitespace and caps the length; empty → undefined. */
function clean(value: unknown, max = MAX_TEXT): string | undefined {
  if (typeof value !== "string") return undefined;
  const t = value.replace(/\s+/g, " ").trim().slice(0, max);
  return t || undefined;
}

/** Accepts only absolute https URLs (QR images are rendered as <img>). */
export function safeHttpsUrl(value: unknown): string | undefined {
  const s = clean(value, 500);
  if (!s) return undefined;
  try {
    const u = new URL(s);
    return u.protocol === "https:" ? u.toString() : undefined;
  } catch {
    return undefined;
  }
}

/** Families block, or null when neither side is filled in. */
export function resolveFamilies(input: WeddingCustomization["families"] | unknown): { side1?: string; side2?: string } | null {
  if (!input || typeof input !== "object") return null;
  const raw = input as Record<string, unknown>;
  const side1 = clean(raw.side1);
  const side2 = clean(raw.side2);
  return side1 || side2 ? { side1, side2 } : null;
}

/** Short couple-entered place line for the hero, trimmed and capped. */
export function resolveLocationLabel(input: unknown): string | null {
  return clean(input, 80) ?? null;
}

/** Practical note shown under the wedding date, trimmed and capped. */
export function resolveDateNote(input: unknown): string | null {
  return clean(input, 220) ?? null;
}

/** Gift block with valid accounts only (needs a label plus a number or QR), or null. */
export function resolveGift(input: WeddingCustomization["gift"] | unknown): { note?: string; accounts: GiftAccount[] } | null {
  if (!input || typeof input !== "object") return null;
  const raw = input as Record<string, unknown>;
  const list = Array.isArray(raw.accounts) ? raw.accounts : [];
  const accounts: GiftAccount[] = [];
  for (const a of list.slice(0, MAX_GIFT_ACCOUNTS)) {
    if (!a || typeof a !== "object") continue;
    const r = a as Record<string, unknown>;
    const account: GiftAccount = {
      label: clean(r.label, 60) ?? "",
      bank: clean(r.bank, 60),
      holder: clean(r.holder, 80),
      number: clean(r.number, 40),
      qrUrl: safeHttpsUrl(r.qrUrl),
    };
    if (account.label && (account.number || account.qrUrl)) accounts.push(account);
  }
  if (accounts.length === 0) return null;
  return { note: clean(raw.note, MAX_NOTE), accounts };
}

/** Dress-code copy + safe hex swatches, or null when empty. */
export function resolveDressCode(input: WeddingCustomization["dressCode"] | unknown): { text?: string; colors: DressSwatch[] } | null {
  if (!input || typeof input !== "object") return null;
  const raw = input as Record<string, unknown>;
  const text = clean(raw.text, 400);
  const colors: DressSwatch[] = [];
  if (Array.isArray(raw.colors)) {
    for (const c of raw.colors.slice(0, 6)) {
      if (!c || typeof c !== "object") continue;
      const r = c as Record<string, unknown>;
      const label = clean(r.label, 24);
      const hex = clean(r.hex, 7);
      if (label && hex && /^#[0-9a-f]{6}$/i.test(hex)) colors.push({ label, hex });
    }
  }
  return text || colors.length ? { text, colors } : null;
}

/** Days in the month grid for a date: leading blanks (Mon-first) then 1..n. */
export function monthGrid(date: Date): (number | null)[] {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const lead = (first.getDay() + 6) % 7; // Monday = 0
  return [...Array<null>(lead).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
}

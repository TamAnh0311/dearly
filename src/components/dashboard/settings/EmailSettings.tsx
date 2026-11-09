"use client";

/**
 * EmailSettings — configure RSVP reminder days and weekly digest toggle.
 * Rendered inside the dashboard Settings page inside the Email Automation section.
 */

import { useState } from "react";
import { Bell, Mail, X } from "lucide-react";

/** Day presets shown as quick-select buttons. */
const PRESET_DAYS = [1, 3, 5, 7, 14, 21, 30] as const;

/** Valid custom day range. */
const MIN_DAY = 1;
const MAX_DAY = 90;

export interface EmailSettingsProps {
  reminderDays: number[];
  weeklyDigestEnabled: boolean;
  onUpdateReminders: (days: number[]) => void;
  onUpdateDigest: (enabled: boolean) => void;
}

/**
 * Toggles a value in a sorted numeric array — adds if absent, removes if present.
 */
function toggleDay(days: number[], day: number): number[] {
  return days.includes(day)
    ? days.filter((d) => d !== day)
    : [...days, day].sort((a, b) => a - b);
}

/**
 * Email automation settings panel: RSVP reminders + weekly digest.
 */
export default function EmailSettings({
  reminderDays,
  weeklyDigestEnabled,
  onUpdateReminders,
  onUpdateDigest,
}: EmailSettingsProps) {
  const [customInput, setCustomInput] = useState("");
  const [customError, setCustomError] = useState<string | null>(null);

  /**
   * Adds a custom day value from the text input.
   * Validates the value is an integer in [MIN_DAY, MAX_DAY] and not already selected.
   */
  function handleAddCustom() {
    const val = parseInt(customInput, 10);
    if (isNaN(val) || val < MIN_DAY || val > MAX_DAY) {
      setCustomError(`Enter a number between ${MIN_DAY} and ${MAX_DAY}.`);
      return;
    }
    if (reminderDays.includes(val)) {
      setCustomError("That day is already selected.");
      return;
    }
    setCustomError(null);
    setCustomInput("");
    onUpdateReminders([...reminderDays, val].sort((a, b) => a - b));
  }

  /**
   * Submits the custom day input on Enter key.
   */
  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCustom();
    }
  }

  return (
    <div className="space-y-6 rounded-xl border border-dearly-border bg-dearly-card p-6">
      {/* ── RSVP Reminders ─────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-dearly-accent" aria-hidden="true" />
          <h3 className="text-sm font-medium text-dearly-text">RSVP Reminders</h3>
        </div>
        <p className="text-xs text-dearly-text-secondary">
          Send reminder emails to guests who haven&apos;t responded this many days before the event.
          Select one or more.
        </p>

        {/* Preset buttons */}
        <div className="flex flex-wrap gap-2">
          {PRESET_DAYS.map((day) => {
            const active = reminderDays.includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => onUpdateReminders(toggleDay(reminderDays, day))}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? "bg-dearly-accent text-white"
                    : "border border-dearly-border bg-dearly-cream text-dearly-text hover:bg-dearly-border/40"
                }`}
                aria-pressed={active}
              >
                {day}d
              </button>
            );
          })}
        </div>

        {/* Selected days as removable pills */}
        {reminderDays.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {reminderDays.map((day) => (
              <span
                key={day}
                className="inline-flex items-center gap-1 rounded-full bg-dearly-accent/10 px-2.5 py-1 text-xs font-medium text-dearly-accent"
              >
                {day} day{day !== 1 ? "s" : ""} before
                <button
                  type="button"
                  onClick={() => onUpdateReminders(reminderDays.filter((d) => d !== day))}
                  className="ml-0.5 rounded-full p-0.5 hover:bg-dearly-accent/20 focus:outline-none"
                  aria-label={`Remove ${day}-day reminder`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Custom day input */}
        <div className="flex items-start gap-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={MIN_DAY}
                max={MAX_DAY}
                value={customInput}
                onChange={(e) => {
                  setCustomInput(e.target.value);
                  setCustomError(null);
                }}
                onKeyDown={handleInputKeyDown}
                placeholder="Custom day…"
                className="w-28 rounded-lg border border-dearly-border bg-dearly-cream px-3 py-1.5 text-sm text-dearly-text focus:outline-none"
                aria-label="Custom reminder day"
              />
              <button
                type="button"
                onClick={handleAddCustom}
                className="rounded-lg border border-dearly-border bg-dearly-cream px-3 py-1.5 text-xs font-medium text-dearly-text transition hover:bg-dearly-border/40"
              >
                Add
              </button>
            </div>
            {customError && (
              <p className="text-xs text-red-500">{customError}</p>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-dearly-border" />

      {/* ── Weekly Digest ───────────────────────────────────────────────── */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-dearly-accent" aria-hidden="true" />
          <h3 className="text-sm font-medium text-dearly-text">Weekly Digest</h3>
        </div>
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={weeklyDigestEnabled}
            onChange={(e) => onUpdateDigest(e.target.checked)}
            className="h-4 w-4 rounded border-dearly-border accent-dearly-accent"
          />
          <span className="text-sm text-dearly-text">
            Send me a weekly summary every Monday
          </span>
        </label>
        <p className="ml-7 text-xs text-dearly-text-secondary">
          Includes new RSVPs, guest messages, and photo uploads from the past week.
        </p>
      </div>
    </div>
  );
}

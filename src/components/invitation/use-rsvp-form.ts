"use client";

/**
 * useRsvpForm — shared form logic for both RsvpSection (cinematic) and
 * StorybookRsvp (storybook). Handles state, validation, submission,
 * localStorage persistence and reset so neither component duplicates it.
 */

import { useCallback, useEffect, useState } from "react";
import type { GuestbookEntryRow } from "@/types/database";
import type { InvitationCopy } from "./i18n";
import { readStored, storageKey, submitRsvp } from "./sections/RsvpSection";

type Choice = "attending" | "declined";

interface UseRsvpFormOptions {
  weddingId: string;
  demo: boolean;
  invitee?: { token: string; name: string; maxPartySize: number } | null;
  ui: InvitationCopy;
  onBlessing: (entry: GuestbookEntryRow) => void;
  /** Called after a successful submission (e.g. trigger burst animation). */
  onSuccess?: () => void;
}

interface RsvpFormState {
  choice: Choice | null;
  name: string;
  partySize: number;
  message: string;
  status: "idle" | "sending" | "done";
  error: string | null;
}

interface RsvpFormActions {
  setChoice: (c: Choice) => void;
  setName: (n: string) => void;
  setPartySize: (n: number) => void;
  setMessage: (m: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  reset: () => void;
}

/** Extracts duplicated RSVP form logic used by both renderers. */
export function useRsvpForm({
  weddingId,
  demo,
  invitee,
  ui,
  onBlessing,
  onSuccess,
}: UseRsvpFormOptions): RsvpFormState & RsvpFormActions {
  const maxParty = invitee?.maxPartySize ?? 10;
  const t = ui.rsvp;

  const [choice, setChoice] = useState<Choice | null>(null);
  const [name, setName] = useState(invitee?.name ?? "");
  const [partySize, setPartySize] = useState(1);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  // Restore a previous answer from this browser.
  useEffect(() => {
    if (demo) return;
    const stored = readStored(weddingId);
    if (!stored) return;
    setChoice(stored.choice);
    setName(stored.name);
    setStatus("done");
  }, [weddingId, demo]);

  /** Validates and submits the form. */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!choice) return;
      const guestName = name.trim();
      if (!guestName) {
        setError(t.nameError);
        return;
      }
      setError(null);
      setStatus("sending");
      try {
        const blessing = await submitRsvp(
          {
            weddingId,
            guestName,
            attending: choice === "attending",
            partySize: choice === "attending" ? Math.min(partySize, maxParty) : undefined,
            inviteeToken: invitee?.token,
            message: message.trim() || undefined,
          },
          demo,
          ui
        );
        if (blessing) onBlessing(blessing);
        if (!demo) {
          try {
            window.localStorage.setItem(storageKey(weddingId), JSON.stringify({ choice, name: guestName }));
          } catch {
            /* private mode — non-fatal */
          }
        }
        setStatus("done");
        onSuccess?.();
      } catch (err) {
        setStatus("idle");
        setError(err instanceof Error ? err.message : t.genericError);
      }
    },
    [choice, name, partySize, message, weddingId, demo, invitee, maxParty, ui, t, onBlessing, onSuccess]
  );

  /** Lets the guest answer again. */
  const reset = useCallback(() => {
    setStatus("idle");
    setMessage("");
    setError(null);
  }, []);

  return {
    choice,
    name,
    partySize,
    message,
    status,
    error,
    setChoice,
    setName,
    setPartySize,
    setMessage,
    handleSubmit,
    reset,
  };
}

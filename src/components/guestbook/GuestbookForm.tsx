"use client";

/**
 * Guestbook form — public submission form for guest messages.
 * Includes honeypot field for spam prevention.
 */

import { useState, FormEvent } from "react";
import { Send, Check } from "lucide-react";
import type { ResolvedTheme } from "@/components/templates/types";

interface GuestbookFormProps {
  weddingId: string;
  theme: ResolvedTheme;
}

export default function GuestbookForm({ weddingId, theme }: GuestbookFormProps) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (honeypot) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weddingId, guestName: name, message }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to submit message");
      }
      setSuccess(true);
      setName("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border p-6" style={{ borderColor: `${theme.colors.primary}20` }}>
        <Check size={32} style={{ color: theme.colors.primary }} />
        <p className="text-sm" style={{ color: theme.colors.accent }}>Thank you for your message!</p>
        <button onClick={() => setSuccess(false)} className="text-sm underline" style={{ color: theme.colors.primary }}>Write another</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={100}
        className="rounded-lg border px-4 py-2.5 text-sm" style={{ borderColor: `${theme.colors.primary}30` }} />
      <textarea placeholder="Write a message for the happy couple..." value={message} onChange={(e) => setMessage(e.target.value)}
        required maxLength={1000} rows={4} className="resize-none rounded-lg border px-4 py-2.5 text-sm" style={{ borderColor: `${theme.colors.primary}30` }} />
      <input type="text" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1} autoComplete="off" className="absolute -left-[9999px] h-0 w-0 opacity-0" aria-hidden="true" />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button type="submit" disabled={loading}
        className="flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition disabled:opacity-50"
        style={{ backgroundColor: theme.colors.primary }}>
        <Send size={16} />
        {loading ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}

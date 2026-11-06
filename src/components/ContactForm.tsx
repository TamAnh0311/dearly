"use client";

/**
 * ContactForm — sends a message to Dearly support via /api/contact.
 */

import { useState, FormEvent } from "react";
import { Send, Check } from "lucide-react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  /** Submits the contact form. */
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50/50 p-6 text-center">
        <Check size={28} className="mx-auto text-green-600" />
        <p className="mt-3 font-semibold text-green-700">Message sent</p>
        <p className="mt-1 text-sm text-green-600">We&apos;ll get back to you within one working day.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-dearly-border bg-dearly-card p-6 shadow-card">
      <h2 className="text-lg font-bold text-dearly-text">Send us a message</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1 block text-sm font-medium text-dearly-text-secondary">Name</label>
          <input id="contact-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full rounded-lg border border-dearly-border bg-white px-3 py-2 text-sm focus:border-dearly-accent focus:outline-none focus:ring-1 focus:ring-dearly-accent" />
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-1 block text-sm font-medium text-dearly-text-secondary">Email</label>
          <input id="contact-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded-lg border border-dearly-border bg-white px-3 py-2 text-sm focus:border-dearly-accent focus:outline-none focus:ring-1 focus:ring-dearly-accent" />
        </div>
      </div>
      <div>
        <label htmlFor="contact-message" className="mb-1 block text-sm font-medium text-dearly-text-secondary">Message</label>
        <textarea id="contact-message" required rows={4} minLength={10} maxLength={2000} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help?" className="w-full rounded-lg border border-dearly-border bg-white px-3 py-2 text-sm focus:border-dearly-accent focus:outline-none focus:ring-1 focus:ring-dearly-accent" />
      </div>
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={status === "sending"} className="flex items-center gap-2 rounded-lg bg-dearly-accent px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50">
        <Send size={14} /> {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

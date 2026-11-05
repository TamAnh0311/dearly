/**
 * Contact page — a simple, human support entry point for hosts and guests.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail, ShieldCheck } from "lucide-react";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Dearly for help with invitations, guest lists, RSVPs, photos or your account.",
  alternates: { canonical: absoluteUrl("/contact") },
  openGraph: {
    title: "Contact Dearly",
    description: "Get in touch with Dearly for help with invitations, guest lists, RSVPs, photos or your account.",
    url: absoluteUrl("/contact"),
  },
  twitter: {
    card: "summary",
    title: "Contact Dearly",
    description: "Get in touch with Dearly for help with invitations, guest lists, RSVPs, photos or your account.",
  },
};

/** Public contact details and common support routes. */
export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="font-display text-xl font-bold text-dearly-accent">
        Dearly
      </Link>

      <h1 className="mt-8 font-display text-3xl font-bold text-dearly-text md:text-5xl">Talk to us</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-dearly-text-secondary">
        Questions about a design, a guest list, RSVPs or a photo that will not upload? Send us a note and we will help you get
        back to the good part.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <a
          href="mailto:hello@dearly.app"
          className="rounded-2xl border border-dearly-border bg-dearly-card p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
        >
          <Mail size={20} className="text-dearly-accent" aria-hidden />
          <h2 className="mt-4 text-lg font-bold">Email support</h2>
          <p className="mt-2 text-sm leading-relaxed text-dearly-text-secondary">
            hello@dearly.app
            <br />
            For privacy requests: privacy@dearly.app
          </p>
        </a>

        <div className="rounded-2xl border border-dearly-border bg-dearly-card p-6 shadow-card">
          <Clock size={20} className="text-dearly-accent" aria-hidden />
          <h2 className="mt-4 text-lg font-bold">Response time</h2>
          <p className="mt-2 text-sm leading-relaxed text-dearly-text-secondary">
            We usually reply within one working day. If your event is today, put “TODAY” in the subject so we can prioritise it.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-dearly-border bg-dearly-card/60 p-6">
        <ShieldCheck size={20} className="text-dearly-accent" aria-hidden />
        <h2 className="mt-4 text-lg font-bold">Faster answers</h2>
        <p className="mt-2 text-sm leading-relaxed text-dearly-text-secondary">
          Most questions are covered in the{" "}
          <Link href="/help" className="underline hover:text-dearly-text">
            Help Center
          </Link>
          , including guest lists, RSVPs, photo uploads, music and publishing. For data requests, read our{" "}
          <Link href="/privacy" className="underline hover:text-dearly-text">
            Privacy Policy
          </Link>
          .
        </p>
      </div>

      <footer className="mt-16 border-t border-dearly-border pt-6 text-sm text-dearly-text-muted">
        <div className="flex flex-wrap gap-6">
          <Link href="/privacy" className="underline hover:text-dearly-text-secondary">Privacy Policy</Link>
          <Link href="/terms" className="underline hover:text-dearly-text-secondary">Terms of Service</Link>
          <Link href="/help" className="underline hover:text-dearly-text-secondary">Help</Link>
          <Link href="/" className="underline hover:text-dearly-text-secondary">Home</Link>
        </div>
      </footer>
    </main>
  );
}

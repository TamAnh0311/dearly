/**
 * How it works — SEO landing page targeting "how to create digital invitation"
 * and related long-tail queries. Includes HowTo structured data for rich results.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "How It Works — Create Your Event Invitation in Minutes",
  description:
    "Three steps: pick a design, add your details, and share one link. Your guests RSVP inside the invitation, leave messages, and upload photos. Free during early access.",
  alternates: { canonical: absoluteUrl("/how-it-works") },
};

const STEPS = [
  {
    num: 1,
    title: "Choose a design",
    body: "Browse animated templates — curtain reveals, wax seals, garden gates and more. Or start from a blank canvas and build your own. No signup required to preview.",
    time: "PT2M",
  },
  {
    num: 2,
    title: "Add your details",
    body: "Enter your names, date, venue and schedule. Pick colours, fonts and which sections to show. The live preview updates instantly as you type.",
    time: "PT5M",
  },
  {
    num: 3,
    title: "Share one link",
    body: "Publish your page and share the link. Guests RSVP inside the invitation, leave blessings, and after the event your page becomes a memory book with shared photos.",
    time: "PT1M",
  },
];

/** HowTo structured data for Google rich results. */
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to create a digital event invitation with Dearly",
  description: "Create a cinematic invitation with RSVP, guest list, and photo sharing in three steps.",
  totalTime: "PT8M",
  tool: [{ "@type": "HowToTool", name: "Dearly (free web app)" }],
  step: STEPS.map((s) => ({
    "@type": "HowToStep",
    position: s.num,
    name: s.title,
    text: s.body,
    url: absoluteUrl(`/how-it-works#step-${s.num}`),
  })),
};

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-dearly-cream">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />

      <div className="mx-auto max-w-3xl px-6 py-20">
        <Link href="/" className="font-display text-2xl font-bold text-dearly-accent">
          {SITE_NAME}
        </Link>

        <h1 className="mt-10 font-display text-4xl font-bold text-dearly-text md:text-5xl">
          How it works
        </h1>
        <p className="mt-4 text-lg text-dearly-text-secondary">
          From choosing a design to sharing with your guests — the whole process takes about 8 minutes.
        </p>

        <ol className="mt-14 space-y-12">
          {STEPS.map((step) => (
            <li key={step.num} id={`step-${step.num}`} className="flex gap-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-dearly-accent text-lg font-bold text-white">
                {step.num}
              </span>
              <div>
                <h2 className="font-display text-xl font-bold text-dearly-text">{step.title}</h2>
                <p className="mt-2 leading-relaxed text-dearly-text-secondary">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-16 rounded-2xl border border-dearly-border bg-dearly-card p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-dearly-text">Ready to start?</h2>
          <p className="mt-2 text-dearly-text-secondary">Free during early access. No card required.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/signup" className="rounded-xl bg-dearly-accent px-6 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90">
              Create your invitation
            </Link>
            <Link href="/templates" className="rounded-xl border border-dearly-border bg-dearly-card px-6 py-3 text-sm font-semibold text-dearly-text hover:bg-dearly-cream">
              Browse designs
            </Link>
          </div>
        </div>

        <footer className="mt-12 flex flex-wrap gap-6 text-sm text-dearly-text-muted">
          <Link href="/templates" className="hover:text-dearly-text-secondary">Templates</Link>
          <Link href="/privacy" className="hover:text-dearly-text-secondary">Privacy</Link>
          <Link href="/terms" className="hover:text-dearly-text-secondary">Terms</Link>
          <Link href="/contact" className="hover:text-dearly-text-secondary">Contact</Link>
        </footer>
      </div>
    </main>
  );
}

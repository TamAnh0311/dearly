/**
 * Marketing landing page — hero + feature highlights + CTA.
 */

import Link from "next/link";
import { Heart, Image, Clock, MessageSquare } from "lucide-react";

const FEATURES = [
  {
    icon: Heart,
    title: "10 Stunning Templates",
    description: "From classic elegant to modern glassmorphism — each with unique animations and full customization.",
  },
  {
    icon: Image,
    title: "Photo Gallery",
    description: "Three layout styles — masonry, albums, and timeline. Let guests upload their photos too.",
  },
  {
    icon: Clock,
    title: "Event Timeline",
    description: "Share your wedding day schedule with animated, template-styled timelines.",
  },
  {
    icon: MessageSquare,
    title: "Digital Guest Book",
    description: "Collect heartfelt messages from your guests in a beautifully styled guest book.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dearly-cream">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12">
        <span className="font-display text-2xl font-bold text-dearly-accent">Dearly</span>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-dearly-text-secondary transition hover:text-dearly-text"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-dearly-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center md:py-32">
        <h1 className="font-display text-4xl font-bold leading-tight text-dearly-text md:text-6xl">
          Your love story,
          <br />
          <span className="text-dearly-accent">beautifully told</span>
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-lg text-dearly-text-secondary">
          Create stunning wedding invitations and photo galleries in minutes.
          Pick a template, customize everything, share with your guests.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-lg bg-dearly-accent px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Create your wedding site
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-dearly-border bg-dearly-card p-8 shadow-card"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-dearly-accent-soft">
                <Icon size={20} className="text-dearly-accent" />
              </div>
              <h3 className="font-display text-lg font-semibold text-dearly-text">{title}</h3>
              <p className="mt-2 text-sm text-dearly-text-secondary">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dearly-border px-6 py-8 text-center text-sm text-dearly-text-muted">
        &copy; {new Date().getFullYear()} Dearly. Made with love.
      </footer>
    </div>
  );
}

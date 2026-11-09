/**
 * Help Center hub — public, searchable documentation for hosts.
 * Guides live in `src/lib/guides.ts`; this page only composes the chrome.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Heart, Sparkles } from "lucide-react";
import HelpCenter from "@/components/help/HelpCenter";
import { GUIDES } from "@/lib/guides";
import { absoluteUrl } from "@/lib/seo";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Help & Guides",
  description:
    "Step-by-step Dearly guides: create an invitation, choose a design, build a guest list, collect RSVPs and photos, add music, publish and share.",
  alternates: {
    canonical: absoluteUrl("/help"),
    languages: { vi: absoluteUrl("/vi/huong-dan"), "x-default": absoluteUrl("/help") },
  },
  openGraph: {
    title: "Dearly Help & Guides",
    description: "Everything you need to build, share and keep your Dearly invitation.",
    url: absoluteUrl("/help"),
  },
  twitter: {
    card: "summary",
    title: "Dearly Help & Guides",
    description: "Everything you need to build, share and keep your Dearly invitation.",
  },
};

const STARTERS = ["create-your-invitation", "guest-list", "photos-and-memories"] as const;

export default function HelpPage() {
  const starters = STARTERS.map((slug) => GUIDES.find((g) => g.slug === slug)!).filter(Boolean);

  return (
    <>
      <div className="mx-auto max-w-6xl px-5 pt-6 md:px-8">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Help & Guides" }]} />
      </div>
      <section className="relative overflow-hidden px-5 pb-16 pt-6 text-center md:px-8 md:pt-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_55%_at_50%_0%,rgb(var(--dearly-rose-soft))_0%,transparent_70%),radial-gradient(ellipse_40%_40%_at_85%_30%,rgb(var(--dearly-gold-soft))_0%,transparent_70%)]"
        />
        <div className="relative mx-auto max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full bg-dearly-accent-soft px-3 py-1 text-xs font-semibold text-dearly-accent">
            <BookOpen size={13} aria-hidden /> {GUIDES.length} guides · updated with every release
          </p>
          <h1 className="mt-6 font-display text-4xl font-bold leading-tight md:text-6xl">
            Help &amp; guides
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-dearly-text-secondary">
            Short, practical answers for building your invitation, inviting guests and keeping the memories afterwards.
          </p>
        </div>
      </section>

      <section className="px-5 pb-20 md:px-8">
        <div className="mx-auto max-w-6xl">
          <HelpCenter />
        </div>
      </section>

      <section className="border-y border-dearly-border/60 bg-dearly-card/40 px-5 py-14 md:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center gap-2 text-dearly-accent">
            <Sparkles size={16} aria-hidden />
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em]">Start here</h2>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {starters.map((guide) => (
              <Link
                key={guide.slug}
                href={`/help/${guide.slug}`}
                className="group rounded-2xl border border-dearly-border bg-dearly-card p-5 transition hover:-translate-y-0.5 hover:border-dearly-accent/40 hover:shadow-card"
              >
                <h3 className="font-display text-lg font-bold group-hover:text-dearly-accent">{guide.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-dearly-text-secondary">{guide.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 text-center md:px-8">
        <div className="mx-auto max-w-xl">
          <Heart size={24} className="mx-auto fill-dearly-rose text-dearly-rose" aria-hidden />
          <h2 className="mt-4 font-display text-2xl font-bold">Ready to try it?</h2>
          <p className="mt-2 text-sm text-dearly-text-secondary">
            Create a free invitation, preview every design and share it when it feels right.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/signup" className="rounded-xl bg-dearly-accent px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:opacity-90">
              Start free
            </Link>
            <Link href="/templates" className="rounded-xl border border-dearly-border bg-dearly-card px-6 py-3 text-sm font-semibold transition hover:border-dearly-accent/40">
              Browse designs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

/**
 * Pricing — public plans page (monetisation scaffold). Plans and limits come
 * from src/lib/plans.ts; paid checkout is stubbed until billing ships.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { PLANS, PLANS_ENABLED } from "@/lib/plans";
import { absoluteUrl } from "@/lib/seo";
import UpgradeButton from "@/components/billing/UpgradeButton";

export const metadata: Metadata = {
  title: "Pricing — free wedding & event invitations",
  description:
    "Start free: animated invitations, RSVP, blessings and a photo album. Upgrade for signature openings, bigger guest lists, more photos and keeping your memory book online forever.",
  alternates: { canonical: absoluteUrl("/pricing") },
  robots: PLANS_ENABLED ? undefined : { index: false, follow: false },
};

const FAQ = [
  { q: "Is Dearly really free?", a: "Yes. You can create, share and collect RSVPs for any event on the free plan, with standard designs, 50 named guests and 50 photos." },
  { q: "What happens to my event page after the day?", a: "It turns into a memory book with your photos and blessings. Free pages stay online for 90 days after the event; Premium for 2 years; Forever keeps it online permanently." },
  { q: "Do my guests need an account?", a: "Never. Guests open your link, RSVP, leave a blessing and share photos without signing up." },
  { q: "Can I upgrade later?", a: "Yes — upgrade any time before or after your event; nothing you've collected is lost." },
];

export default function PricingPage() {
  // Hidden during early access: everything is free, so there is nothing to price.
  if (!PLANS_ENABLED) notFound();
  const plans = [PLANS.free, PLANS.premium, PLANS.forever];
  return (
    <main className="min-h-screen bg-dearly-cream px-6 pb-24 pt-28">
      <script
        type="application/ld+json"
        // FAQ rich results for search engines.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          }),
        }}
      />
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-dearly-border/50 bg-dearly-cream/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-2xl font-bold text-dearly-accent">
            Dearly
          </Link>
          <Link href="/signup" className="rounded-lg bg-dearly-accent px-4 py-2 text-sm font-semibold text-white">
            Start free
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-dearly-accent">Pricing</p>
        <h1 className="mt-3 font-display text-4xl font-bold md:text-5xl">Free to fall in love with</h1>
        <p className="mt-4 text-dearly-text-secondary">One price per event, no subscriptions. Upgrade only when you want signature designs, a bigger guest list or a memory book that lasts.</p>
      </div>

      <div className="mx-auto mt-14 grid max-w-6xl gap-6 md:grid-cols-3">
        {plans.map((p) => {
          const featured = p.id === "premium";
          return (
            <section
              key={p.id}
              className={`flex flex-col rounded-2xl border bg-dearly-card p-7 shadow-card ${featured ? "border-dearly-accent ring-2 ring-dearly-accent/20" : "border-dearly-border"}`}
            >
              {featured && <span className="mb-3 self-start rounded-full bg-dearly-accent px-3 py-1 text-[11px] font-semibold text-white">Most loved for weddings</span>}
              <h2 className="text-xl font-bold">{p.name}</h2>
              <p className="mt-2">
                <span className="font-display text-4xl font-bold">{p.price}</span> <span className="text-sm text-dearly-text-secondary">{p.priceNote}</span>
              </p>
              <ul className="mt-6 flex-1 space-y-3 text-sm">
                {p.highlights.map((h) => (
                  <li key={h} className="flex gap-2">
                    <Check size={17} className="mt-0.5 shrink-0 text-emerald-600" />
                    {h}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                {p.id === "free" ? (
                  <Link href="/signup" className="block rounded-xl border border-dearly-border px-5 py-3 text-center text-sm font-semibold hover:bg-dearly-cream">
                    Start free
                  </Link>
                ) : (
                  <UpgradeButton
                    plan={p.id}
                    label={`Choose ${p.name}`}
                    className={`w-full rounded-xl px-5 py-3 text-sm font-semibold ${featured ? "bg-dearly-accent text-white" : "border border-dearly-border hover:bg-dearly-cream"}`}
                  />
                )}
              </div>
            </section>
          );
        })}
      </div>

      <section className="mx-auto mt-20 max-w-3xl">
        <h2 className="text-center font-display text-3xl font-bold">Questions</h2>
        <dl className="mt-8 space-y-6">
          {FAQ.map((f) => (
            <div key={f.q} className="rounded-xl border border-dearly-border bg-dearly-card p-5">
              <dt className="font-semibold">{f.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-dearly-text-secondary">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}

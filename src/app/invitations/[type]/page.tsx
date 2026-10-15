/**
 * Occasion landing pages (/invitations/wedding, /birthday, /party,
 * /social-event, /date-night) — statically generated SEO pages with unique
 * copy, a design showcase pulled from the templates table and FAQ rich data.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Heart } from "lucide-react";
import LayoutThumbnail from "@/components/invitation/LayoutThumbnail";
import { LAYOUT_LABEL, getInvitationStyle } from "@/components/invitation/styles";
import { OCCASIONS, getOccasion } from "@/lib/occasions";
import { PLACEHOLDER_IMAGES } from "@/lib/placeholder-images";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";
import { PLANS_ENABLED } from "@/lib/plans";
import { createPublicClient } from "@/lib/supabase/public";
import type { TemplateRow } from "@/types/database";

export const revalidate = 3600;

interface PageProps {
  params: { type: string };
}

/** Pre-renders every occasion page at build time. */
export function generateStaticParams() {
  return OCCASIONS.map((o) => ({ type: o.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const o = getOccasion(params.type);
  if (!o) return { title: "Not found", robots: { index: false } };
  const url = absoluteUrl(`/invitations/${o.slug}`);
  return {
    title: o.title,
    description: o.description,
    alternates: { canonical: url },
    openGraph: { title: `${o.title} | ${SITE_NAME}`, description: o.description, url, type: "website" },
    twitter: { card: "summary_large_image", title: o.title, description: o.description },
  };
}

/** Templates suited to this occasion (best effort; empty when DB is unreachable). */
async function templatesFor(types: string[]): Promise<TemplateRow[]> {
  if (types.length === 0) return [];
  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data } = await supabase.from("templates").select("*").overlaps("event_types", types).order("name").limit(12);
  return (data ?? []) as TemplateRow[];
}

export default async function OccasionPage({ params }: PageProps) {
  const o = getOccasion(params.type);
  if (!o) notFound();
  const templates = await templatesFor(o.eventTypes);

  return (
    <main className="min-h-screen bg-dearly-cream text-dearly-text">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: SITE_NAME, item: absoluteUrl("/") },
                  { "@type": "ListItem", position: 2, name: o.navLabel, item: absoluteUrl(`/invitations/${o.slug}`) },
                ],
              },
              { "@type": "FAQPage", mainEntity: o.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
            ],
          }),
        }}
      />

      <nav className="sticky top-0 z-50 border-b border-dearly-border/50 bg-dearly-cream/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-2xl font-bold text-dearly-accent">
            Dearly
          </Link>
          {/* Weddings lead; other occasions sit in a quieter "also for" group. */}
          <div className="hidden items-center gap-6 md:flex">
            <Link href="/invitations/wedding" className={`text-sm font-semibold ${o.slug === "wedding" ? "text-dearly-accent" : "text-dearly-text hover:text-dearly-accent"}`}>
              Weddings
            </Link>
            <div className="flex items-center gap-4 text-xs text-dearly-text-muted">
              <span className="uppercase tracking-[0.2em]">Also for</span>
              {OCCASIONS.filter((x) => x.slug !== "wedding").map((x) => (
                <Link key={x.slug} href={`/invitations/${x.slug}`} className={x.slug === o.slug ? "font-semibold text-dearly-accent" : "hover:text-dearly-text-secondary"}>
                  {x.navLabel.replace(" invitations", "").replace(" cards", "")}
                </Link>
              ))}
            </div>
          </div>
          <Link href={o.cta.href} className="rounded-lg bg-dearly-accent px-4 py-2 text-sm font-semibold text-white">
            Start free
          </Link>
        </div>
      </nav>

      <header className="px-6 pb-16 pt-20 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-dearly-accent">{o.navLabel}</p>
        <h1 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-bold leading-tight md:text-6xl">{o.h1}</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-dearly-text-secondary">{o.intro}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href={o.cta.href} className="rounded-xl bg-dearly-accent px-7 py-4 font-semibold text-white shadow-card">
            {o.cta.label}
          </Link>
          <Link href="/templates" className="rounded-xl border border-dearly-border bg-dearly-card px-7 py-4 font-semibold">
            Browse designs
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-5 px-6 pb-20 sm:grid-cols-2 lg:grid-cols-4">
        {o.features.map((f) => (
          <div key={f.title} className="rounded-2xl border border-dearly-border bg-dearly-card p-6 shadow-card">
            <Heart size={18} className="text-dearly-accent" />
            <h2 className="mt-4 text-lg font-bold">{f.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-dearly-text-secondary">{f.body}</p>
          </div>
        ))}
      </section>

      {templates.length > 0 && (
        <section className="bg-dearly-card/50 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center font-display text-3xl font-bold md:text-4xl">Designs for your {o.navLabel.toLowerCase().replace(" invitations", "")}</h2>
            <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
              {templates.map((t, i) => (
                <Link key={t.id} href={`/templates/${t.slug}`} className="group overflow-hidden rounded-2xl border border-dearly-border bg-dearly-card shadow-card transition hover:-translate-y-1">
                  <div className="h-40 overflow-hidden">
                    <LayoutThumbnail slug={t.slug} colors={t.default_config.colors} fonts={t.default_config.fonts} photo={PLACEHOLDER_IMAGES.wedding[i % PLACEHOLDER_IMAGES.wedding.length]} />
                  </div>
                  <div className="flex items-center justify-between gap-2 p-3">
                    <span className="truncate text-sm font-bold">{t.name}</span>
                    <span className="shrink-0 rounded-full bg-dearly-accent-soft px-2 py-0.5 text-[10px] font-semibold text-dearly-accent">{LAYOUT_LABEL[getInvitationStyle(t.slug).hero]}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-center font-display text-3xl font-bold">Frequently asked questions</h2>
        <dl className="mt-8 space-y-4">
          {o.faq.map((f) => (
            <div key={f.q} className="rounded-xl border border-dearly-border bg-dearly-card p-5">
              <dt className="flex gap-2 font-semibold">
                <Check size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                {f.q}
              </dt>
              <dd className="mt-2 pl-7 text-sm leading-relaxed text-dearly-text-secondary">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <footer className="border-t border-dearly-border px-6 py-10 text-center text-sm text-dearly-text-muted">
        <div className="flex flex-wrap justify-center gap-5">
          {OCCASIONS.map((x) => (
            <Link key={x.slug} href={`/invitations/${x.slug}`} className="hover:text-dearly-text-secondary">
              {x.navLabel}
            </Link>
          ))}
          {PLANS_ENABLED && (
            <Link href="/pricing" className="hover:text-dearly-text-secondary">
              Pricing
            </Link>
          )}
        </div>
        <p className="mt-4">&copy; {new Date().getFullYear()} Dearly</p>
      </footer>
    </main>
  );
}

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
import { GUIDES } from "@/lib/guides";
import { PLACEHOLDER_IMAGES } from "@/lib/placeholder-images";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";
import { PLANS_ENABLED } from "@/lib/plans";
import { createPublicClient } from "@/lib/supabase/public";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import type { TemplateRow } from "@/types/database";

export const revalidate = 3600;

interface PageProps {
  params: { type: string };
}

/** Pre-renders every occasion page at build time. */
export function generateStaticParams() {
  return OCCASIONS.map((o) => ({ type: o.slug }));
}

const viSlugs: Record<string, string> = { wedding: "wedding", birthday: "birthday", party: "party" };

export function generateMetadata({ params }: PageProps): Metadata {
  const o = getOccasion(params.type);
  if (!o) return { title: "Not found", robots: { index: false } };
  const url = absoluteUrl(`/invitations/${o.slug}`);
  return {
    title: o.title,
    description: o.description,
    alternates: {
      canonical: url,
      ...(viSlugs[o.slug]
        ? { languages: { vi: absoluteUrl(`/vi/invitations/${viSlugs[o.slug]}`), "x-default": absoluteUrl(`/invitations/${o.slug}`) } }
        : {}),
    },
    openGraph: { title: `${o.title} | ${SITE_NAME}`, description: o.description, url, type: "website" },
    twitter: { card: "summary_large_image", title: o.title, description: o.description },
  };
}

/** Templates suited to this occasion (best effort; empty when DB is unreachable). */
async function templatesFor(types: string[]): Promise<TemplateRow[]> {
  if (types.length === 0) return [];
  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data } = await supabase.from("templates").select("*").overlaps("event_types", types).neq("hidden", true).order("name").limit(12);
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
          <div className="hidden items-center gap-4 text-xs text-dearly-text-muted md:flex">
            <span className="uppercase tracking-[0.2em]">Occasions</span>
            {OCCASIONS.map((x) => (
              <Link key={x.slug} href={`/invitations/${x.slug}`} className={x.slug === o.slug ? "font-semibold text-dearly-accent" : "hover:text-dearly-text-secondary"}>
                {x.navLabel.replace(" invitations", "").replace(" cards", "")}
              </Link>
            ))}
          </div>
          <Link href={o.cta.href} className="rounded-lg bg-dearly-accent px-4 py-2 text-sm font-semibold text-white">
            Start free
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 pt-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Invitations", href: "/invitations/wedding" }, { label: o.navLabel }]} />
      </div>

      <header className="px-6 pb-16 pt-6 text-center">
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

      {o.howTo && (
        <section className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="text-center font-display text-3xl font-bold md:text-4xl">How to create your {o.navLabel.toLowerCase()}</h2>
          <ol className="mt-10 space-y-8">
            {o.howTo.map((step, i) => (
              <li key={step.title} className="flex gap-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-dearly-accent text-lg font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-xl font-bold text-dearly-text">{step.title}</h3>
                  <p className="mt-2 leading-relaxed text-dearly-text-secondary">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {o.comparison && (
        <section className="bg-dearly-card/50 px-6 py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center font-display text-3xl font-bold md:text-4xl">Dearly vs. Traditional invitations</h2>
            <div className="mt-10 overflow-hidden rounded-2xl border border-dearly-border bg-dearly-card shadow-card">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-dearly-border bg-dearly-cream/60">
                      <th className="px-5 py-4 font-bold text-dearly-accent" scope="col">Dearly</th>
                      <th className="px-5 py-4 font-semibold text-dearly-text-secondary" scope="col">Traditional (printed)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {o.comparison.map((row, i) => (
                      <tr key={i} className="border-b border-dearly-border/60 last:border-0">
                        <td className="px-5 py-4 font-semibold">
                          <Check size={16} className="mr-2 inline-block text-emerald-600" aria-hidden />{row.dearly}
                        </td>
                        <td className="px-5 py-4 text-dearly-text-secondary">{row.traditional}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}

      {o.relatedGuides && o.relatedGuides.length > 0 && (
        <section className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="font-display text-2xl font-bold">Guides to get you started</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {o.relatedGuides.map((slug) => {
              const guide = GUIDES.find((g) => g.slug === slug);
              if (!guide) return null;
              return (
                <Link
                  key={slug}
                  href={`/help/${slug}`}
                  className="group rounded-2xl border border-dearly-border bg-dearly-card p-5 transition hover:-translate-y-0.5 hover:border-dearly-accent/40 hover:shadow-card"
                >
                  <h3 className="font-semibold group-hover:text-dearly-accent">{guide.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-dearly-text-secondary">{guide.summary}</p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="border-y border-dearly-border/60 px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 font-display text-xl font-bold">Other invitation types</h2>
          <div className="flex flex-wrap gap-2">
            {OCCASIONS.filter((x) => x.slug !== o.slug).map((x) => (
              <Link
                key={x.slug}
                href={`/invitations/${x.slug}`}
                className="rounded-full border border-dearly-border bg-dearly-card px-4 py-2 text-sm text-dearly-text-secondary transition hover:border-dearly-accent/50 hover:text-dearly-accent"
              >
                {x.navLabel}
              </Link>
            ))}
          </div>
        </div>
      </section>

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

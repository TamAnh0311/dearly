/**
 * A single help guide — rendered from the static data in `src/lib/guides.ts`.
 * Every guide is pre-rendered at build time and cross-linked to related ones.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, Lightbulb } from "lucide-react";
import { GUIDES, GUIDE_CATEGORIES, getGuide, relatedGuides } from "@/lib/guides";
import { absoluteUrl } from "@/lib/seo";

interface GuidePageProps {
  params: { slug: string };
}

/** Pre-renders every guide at build time. */
export function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }));
}

/** Per-guide SEO metadata. */
export function generateMetadata({ params }: GuidePageProps): Metadata {
  const guide = getGuide(params.slug);
  if (!guide) return { title: "Guide not found", robots: { index: false, follow: false } };
  return {
    title: `${guide.title} — Help`,
    description: guide.summary,
    alternates: { canonical: absoluteUrl(`/help/${guide.slug}`) },
    openGraph: {
      title: guide.title,
      description: guide.summary,
      url: absoluteUrl(`/help/${guide.slug}`),
      type: "article",
    },
    twitter: { card: "summary", title: guide.title, description: guide.summary },
  };
}

/** Renders one article with its table of contents, FAQ and related guides. */
export default function GuidePage({ params }: GuidePageProps) {
  const guide = getGuide(params.slug);
  if (!guide) notFound();

  const category = GUIDE_CATEGORIES.find((c) => c.id === guide.category);
  const related = relatedGuides(guide, 3);
  const url = absoluteUrl(`/help/${guide.slug}`);
  const lastReviewed = "2026-11-04";
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: guide.title,
        description: guide.summary,
        url,
        mainEntityOfPage: url,
        datePublished: lastReviewed,
        dateModified: lastReviewed,
        author: { "@type": "Organization", name: "Dearly", url: absoluteUrl("/") },
        publisher: {
          "@type": "Organization",
          name: "Dearly",
          url: absoluteUrl("/"),
          logo: { "@type": "ImageObject", url: absoluteUrl("/logo.svg"), width: 512, height: 512 },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Dearly", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Help", item: absoluteUrl("/help") },
          { "@type": "ListItem", position: 3, name: guide.title, item: url },
        ],
      },
      ...(guide.faq?.length
        ? [
            {
              "@type": "FAQPage",
              mainEntity: guide.faq.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <article className="px-5 pb-20 pt-10 md:px-8 md:pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Breadcrumb" className="mx-auto max-w-4xl text-xs text-dearly-text-muted">
        <Link href="/help" className="inline-flex items-center gap-1.5 hover:text-dearly-accent">
          <ArrowLeft size={13} aria-hidden /> All guides
        </Link>
        <span className="mx-2" aria-hidden>/</span>
        <span>{category?.label}</span>
      </nav>

      <header className="mx-auto mt-6 max-w-4xl">
        <span className="rounded-full bg-dearly-accent-soft px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-dearly-accent">
          {category?.label}
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold leading-tight md:text-5xl">{guide.title}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-dearly-text-secondary">{guide.summary}</p>
        <p className="mt-4 flex items-center gap-1.5 text-xs text-dearly-text-muted">
          <Clock size={13} aria-hidden /> {guide.minutes} min read
        </p>
      </header>

      <div className="mx-auto mt-12 grid max-w-4xl gap-10 md:grid-cols-[1fr_200px]">
        <div className="min-w-0 space-y-10">
          {guide.sections.map((section, index) => (
            <section key={section.heading} id={`section-${index + 1}`} className="scroll-mt-28">
              <h2 className="font-display text-xl font-bold text-dearly-text md:text-2xl">{section.heading}</h2>
              {section.body?.map((paragraph) => (
                <p key={paragraph} className="mt-3 text-[15px] leading-[1.8] text-dearly-text-secondary">
                  {paragraph}
                </p>
              ))}
              {section.steps && (
                <ol className="mt-4 space-y-2.5">
                  {section.steps.map((step, i) => (
                    <li key={step} className="flex gap-3 text-[15px] leading-relaxed text-dearly-text-secondary">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-dearly-accent-soft text-[11px] font-bold text-dearly-accent">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              )}
              {section.note && (
                <p className="mt-4 flex gap-2.5 rounded-xl border border-dearly-gold/30 bg-dearly-gold-soft/60 px-4 py-3 text-sm leading-relaxed text-dearly-text-secondary">
                  <Lightbulb size={16} className="mt-0.5 shrink-0 text-dearly-gold" aria-hidden />
                  <span>{section.note}</span>
                </p>
              )}
            </section>
          ))}

          {guide.faq?.length ? (
            <section id="faq" className="scroll-mt-28">
              <h2 className="font-display text-xl font-bold text-dearly-text md:text-2xl">Frequently asked questions</h2>
              <div className="mt-4 divide-y divide-dearly-border rounded-2xl border border-dearly-border bg-dearly-card">
                {guide.faq.map((entry) => (
                  <details key={entry.question} className="group px-5 py-4">
                    <summary className="cursor-pointer list-none text-sm font-semibold text-dearly-text marker:hidden">
                      {entry.question}
                    </summary>
                    <p className="mt-2 text-sm leading-relaxed text-dearly-text-secondary">{entry.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="hidden md:block">
          <div className="sticky top-24 space-y-4 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-dearly-text-muted">On this page</p>
            <nav aria-label="On this page" className="flex flex-col gap-2 border-l border-dearly-border pl-3">
              {guide.sections.map((section, index) => (
                <a key={section.heading} href={`#section-${index + 1}`} className="text-dearly-text-secondary transition hover:text-dearly-accent">
                  {section.heading}
                </a>
              ))}
              {guide.faq?.length ? (
                <a href="#faq" className="text-dearly-text-secondary transition hover:text-dearly-accent">
                  Frequently asked questions
                </a>
              ) : null}
            </nav>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mx-auto mt-16 max-w-4xl border-t border-dearly-border pt-10">
          <h2 className="font-display text-xl font-bold text-dearly-text">Keep reading</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/help/${item.slug}`}
                className="group flex flex-col rounded-2xl border border-dearly-border bg-dearly-card p-4 transition hover:-translate-y-0.5 hover:border-dearly-accent/40 hover:shadow-card"
              >
                <h3 className="font-semibold text-dearly-text group-hover:text-dearly-accent">{item.title}</h3>
                <p className="mt-1.5 flex-1 text-xs leading-relaxed text-dearly-text-secondary">{item.summary}</p>
                <span className="mt-3 flex items-center gap-1 text-xs font-semibold text-dearly-accent">
                  Read <ArrowRight size={12} className="transition group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mx-auto mt-14 flex max-w-4xl flex-wrap items-center justify-between gap-4 rounded-2xl border border-dearly-border bg-dearly-card px-6 py-5">
        <div>
          <p className="font-display text-lg font-bold">Still deciding?</p>
          <p className="mt-1 text-sm text-dearly-text-secondary">Browse the designs or start a free invitation.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/help" className="rounded-lg border border-dearly-border px-4 py-2 text-sm font-semibold text-dearly-text-secondary transition hover:border-dearly-accent/40">
            All guides
          </Link>
          <Link href="/signup" className="rounded-lg bg-dearly-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90">
            Start free
          </Link>
        </div>
      </div>
    </article>
  );
}

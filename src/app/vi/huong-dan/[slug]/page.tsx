/**
 * Vietnamese guide detail page — /vi/huong-dan/[slug]
 *
 * Renders a single Vietnamese guide article with JSON-LD structured data
 * (Article, BreadcrumbList, FAQPage) and cross-links to its English
 * counterpart on /help/[enSlug] via hreflang.
 *
 * All routes are pre-rendered at build time via generateStaticParams.
 * Server Component only — no "use client".
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { VI_GUIDES, getViGuide } from "@/lib/guides-vi";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

interface GuidePageProps {
  params: { slug: string };
}

// ─── Static generation ─────────────────────────────────────────────────────────

/** Pre-renders every Vietnamese guide at build time. */
export function generateStaticParams() {
  return VI_GUIDES.map((guide) => ({ slug: guide.slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

/** Per-guide SEO metadata with hreflang to English counterpart. */
export function generateMetadata({ params }: GuidePageProps): Metadata {
  const guide = getViGuide(params.slug);
  if (!guide) {
    return { title: "Không tìm thấy", robots: { index: false, follow: false } };
  }

  return {
    title: `${guide.title} — Hướng Dẫn | ${SITE_NAME}`,
    description: guide.summary,
    keywords: guide.keywords,
    alternates: {
      canonical: absoluteUrl(`/vi/huong-dan/${guide.slug}`),
      languages: {
        en: absoluteUrl(`/help/${guide.enSlug}`),
        "x-default": absoluteUrl(`/help/${guide.enSlug}`),
      },
    },
    openGraph: {
      type: "article",
      locale: "vi_VN",
      url: absoluteUrl(`/vi/huong-dan/${guide.slug}`),
      siteName: SITE_NAME,
      title: guide.title,
      description: guide.summary,
    },
    twitter: {
      card: "summary",
      title: guide.title,
      description: guide.summary,
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

/** Renders one Vietnamese guide article. */
export default function ViGuidePage({ params }: GuidePageProps) {
  const guide = getViGuide(params.slug);
  if (!guide) notFound();

  const url = absoluteUrl(`/vi/huong-dan/${guide.slug}`);
  const datePublished = "2026-11-09";

  // ── JSON-LD ──
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: guide.title,
        description: guide.summary,
        url,
        mainEntityOfPage: url,
        datePublished,
        dateModified: datePublished,
        inLanguage: "vi",
        author: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          url: absoluteUrl("/"),
          logo: {
            "@type": "ImageObject",
            url: absoluteUrl("/logo.svg"),
            width: 512,
            height: 512,
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Trang chủ", item: absoluteUrl("/vi") },
          { "@type": "ListItem", position: 2, name: "Hướng dẫn", item: absoluteUrl("/vi/huong-dan") },
          { "@type": "ListItem", position: 3, name: guide.title, item: url },
        ],
      },
      ...(guide.faq.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: guide.faq.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <article className="px-5 pb-20 pt-10 md:px-8 md:pt-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-4xl">
        {/* ── Breadcrumbs ── */}
        <Breadcrumbs
          items={[
            { label: "Trang chủ", href: "/vi" },
            { label: "Hướng dẫn", href: "/vi/huong-dan" },
            { label: guide.title },
          ]}
        />

        {/* ── Header ── */}
        <header className="mt-2">
          <h1 className="font-display text-3xl font-bold leading-tight md:text-5xl">
            {guide.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-dearly-text-secondary">
            {guide.summary}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-dearly-text-muted">
            <span className="flex items-center gap-1.5">
              <Clock size={13} aria-hidden />
              {guide.minutes} phút đọc
            </span>
            <Link
              href={`/help/${guide.enSlug}`}
              className="font-medium text-dearly-accent hover:underline"
            >
              Read in English
            </Link>
          </div>
        </header>

        {/* ── Sections ── */}
        <div className="mt-12 space-y-10">
          {guide.sections.map((section, index) => (
            <section
              key={section.heading}
              id={`section-${index + 1}`}
              className="scroll-mt-28"
            >
              <h2 className="font-display text-xl font-bold text-dearly-text md:text-2xl">
                {section.heading}
              </h2>
              <p className="mt-3 text-[15px] leading-[1.8] text-dearly-text-secondary">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        {/* ── FAQ ── */}
        {guide.faq.length > 0 && (
          <section id="faq" className="mt-12 scroll-mt-28">
            <h2 className="font-display text-xl font-bold text-dearly-text md:text-2xl">
              Câu hỏi thường gặp
            </h2>
            <div className="mt-4 divide-y divide-dearly-border rounded-2xl border border-dearly-border bg-dearly-card">
              {guide.faq.map((entry) => (
                <details key={entry.q} className="group px-5 py-4">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-dearly-text marker:hidden">
                    {entry.q}
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-dearly-text-secondary">
                    {entry.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* ── CTA ── */}
        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-dearly-border bg-dearly-card px-6 py-5">
          <div>
            <p className="font-display text-lg font-bold">Sẵn sàng thử chưa?</p>
            <p className="mt-1 text-sm text-dearly-text-secondary">
              Tạo thiệp mời miễn phí và chia sẻ khi bạn hài lòng.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/vi/huong-dan"
              className="inline-flex items-center gap-1.5 rounded-lg border border-dearly-border px-4 py-2 text-sm font-semibold text-dearly-text-secondary transition hover:border-dearly-accent/40"
            >
              <ArrowLeft size={14} aria-hidden />
              Tất cả hướng dẫn
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-dearly-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Tạo thiệp ngay
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

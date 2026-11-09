/**
 * Vietnamese party invitation landing page — /vi/invitations/party
 *
 * SEO-optimised Server Component targeting Vietnamese queries for
 * online party and event invitations with RSVP.
 */

import type { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles,
  Users,
  Send,
  Image,
  Check,
  ChevronRight,
} from "lucide-react";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";
import { VI_NAV } from "@/lib/seo-vi";
import { getViOccasion } from "@/lib/occasions-vi";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export const revalidate = 3600;

// ─── Data ─────────────────────────────────────────────────────────────────────

const occasion = getViOccasion("party")!;

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: occasion.title,
  description: occasion.description,
  keywords: occasion.keywords,
  alternates: {
    canonical: absoluteUrl("/vi/invitations/party"),
    languages: {
      en: absoluteUrl("/invitations/party"),
      "x-default": absoluteUrl("/invitations/party"),
    },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: absoluteUrl("/vi/invitations/party"),
    siteName: SITE_NAME,
    title: occasion.title,
    description: occasion.description,
  },
  twitter: {
    card: "summary_large_image",
    title: occasion.title,
    description: occasion.description,
  },
};

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLdFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: occasion.faq.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Trang chủ", item: absoluteUrl("/vi") },
    { "@type": "ListItem", position: 2, name: "Thiệp mời", item: absoluteUrl("/vi/invitations/party") },
    { "@type": "ListItem", position: 3, name: occasion.h1, item: absoluteUrl("/vi/invitations/party") },
  ],
};

// ─── Feature icons ─────────────────────────────────────────────────────────────

const FEATURE_ICONS = [Sparkles, Users, Send, Image];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ViPartyPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-dearly-cream text-dearly-text">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFAQ) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 border-b border-dearly-border/50 bg-dearly-cream/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/vi" className="font-display text-2xl font-bold text-dearly-accent">
            Dearly
          </Link>
          <div className="hidden items-center gap-6 text-sm font-medium text-dearly-text-secondary md:flex">
            <Link href="/vi/mau-thiet-ke" className="hover:text-dearly-text">
              {VI_NAV.templates}
            </Link>
            <Link href="/vi/cach-su-dung" className="hover:text-dearly-text">
              {VI_NAV.howItWorks}
            </Link>
            <Link href="/vi/invitations/party" className="font-semibold text-dearly-accent">
              {VI_NAV.party}
            </Link>
            <Link href="/invitations/party" className="hover:text-dearly-text">
              English
            </Link>
          </div>
          <Link
            href="/signup"
            className="rounded-lg bg-dearly-accent px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:opacity-90"
          >
            {VI_NAV.createNow}
          </Link>
        </div>
      </nav>

      {/* ── Breadcrumbs ── */}
      <div className="mx-auto max-w-7xl px-6 pt-6">
        <Breadcrumbs
          items={[
            { label: "Trang chủ", href: "/vi" },
            { label: "Thiệp mời", href: "/vi/invitations/party" },
            { label: occasion.h1 },
          ]}
        />
      </div>

      {/* ── Hero ── */}
      <header className="relative px-6 pb-20 pt-10 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,rgb(var(--dearly-rose-soft))_0%,transparent_70%)]"
        />
        <div className="relative mx-auto max-w-4xl">
          <p className="inline-flex items-center gap-2 rounded-full bg-dearly-accent-soft px-3 py-1 text-xs font-semibold text-dearly-accent">
            <Sparkles size={13} /> Thiệp mời tiệc · RSVP · Quản lý khách
          </p>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.08] md:text-7xl">
            {occasion.h1}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-dearly-text-secondary">
            {occasion.intro}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-xl bg-dearly-accent px-7 py-4 text-base font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              Tạo thiệp ngay — Miễn phí
            </Link>
            <Link
              href="/vi/mau-thiet-ke"
              className="flex items-center gap-2 rounded-xl border border-dearly-border bg-dearly-card/70 px-6 py-4 text-base font-semibold transition hover:-translate-y-0.5"
            >
              {VI_NAV.browseTemplates} <ChevronRight size={16} />
            </Link>
          </div>
          <p className="mt-6 text-sm text-dearly-text-muted">
            Miễn phí hoàn toàn · Không cần thẻ tín dụng · Tạo xong trong 5 phút
          </p>
        </div>
      </header>

      {/* ── Features grid ── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-dearly-accent">
              Tính năng
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
              Tổ chức tiệc chuyên nghiệp, dễ dàng hơn bao giờ hết
            </h2>
            <p className="mt-4 text-dearly-text-secondary">
              Từ tiệc tân gia đến tiệc công ty — Dearly giúp bạn tạo thiệp mời đẹp và quản lý khách trong một link.
            </p>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {occasion.features.map((feature, i) => {
              const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-dearly-border bg-dearly-card p-6 shadow-card"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-dearly-accent-soft text-dearly-accent">
                    <Icon size={20} />
                  </span>
                  <h3 className="mt-5 text-lg font-bold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-dearly-text-secondary">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Use cases ── */}
      <section className="bg-dearly-card/50 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-dearly-accent">
              Dùng cho nhiều dịp
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
              Phù hợp với mọi loại tiệc và sự kiện
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Tiệc tân gia",
                body: "Chuyển nhà là dịp để mời bạn bè và gia đình đến thăm không gian mới. Thiệp điện tử với ảnh ngôi nhà, địa chỉ bản đồ và danh sách đồ cần mang — gửi qua Zalo trong vài giây.",
              },
              {
                title: "Họp lớp & hội đồng hương",
                body: "Tổ chức buổi gặp mặt sau nhiều năm? Dearly giúp bạn thu thập RSVP từ cả trăm người cùng lúc, biết ai sẽ đến và quản lý chi phí chia đều dễ dàng.",
              },
              {
                title: "Tiệc công ty & team building",
                body: "Từ liên hoan cuối năm đến buổi kỷ niệm thành lập công ty — thiệp điện tử chuyên nghiệp giúp nhân viên có đủ thông tin và xác nhận tham dự nhanh chóng.",
              },
              {
                title: "Tiệc thôi nôi & đầy tháng",
                body: "Chia sẻ niềm vui chào đón bé mới với gia đình và bạn bè. Thêm ảnh bé yêu, lịch trình và địa điểm — thiệp đầy tháng đẹp nhất chỉ cần vài phút.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-dearly-border bg-dearly-card p-6 shadow-card"
              >
                <h3 className="font-bold text-dearly-accent">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-dearly-text-secondary">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How-to steps ── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-dearly-accent">
              Đơn giản chỉ 3 bước
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
              Tạo thiệp mời tiệc trong vài phút
            </h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {occasion.howTo.map((step, i) => (
              <div
                key={step.title}
                className="relative rounded-2xl border border-dearly-border bg-dearly-card p-7 shadow-card"
              >
                <span className="absolute right-6 top-5 font-display text-5xl font-bold text-dearly-accent/15">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-dearly-text-secondary">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/signup"
              className="rounded-xl bg-dearly-accent px-7 py-4 text-base font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              Tạo thiệp ngay — Miễn phí
            </Link>
          </div>
        </div>
      </section>

      {/* ── Comparison table ── */}
      <section className="bg-dearly-card/50 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-dearly-accent">
              So sánh
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
              Dearly so với cách mời tiệc truyền thống
            </h2>
          </div>
          <div className="mt-10 overflow-hidden rounded-2xl border border-dearly-border bg-dearly-card shadow-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dearly-border">
                  <th className="px-6 py-4 text-left font-semibold text-dearly-accent">Dearly</th>
                  <th className="px-6 py-4 text-left font-semibold text-dearly-text-muted">Truyền thống</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dearly-border">
                {occasion.comparison.map((row, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <span className="flex items-start gap-2">
                        <Check size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                        {row.dearly}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-dearly-text-muted">{row.traditional}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-dearly-accent">
              Hỏi đáp
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
              Câu hỏi thường gặp
            </h2>
          </div>
          <div className="mt-10 space-y-3">
            {occasion.faq.map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-dearly-border bg-dearly-card p-5 open:shadow-card"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  {item.q}
                  <span className="text-dearly-accent transition group-open:rotate-45" aria-hidden>
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-dearly-text-secondary">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Related guides ── */}
      <section className="bg-dearly-card/50 px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 font-display text-2xl font-bold">Hướng dẫn liên quan</h2>
          <div className="flex flex-wrap gap-3">
            {occasion.relatedGuides.map((guide) => (
              <Link
                key={guide}
                href={`/vi/huong-dan/${guide}`}
                className="flex items-center gap-2 rounded-xl border border-dearly-border bg-dearly-card px-5 py-3 text-sm font-medium transition hover:border-dearly-accent/50 hover:text-dearly-accent"
              >
                {guide.replace(/-/g, " ")} <ChevronRight size={14} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Related occasions ── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 font-display text-2xl font-bold">Các loại thiệp mời khác</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/vi/invitations/wedding"
              className="rounded-2xl border border-dearly-border bg-dearly-card p-5 transition hover:border-dearly-accent/50 hover:shadow-card"
            >
              <h3 className="font-bold text-dearly-accent">{VI_NAV.wedding}</h3>
              <p className="mt-1 text-sm text-dearly-text-secondary">
                Tạo thiệp cưới đẹp với RSVP, lời chúc và album ảnh
              </p>
            </Link>
            <Link
              href="/vi/invitations/birthday"
              className="rounded-2xl border border-dearly-border bg-dearly-card p-5 transition hover:border-dearly-accent/50 hover:shadow-card"
            >
              <h3 className="font-bold text-dearly-accent">{VI_NAV.birthday}</h3>
              <p className="mt-1 text-sm text-dearly-text-secondary">
                Tạo thiệp sinh nhật đẹp cho mọi lứa tuổi
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA + language switcher ── */}
      <section className="relative overflow-hidden px-6 py-24 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_50%,rgb(var(--dearly-rose-soft))_0%,transparent_70%)]"
        />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-display text-4xl font-bold md:text-5xl">
            Mỗi buổi tiệc bắt đầu từ thiệp mời đẹp.
          </h2>
          <p className="mt-5 text-lg text-dearly-text-secondary">
            Tạo thiệp mời tiệc chuyên nghiệp miễn phí và gửi ngay cho khách.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-xl bg-dearly-accent px-8 py-4 text-base font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              Tạo thiệp ngay — Miễn phí
            </Link>
            <Link
              href="/invitations/party"
              className="rounded-xl border border-dearly-border bg-dearly-card/70 px-8 py-4 text-base font-semibold transition hover:-translate-y-0.5"
            >
              🌐 View in English
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-dearly-border bg-dearly-card/40 px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <span className="font-display text-xl font-bold text-dearly-accent">Dearly</span>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-dearly-text-muted">
              <Link href="/vi" className="hover:text-dearly-text-secondary">{VI_NAV.home}</Link>
              <Link href="/vi/invitations/wedding" className="hover:text-dearly-text-secondary">{VI_NAV.wedding}</Link>
              <Link href="/vi/invitations/birthday" className="hover:text-dearly-text-secondary">{VI_NAV.birthday}</Link>
              <Link href="/vi/invitations/party" className="font-semibold text-dearly-accent">{VI_NAV.party}</Link>
              <Link href="/vi/mau-thiet-ke" className="hover:text-dearly-text-secondary">{VI_NAV.templates}</Link>
              <Link href="/invitations/party" className="font-medium text-dearly-accent hover:underline">🌐 English</Link>
            </div>
            <p className="text-sm text-dearly-text-muted">&copy; {new Date().getFullYear()} Dearly</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

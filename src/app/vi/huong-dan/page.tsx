/**
 * Vietnamese help hub — /vi/huong-dan
 *
 * Lists all Vietnamese guides with cards linking to each article.
 * Cross-links to the English /help hub via hreflang.
 *
 * Server Component — required for Next.js metadata export.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Clock, Heart } from "lucide-react";
import { VI_GUIDES } from "@/lib/guides-vi";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: `Hướng Dẫn Sử Dụng Dearly — ${VI_GUIDES.length} Bài Hướng Dẫn | ${SITE_NAME}`,
  description:
    "Hướng dẫn từng bước để tạo thiệp mời, quản lý danh sách khách, tùy chỉnh thiết kế, thêm nhạc nền và chia sẻ thiệp trên Dearly.",
  alternates: {
    canonical: absoluteUrl("/vi/huong-dan"),
    languages: {
      en: absoluteUrl("/help"),
      "x-default": absoluteUrl("/help"),
    },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: absoluteUrl("/vi/huong-dan"),
    siteName: SITE_NAME,
    title: `Hướng Dẫn Sử Dụng Dearly | ${SITE_NAME}`,
    description:
      "Hướng dẫn từng bước để tạo thiệp mời, quản lý danh sách khách, tùy chỉnh thiết kế và chia sẻ thiệp trên Dearly.",
  },
  twitter: {
    card: "summary",
    title: `Hướng Dẫn Sử Dụng Dearly | ${SITE_NAME}`,
    description:
      "Hướng dẫn từng bước để tạo thiệp mời, quản lý danh sách khách, tùy chỉnh thiết kế và chia sẻ thiệp trên Dearly.",
  },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HuongDanPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-5 pb-16 pt-20 text-center md:px-8 md:pt-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_55%_at_50%_0%,rgb(var(--dearly-rose-soft))_0%,transparent_70%),radial-gradient(ellipse_40%_40%_at_85%_30%,rgb(var(--dearly-gold-soft))_0%,transparent_70%)]"
        />
        <div className="relative mx-auto max-w-3xl">
          <Breadcrumbs
            items={[
              { label: "Trang chủ", href: "/vi" },
              { label: "Hướng dẫn" },
            ]}
          />

          <p className="inline-flex items-center gap-2 rounded-full bg-dearly-accent-soft px-3 py-1 text-xs font-semibold text-dearly-accent">
            <BookOpen size={13} aria-hidden /> {VI_GUIDES.length} bài hướng dẫn
          </p>

          <h1 className="mt-6 font-display text-4xl font-bold leading-tight md:text-6xl">
            Hướng Dẫn Sử Dụng
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-dearly-text-secondary">
            Hướng dẫn ngắn gọn, thực tế để tạo thiệp mời, quản lý khách và lưu giữ kỷ niệm sau sự kiện.
          </p>

          <p className="mt-4 text-sm text-dearly-text-muted">
            Xem phiên bản tiếng Anh:{" "}
            <Link href="/help" className="font-medium text-dearly-accent hover:underline">
              Help &amp; Guides
            </Link>
          </p>
        </div>
      </section>

      {/* ── Guide grid ── */}
      <section className="px-5 pb-20 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {VI_GUIDES.map((guide) => (
              <Link
                key={guide.slug}
                href={`/vi/huong-dan/${guide.slug}`}
                className="group flex flex-col rounded-2xl border border-dearly-border bg-dearly-card p-6 transition hover:-translate-y-0.5 hover:border-dearly-accent/40 hover:shadow-card"
              >
                <h2 className="font-display text-lg font-bold leading-snug group-hover:text-dearly-accent">
                  {guide.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-dearly-text-secondary">
                  {guide.summary}
                </p>
                <p className="mt-4 flex items-center gap-1.5 text-xs text-dearly-text-muted">
                  <Clock size={12} aria-hidden />
                  {guide.minutes} phút đọc
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-5 py-16 text-center md:px-8">
        <div className="mx-auto max-w-xl">
          <Heart size={24} className="mx-auto fill-dearly-rose text-dearly-rose" aria-hidden />
          <h2 className="mt-4 font-display text-2xl font-bold">Sẵn sàng tạo thiệp chưa?</h2>
          <p className="mt-2 text-sm text-dearly-text-secondary">
            Tạo thiệp mời miễn phí, xem trước mọi mẫu thiết kế và gửi khi bạn hài lòng.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/signup"
              className="rounded-xl bg-dearly-accent px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:opacity-90"
            >
              Tạo thiệp ngay — Miễn phí
            </Link>
            <Link
              href="/vi/mau-thiet-ke"
              className="rounded-xl border border-dearly-border bg-dearly-card px-6 py-3 text-sm font-semibold transition hover:border-dearly-accent/40"
            >
              Xem mẫu thiết kế
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

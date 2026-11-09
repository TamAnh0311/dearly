/**
 * Vietnamese templates gallery page — /vi/mau-thiet-ke
 *
 * Shows all non-hidden templates from Supabase in a grid,
 * optimised for Vietnamese search queries about wedding and
 * event invitation templates.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { Heart, ChevronRight, Sparkles } from "lucide-react";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";
import { VI_NAV } from "@/lib/seo-vi";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { createServiceRoleClient } from "@/lib/supabase/server";

export const revalidate = 3600;

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: `Mẫu Thiệp Mời Đẹp — Đám Cưới, Sinh Nhật & Tiệc | ${SITE_NAME}`,
  description:
    "Duyệt bộ sưu tập mẫu thiệp mời đẹp cho đám cưới, sinh nhật, tiệc tùng và mọi dịp lễ. Hơn 20 mẫu thiết kế chuyên nghiệp, miễn phí, tùy chỉnh được theo ý bạn.",
  keywords: [
    "mẫu thiệp mời",
    "mẫu thiệp cưới",
    "mẫu thiệp sinh nhật",
    "thiệp mời đẹp",
    "thiệp cưới đẹp",
    "mẫu thiết kế thiệp mời",
    "thiệp mời miễn phí",
    "template thiệp cưới",
    "thiệp điện tử đẹp",
  ],
  alternates: {
    canonical: absoluteUrl("/vi/mau-thiet-ke"),
    languages: {
      en: absoluteUrl("/templates"),
      "x-default": absoluteUrl("/templates"),
    },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: absoluteUrl("/vi/mau-thiet-ke"),
    siteName: SITE_NAME,
    title: `Mẫu Thiệp Mời Đẹp — Đám Cưới, Sinh Nhật & Tiệc | ${SITE_NAME}`,
    description:
      "Duyệt bộ sưu tập mẫu thiệp mời đẹp cho đám cưới, sinh nhật, tiệc tùng và mọi dịp lễ. Hơn 20 mẫu thiết kế chuyên nghiệp, miễn phí, tùy chỉnh được theo ý bạn.",
  },
  twitter: {
    card: "summary_large_image",
    title: `Mẫu Thiệp Mời Đẹp — Đám Cưới, Sinh Nhật & Tiệc | ${SITE_NAME}`,
    description:
      "Duyệt bộ sưu tập mẫu thiệp mời đẹp cho đám cưới, sinh nhật, tiệc tùng và mọi dịp lễ. Hơn 20 mẫu thiết kế chuyên nghiệp, miễn phí, tùy chỉnh được theo ý bạn.",
  },
};

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

function buildJsonLd(templates: { slug: string; name: string }[]) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Trang chủ", item: absoluteUrl("/vi") },
        { "@type": "ListItem", position: 2, name: "Mẫu thiết kế", item: absoluteUrl("/vi/mau-thiet-ke") },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Mẫu Thiệp Mời Đẹp",
      description:
        "Bộ sưu tập mẫu thiệp mời đẹp cho đám cưới, sinh nhật và tiệc tùng trên Dearly.",
      url: absoluteUrl("/vi/mau-thiet-ke"),
      mainEntity: {
        "@type": "ItemList",
        itemListElement: templates.map((t, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: t.name,
          url: absoluteUrl(`/templates/${t.slug}`),
        })),
      },
    },
  ];
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ViTemplatesPage() {
  const supabase = createServiceRoleClient();
  const { data: templates } = await supabase
    .from("templates")
    .select("slug, name, preview_image")
    .eq("hidden", false)
    .order("name");

  const templateList = templates ?? [];
  const jsonLd = buildJsonLd(templateList);

  return (
    <div className="min-h-screen overflow-x-hidden bg-dearly-cream text-dearly-text">
      {/* JSON-LD */}
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 border-b border-dearly-border/50 bg-dearly-cream/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/vi" className="font-display text-2xl font-bold text-dearly-accent">
            Dearly
          </Link>
          <div className="hidden items-center gap-6 text-sm font-medium text-dearly-text-secondary md:flex">
            <Link href="/vi/mau-thiet-ke" className="font-semibold text-dearly-accent">
              {VI_NAV.templates}
            </Link>
            <Link href="/vi/cach-su-dung" className="hover:text-dearly-text">
              {VI_NAV.howItWorks}
            </Link>
            <Link href="/vi/invitations/wedding" className="hover:text-dearly-text">
              {VI_NAV.wedding}
            </Link>
            <Link href="/templates" className="hover:text-dearly-text">
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
            { label: "Mẫu thiết kế" },
          ]}
        />
      </div>

      {/* ── Hero ── */}
      <header className="relative px-6 pb-16 pt-10 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,rgb(var(--dearly-rose-soft))_0%,transparent_70%)]"
        />
        <div className="relative mx-auto max-w-4xl">
          <p className="inline-flex items-center gap-2 rounded-full bg-dearly-accent-soft px-3 py-1 text-xs font-semibold text-dearly-accent">
            <Sparkles size={13} /> {templateList.length > 0 ? `${templateList.length}+ mẫu thiết kế đẹp` : "Mẫu thiết kế đẹp"}
          </p>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.08] md:text-7xl">
            Mẫu Thiệp Mời Đẹp
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-dearly-text-secondary">
            Bộ sưu tập mẫu thiệp mời đa dạng cho đám cưới, sinh nhật, tiệc tùng và mọi
            dịp lễ đặc biệt. Mỗi mẫu được thiết kế chuyên nghiệp với hiệu ứng chuyển động
            đẹp mắt, tùy chỉnh màu sắc và font chữ theo ý bạn — hoàn toàn miễn phí.
          </p>
        </div>
      </header>

      {/* ── Filter tags ── */}
      <section className="border-b border-dearly-border px-6 py-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Tất cả mẫu", href: "/vi/mau-thiet-ke" },
              { label: "Thiệp cưới", href: "/vi/invitations/wedding" },
              { label: "Thiệp sinh nhật", href: "/vi/invitations/birthday" },
              { label: "Thiệp mời tiệc", href: "/vi/invitations/party" },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={`rounded-full border px-5 py-2.5 text-sm font-medium transition ${
                  href === "/vi/mau-thiet-ke"
                    ? "border-dearly-accent bg-dearly-accent-soft text-dearly-accent"
                    : "border-dearly-border bg-dearly-card text-dearly-text-secondary hover:border-dearly-accent/50 hover:text-dearly-accent"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Templates grid ── */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          {templateList.length > 0 ? (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {templateList.map((t) => (
                <Link
                  key={t.slug}
                  href={`/templates/${t.slug}`}
                  className="group overflow-hidden rounded-2xl border border-dearly-border bg-dearly-card shadow-card transition hover:-translate-y-1 hover:shadow-card-hover"
                >
                  {t.preview_image ? (
                    <div className="aspect-[3/4] overflow-hidden bg-dearly-card-alt">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={t.preview_image}
                        alt={`Mẫu thiệp ${t.name}`}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[3/4] items-center justify-center bg-dearly-accent-soft">
                      <Heart size={28} className="text-dearly-accent/40" />
                    </div>
                  )}
                  <div className="p-3">
                    <p className="truncate text-sm font-bold">{t.name}</p>
                    <p className="mt-0.5 text-xs text-dearly-accent">Xem mẫu</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <Heart size={40} className="mx-auto text-dearly-accent/30" />
              <p className="mt-4 text-dearly-text-secondary">
                Các mẫu thiệp đang được cập nhật. Vui lòng quay lại sau.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── About templates ── */}
      <section className="bg-dearly-card/50 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-bold">
                Mỗi mẫu thiệp là một tác phẩm độc đáo
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-dearly-text-secondary">
                Mỗi mẫu thiết kế trên Dearly được tạo ra bởi đội ngũ thiết kế chuyên nghiệp
                với tư duy rõ ràng về cảm xúc và trải nghiệm khách mời. Không phải chỉ là
                nền đẹp và chữ đẹp — mà là cả một cuộc hành trình từ khi khách nhấn vào link
                đến khi thiệp mở ra với hiệu ứng đặc biệt.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-dearly-text-secondary">
                Mỗi mẫu có nhiều bộ màu sắc khác nhau để bạn chọn mà không cần thiết kế lại
                từ đầu. Phông chữ cũng linh hoạt — riêng cho tiêu đề và riêng cho nội dung,
                giúp thiệp của bạn vừa đẹp vừa dễ đọc trên mọi kích thước màn hình.
              </p>
            </div>
            <div>
              <h2 className="font-display text-3xl font-bold">
                Tùy chỉnh theo phong cách của bạn
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-dearly-text-secondary">
                Sau khi chọn mẫu, bạn có toàn quyền tùy chỉnh nội dung, màu sắc, hình ảnh
                và nhạc nền. Thêm ảnh cá nhân, thay đổi tiêu đề, bật tắt từng phần như lịch
                trình, bản đồ, lời chào, RSVP và album ảnh — tất cả trong giao diện kéo thả
                trực quan không cần biết lập trình.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-dearly-text-secondary">
                Thay đổi nào cũng hiển thị ngay lập tức trong bản xem trước. Bạn chỉ cần
                xuất bản khi hài lòng hoàn toàn với thiết kế. Và nếu cần chỉnh sửa sau khi
                đã gửi link, bạn vẫn có thể cập nhật — link cũ của khách tự động hiển thị
                nội dung mới.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Occasion links ── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 font-display text-2xl font-bold">Mẫu thiệp theo dịp lễ</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                href: "/vi/invitations/wedding",
                title: VI_NAV.wedding,
                body: "Hơn 10 mẫu thiệp cưới sang trọng với RSVP và album ảnh",
              },
              {
                href: "/vi/invitations/birthday",
                title: VI_NAV.birthday,
                body: "Mẫu thiệp sinh nhật vui nhộn phù hợp mọi lứa tuổi",
              },
              {
                href: "/vi/invitations/party",
                title: VI_NAV.party,
                body: "Mẫu thiệp tiệc và sự kiện chuyên nghiệp, linh hoạt",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col rounded-2xl border border-dearly-border bg-dearly-card p-5 transition hover:border-dearly-accent/50 hover:shadow-card"
              >
                <h3 className="font-bold text-dearly-accent">{item.title}</h3>
                <p className="mt-1 flex-1 text-sm text-dearly-text-secondary">{item.body}</p>
                <span className="mt-3 flex items-center gap-1 text-xs font-semibold text-dearly-accent">
                  Xem thêm <ChevronRight size={14} />
                </span>
              </Link>
            ))}
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
            Tìm được mẫu ưng ý rồi? Bắt đầu ngay thôi.
          </h2>
          <p className="mt-5 text-lg text-dearly-text-secondary">
            Tạo thiệp mời đẹp trong vài phút — miễn phí hoàn toàn, không cần thẻ tín dụng.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-xl bg-dearly-accent px-8 py-4 text-base font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              Chọn mẫu và bắt đầu — Miễn phí
            </Link>
            <Link
              href="/templates"
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
              <Link href="/vi/mau-thiet-ke" className="font-semibold text-dearly-accent">{VI_NAV.templates}</Link>
              <Link href="/vi/cach-su-dung" className="hover:text-dearly-text-secondary">{VI_NAV.howItWorks}</Link>
              <Link href="/vi/invitations/wedding" className="hover:text-dearly-text-secondary">{VI_NAV.wedding}</Link>
              <Link href="/vi/invitations/birthday" className="hover:text-dearly-text-secondary">{VI_NAV.birthday}</Link>
              <Link href="/vi/invitations/party" className="hover:text-dearly-text-secondary">{VI_NAV.party}</Link>
              <Link href="/templates" className="font-medium text-dearly-accent hover:underline">🌐 English</Link>
            </div>
            <p className="text-sm text-dearly-text-muted">&copy; {new Date().getFullYear()} Dearly</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

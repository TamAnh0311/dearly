/**
 * Vietnamese how-it-works page — /vi/cach-su-dung
 *
 * Detailed 3-step guide for creating online invitations with Dearly,
 * optimised for Vietnamese search queries.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ChevronRight, Image, Send } from "lucide-react";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";
import { VI_NAV } from "@/lib/seo-vi";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export const revalidate = 3600;

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: `Cách Tạo Thiệp Mời Online — Hướng Dẫn 3 Bước | ${SITE_NAME}`,
  description:
    "Hướng dẫn tạo thiệp mời trực tuyến đẹp trên Dearly chỉ trong 3 bước: chọn mẫu thiết kế, điền thông tin sự kiện và gửi link cho khách. Miễn phí, không cần cài app.",
  alternates: {
    canonical: absoluteUrl("/vi/cach-su-dung"),
    languages: {
      en: absoluteUrl("/how-it-works"),
      "x-default": absoluteUrl("/how-it-works"),
    },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: absoluteUrl("/vi/cach-su-dung"),
    siteName: SITE_NAME,
    title: `Cách Tạo Thiệp Mời Online — Hướng Dẫn 3 Bước | ${SITE_NAME}`,
    description:
      "Hướng dẫn tạo thiệp mời trực tuyến đẹp trên Dearly chỉ trong 3 bước: chọn mẫu thiết kế, điền thông tin sự kiện và gửi link cho khách. Miễn phí, không cần cài app.",
  },
  twitter: {
    card: "summary_large_image",
    title: `Cách Tạo Thiệp Mời Online — Hướng Dẫn 3 Bước | ${SITE_NAME}`,
    description:
      "Hướng dẫn tạo thiệp mời trực tuyến đẹp trên Dearly chỉ trong 3 bước: chọn mẫu thiết kế, điền thông tin sự kiện và gửi link cho khách. Miễn phí, không cần cài app.",
  },
};

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLdHowTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Cách tạo thiệp mời online trên Dearly",
  description:
    "Hướng dẫn tạo thiệp mời trực tuyến đẹp trong 3 bước đơn giản với Dearly — chọn mẫu, điền thông tin và gửi cho khách.",
  totalTime: "PT8M",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Chọn mẫu thiết kế",
      text: "Duyệt bộ sưu tập hơn 20 mẫu thiệp mời từ cổ điển đến hiện đại. Xem trước trực tiếp trên điện thoại trước khi quyết định.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Điền thông tin sự kiện",
      text: "Nhập tên, ngày tháng, địa điểm và thêm ảnh cá nhân. Tùy chỉnh màu sắc và font chữ theo phong cách của bạn.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Gửi link cho khách",
      text: "Sao chép đường link hoặc tải mã QR. Gửi qua Zalo, Messenger, email hay bất kỳ ứng dụng nào. Khách nhấn vào là xem thiệp ngay.",
    },
  ],
};

const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Trang chủ", item: absoluteUrl("/vi") },
    { "@type": "ListItem", position: 2, name: "Cách sử dụng", item: absoluteUrl("/vi/cach-su-dung") },
  ],
};

// ─── Steps data ───────────────────────────────────────────────────────────────

const STEPS = [
  {
    number: "01",
    icon: Image,
    title: "Chọn mẫu thiết kế",
    subtitle: "Hơn 20 mẫu đẹp để lựa chọn",
    body: `
Bước đầu tiên là chọn mẫu thiệp mời phù hợp với dịp lễ và phong cách của bạn.
Dearly cung cấp hơn 20 mẫu thiết kế được tạo ra bởi đội ngũ thiết kế chuyên nghiệp,
bao gồm nhiều phong cách khác nhau từ cổ điển sang trọng, hiện đại tối giản,
Á Đông truyền thống đến sôi động trẻ trung.

Mỗi mẫu thiết kế đều có tính năng xem trước trực tiếp — bạn có thể thấy thiệp trông
như thế nào trên điện thoại ngay khi duyệt danh sách. Điều này giúp bạn chọn được
mẫu thực sự phù hợp trước khi bắt đầu điền thông tin.

Ngoài ra, mỗi mẫu đều hỗ trợ nhiều bộ màu sắc khác nhau. Nếu bạn thích mẫu này
nhưng muốn màu khác, chỉ cần chuyển sang bộ màu khác trong bước tiếp theo mà không
cần chọn lại từ đầu. Phông chữ cũng tùy chỉnh được — riêng cho tiêu đề và riêng
cho nội dung, giúp thiệp của bạn trông thật đặc biệt và khác biệt.

Mỗi mẫu thiệp cũng có nhạc nền mặc định phù hợp với dịp lễ. Nhạc tự động phát
khi khách mở thiệp, tạo nên khoảnh khắc đầu tiên đầy cảm xúc. Bạn cũng có thể
tải lên bài nhạc yêu thích của riêng mình nếu muốn.
    `.trim(),
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Điền thông tin sự kiện",
    subtitle: "Cá nhân hóa từng chi tiết",
    body: `
Sau khi chọn mẫu, bạn sẽ được dẫn vào trang chỉnh sửa thiệp. Giao diện được thiết kế
trực quan và dễ dùng — không yêu cầu bất kỳ kinh nghiệm thiết kế nào. Mọi thay đổi
đều hiển thị ngay trên bản xem trước phía bên phải màn hình.

Bạn điền các thông tin cơ bản như tên người tổ chức hoặc cặp đôi, tên sự kiện, ngày giờ
và địa điểm. Phần địa điểm hỗ trợ nhúng bản đồ Google Maps để khách dễ tìm đường.

Phần lịch trình cho phép bạn thêm nhiều mục theo thứ tự thời gian — rất hữu ích cho
đám cưới có nhiều nghi lễ, tiệc sinh nhật với nhiều hoạt động, hay sự kiện công ty
kéo dài cả ngày. Khách mời có thể xem lịch trình trực tiếp trong thiệp.

Bạn cũng có thể thêm ảnh cá nhân — ảnh cặp đôi, ảnh gia đình, hoặc ảnh chủ đề — để
thiệp trở nên riêng tư và ý nghĩa hơn. Đối với thiệp cưới, có thể thêm thông tin
chuyển khoản mừng cưới với mã QR ngân hàng để khách tiện lợi.

Toàn bộ nội dung thiệp hỗ trợ tiếng Việt hoàn toàn, kể cả dấu và ký tự đặc biệt.
    `.trim(),
  },
  {
    number: "03",
    icon: Send,
    title: "Gửi link cho khách",
    subtitle: "Chia sẻ qua bất kỳ kênh nào",
    body: `
Khi thiệp đã hoàn chỉnh, bạn xuất bản và nhận được một đường link duy nhất cho sự kiện.
Link này hoạt động trên mọi thiết bị — điện thoại Android, iPhone, máy tính bảng hay
laptop đều hiển thị đẹp như nhau, không cần cài thêm bất kỳ phần mềm nào.

Bạn có thể gửi link qua Zalo, Facebook Messenger, iMessage, SMS, email hay bất kỳ
ứng dụng nào bạn đang dùng. Đơn giản hơn, bạn có thể tải mã QR và in ra để dán trên
thiệp giấy, bảng thông báo hay màn hình sự kiện — khách chỉ cần quét là xem thiệp ngay.

Dearly còn hỗ trợ link mời cá nhân hóa. Bạn tạo link riêng cho từng khách, và khi họ
mở thiệp, tên của họ sẽ hiển thị trên thiệp. Đây là chi tiết nhỏ nhưng tạo ấn tượng
rất sâu với người nhận — cảm giác thiệp được làm riêng cho mình.

Khi khách xác nhận tham dự (RSVP), bạn nhận thông báo ngay lập tức. Bảng điều khiển
cho bạn thấy ai đã trả lời, ai chưa, bao nhiêu người sẽ đến và tổng số người tham dự.
Xuất danh sách dạng CSV để sắp xếp chỗ ngồi và chuẩn bị tiệc dễ dàng hơn.
    `.trim(),
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ViHowItWorksPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-dearly-cream text-dearly-text">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }}
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
            <Link href="/vi/cach-su-dung" className="font-semibold text-dearly-accent">
              {VI_NAV.howItWorks}
            </Link>
            <Link href="/vi/invitations/wedding" className="hover:text-dearly-text">
              {VI_NAV.wedding}
            </Link>
            <Link href="/how-it-works" className="hover:text-dearly-text">
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
            { label: "Cách sử dụng" },
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
            <Sparkles size={13} /> Hướng dẫn từng bước
          </p>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.08] md:text-7xl">
            Tạo Thiệp Mời Chỉ Trong 3 Bước
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-dearly-text-secondary">
            Không cần biết thiết kế. Không cần phần mềm phức tạp. Chỉ cần ba bước
            đơn giản để có thiệp mời chuyên nghiệp gửi cho khách trong vài phút.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-xl bg-dearly-accent px-7 py-4 text-base font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              Bắt đầu ngay
            </Link>
            <Link
              href="/vi/mau-thiet-ke"
              className="flex items-center gap-2 rounded-xl border border-dearly-border bg-dearly-card/70 px-6 py-4 text-base font-semibold transition hover:-translate-y-0.5"
            >
              {VI_NAV.browseTemplates} <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </header>

      {/* ── 3 Steps — detailed ── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl space-y-16">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="relative">
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div
                    aria-hidden
                    className="absolute left-6 top-16 h-full w-0.5 bg-dearly-border md:left-8"
                  />
                )}
                <div className="flex gap-6">
                  {/* Step number circle */}
                  <div className="relative shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-dearly-accent text-sm font-bold text-white shadow-card md:h-16 md:w-16 md:text-base">
                      {step.number}
                    </div>
                  </div>
                  {/* Content */}
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-3">
                      <Icon size={20} className="text-dearly-accent" aria-hidden />
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-dearly-accent">
                        {step.subtitle}
                      </p>
                    </div>
                    <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
                      {step.title}
                    </h2>
                    <div className="mt-5 space-y-3">
                      {step.body.split("\n\n").map((para, j) => (
                        <p key={j} className="text-sm leading-relaxed text-dearly-text-secondary">
                          {para}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/signup"
            className="rounded-xl bg-dearly-accent px-8 py-4 text-base font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
          >
            Bắt đầu ngay — Miễn phí
          </Link>
          <p className="mt-4 text-sm text-dearly-text-muted">
            Không cần thẻ tín dụng · Miễn phí trong giai đoạn trải nghiệm
          </p>
        </div>
      </section>

      {/* ── Tips & extras ── */}
      <section className="bg-dearly-card/50 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-dearly-accent">
              Mẹo hữu ích
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
              Tận dụng tối đa Dearly
            </h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {[
              {
                title: "Gửi nhắc nhở RSVP",
                body: "Sau khi gửi link, bạn có thể xem ai chưa trả lời và gửi nhắc nhở thêm. Dashboard cho bạn biết chính xác ai đã xem thiệp nhưng chưa xác nhận.",
              },
              {
                title: "Cập nhật thông tin bất cứ lúc nào",
                body: "Thông tin thay đổi vào phút chót? Không sao. Bạn chỉnh sửa thiệp và link cũ tự động hiển thị nội dung mới — không cần gửi lại link cho khách.",
              },
              {
                title: "Album ảnh sau sự kiện",
                body: "Sau khi sự kiện kết thúc, link thiệp trở thành album ảnh chung. Khách tải ảnh lên từ điện thoại — không cần app — và bạn phê duyệt từng ảnh trước khi hiển thị.",
              },
              {
                title: "Mã QR để in",
                body: "Tải mã QR của thiệp về và in lên bất kỳ đâu — thiệp giấy, banner, poster hay backdrop. Khách quét mã là xem thiệp điện tử ngay lập tức.",
              },
            ].map((tip) => (
              <div
                key={tip.title}
                className="rounded-2xl border border-dearly-border bg-dearly-card p-6 shadow-card"
              >
                <h3 className="font-bold">{tip.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-dearly-text-secondary">{tip.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Links to other pages ── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 font-display text-2xl font-bold">Khám phá thêm</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/vi/mau-thiet-ke"
              className="flex items-center justify-between rounded-2xl border border-dearly-border bg-dearly-card p-5 transition hover:border-dearly-accent/50 hover:shadow-card"
            >
              <div>
                <h3 className="font-bold text-dearly-accent">Mẫu thiết kế</h3>
                <p className="mt-1 text-sm text-dearly-text-secondary">Duyệt hơn 20 mẫu thiệp đẹp</p>
              </div>
              <ChevronRight size={20} className="text-dearly-accent" />
            </Link>
            <Link
              href="/vi/invitations/wedding"
              className="flex items-center justify-between rounded-2xl border border-dearly-border bg-dearly-card p-5 transition hover:border-dearly-accent/50 hover:shadow-card"
            >
              <div>
                <h3 className="font-bold text-dearly-accent">{VI_NAV.wedding}</h3>
                <p className="mt-1 text-sm text-dearly-text-secondary">Tạo thiệp cưới điện tử đẹp</p>
              </div>
              <ChevronRight size={20} className="text-dearly-accent" />
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
            Sẵn sàng tạo thiệp mời đẹp nhất?
          </h2>
          <p className="mt-5 text-lg text-dearly-text-secondary">
            Chỉ 3 bước, chưa đến 10 phút — thiệp mời chuyên nghiệp gửi ngay cho khách.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-xl bg-dearly-accent px-8 py-4 text-base font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              Bắt đầu ngay — Miễn phí
            </Link>
            <Link
              href="/how-it-works"
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
              <Link href="/vi/mau-thiet-ke" className="hover:text-dearly-text-secondary">{VI_NAV.templates}</Link>
              <Link href="/vi/cach-su-dung" className="font-semibold text-dearly-accent">{VI_NAV.howItWorks}</Link>
              <Link href="/vi/invitations/wedding" className="hover:text-dearly-text-secondary">{VI_NAV.wedding}</Link>
              <Link href="/vi/invitations/birthday" className="hover:text-dearly-text-secondary">{VI_NAV.birthday}</Link>
              <Link href="/vi/invitations/party" className="hover:text-dearly-text-secondary">{VI_NAV.party}</Link>
              <Link href="/how-it-works" className="font-medium text-dearly-accent hover:underline">🌐 English</Link>
            </div>
            <p className="text-sm text-dearly-text-muted">&copy; {new Date().getFullYear()} Dearly</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

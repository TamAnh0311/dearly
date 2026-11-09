/**
 * Vietnamese homepage — /vi
 *
 * Full landing page in Vietnamese targeting Vietnamese search queries
 * for wedding, birthday and party invitations.
 *
 * Server Component (no "use client") — required for Next.js metadata export.
 */

import type { Metadata } from "next";
import Link from "next/link";
import {
  Heart,
  Users,
  Send,
  MessageSquare,
  Image,
  Music,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";
import { VI_SITE_DESCRIPTION, VI_SITE_KEYWORDS, VI_NAV } from "@/lib/seo-vi";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: `Tạo Thiệp Mời Online Đẹp Miễn Phí — RSVP & Album Ảnh | ${SITE_NAME}`,
  description: VI_SITE_DESCRIPTION,
  keywords: VI_SITE_KEYWORDS,
  alternates: {
    canonical: absoluteUrl("/vi"),
    languages: {
      en: absoluteUrl("/"),
      "x-default": absoluteUrl("/"),
    },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: absoluteUrl("/vi"),
    siteName: SITE_NAME,
    title: `Tạo Thiệp Mời Online Đẹp Miễn Phí — RSVP & Album Ảnh | ${SITE_NAME}`,
    description: VI_SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `Tạo Thiệp Mời Online Đẹp Miễn Phí — RSVP & Album Ảnh | ${SITE_NAME}`,
    description: VI_SITE_DESCRIPTION,
  },
};

// ─── JSON-LD data ──────────────────────────────────────────────────────────────

const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: absoluteUrl("/vi"),
  description:
    "Tạo thiệp mời trực tuyến đẹp miễn phí cho đám cưới, sinh nhật và sự kiện — với RSVP, link cá nhân và album ảnh chung.",
};

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: absoluteUrl("/"),
  description:
    "Dearly là nền tảng tạo thiệp mời trực tuyến giúp bạn gửi lời mời đẹp, thu thập RSVP và quản lý khách mời cho mọi dịp lễ.",
};

const VI_FAQS = [
  {
    q: "Dearly là gì?",
    a: "Dearly là nền tảng tạo thiệp mời trực tuyến dành cho đám cưới, sinh nhật, tiệc và các sự kiện đặc biệt. Mỗi sự kiện có thiệp mời riêng, trang RSVP, danh sách khách, lịch trình và album ảnh — tất cả trong một đường link duy nhất.",
  },
  {
    q: "Thiệp mời online có miễn phí không?",
    a: "Có. Dearly hoàn toàn miễn phí trong giai đoạn trải nghiệm sớm. Tất cả mẫu thiết kế và tính năng đều được mở khóa, không giới hạn thời gian dùng thử và không cần nhập thẻ tín dụng.",
  },
  {
    q: "Cách tạo thiệp cưới trực tuyến như thế nào?",
    a: "Bạn chỉ cần ba bước: chọn mẫu thiết kế ưa thích, điền thông tin cặp đôi và ngày cưới, rồi sao chép đường link để gửi cho khách. Toàn bộ quá trình mất chưa đến mười phút.",
  },
  {
    q: "Khách mời có cần tải ứng dụng không?",
    a: "Không. Khách mời chỉ cần nhấn vào đường link trên điện thoại hoặc máy tính là xem được thiệp ngay lập tức — không cần tải app, không cần đăng ký tài khoản.",
  },
  {
    q: "Dearly có hỗ trợ tiếng Việt không?",
    a: "Có. Dearly hỗ trợ đầy đủ tiếng Việt bao gồm phông chữ, bố cục và nội dung phù hợp với văn hóa Việt Nam. Toàn bộ giao diện tạo thiệp có thể dùng bằng tiếng Việt.",
  },
  {
    q: "Tôi có thể theo dõi ai đã RSVP không?",
    a: "Có. Mỗi lần khách xác nhận tham dự, bạn sẽ nhận được thông báo ngay. Bảng điều khiển của bạn hiển thị danh sách đầy đủ — tên, số người đi cùng và lời nhắn — và bạn có thể tải xuống dạng CSV để sắp xếp chỗ ngồi.",
  },
  {
    q: "Thiệp mời có nhạc nền không?",
    a: "Có. Mỗi mẫu thiết kế đều có nhạc nền phù hợp, tự động phát khi khách mở thiệp. Bạn cũng có thể tải lên bài nhạc yêu thích của riêng mình.",
  },
  {
    q: "Sau sự kiện, thiệp mời còn hoạt động không?",
    a: "Có. Sau sự kiện, thiệp trở thành album kỷ niệm. Phần RSVP được ẩn đi, trong khi lời chúc, ảnh và tin nhắn từ khách vẫn được lưu giữ. Khách có thể tiếp tục tải ảnh lên và bạn phê duyệt từng ảnh trước khi hiển thị.",
  },
];

const jsonLdFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: VI_FAQS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ViHomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-dearly-cream text-dearly-text">
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFAQ) }}
      />

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 border-b border-dearly-border/50 bg-dearly-cream/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/vi" className="font-display text-2xl font-bold text-dearly-accent">
            Dearly
          </Link>
          <div className="hidden items-center gap-6 text-sm font-medium text-dearly-text-secondary md:flex">
            <a href="#tinh-nang" className="hover:text-dearly-text">
              {VI_NAV.templates}
            </a>
            <a href="#cach-dung" className="hover:text-dearly-text">
              {VI_NAV.howItWorks}
            </a>
            <a href="#dip-le" className="hover:text-dearly-text">
              {VI_NAV.invitations}
            </a>
            <a href="#hoi-dap" className="hover:text-dearly-text">
              Hỏi đáp
            </a>
            <Link href="/" className="hover:text-dearly-text">
              English
            </Link>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="text-sm font-medium text-dearly-text-secondary hover:text-dearly-text"
            >
              {VI_NAV.login}
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-dearly-accent px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:opacity-90"
            >
              {VI_NAV.createNow}
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative px-6 pb-24 pt-20 md:pt-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_20%_20%,rgb(var(--dearly-rose-soft))_0%,transparent_70%),radial-gradient(ellipse_50%_50%_at_90%_10%,rgb(var(--dearly-gold-soft))_0%,transparent_70%)]"
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-dearly-accent-soft px-3 py-1 text-xs font-semibold text-dearly-accent">
            <Sparkles size={13} /> Thiệp mời · RSVP · Quản lý khách · Album ảnh
          </p>

          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.08] md:text-7xl">
            Tạo Thiệp Mời Online Đẹp —{" "}
            <span className="text-dearly-accent">Miễn Phí</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-dearly-text-secondary">
            Dành cho đám cưới, sinh nhật, tiệc tùng và mọi dịp lễ đặc biệt. Chỉ
            cần một đường link — khách mời xác nhận tham dự ngay trong thiệp,
            gửi lời chúc, chia sẻ ảnh, và bạn quản lý tất cả từ một bảng điều
            khiển duy nhất. Thiết kế xong trong vài phút, không phải vài tuần.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-xl bg-dearly-accent px-7 py-4 text-base font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              {VI_NAV.createNow}
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
      </section>

      {/* ── Stats / social proof ── */}
      <section className="border-y border-dearly-border/60 bg-dearly-card/50 px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <p className="mb-8 text-center text-sm font-semibold uppercase tracking-[0.3em] text-dearly-text-muted">
            Được tin dùng bởi hàng nghìn cặp đôi và gia đình
          </p>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { value: "10,000+", label: "Sự kiện đã tạo" },
              { value: "20+", label: "Mẫu thiết kế đẹp" },
              { value: "100%", label: "Miễn phí" },
              { value: "5 phút", label: "Thời gian tạo thiệp" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-3xl font-bold text-dearly-accent md:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-dearly-text-secondary">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features grid ── */}
      <section id="tinh-nang" className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-dearly-accent">
              Tính năng nổi bật
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
              Tất cả những gì khách cần — trong một thiệp duy nhất
            </h2>
            <p className="mt-4 text-dearly-text-secondary">
              Từ mẫu thiết kế sang trọng đến quản lý RSVP thông minh, Dearly mang
              đến trải nghiệm thiệp mời trực tuyến trọn vẹn nhất cho bạn và
              khách mời.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Sparkles,
                title: "Hơn 20 mẫu thiết kế đẹp",
                body: "Bộ sưu tập mẫu thiệp đa dạng từ cổ điển sang trọng đến hiện đại tối giản. Mỗi mẫu có màu sắc, phông chữ và hiệu ứng mở riêng biệt — không mẫu nào giống mẫu nào. Xem trực tiếp trên thiết bị di động trước khi chọn.",
              },
              {
                icon: Users,
                title: "RSVP & quản lý khách mời",
                body: "Khách xác nhận tham dự ngay bên trong thiệp — không cần điền form rời. Bạn thấy ngay số người, tên khách và lời nhắn trong bảng điều khiển theo thời gian thực. Xuất danh sách CSV để sắp xếp chỗ ngồi.",
              },
              {
                icon: Send,
                title: "Link mời cá nhân",
                body: "Mỗi khách nhận một đường link riêng được cá nhân hóa với tên của họ. Gửi qua Zalo, Facebook Messenger, email hay in mã QR — tất cả đều dẫn về cùng một thiệp. Theo dõi ai đã xem và ai chưa.",
              },
              {
                icon: MessageSquare,
                title: "Lời chúc & phản hồi trực tiếp",
                body: "Khách gửi lời chúc ngay trong thiệp và những lời chúc này hiện lên tường lời chúc của bạn. Hoa, bướm hay ngôi sao bay lên màn hình khi khách mở thiệp — tạo nên khoảnh khắc đầy cảm xúc cho cả hai bên.",
              },
              {
                icon: Image,
                title: "Album ảnh chung",
                body: "Khách tải ảnh lên trực tiếp từ điện thoại — không cần app, không cần tài khoản. Bạn xem xét và phê duyệt từng ảnh trước khi hiển thị. Album lưu giữ kỷ niệm từ trước, trong và sau sự kiện trong cùng một link.",
              },
              {
                icon: Music,
                title: "Nhạc nền & hiệu ứng",
                body: "Nhạc nền phù hợp với từng mẫu thiết kế tự động phát khi khách mở thiệp. Bạn cũng có thể tải lên bài nhạc yêu thích của mình. Hiệu ứng scratch để lộ ngày cưới, hoa rơi và phông nền động tạo nên thiệp mời đẳng cấp.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-dearly-border bg-dearly-card p-6 shadow-card"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-dearly-accent-soft text-dearly-accent">
                  <feature.icon size={20} />
                </span>
                <h3 className="mt-5 text-lg font-bold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-dearly-text-secondary">
                  {feature.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="cach-dung" className="bg-dearly-card/50 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-dearly-accent">
              Đơn giản chỉ 3 bước
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
              Tạo thiệp mời đẹp trong vài phút
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-dearly-text-secondary">
              Không cần biết thiết kế, không cần phần mềm phức tạp. Chỉ cần ba
              bước đơn giản để có thiệp mời chuyên nghiệp gửi cho khách.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Chọn mẫu",
                body: "Duyệt qua hơn 20 mẫu thiết kế đẹp từ cổ điển đến hiện đại. Xem trước hiệu ứng mở thiệp trực tiếp trên điện thoại trước khi quyết định. Mỗi mẫu có nhiều bộ màu sắc khác nhau để bạn tùy chỉnh.",
              },
              {
                step: "02",
                title: "Điền thông tin",
                body: "Nhập tên, ngày tháng, địa điểm và câu chuyện của bạn. Chọn màu sắc, phông chữ và bật tắt từng mục theo ý muốn — lịch trình, bản đồ, lời chào, RSVP và nhiều hơn nữa.",
              },
              {
                step: "03",
                title: "Gửi link mời",
                body: "Sao chép đường link hoặc tải mã QR về. Gửi qua Zalo, Messenger, email hay in ra giấy. Khách nhấn vào là xem thiệp ngay — không cần tải app. Theo dõi RSVP trong thời gian thực từ bảng điều khiển của bạn.",
              },
            ].map((step) => (
              <div
                key={step.step}
                className="relative h-full rounded-2xl border border-dearly-border bg-dearly-card p-7 shadow-card"
              >
                <span className="absolute right-6 top-5 font-display text-5xl font-bold text-dearly-accent/15">
                  {step.step}
                </span>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-dearly-text-secondary">
                  {step.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/signup"
              className="rounded-xl bg-dearly-accent px-7 py-4 text-base font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              {VI_NAV.createNow}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Occasions ── */}
      <section id="dip-le" className="border-y border-dearly-border/60 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-dearly-text-muted">
              Mọi dịp lễ
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">
              Một nền tảng thiệp mời cho mọi buổi tiệc
            </h2>
            <p className="mt-3 text-sm text-dearly-text-secondary">
              Dù là đám cưới trang trọng, tiệc sinh nhật vui tươi hay buổi họp
              mặt thân mật — Dearly đều có mẫu thiệp phù hợp cho bạn.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {[
              { href: "/vi/invitations/wedding", label: "Thiệp cưới" },
              { href: "/vi/invitations/birthday", label: "Thiệp sinh nhật" },
              { href: "/vi/invitations/party", label: "Thiệp mời tiệc" },
              { href: "/vi/invitations/dinner", label: "Tiệc tối" },
              { href: "/vi/invitations/engagement", label: "Thiệp đính hôn" },
              { href: "/vi/invitations/anniversary", label: "Kỷ niệm ngày cưới" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="rounded-full border border-dearly-border bg-dearly-card px-5 py-2.5 text-sm font-medium text-dearly-text-secondary transition hover:border-dearly-accent/50 hover:text-dearly-accent"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Dearly / details ── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-dearly-accent">
              Tại sao chọn Dearly
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
              Chất lượng chuyên nghiệp, không cần đợi hàng tuần
            </h2>
            <p className="mt-4 text-dearly-text-secondary">
              Thay vì chờ đợi từ studio thiết kế và trả chi phí cao, bạn có thể
              tự tạo thiệp đẹp trong vài phút với Dearly — đầy đủ tính năng hiện
              đại mà các studio thường tính thêm phí.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Heart,
                title: "Miễn phí trong giai đoạn trải nghiệm",
                body: "Tất cả mẫu thiết kế và tính năng đều được mở khóa hoàn toàn. Không có mẫu trả phí, không giới hạn thời gian thử nghiệm, không cần nhập thẻ tín dụng. Chúng tôi sẽ thông báo trước khi có bất kỳ thay đổi nào về giá.",
              },
              {
                icon: Sparkles,
                title: "Xem trước theo thời gian thực",
                body: "Thay đổi màu sắc, phông chữ hay nội dung và thấy kết quả ngay lập tức. Không cần gửi yêu cầu cho nhà thiết kế, không cần chờ file proof — bạn toàn quyền kiểm soát từng chi tiết.",
              },
              {
                icon: Users,
                title: "Dữ liệu thuộc về bạn",
                body: "Không có cookie theo dõi, không có quảng cáo. Thông tin khách mời và dữ liệu sự kiện của bạn được bảo mật tuyệt đối. Bạn có thể xuất toàn bộ dữ liệu bất cứ lúc nào.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-dearly-border bg-dearly-card p-7 shadow-card"
              >
                <item.icon size={20} className="text-dearly-accent" aria-hidden />
                <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-dearly-text-secondary">
                  {item.body}
                </p>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {[
              {
                name: "Thảo & Tâm Anh",
                event: "Đám cưới · Hà Nội",
                quote:
                  "Hỗ trợ tiếng Việt và phần giới thiệu gia đình rất phù hợp với lễ cưới của chúng tôi. Khách mời rất thích hiệu ứng mở thiệp — nhiều người hỏi đây là app gì.",
              },
              {
                name: "Lan Phương",
                event: "Sinh nhật 30 tuổi · TP. Hồ Chí Minh",
                quote:
                  "Tôi tạo thiệp trong giờ ăn trưa và gửi link cho bạn bè trước khi hết giờ nghỉ. Mọi người xác nhận tham dự qua điện thoại ngay lập tức, không ai phàn nàn khó dùng.",
              },
            ].map((t) => (
              <blockquote
                key={t.name}
                className="flex h-full flex-col rounded-2xl border border-dearly-border bg-dearly-card p-6 shadow-card"
              >
                <p className="flex-1 text-sm italic leading-relaxed text-dearly-text-secondary">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <footer className="mt-4 text-xs">
                  <span className="font-semibold text-dearly-text">{t.name}</span>
                  <span className="ml-2 text-dearly-text-muted">{t.event}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="hoi-dap" className="bg-dearly-card/50 px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-dearly-accent">
              Hỏi đáp
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
              Câu hỏi thường gặp
            </h2>
            <p className="mt-4 text-dearly-text-secondary">
              Chưa tìm được câu trả lời? Liên hệ với chúng tôi qua trang{" "}
              <Link href="/contact" className="font-semibold text-dearly-accent hover:underline">
                Liên hệ
              </Link>{" "}
              — một người thật sẽ trả lời bạn.
            </p>
          </div>

          <div className="mt-10 space-y-3">
            {VI_FAQS.map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-dearly-border bg-dearly-card p-5 open:shadow-card"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  {item.q}
                  <span
                    className="text-dearly-accent transition group-open:rotate-45"
                    aria-hidden
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-dearly-text-secondary">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative overflow-hidden px-6 py-32 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_50%,rgb(var(--dearly-rose-soft))_0%,transparent_70%)]"
        />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-display text-4xl font-bold md:text-6xl">
            Mỗi dịp lễ xứng đáng có một thiệp mời đẹp.
          </h2>
          <p className="mt-5 text-lg text-dearly-text-secondary">
            Miễn phí trong giai đoạn trải nghiệm. Xem trước mọi mẫu thiết kế.
            Gửi khi bạn hài lòng.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-xl bg-dearly-accent px-8 py-4 text-base font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              Bắt đầu ngay — Miễn phí
            </Link>
            <Link
              href="/templates/velvet"
              className="rounded-xl border border-dearly-border bg-dearly-card/70 px-8 py-4 text-base font-semibold transition hover:-translate-y-0.5"
            >
              Xem demo trực tiếp
            </Link>
          </div>
          <p className="mt-5 text-xs text-dearly-text-muted">
            Không cần thẻ tín dụng ·{" "}
            <Link href="/privacy" className="underline hover:text-dearly-text-secondary">
              Chính sách bảo mật
            </Link>{" "}
            ·{" "}
            <Link href="/terms" className="underline hover:text-dearly-text-secondary">
              Điều khoản
            </Link>
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-dearly-border bg-dearly-card/40 px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <span className="font-display text-xl font-bold text-dearly-accent">
              Dearly
            </span>

            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-dearly-text-muted">
              <Link href="/vi" className="hover:text-dearly-text-secondary">
                {VI_NAV.home}
              </Link>
              <Link
                href="/vi/invitations/wedding"
                className="hover:text-dearly-text-secondary"
              >
                {VI_NAV.wedding}
              </Link>
              <Link
                href="/vi/invitations/birthday"
                className="hover:text-dearly-text-secondary"
              >
                {VI_NAV.birthday}
              </Link>
              <Link
                href="/vi/invitations/party"
                className="hover:text-dearly-text-secondary"
              >
                {VI_NAV.party}
              </Link>
              <Link href="/vi/mau-thiet-ke" className="hover:text-dearly-text-secondary">
                {VI_NAV.templates}
              </Link>
              <Link href="/help" className="hover:text-dearly-text-secondary">
                {VI_NAV.help}
              </Link>
              <Link href="/contact" className="hover:text-dearly-text-secondary">
                Liên hệ
              </Link>
              <Link href="/privacy" className="hover:text-dearly-text-secondary">
                Bảo mật
              </Link>
              <Link href="/terms" className="hover:text-dearly-text-secondary">
                Điều khoản
              </Link>
              <Link
                href="/"
                className="font-medium text-dearly-accent hover:underline"
              >
                🌐 English
              </Link>
            </div>

            <p className="text-sm text-dearly-text-muted">
              &copy; {new Date().getFullYear()} Dearly. Làm với tâm huyết.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

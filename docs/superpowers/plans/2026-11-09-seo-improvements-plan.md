# SEO Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Vietnamese content pages, hreflang tags, richer English content, breadcrumb UI, improved internal linking, and sitemap updates to improve Google rankings for both Vietnamese and English search queries.

**Architecture:** Static Vietnamese pages at `/vi/*` prefix with standalone content (no i18n framework). Breadcrumb component shared across languages. Hreflang via Next.js metadata alternates. Richer occasion pages with expanded content sections. Sitemap extended with Vietnamese URLs.

**Tech Stack:** Next.js 14 (App Router), React, Tailwind CSS, Supabase (template queries).

---

## File Structure

### New Files
```
src/lib/seo-vi.ts                                    — Vietnamese SEO constants and keywords
src/lib/occasions-vi.ts                               — Vietnamese occasion page data
src/lib/guides-vi.ts                                  — Vietnamese guide content
src/components/ui/Breadcrumbs.tsx                     — Reusable breadcrumb UI component
src/app/vi/layout.tsx                                 — Vietnamese layout (lang="vi")
src/app/vi/page.tsx                                   — Vietnamese homepage
src/app/vi/invitations/wedding/page.tsx               — Vietnamese wedding landing
src/app/vi/invitations/birthday/page.tsx              — Vietnamese birthday landing
src/app/vi/invitations/party/page.tsx                 — Vietnamese party landing
src/app/vi/cach-su-dung/page.tsx                      — Vietnamese how-it-works
src/app/vi/mau-thiet-ke/page.tsx                      — Vietnamese templates gallery
src/app/vi/huong-dan/page.tsx                         — Vietnamese help hub
src/app/vi/huong-dan/[slug]/page.tsx                  — Vietnamese help guide
```

### Modified Files
```
src/app/page.tsx                                      — Hreflang + Vietnamese footer links
src/app/invitations/[type]/page.tsx                   — Richer content + hreflang + breadcrumbs + related links
src/app/how-it-works/page.tsx                         — Hreflang
src/app/templates/layout.tsx                          — Hreflang
src/app/templates/[slug]/page.tsx                     — Breadcrumbs
src/app/help/page.tsx                                 — Hreflang + breadcrumbs
src/app/help/[slug]/page.tsx                          — Hreflang + related links
src/app/sitemap.ts                                    — Vietnamese URLs
src/lib/seo.ts                                        — Updated meta descriptions
```

---

### Task 1: Vietnamese SEO Constants & Occasion Data

**Files:**
- Create: `src/lib/seo-vi.ts`
- Create: `src/lib/occasions-vi.ts`

- [ ] **Step 1: Create Vietnamese SEO constants**

Create `src/lib/seo-vi.ts` with Vietnamese site metadata, keywords, and helper text:

```typescript
/**
 * Vietnamese SEO constants — keywords, descriptions and metadata
 * for all /vi/* pages.
 */

export const VI_SITE_TAGLINE = "Thiệp mời, RSVP và quản lý khách mời cho mọi dịp lễ";

export const VI_SITE_DESCRIPTION =
  "Tạo thiệp mời trực tuyến cho đám cưới, sinh nhật, tiệc và sự kiện — với RSVP, link mời cá nhân, lịch trình, lời chúc và album ảnh chung. Miễn phí trong giai đoạn trải nghiệm.";

export const VI_SITE_KEYWORDS = [
  "thiệp cưới online",
  "thiệp cưới đẹp",
  "mẫu thiệp cưới",
  "thiệp mời đám cưới",
  "tạo thiệp cưới",
  "thiệp cưới miễn phí",
  "thiệp mời online",
  "thiệp mời trực tuyến",
  "thiệp sinh nhật online",
  "thiệp mời sinh nhật",
  "thiệp mời tiệc",
  "thiệp mời sự kiện",
  "RSVP online",
  "quản lý khách mời",
  "album ảnh đám cưới",
  "lời chúc đám cưới",
  "thiệp cưới điện tử",
  "thiệp mời điện tử",
  "wedding invitation Vietnam",
  "digital wedding invitation Vietnam",
];

/** Vietnamese navigation labels. */
export const VI_NAV = {
  home: "Trang chủ",
  templates: "Mẫu thiết kế",
  howItWorks: "Cách sử dụng",
  help: "Hướng dẫn",
  wedding: "Thiệp cưới",
  birthday: "Thiệp sinh nhật",
  party: "Thiệp mời tiệc",
  invitations: "Thiệp mời",
  signUp: "Đăng ký",
  login: "Đăng nhập",
  getStarted: "Bắt đầu ngay",
  learnMore: "Tìm hiểu thêm",
  browseTemplates: "Xem mẫu thiết kế",
  createNow: "Tạo thiệp ngay",
  free: "Miễn phí",
};
```

- [ ] **Step 2: Create Vietnamese occasion data**

Create `src/lib/occasions-vi.ts` with full Vietnamese content for 3 occasion pages (wedding, birthday, party):

```typescript
/**
 * Vietnamese occasion page data — mirrors src/lib/occasions.ts
 * with Vietnamese content optimised for SEO.
 */

export interface ViOccasionPage {
  slug: string;
  enSlug: string;
  title: string;
  description: string;
  keywords: string[];
  h1: string;
  intro: string;
  features: { title: string; description: string }[];
  howTo: { title: string; description: string }[];
  comparison: { dearly: string; traditional: string }[];
  faq: { q: string; a: string }[];
  relatedGuides: string[];
}

export const VI_OCCASIONS: ViOccasionPage[] = [
  {
    slug: "wedding",
    enSlug: "wedding",
    title: "Thiệp Cưới Online Đẹp Miễn Phí — RSVP & Album Ảnh | Dearly",
    description: "Tạo thiệp cưới online đẹp với RSVP, link mời cá nhân, lịch trình, lời chúc và album ảnh. Hơn 20 mẫu thiết kế. Hoàn toàn miễn phí.",
    keywords: ["thiệp cưới online", "thiệp cưới đẹp", "mẫu thiệp cưới", "thiệp cưới miễn phí", "thiệp cưới điện tử", "thiệp mời đám cưới online", "tạo thiệp cưới", "RSVP đám cưới", "quản lý khách mời đám cưới", "album ảnh đám cưới online", "lời chúc đám cưới"],
    h1: "Thiệp Cưới Online Đẹp — Miễn Phí",
    intro: "Tạo thiệp cưới điện tử đẹp lung linh chỉ trong vài phút. Gửi link mời cá nhân cho từng khách, theo dõi RSVP trực tiếp, thu thập lời chúc và chia sẻ album ảnh — tất cả trên một trang duy nhất.",
    features: [
      { title: "Hơn 20 mẫu thiệp cưới đẹp", description: "Từ phong cách tối giản đến sang trọng, từ Á Đông đến hiện đại. Mỗi mẫu đều có hiệu ứng chuyển động mượt mà và tùy chỉnh màu sắc, font chữ theo ý bạn." },
      { title: "RSVP & quản lý khách mời", description: "Khách chỉ cần nhấn \"Tôi sẽ đến\" hoặc \"Không thể tham dự\". Bạn theo dõi số lượng khách, kích thước bàn tiệc và xuất danh sách CSV." },
      { title: "Link mời cá nhân", description: "Mỗi khách nhận một link riêng, hiển thị tên của họ trên thiệp. Không cần app, không cần đăng ký — chỉ cần mở link." },
      { title: "Lời chúc & phản hồi", description: "Khách gửi lời chúc ngay khi RSVP. Lời chúc hiển thị trên tường chúc phúc — chạy ngang, bay lên hoặc hiện như livestream." },
      { title: "Album ảnh chung", description: "Cặp đôi tải ảnh cưới lên ngay. Sau lễ, khách cũng có thể đóng góp ảnh. Tất cả hiển thị trong album masonry đẹp mắt." },
      { title: "Lịch trình & bản đồ", description: "Thêm lịch trình ngày cưới (lễ vu quy, tiệc cưới, after party), địa điểm và hướng dẫn đường đi cho khách." },
    ],
    howTo: [
      { title: "Chọn mẫu thiết kế", description: "Duyệt hơn 20 mẫu thiệp cưới. Xem trước trực tiếp, chọn mẫu phù hợp với phong cách của bạn." },
      { title: "Điền thông tin", description: "Nhập tên cặp đôi, ngày cưới, địa điểm, câu chuyện tình yêu, lịch trình và thông tin chuyển khoản." },
      { title: "Gửi link cho khách", description: "Chia sẻ link thiệp cưới qua Zalo, Messenger, SMS hoặc email. Mỗi khách có link riêng với tên được cá nhân hóa." },
    ],
    comparison: [
      { dearly: "Miễn phí, tạo trong 5 phút", traditional: "In ấn tốn 2-5 triệu VNĐ, chờ 1-2 tuần" },
      { dearly: "Theo dõi RSVP trực tiếp", traditional: "Gọi điện, nhắn tin từng người" },
      { dearly: "Thay đổi thông tin bất cứ lúc nào", traditional: "In lại nếu có sai sót" },
      { dearly: "Album ảnh và lời chúc trực tuyến", traditional: "Không có" },
      { dearly: "Thân thiện với môi trường", traditional: "Tốn giấy, mực in" },
    ],
    faq: [
      { q: "Thiệp cưới online trên Dearly có miễn phí không?", a: "Có, Dearly hoàn toàn miễn phí trong giai đoạn trải nghiệm sớm. Bạn được sử dụng tất cả mẫu thiết kế, RSVP, album ảnh và lời chúc mà không mất phí." },
      { q: "Tôi có thể tùy chỉnh màu sắc và font chữ không?", a: "Có. Mỗi mẫu đều cho phép bạn thay đổi màu chủ đạo, màu phụ, màu nhấn và chọn font chữ riêng cho tiêu đề và nội dung." },
      { q: "Khách mời có cần tải app không?", a: "Không. Khách chỉ cần mở link trên trình duyệt điện thoại hoặc máy tính. Không cần đăng ký hay đăng nhập." },
      { q: "Tôi có thể theo dõi ai đã RSVP chưa?", a: "Có. Dashboard hiển thị danh sách khách đã trả lời, đang chờ và số lượng khách tham dự. Bạn cũng nhận email thông báo mỗi khi có RSVP mới." },
      { q: "Thiệp có hỗ trợ tiếng Việt không?", a: "Có. Dearly hỗ trợ tiếng Việt, tiếng Anh, tiếng Trung, tiếng Nhật và tiếng Hàn. Bạn chọn ngôn ngữ trong phần cài đặt thiệp." },
      { q: "Tôi có thể thêm nhạc nền không?", a: "Có. Chọn từ thư viện nhạc có sẵn hoặc dán link nhạc riêng của bạn. Nhạc sẽ phát khi khách mở thiệp." },
      { q: "Sau đám cưới, thiệp còn hoạt động không?", a: "Có. Thiệp tự động chuyển thành album kỷ niệm với ảnh và lời chúc. Bạn có thể quay lại xem bất cứ lúc nào." },
      { q: "Làm sao để gửi thiệp cho khách?", a: "Sao chép link thiệp và gửi qua Zalo, Messenger, SMS, email hoặc bất kỳ ứng dụng nào. Bạn cũng có thể tạo mã QR để in trên thiệp giấy." },
      { q: "Tôi có thể thêm thông tin chuyển khoản mừng cưới không?", a: "Có. Phần quà tặng cho phép bạn thêm tối đa 2 tài khoản ngân hàng với mã QR để khách chuyển khoản tiện lợi." },
      { q: "Dearly có mẫu thiệp Á Đông không?", a: "Có. Dearly có nhiều mẫu thiệp phong cách Á Đông (Nhật Bản, Hàn Quốc, Trung Quốc, Việt Nam) với bố cục và ngôn ngữ phù hợp." },
    ],
    relatedGuides: ["create-your-invitation", "guest-list", "customise-your-design", "publish-and-share"],
  },
  {
    slug: "birthday",
    enSlug: "birthday",
    title: "Thiệp Sinh Nhật Online Đẹp Miễn Phí — RSVP & Ảnh | Dearly",
    description: "Tạo thiệp mời sinh nhật trực tuyến đẹp với RSVP, danh sách khách, lời chúc và album ảnh. Miễn phí, dễ sử dụng.",
    keywords: ["thiệp sinh nhật online", "thiệp mời sinh nhật", "thiệp sinh nhật đẹp", "tạo thiệp sinh nhật", "mẫu thiệp sinh nhật", "thiệp sinh nhật miễn phí"],
    h1: "Thiệp Sinh Nhật Online Đẹp — Miễn Phí",
    intro: "Tạo thiệp mời sinh nhật lung linh trong vài phút. Gửi link cho bạn bè, theo dõi ai sẽ đến và thu thập lời chúc — tất cả trên một trang.",
    features: [
      { title: "Mẫu thiết kế vui nhộn", description: "Từ phong cách tối giản đến sôi động, phù hợp mọi lứa tuổi và chủ đề tiệc." },
      { title: "RSVP dễ dàng", description: "Khách nhấn một nút để trả lời. Bạn biết ngay ai sẽ đến và bao nhiêu người." },
      { title: "Lời chúc sinh nhật", description: "Khách gửi lời chúc ngay trên thiệp. Tất cả hiển thị đẹp mắt trên tường chúc." },
      { title: "Album ảnh tiệc", description: "Sau tiệc, khách tải ảnh lên album chung để cả nhóm cùng xem lại." },
    ],
    howTo: [
      { title: "Chọn mẫu", description: "Duyệt và chọn mẫu thiệp sinh nhật phù hợp." },
      { title: "Điền thông tin", description: "Nhập tên, ngày, địa điểm và lời mời." },
      { title: "Gửi cho bạn bè", description: "Chia sẻ link qua Zalo, Messenger hoặc SMS." },
    ],
    comparison: [
      { dearly: "Miễn phí, tạo trong 3 phút", traditional: "Mua thiệp giấy hoặc đặt thiết kế riêng" },
      { dearly: "Biết ngay ai sẽ đến", traditional: "Nhắn tin hỏi từng người" },
      { dearly: "Album ảnh chung sau tiệc", traditional: "Mỗi người giữ ảnh riêng" },
    ],
    faq: [
      { q: "Thiệp sinh nhật trên Dearly có miễn phí không?", a: "Có, hoàn toàn miễn phí trong giai đoạn trải nghiệm sớm." },
      { q: "Tôi có thể tạo thiệp cho sinh nhật trẻ em không?", a: "Có. Bạn có thể chọn mẫu vui nhộn và tùy chỉnh nội dung phù hợp với mọi lứa tuổi." },
      { q: "Khách có cần tải app không?", a: "Không. Chỉ cần mở link trên trình duyệt." },
      { q: "Tôi có thể thêm lịch trình tiệc không?", a: "Có. Phần lịch trình cho phép bạn liệt kê các hoạt động theo thời gian." },
      { q: "Có hỗ trợ tiếng Việt không?", a: "Có. Dearly hỗ trợ đầy đủ tiếng Việt." },
      { q: "Sau tiệc, thiệp còn hoạt động không?", a: "Có. Thiệp trở thành album kỷ niệm với ảnh và lời chúc." },
    ],
    relatedGuides: ["create-your-invitation", "guest-list", "photos-and-memories"],
  },
  {
    slug: "party",
    enSlug: "party",
    title: "Thiệp Mời Tiệc & Sự Kiện Online — RSVP Miễn Phí | Dearly",
    description: "Tạo thiệp mời tiệc, sự kiện, họp mặt trực tuyến với RSVP, danh sách khách và album ảnh. Miễn phí, chuyên nghiệp.",
    keywords: ["thiệp mời tiệc", "thiệp mời sự kiện", "thiệp mời online", "tạo thiệp mời tiệc", "RSVP sự kiện", "thiệp mời họp mặt"],
    h1: "Thiệp Mời Tiệc & Sự Kiện Online",
    intro: "Tổ chức tiệc, họp mặt hay sự kiện? Tạo thiệp mời chuyên nghiệp trong vài phút với RSVP, danh sách khách và album ảnh.",
    features: [
      { title: "Phù hợp mọi sự kiện", description: "Tiệc tân gia, họp lớp, tiệc công ty, liên hoan — chọn mẫu và tùy chỉnh theo ý bạn." },
      { title: "RSVP chuyên nghiệp", description: "Khách trả lời nhanh chóng. Bạn quản lý danh sách và số lượng dễ dàng." },
      { title: "Chia sẻ linh hoạt", description: "Gửi link qua Zalo, email, SMS hoặc tạo mã QR." },
      { title: "Album ảnh sự kiện", description: "Thu thập ảnh từ tất cả khách tham dự vào một album chung." },
    ],
    howTo: [
      { title: "Chọn mẫu thiết kế", description: "Duyệt và chọn mẫu phù hợp với sự kiện của bạn." },
      { title: "Thêm chi tiết", description: "Nhập thông tin sự kiện, lịch trình và địa điểm." },
      { title: "Mời khách", description: "Gửi link mời cá nhân cho từng khách." },
    ],
    comparison: [
      { dearly: "Miễn phí, tạo trong 5 phút", traditional: "Thiết kế riêng hoặc mua thiệp giấy" },
      { dearly: "Quản lý khách trực tuyến", traditional: "Excel hoặc ghi sổ tay" },
      { dearly: "Album ảnh chung", traditional: "Không có" },
    ],
    faq: [
      { q: "Thiệp mời sự kiện trên Dearly có miễn phí không?", a: "Có, hoàn toàn miễn phí trong giai đoạn trải nghiệm." },
      { q: "Tôi có thể dùng cho tiệc công ty không?", a: "Có. Dearly phù hợp cho mọi loại sự kiện từ cá nhân đến doanh nghiệp." },
      { q: "Có giới hạn số lượng khách không?", a: "Trong giai đoạn miễn phí, bạn có thể mời đến 1,000 khách." },
      { q: "Khách có cần đăng ký không?", a: "Không. Khách chỉ cần mở link và trả lời RSVP." },
      { q: "Tôi có thể xem ai đã trả lời chưa?", a: "Có. Dashboard hiển thị trạng thái của từng khách." },
      { q: "Có thể thêm nhiều sự kiện trong một ngày không?", a: "Có. Phần lịch trình cho phép bạn thêm nhiều mục theo thời gian." },
    ],
    relatedGuides: ["create-your-invitation", "guest-list", "publish-and-share"],
  },
];

/** Finds a Vietnamese occasion by slug. */
export function getViOccasion(slug: string): ViOccasionPage | undefined {
  return VI_OCCASIONS.find((o) => o.slug === slug);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/seo-vi.ts src/lib/occasions-vi.ts
git commit -m "feat: add Vietnamese SEO constants and occasion data"
```

---

### Task 2: Breadcrumb UI Component

**Files:**
- Create: `src/components/ui/Breadcrumbs.tsx`

- [ ] **Step 1: Create the breadcrumb component**

```tsx
// src/components/ui/Breadcrumbs.tsx
/**
 * Reusable breadcrumb navigation — renders a trail of links
 * matching the JSON-LD BreadcrumbList for SEO consistency.
 */

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-gray-500">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={14} className="text-gray-400" />}
          {item.href ? (
            <Link href={item.href} className="transition hover:text-gray-900 hover:underline underline-offset-2">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-700">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/Breadcrumbs.tsx
git commit -m "feat: add reusable Breadcrumbs UI component"
```

---

### Task 3: Vietnamese Layout

**Files:**
- Create: `src/app/vi/layout.tsx`

- [ ] **Step 1: Create the Vietnamese layout**

```tsx
// src/app/vi/layout.tsx
/**
 * Vietnamese layout — sets lang="vi" on the html element
 * and provides shared Vietnamese metadata.
 */

import type { Metadata } from "next";
import { VI_SITE_DESCRIPTION, VI_SITE_KEYWORDS, VI_SITE_TAGLINE } from "@/lib/seo-vi";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  openGraph: {
    locale: "vi_VN",
    alternateLocale: "en_US",
  },
};

export default function ViLayout({ children }: { children: React.ReactNode }) {
  return <div lang="vi">{children}</div>;
}
```

- [ ] **Step 2: Commit**

```bash
git add "src/app/vi/layout.tsx"
git commit -m "feat: add Vietnamese layout with lang=vi"
```

---

### Task 4: Vietnamese Homepage

**Files:**
- Create: `src/app/vi/page.tsx`

- [ ] **Step 1: Create the Vietnamese homepage**

Create `src/app/vi/page.tsx` — a full Vietnamese landing page with:
- Metadata: Vietnamese title, description, keywords, hreflang to `/`, canonical to `/vi`
- OG locale: `vi_VN`
- JSON-LD: `WebSite` + `Organization` + `FAQPage` in Vietnamese
- Content sections: Hero with H1 + CTA, 6-feature grid, 3-step how-to, stats block, 8 FAQ items, footer with links to all `/vi/*` pages and English switcher
- ~1500 words of natural Vietnamese content, keyword-rich
- Links to `/vi/invitations/wedding`, `/vi/mau-thiet-ke`, `/vi/cach-su-dung`, `/vi/huong-dan`

The page should follow the structure of the English homepage but with fully Vietnamese content (not a translation — natural Vietnamese phrasing for how people search).

Key Vietnamese H1: `"Tạo Thiệp Mời Online Đẹp — Miễn Phí"`

The FAQ section should target these search queries:
- "thiệp mời online có miễn phí không"
- "cách tạo thiệp cưới trực tuyến"
- "thiệp mời điện tử là gì"
- "Dearly là gì"
- etc.

Include Vietnamese footer with language switcher: `English` link to `/`.

- [ ] **Step 2: Commit**

```bash
git add "src/app/vi/page.tsx"
git commit -m "feat: add Vietnamese homepage with full SEO content"
```

---

### Task 5: Vietnamese Wedding Landing Page

**Files:**
- Create: `src/app/vi/invitations/wedding/page.tsx`

- [ ] **Step 1: Create the Vietnamese wedding page**

Create `src/app/vi/invitations/wedding/page.tsx` using data from `getViOccasion("wedding")` in `src/lib/occasions-vi.ts`.

Structure:
- Metadata from the occasion data (title, description, keywords) + hreflang to `/invitations/wedding`
- JSON-LD: `FAQPage` (10 Vietnamese Q&A), `BreadcrumbList` (Trang chủ → Thiệp mời → Thiệp cưới), `HowTo` (3 steps in Vietnamese)
- Breadcrumbs component at top
- H1 from occasion data
- Intro paragraph
- 6-feature deep-dive section (each feature: icon, title, 100-word description)
- 3-step how-to section
- Template showcase: query Supabase for wedding templates, show 6 cards linking to `/vi/mau-thiet-ke`
- Comparison table: Dearly vs thiệp cưới truyền thống (5 rows)
- Extended FAQ section (10 items)
- Related guides section: 4 links to `/vi/huong-dan/[slug]`
- Related occasions: links to `/vi/invitations/birthday` and `/vi/invitations/party`
- Language switcher: `English` link to `/invitations/wedding`
- CTA footer: "Tạo thiệp cưới ngay" button

Use `revalidate = 3600` for ISR (same as English occasion pages).

- [ ] **Step 2: Commit**

```bash
git add "src/app/vi/invitations/wedding/page.tsx"
git commit -m "feat: add Vietnamese wedding landing page with rich SEO content"
```

---

### Task 6: Vietnamese Birthday & Party Pages

**Files:**
- Create: `src/app/vi/invitations/birthday/page.tsx`
- Create: `src/app/vi/invitations/party/page.tsx`

- [ ] **Step 1: Create Vietnamese birthday page**

Same structure as the wedding page but using `getViOccasion("birthday")` data. Hreflang to `/invitations/birthday`. BreadcrumbList: Trang chủ → Thiệp mời → Thiệp sinh nhật. Fetch birthday-relevant templates from Supabase.

- [ ] **Step 2: Create Vietnamese party page**

Same structure using `getViOccasion("party")` data. Hreflang to `/invitations/party`. BreadcrumbList: Trang chủ → Thiệp mời → Thiệp mời tiệc.

- [ ] **Step 3: Commit**

```bash
git add "src/app/vi/invitations/"
git commit -m "feat: add Vietnamese birthday and party landing pages"
```

---

### Task 7: Vietnamese How-It-Works Page

**Files:**
- Create: `src/app/vi/cach-su-dung/page.tsx`

- [ ] **Step 1: Create the Vietnamese how-it-works page**

Create `src/app/vi/cach-su-dung/page.tsx`:
- Metadata: title "Cách Tạo Thiệp Mời Online — Hướng Dẫn 3 Bước", hreflang to `/how-it-works`
- JSON-LD: `HowTo` (3 steps, totalTime PT8M) + `BreadcrumbList` (Trang chủ → Cách sử dụng)
- Breadcrumbs component
- H1: "Tạo Thiệp Mời Chỉ Trong 3 Bước"
- 3 steps with icons, titles, and detailed Vietnamese descriptions (150 words each)
- CTA: "Bắt đầu ngay — Miễn phí"
- Links to `/vi/mau-thiet-ke` and `/vi/invitations/wedding`
- Language switcher to `/how-it-works`

- [ ] **Step 2: Commit**

```bash
git add "src/app/vi/cach-su-dung/"
git commit -m "feat: add Vietnamese how-it-works page"
```

---

### Task 8: Vietnamese Templates Gallery

**Files:**
- Create: `src/app/vi/mau-thiet-ke/page.tsx`

- [ ] **Step 1: Create the Vietnamese templates page**

Create `src/app/vi/mau-thiet-ke/page.tsx`:
- Metadata: title "Mẫu Thiệp Mời Đẹp — Đám Cưới, Sinh Nhật & Tiệc", hreflang to `/templates`
- JSON-LD: `CollectionPage` + `ItemList` + `BreadcrumbList` (Trang chủ → Mẫu thiết kế)
- Breadcrumbs component
- H1: "Mẫu Thiệp Mời Đẹp"
- Intro paragraph about template variety
- Query all templates from Supabase (same as English templates page)
- Grid of template cards with preview images and Vietnamese labels
- Each card links to `/templates/[slug]` (template detail pages are language-neutral)
- Filter or category labels in Vietnamese
- CTA: "Chọn mẫu và bắt đầu — Miễn phí"
- Language switcher to `/templates`

Use `revalidate = 3600` for ISR.

- [ ] **Step 2: Commit**

```bash
git add "src/app/vi/mau-thiet-ke/"
git commit -m "feat: add Vietnamese templates gallery page"
```

---

### Task 9: Vietnamese Help Hub & Guide Pages

**Files:**
- Create: `src/lib/guides-vi.ts`
- Create: `src/app/vi/huong-dan/page.tsx`
- Create: `src/app/vi/huong-dan/[slug]/page.tsx`

- [ ] **Step 1: Create Vietnamese guide data**

Create `src/lib/guides-vi.ts` — a simplified version of `src/lib/guides.ts` with Vietnamese titles and summaries for the most important guides. Start with 6 core guides:

```typescript
/**
 * Vietnamese help guide content — mirrors key guides from src/lib/guides.ts.
 */

export interface ViGuide {
  slug: string;
  enSlug: string;
  title: string;
  summary: string;
  keywords: string[];
  minutes: number;
  sections: { heading: string; body: string }[];
  faq: { q: string; a: string }[];
}

export const VI_GUIDES: ViGuide[] = [
  {
    slug: "tao-thiep-moi",
    enSlug: "create-your-invitation",
    title: "Cách tạo thiệp mời trên Dearly",
    summary: "Hướng dẫn từng bước tạo thiệp mời đầu tiên của bạn — từ đăng ký đến xuất bản.",
    keywords: ["tạo thiệp mời", "hướng dẫn Dearly", "cách dùng Dearly"],
    minutes: 4,
    sections: [
      { heading: "Đăng ký tài khoản", body: "Truy cập Dearly và đăng ký bằng email. Xác nhận email và đăng nhập vào dashboard." },
      { heading: "Chọn mẫu thiết kế", body: "Trong bước đầu tiên của trình tạo thiệp, bạn sẽ thấy hơn 20 mẫu. Nhấn vào để xem trước và chọn mẫu phù hợp." },
      { heading: "Điền thông tin sự kiện", body: "Nhập tên, ngày, địa điểm, câu chuyện và lịch trình. Tất cả đều có thể chỉnh sửa sau." },
      { heading: "Xuất bản và chia sẻ", body: "Nhấn Publish để xuất bản thiệp. Sao chép link và gửi cho khách qua Zalo, Messenger hoặc email." },
    ],
    faq: [
      { q: "Tạo thiệp mất bao lâu?", a: "Khoảng 5-10 phút nếu bạn đã có sẵn thông tin." },
      { q: "Tôi có thể chỉnh sửa sau khi xuất bản không?", a: "Có. Bạn có thể thay đổi bất kỳ thông tin nào và thiệp sẽ cập nhật ngay." },
    ],
  },
  {
    slug: "danh-sach-khach",
    enSlug: "guest-list",
    title: "Quản lý danh sách khách mời",
    summary: "Cách thêm khách, tạo link mời cá nhân và theo dõi RSVP.",
    keywords: ["danh sách khách mời", "quản lý khách", "RSVP"],
    minutes: 3,
    sections: [
      { heading: "Thêm khách mời", body: "Vào tab Guest List, nhập tên khách hoặc dán danh sách. Dearly hỗ trợ định dạng \"Tên, số người\" để thêm nhanh." },
      { heading: "Link mời cá nhân", body: "Mỗi khách nhận một link riêng. Khi mở link, tên của họ sẽ hiện trên thiệp." },
      { heading: "Theo dõi RSVP", body: "Dashboard hiển thị trạng thái của từng khách: đang chờ, sẽ đến hoặc không thể tham dự." },
    ],
    faq: [
      { q: "Có giới hạn số khách không?", a: "Trong giai đoạn miễn phí, bạn có thể thêm đến 1,000 khách." },
    ],
  },
  {
    slug: "tuy-chinh-thiet-ke",
    enSlug: "customise-your-design",
    title: "Tùy chỉnh thiết kế thiệp",
    summary: "Thay đổi màu sắc, font chữ, phần hiển thị và phong cách thiệp.",
    keywords: ["tùy chỉnh thiệp", "màu sắc thiệp cưới", "font chữ thiệp"],
    minutes: 3,
    sections: [
      { heading: "Đổi màu sắc", body: "Trong Editor, chọn tab Colours. Bạn có thể thay đổi 3 màu: chủ đạo, phụ và nhấn." },
      { heading: "Chọn font chữ", body: "Tab Fonts cho phép bạn chọn font tiêu đề (display) và font nội dung (body) riêng." },
      { heading: "Bật tắt phần hiển thị", body: "Tab Sections cho phép ẩn/hiện: countdown, story, schedule, gallery, RSVP, lời chúc, nhạc nền, v.v." },
    ],
    faq: [
      { q: "Tôi có thể dùng font tiếng Việt không?", a: "Có. Các font trên Dearly đều hỗ trợ ký tự tiếng Việt có dấu." },
    ],
  },
  {
    slug: "anh-va-ky-niem",
    enSlug: "photos-and-memories",
    title: "Album ảnh và kỷ niệm",
    summary: "Cách tải ảnh lên, bật tính năng ảnh từ khách và quản lý album.",
    keywords: ["album ảnh đám cưới", "ảnh kỷ niệm", "tải ảnh lên"],
    minutes: 3,
    sections: [
      { heading: "Tải ảnh của bạn", body: "Vào tab Memories & Photos, kéo thả hoặc chọn ảnh để tải lên. Ảnh của bạn được duyệt tự động." },
      { heading: "Ảnh từ khách mời", body: "Bật Guest Uploads để khách có thể đóng góp ảnh. Ảnh từ khách sẽ chờ bạn duyệt trước khi hiển thị." },
      { heading: "Quản lý album", body: "Chọn layout: masonry, albums hoặc timeline. Bạn có thể duyệt, từ chối hoặc xóa ảnh bất kỳ lúc nào." },
    ],
    faq: [
      { q: "Khách có thể tải ảnh lên không?", a: "Có, nếu bạn bật tính năng Guest Uploads. Ảnh từ khách sẽ chờ duyệt." },
    ],
  },
  {
    slug: "xuat-ban-va-chia-se",
    enSlug: "publish-and-share",
    title: "Xuất bản và chia sẻ thiệp",
    summary: "Cách xuất bản thiệp, tạo mã QR và chia sẻ qua Zalo, Messenger, email.",
    keywords: ["chia sẻ thiệp cưới", "xuất bản thiệp", "mã QR thiệp"],
    minutes: 2,
    sections: [
      { heading: "Xuất bản", body: "Vào Settings, nhấn Publish. Thiệp của bạn sẽ có một link duy nhất, ví dụ: dearly.app/ten-ban." },
      { heading: "Chia sẻ link", body: "Sao chép link và gửi qua Zalo, Messenger, SMS hoặc email. Bạn cũng có thể tạo mã QR để in trên thiệp giấy." },
      { heading: "Link cá nhân", body: "Nếu bạn đã thêm danh sách khách, mỗi khách có link riêng với tên được cá nhân hóa trên thiệp." },
    ],
    faq: [
      { q: "Tôi có thể thay đổi link thiệp không?", a: "Có. Vào Settings để đổi slug (phần cuối của link)." },
    ],
  },
  {
    slug: "nhac-nen",
    enSlug: "background-music",
    title: "Nhạc nền cho thiệp mời",
    summary: "Cách chọn nhạc nền từ thư viện hoặc thêm link nhạc riêng.",
    keywords: ["nhạc nền thiệp cưới", "nhạc thiệp mời", "background music"],
    minutes: 2,
    sections: [
      { heading: "Chọn từ thư viện", body: "Trong Editor → Background Music, tab Library hiển thị các bài nhạc royalty-free theo thể loại: piano, acoustic, orchestral, ambient, romantic." },
      { heading: "Dán link nhạc riêng", body: "Tab Custom URL cho phép bạn dán link file MP3. Nhạc sẽ phát khi khách mở thiệp và nhấn vào trang." },
      { heading: "Lưu ý bản quyền", body: "Nếu dùng nhạc riêng, bạn chịu trách nhiệm về bản quyền. Nhạc trong thư viện đã được cấp phép sử dụng cá nhân." },
    ],
    faq: [
      { q: "Nhạc có tự phát không?", a: "Nhạc phát khi khách nhấn vào trang lần đầu (trình duyệt yêu cầu tương tác trước khi phát nhạc)." },
    ],
  },
];

/** Finds a Vietnamese guide by slug. */
export function getViGuide(slug: string): ViGuide | undefined {
  return VI_GUIDES.find((g) => g.slug === slug);
}
```

- [ ] **Step 2: Create Vietnamese help hub page**

Create `src/app/vi/huong-dan/page.tsx`:
- Metadata: title "Hướng Dẫn Sử Dụng Dearly", hreflang to `/help`
- Breadcrumbs: Trang chủ → Hướng dẫn
- H1: "Hướng Dẫn Sử Dụng"
- List all Vietnamese guides as cards with title, summary, read time
- Each card links to `/vi/huong-dan/[slug]`
- Language switcher to `/help`

- [ ] **Step 3: Create Vietnamese guide detail page**

Create `src/app/vi/huong-dan/[slug]/page.tsx`:
- `generateStaticParams` returns all Vietnamese guide slugs
- `generateMetadata` uses guide title + summary + keywords + hreflang to `/help/[enSlug]`
- JSON-LD: `Article` + `BreadcrumbList` (Trang chủ → Hướng dẫn → Guide title) + `FAQPage`
- Breadcrumbs component at top
- Guide content: title, sections with headings and body text
- FAQ section (collapsible)
- Related guides links
- Language switcher to `/help/[enSlug]`

- [ ] **Step 4: Commit**

```bash
git add src/lib/guides-vi.ts "src/app/vi/huong-dan/"
git commit -m "feat: add Vietnamese help guides hub and detail pages"
```

---

### Task 10: Hreflang on English Pages

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/invitations/[type]/page.tsx`
- Modify: `src/app/how-it-works/page.tsx`
- Modify: `src/app/templates/layout.tsx`
- Modify: `src/app/help/page.tsx`
- Modify: `src/app/help/[slug]/page.tsx`

- [ ] **Step 1: Add hreflang to homepage metadata**

In `src/app/page.tsx`, find the `metadata` export and add `alternates.languages`:
```typescript
alternates: {
  canonical: absoluteUrl("/"),
  languages: {
    vi: absoluteUrl("/vi"),
    "x-default": absoluteUrl("/"),
  },
},
```

- [ ] **Step 2: Add hreflang to occasion pages**

In `src/app/invitations/[type]/page.tsx`, inside `generateMetadata`, map English slugs to Vietnamese routes. Add to the returned metadata:
```typescript
alternates: {
  canonical: absoluteUrl(`/invitations/${slug}`),
  languages: {
    vi: absoluteUrl(`/vi/invitations/${slug}`),
    "x-default": absoluteUrl(`/invitations/${slug}`),
  },
},
```
Only add `vi` for slugs that have Vietnamese counterparts: wedding, birthday, party.

- [ ] **Step 3: Add hreflang to how-it-works**

In `src/app/how-it-works/page.tsx`, add:
```typescript
alternates: {
  canonical: absoluteUrl("/how-it-works"),
  languages: {
    vi: absoluteUrl("/vi/cach-su-dung"),
    "x-default": absoluteUrl("/how-it-works"),
  },
},
```

- [ ] **Step 4: Add hreflang to templates layout**

In `src/app/templates/layout.tsx`:
```typescript
alternates: {
  canonical: absoluteUrl("/templates"),
  languages: {
    vi: absoluteUrl("/vi/mau-thiet-ke"),
    "x-default": absoluteUrl("/templates"),
  },
},
```

- [ ] **Step 5: Add hreflang to help pages**

In `src/app/help/page.tsx`:
```typescript
alternates: {
  canonical: absoluteUrl("/help"),
  languages: {
    vi: absoluteUrl("/vi/huong-dan"),
    "x-default": absoluteUrl("/help"),
  },
},
```

In `src/app/help/[slug]/page.tsx`, inside `generateMetadata`, map English guide slugs to Vietnamese guide slugs using the Vietnamese guide data. Add hreflang for guides that have Vietnamese counterparts.

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx "src/app/invitations/[type]/page.tsx" src/app/how-it-works/page.tsx src/app/templates/layout.tsx src/app/help/page.tsx "src/app/help/[slug]/page.tsx"
git commit -m "feat: add hreflang tags to all English pages with Vietnamese counterparts"
```

---

### Task 11: Richer English Occasion Pages

**Files:**
- Modify: `src/app/invitations/[type]/page.tsx`
- Modify: `src/lib/occasions.ts`

- [ ] **Step 1: Expand occasion data with more content**

In `src/lib/occasions.ts`, add to the `OccasionPage` interface:
```typescript
  howTo?: { title: string; description: string }[];
  comparison?: { dearly: string; traditional: string }[];
  relatedGuides?: string[];
```

Add `howTo`, `comparison`, and `relatedGuides` arrays to the wedding, birthday, and party occasions. Add 5 more FAQ items to each occasion (expanding from 4 to 9+).

- [ ] **Step 2: Expand the occasion page template**

In `src/app/invitations/[type]/page.tsx`, add new content sections after the existing features and before the FAQ:

1. **Step-by-step how-to** (from `occasion.howTo`) — numbered list with descriptions
2. **Comparison table** (from `occasion.comparison`) — "Dearly vs Traditional" with rows
3. **Related guides** (from `occasion.relatedGuides`) — card links to help guides
4. **Related occasions** — links to other occasion pages

Add the Breadcrumbs component at the top: Home → Invitations → {Occasion Name}.

- [ ] **Step 3: Commit**

```bash
git add src/lib/occasions.ts "src/app/invitations/[type]/page.tsx"
git commit -m "feat: expand English occasion pages with richer content and breadcrumbs"
```

---

### Task 12: Internal Linking & Footer

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/help/[slug]/page.tsx`

- [ ] **Step 1: Add Vietnamese links to homepage footer**

In `src/app/page.tsx`, in the footer section (around line 717-738), add a Vietnamese links row:

```tsx
<div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
  <span className="text-gray-500">Tiếng Việt:</span>
  <Link href="/vi/invitations/wedding" className="text-gray-400 hover:text-gray-200">Thiệp cưới</Link>
  <Link href="/vi/invitations/birthday" className="text-gray-400 hover:text-gray-200">Thiệp sinh nhật</Link>
  <Link href="/vi/invitations/party" className="text-gray-400 hover:text-gray-200">Thiệp mời tiệc</Link>
  <Link href="/vi/mau-thiet-ke" className="text-gray-400 hover:text-gray-200">Mẫu thiết kế</Link>
  <Link href="/vi/huong-dan" className="text-gray-400 hover:text-gray-200">Hướng dẫn</Link>
</div>
```

- [ ] **Step 2: Add related content to help guide pages**

In `src/app/help/[slug]/page.tsx`, after the existing related guides section, add a link to the most relevant occasion page. Use the guide's category to determine which occasion to link to (e.g., "guests" category → wedding occasion page).

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx "src/app/help/[slug]/page.tsx"
git commit -m "feat: improve internal linking with Vietnamese footer links and guide cross-links"
```

---

### Task 13: Breadcrumbs on English Pages

**Files:**
- Modify: `src/app/help/page.tsx`
- Modify: `src/app/help/[slug]/page.tsx`
- Modify: `src/app/how-it-works/page.tsx`
- Modify: `src/app/templates/[slug]/page.tsx`

- [ ] **Step 1: Add breadcrumbs to help pages**

In `src/app/help/page.tsx`, add Breadcrumbs component: `[{ label: "Home", href: "/" }, { label: "Help & Guides" }]`

In `src/app/help/[slug]/page.tsx`, the page already has breadcrumb-like navigation. Replace it with the Breadcrumbs component: `[{ label: "Home", href: "/" }, { label: "Help", href: "/help" }, { label: guide.title }]`

- [ ] **Step 2: Add breadcrumbs to how-it-works**

In `src/app/how-it-works/page.tsx`: `[{ label: "Home", href: "/" }, { label: "How It Works" }]`

- [ ] **Step 3: Add breadcrumbs to template detail**

In `src/app/templates/[slug]/page.tsx`: `[{ label: "Home", href: "/" }, { label: "Templates", href: "/templates" }, { label: templateName }]`

Only show when not in embedded mode (`!embed`).

- [ ] **Step 4: Commit**

```bash
git add src/app/help/page.tsx "src/app/help/[slug]/page.tsx" src/app/how-it-works/page.tsx "src/app/templates/[slug]/page.tsx"
git commit -m "feat: add visible breadcrumb navigation to English pages"
```

---

### Task 14: Sitemap Updates

**Files:**
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Add Vietnamese URLs to sitemap**

In `src/app/sitemap.ts`, add the Vietnamese pages to the static pages array:

```typescript
// Vietnamese pages
{ url: absoluteUrl("/vi"), lastModified: contentUpdated, changeFrequency: "weekly" as const, priority: 0.9 },
{ url: absoluteUrl("/vi/invitations/wedding"), lastModified: contentUpdated, changeFrequency: "monthly" as const, priority: 0.95 },
{ url: absoluteUrl("/vi/invitations/birthday"), lastModified: contentUpdated, changeFrequency: "monthly" as const, priority: 0.6 },
{ url: absoluteUrl("/vi/invitations/party"), lastModified: contentUpdated, changeFrequency: "monthly" as const, priority: 0.6 },
{ url: absoluteUrl("/vi/cach-su-dung"), lastModified: contentUpdated, changeFrequency: "monthly" as const, priority: 0.7 },
{ url: absoluteUrl("/vi/mau-thiet-ke"), lastModified: contentUpdated, changeFrequency: "weekly" as const, priority: 0.8 },
{ url: absoluteUrl("/vi/huong-dan"), lastModified: contentUpdated, changeFrequency: "monthly" as const, priority: 0.6 },
```

Also add Vietnamese guide pages by importing `VI_GUIDES` and mapping them:

```typescript
...VI_GUIDES.map((g) => ({
  url: absoluteUrl(`/vi/huong-dan/${g.slug}`),
  lastModified: contentUpdated,
  changeFrequency: "monthly" as const,
  priority: 0.5,
})),
```

Update `contentUpdated` to `2026-11-09`.

- [ ] **Step 2: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "feat: add Vietnamese pages to sitemap"
```

---

### Task 15: Meta Description Improvements

**Files:**
- Modify: `src/lib/seo.ts`

- [ ] **Step 1: Update meta descriptions**

In `src/lib/seo.ts`, update `SITE_DESCRIPTION` to be more keyword-front-loaded and exactly 155 characters:

```typescript
export const SITE_DESCRIPTION =
  "Free digital wedding invitations with RSVP, guest management, photo album & blessings wall. 20+ cinematic templates. Create yours in minutes — no app needed.";
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/seo.ts
git commit -m "chore: improve root meta description for SEO"
```

---

### Task 16: Final Verification

- [ ] **Step 1: Run type check**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 2: Run lint**

Run: `npx next lint`
Expected: No violations.

- [ ] **Step 3: Run tests**

Run: `npx vitest run`
Expected: All tests pass.

- [ ] **Step 4: Test build**

Run: `npx next build`
Expected: Build succeeds. All `/vi/*` pages appear in the build output.

- [ ] **Step 5: Verify sitemap**

After build, check that `/sitemap.xml` includes all new Vietnamese URLs.

- [ ] **Step 6: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve any build/lint issues from SEO changes"
```

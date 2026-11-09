# Dearly — SEO Improvements Design Spec

**Date:** 2026-11-09
**Scope:** Vietnamese content pages, hreflang, richer content, structured data, internal linking, breadcrumbs

---

## 1. Vietnamese Content Pages

### Route Structure

All Vietnamese pages live under `/vi/` prefix. No i18n framework — standalone pages with hardcoded Vietnamese content.

| Route | English equivalent | Primary keywords | Content length |
|---|---|---|---|
| `/vi` | `/` | "thiệp mời online", "tạo thiệp cưới", "thiệp mời sự kiện" | 1500+ words |
| `/vi/invitations/wedding` | `/invitations/wedding` | "thiệp cưới online", "thiệp cưới đẹp miễn phí", "mẫu thiệp cưới" | 1500+ words |
| `/vi/invitations/birthday` | `/invitations/birthday` | "thiệp sinh nhật online", "thiệp mời sinh nhật đẹp" | 1500+ words |
| `/vi/invitations/party` | `/invitations/party` | "thiệp mời tiệc", "thiệp mời sự kiện online" | 1500+ words |
| `/vi/cach-su-dung` | `/how-it-works` | "cách tạo thiệp cưới online", "hướng dẫn tạo thiệp mời" | 800+ words |
| `/vi/mau-thiet-ke` | `/templates` | "mẫu thiệp cưới", "mẫu thiệp mời đẹp", "mẫu thiệp sinh nhật" | 600+ words |
| `/vi/huong-dan` | `/help` | "hướng dẫn sử dụng Dearly", "cách dùng thiệp mời online" | 400+ words |
| `/vi/huong-dan/[slug]` | `/help/[slug]` | Per-guide Vietnamese keywords | 500+ words each |

### Page Content Structure

Each Vietnamese landing page follows this structure:

1. **Hero** — H1 with primary keyword, subtitle, CTA button
2. **Features grid** — 4-6 features with icons and descriptions
3. **How it works** — 3-step process
4. **Template previews** — 3-4 template cards linking to `/vi/mau-thiet-ke`
5. **Social proof** — Stats (số lượng sự kiện, khách mời, v.v.)
6. **FAQ section** — 8-10 Vietnamese Q&A pairs (feeds JSON-LD FAQPage)
7. **Related content** — Links to related guides and other occasion pages
8. **CTA footer** — Final call to action with signup link

### Vietnamese Help Guides

Mirror all existing English guides from `src/lib/guides.ts`. Create a parallel `src/lib/guides-vi.ts` with:
- Vietnamese title, summary, and body content
- Vietnamese keywords
- Same slug structure for hreflang pairing
- Vietnamese FAQ entries where applicable

---

## 2. Hreflang Tags

### Implementation

Use Next.js `metadata.alternates.languages` on every page that has a counterpart.

**English pages add:**
```typescript
alternates: {
  canonical: absoluteUrl("/invitations/wedding"),
  languages: {
    "vi": absoluteUrl("/vi/invitations/wedding"),
    "x-default": absoluteUrl("/invitations/wedding"),
  },
}
```

**Vietnamese pages add:**
```typescript
alternates: {
  canonical: absoluteUrl("/vi/invitations/wedding"),
  languages: {
    "en": absoluteUrl("/invitations/wedding"),
    "x-default": absoluteUrl("/invitations/wedding"),
  },
}
```

### Pages requiring hreflang (paired):

| English | Vietnamese |
|---|---|
| `/` | `/vi` |
| `/invitations/wedding` | `/vi/invitations/wedding` |
| `/invitations/birthday` | `/vi/invitations/birthday` |
| `/invitations/party` | `/vi/invitations/party` |
| `/how-it-works` | `/vi/cach-su-dung` |
| `/templates` | `/vi/mau-thiet-ke` |
| `/help` | `/vi/huong-dan` |
| `/help/[slug]` | `/vi/huong-dan/[slug]` |

---

## 3. Richer Occasion Landing Pages

### English Occasion Pages to Expand

All 6 occasion pages in `/invitations/[type]` expanded from ~300 words to 1500+ words.

**New content sections to add:**

1. **Feature deep-dive** — Expand the feature list from bullet points to 6 detailed blocks with descriptions (100 words each)
2. **Template showcase** — Inline grid of 4-6 relevant templates with images and links
3. **Step-by-step tutorial** — "How to create your [occasion] invitation" with numbered steps
4. **Comparison section** — "Why Dearly vs. traditional invitations" table
5. **Extended FAQ** — Expand from current 3-5 questions to 10-12 questions targeting long-tail keywords
6. **Related guides** — Link block to 3-4 relevant help guides
7. **Related occasions** — Cross-links to other occasion pages
8. **Testimonial/stats block** — "Join X couples who created their invitation on Dearly"

### Keyword Targeting Per Occasion

| Occasion | Additional keywords to target |
|---|---|
| Wedding | "free digital wedding invitation", "wedding RSVP online", "paperless wedding invitation" |
| Birthday | "free birthday invitation maker", "digital birthday card", "birthday party invitation online" |
| Party | "online party invitation", "event invitation free", "digital event invite" |
| Dinner | "dinner party invitation", "dinner invite online" |
| Social | "social event invitation", "gathering invitation online" |
| Date Night | "date night invitation", "romantic invitation card" |

---

## 4. Vietnamese Structured Data

### JSON-LD per Vietnamese page:

**`/vi` (homepage):**
- `WebSite` schema with Vietnamese name/description
- `Organization` with Vietnamese `description`
- `FAQPage` with 6-8 Vietnamese Q&A

**`/vi/invitations/wedding` (and other occasions):**
- `FAQPage` with 8-10 Vietnamese Q&A per page
- `BreadcrumbList`: Trang chủ → Thiệp mời → Thiệp cưới
- `HowTo` (on wedding page): Steps in Vietnamese

**`/vi/cach-su-dung`:**
- `HowTo` schema in Vietnamese with 3 steps
- `BreadcrumbList`: Trang chủ → Cách sử dụng

**`/vi/mau-thiet-ke`:**
- `CollectionPage` + `ItemList` in Vietnamese
- `BreadcrumbList`: Trang chủ → Mẫu thiết kế

**`/vi/huong-dan/[slug]`:**
- `Article` with Vietnamese headline, description, datePublished
- `BreadcrumbList`: Trang chủ → Hướng dẫn → [Guide title]
- `FAQPage` where applicable

---

## 5. Internal Linking Improvements

### Language Switcher
Add a language toggle to the site footer (not nav — keep nav clean):
- On English pages: "🇻🇳 Tiếng Việt" link to Vietnamese equivalent
- On Vietnamese pages: "🇬🇧 English" link to English equivalent
- Simple text link, not a dropdown

### Related Content Blocks
Add a "Related" section at the bottom of:

**Occasion pages** (English + Vietnamese):
- "Related guides" — 3-4 help guide links
- "Browse templates" — Link to templates page
- "Other occasions" — Links to 2-3 other occasion pages

**Help guides** (English + Vietnamese):
- "Related guides" — 2-3 other guide links
- "Get started" — Link to relevant occasion page
- "Browse templates" — Link to templates

**Template detail pages:**
- "Perfect for" — Link to relevant occasion page(s)
- "Need help?" — Link to relevant guide

### Footer Enhancement
Add a Vietnamese links section to the footer:
```
Tiếng Việt: Thiệp cưới · Thiệp sinh nhật · Thiệp mời tiệc · Mẫu thiết kế · Hướng dẫn
```

---

## 6. Visible Breadcrumb Navigation

### Breadcrumb Component

Create `src/components/ui/Breadcrumbs.tsx` — a reusable breadcrumb component.

**Props:**
```typescript
interface BreadcrumbItem {
  label: string;
  href?: string; // last item has no href (current page)
}
interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}
```

**Styling:**
- Small text (text-sm), muted color
- Separator: `›` or `/`
- Links are underlined on hover
- Positioned at top of page content, below nav
- Responsive — wraps on mobile

**Pages that get breadcrumbs:**

| Page | Breadcrumb trail |
|---|---|
| `/help` | Home › Help & Guides |
| `/help/[slug]` | Home › Help › {Guide Title} |
| `/invitations/[type]` | Home › Invitations › {Occasion} |
| `/templates` | Home › Templates |
| `/templates/[slug]` | Home › Templates › {Template Name} |
| `/how-it-works` | Home › How It Works |
| `/vi/huong-dan` | Trang chủ › Hướng dẫn |
| `/vi/huong-dan/[slug]` | Trang chủ › Hướng dẫn › {Tiêu đề} |
| `/vi/invitations/[type]` | Trang chủ › Thiệp mời › {Loại} |
| `/vi/mau-thiet-ke` | Trang chủ › Mẫu thiết kế |
| `/vi/cach-su-dung` | Trang chủ › Cách sử dụng |

---

## 7. Sitemap & Robots Updates

### New sitemap entries

Add all `/vi/*` pages:

| URL | Priority | Change freq |
|---|---|---|
| `/vi` | 0.9 | weekly |
| `/vi/invitations/wedding` | 0.95 | monthly |
| `/vi/invitations/birthday` | 0.6 | monthly |
| `/vi/invitations/party` | 0.6 | monthly |
| `/vi/cach-su-dung` | 0.7 | monthly |
| `/vi/mau-thiet-ke` | 0.8 | weekly |
| `/vi/huong-dan` | 0.6 | monthly |
| `/vi/huong-dan/[slug]` | 0.5 | monthly (each guide) |

### Sitemap hreflang

For each URL that has a language counterpart, add `xhtml:link` elements:
```xml
<url>
  <loc>https://dearly-self.vercel.app/invitations/wedding</loc>
  <xhtml:link rel="alternate" hreflang="vi" href="https://dearly-self.vercel.app/vi/invitations/wedding" />
  <xhtml:link rel="alternate" hreflang="en" href="https://dearly-self.vercel.app/invitations/wedding" />
</url>
```

Note: Next.js sitemap.ts doesn't support xhtml:link natively. We'll rely on the `metadata.alternates.languages` hreflang in page headers instead, which Google reads equivalently.

### Robots.txt

No changes needed — `/vi/` routes are public and should be crawlable.

---

## 8. Additional Meta Optimizations

### Meta Descriptions
Rewrite all key page descriptions to be:
- 150-160 characters (optimal for SERP display)
- Front-loaded with primary keyword
- Include a call-to-action or value proposition
- Unique per page (no duplicates)

### Vietnamese Meta Keywords
Each `/vi/*` page gets 15-20 Vietnamese keywords in metadata.

### OG Locale
- English pages: `og:locale` = `en_US`
- Vietnamese pages: `og:locale` = `vi_VN`, `og:locale:alternate` = `en_US`

---

## Technical Notes

### File Structure

New files:
```
src/app/vi/page.tsx                          — Vietnamese homepage
src/app/vi/invitations/wedding/page.tsx      — Vietnamese wedding page
src/app/vi/invitations/birthday/page.tsx     — Vietnamese birthday page
src/app/vi/invitations/party/page.tsx        — Vietnamese party page
src/app/vi/cach-su-dung/page.tsx             — Vietnamese how-it-works
src/app/vi/mau-thiet-ke/page.tsx             — Vietnamese templates
src/app/vi/huong-dan/page.tsx                — Vietnamese help hub
src/app/vi/huong-dan/[slug]/page.tsx         — Vietnamese help guide
src/app/vi/layout.tsx                        — Vietnamese layout (sets lang="vi")
src/lib/guides-vi.ts                         — Vietnamese guide content
src/lib/seo-vi.ts                            — Vietnamese SEO constants
src/components/ui/Breadcrumbs.tsx            — Breadcrumb UI component
```

Modified files:
```
src/app/layout.tsx                           — Add language switcher hint
src/app/page.tsx                             — Hreflang + footer Vietnamese links
src/app/invitations/[type]/page.tsx          — Richer content + hreflang + breadcrumbs + related
src/app/how-it-works/page.tsx                — Hreflang
src/app/templates/layout.tsx                 — Hreflang
src/app/templates/[slug]/page.tsx            — Breadcrumbs + related links
src/app/help/page.tsx                        — Hreflang + breadcrumbs
src/app/help/[slug]/page.tsx                 — Hreflang + breadcrumbs + related
src/app/sitemap.ts                           — Add Vietnamese URLs
src/lib/seo.ts                               — Updated meta descriptions
src/lib/occasions.ts                         — Vietnamese occasion data
```

### Content Strategy

Vietnamese content must be natural, keyword-rich, and genuinely useful — not just translated English. Each page should:
- Use Vietnamese search phrasing (how Vietnamese users actually search)
- Reference Vietnamese wedding/event customs
- Use culturally appropriate examples
- Include Vietnamese-specific FAQs

### What's NOT in scope
- Blog system (deferred)
- Custom domain setup (user will do later)
- Google Search Console registration (manual step)
- Backlink building
- Google Ads / paid search
- Social media integration

### Post-Implementation Manual Steps
After deployment, the user should:
1. Register at Google Search Console with `dearly-self.vercel.app`
2. Submit the sitemap URL: `https://dearly-self.vercel.app/sitemap.xml`
3. Request indexing for key pages
4. Monitor search performance in GSC

/**
 * Public template preview page — renders a full demo of the template
 * using placeholder wedding data, so guests can see exactly what each
 * template looks like before signing up.
 *
 * A floating banner at the top prompts visitors to create their own site.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { absoluteUrl } from "@/lib/seo";
import { LAYOUT_LABEL, getInvitationStyle } from "@/components/invitation/styles";
import Link from "next/link";
import { createCookieClient } from "@/lib/supabase/server";
import { getTemplate } from "@/components/templates/registry";
import { resolveTheme } from "@/components/templates/types";
import ScrollProgress from "@/components/ui/ScrollProgress";
import TemplatePreview from "@/components/invitation/TemplatePreview";
import { PLACEHOLDER_IMAGES } from "@/lib/placeholder-images";
import type { TemplateRow, WeddingRow, WeddingEventRow, GuestbookEntryRow } from "@/types/database";
import type { Culture, StorybookVariant } from "@/components/invitation/styles";
import { isInvitationLang } from "@/components/invitation/i18n";

interface PageProps {
  params: { slug: string };
  searchParams?: { embed?: string; scheme?: string; bare?: string; language?: string };
}

/**
 * DEMO ONLY: culture-matched sample hosts and families for the East Asian
 * collection, shown on public previews. Never persisted.
 */
const CULTURE_DEMO: Record<Culture, { names: [string, string]; families: { side1: string; side2: string } }> = {
  chinese: { names: ["Wei", "Lin"], families: { side1: "Mr. Zhang Hao · Mrs. Li Mei", side2: "Mr. Chen Jun · Mrs. Wang Fang" } },
  japanese: { names: ["Haruto", "Yui"], families: { side1: "Mr. & Mrs. Sato", side2: "Mr. & Mrs. Tanaka" } },
  korean: { names: ["Minjun", "Seoyeon"], families: { side1: "Kim Daeho · Park Mira", side2: "Lee Sungmin · Choi Jiwon" } },
  vietnamese: { names: ["Huy", "Thúy"], families: { side1: "Ông Nguyễn Viết Minh · Bà Trịnh Thị Lan", side2: "Ông Trịnh Văn Huy · Bà Ngô Mai Hoàn" } },
};

/** Approved Storybook demo copy, used only on public previews. Never persisted. */
const STORYBOOK_DEMO: Record<
  StorybookVariant,
  {
    names: [string, string];
    date: string;
    venue: string;
    address: string;
    note: string;
    place: string;
    dateNote?: string;
    dress: { text: string; colors: { label: string; hex: string }[] };
    events: { title: string; description: string; time: string }[];
  }
> = {
  ivory: {
    names: ["Amelia", "Theodore"],
    date: "2026-11-29",
    venue: "The Olive Garden",
    address: "Villa 12, Ecopark Riverside, Van Giang, Hung Yen, Hanoi",
    note: "A garden wedding at The Olive Garden",
    place: "Hanoi · Vietnam",
    dress: {
      text: "We would love you to dress in the colours of the garden — soft olive, warm ivory and quiet gold. Long dresses, linen suits and comfortable shoes for the lawn are all perfect.",
      colors: [
        { label: "Ivory", hex: "#E8DFC9" },
        { label: "Olive", hex: "#9AA07F" },
        { label: "Gold", hex: "#C3A97C" },
        { label: "Rose", hex: "#B99C93" },
        { label: "Sage", hex: "#7E8C7A" },
      ],
    },
    events: [
      { title: "Welcome", description: "Arrival, welcome drinks and seating in the garden.", time: "10:30" },
      { title: "The Ceremony", description: "Vows beneath the rose arch, followed by confetti.", time: "11:00" },
      { title: "Lunch", description: "A long table under the olive trees, with speeches and toasts.", time: "12:30" },
      { title: "Cake & Portraits", description: "Dessert, coffee and photographs with everyone we love.", time: "15:00" },
      { title: "Dinner & Dancing", description: "Sunset dinner, live music and the first dance.", time: "18:00" },
    ],
  },
  lakeside: {
    names: ["Elena", "James"],
    date: "2027-06-06",
    venue: "The Olive Terrace",
    address: "112 Wanaka–Mount Aspiring Road, Glendhu Bay, Wanaka 9305",
    note: "A lakeside wedding at The Olive Terrace",
    place: "Lake Wanaka · New Zealand",
    dress: {
      text: "Garden formal, in the colours of the lake — dusty blue, soft sage, hydrangea white and warm sand. Long dresses, light suits and shoes that are happy on grass.",
      colors: [
        { label: "Mist", hex: "#DCE4EA" },
        { label: "Hydrangea", hex: "#8FA9C4" },
        { label: "Lake", hex: "#47657C" },
        { label: "Sage", hex: "#A9B49B" },
        { label: "Sand", hex: "#D8C9AC" },
      ],
    },
    events: [
      { title: "Arrival", description: "Welcome drinks on the lake lawn and seating.", time: "14:30" },
      { title: "The Ceremony", description: "Vows beneath the pergola, followed by confetti.", time: "15:00" },
      { title: "Drinks & Canapés", description: "Portraits by the water while the sun is high.", time: "16:00" },
      { title: "Dinner", description: "A long table in the pavilion, with speeches and toasts.", time: "18:00" },
      { title: "Dancing", description: "First dance, live band and dessert under the stars.", time: "20:30" },
    ],
  },
  peony: {
    names: ["Mai", "Anh"],
    date: "2027-09-12",
    venue: "The Glasshouse",
    address: "15 Tran Hung Dao, Ward 3, Da Lat, Lam Dong · Vietnam",
    note: "A garden wedding at The Glasshouse",
    place: "Da Lat · Vietnam",
    dateNote: "The garden opens at 14:30. Please arrive with time to find your seat among the flowers.",
    dress: {
      text: "Garden formal, in the colours of a summer bouquet — blush, rose, sage and cream. Long dresses, light suits and shoes that are happy on grass.",
      colors: [
        { label: "Blush", hex: "#E8C7C4" },
        { label: "Rose", hex: "#B76E79" },
        { label: "Sage", hex: "#9AA88B" },
        { label: "Cream", hex: "#F3E7D8" },
        { label: "Gold", hex: "#C4A77B" },
      ],
    },
    events: [
      { title: "Arrival", description: "Welcome drinks in the garden and time to settle in.", time: "14:30" },
      { title: "The Ceremony", description: "Vows beneath the roses, followed by a shower of petals.", time: "15:00" },
      { title: "Garden Portraits", description: "Photographs among the flowers, with tea and canapés.", time: "16:00" },
      { title: "Dinner", description: "A long table in the glasshouse, with speeches and toasts.", time: "18:00" },
      { title: "Dancing", description: "The first dance, live music and dessert under the stars.", time: "20:00" },
    ],
  },
  lantern: {
    names: ["Linh", "Minh"],
    date: "2027-09-12",
    venue: "The Lantern Garden",
    address: "12 Nguyen Trai, Ward 1, Da Lat, Lam Dong · Vietnam",
    note: "An evening wedding at The Lantern Garden",
    place: "Da Lat · Vietnam",
    dateNote: "The lanterns are lit at dusk. Please arrive with time to find your seat among the flowers.",
    dress: {
      text: "Evening garden formal, lit by lanterns — deep green, amber, ivory and a touch of gold. Long dresses, dark suits and a light layer for after sunset.",
      colors: [
        { label: "Amber", hex: "#D8A45C" },
        { label: "Forest", hex: "#2F4A3A" },
        { label: "Ivory", hex: "#EFE5D2" },
        { label: "Sage", hex: "#9AA88B" },
        { label: "Gold", hex: "#C4A77B" },
      ],
    },
    events: [
      { title: "Lanterns & Welcome", description: "Warm drinks and lanterns at dusk in the garden.", time: "16:30" },
      { title: "The Ceremony", description: "Vows beneath the wreath as the lanterns are lit.", time: "17:30" },
      { title: "Garden Portraits", description: "Photographs in the last light, with tea and canapés.", time: "18:30" },
      { title: "Dinner", description: "A long table under the stars, with speeches and toasts.", time: "19:30" },
      { title: "Dancing", description: "The first dance, live music and dessert by lantern light.", time: "21:00" },
    ],
  },
};

/** Converts Storybook demo events into the shared event row shape. */
function storybookEvents(slug: StorybookVariant): WeddingEventRow[] {
  const demo = STORYBOOK_DEMO[slug];
  return demo.events.map((ev, i) => ({
    id: `sb-evt-${i + 1}`,
    wedding_id: "preview",
    title: ev.title,
    description: ev.description,
    location: "",
    start_time: `${demo.date}T${ev.time}:00`,
    end_time: `${demo.date}T${ev.time}:00`,
    icon: "heart",
    sort_order: i + 1,
    created_at: new Date().toISOString(),
  }));
}

/** Vietnamese weddings have separate receptions at the bride's and groom's family homes. */
const VIETNAMESE_EVENTS: WeddingEventRow[] = [
  {
    id: "evt-vi-1",
    wedding_id: "preview",
    title: "Tiệc cưới nhà trai",
    description: "Lễ thành hôn tại gia đình nhà trai.",
    location: "Nhà hàng Phương Đông, 123 Nguyễn Huệ, Q.1",
    start_time: "2027-06-15T10:00:00",
    end_time: "2027-06-15T13:00:00",
    icon: "heart",
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "evt-vi-2",
    wedding_id: "preview",
    title: "Tiệc cưới nhà gái",
    description: "Lễ vu quy tại gia đình nhà gái.",
    location: "Trung tâm Hội nghị Hoa Sen, 456 Lê Lợi, Q.3",
    start_time: "2027-06-14T10:00:00",
    end_time: "2027-06-14T13:00:00",
    icon: "heart",
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
];

/** Simple SVG that looks like a QR code (demo only — not scannable). */
const MOCK_QR = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 21 21"><rect width="21" height="21" fill="#fff"/><g fill="#222">${[
  [0,0,7,7],[0,1,1,1],[0,5,1,1],[1,0,1,1],[1,2,3,1],[1,6,1,1],[2,0,1,1],[2,2,1,1],[2,4,1,1],[2,6,1,1],
  [3,0,1,1],[3,2,1,1],[3,4,1,1],[3,6,1,1],[4,0,1,1],[4,2,3,1],[4,6,1,1],[5,0,1,1],[5,6,1,1],[6,0,7,1],
  [0,8,1,1],[2,8,1,1],[4,8,1,1],[6,8,1,1],[0,9,1,2],[1,10,2,1],[3,9,1,1],[4,10,1,1],[5,9,2,1],
  [8,0,1,1],[8,2,1,3],[8,6,1,1],[8,8,1,1],[8,10,1,1],[9,1,1,1],[9,4,1,1],[9,7,1,1],[9,9,1,2],
  [10,0,1,1],[10,3,1,2],[10,6,1,1],[10,8,2,1],[11,1,1,2],[11,5,1,1],[11,9,1,1],[12,0,1,1],[12,3,1,1],[12,6,1,1],[12,8,1,3],
  [14,0,7,1],[14,2,3,1],[14,6,1,1],[14,8,1,1],[14,10,1,1],
  [15,0,1,1],[15,6,1,1],[15,9,1,1],[16,0,1,1],[16,2,1,1],[16,4,1,1],[16,6,1,1],[16,8,1,1],[16,10,1,1],
  [17,0,1,1],[17,2,1,1],[17,4,1,1],[17,6,1,1],[17,9,1,1],
  [18,0,1,1],[18,2,3,1],[18,6,1,1],[18,8,1,1],[18,10,1,1],[19,0,1,1],[19,6,1,1],[19,9,1,2],[20,0,7,1]
].map(([y,x,w,h])=>`<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`).join("")}</g></svg>`)}`;

/** Placeholder wedding data used for the template preview. */
function buildMockWedding(template: TemplateRow): WeddingRow {
  // Celebration templates demo as a birthday/party so visitors see the right copy.
  const style = getInvitationStyle(template.slug);
  const type = template.event_types?.[0] ?? "wedding";
  const single = type === "birthday" || type === "party" || type === "social" || type === "baby-shower";
  const culture = style.culture;
  const demo = culture && !single ? CULTURE_DEMO[culture] : null;
  const storybook = style.storybook ? STORYBOOK_DEMO[style.storybook] : null;
  return {
    id: "preview",
    user_id: "preview",
    template_id: template.id,
    slug: "preview",
    partner1_name: storybook?.names[0] ?? demo?.names[0] ?? "Emma",
    partner2_name: single ? "" : storybook?.names[1] ?? demo?.names[1] ?? "James",
    event_type: type,
    event_title: storybook?.note ?? (type === "birthday" ? "Emma's 30th Birthday" : type === "party" ? "Summer Rooftop Party" : type === "social" ? "An Evening at the Grand Estate" : null),
    wedding_date: storybook?.date ?? "2027-06-15",
    venue_name: storybook?.venue ?? "The Grand Estate",
    venue_address: storybook?.address ?? "123 Garden Lane, Countryside",
    story_text: storybook
      ? ""
      : "We met on a rainy afternoon in a small coffee shop downtown. What started as a conversation over lattes became the greatest adventure of our lives. Three years, countless memories, and one very special question later — here we are, ready to begin our forever surrounded by the people we love most.",
    customization: {
      colors: {},
      fonts: {},
      sections: storybook
        ? { timeline: true, venue: true, rsvp: true, story: false, gallery: false, gift: false, blessings: false, reactions: false, blessingShower: false, music: false, families: false, guestbook: false }
        : { timeline: true, gallery: true, guestbook: true },
      galleryLayout: "masonry",
      ...(storybook
        ? { dressCode: storybook.dress, locationLabel: storybook.place, dateNote: storybook.dateNote }
        : {}),
      // DEMO ONLY: sample families + clearly fake gift accounts (shown on previews only).
      ...(demo
        ? {
            families: demo.families,
            ...(culture === "vietnamese" ? { language: "vi" as const } : {}),
            gift: {
              note: culture === "vietnamese"
                ? "Sự hiện diện của quý khách là món quà lớn nhất dành cho gia đình chúng tôi. Quý khách có thể gửi lời chúc phúc qua mã QR bên dưới."
                : "Your presence is our greatest gift. For those who wish to bless us, you may scan below.",
              accounts: [
                { label: `${demo.names[0]} · ${demo.names[1]}`, qrUrl: MOCK_QR },
              ],
            },
          }
        : {}),
    },
    is_published: true,
    guest_uploads_enabled: false,
    music_url: null,
    music_track_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

/** Placeholder timeline events for the preview. */
const MOCK_EVENTS: WeddingEventRow[] = [
  {
    id: "evt-1",
    wedding_id: "preview",
    title: "Ceremony",
    description: "Join us as we exchange our vows in the garden.",
    location: "The Grand Estate Chapel",
    start_time: "2027-06-15T15:00:00",
    end_time: "2027-06-15T16:00:00",
    icon: "heart",
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "evt-2",
    wedding_id: "preview",
    title: "Cocktail Hour",
    description: "Enjoy drinks and canapés on the terrace.",
    location: "Terrace Gardens",
    start_time: "2027-06-15T16:30:00",
    end_time: "2027-06-15T18:00:00",
    icon: "glass",
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "evt-3",
    wedding_id: "preview",
    title: "Reception & Dinner",
    description: "Celebrate with us in the grand ballroom.",
    location: "The Grand Ballroom",
    start_time: "2027-06-15T18:00:00",
    end_time: "2027-06-15T23:00:00",
    icon: "music",
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
];

/** DEMO ONLY — sample blessings so visitors can see the blessing wall. Never persisted. */
const DEMO_BLESSINGS: GuestbookEntryRow[] = [
  { id: "demo-b1", wedding_id: "preview", guest_name: "Grandma Rose", message: "My darlings, may your home always be full of laughter and your hearts full of each other. I love you both more than words.", rsvp_status: "attending", created_at: "2027-05-01T10:00:00Z" },
  { id: "demo-b2", wedding_id: "preview", guest_name: "Sophie & Liam", message: "So sad we can't be there — sending all our love from Lisbon! Dance the night away for us.", rsvp_status: "declined", created_at: "2027-04-28T18:30:00Z" },
  { id: "demo-b3", wedding_id: "preview", guest_name: "Daniel", message: "Best friends since kindergarten, and now I get to watch you marry the love of your life. Cheers to forever!", rsvp_status: "attending", created_at: "2027-04-20T09:15:00Z" },
  { id: "demo-b4", wedding_id: "preview", guest_name: "Aunt Clara", message: "Wishing you a lifetime of adventures together.", rsvp_status: "attending", created_at: "2027-04-12T12:00:00Z" },
];

/** SEO: each template demo is an indexable landing page (embedded modes are not). */
export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const supabase = createCookieClient();
  const { data } = await supabase.from("templates").select("name, description, slug").eq("slug", params.slug).maybeSingle();
  if (!data) return { title: "Template not found", robots: { index: false } };
  const label = LAYOUT_LABEL[getInvitationStyle(data.slug).hero];
  const title = `${data.name} — ${label} invitation template`;
  const description = `${data.description}. Live animated demo with RSVP, blessings and a photo album — try every colour scheme free.`;
  const embedded = searchParams?.embed === "1";
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(`/templates/${data.slug}`) },
    robots: embedded ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: { title, description, url: absoluteUrl(`/templates/${data.slug}`) },
  };
}

export default async function TemplatePreviewPage({ params, searchParams }: PageProps) {
  const embedded = searchParams?.embed === "1";
  const bare = embedded && searchParams?.bare === "1";
  const initialScheme = typeof searchParams?.scheme === "string" ? searchParams.scheme.slice(0, 40) : "original";
  const initialLanguage = isInvitationLang(searchParams?.language) ? searchParams.language : undefined;
  const supabase = createCookieClient();

  const { data: templateData } = await supabase
    .from("templates")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!templateData) notFound();

  const template = templateData as TemplateRow;
  const templateDef = getTemplate(template.slug);
  if (!templateDef) notFound();

  const mockWedding = buildMockWedding(template);
  const theme = resolveTheme(template.default_config, mockWedding.customization);
  const style = getInvitationStyle(template.slug);
  const culture = style.culture;
  const demoEvents = style.storybook ? storybookEvents(style.storybook) : culture === "vietnamese" ? VIETNAMESE_EVENTS : MOCK_EVENTS;

  return (
    <>
      {!bare && <ScrollProgress color={theme.colors.primary} />}

      <TemplatePreview
        templateName={template.name}
        templateSlug={template.slug}
        baseTheme={theme}
        wedding={mockWedding}
        events={demoEvents}
        blessings={DEMO_BLESSINGS}
        reactions={{ love: 128, bloom: 64, cheers: 42, sparkle: 37, rings: 21 }}
        // Poster heroes lead with a portrait of the couple (demo images only).
        photos={
          getInvitationStyle(template.slug).hero === "poster"
            ? [PLACEHOLDER_IMAGES.wedding[0], ...PLACEHOLDER_IMAGES.couple, ...PLACEHOLDER_IMAGES.wedding.slice(1, 3)]
            : [...PLACEHOLDER_IMAGES.couple, ...PLACEHOLDER_IMAGES.wedding.slice(0, 3)]
        }
        initialScheme={initialScheme}
        initialLanguage={initialLanguage}
        embedded={embedded}
        bare={bare}
      />

      {/* ── Bottom CTA (hidden when embedded in the dashboard) ── */}
      {!embedded && (
      <div className="relative z-10 flex flex-col items-center gap-4 border-t bg-white px-6 py-16 text-center">
        <p className="text-lg font-bold text-gray-900">Love what you see?</p>
        <p className="max-w-md text-sm text-gray-500">
          Create your free account and use the <strong>{template.name}</strong> design for your own wedding site.
          Pick any colour scheme — your colours, your story, your day.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href={`/signup?template=${template.slug}`}
            className="rounded-xl px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
            style={{ backgroundColor: theme.colors.primary }}
          >
            Use This Template — Free
          </Link>
          <Link
            href="/templates"
            className="rounded-xl border border-gray-200 px-8 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
          >
            Browse All Templates
          </Link>
        </div>
      </div>
      )}
    </>
  );
}
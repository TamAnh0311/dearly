/**
 * Guest-facing gallery page.
 * Fetches the published wedding by slug, loads the assigned template dynamically,
 * and renders approved photos via GalleryLayout with an optional guest upload form.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createCookieClient } from "@/lib/supabase/server";
import { EVENT_COPY, eventTypeOf, hostNames } from "@/lib/event-types";
import { getTemplate } from "@/components/templates/registry";
import { resolveTheme } from "@/components/templates/types";
import ScrollProgress from "@/components/ui/ScrollProgress";
import GuestUploadForm from "@/components/gallery/GuestUploadForm";
import FloatingNav from "@/components/ui/FloatingNav";
import type { WeddingRow, TemplateRow, GalleryPhotoRow } from "@/types/database";

interface PageProps {
  params: { slug: string };
}

/** Private gallery pages are never indexed; the title names the event. */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = createCookieClient();
  const { data } = await supabase
    .from("weddings")
    .select("event_title, partner1_name, partner2_name, event_type")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .maybeSingle();

  if (!data) return { title: "Photos not found", robots: { index: false, follow: false } };

  const copy = EVENT_COPY[eventTypeOf(data)];
  const title = `${data.event_title || hostNames(data)} — ${copy.label} photos`;
  return {
    title,
    description: `The shared photo album for ${data.event_title || hostNames(data)}.`,
    robots: { index: false, follow: false },
  };
}

export default async function GalleryPage({ params }: PageProps) {
  const supabase = createCookieClient();

  const { data: wedding } = await supabase
    .from("weddings")
    .select("*, template:templates(*)")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .single();

  if (!wedding) notFound();

  const weddingData = wedding as WeddingRow & { template: TemplateRow };

  if (!weddingData.customization?.sections?.gallery) notFound();

  const templateDef = getTemplate(weddingData.template.slug);
  if (!templateDef) notFound();

  const { data: photos } = await supabase
    .from("gallery_photos")
    .select("*")
    .eq("wedding_id", weddingData.id)
    .eq("status", "approved")
    .order("sort_order", { ascending: true });

  const components = await templateDef.load();
  const theme = resolveTheme(weddingData.template.default_config, weddingData.customization);
  const { GalleryLayout } = components;

  return (
    <>
      <ScrollProgress color={theme.colors.primary} />
      <GalleryLayout
        wedding={weddingData}
        photos={(photos ?? []) as GalleryPhotoRow[]}
        layout={weddingData.customization?.galleryLayout ?? "masonry"}
        theme={theme}
      />
      {weddingData.guest_uploads_enabled && (
        <div id="share" className="mx-auto max-w-xl scroll-mt-24 px-6 py-12">
          <GuestUploadForm weddingId={weddingData.id} theme={theme} />
        </div>
      )}
      <FloatingNav
        weddingSlug={params.slug}
        theme={theme}
        sections={weddingData.customization?.sections}
      />
    </>
  );
}

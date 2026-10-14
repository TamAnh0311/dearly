/**
 * Public card view page.
 * Fetches a published card by slug along with its template,
 * then renders CardView for a full-viewport display.
 */

import { notFound } from "next/navigation";
import { createCookieClient } from "@/lib/supabase/server";
import type { CardRow, CardTemplateRow } from "@/types/database";
import CardView from "@/components/cards/CardView";

interface PageProps {
  params: { slug: string };
}

export default async function CardPage({ params }: PageProps) {
  const supabase = createCookieClient();

  const { data: card } = await supabase
    .from("cards")
    .select("*, template:card_templates(*)")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .single();

  if (!card) notFound();

  const cardData = card as CardRow & { template: CardTemplateRow };

  return <CardView card={cardData} template={cardData.template} />;
}

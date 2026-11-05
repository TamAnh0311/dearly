/**
 * Public card view page.
 * Fetches a published card by slug along with its template,
 * then renders CardView for a full-viewport display.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createPublicClient } from "@/lib/supabase/public";
import type { CardRow, CardTemplateRow } from "@/types/database";
import CardView from "@/components/cards/CardView";

interface PageProps {
  params: { slug: string };
}

export const revalidate = 300;

/** Personal cards are private-by-default in search: never index a recipient's card. */
export const metadata: Metadata = {
  title: "A card from Dearly",
  robots: { index: false, follow: false },
};

export default async function CardPage({ params }: PageProps) {
  const supabase = createPublicClient();
  if (!supabase) notFound();

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

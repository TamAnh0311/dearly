/**
 * Public card templates gallery page.
 * Displays all available card templates grouped by category,
 * with filtering tabs and preview/signup CTAs.
 */

import { createCookieClient } from "@/lib/supabase/server";
import type { CardTemplateRow } from "@/types/database";
import CardGallery from "@/components/cards/CardGallery";

export const metadata = {
  title: "Send Beautiful Cards for Every Occasion",
  description:
    "Browse postcards, birthday invitations, event cards, thank-you notes, and holiday greetings. 13 stunning templates, fully customizable.",
};

export default async function CardsPage() {
  const supabase = createCookieClient();

  const { data: templates } = await supabase
    .from("card_templates")
    .select("*")
    .order("category", { ascending: true })
    .order("name", { ascending: true });

  return (
    <CardGallery templates={(templates ?? []) as CardTemplateRow[]} />
  );
}

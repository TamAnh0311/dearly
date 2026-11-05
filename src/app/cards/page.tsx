/**
 * Public card templates gallery page.
 * Displays all available card templates grouped by category,
 * with filtering tabs and preview/signup CTAs.
 */

import { createPublicClient } from "@/lib/supabase/public";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";
import type { CardTemplateRow } from "@/types/database";
import CardGallery from "@/components/cards/CardGallery";

export const revalidate = 3600;

const DESCRIPTION =
  "Browse postcards, birthday invitations, event cards, thank-you notes, and holiday greetings. Fully customisable and ready to send.";

export const metadata = {
  title: "Send Beautiful Cards for Every Occasion",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/cards") },
  openGraph: {
    title: `Send Beautiful Cards for Every Occasion | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: absoluteUrl("/cards"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Send Beautiful Cards for Every Occasion",
    description: DESCRIPTION,
  },
};

export default async function CardsPage() {
  const supabase = createPublicClient();
  const { data: templates } = supabase
    ? await supabase
        .from("card_templates")
        .select("*")
        .order("category", { ascending: true })
        .order("name", { ascending: true })
    : { data: null };

  return (
    <CardGallery templates={(templates ?? []) as CardTemplateRow[]} />
  );
}

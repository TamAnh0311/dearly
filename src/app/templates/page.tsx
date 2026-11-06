/**
 * Templates gallery — the template list is fetched on the server so search
 * engines see real names and links in the initial HTML. Filtering and search
 * stay client-side for instant interaction.
 */

import { createPublicClient } from "@/lib/supabase/public";
import type { TemplateRow } from "@/types/database";
import TemplatesGallery from "./TemplatesGallery";

export const revalidate = 3600;

export default async function TemplatesPage() {
  const supabase = createPublicClient();
  const { data } = supabase
    ? await supabase.from("templates").select("*").neq("hidden", true).order("name", { ascending: true })
    : { data: null };

  return <TemplatesGallery initialTemplates={(data ?? []) as TemplateRow[]} />;
}

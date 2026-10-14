/**
 * Public cute question page — fetches question data by slug and renders
 * the interactive CuteQuestionView client component.
 */

import { notFound } from "next/navigation";
import { createServiceRoleClient } from "@/lib/supabase/server";
import CuteQuestionView from "@/components/cute/CuteQuestionView";
import type { CuteQuestionRow } from "@/types/database";
import type { Metadata } from "next";

interface PageProps {
  params: { slug: string };
}

/**
 * Generates dynamic Open Graph metadata so shared links show the question text.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from("cute_questions")
    .select("question, sender_name")
    .eq("slug", params.slug)
    .single();

  if (!data) {
    return { title: "Question Not Found | Dearly" };
  }

  const title = data.sender_name
    ? `${data.sender_name} has a question for you!`
    : "Someone has a question for you!";

  return {
    title: `${title} | Dearly`,
    description: data.question,
    openGraph: {
      title,
      description: data.question,
    },
  };
}

/**
 * Fetches the cute question row by slug and renders the interactive view.
 * Returns 404 if no matching slug is found.
 */
export default async function CuteQuestionPage({ params }: PageProps) {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("cute_questions")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (error || !data) {
    notFound();
  }

  return <CuteQuestionView question={data as CuteQuestionRow} />;
}

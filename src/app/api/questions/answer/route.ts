/**
 * POST /api/questions/answer — marks a cute question as answered.
 *
 * Expects JSON body: { questionId: string }
 * Sets answered=true and answered_at=now() for the given question.
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  let body: { questionId?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { questionId } = body;

  if (!questionId || typeof questionId !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid questionId" },
      { status: 400 }
    );
  }

  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("cute_questions")
    .update({ answered: true, answered_at: new Date().toISOString() })
    .eq("id", questionId)
    .select("id, answered, answered_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  return NextResponse.json({ question: data }, { status: 200 });
}

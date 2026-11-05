/**
 * Account deletion API — permanently removes the authenticated user's
 * account and all associated data (weddings, events, RSVPs, photos,
 * guestbook entries, invitees, reactions).
 *
 * POST body: { confirm: "DELETE" }
 * Responses: 200 success, 400 missing confirmation, 401 unauthenticated, 500 error.
 *
 * Cascade order: child tables first (FK constraints), then weddings, then auth user.
 */

import { NextRequest, NextResponse } from "next/server";
import { createCookieClient, createServiceRoleClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (body.confirm !== "DELETE") {
    return NextResponse.json({ error: "Please confirm deletion by sending { confirm: \"DELETE\" }." }, { status: 400 });
  }

  // Authenticate via session cookie
  const supabase = createCookieClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const admin = createServiceRoleClient();

  try {
    // 1. Find all wedding IDs owned by this user
    const { data: weddings, error: wErr } = await admin
      .from("weddings")
      .select("id")
      .eq("user_id", user.id);

    if (wErr) throw new Error(`Failed to look up weddings: ${wErr.message}`);

    const weddingIds = (weddings ?? []).map((w) => w.id as string);

    if (weddingIds.length > 0) {
      // 2. Delete child tables that reference wedding_id (order doesn't matter with CASCADE, but explicit is safer)
      const childTables = [
        "wedding_reactions",
        "guestbook_entries",
        "gallery_photos",
        "wedding_events",
        "invitees",
        "rsvps",
      ];

      for (const table of childTables) {
        const { error } = await admin
          .from(table)
          .delete()
          .in("wedding_id", weddingIds);
        // Some tables may not exist or may have no rows — ignore "relation does not exist" errors
        if (error && !error.message.includes("does not exist")) {
          console.warn(`[account-delete] warning: failed to clear ${table}`, error.message);
        }
      }

      // 3. Delete the weddings themselves
      const { error: delWErr } = await admin
        .from("weddings")
        .delete()
        .eq("user_id", user.id);

      if (delWErr) throw new Error(`Failed to delete weddings: ${delWErr.message}`);
    }

    // 4. Delete the auth user (removes session, login, metadata)
    const { error: authErr } = await admin.auth.admin.deleteUser(user.id);
    if (authErr) throw new Error(`Failed to delete auth user: ${authErr.message}`);

    return NextResponse.json({ success: true, message: "Account and all data have been permanently deleted." });
  } catch (err) {
    console.error("[account-delete] error:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "Something went wrong while deleting your account. Please try again or contact support." },
      { status: 500 }
    );
  }
}

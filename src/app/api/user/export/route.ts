/**
 * GDPR data export — returns all user data as a JSON download.
 *
 * GET /api/user/export
 * Responses: 200 (JSON file), 401 unauthenticated, 500 error.
 *
 * Exports: account info, all events (weddings), RSVPs, guestbook entries,
 * invitees, gallery photos (metadata only, not binary), timeline events,
 * and reactions.
 */

import { NextResponse } from "next/server";
import { createCookieClient, createServiceRoleClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createCookieClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const admin = createServiceRoleClient();

  try {
    // Fetch all weddings owned by this user.
    const { data: weddings } = await admin
      .from("weddings")
      .select("*")
      .eq("user_id", user.id);
    const weddingIds = (weddings ?? []).map((w) => w.id as string);

    // Fetch all related data in parallel.
    const [rsvps, guestbook, invitees, photos, events, reactions] = await Promise.all([
      weddingIds.length > 0
        ? admin.from("rsvps").select("*").in("wedding_id", weddingIds).then((r) => r.data ?? [])
        : Promise.resolve([]),
      weddingIds.length > 0
        ? admin.from("guestbook_entries").select("*").in("wedding_id", weddingIds).then((r) => r.data ?? [])
        : Promise.resolve([]),
      weddingIds.length > 0
        ? admin.from("invitees").select("*").in("wedding_id", weddingIds).then((r) => r.data ?? [])
        : Promise.resolve([]),
      weddingIds.length > 0
        ? admin.from("gallery_photos").select("*").in("wedding_id", weddingIds).then((r) => r.data ?? [])
        : Promise.resolve([]),
      weddingIds.length > 0
        ? admin.from("wedding_events").select("*").in("wedding_id", weddingIds).then((r) => r.data ?? [])
        : Promise.resolve([]),
      weddingIds.length > 0
        ? admin.from("wedding_reactions").select("*").in("wedding_id", weddingIds).then((r) => r.data ?? [])
        : Promise.resolve([]),
    ]);

    const exportData = {
      exported_at: new Date().toISOString(),
      account: {
        id: user.id,
        email: user.email,
        display_name: user.user_metadata?.display_name ?? null,
        created_at: user.created_at,
      },
      events: weddings ?? [],
      rsvps,
      guestbook_entries: guestbook,
      invitees,
      gallery_photos: photos,
      timeline_events: events,
      reactions,
    };

    const json = JSON.stringify(exportData, null, 2);

    return new NextResponse(json, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="dearly-export-${new Date().toISOString().slice(0, 10)}.json"`,
      },
    });
  } catch (err) {
    console.error("[ERROR] data export failed", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "Something went wrong while exporting your data. Please try again." },
      { status: 500 }
    );
  }
}

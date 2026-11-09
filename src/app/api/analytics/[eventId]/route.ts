/**
 * Analytics dashboard data API — returns aggregated analytics data for a wedding event.
 *
 * GET /api/analytics/{eventId}
 * Responses: 200 { events, invitees, blessings, reactions, photos },
 *            401 unauthenticated, 404 not found or not owned, 500 on query failure.
 *
 * Access: event owner or admin (user.app_metadata.role === "admin").
 */

import { NextRequest, NextResponse } from "next/server";
import { createCookieClient, createServiceRoleClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
): Promise<NextResponse> {
  // 1. Authenticate caller via session cookie.
  const cookieClient = createCookieClient();
  const {
    data: { user },
  } = await cookieClient.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { eventId } = await params;
  const isAdmin = user.app_metadata?.role === "admin";
  const admin = createServiceRoleClient();

  // 2. Verify the wedding exists and the caller owns it (or is an admin).
  const { data: wedding } = await admin
    .from("weddings")
    .select("id, user_id")
    .eq("id", eventId)
    .maybeSingle();

  if (!wedding || (!isAdmin && wedding.user_id !== user.id)) {
    return NextResponse.json({ error: "Wedding not found." }, { status: 404 });
  }

  // 3. Fetch all dashboard data in parallel.
  try {
    const [
      analyticsResult,
      inviteesResult,
      blessingsResult,
      reactionsResult,
      photosResult,
    ] = await Promise.all([
      admin
        .from("analytics_events")
        .select("event, guest_token, country, city, ip_hash, created_at")
        .eq("wedding_id", eventId)
        .order("created_at", { ascending: true }),
      admin
        .from("invitees")
        .select("id, name, status, token")
        .eq("wedding_id", eventId),
      admin
        .from("guestbook_entries")
        .select("id, guest_name, created_at")
        .eq("wedding_id", eventId),
      admin
        .from("wedding_reactions")
        .select("kind, count")
        .eq("wedding_id", eventId),
      admin
        .from("gallery_photos")
        .select("id, uploaded_by, status")
        .eq("wedding_id", eventId),
    ]);

    // Surface the first query error encountered.
    const firstError =
      analyticsResult.error ||
      inviteesResult.error ||
      blessingsResult.error ||
      reactionsResult.error ||
      photosResult.error;

    if (firstError) {
      console.error("[ERROR] analytics dashboard query failed", {
        eventId,
        code: firstError.code,
        message: firstError.message,
      });
      return NextResponse.json(
        { error: "Failed to retrieve analytics data." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        events: analyticsResult.data ?? [],
        invitees: inviteesResult.data ?? [],
        blessings: blessingsResult.data ?? [],
        reactions: reactionsResult.data ?? [],
        photos: photosResult.data ?? [],
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[ERROR] analytics dashboard unexpected error", {
      eventId,
      error: err instanceof Error ? err.message : err,
    });
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

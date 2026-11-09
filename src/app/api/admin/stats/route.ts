/**
 * Admin — System Stats API
 *
 * GET /api/admin/stats    Extended system statistics:
 *   - totalUsers, totalEvents, publishedEvents
 *   - totalRsvps, totalPhotos, totalBlessings
 *   - activeUsers7d, activeUsers30d (distinct creators in that window)
 *
 * Requires admin role (checked via cookie session).
 */

import { NextResponse } from "next/server";
import { createCookieClient, createServiceRoleClient } from "@/lib/supabase/server";

/** Returns the authenticated admin user, or null if the caller is not an admin. */
async function requireAdmin() {
  const cookieClient = createCookieClient();
  const {
    data: { user },
  } = await cookieClient.auth.getUser();
  if (!user || user.app_metadata?.role !== "admin") return null;
  return user;
}

export async function GET(): Promise<NextResponse> {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const supabase = createServiceRoleClient();

  const now = new Date();
  const cutoff7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const cutoff30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [
    authList,
    { count: totalEvents },
    { count: publishedEvents },
    { count: totalRsvps },
    { count: totalPhotos },
    { count: totalBlessings },
    { data: activeUsers7dData },
    { data: activeUsers30dData },
  ] = await Promise.all([
    supabase.auth.admin.listUsers(),
    supabase.from("weddings").select("id", { count: "exact", head: true }),
    supabase.from("weddings").select("id", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("rsvps").select("id", { count: "exact", head: true }),
    supabase.from("gallery_photos").select("id", { count: "exact", head: true }),
    supabase.from("guestbook_entries").select("id", { count: "exact", head: true }),
    supabase
      .from("weddings")
      .select("user_id")
      .gte("created_at", cutoff7d),
    supabase
      .from("weddings")
      .select("user_id")
      .gte("created_at", cutoff30d),
  ]);

  const totalUsers = authList.data?.users?.length ?? 0;

  const activeUsers7d = new Set(
    (activeUsers7dData ?? []).map((r) => r.user_id as string).filter(Boolean)
  ).size;

  const activeUsers30d = new Set(
    (activeUsers30dData ?? []).map((r) => r.user_id as string).filter(Boolean)
  ).size;

  return NextResponse.json({
    totalUsers,
    totalEvents: totalEvents ?? 0,
    publishedEvents: publishedEvents ?? 0,
    totalRsvps: totalRsvps ?? 0,
    totalPhotos: totalPhotos ?? 0,
    totalBlessings: totalBlessings ?? 0,
    activeUsers7d,
    activeUsers30d,
  });
}

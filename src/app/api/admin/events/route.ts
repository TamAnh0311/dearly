/**
 * Admin — Event Management API
 *
 * GET  /api/admin/events          List all events with optional filters: type, status, page.
 * POST /api/admin/events          Unpublish or delete an event by ID.
 *
 * All endpoints require admin role (checked via cookie session).
 * All mutating actions are recorded in audit_logs.
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createCookieClient, createServiceRoleClient } from "@/lib/supabase/server";
import { clientIp } from "@/lib/rate-limit";

const PAGE_SIZE = 50;

/** Returns the authenticated admin user, or null if the caller is not an admin. */
async function requireAdmin() {
  const cookieClient = createCookieClient();
  const {
    data: { user },
  } = await cookieClient.auth.getUser();
  if (!user || user.app_metadata?.role !== "admin") return null;
  return user;
}

const ActionSchema = z.object({
  action: z.enum(["unpublish", "delete"]),
  eventId: z.string().uuid(),
});

export async function GET(request: NextRequest): Promise<NextResponse> {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const status = searchParams.get("status");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const offset = (page - 1) * PAGE_SIZE;

  const supabase = createServiceRoleClient();

  let query = supabase
    .from("weddings")
    .select("id, partner1_name, partner2_name, event_type, is_published, created_at, slug", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (type) {
    query = query.eq("event_type", type);
  }
  if (status === "published") {
    query = query.eq("is_published", true);
  } else if (status === "draft") {
    query = query.eq("is_published", false);
  }

  const { data: events, count, error } = await query;

  if (error) {
    console.error("[ERROR] admin list events failed", { code: error.code });
    return NextResponse.json({ error: "Failed to list events." }, { status: 500 });
  }

  // Enrich each event with its invitee count.
  const enriched = await Promise.all(
    (events ?? []).map(async (event) => {
      const { count: inviteeCount } = await supabase
        .from("invitees")
        .select("id", { count: "exact", head: true })
        .eq("wedding_id", event.id);

      return { ...event, inviteeCount: inviteeCount ?? 0 };
    })
  );

  return NextResponse.json({ events: enriched, total: count ?? 0, page, pageSize: PAGE_SIZE });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = ActionSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid action." },
      { status: 400 }
    );
  }

  const { action, eventId } = parsed.data;
  const supabase = createServiceRoleClient();
  const ip = clientIp(request);

  if (action === "unpublish") {
    const { error } = await supabase
      .from("weddings")
      .update({ is_published: false })
      .eq("id", eventId);
    if (error) {
      console.error("[ERROR] admin unpublish event failed", { eventId, msg: error.message });
      return NextResponse.json({ error: "Failed to unpublish event." }, { status: 500 });
    }
  } else if (action === "delete") {
    const { error } = await supabase.from("weddings").delete().eq("id", eventId);
    if (error) {
      console.error("[ERROR] admin delete event failed", { eventId, msg: error.message });
      return NextResponse.json({ error: "Failed to delete event." }, { status: 500 });
    }
  }

  await supabase.from("audit_logs").insert({
    actor_id: admin.id,
    action: `admin.event.${action}`,
    target_type: "event",
    target_id: eventId,
    ip_address: ip,
  });

  console.info("[INFO] admin event action", { action, eventId, actorId: admin.id });
  return NextResponse.json({ ok: true });
}

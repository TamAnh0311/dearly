/**
 * Admin — Audit Log API
 *
 * GET /api/admin/audit    Paginated audit log with optional filters: action, from, to, page.
 *                         Resolves actor email via auth admin API.
 *                         Returns { logs, total }.
 *
 * Requires admin role (checked via cookie session).
 */

import { NextRequest, NextResponse } from "next/server";
import { createCookieClient, createServiceRoleClient } from "@/lib/supabase/server";

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

export async function GET(request: NextRequest): Promise<NextResponse> {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const actionFilter = searchParams.get("action");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const offset = (page - 1) * PAGE_SIZE;

  const supabase = createServiceRoleClient();

  let query = supabase
    .from("audit_logs")
    .select("id, actor_id, action, target_type, target_id, ip_address, created_at", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (actionFilter) {
    query = query.eq("action", actionFilter);
  }
  if (from) {
    query = query.gte("created_at", from);
  }
  if (to) {
    query = query.lte("created_at", to);
  }

  const { data: rawLogs, count, error } = await query;

  if (error) {
    console.error("[ERROR] admin audit log query failed", { code: error.code });
    return NextResponse.json({ error: "Failed to retrieve audit logs." }, { status: 500 });
  }

  // Resolve actor emails in a single batch by collecting unique actor IDs.
  const actorIds = Array.from(new Set((rawLogs ?? []).map((l) => l.actor_id as string).filter(Boolean)));
  const actorEmailMap: Record<string, string | null> = {};

  await Promise.all(
    actorIds.map(async (actorId) => {
      const { data } = await supabase.auth.admin.getUserById(actorId);
      actorEmailMap[actorId] = data?.user?.email ?? null;
    })
  );

  const logs = (rawLogs ?? []).map((entry) => ({
    ...entry,
    actorEmail: actorEmailMap[entry.actor_id as string] ?? null,
  }));

  return NextResponse.json({ logs, total: count ?? 0 });
}

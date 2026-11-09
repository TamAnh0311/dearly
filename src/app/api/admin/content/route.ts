/**
 * Admin — Content Moderation API
 *
 * GET  /api/admin/content          List content across all events by type (photo | blessing | guestbook).
 * POST /api/admin/content          Bulk delete, approve, or reject content by IDs.
 *
 * All endpoints require admin role (checked via cookie session).
 * All mutating actions are recorded in audit_logs.
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createCookieClient, createServiceRoleClient } from "@/lib/supabase/server";
import { clientIp } from "@/lib/rate-limit";

const PAGE_SIZE = 50;

const CONTENT_TYPES = ["photo", "blessing", "guestbook"] as const;
type ContentType = (typeof CONTENT_TYPES)[number];

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
  action: z.enum(["delete", "approve", "reject"]),
  contentType: z.enum(CONTENT_TYPES),
  ids: z.array(z.string().uuid()).min(1, "At least one ID required"),
});

/** Map content type to its Supabase table and join columns. */
function tableConfig(type: ContentType) {
  switch (type) {
    case "photo":
      return {
        table: "gallery_photos",
        columns:
          "id, wedding_id, file_path, caption, status, created_at, weddings(partner1_name, partner2_name, slug)",
      };
    case "blessing":
    case "guestbook":
      return {
        table: "guestbook_entries",
        columns:
          "id, wedding_id, guest_name, message, created_at, weddings(partner1_name, partner2_name, slug)",
      };
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const rawType = searchParams.get("type");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const offset = (page - 1) * PAGE_SIZE;

  if (!rawType || !CONTENT_TYPES.includes(rawType as ContentType)) {
    return NextResponse.json(
      { error: `type must be one of: ${CONTENT_TYPES.join(", ")}` },
      { status: 400 }
    );
  }

  const type = rawType as ContentType;
  const supabase = createServiceRoleClient();
  const { table, columns } = tableConfig(type);

  const { data, count, error } = await supabase
    .from(table)
    .select(columns, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (error) {
    console.error("[ERROR] admin list content failed", { type, code: error.code });
    return NextResponse.json({ error: "Failed to list content." }, { status: 500 });
  }

  return NextResponse.json({ content: data, total: count ?? 0, page, pageSize: PAGE_SIZE });
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

  const { action, contentType, ids } = parsed.data;
  const supabase = createServiceRoleClient();
  const ip = clientIp(request);

  if (contentType === "photo") {
    if (action === "delete") {
      const { error } = await supabase.from("gallery_photos").delete().in("id", ids);
      if (error) {
        console.error("[ERROR] admin delete photos failed", { msg: error.message });
        return NextResponse.json({ error: "Failed to delete photos." }, { status: 500 });
      }
    } else if (action === "approve" || action === "reject") {
      const { error } = await supabase
        .from("gallery_photos")
        .update({ status: action === "approve" ? "approved" : "rejected" })
        .in("id", ids);
      if (error) {
        console.error("[ERROR] admin update photo status failed", { action, msg: error.message });
        return NextResponse.json({ error: "Failed to update photo status." }, { status: 500 });
      }
    }
  } else {
    // Blessings and guestbook entries only support deletion.
    if (action !== "delete") {
      return NextResponse.json(
        { error: `Action '${action}' is not supported for ${contentType}.` },
        { status: 400 }
      );
    }
    const { error } = await supabase.from("guestbook_entries").delete().in("id", ids);
    if (error) {
      console.error("[ERROR] admin delete guestbook entries failed", { contentType, msg: error.message });
      return NextResponse.json({ error: "Failed to delete content." }, { status: 500 });
    }
  }

  await supabase.from("audit_logs").insert({
    actor_id: admin.id,
    action: `admin.content.${action}`,
    target_type: contentType,
    target_id: ids.join(","),
    ip_address: ip,
  });

  console.info("[INFO] admin content action", { action, contentType, count: ids.length, actorId: admin.id });
  return NextResponse.json({ ok: true });
}

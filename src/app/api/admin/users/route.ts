/**
 * Admin — User Management API
 *
 * GET  /api/admin/users          List all users with event counts, role, and disabled status.
 * POST /api/admin/users          Disable, enable, or delete a user by ID.
 *
 * All endpoints require admin role (checked via cookie session).
 * All mutating actions are recorded in audit_logs.
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createCookieClient, createServiceRoleClient } from "@/lib/supabase/server";
import { clientIp } from "@/lib/rate-limit";

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
  action: z.enum(["disable", "enable", "delete"]),
  userId: z.string().uuid(),
});

export async function GET(): Promise<NextResponse> {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const supabase = createServiceRoleClient();

  const { data: authList, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error("[ERROR] admin listUsers failed", { code: listError.message });
    return NextResponse.json({ error: "Failed to list users." }, { status: 500 });
  }

  const users = await Promise.all(
    authList.users.map(async (u) => {
      const { count } = await supabase
        .from("weddings")
        .select("id", { count: "exact", head: true })
        .eq("user_id", u.id);

      return {
        id: u.id,
        email: u.email ?? null,
        displayName: (u.user_metadata?.full_name as string | undefined) ?? null,
        eventCount: count ?? 0,
        role: (u.app_metadata?.role as string | undefined) ?? "user",
        disabled: (u.app_metadata?.disabled as boolean | undefined) ?? false,
        createdAt: u.created_at,
      };
    })
  );

  return NextResponse.json({ users });
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

  const { action, userId } = parsed.data;
  const supabase = createServiceRoleClient();
  const ip = clientIp(request);

  if (action === "disable") {
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      app_metadata: { disabled: true },
    });
    if (error) {
      console.error("[ERROR] admin disable user failed", { userId, msg: error.message });
      return NextResponse.json({ error: "Failed to disable user." }, { status: 500 });
    }
  } else if (action === "enable") {
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      app_metadata: { disabled: false },
    });
    if (error) {
      console.error("[ERROR] admin enable user failed", { userId, msg: error.message });
      return NextResponse.json({ error: "Failed to enable user." }, { status: 500 });
    }
  } else if (action === "delete") {
    // Remove all weddings (and cascading child rows) before deleting the auth user.
    const { data: weddings } = await supabase
      .from("weddings")
      .select("id")
      .eq("user_id", userId);

    const weddingIds = (weddings ?? []).map((w) => w.id as string);
    if (weddingIds.length > 0) {
      const { error: weddingError } = await supabase
        .from("weddings")
        .delete()
        .in("id", weddingIds);
      if (weddingError) {
        console.error("[ERROR] admin delete user weddings failed", { userId, msg: weddingError.message });
        return NextResponse.json({ error: "Failed to delete user data." }, { status: 500 });
      }
    }

    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    if (authError) {
      console.error("[ERROR] admin delete user failed", { userId, msg: authError.message });
      return NextResponse.json({ error: "Failed to delete user." }, { status: 500 });
    }
  }

  await supabase.from("audit_logs").insert({
    actor_id: admin.id,
    action: `admin.user.${action}`,
    target_type: "user",
    target_id: userId,
    ip_address: ip,
  });

  console.info("[INFO] admin user action", { action, userId, actorId: admin.id });
  return NextResponse.json({ ok: true });
}

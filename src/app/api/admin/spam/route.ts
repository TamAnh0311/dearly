/**
 * Admin — Spam Rules API
 *
 * GET    /api/admin/spam    List all active spam rules.
 * POST   /api/admin/spam    Add a new spam rule (ip or domain).
 * DELETE /api/admin/spam    Remove a spam rule by ID.
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

const AddRuleSchema = z.object({
  ruleType: z.enum(["ip", "domain"]),
  value: z.string().trim().min(1, "Rule value is required").max(255),
});

const DeleteRuleSchema = z.object({
  id: z.string().uuid(),
});

export async function GET(): Promise<NextResponse> {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("spam_rules")
    .select("id, rule_type, value, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[ERROR] admin list spam rules failed", { code: error.code });
    return NextResponse.json({ error: "Failed to list spam rules." }, { status: 500 });
  }

  return NextResponse.json({ rules: data });
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

  const parsed = AddRuleSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid spam rule." },
      { status: 400 }
    );
  }

  const { ruleType, value } = parsed.data;
  const supabase = createServiceRoleClient();
  const ip = clientIp(request);

  const { data: rule, error } = await supabase
    .from("spam_rules")
    .insert({ rule_type: ruleType, value })
    .select()
    .single();

  if (error) {
    console.error("[ERROR] admin add spam rule failed", { ruleType, msg: error.message });
    return NextResponse.json({ error: "Failed to add spam rule." }, { status: 500 });
  }

  await supabase.from("audit_logs").insert({
    actor_id: admin.id,
    action: "admin.spam.add",
    target_type: "spam_rule",
    target_id: rule.id,
    ip_address: ip,
  });

  console.info("[INFO] admin spam rule added", { ruleType, actorId: admin.id });
  return NextResponse.json({ rule }, { status: 201 });
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
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

  const parsed = DeleteRuleSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid rule ID." },
      { status: 400 }
    );
  }

  const { id } = parsed.data;
  const supabase = createServiceRoleClient();
  const ip = clientIp(request);

  const { error } = await supabase.from("spam_rules").delete().eq("id", id);
  if (error) {
    console.error("[ERROR] admin delete spam rule failed", { id, msg: error.message });
    return NextResponse.json({ error: "Failed to delete spam rule." }, { status: 500 });
  }

  await supabase.from("audit_logs").insert({
    actor_id: admin.id,
    action: "admin.spam.remove",
    target_type: "spam_rule",
    target_id: id,
    ip_address: ip,
  });

  console.info("[INFO] admin spam rule removed", { id, actorId: admin.id });
  return NextResponse.json({ ok: true });
}

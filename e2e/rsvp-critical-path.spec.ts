/**
 * Critical-path E2E: a guest opens a published invitation and submits an RSVP.
 *
 * Uses the Supabase service role to create a temporary event with a known
 * template, runs the browser flow, then tears down. Skips gracefully when
 * env vars are missing (CI without secrets, local dev without keys).
 */

import { test, expect } from "@playwright/test";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/* ── Env guard ─────────────────────────────────────────────────────────────── */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const canRun = SUPABASE_URL.startsWith("http") && SERVICE_KEY.length > 20;

/* ── Helpers ───────────────────────────────────────────────────────────────── */

/** Returns a Supabase admin client for fixture setup/teardown. */
function admin(): SupabaseClient {
  return createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

const TEST_SLUG = `e2e-rsvp-${Date.now()}`;

/** Creates a minimal published event and returns its ID. */
async function seedEvent(sb: SupabaseClient): Promise<string> {
  // Pick any template (the first one).
  const { data: tpl } = await sb.from("templates").select("id").limit(1).single();
  if (!tpl) throw new Error("No templates in database — run seed first.");

  // Create a test user via admin API.
  const { data: authUser, error: authErr } = await sb.auth.admin.createUser({
    email: `e2e-${Date.now()}@test.dearly.app`,
    password: "E2eTestP@ss1!",
    email_confirm: true,
  });
  if (authErr) throw new Error(`Auth seed failed: ${authErr.message}`);
  const userId = authUser.user.id;

  // Insert a published event.
  const { data: event, error: evtErr } = await sb
    .from("weddings")
    .insert({
      user_id: userId,
      template_id: tpl.id,
      slug: TEST_SLUG,
      partner1_name: "E2E Test",
      partner2_name: "Runner",
      is_published: true,
    })
    .select("id")
    .single();
  if (evtErr) throw new Error(`Event seed failed: ${evtErr.message}`);
  return event.id;
}

/** Removes the test event and its auth user. */
async function teardown(sb: SupabaseClient, eventId: string) {
  for (const table of ["rsvps", "guestbook_entries"]) {
    await sb.from(table).delete().eq("wedding_id", eventId);
  }
  const { data: evt } = await sb.from("weddings").select("user_id").eq("id", eventId).single();
  await sb.from("weddings").delete().eq("id", eventId);
  if (evt?.user_id) await sb.auth.admin.deleteUser(evt.user_id);
}

/* ── Test ───────────────────────────────────────────────────────────────────── */

test.describe("RSVP critical path", () => {
  test.skip(!canRun, "Skipped: SUPABASE_URL or SERVICE_ROLE_KEY not configured");

  let eventId: string;
  let sb: SupabaseClient;

  test.beforeAll(async () => {
    sb = admin();
    eventId = await seedEvent(sb);
  });

  test.afterAll(async () => {
    if (eventId && sb) await teardown(sb, eventId);
  });

  test("guest can open invitation and submit RSVP", async ({ page }) => {
    test.setTimeout(60_000);

    // Navigate to the published invitation.
    await page.goto(`/${TEST_SLUG}`);

    // Wait for page content to load.
    await expect(page.locator("text=E2E Test").first()).toBeVisible({ timeout: 15_000 });

    // Dismiss the hero opening overlay if present (garden cover, envelope, etc.).
    // Click the cover's open button, or the skip button, or just click the overlay.
    const skipBtn = page.getByText(/skip|bỏ qua/i).first();
    const coverOpen = page.locator(".envelope-overlay, [class*='cover']").first();
    if (await skipBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await skipBtn.click();
    } else if (await coverOpen.isVisible({ timeout: 1_000 }).catch(() => false)) {
      await coverOpen.click();
    }

    // Wait for overlay to disappear.
    await expect(page.locator(".envelope-overlay")).toBeHidden({ timeout: 5_000 }).catch(() => {});

    // Scroll to the RSVP section.
    const rsvpSection = page.locator("#rsvp");
    await rsvpSection.scrollIntoViewIfNeeded({ timeout: 5_000 }).catch(() => {});

    // Click "I'll be there".
    const attendBtn = page.getByRole("button", { name: /be there|chắc chắn/i });
    await expect(attendBtn).toBeVisible({ timeout: 10_000 });
    await attendBtn.click();

    // Fill in name.
    const nameInput = page.getByPlaceholder(/olivia|nguyễn/i).first();
    await expect(nameInput).toBeVisible({ timeout: 5_000 });
    await nameInput.fill("Playwright Guest");

    // Scroll down to the submit button and click it.
    const submitBtn = page.getByRole("button", { name: /send my rsvp|gửi xác nhận/i }).first();
    await submitBtn.scrollIntoViewIfNeeded();
    await expect(submitBtn).toBeVisible({ timeout: 5_000 });
    await submitBtn.click();

    // Verify success state — "See you there!" or Vietnamese equivalent.
    await expect(page.getByText(/see you there|hẹn gặp/i).first()).toBeVisible({ timeout: 15_000 });
    await page.screenshot({ path: "test-results/rsvp-success.png" });

    // Give the API a moment to persist, then verify the RSVP in the database.
    await page.waitForTimeout(2_000);
    const { data: rsvps, error: rsvpErr } = await sb
      .from("rsvps")
      .select("guest_name, attending")
      .eq("wedding_id", eventId);

    // Log for debugging if this ever fails in CI.
    if (!rsvps?.length) {
      console.log("DB check: no RSVPs found for event", eventId, "error:", rsvpErr?.message);
    }
    expect(rsvps?.length).toBeGreaterThanOrEqual(1);
    const match = rsvps!.find((r) => r.guest_name === "Playwright Guest");
    expect(match).toBeTruthy();
    expect(match!.attending).toBe(true);
  });
});

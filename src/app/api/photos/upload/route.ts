/**
 * Photo upload API — couple uploads (owner, auto-approved) and guest uploads
 * (published events with guest uploads on; stored as "pending" for moderation).
 *
 * Enforces: file type/size, event ownership for couple uploads, guest-upload
 * permission, and the plan's photo limit (src/lib/plans.ts).
 *
 * Images are compressed server-side via sharp:
 *   - Full: max 2048px longest side, WebP quality 80
 *   - Thumbnail: max 400px longest side, WebP quality 70
 */

import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { createCookieClient, createServiceRoleClient } from "@/lib/supabase/server";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";
import { PLANS_ENABLED, planOf } from "@/lib/plans";
import type { WeddingRow } from "@/types/database";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES_PER_REQUEST = 10;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];
const UUID_RE = /^[0-9a-f-]{36}$/i;

export async function POST(request: NextRequest) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }
  const weddingId = String(formData.get("weddingId") ?? "");
  const guestNameRaw = formData.get("guestName");
  const guestName = typeof guestNameRaw === "string" && guestNameRaw.trim() ? guestNameRaw.trim().slice(0, 100) : null;
  const photos = formData.getAll("photos").filter((p): p is File => p instanceof File);

  if (!UUID_RE.test(weddingId)) return NextResponse.json({ error: "Missing or invalid event." }, { status: 400 });
  if (photos.length === 0) return NextResponse.json({ error: "No photos provided." }, { status: 400 });
  if (photos.length > MAX_FILES_PER_REQUEST) return NextResponse.json({ error: `Upload up to ${MAX_FILES_PER_REQUEST} photos at a time.` }, { status: 400 });
  for (const photo of photos) {
    if (!ALLOWED_TYPES.includes(photo.type)) return NextResponse.json({ error: `Unsupported file type: ${photo.type || "unknown"}. Use JPG, PNG, WebP or HEIC.` }, { status: 400 });
    if (photo.size > MAX_FILE_SIZE) return NextResponse.json({ error: `"${photo.name}" is larger than 10 MB.` }, { status: 400 });
  }

  const isGuestUpload = !!guestName;
  if (isGuestUpload && (await checkRateLimit(`upload:${clientIp(request)}:${weddingId}`, 5, 10 * 60 * 1000)) > 0) {
    return NextResponse.json({ error: "Too many uploads — please wait a few minutes and try again." }, { status: 429 });
  }

  const supabase = createServiceRoleClient();
  const { data: wedding } = await supabase
    .from("weddings")
    .select("id, user_id, is_published, guest_uploads_enabled, plan, plan_expires_at")
    .eq("id", weddingId)
    .maybeSingle();
  if (!wedding) return NextResponse.json({ error: "Event not found." }, { status: 404 });

  if (isGuestUpload) {
    if (!wedding.is_published || !wedding.guest_uploads_enabled) {
      return NextResponse.json({ error: "Photo sharing is turned off for this event." }, { status: 403 });
    }
  } else {
    // Couple upload: must be the signed-in owner (service role bypasses RLS).
    const { data: auth } = await createCookieClient().auth.getUser();
    if (!auth.user || auth.user.id !== wedding.user_id) {
      return NextResponse.json({ error: "Please sign in to upload to your event." }, { status: 401 });
    }
  }

  const plan = planOf(wedding as Pick<WeddingRow, "plan" | "plan_expires_at">);
  const { count } = await supabase
    .from("gallery_photos")
    .select("id", { count: "exact", head: true })
    .eq("wedding_id", weddingId)
    .neq("status", "rejected");
  if ((count ?? 0) + photos.length > plan.maxPhotos) {
    return NextResponse.json(
      {
        error: PLANS_ENABLED
          ? `This event has reached its ${plan.maxPhotos}-photo limit on the ${plan.name} plan. The host can upgrade to keep adding memories.`
          : `This album is full (${plan.maxPhotos} photos). Ask the host to remove a few, then try again.`,
        code: "PLAN_LIMIT",
      },
      { status: PLANS_ENABLED ? 402 : 409 }
    );
  }

  const uploadedPhotos: { url: string }[] = [];
  for (const photo of photos) {
    const timestamp = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const fullFileName = `${weddingId}/gallery/${timestamp}.webp`;
    const thumbFileName = `${weddingId}/gallery/${timestamp}-thumb.webp`;
    const rawBuffer = Buffer.from(await photo.arrayBuffer());

    // Compress to WebP — sharp handles JPEG, PNG, WebP and HEIC input.
    let compressedBuffer: Buffer;
    let thumbnailBuffer: Buffer;
    try {
      compressedBuffer = await sharp(rawBuffer)
        .resize(2048, 2048, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
      thumbnailBuffer = await sharp(rawBuffer)
        .resize(400, 400, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 70 })
        .toBuffer();
    } catch (_sharpErr) {
      console.error("[ERROR] image compression failed", { weddingId, name: photo.name });
      return NextResponse.json({ error: "Couldn't process that image. Please try a JPEG, PNG, WebP or HEIC file." }, { status: 422 });
    }

    const { error: uploadError } = await supabase.storage.from("wedding-photos").upload(fullFileName, compressedBuffer, { contentType: "image/webp", upsert: false });
    if (uploadError) {
      console.error("[ERROR] photo storage upload failed", { weddingId });
      return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
    }

    const { error: thumbError } = await supabase.storage.from("wedding-photos").upload(thumbFileName, thumbnailBuffer, { contentType: "image/webp", upsert: false });
    if (thumbError) {
      console.error("[ERROR] thumbnail storage upload failed", { weddingId });
      // Thumbnail failure is non-fatal — the full image was already stored.
    }

    const { data: urlData } = supabase.storage.from("wedding-photos").getPublicUrl(fullFileName);
    const { data: thumbUrlData } = supabase.storage.from("wedding-photos").getPublicUrl(thumbFileName);
    const { error: insertError } = await supabase.from("gallery_photos").insert({
      wedding_id: weddingId,
      url: urlData.publicUrl,
      thumbnail_url: thumbError ? null : thumbUrlData.publicUrl,
      uploaded_by: isGuestUpload ? "guest" : "couple",
      guest_name: guestName,
      status: isGuestUpload ? "pending" : "approved",
    });
    if (insertError) {
      console.error("[ERROR] photo row insert failed", { weddingId, code: insertError.code });
      return NextResponse.json({ error: "Couldn't save your photo. Please try again." }, { status: 500 });
    }
    uploadedPhotos.push({ url: urlData.publicUrl });
  }

  console.info("[INFO] photos uploaded", { weddingId, count: uploadedPhotos.length, guest: isGuestUpload });
  return NextResponse.json({ photos: uploadedPhotos }, { status: 201 });
}

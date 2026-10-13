/**
 * Photo upload API route — handles both couple and guest uploads.
 * Guest uploads stored with status "pending" for moderation.
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const weddingId = formData.get("weddingId") as string;
  const guestName = formData.get("guestName") as string | null;
  const photos = formData.getAll("photos") as File[];

  if (!weddingId) return NextResponse.json({ error: "Missing weddingId" }, { status: 400 });
  if (photos.length === 0) return NextResponse.json({ error: "No photos provided" }, { status: 400 });

  for (const photo of photos) {
    if (!ALLOWED_TYPES.includes(photo.type))
      return NextResponse.json({ error: `Invalid file type: ${photo.type}` }, { status: 400 });
    if (photo.size > MAX_FILE_SIZE)
      return NextResponse.json({ error: `File too large: ${photo.name}. Max 10MB.` }, { status: 400 });
  }

  const supabase = createServiceRoleClient();
  const isGuestUpload = !!guestName;
  const uploadedPhotos: { url: string }[] = [];

  for (const photo of photos) {
    const ext = photo.name.split(".").pop() ?? "jpg";
    const fileName = `${weddingId}/gallery/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
    const buffer = Buffer.from(await photo.arrayBuffer());

    const { error: uploadError } = await supabase.storage.from("wedding-photos").upload(fileName, buffer, { contentType: photo.type, upsert: false });
    if (uploadError) return NextResponse.json({ error: `Upload failed: ${uploadError.message}` }, { status: 500 });

    const { data: urlData } = supabase.storage.from("wedding-photos").getPublicUrl(fileName);

    const { error: insertError } = await supabase.from("gallery_photos").insert({
      wedding_id: weddingId, url: urlData.publicUrl,
      uploaded_by: isGuestUpload ? "guest" : "couple",
      guest_name: guestName, status: isGuestUpload ? "pending" : "approved",
    });
    if (insertError) return NextResponse.json({ error: `Database error: ${insertError.message}` }, { status: 500 });

    uploadedPhotos.push({ url: urlData.publicUrl });
  }

  return NextResponse.json({ photos: uploadedPhotos }, { status: 201 });
}

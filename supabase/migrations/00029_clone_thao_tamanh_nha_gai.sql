-- Clone thao-tamanh invitation for nhà gái (bride's side).
-- Vietnamese weddings traditionally have two ceremonies at different venues.

DO $$
DECLARE
  src_id uuid;
  new_id uuid := gen_random_uuid();
BEGIN
  SELECT id INTO src_id FROM weddings WHERE slug = 'thao-tamanh';
  IF src_id IS NULL THEN
    RAISE EXCEPTION 'Source wedding thao-tamanh not found';
  END IF;

  -- Clone the wedding row with different slug and venue
  INSERT INTO weddings (
    id, user_id, template_id, slug,
    partner1_name, partner2_name, wedding_date,
    venue_name, venue_address,
    story_text, customization, music_url, music_track_id,
    is_published, guest_uploads_enabled,
    event_type, event_title, timezone, plan, plan_expires_at,
    created_at, updated_at
  )
  SELECT
    new_id, user_id, template_id, 'thao-tamanh-nha-gai',
    partner1_name, partner2_name, wedding_date,
    'Tư gia nhà gái',
    'Số nhà 29 Trần Phú, xã Thường Tín, Hà Nội',
    story_text, customization, music_url, music_track_id,
    is_published, guest_uploads_enabled,
    event_type, event_title, timezone, plan, plan_expires_at,
    now(), now()
  FROM weddings
  WHERE id = src_id;

  -- Clone wedding events (timeline)
  INSERT INTO wedding_events (
    id, wedding_id, title, description, location,
    start_time, end_time, icon, sort_order, created_at
  )
  SELECT
    gen_random_uuid(), new_id, title, description, location,
    start_time, end_time, icon, sort_order, now()
  FROM wedding_events
  WHERE wedding_id = src_id
  ORDER BY sort_order;

  -- Clone gallery photos (couple uploads only)
  INSERT INTO gallery_photos (
    id, wedding_id, url, thumbnail_url, caption,
    album, sort_order, uploaded_by, status, created_at
  )
  SELECT
    gen_random_uuid(), new_id, url, thumbnail_url, caption,
    album, sort_order, uploaded_by, status, now()
  FROM gallery_photos
  WHERE wedding_id = src_id AND uploaded_by = 'couple'
  ORDER BY sort_order;
END $$;

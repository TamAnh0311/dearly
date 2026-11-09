-- Migration: missing features
-- Adds audit_logs, spam_rules, extends analytics_events / invitees / weddings /
-- gallery_photos, and creates the gift-qr-images storage bucket.
--
-- Rollback:
--   DROP TABLE IF EXISTS public.audit_logs;
--   DROP TABLE IF EXISTS public.spam_rules;
--   ALTER TABLE public.analytics_events
--     DROP COLUMN IF EXISTS wedding_id,
--     DROP COLUMN IF EXISTS guest_token,
--     DROP COLUMN IF EXISTS country,
--     DROP COLUMN IF EXISTS city,
--     DROP COLUMN IF EXISTS ip_hash;
--   ALTER TABLE public.invitees
--     DROP COLUMN IF EXISTS dietary_restrictions,
--     DROP COLUMN IF EXISTS song_request,
--     DROP COLUMN IF EXISTS last_reminder_sent;
--   ALTER TABLE public.weddings
--     DROP COLUMN IF EXISTS reminder_days,
--     DROP COLUMN IF EXISTS weekly_digest_enabled,
--     DROP COLUMN IF EXISTS thank_you_sent;
--   ALTER TABLE public.gallery_photos
--     DROP COLUMN IF EXISTS media_type,
--     DROP COLUMN IF EXISTS video_url;
--   DELETE FROM storage.buckets WHERE id = 'gift-qr-images';

-- ─── 1. audit_logs ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id    UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  action      TEXT        NOT NULL,
  target_type TEXT        NOT NULL
    CHECK (target_type IN ('user', 'event', 'photo', 'blessing', 'guestbook', 'ip', 'domain')),
  target_id   TEXT        NOT NULL,
  metadata    JSONB       NOT NULL DEFAULT '{}',
  ip_address  INET,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.audit_logs IS 'Append-only log of admin actions. No UPDATE or DELETE permitted via RLS.';

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at
  ON public.audit_logs (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id
  ON public.audit_logs (actor_id)
  WHERE actor_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_audit_logs_action_created_at
  ON public.audit_logs (action, created_at DESC);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read audit logs"
  ON public.audit_logs FOR SELECT
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can insert audit logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ─── 2. spam_rules ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.spam_rules (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_type  TEXT        NOT NULL CHECK (rule_type IN ('ip', 'domain')),
  value      TEXT        NOT NULL,
  created_by UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (rule_type, value)
);

COMMENT ON TABLE public.spam_rules IS 'Blocked IP addresses and banned e-mail domains managed by admins.';

ALTER TABLE public.spam_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage spam rules"
  ON public.spam_rules FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ─── 3. analytics_events — invitation engagement columns ─────────────────────

ALTER TABLE public.analytics_events
  ADD COLUMN IF NOT EXISTS wedding_id  UUID REFERENCES public.weddings(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS guest_token TEXT,
  ADD COLUMN IF NOT EXISTS country     TEXT,
  ADD COLUMN IF NOT EXISTS city        TEXT,
  ADD COLUMN IF NOT EXISTS ip_hash     TEXT;

CREATE INDEX IF NOT EXISTS idx_analytics_events_wedding_event
  ON public.analytics_events (wedding_id, event, created_at DESC)
  WHERE wedding_id IS NOT NULL;

-- Wedding owners can read their own analytics events.
CREATE POLICY "Wedding owners can read their analytics"
  ON public.analytics_events FOR SELECT
  USING (
    wedding_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.weddings
      WHERE weddings.id = analytics_events.wedding_id
        AND weddings.user_id = auth.uid()
    )
  );

-- ─── 4. invitees — extra RSVP fields ─────────────────────────────────────────

ALTER TABLE public.invitees
  ADD COLUMN IF NOT EXISTS dietary_restrictions TEXT,
  ADD COLUMN IF NOT EXISTS song_request          TEXT,
  ADD COLUMN IF NOT EXISTS last_reminder_sent    TIMESTAMPTZ;

-- ─── 5. weddings — reminder and digest settings ───────────────────────────────

ALTER TABLE public.weddings
  ADD COLUMN IF NOT EXISTS reminder_days          INTEGER[] NOT NULL DEFAULT '{7}',
  ADD COLUMN IF NOT EXISTS weekly_digest_enabled  BOOLEAN   NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS thank_you_sent         BOOLEAN   NOT NULL DEFAULT false;

-- ─── 6. gallery_photos — video support ───────────────────────────────────────

ALTER TABLE public.gallery_photos
  ADD COLUMN IF NOT EXISTS media_type TEXT NOT NULL DEFAULT 'image'
    CHECK (media_type IN ('image', 'video')),
  ADD COLUMN IF NOT EXISTS video_url  TEXT;

-- ─── 7. gift-qr-images storage bucket ────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public)
  VALUES ('gift-qr-images', 'gift-qr-images', true)
  ON CONFLICT DO NOTHING;

-- Anyone can view QR images (public bucket).
CREATE POLICY "Anyone can view gift QR images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gift-qr-images');

-- Authenticated users can upload QR images.
CREATE POLICY "Authenticated users can upload gift QR images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'gift-qr-images'
    AND auth.role() = 'authenticated'
  );

-- Users can delete only files inside their own folder (folder name = user UUID).
CREATE POLICY "Users can delete their own gift QR images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'gift-qr-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

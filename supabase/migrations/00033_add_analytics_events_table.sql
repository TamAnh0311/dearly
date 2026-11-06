-- Lightweight funnel analytics table. Stores anonymous event counts so we can
-- see where users drop off in the onboarding wizard and which features are used.
-- No PII — no names, emails, tokens or invitation content.

CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  event TEXT NOT NULL,
  properties JSONB DEFAULT '{}',
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_analytics_events_event ON analytics_events (event, created_at DESC);
CREATE INDEX idx_analytics_events_user ON analytics_events (user_id) WHERE user_id IS NOT NULL;

-- RLS: users can insert their own events, admins can read all.
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own events"
  ON analytics_events FOR INSERT
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Admins can read all events"
  ON analytics_events FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin' OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

ALTER TABLE invitees ADD COLUMN IF NOT EXISTS table_number INTEGER;
CREATE INDEX IF NOT EXISTS idx_invitees_table ON invitees (wedding_id, table_number) WHERE table_number IS NOT NULL;

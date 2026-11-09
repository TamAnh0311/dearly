-- Enable realtime replication for blessing and RSVP tables.
-- SELECT policies already exist (see 00006_create_rls_policies.sql and
-- 00015_create_rsvps_and_reactions.sql); we only need to register the tables
-- with the supabase_realtime publication so row-level changes are broadcast.

ALTER PUBLICATION supabase_realtime ADD TABLE guestbook_entries;
ALTER PUBLICATION supabase_realtime ADD TABLE rsvps;

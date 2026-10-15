-- Add timezone column so invitation times display in the event's local time,
-- regardless of which timezone the guest views from.
ALTER TABLE weddings ADD COLUMN timezone TEXT DEFAULT NULL;

COMMENT ON COLUMN weddings.timezone IS 'IANA timezone of the event venue, e.g. Asia/Ho_Chi_Minh. Auto-detected from the creator browser; used to format schedule times on the invitation.';

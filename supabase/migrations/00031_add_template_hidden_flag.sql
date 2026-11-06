-- Adds a hidden flag to templates so near-duplicates can be removed from the
-- gallery without breaking existing invitations that use them.

ALTER TABLE templates ADD COLUMN IF NOT EXISTS hidden BOOLEAN NOT NULL DEFAULT false;

-- Mark near-duplicate templates as hidden:
-- luxe ≈ eternal (same arch+deco+gold-dust, different music only)
-- neon-night: misleading name, editorial+gold ≈ noir + confetti
-- seaside ≈ sunset (both split+wave+rounded, sunset has petals)
-- soiree ≈ eternal (arch corners instead of sharp, same deco+bokeh)
UPDATE templates SET hidden = true WHERE slug IN ('luxe', 'neon-night', 'seaside', 'soiree');

-- Supabase-backed rate limiting replaces the in-memory Map that resets on
-- every serverless cold start and is isolated per function instance.

CREATE TABLE rate_limit_hits (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  key TEXT NOT NULL,
  hit_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_rate_limit_hits_lookup ON rate_limit_hits (key, hit_at DESC);

-- Atomically checks and records a rate-limit hit.
-- Returns 0 when the request is allowed, or the seconds the caller must wait.
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_key TEXT,
  p_limit INT,
  p_window_ms INT
) RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
  v_window  INTERVAL  := make_interval(secs => p_window_ms / 1000.0);
  v_cutoff  TIMESTAMPTZ := now() - v_window;
  v_count   INT;
  v_oldest  TIMESTAMPTZ;
BEGIN
  -- Serialize concurrent checks for the same key to prevent race conditions
  PERFORM pg_advisory_xact_lock(hashtext(p_key));

  -- Prune expired hits for this key
  DELETE FROM rate_limit_hits WHERE key = p_key AND hit_at < v_cutoff;

  -- Count remaining hits in the window
  SELECT count(*), min(hit_at) INTO v_count, v_oldest
  FROM rate_limit_hits
  WHERE key = p_key AND hit_at >= v_cutoff;

  IF v_count >= p_limit THEN
    RETURN GREATEST(1, CEIL(EXTRACT(EPOCH FROM (v_oldest + v_window - now()))));
  END IF;

  -- Under the limit — record the hit
  INSERT INTO rate_limit_hits (key, hit_at) VALUES (p_key, now());

  -- Probabilistic global cleanup (~1 in 100 calls)
  IF random() < 0.01 THEN
    DELETE FROM rate_limit_hits WHERE hit_at < now() - INTERVAL '1 hour';
  END IF;

  RETURN 0;
END;
$$;

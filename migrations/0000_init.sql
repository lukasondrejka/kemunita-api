-- 0000 Initial migration

CREATE TABLE IF NOT EXISTS calendar_cache (
  id INTEGER PRIMARY KEY,
  data TEXT NOT NULL,
  timestamp INTEGER NOT NULL
);

INSERT INTO calendar_cache (id, data, timestamp)
  SELECT 0, '{}', 0
  WHERE NOT EXISTS (
    SELECT 1 FROM calendar_cache WHERE id = 0
  );
export const schemaSQL = `
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_movies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_favorite BOOLEAN NOT NULL DEFAULT false,
  title TEXT NOT NULL,
  year TEXT,
  runtime TEXT,
  genre TEXT,
  director TEXT,
  poster TEXT,
  omdb_id TEXT,
  source TEXT CHECK (source IN ('omdb','custom')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Idempotent column ensures for forward-compat additions
DO $$ BEGIN
  ALTER TABLE user_movies ADD COLUMN IF NOT EXISTS poster TEXT;
  ALTER TABLE user_movies ADD COLUMN IF NOT EXISTS omdb_id TEXT;
  BEGIN
    ALTER TABLE user_movies ADD COLUMN IF NOT EXISTS source TEXT;
  EXCEPTION WHEN others THEN NULL; END;
  -- Enforce source constraint if column exists without check
  BEGIN
    ALTER TABLE user_movies
      ADD CONSTRAINT user_movies_source_check CHECK (source IN ('omdb','custom'));
  EXCEPTION WHEN others THEN NULL; END;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_movies_user_title_unique ON user_movies (user_id, lower(title));
`;

export const schemaSQL = `
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS movies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  omdb_id TEXT UNIQUE,
  source TEXT NOT NULL CHECK (source IN ('omdb','custom')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_movies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  is_favorite BOOLEAN NOT NULL DEFAULT false,
  title TEXT NOT NULL,
  year TEXT,
  runtime TEXT,
  genre TEXT,
  director TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_movies_user_title_unique ON user_movies (user_id, lower(title));
`;

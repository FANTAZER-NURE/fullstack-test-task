# Vision

This document defines a minimal, backend-first technical vision for the Movies App, aligned with KISS, DRY, YAGNI, and MVP principles.

## Principles

- Build only what the assignment requires; defer extras.
- Prefer clarity and maintainability over cleverness.
- Small, composable modules; co-located tests with Vitest.

## Scope

- Backend first: PostgreSQL schema, Express 5 API, OMDB proxy, validations, unit tests.
- Frontend later: React 19 SPA with Redux/RTK, RHF, Router; you will handle most FE manually.

## Data Model (PostgreSQL)

- users
  - id (uuid, pk)
  - username (text, unique, not null)
  - created_at (timestamptz, default now())
- movies
  - id (uuid, pk)
  - title (text, not null, unique per user? see user_movies)
  - year (text)
  - runtime (text)
  - genre (text)
  - director (text)
  - source (enum: 'omdb' | 'custom')
  - created_at (timestamptz)
- user_movies (actions per user)
  - id (uuid, pk)
  - user_id (uuid, fk users.id)
  - movie_id (uuid, fk movies.id)
  - is_favorite (boolean, default false)
  - title (text, not null) -- user-specific editable snapshot
  - year (text)
  - runtime (text)
  - genre (text)
  - director (text)
  - unique(username-to-title): enforce "no duplicate title per user"

Notes:

- We store OMDB results in `movies` as immutable records (dedup by OMDB imdbID mapped to uuid) and track user-specific edits/favorites in `user_movies`.
- Custom-added movies are inserted into `movies` with source='custom' and get a `user_movies` row for the creating user.

## API (Express 5)

Base: `/api`

- Auth-lite (username prompt):

  - POST `/session/ensure-user` → { username } ⇒ ensures user exists; returns `{ userId, username }`.

- Search & discovery (OMDB via server):

  - GET `/search?query=...&page=...` → proxies OMDB search, normalizes fields.
  - GET `/movies/:omdbId` → fetches OMDB details via server.

- User movie items (persisted per user):
  - GET `/users/:userId/movies` → list user items (supports `?favorite=bool&sort=field&order=asc|desc`).
  - POST `/users/:userId/movies` → add custom or adopt OMDB movie; validates unique title per user.
  - PATCH `/users/:userId/movies/:id` → edit fields; validate schema.
  - DELETE `/users/:userId/movies/:id` → delete.
  - POST `/users/:userId/movies/:id/favorite` → toggle favorite.

Validation

- Use zod/valibot (server) or a lightweight schema to enforce:
  - strings: non-empty, min 3 chars
  - year/date: valid year or ISO date (per assignment, treat Year as string with simple regex)

Title Normalization

- Utility to format titles: capitalize words, remove non-English letters.
- Applied on create/edit before persistence and response formatting.

## OMDB Integration

- Server-only: store `OMDB_API_KEY` in env.
- Minimal client → server → OMDB flow; handle rate-limit and error mapping.
- Cache: YAGNI for MVP; rely on OMDB directly. Optional simple in-memory LRU if needed.

## Testing (Vitest)

- Co-located unit tests:
  - Utilities: title normalization, validators, mappers.
  - Reducers/selectors (later on FE).
  - Handlers/services: user creation, duplicate-title check, favorite toggle.

## Deployment

- Server: Render.com free tier, Node 22.
- DB: Render.com PostgreSQL free tier.
- Client: Netlify/Render static hosting.
- Provide .env.sample and README with run/deploy steps.

## Project Structure & Monorepo

- Single git repo (monorepo) with npm workspaces.
- Separate deploys per sub-app; hosts support setting a subdirectory as root.

Layout

```
/ (git repo root)
  package.json            // npm workspaces (private)
  tsconfig.base.json      // shared compilerOptions
  .gitignore
  README.md
  docs/
    idea.md
    vision.md
  backend/
    package.json
    tsconfig.json         // extends ../tsconfig.base.json
    src/
    test/
    .env.example
  frontend/
    package.json
    tsconfig.json         // extends ../tsconfig.base.json
    vite.config.ts
    src/
    test/
```

Deployment Configuration

- Backend (Render Web Service)
  - Root directory: `backend`
  - Build command: `npm ci && npm run build`
  - Start command: `npm run start`
- Frontend (Render Static/Netlify)
  - Root/Base directory: `frontend`
  - Build command: `npm ci && npm run build`
  - Publish directory: `dist`
- Database: Render PostgreSQL service

## Open Items for Alignment

- Confirm exact Year validation (strict date vs year string).
- Confirm UI flow for username prompt modal.
- Confirm we skip caching for MVP.

# App Idea

This document captures the core idea for the Movies App assignment and defines the MVP scope per the brief.

## Problem Statement

Users want to quickly search, browse, and manage movies with a clean, responsive UI and simple favorites/CRUD flows. The app should proxy OMDB calls via a backend and persist user-specific movie actions in PostgreSQL without full authentication.

## Target Users & Personas

- Primary user(s): Movie enthusiasts and casual users searching titles; users maintaining a personal list of favorites and custom entries.
- Secondary stakeholders: Hiring reviewers evaluating solution quality and tradeoffs.
- Key environments: Desktop-first SPA; responsive for mobile browsers.

## Core Value Proposition

A minimal, well-structured React 19 SPA for discovering movies (via OMDB) and managing favorites/custom entries with polished UX and maintainable, tested code.

## Must‑Have MVP Capabilities (KISS)

- Initial load fetches and displays a list of movies (AJAX via backend proxy to OMDB).
- Search bar to query movie titles and show results in the list.
- Favorites filter with a star toggle: show only favorites; toggling off returns to the last results.
- Add movie: plus-button opens a modal with a validated form (Title, Year, Runtime, Genre, Director). Prevent duplicate titles and show: "A movie with the same name already exists."
- Edit movie: button opens a modal pre-filled with current details; Save/Cancel; validated.
- Delete movie: confirmation modal (Cancel/OK); OK deletes the movie.
- Each list item shows edit, delete, and star buttons; clicking an item navigates to a movie details page.
- Title formatting: capitalize each word; remove non-English letters (e.g., "@@THIS is a moviE!!" -> "This Is A Movie").
- Responsive design using media queries and flexbox/grid with styled-components or SCSS modules.
- State management with Redux/RTK; forms with React Hook Form 7; routing with React Router 7.
- Co-located unit tests with Vitest for key modules.

## Success Criteria (MVP)

- All functional points above are implemented with a clean, responsive UI.
- App runs locally and can be deployed (client as static build; server on a free host) with clear instructions.
- Unit tests cover critical reducers, hooks, utilities, and components.

## Constraints & Assumptions

- Tech stack is mandated: React 19 (Vite), TypeScript, Redux/RTK, React Router 7, Styled Components/SCSS Modules, React Hook Form 7, Node.js 22 + Express 5, PostgreSQL, Vitest.
- All communication with OMDB is via an Express backend (no direct browser calls).
- PostgreSQL stores user-specific movie actions (add/edit/delete/favorite) keyed by a simple username prompt. Use `pg` for DB access.
- Hosting can be on Render.com (or equivalent) for server and DB; client on Render/GitHub Pages/Netlify.
- No `window.alert()`/`window.prompt()` for UI; use custom modals instead.

## Competitive/Alternative Solutions (Brief)

Many movie apps exist; this implementation focuses on assignment compliance, clarity, maintainability, and ease of review/run.

## Open Questions

- OMDB API key management and rate limits strategy.
- Behavior when editing/deleting records sourced from OMDB vs custom-created entries.
- Exact username-prompt UX (modal behavior and persistence in client state).

## Appendix

- Assignment reference: `https://tin-sky-14c.notion.site/Full-stack-home-assignment-e3f0186c56494457b096fe65b12d5ef2`

import type { Request, Response, NextFunction } from 'express';
import {
  createBadRequestError,
  createConflictError,
  createInternalServerError,
  createNotFoundError,
} from '../errors/appError';
import { query } from '../db';
import { normalizeTitle } from '../utils/title';
import { getMovieDetails } from '../services/omdb';

type AddMovieBody = {
  omdbId?: string;
  title: string;
  year?: string;
  runtime?: string;
  genre?: string;
  director?: string;
};

type EditMovieBody = Partial<
  Pick<AddMovieBody, 'title' | 'year' | 'runtime' | 'genre' | 'director'>
>;

type AddMovieParams = { userId: string };

type ListQuery = { favorite?: string; sort?: string; order?: string };

type ListParams = { userId: string };

export async function listUserMovies(
  req: Request<ListParams, unknown, unknown, ListQuery>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { userId } = req.params;
    if (!userId) {
      throw createBadRequestError('userId is required in path');
    }
    const userRes = await query<{ id: string }>(
      'SELECT id FROM users WHERE id = $1',
      [userId]
    );
    if (!userRes.rows[0]) {
      throw createNotFoundError('User not found');
    }

    const favoriteRaw = req.query?.favorite;
    let favoriteFilter: boolean | undefined;
    if (typeof favoriteRaw !== 'undefined') {
      if (favoriteRaw !== 'true' && favoriteRaw !== 'false') {
        throw createBadRequestError("favorite must be 'true' or 'false'");
      }
      favoriteFilter = favoriteRaw === 'true';
    }

    const sortMap: Record<string, string> = {
      title: 'title',
      year: 'year',
      created_at: 'created_at',
      updated_at: 'updated_at',
    };
    const orderMap: Record<string, 'asc' | 'desc'> = {
      asc: 'asc',
      desc: 'desc',
    };

    const sortKey =
      req.query?.sort && sortMap[req.query.sort]
        ? sortMap[req.query.sort]
        : 'created_at';
    const orderKey =
      req.query?.order && orderMap[req.query.order]
        ? orderMap[req.query.order]
        : 'asc';

    const values: unknown[] = [userId];
    let where = 'WHERE user_id = $1';
    if (typeof favoriteFilter === 'boolean') {
      values.push(favoriteFilter);
      where += ` AND is_favorite = $${values.length}`;
    }

    const sql = `
      SELECT
        id,
        movie_id AS "movieId",
        title,
        year,
        runtime,
        genre,
        director,
        poster,
        is_favorite AS "isFavorite",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM user_movies
      ${where}
      ORDER BY ${sortKey} ${orderKey}
    `;

    const { rows } = await query(sql, values);
    res.json({ items: rows });
  } catch (err) {
    next(err);
  }
}

export async function addUserMovie(
  req: Request<AddMovieParams, unknown, AddMovieBody>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { userId } = req.params;
    const {
      omdbId,
      title: titleRaw,
      year,
      runtime,
      genre,
      director,
    } = req.body;

    if (!userId) {
      throw createBadRequestError('userId is required in path');
    }

    // Validate user exists
    const userRes = await query<{ id: string }>(
      'SELECT id FROM users WHERE id = $1',
      [userId]
    );
    if (!userRes.rows[0]) {
      throw createNotFoundError('User not found');
    }

    if (typeof titleRaw !== 'string') {
      throw createBadRequestError('title must be a string');
    }

    const title = normalizeTitle(titleRaw.trim());

    if (title.length < 3) {
      throw createBadRequestError('title must be at least 3 characters');
    }

    if (year && !/^\d{4}$/.test(year)) {
      throw createBadRequestError('year must be YYYY if provided', { year });
    }

    // Duplicate per user guard (case-insensitive on normalized title)
    const dupRes = await query<{ id: string }>(
      'SELECT id FROM user_movies WHERE user_id = $1 AND lower(title) = lower($2)',
      [userId, title]
    );
    if (dupRes.rows[0]) {
      throw createConflictError('A movie with the same name already exists.');
    }

    // Optionally enrich with OMDB details if omdbId present
    let enriched = { runtime, genre, director } as {
      runtime?: string;
      genre?: string;
      director?: string;
    };
    let poster: string | undefined;
    let source: 'omdb' | 'custom' = 'custom';
    if (omdbId && omdbId.trim().length > 0) {
      const details = await getMovieDetails(omdbId.trim());
      enriched = {
        runtime: enriched.runtime ?? details.runtime,
        genre: enriched.genre ?? details.genre,
        director: enriched.director ?? details.director,
      };
      poster = details.poster;
      source = 'omdb';
    }

    // Insert user snapshot directly (no movies table)
    const insertSnapshot = await query<{ id: string; is_favorite: boolean }>(
      `INSERT INTO user_movies (user_id, title, year, runtime, genre, director, poster, omdb_id, source)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, is_favorite`,
      [
        userId,
        title,
        year ?? null,
        enriched.runtime ?? null,
        enriched.genre ?? null,
        enriched.director ?? null,
        poster ?? null,
        omdbId ?? null,
        source,
      ]
    );

    const row = insertSnapshot.rows[0];

    if (!row) {
      throw createInternalServerError('Error inserting user movie');
    }

    res.status(201).json({
      id: row.id,
      title,
      year: year ?? null,
      runtime: enriched.runtime ?? null,
      genre: enriched.genre ?? null,
      director: enriched.director ?? null,
      poster: poster ?? null,
      isFavorite: row.is_favorite,
    });
  } catch (err) {
    next(err);
  }
}

export async function setFavorite(
  req: Request<
    { userId: string; id: string },
    unknown,
    { isFavorite?: boolean }
  >,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { userId, id } = req.params;
    if (!userId || !id) {
      throw createBadRequestError('userId and id are required in path');
    }

    const currentRes = await query<{ is_favorite: boolean }>(
      'SELECT is_favorite FROM user_movies WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    const current = currentRes.rows[0];
    if (!current) {
      throw createNotFoundError('User movie not found');
    }

    const bodyVal = req.body?.isFavorite;
    if (typeof bodyVal !== 'undefined' && typeof bodyVal !== 'boolean') {
      throw createBadRequestError('isFavorite must be boolean when provided');
    }
    const nextVal =
      typeof bodyVal === 'boolean' ? bodyVal : !current.is_favorite;

    const updateRes = await query<{ id: string; is_favorite: boolean }>(
      `UPDATE user_movies SET is_favorite = $1, updated_at = now() WHERE id = $2 AND user_id = $3
       RETURNING id, is_favorite`,
      [nextVal, id, userId]
    );
    const row = updateRes.rows[0];
    if (!row) {
      throw createInternalServerError('Failed to update favorite');
    }
    res.json({ id: row.id, isFavorite: row.is_favorite });
  } catch (err) {
    next(err);
  }
}

export async function editUserMovie(
  req: Request<{ userId: string; id: string }, unknown, EditMovieBody>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { userId, id } = req.params;
    const { title, year, runtime, genre, director } = req.body;
    if (!userId || !id || !title || !year || !runtime || !genre || !director) {
      throw createBadRequestError('userId and id are required in path');
    }

    const existingRes = await query<{ id: string; title: string }>(
      'SELECT id, title FROM user_movies WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    const existing = existingRes.rows[0];
    if (!existing) {
      throw createNotFoundError('User movie not found');
    }

    const updates: string[] = [];
    const values: string[] = [];

    if (typeof req.body.title !== 'string') {
      throw createBadRequestError('title must be a string');
    }

    const normalized = normalizeTitle(req.body.title.trim());
    if (normalized.length < 3) {
      throw createBadRequestError('title must be at least 3 characters');
    }
    const dupRes = await query<{ id: string }>(
      'SELECT id FROM user_movies WHERE user_id = $1 AND lower(title) = lower($2) AND id <> $3',
      [userId, normalized, id]
    );
    if (dupRes.rows[0]) {
      throw createConflictError('A movie with the same name already exists.');
    }

    updates.push(`title = $${updates.length + 1}`);
    values.push(normalized);

    if (req.body.year !== null && typeof req.body.year !== 'string') {
      throw createBadRequestError('year must be a string');
    }

    if (req.body.year && !/^\d{4}$/.test(req.body.year)) {
      throw createBadRequestError('year must be YYYY if provided', {
        year: req.body.year,
      });
    }

    updates.push(`year = $${updates.length + 1}`);
    values.push(req.body.year ?? null);

    if (req.body.runtime !== null && typeof req.body.runtime !== 'string') {
      throw createBadRequestError('runtime must be a string');
    }
    updates.push(`runtime = $${updates.length + 1}`);
    values.push(req.body.runtime ?? null);

    if (req.body.genre !== null && typeof req.body.genre !== 'string') {
      throw createBadRequestError('genre must be a string');
    }
    updates.push(`genre = $${updates.length + 1}`);
    values.push(req.body.genre ?? null);

    if (req.body.director !== null && typeof req.body.director !== 'string') {
      throw createBadRequestError('director must be a string');
    }
    updates.push(`director = $${updates.length + 1}`);
    values.push(req.body.director ?? null);

    if (updates.length === 0) {
      throw createBadRequestError(
        'At least one updatable field must be provided'
      );
    }

    const setClause = updates.join(', ') + ', updated_at = now()';
    values.push(id as any, userId as any);

    const sql = `
      UPDATE user_movies
      SET ${setClause}
      WHERE id = $${values.length - 1} AND user_id = $${values.length}
      RETURNING id, title, year, runtime, genre, director, poster, is_favorite AS "isFavorite";
    `;

    const { rows } = await query(sql, values as unknown[]);
    const updated = rows[0];
    if (!updated) {
      throw createInternalServerError('Failed to update movie');
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteUserMovie(
  req: Request<{ userId: string; id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { userId, id } = req.params;
    if (!userId || !id) {
      throw createBadRequestError('userId and id are required in path');
    }

    // Validate UUID to prevent DB cast errors from optimistic temp IDs
    const uuidV4Pattern =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidV4Pattern.test(id)) {
      throw createBadRequestError('id must be a valid UUID');
    }

    const delRes = await query<{ id: string }>(
      'DELETE FROM user_movies WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );
    const row = delRes.rows[0];
    if (!row) {
      throw createNotFoundError('User movie not found');
    }
    res.json({ id: row.id, deleted: true });
  } catch (err) {
    next(err);
  }
}

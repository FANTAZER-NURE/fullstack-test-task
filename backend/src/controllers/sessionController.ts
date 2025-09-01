import type { Request, Response, NextFunction } from "express";
import { createBadRequestError, createInternalServerError } from "../errors/appError";
import { query } from "../db";

type UserBody = { username: string };

export async function ensureUser(
  req: Request<Record<string, never>, unknown, UserBody>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { username: usernameRaw } = req.body;
    if (typeof usernameRaw !== "string") {
      throw createBadRequestError("username must be a string");
    }
    const username = usernameRaw.trim();
    if (username.length < 3) {
      throw createBadRequestError("username must be at least 3 characters");
    }

    const upsertSql = `
      INSERT INTO users (username)
      VALUES ($1)
      ON CONFLICT (username) DO UPDATE SET username = EXCLUDED.username
      RETURNING id, username
    `;
    const { rows } = await query<{ id: string; username: string }>(upsertSql, [username]);
    const user = rows[0];
    if (!user) {
      throw createInternalServerError("Error inserting user");
    }
    res.json({ userId: user.id, username: user.username });
  } catch (err) {
    next(err);
  }
}

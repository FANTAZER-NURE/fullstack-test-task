import type { Request, Response, NextFunction } from "express";
import { createBadRequestError } from "../errors/appError";
import { searchMovies } from "../services/omdb";

type SearchQuery = { query?: string; page?: string };

export async function search(
  req: Request<unknown, unknown, unknown, SearchQuery>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const queryRaw = req.query?.query ?? "";
    const pageRaw = req.query?.page ?? "1";

    if (typeof queryRaw !== "string") {
      throw createBadRequestError("query must be a string");
    }
    const q = queryRaw.trim();
    if (q.length < 2) {
      throw createBadRequestError("query must be at least 2 characters");
    }

    const pNum = Number(pageRaw);
    const page = Number.isFinite(pNum) && pNum >= 1 ? pNum : 1;

    const result = await searchMovies(q, page);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

import { normalizeTitle } from "../utils/title";
import { omdbFetch } from "./omdbFetch";

type OmdbSearchItem = {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
};

type OmdbSearchResponse = {
  Search?: OmdbSearchItem[];
  totalResults?: string;
  Response: "True" | "False";
  Error?: string;
};

export type NormalizedMovie = {
  omdbId: string;
  title: string;
  year: string;
  poster: string;
};

export async function searchMovies(query: string, page: number): Promise<{ items: NormalizedMovie[]; total: number; page: number }>
{
  const searchResp = await omdbFetch<OmdbSearchResponse>({ s: query, page: String(page) });

  const total = Number(searchResp.totalResults || 0);
  const items: NormalizedMovie[] = (searchResp.Search ?? []).map((s) => ({
    omdbId: s.imdbID,
    title: normalizeTitle(s.Title),
    year: s.Year,
    poster: s.Poster
  }));

  return { items, total, page };
}

export type OmdbDetailResponse = {
  Title?: string;
  Year?: string;
  Runtime?: string;
  Genre?: string;
  Director?: string;
  Poster?: string;
  Response: "True" | "False";
  Error?: string;
};

export async function getMovieDetails(omdbId: string): Promise<{
  title?: string;
  year?: string;
  runtime?: string;
  genre?: string;
  director?: string;
  poster?: string;
}> {
  const resp = await omdbFetch<OmdbDetailResponse>({ i: omdbId });
  if (resp.Response !== "True") {
    return {};
  }
  return {
    title: resp.Title ? normalizeTitle(resp.Title) : undefined,
    year: resp.Year,
    runtime: resp.Runtime,
    genre: resp.Genre,
    director: resp.Director,
    poster: resp.Poster
  };
}

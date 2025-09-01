import { config } from "../config";
import { createBadGatewayError } from "../errors/appError";

const OMDB_BASE = "https://www.omdbapi.com/";

export async function omdbFetch<T>(params: Record<string, string>): Promise<T> {
  const apiKey = config.omdbApiKey;
  if (!apiKey) {
    throw createBadGatewayError("OMDB API key is not configured");
  }
  const searchParams = new URLSearchParams({ apikey: apiKey, ...params });
  const url = `${OMDB_BASE}?${searchParams.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw createBadGatewayError("OMDB request failed");
  }
  const data = (await res.json()) as { Response?: string; Error?: string } & T;
  if (data.Response === "False") {
    throw createBadGatewayError((data as any).Error || "OMDB error");
  }
  return data as T;
}

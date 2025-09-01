// Session
export interface EnsureUserRequest {
  username: string;
}
export interface EnsureUserResponse {
  userId: string;
  username: string;
}

// Search (OMDb proxied)
export interface SearchMovieItem {
  omdbId: string;
  title: string;
  year: string;
  poster: string;
}
export interface SearchResponse {
  items: SearchMovieItem[];
  total: number;
  page: number;
}

export type SortKey = 'title' | 'year' | 'created_at' | 'updated_at';
export type SortOrder = 'asc' | 'desc';

export interface UserMovieSnapshot {
  id: string;
  title: string;
  year: string | null;
  runtime: string | null;
  genre: string | null;
  director: string | null;
  poster: string | null;
  isFavorite: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface ListUserMoviesResponse {
  items: UserMovieSnapshot[];
}

export interface AddMovieRequest {
  omdbId?: string;
  title: string;
  year?: string;
  runtime?: string;
  genre?: string;
  director?: string;
  poster?: string;
}
export interface AddMovieResponse {
  id: string;
  title: string;
  year: string | null;
  runtime: string | null;
  genre: string | null;
  director: string | null;
  poster?: string | null;
  isFavorite: boolean;
}

export interface EditMovieRequest {
  title: string;
  year: string | null;
  runtime: string | null;
  genre: string | null;
  director: string | null;
}
export type EditMovieResponse = UserMovieSnapshot;

export interface FavoriteRequest {
  isFavorite?: boolean;
}
export interface FavoriteResponse {
  id: string;
  isFavorite: boolean;
}

export interface DeleteUserMovieResponse {
  id: string;
  deleted: boolean;
}

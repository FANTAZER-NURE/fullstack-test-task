import { createAsyncThunk } from '@reduxjs/toolkit';
import type {
  ListUserMoviesResponse,
  AddMovieRequest,
  AddMovieResponse,
  EditMovieRequest,
  FavoriteResponse,
  DeleteUserMovieResponse,
  UserMovieSnapshot,
  SortKey,
  SortOrder,
} from '@/api/models';
import { postApi, getApi, deleteApi, patchApi } from '@/api/httpClient';
import type { AxiosError } from 'axios';

export const listUserMovies = createAsyncThunk<
  ListUserMoviesResponse,
  { userId: string; favorite?: boolean; sort?: string; order?: string }
>('userMovies/list', async ({ userId, favorite, sort, order }) => {
  return await getApi(
    `/api/users/${userId}/movies` as '/api/users/:userId/movies',
    {
      userId,
      favorite,
      sort: (sort as SortKey) ?? undefined,
      order: (order as SortOrder) ?? undefined,
    }
  );
});

export const addUserMovie = createAsyncThunk<
  AddMovieResponse,
  { userId: string } & AddMovieRequest
>('userMovies/add', async ({ userId, ...data }, { rejectWithValue }) => {
  try {
    return await postApi(
      `/api/users/${userId}/movies` as '/api/users/:userId/movies',
      { userId, ...data }
    );
  } catch (err: unknown) {
    const axiosErr = err as AxiosError<{ message: string }>;
    const message =
      axiosErr?.response?.data?.message || axiosErr?.message || 'Add failed';
    return rejectWithValue(message);
  }
});

export const editUserMovie = createAsyncThunk<
  UserMovieSnapshot,
  { userId: string; id: string } & EditMovieRequest
>('userMovies/edit', async ({ userId, id, ...data }, { rejectWithValue }) => {
  try {
    return await patchApi(
      `/api/users/${userId}/movies/${id}` as '/api/users/:userId/movies/:id',
      { userId, id, ...data }
    );
  } catch (err: unknown) {
    const axiosErr = err as AxiosError<{ message: string }>;
    const message =
      axiosErr?.response?.data?.message || axiosErr?.message || 'Edit failed';
    return rejectWithValue(message);
  }
});

export const deleteUserMovie = createAsyncThunk<
  DeleteUserMovieResponse,
  { userId: string; id: string }
>('userMovies/delete', async ({ userId, id }) => {
  return await deleteApi(
    `/api/users/${userId}/movies/${id}` as '/api/users/:userId/movies/:id',
    { userId, id }
  );
});

export const setFavorite = createAsyncThunk<
  FavoriteResponse,
  { userId: string; id: string; isFavorite?: boolean }
>('userMovies/favorite', async ({ userId, id, isFavorite }) => {
  return await postApi(
    `/api/users/${userId}/movies/${id}/favorite` as '/api/users/:userId/movies/:id/favorite',
    { userId, id, isFavorite }
  );
});

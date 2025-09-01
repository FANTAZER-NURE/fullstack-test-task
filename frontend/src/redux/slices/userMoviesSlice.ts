import { createSlice } from '@reduxjs/toolkit';
import type { UserMovieSnapshot } from '@/api/models';
import {
  addUserMovie,
  deleteUserMovie,
  editUserMovie,
  listUserMovies,
  setFavorite,
} from './userMovies/thunks';

export type UserMoviesState = {
  items: UserMovieSnapshot[];
  loading: boolean;
  error: string | null;
  favoriteOnly: boolean;
  sort: 'title' | 'year' | 'created_at' | 'updated_at';
  order: 'asc' | 'desc';
  rollbackByRequestId?: Record<
    string,
    | { type: 'favorite'; id: string; prev: boolean }
    | { type: 'delete'; index: number; item: UserMovieSnapshot }
    | { type: 'edit'; id: string; prev: UserMovieSnapshot }
  >;
  deletingById: Record<string, boolean>;
};

const initialState: UserMoviesState = {
  items: [],
  loading: false,
  error: null,
  favoriteOnly: false,
  sort: 'created_at',
  order: 'asc',
  rollbackByRequestId: {},
  deletingById: {},
};

const slice = createSlice({
  name: 'userMovies',
  initialState,
  reducers: {
    setFavoriteOnly(state, action) {
      state.favoriteOnly = action.payload as boolean;
    },
    setSort(state, action) {
      state.sort = action.payload as UserMoviesState['sort'];
    },
    setOrder(state, action) {
      state.order = action.payload as UserMoviesState['order'];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listUserMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listUserMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
      })
      .addCase(listUserMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error';
      })
      .addCase(addUserMovie.pending, (state, action) => {
        const req = (action as any)?.meta?.arg as
          | ({ userId: string } & Partial<{
              title: string;
              year: string;
              runtime: string;
              genre: string;
              director: string;
              poster: string;
            }>)
          | undefined;
        if (!req || !req.title) return;
        const tempId = `temp-${action.meta.requestId}`;
        state.items.push({
          id: tempId,
          title: req.title,
          year: req.year ?? null,
          runtime: req.runtime ?? null,
          genre: req.genre ?? null,
          director: req.director ?? null,
          poster: req.poster ?? null,
          isFavorite: false,
        });
      })
      .addCase(addUserMovie.fulfilled, (state, action) => {
        const tempIndex = state.items.findIndex(
          (i) => i.id.startsWith('temp-') && i.title === action.payload.title
        );
        if (tempIndex !== -1) {
          const prev = state.items[tempIndex];
          state.items[tempIndex] = {
            id: action.payload.id,
            title: action.payload.title,
            year: action.payload.year,
            runtime: action.payload.runtime,
            genre: action.payload.genre,
            director: action.payload.director,
            poster: action.payload.poster ?? prev.poster ?? null,
            isFavorite: action.payload.isFavorite,
          } as UserMovieSnapshot;
        } else {
          state.items.push({
            id: action.payload.id,
            title: action.payload.title,
            year: action.payload.year,
            runtime: action.payload.runtime,
            genre: action.payload.genre,
            director: action.payload.director,
            poster: (action.payload as any).poster ?? null,
            isFavorite: action.payload.isFavorite,
          } as UserMovieSnapshot);
        }
      })
      .addCase(addUserMovie.rejected, (state, action) => {
        const tempIdPrefix = `temp-${action.meta.requestId}`;
        state.items = state.items.filter((i) => i.id !== tempIdPrefix);
        const msg =
          (action.payload as string) || action.error.message || 'Add failed';
        state.error = msg;
      })
      .addCase(setFavorite.pending, (state, action) => {
        const id = action.meta.arg.id;
        const idx = state.items.findIndex((i) => i.id === id);
        if (idx !== -1) {
          const prev = state.items[idx].isFavorite;
          state.rollbackByRequestId![action.meta.requestId] = {
            type: 'favorite',
            id,
            prev,
          };
          state.items[idx].isFavorite =
            typeof action.meta.arg.isFavorite === 'boolean'
              ? action.meta.arg.isFavorite
              : !prev;
        }
      })
      .addCase(setFavorite.fulfilled, (state, action) => {
        const idx = state.items.findIndex((i) => i.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx].isFavorite = action.payload.isFavorite;
        }
        delete state.rollbackByRequestId![action.meta.requestId];
      })
      .addCase(setFavorite.rejected, (state, action) => {
        const rollback = state.rollbackByRequestId![action.meta.requestId];
        if (rollback && rollback.type === 'favorite') {
          const idx = state.items.findIndex(
            (i) => i.id === (rollback as any).id
          );
          if (idx !== -1) {
            state.items[idx].isFavorite = rollback.prev;
          }
          delete state.rollbackByRequestId![action.meta.requestId];
        }
        const msg = action.error.message || 'Favorite failed';
        state.error = msg;
      })
      .addCase(deleteUserMovie.pending, (state, action) => {
        const id = action.meta.arg.id;
        state.deletingById[id] = true;
      })
      .addCase(deleteUserMovie.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload.id);
        delete state.deletingById[action.meta.arg.id];
      })
      .addCase(deleteUserMovie.rejected, (state, action) => {
        const msg = action.error.message || 'Delete failed';
        state.error = msg;
        delete state.deletingById[action.meta.arg.id];
      })
      .addCase(editUserMovie.pending, (state, action) => {
        const { id } = action.meta.arg;
        const idx = state.items.findIndex((i) => i.id === id);
        if (idx !== -1) {
          state.rollbackByRequestId![action.meta.requestId] = {
            type: 'edit',
            id,
            prev: { ...state.items[idx] },
          };
          const next = action.meta.arg as any;
          state.items[idx] = {
            ...state.items[idx],
            title: next.title,
            year: next.year,
            runtime: next.runtime,
            genre: next.genre,
            director: next.director,
          } as UserMovieSnapshot;
        }
      })
      .addCase(editUserMovie.fulfilled, (state, action) => {
        const idx = state.items.findIndex((i) => i.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = action.payload;
        }
        delete state.rollbackByRequestId![action.meta.requestId];
      })
      .addCase(editUserMovie.rejected, (state, action) => {
        const rollback = state.rollbackByRequestId![action.meta.requestId];
        if (rollback && rollback.type === 'edit') {
          const idx = state.items.findIndex((i) => i.id === rollback.id);
          if (idx !== -1) {
            state.items[idx] = rollback.prev;
          }
          delete state.rollbackByRequestId![action.meta.requestId];
        }
        const msg = action.error.message || 'Edit failed';
        state.error = msg;
      });
  },
});

export const { setFavoriteOnly, setSort, setOrder } = slice.actions;
export default slice.reducer;

export {
  listUserMovies,
  addUserMovie,
  editUserMovie,
  deleteUserMovie,
  setFavorite,
};

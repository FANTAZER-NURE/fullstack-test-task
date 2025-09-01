import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/redux/store';

export const selectUserMoviesState = (s: RootState) => s.userMovies;
export const selectMovies = (s: RootState) => s.userMovies.items;
export const selectDeletingById = (s: RootState) => s.userMovies.deletingById;

export const selectFilteredSorted = createSelector(
  [
    selectMovies,
    (s: RootState) => s.userMovies.favoriteOnly,
    (s: RootState) => s.userMovies.sort,
    (s: RootState) => s.userMovies.order,
  ],
  (items, favoriteOnly, sort, order) => {
    const filtered = favoriteOnly ? items.filter((i) => i.isFavorite) : items;
    const sorted = [...filtered].sort((a, b) => {
      const dir = order === 'desc' ? -1 : 1;
      switch (sort) {
        case 'title':
          return a.title.localeCompare(b.title) * dir;
        case 'year':
          return (a.year ?? '').localeCompare(b.year ?? '') * dir;
        case 'updated_at':
          return (a.updatedAt ?? '').localeCompare(b.updatedAt ?? '') * dir;
        case 'created_at':
        default:
          return (a.createdAt ?? '').localeCompare(b.createdAt ?? '') * dir;
      }
    });
    return sorted;
  }
);

import { useCallback, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  deleteUserMovie,
  editUserMovie,
  setFavorite,
} from '@/redux/slices/userMoviesSlice';
import type { EditFormValues } from '../components/EditMovieModal';

export function useMovie(movieId: string | undefined) {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((s) => s.session.userId);
  const movie = useAppSelector((s) =>
    s.userMovies.items.find((m) => m.id === movieId)
  );
  const isDeleting = useAppSelector((s) =>
    movieId ? !!s.userMovies.deletingById[movieId] : false
  );

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleToggleFavorite = useCallback(() => {
    if (!userId || !movie) return;
    dispatch(setFavorite({ userId, id: movie.id }));
  }, [dispatch, userId, movie]);

  const handleConfirmDelete = useCallback(() => {
    if (!userId || !movie) return;
    // Do not attempt to delete optimistic temp items
    if (movie.id.startsWith('temp-')) return;
    return dispatch(deleteUserMovie({ userId, id: movie.id }));
  }, [dispatch, userId, movie]);

  const handleSubmitEdit = useCallback(
    (values: EditFormValues) => {
      if (!userId || !movie) return;
      return dispatch(editUserMovie({ userId, id: movie.id, ...values }));
    },
    [dispatch, userId, movie]
  );

  const initialEdit = useMemo(() => {
    if (!movie) return null;
    return {
      title: movie.title,
      year: movie.year,
      runtime: movie.runtime,
      genre: movie.genre,
      director: movie.director,
    } as EditFormValues;
  }, [movie]);

  return {
    movie,
    confirmOpen,
    setConfirmOpen,
    editOpen,
    setEditOpen,
    initialEdit,
    handleToggleFavorite,
    handleConfirmDelete,
    handleSubmitEdit,
    isDeleting,
  } as const;
}

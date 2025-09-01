import { useCallback, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  deleteUserMovie,
  editUserMovie,
  setFavorite,
} from '@/redux/slices/userMoviesSlice';
import type { EditFormValues } from '../components/EditMovieModal';

export function useMovies() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((s) => s.session.userId);
  const movies = useAppSelector((s) => s.userMovies.items);
  const loading = useAppSelector((s) => s.userMovies.loading);
  const deletingById = useAppSelector((s) => s.userMovies.deletingById);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleToggleFavorite = useCallback(
    (id: string) => {
      if (!userId) return;
      dispatch(setFavorite({ userId, id }));
    },
    [dispatch, userId]
  );

  const requestDelete = useCallback((id: string) => {
    // Do not allow deleting optimistic temp items
    if (id.startsWith('temp-')) return;
    setPendingDeleteId(id);
    setConfirmOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!userId || !pendingDeleteId) return;
    dispatch(deleteUserMovie({ userId, id: pendingDeleteId })).finally(() => {
      setConfirmOpen(false);
      setPendingDeleteId(null);
    });
  }, [dispatch, userId, pendingDeleteId]);

  const requestEdit = useCallback((id: string) => {
    setEditingId(id);
    setEditOpen(true);
  }, []);

  const handleSubmitEdit = useCallback(
    (values: EditFormValues) => {
      if (!userId || !editingId) return;
      dispatch(editUserMovie({ userId, id: editingId, ...values })).finally(
        () => {
          setEditOpen(false);
          setEditingId(null);
        }
      );
    },
    [dispatch, userId, editingId]
  );

  const current = useMemo(
    () => (editingId ? (movies.find((m) => m.id === editingId) ?? null) : null),
    [editingId, movies]
  );

  return {
    // state
    userId,
    movies,
    loading,
    deletingById,
    confirmOpen,
    setConfirmOpen,
    pendingDeleteId,
    editOpen,
    setEditOpen,
    editingId,
    current,
    // actions
    handleToggleFavorite,
    requestDelete,
    handleConfirmDelete,
    requestEdit,
    handleSubmitEdit,
  } as const;
}

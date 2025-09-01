import { useMemo } from 'react';
import { Flex, Spinner, Text } from '@radix-ui/themes';
import styles from './MoviesList.module.scss';
import MovieCard from './MovieCard';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import EditMovieModal from './EditMovieModal';
import { useMovies } from '../hooks/use-movies';

export default function MoviesList() {
  const {
    userId,
    movies,
    loading,
    deletingById,
    confirmOpen,
    setConfirmOpen,
    pendingDeleteId,
    editOpen,
    setEditOpen,
    current,
    handleToggleFavorite,
    requestDelete,
    requestEdit,
    handleConfirmDelete,
    handleSubmitEdit,
  } = useMovies();

  const content = useMemo(() => {
    if (!userId) {
      return (
        <Flex justify="center" py="6">
          <Text>Please sign in to see your movies.</Text>
        </Flex>
      );
    }
    if (loading) {
      return (
        <Flex justify="center" py="6">
          <Spinner />
        </Flex>
      );
    }
    if (movies.length === 0) {
      return (
        <Flex justify="center" py="6">
          <Text color="gray">No movies yet.</Text>
        </Flex>
      );
    }
    return (
      <div className={styles.grid}>
        {movies.map((m) => (
          <MovieCard
            key={m.id}
            id={m.id}
            title={m.title}
            year={m.year}
            runtime={m.runtime}
            genre={m.genre}
            director={m.director}
            poster={m.poster}
            isFavorite={m.isFavorite}
            onToggleFavorite={handleToggleFavorite}
            onEdit={requestEdit}
            onDelete={requestDelete}
          />
        ))}
      </div>
    );
  }, [
    userId,
    loading,
    movies,
    handleToggleFavorite,
    requestDelete,
    requestEdit,
  ]);

  return (
    <>
      <div className={styles.container}>{content}</div>
      <DeleteConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
        loading={pendingDeleteId ? !!deletingById[pendingDeleteId] : false}
      />
      {current && (
        <EditMovieModal
          open={editOpen}
          onOpenChange={setEditOpen}
          initial={{
            title: current.title,
            year: current.year,
            runtime: current.runtime,
            genre: current.genre,
            director: current.director,
          }}
          onSubmit={handleSubmitEdit}
        />
      )}
    </>
  );
}

import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  Text,
  Avatar,
  Card,
  IconButton,
} from '@radix-ui/themes';
import { StarIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import EditMovieModal from './EditMovieModal';
import { useMovie } from '../hooks/use-movie';

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
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
  } = useMovie(id);

  if (!movie) {
    return (
      <Flex direction="column" align="center" gap="3" py="6">
        <Text>Movie not found in current session.</Text>
        <Button onClick={() => navigate(-1)}>Go back</Button>
      </Flex>
    );
  }

  return (
    <Box p="4">
      <Flex align="center" justify="between" mb="3">
        <Button variant="soft" onClick={() => navigate(-1)}>
          Back
        </Button>
        <Flex gap="2">
          <IconButton
            variant={movie.isFavorite ? 'solid' : 'soft'}
            aria-label="Toggle favorite"
            onClick={handleToggleFavorite}
            color="orange"
          >
            <StarIcon />
          </IconButton>
          <IconButton
            variant="soft"
            aria-label="Edit"
            onClick={() => setEditOpen(true)}
          >
            <Pencil1Icon />
          </IconButton>
          <IconButton
            variant="soft"
            color="red"
            aria-label="Delete"
            onClick={() => setConfirmOpen(true)}
          >
            <TrashIcon />
          </IconButton>
        </Flex>
      </Flex>

      <Card>
        <Flex gap="5">
          <Avatar
            src={movie.poster ?? undefined}
            fallback={movie.title.charAt(0)}
            size="9"
            radius="none"
          />
          <Flex direction="column" gap="3">
            <Text size="6" weight="bold">
              {movie.title}
            </Text>
            {movie.year && <Text>Year: {movie.year}</Text>}
            {movie.runtime && <Text>Runtime: {movie.runtime}</Text>}
            {movie.genre && <Text>Genre: {movie.genre}</Text>}
            {movie.director && <Text>Director: {movie.director}</Text>}
          </Flex>
        </Flex>
      </Card>

      <DeleteConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={() => handleConfirmDelete()?.finally(() => navigate(-1))}
        onCancel={() => setConfirmOpen(false)}
        loading={isDeleting}
      />
      {initialEdit && (
        <EditMovieModal
          open={editOpen}
          onOpenChange={setEditOpen}
          initial={initialEdit}
          onSubmit={(v) =>
            handleSubmitEdit(v)?.finally(() => setEditOpen(false))
          }
        />
      )}
    </Box>
  );
}

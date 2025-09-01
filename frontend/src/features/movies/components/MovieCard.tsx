import { useCallback, useMemo } from 'react';
import {
  Card,
  Text,
  IconButton,
  Avatar,
  Separator,
  Flex,
} from '@radix-ui/themes';
import {
  StarIcon,
  Pencil1Icon,
  TrashIcon,
  ImageIcon,
} from '@radix-ui/react-icons';
import styles from './MovieCard.module.scss';
import { useAppDispatch } from '@/redux/hooks';
import { setDeleteModalOpen } from '@/redux/slices/uiSlice';
import { useNavigate } from 'react-router-dom';

export type MovieCardProps = {
  id: string;
  title: string;
  year: string | null;
  runtime: string | null;
  genre: string | null;
  director: string | null;
  poster: string | null;
  isFavorite: boolean;
  onToggleFavorite: (id: string, next?: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function MovieCard({
  id,
  title,
  year,
  runtime,
  genre,
  director,
  poster,
  isFavorite,
  onToggleFavorite,
  onEdit,
  onDelete,
}: MovieCardProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleFav = useCallback(
    () => onToggleFavorite(id),
    [id, onToggleFavorite]
  );
  const handleEdit = useCallback(() => onEdit(id), [id, onEdit]);
  const handleDelete = useCallback(() => {
    dispatch(setDeleteModalOpen(true));
    onDelete(id);
  }, [dispatch, id, onDelete]);

  const yearText = useMemo(() => (year && year.trim() ? year : '—'), [year]);
  const genreText = useMemo(
    () => (genre && genre.trim() ? genre : '…'),
    [genre]
  );
  const directorText = useMemo(
    () => (director && director.trim() ? director : '…'),
    [director]
  );
  const runtimeText = useMemo(
    () => (runtime && runtime.trim() ? runtime : '…'),
    [runtime]
  );

  return (
    <Card className={styles.card} onClick={() => navigate(`/movie/${id}`)}>
      <div className={styles.layout}>
        <div className={styles.colPoster}>
          {poster && poster.trim().length > 0 ? (
            <Avatar
              src={poster ?? undefined}
              fallback={title.charAt(0)}
              radius="none"
              className={styles.posterLarge}
            />
          ) : (
            <Flex
              justify="center"
              align="center"
              className={`${styles.posterLarge} ${styles.posterPlaceholder}`}
            >
              <ImageIcon width={28} height={28} />
            </Flex>
          )}
          <div className={styles.actions}>
            <IconButton
              ml="auto"
              variant={isFavorite ? 'solid' : 'soft'}
              aria-label="Toggle favorite"
              className={styles.button}
              color="orange"
              onClick={(e) => {
                e.stopPropagation();
                handleFav();
              }}
            >
              <StarIcon />
            </IconButton>
            <IconButton
              variant="soft"
              aria-label="Edit"
              className={styles.button}
              onClick={(e) => {
                e.stopPropagation();
                handleEdit();
              }}
            >
              <Pencil1Icon />
            </IconButton>
            <IconButton
              variant="soft"
              aria-label="Delete"
              color="red"
              className={styles.button}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
            >
              <TrashIcon />
            </IconButton>
          </div>
        </div>

        <div className={styles.colDetails}>
          <div className={styles.headerRow}>
            <Text size="4" weight="bold" className={styles.title}>
              {title}
            </Text>
          </div>

          <Separator size="3" className={styles.sep} />

          <div className={styles.metaRows}>
            <div className={styles.metaRow}>
              <Text size="1" color="gray">
                Year:
              </Text>
              <Text size="1">{yearText}</Text>
            </div>
            <div className={styles.metaRow}>
              <Text size="1" color="gray">
                Runtime:
              </Text>
              <Text size="1">{runtimeText}</Text>
            </div>
            <div className={styles.metaRow}>
              <Text size="1" color="gray">
                Genre:
              </Text>
              <Text size="1">{genreText}</Text>
            </div>
            <div className={styles.metaRow}>
              <Text size="1" color="gray">
                Director:
              </Text>
              <Text size="1">{directorText}</Text>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

import { useState, useCallback, useEffect, useMemo } from 'react';
import { Box, Flex, IconButton, Button } from '@radix-ui/themes';
import { PlusIcon, StarIcon } from '@radix-ui/react-icons';
import SearchBar from '../features/search/components/SearchBar';
import { useSearch } from '../features/search/hooks/use-search';
import styles from './HomePage.module.scss';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addUserMovie, listUserMovies } from '@/redux/slices/userMoviesSlice';
import MoviesList from '@/features/movies/components/MoviesList';
import { useLocalStorage } from '@/hooks/use-local-storage';
import AddMovieModal, {
  type AddFormValues,
} from '@/features/movies/components/AddMovieModal';
import { setUsernamePromptOpen } from '@/redux/slices/uiSlice';

export default function HomePage() {
  const { value: favOnlyStored, set: setFavOnlyStored } =
    useLocalStorage<boolean>('favOnly', false);
  const [favOnly, setFavOnly] = useState<boolean>(favOnlyStored);
  const [addOpen, setAddOpen] = useState(false);
  const search = useSearch();
  const dispatch = useAppDispatch();
  const userId = useAppSelector((s) => s.session.userId);
  const movies = useAppSelector((s) => s.userMovies.items);

  const addedTitles = useMemo(() => {
    const set = new Set<string>();
    for (const m of movies) set.add((m.title || '').trim().toLowerCase());
    return set;
  }, [useAppSelector((s) => s.userMovies.items)]);

  const handleToggleFavorites = useCallback(() => {
    setFavOnly((v) => {
      const next = !v;
      setFavOnlyStored(next);
      return next;
    });
  }, [setFavOnlyStored]);

  const handleOpenAddModal = useCallback(() => {
    if (!userId) {
      dispatch(setUsernamePromptOpen(true));
      return;
    }
    setAddOpen(true);
  }, [dispatch, userId]);

  const handleAddResult = useCallback(
    (item: {
      omdbId: string;
      title: string;
      year?: string | number;
      poster?: string;
    }) => {
      if (!userId) {
        dispatch(setUsernamePromptOpen(true));
        return;
      }
      dispatch(
        addUserMovie({
          userId,
          omdbId: item.omdbId,
          title: item.title,
          year: String(item.year ?? ''),
          poster: item.poster,
        })
      );
    },
    [dispatch, userId]
  );

  const handleAddCustom = useCallback(
    (values: AddFormValues) => {
      if (!userId) {
        dispatch(setUsernamePromptOpen(true));
        return;
      }
      dispatch(
        addUserMovie({
          userId,
          title: values.title,
          year: values.year,
          runtime: values.runtime,
          genre: values.genre,
          director: values.director,
        })
      );
      setAddOpen(false);
    },
    [dispatch, userId]
  );

  useEffect(() => {
    setFavOnly(favOnlyStored);
  }, [favOnlyStored]);

  useEffect(() => {
    if (!userId) return;
    dispatch(listUserMovies({ userId, favorite: favOnly ? true : undefined }));
  }, [dispatch, userId, favOnly]);

  return (
    <Box className={styles.page}>
      <Box className={styles.header}>
        <Flex align="center" gap="3">
          <SearchBar
            query={search.query}
            onChangeQuery={search.setQuery}
            showDropdown={search.showDropdown}
            shortQuery={search.shortQuery}
            items={search.items}
            loading={search.loading}
            page={search.page}
            remaining={search.remaining}
            loadMore={search.loadMore}
            onAddResult={handleAddResult}
            addedTitles={addedTitles}
          />
          <IconButton
            variant="soft"
            aria-label="Add movie"
            className={styles.button}
            onClick={handleOpenAddModal}
          >
            <PlusIcon />
          </IconButton>
          <IconButton
            variant={favOnly ? 'solid' : 'soft'}
            color="orange"
            className={styles.button}
            aria-label="Toggle favorites"
            onClick={handleToggleFavorites}
          >
            <StarIcon />
          </IconButton>
          {!userId && (
            <Button
              variant="soft"
              onClick={() => dispatch(setUsernamePromptOpen(true))}
            >
              Sign in
            </Button>
          )}
        </Flex>
      </Box>

      <Flex className={styles.content} gap="4">
        <Box style={{ width: '100%' }}>
          <MoviesList />
        </Box>
      </Flex>

      <AddMovieModal
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={handleAddCustom}
      />
    </Box>
  );
}

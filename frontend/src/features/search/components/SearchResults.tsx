import { Card, Flex, Text, Avatar, Spinner, Link } from '@radix-ui/themes';
import { PlusIcon, CheckIcon } from '@radix-ui/react-icons';
import styles from './SearchBar.module.scss';

export type SearchItem = {
  omdbId: string;
  title: string;
  year?: string | number;
  poster?: string;
};

export type SearchResultsProps = {
  show: boolean;
  shortQuery: boolean;
  items: SearchItem[];
  loading: boolean;
  page: number;
  remaining: number;
  loadMore: () => void;
  onAdd: (item: SearchItem) => void;
  addedTitles?: Set<string>;
  className?: string;
};

export default function SearchResults({
  show,
  shortQuery,
  items,
  loading,
  page,
  remaining,
  loadMore,
  onAdd,
  addedTitles,
  className,
}: SearchResultsProps) {
  if (!show) return null;

  const initialLoading = loading && page === 1;
  const loadingMore = loading && page > 1;

  return (
    <Card size="2" className={`${styles.dropdown} ${className ?? ''}`.trim()}>
      <div className={styles.dropdownScroll}>
        {shortQuery ? (
          <Flex justify="center" py="3">
            <Text color="gray">Type at least 3 characters to search</Text>
          </Flex>
        ) : initialLoading ? (
          <Flex justify="center" py="4">
            <Spinner />
          </Flex>
        ) : (
          <>
            {items.map((item) => {
              const normalizedTitle = item.title.trim().toLowerCase();
              const alreadyAdded = addedTitles?.has(normalizedTitle) ?? false;
              return (
                <Flex
                  key={item.omdbId}
                  align="center"
                  gap="3"
                  className={styles.dropdownItem}
                >
                  <Avatar src={item.poster} fallback={item.title.charAt(0)} />
                  <Flex align="center" gap="3">
                    <Text>{item.title}</Text>
                    <Text color="gray">{item.year}</Text>
                  </Flex>
                  {alreadyAdded ? (
                    <Flex ml="auto" align="center" title="Already added">
                      <CheckIcon />
                    </Flex>
                  ) : (
                    <Link
                      asChild
                      ml="auto"
                      style={{ cursor: 'pointer' }}
                      onClick={() => onAdd(item)}
                    >
                      <button aria-label="Add movie">
                        <PlusIcon />
                      </button>
                    </Link>
                  )}
                </Flex>
              );
            })}
            {remaining > 0 && (
              <Flex
                justify="center"
                align="center"
                py="2"
                height="40px"
                className={styles.loadMoreRow}
              >
                {loadingMore ? (
                  <Spinner />
                ) : (
                  <Link onClick={loadMore} style={{ cursor: 'pointer' }}>
                    Load more ({remaining} left)
                  </Link>
                )}
              </Flex>
            )}
          </>
        )}
      </div>
    </Card>
  );
}

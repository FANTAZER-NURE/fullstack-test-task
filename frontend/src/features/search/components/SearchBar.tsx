import { Flex, TextField, Box, IconButton } from '@radix-ui/themes';
import { MagnifyingGlassIcon, Cross2Icon } from '@radix-ui/react-icons';
import styles from './SearchBar.module.scss';
import SearchResults from './SearchResults';

export type SearchItem = {
  omdbId: string;
  title: string;
  year?: string | number;
  poster?: string;
};

export type SearchBarProps = {
  query: string;
  onChangeQuery: (value: string) => void;
  showDropdown: boolean;
  shortQuery: boolean;
  items: SearchItem[];
  loading: boolean;
  page: number;
  remaining: number;
  loadMore: () => void;
  onAddResult: (item: SearchItem) => void;
  addedTitles?: Set<string>;
  className?: string;
};

export default function SearchBar({
  query,
  onChangeQuery,
  showDropdown,
  shortQuery,
  items,
  loading,
  page,
  remaining,
  loadMore,
  onAddResult,
  addedTitles,
  className,
}: SearchBarProps) {
  return (
    <Flex
      direction="column"
      className={`${styles.searchBar} ${className ?? ''}`.trim()}
    >
      <Box>
        <TextField.Root
          placeholder="Search..."
          value={query}
          onChange={(e) => onChangeQuery(e.target.value)}
        >
          <TextField.Slot>
            <MagnifyingGlassIcon width="16" height="16" />
          </TextField.Slot>
          {query && (
            <TextField.Slot side="right">
              <IconButton
                variant="ghost"
                aria-label="Clear search"
                onClick={() => onChangeQuery('')}
              >
                <Cross2Icon />
              </IconButton>
            </TextField.Slot>
          )}
        </TextField.Root>
      </Box>

      <Box>
        <SearchResults
          show={showDropdown}
          shortQuery={shortQuery}
          items={items}
          loading={loading}
          page={page}
          remaining={remaining}
          loadMore={loadMore}
          onAdd={onAddResult}
          addedTitles={addedTitles}
        />
      </Box>
    </Flex>
  );
}

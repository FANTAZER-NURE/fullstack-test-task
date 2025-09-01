import { useEffect, useMemo, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { fetchSearch, clearResults } from '@/redux/slices/searchSlice';

export function useSearch() {
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState('');
  const debounced = useDebouncedValue(query, 400);
  const { items, loading, total, page } = useAppSelector((s) => s.search);

  useEffect(() => {
    const q = debounced.trim();
    if (q.length >= 3) {
      dispatch(fetchSearch({ query: q, page: 1 }));
    } else {
      dispatch(clearResults());
    }
  }, [debounced, dispatch]);

  const showDropdown = useMemo(() => query.trim().length > 0, [query]);
  const remaining = useMemo(
    () => Math.max(total - items.length, 0),
    [total, items.length]
  );

  const loadMore = useCallback(() => {
    const q = query.trim();
    if (q.length >= 3 && remaining > 0 && !loading) {
      dispatch(fetchSearch({ query: q, page: page + 1 }));
    }
  }, [query, remaining, loading, page, dispatch]);

  const shortQuery = query.trim().length > 0 && query.trim().length < 3;

  return {
    query,
    setQuery,
    items,
    loading,
    total,
    page,
    remaining,
    showDropdown,
    loadMore,
    shortQuery,
  } as const;
}

import { useCallback, useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const read = useCallback((): T => {
    try {
      const raw = localStorage.getItem(key);
      return raw != null ? (JSON.parse(raw) as T) : initialValue;
    } catch {
      return initialValue;
    }
  }, [key, initialValue]);

  const [value, setValue] = useState<T>(read);

  useEffect(() => {
    setValue(read());
  }, [key]);

  const set = useCallback(
    (next: T) => {
      setValue(next);
      localStorage.setItem(key, JSON.stringify(next));
    },
    [key]
  );

  const remove = useCallback(() => {
    try {
      localStorage.removeItem(key);
    } finally {
      setValue(initialValue);
    }
  }, [key, initialValue]);

  return { value, set, remove } as const;
}

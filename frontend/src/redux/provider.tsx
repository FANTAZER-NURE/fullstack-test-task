import { Provider } from 'react-redux';
import type { ReactNode } from 'react';
import { store } from './store';
import { hydrateFromStorage } from './slices/sessionSlice';
import { loadSession, saveSession, clearSession } from '@/utils/sessionStorage';
import { useEffect } from 'react';
import { useAppDispatch } from './hooks';

function SessionBootstrap() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(hydrateFromStorage(loadSession()));

    const unsubscribe = store.subscribe(() => {
      const { userId, username } = store.getState().session;

      if (userId && username) {
        saveSession({ userId, username });
      } else {
        clearSession();
      }
    });

    return unsubscribe;
  }, [dispatch]);
  return null;
}

export function ReduxProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <SessionBootstrap />
      {children}
    </Provider>
  );
}

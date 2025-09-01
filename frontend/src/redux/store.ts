import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import sessionReducer from './slices/sessionSlice';
import searchReducer from './slices/searchSlice';
import userMoviesReducer, {
  addUserMovie,
  deleteUserMovie,
  editUserMovie,
  setFavorite,
} from './slices/userMoviesSlice';
import uiReducer, { showToast } from './slices/uiSlice';

const listener = createListenerMiddleware();

listener.startListening({
  actionCreator: addUserMovie.rejected,
  effect: async (action, api) => {
    const msg =
      (action.payload as string) || action.error.message || 'Add failed';
    api.dispatch(
      showToast({
        title: 'Add movie failed',
        description: msg,
        variant: 'error',
      })
    );
  },
});
listener.startListening({
  actionCreator: deleteUserMovie.rejected,
  effect: async (action, api) => {
    const msg = action.error.message || 'Delete failed';
    api.dispatch(
      showToast({ title: 'Delete failed', description: msg, variant: 'error' })
    );
  },
});
listener.startListening({
  actionCreator: editUserMovie.rejected,
  effect: async (action, api) => {
    const msg = action.error.message || 'Edit failed';
    api.dispatch(
      showToast({ title: 'Edit failed', description: msg, variant: 'error' })
    );
  },
});
listener.startListening({
  actionCreator: setFavorite.rejected,
  effect: async (action, api) => {
    const msg = action.error.message || 'Favorite failed';
    api.dispatch(
      showToast({
        title: 'Favorite failed',
        description: msg,
        variant: 'error',
      })
    );
  },
});

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    search: searchReducer,
    userMovies: userMoviesReducer,
    ui: uiReducer,
  },
  middleware: (getDefault) => getDefault().concat(listener.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

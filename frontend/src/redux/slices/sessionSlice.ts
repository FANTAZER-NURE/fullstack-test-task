import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { EnsureUserResponse } from '@/api/models';
import { postApi } from '@/api/httpClient';

export type SessionState = {
  userId: string | null;
  username: string | null;
};

const initialState: SessionState = {
  userId: null,
  username: null,
};

export const ensureUser = createAsyncThunk<
  EnsureUserResponse,
  { username: string }
>('session/ensureUser', async ({ username }) => {
  const trimmed = username.trim();

  return await postApi('/api/session/ensure-user', { username: trimmed });
});

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    hydrateFromStorage(
      state,
      action: PayloadAction<{ userId: string; username: string } | null>
    ) {
      if (action.payload) {
        state.userId = action.payload.userId;
        state.username = action.payload.username;
      }
    },
    setSession(
      state,
      action: PayloadAction<{ userId: string; username: string }>
    ) {
      state.userId = action.payload.userId;
      state.username = action.payload.username;
    },
    clearSession(state) {
      state.userId = null;
      state.username = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(ensureUser.fulfilled, (state, action) => {
      state.userId = action.payload.userId;
      state.username = action.payload.username;
    });
  },
});

export const { setSession, clearSession, hydrateFromStorage } =
  sessionSlice.actions;
export default sessionSlice.reducer;

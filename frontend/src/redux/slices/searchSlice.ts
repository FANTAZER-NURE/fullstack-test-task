import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { SearchResponse } from '@/api/models';
import { getApi } from '@/api/httpClient';

export type SearchState = {
  query: string;
  page: number;
  items: SearchResponse['items'];
  total: number;
  loading: boolean;
  error: string | null;
};

const initialState: SearchState = {
  query: '',
  page: 1,
  items: [],
  total: 0,
  loading: false,
  error: null,
};

export const fetchSearch = createAsyncThunk<
  SearchResponse,
  { query: string; page?: number }
>('search/fetch', async ({ query, page = 1 }) => {
  const res = await getApi('/api/search', { query, page });
  return res;
});

const slice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery(state, action) {
      state.query = action.payload;
    },
    clearResults(state) {
      state.items = [];
      state.total = 0;
      state.page = 1;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearch.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.query = action.meta.arg.query;
        state.page = action.meta.arg.page ?? 1;
      })
      .addCase(fetchSearch.fulfilled, (state, action) => {
        state.loading = false;
        const incomingPage = action.meta.arg.page ?? 1;
        const sameQuery = action.meta.arg.query === state.query;
        if (incomingPage > 1 && sameQuery) {
          state.items = [...state.items, ...action.payload.items];
          state.total = action.payload.total;
          state.page = incomingPage;
        } else {
          state.items = action.payload.items;
          state.total = action.payload.total;
          state.page = action.payload.page;
        }
      })
      .addCase(fetchSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error';
      });
  },
});

export const { setQuery, clearResults } = slice.actions;
export default slice.reducer;

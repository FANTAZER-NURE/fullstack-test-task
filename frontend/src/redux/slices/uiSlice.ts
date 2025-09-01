import { createSlice } from '@reduxjs/toolkit';

export type Toast = {
  id: string;
  title?: string;
  description?: string;
  variant?: 'success' | 'error' | 'info';
};

export type UIState = {
  addModalOpen: boolean;
  editModalOpen: boolean;
  deleteModalOpen: boolean;
  usernamePromptOpen: boolean;
  toasts: Toast[];
};

const initialState: UIState = {
  addModalOpen: false,
  editModalOpen: false,
  deleteModalOpen: false,
  usernamePromptOpen: false,
  toasts: [],
};

const slice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setAddModalOpen(state, action) {
      state.addModalOpen = !!action.payload;
    },
    setEditModalOpen(state, action) {
      state.editModalOpen = !!action.payload;
    },
    setDeleteModalOpen(state, action) {
      state.deleteModalOpen = !!action.payload;
    },
    setUsernamePromptOpen(state, action) {
      state.usernamePromptOpen = !!action.payload;
    },
    showToast(state, action) {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      state.toasts.push({ id, ...(action.payload || {}) });
      // Keep last 5 toasts
      if (state.toasts.length > 5) state.toasts.shift();
    },
    hideToast(state, action) {
      const id = action.payload as string;
      state.toasts = state.toasts.filter((t) => t.id !== id);
    },
  },
});

export const {
  setAddModalOpen,
  setEditModalOpen,
  setDeleteModalOpen,
  setUsernamePromptOpen,
  showToast,
  hideToast,
} = slice.actions;
export default slice.reducer;

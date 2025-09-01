import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ReduxProvider } from './redux/provider';
import '@radix-ui/themes/styles.css';
import './styles/global.scss';
import { Theme } from '@radix-ui/themes';
import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import UsernamePrompt from './components/common/UsernamePrompt';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { setUsernamePromptOpen } from './redux/slices/uiSlice';
import { ensureUser } from './redux/slices/sessionSlice';
import Toaster from './components/ui/Toaster';

function UsernamePromptMount() {
  const open = useAppSelector((s) => s.ui.usernamePromptOpen);
  const dispatch = useAppDispatch();
  return (
    <UsernamePrompt
      open={open}
      onClose={() => dispatch(setUsernamePromptOpen(false))}
      onSubmit={(username) => {
        dispatch(ensureUser({ username }));
        dispatch(setUsernamePromptOpen(false));
      }}
    />
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ReduxProvider>
        <Theme appearance="dark">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/movie/:id" element={<MovieDetailsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
          <UsernamePromptMount />
          <Toaster />
        </Theme>
      </ReduxProvider>
    </React.StrictMode>
  );
}

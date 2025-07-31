import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './i18n';
import './index.scss';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

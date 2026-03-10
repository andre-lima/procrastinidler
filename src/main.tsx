import { createRoot } from 'react-dom/client';
import './i18n';
import './386/src/styles/theme.css';
import './386/src/styles/navbar.css';
import './386/src/styles/ascii-progress-bar.css';
import './386/src/styles/window-container.css';
import './styles/spacing.css';
import './styles/typography.css';
import './styles/components.css';
import './index.scss';
import { initStoreWiring } from './store/store-wiring';
import App from './App.tsx';

initStoreWiring();
createRoot(document.getElementById('root')!).render(<App />);

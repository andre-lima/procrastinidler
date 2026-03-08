import { createRoot } from 'react-dom/client';
import './i18n';
import './styles/theme.css';
import './styles/spacing.css';
import './styles/typography.css';
import './styles/components.css';
import './index.scss';
import { initStoreWiring } from './store/store-wiring';
import App from './App.tsx';

initStoreWiring();
createRoot(document.getElementById('root')!).render(<App />);

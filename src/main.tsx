import { createRoot } from 'react-dom/client';
import './i18n';
import './386/src/styles/bundle.css';
import './index.scss';
import { initStoreWiring } from './store/store-wiring';
import App from './App.tsx';

initStoreWiring();
createRoot(document.getElementById('root')!).render(<App />);

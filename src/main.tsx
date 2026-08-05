import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register PWA Service Worker with Stale-While-Revalidate caching and cache-busting strategy
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Append unique cache-busting query parameter to force fetching the newest worker script
    const swUrl = `/sw.js?v=3.0.4-cb-${new Date().toDateString().replace(/\s+/g, '-')}`;
    navigator.serviceWorker.register(swUrl, { updateViaCache: 'none' }).then((reg) => {
      console.log('[PWA] Service Worker registered with cache busting:', reg.scope);
      // Explicitly trigger check for updates
      reg.update();
    }).catch((err) => {
      console.error('[PWA] Service Worker registration failed:', err);
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

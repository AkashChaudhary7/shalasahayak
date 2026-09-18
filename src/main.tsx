import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import './index.css';

// Register PWA Service Worker with Stale-While-Revalidate caching (Production only)
if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).then((reg) => {
        console.log('[PWA] Service Worker registered:', reg.scope);
        reg.update().catch(() => {/* Ignore background update checks if offline */});
      }).catch((err) => {
        console.warn('[PWA] Service Worker registration skipped or failed:', err);
      });
    });
  } else {
    // In dev mode, unregister any active service worker to prevent stale script caching
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

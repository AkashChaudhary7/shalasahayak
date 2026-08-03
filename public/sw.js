const CACHE_NAME = 'shala-sahayak-v3';
const DATA_CACHE_NAME = 'shala-sahayak-shivira-data-v3';

const STATIC_SHELL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/bg-pattern.svg',
  '/logo.svg',
  '/app-logo.svg',
  '/icon.svg'
];

// Install Event - Pre-cache core app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching core app shell');
      return cache.addAll(STATIC_SHELL_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Event - Clean up stale caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== DATA_CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Helper: Determine if request is for Shivira Academic Calendar, Help Guides, or Board Exam Utility Data
function isShiviraOrExamDataRequest(urlStr) {
  const url = urlStr.toLowerCase();
  return (
    url.includes('shivira') ||
    url.includes('calendar') ||
    url.includes('datesheet') ||
    url.includes('exam') ||
    url.includes('syllabus') ||
    url.includes('formats') ||
    url.includes('help') ||
    url.includes('data') ||
    url.includes('/api/') ||
    url.endsWith('.json')
  );
}

// Fetch Event - Handle Stale-While-Revalidate for Datasets & Cache-First for Shell Assets
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only intercept GET requests
  if (req.method !== 'GET') return;

  const url = req.url;

  // 1. STALE-WHILE-REVALIDATE Strategy for Shivira Calendar, Help Guides & Board Exam Utility Data
  if (isShiviraOrExamDataRequest(url)) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then((cache) => {
        return cache.match(req).then((cachedResponse) => {
          // Background network update
          const fetchPromise = fetch(req)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                cache.put(req, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch((err) => {
              console.warn('[ServiceWorker] Offline mode - using cached Shivira/Exam dataset:', err);
            });

          // Return cached version immediately if available for zero-latency, fallback to network
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // 2. Cache-First with Network Fallback Strategy for Static App Assets (JS, CSS, SVGs, Fonts)
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      if (cachedResponse) {
        // Background revalidation
        fetch(req).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(req, networkResponse));
          }
        }).catch(() => {/* Offline fallback active */});
        
        return cachedResponse;
      }

      return fetch(req)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          // If navigation fetch fails offline, serve main entry index.html
          if (req.mode === 'navigate') {
            return caches.match('/index.html') || caches.match('/');
          }
        });
    })
  );
});

// 3. BACKGROUND SYNC Support - Re-sync queued offline logs, feedbacks or data
self.addEventListener('sync', (event) => {
  console.log('[ServiceWorker] Background Sync Triggered. Tag:', event.tag);
  if (event.tag === 'sync-offline-feedback' || event.tag === 'sync-feedback') {
    event.waitUntil(
      syncOfflineFeedback()
    );
  }
});

// Helper for Background Sync simulation/processing
async function syncOfflineFeedback() {
  console.log('[ServiceWorker] Syncing cached school feedback, logs and PWA settings in background...');
  // Simulates offline log processing
  return Promise.resolve({ status: 'synchronized' });
}

// 4. PERIODIC BACKGROUND SYNC Support - Keeping Shivira Calendar & academic formats up to date
self.addEventListener('periodicsync', (event) => {
  console.log('[ServiceWorker] Periodic Background Sync Triggered. Tag:', event.tag);
  if (event.tag === 'sync-academic-calendar' || event.tag === 'sync-shivira-calendar') {
    event.waitUntil(
      periodicallyRefreshAcademicData()
    );
  }
});

// Helper for Periodic Background Sync
async function periodicallyRefreshAcademicData() {
  console.log('[ServiceWorker] Periodically updating academic and school calendar files in background cache...');
  try {
    const dataCache = await caches.open(DATA_CACHE_NAME);
    const apiEndPoints = [
      '/data/shivira-calendar.json',
      '/data/help-guides.json'
    ];
    for (const url of apiEndPoints) {
      try {
        const response = await fetch(url);
        if (response && response.status === 200) {
          await dataCache.put(url, response.clone());
          console.log(`[ServiceWorker] Periodic sync cache updated: ${url}`);
        }
      } catch (err) {
        console.warn(`[ServiceWorker] Periodic fetch failed for endpoint ${url}:`, err);
      }
    }
  } catch (err) {
    console.error('[ServiceWorker] Periodic background cache process error:', err);
  }
}

// 5. PUSH NOTIFICATIONS Support - Interactive alerts for important state events
self.addEventListener('push', (event) => {
  console.log('[ServiceWorker] Push Notification Event Triggered.');
  
  let payload = {
    title: 'शाला सहायक (Shala Sahayak) समाचार व अपडेट',
    body: 'राजस्थान शिक्षा विभाग का नया शिविरा कैलेंडर और आधिकारिक प्रपत्र अपलोड किए गए हैं।',
    icon: '/logo.svg',
    badge: '/logo.svg',
    tag: 'shala-sahayak-general-update',
    url: '/#shivira'
  };

  if (event.data) {
    try {
      const dataJson = event.data.json();
      payload = { ...payload, ...dataJson };
    } catch (e) {
      payload.body = event.data.text() || payload.body;
    }
  }

  const notificationOptions = {
    body: payload.body,
    icon: payload.icon || '/logo.svg',
    badge: payload.badge || '/logo.svg',
    tag: payload.tag,
    data: { url: payload.url },
    vibrate: [100, 50, 100],
    actions: [
      { action: 'open', title: 'देखें (View Now)' },
      { action: 'close', title: 'बंद करें (Close)' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, notificationOptions)
  );
});

// 6. NOTIFICATION CLICK Event - Handle routing on action selection
self.addEventListener('notificationclick', (event) => {
  console.log('[ServiceWorker] Notification clicked. Action:', event.action);
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const destination = event.notification.data?.url || '/';
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Look for a matching open tab
      for (const client of windowClients) {
        if (client.url.includes(destination) && 'focus' in client) {
          return client.focus();
        }
      }
      // If none open, launch a new tab
      if (self.clients.openWindow) {
        return self.clients.openWindow(destination);
      }
    })
  );
});

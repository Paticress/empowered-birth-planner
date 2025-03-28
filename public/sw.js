
// Set proper content type in the response header
// Type: application/javascript

importScripts('./sw/config.js');
importScripts('./sw/cacheManager.js');
importScripts('./sw/strategies.js');

// Service Worker main file
self.addEventListener('install', event => {
  event.waitUntil(
    cacheManager.precache(config.precacheItems, config.cacheName)
      .then(() => {
        logDebug('Precaching completed');
        return self.skipWaiting();
      })
      .catch(err => {
        logError('Precaching failed', err);
        throw err;
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    cacheManager.cleanOldCaches(config.cacheName, 'energia-materna-cache')
      .then(() => {
        logDebug('Old caches cleaned');
        return self.clients.claim();
      })
      .catch(err => {
        logError('Failed to clean old caches', err);
        throw err;
      })
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;

  // Skip cross-origin requests
  if (!request.url.startsWith(self.location.origin)) {
    return;
  }

  // HTML pages - network first strategy
  if (request.mode === 'navigate' || (request.method === 'GET' && request.headers.get('accept').includes('text/html'))) {
    event.respondWith(strategies.networkFirst(request, { cacheName: config.cacheName }));
    return;
  }

  // CSS, JS, fonts, images - cache first strategy
  if (
    request.url.match(/\.(css|js|woff2?|ttf|eot|png|jpe?g|gif|svg|webp)$/i) ||
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font' ||
    request.destination === 'image'
  ) {
    event.respondWith(strategies.cacheFirst(request, { cacheName: config.cacheName }));
    return;
  }

  // API requests - network first with timeout
  if (request.url.includes('/api/')) {
    event.respondWith(strategies.networkFirst(request, { 
      cacheName: config.cacheName,
      networkTimeoutSeconds: 5
    }));
    return;
  }

  // Default - stale-while-revalidate
  event.respondWith(strategies.staleWhileRevalidate(request, { cacheName: config.cacheName }));
});

// Listen for messages from the client
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'SET_DEBUG') {
    setDebugMode(event.data.value === true);
  }
});

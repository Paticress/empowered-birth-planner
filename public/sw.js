
// Simple Service Worker
// Ensures basic offline functionality and proper MIME type handling

// Cache name with version
const CACHE_NAME = 'energia-materna-cache-v3';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/src/main.js',
  '/src/main.jsx',
  '/src/main.tsx'
];

// Install event - cache critical assets
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching app shell and content');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Install completed');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[Service Worker] Install failed:', error);
      })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.filter(cacheName => {
            return cacheName.startsWith('energia-materna-cache-') && 
                   cacheName !== CACHE_NAME;
          }).map(cacheName => {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Activation complete!');
        return self.clients.claim();
      })
  );
});

// Fetch event - network first with cache fallback
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Special handling for favicon.ico
  if (event.request.url.includes('favicon.ico')) {
    event.respondWith(
      caches.match('/favicon.ico')
        .then(response => {
          if (response) {
            console.log('[Service Worker] Serving cached favicon');
            return response;
          }
          return fetch('/favicon.ico')
            .then(networkResponse => {
              if (networkResponse && networkResponse.ok) {
                const clonedResponse = networkResponse.clone();
                caches.open(CACHE_NAME).then(cache => {
                  cache.put('/favicon.ico', clonedResponse);
                });
                return networkResponse;
              }
              return new Response('', {
                status: 200,
                headers: new Headers({ 'Content-Type': 'image/x-icon' })
              });
            })
            .catch(() => {
              return new Response('', {
                status: 200,
                headers: new Headers({ 'Content-Type': 'image/x-icon' })
              });
            });
        })
    );
    return;
  }
  
  // Special handling for JavaScript files to ensure proper MIME types
  if (event.request.url.endsWith('.js') || event.request.url.endsWith('.jsx') || event.request.url.endsWith('.tsx')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone the response and set the correct MIME type
          const clonedResponse = response.clone();
          const headers = new Headers(clonedResponse.headers);
          headers.set('Content-Type', 'application/javascript; charset=utf-8');
          
          return new Response(clonedResponse.body, {
            status: clonedResponse.status,
            statusText: clonedResponse.statusText,
            headers: headers
          });
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // For HTML requests, use network first strategy
  if (event.request.mode === 'navigate' || 
      (event.request.method === 'GET' && 
       event.request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.ok) {
            const clonedResponse = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, clonedResponse);
            });
            return response;
          }
          throw new Error('Network response was not ok');
        })
        .catch(() => {
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              return caches.match('/index.html');
            });
        })
    );
    return;
  }
  
  // For other requests, try cache first then network
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request)
          .then(response => {
            if (response && response.ok) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseToCache);
              });
            }
            return response;
          });
      })
  );
});

// Message event handler
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

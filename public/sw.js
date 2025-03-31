
// Service Worker with improved MIME type handling
const CACHE_NAME = 'energia-materna-cache-v4';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/src/main.js'
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

// Fetch event with proper MIME type handling
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Handle JavaScript files specially
  if (event.request.url.endsWith('.js') || 
      event.request.url.endsWith('.jsx') || 
      event.request.url.endsWith('.tsx') || 
      event.request.url.endsWith('.mjs')) {
    
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone the response and ensure proper MIME type
          const clonedResponse = response.clone();
          const headers = new Headers(clonedResponse.headers);
          headers.set('Content-Type', 'application/javascript; charset=utf-8');
          
          // Cache the corrected response
          const correctedResponse = new Response(clonedResponse.body, {
            status: clonedResponse.status,
            statusText: clonedResponse.statusText,
            headers: headers
          });
          
          // Cache for future use
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, correctedResponse.clone());
          });
          
          return correctedResponse;
        })
        .catch(() => {
          // Fallback to cached version
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // For HTML requests (navigation)
  if (event.request.mode === 'navigate' || 
      (event.request.method === 'GET' && 
       event.request.headers.get('accept')?.includes('text/html'))) {
       
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache successful responses
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
          // Fallback to cache or index.html
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
  
  // Standard cache-first strategy for other requests
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

// Message handling for updates
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

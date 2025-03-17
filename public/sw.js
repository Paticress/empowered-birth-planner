
const CACHE_NAME = 'plano-parto-cache-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './assets/index.js',
  './assets/index.css',
  './favicon.ico',
  './manifest.json'
];

// Function to limit cache size
const limitCacheSize = (cacheName, maxItems) => {
  caches.open(cacheName).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > maxItems) {
        cache.delete(keys[0]).then(limitCacheSize(cacheName, maxItems));
      }
    });
  });
};

// Install event - cache initial resources
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS)
          .then(() => {
            // Notify the main thread about successful caching
            self.clients.matchAll().then(clients => {
              clients.forEach(client => {
                client.postMessage({
                  type: 'CACHED_RESOURCES',
                  count: STATIC_ASSETS.length
                });
              });
            });
            return self.skipWaiting();
          });
      })
      .catch(error => {
        console.error('Service Worker: Cache initialization failed:', error);
      })
  );
});

// Fetch event with network-first strategy for API requests and cache-first for static assets
self.addEventListener('fetch', event => {
  // Don't cache browser-sync requests in development
  if (event.request.url.includes('browser-sync')) {
    return;
  }
  
  // Parse the URL
  const requestUrl = new URL(event.request.url);
  
  // Use different strategies based on the request type
  if (requestUrl.origin === location.origin && STATIC_ASSETS.some(asset => requestUrl.pathname.endsWith(asset))) {
    // Cache-first for static assets
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          return cachedResponse || fetch(event.request).then(fetchResponse => {
            return caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, fetchResponse.clone());
              return fetchResponse;
            });
          });
        })
        .catch(() => {
          // Return fallback for image files
          if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
            return caches.match('/placeholder.svg');
          }
          return caches.match('./index.html');
        })
    );
  } else {
    // Network-first for everything else
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone the response
          const responseClone = response.clone();
          
          // Open the cache
          caches.open(CACHE_NAME).then(cache => {
            // Only cache successful responses
            if (response.status === 200) {
              cache.put(event.request, responseClone);
            }
            
            // Limit the cache size
            limitCacheSize(CACHE_NAME, 100);
          });
          
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then(cachedResponse => {
            return cachedResponse || caches.match('./index.html');
          });
        })
    );
  }
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activated');
      return self.clients.claim();
    })
  );
});

// Listen for messages from the main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('Service Worker: Skip waiting and activate now');
    self.skipWaiting();
  }
});

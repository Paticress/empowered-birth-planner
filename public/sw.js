const CACHE_NAME = 'plano-parto-cache-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './assets/index.js',
  './assets/index.css',
  './favicon.ico',
  './manifest.json'
];

// Function to limit cache size with improved efficiency
const limitCacheSize = async (cacheName, maxItems) => {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    if (keys.length > maxItems) {
      // Delete oldest items in bulk for better performance
      const deletePromises = keys.slice(0, keys.length - maxItems).map(key => cache.delete(key));
      await Promise.all(deletePromises);
    }
  } catch (err) {
    console.error('Cache size limiting failed:', err);
  }
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

// Fetch event with optimized caching strategies
self.addEventListener('fetch', event => {
  // Don't cache browser-sync or analytics requests
  if (event.request.url.includes('browser-sync') || 
      event.request.url.includes('analytics') ||
      event.request.url.includes('chrome-extension')) {
    return;
  }
  
  // Parse the URL
  const requestUrl = new URL(event.request.url);
  
  // Handle different request types efficiently
  if (requestUrl.origin === location.origin) {
    // Cache static assets aggressively
    const isStaticAsset = STATIC_ASSETS.some(asset => requestUrl.pathname.endsWith(asset)) || 
                         requestUrl.pathname.match(/\.(js|css|png|jpg|jpeg|svg|ico|woff|woff2|ttf|eot)$/);
    
    if (isStaticAsset) {
      // Cache-first for static assets
      event.respondWith(
        caches.match(event.request)
          .then(cachedResponse => {
            if (cachedResponse) {
              // Return cached response immediately
              return cachedResponse;
            }
            
            // If not in cache, fetch from network and cache
            return fetch(event.request)
              .then(fetchResponse => {
                if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                  return fetchResponse;
                }
                
                // Cache the fetched response (use clone because response can only be used once)
                const responseToCache = fetchResponse.clone();
                caches.open(CACHE_NAME)
                  .then(cache => {
                    cache.put(event.request, responseToCache);
                  });
                  
                return fetchResponse;
              })
              .catch(() => {
                // Fallback for image files if fetch fails
                if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
                  return caches.match('/placeholder.svg');
                }
              });
          })
      );
    } else {
      // For HTML pages (routes) - network first, fallback to cache
      if (requestUrl.pathname.endsWith('/') || requestUrl.pathname.endsWith('.html') || !requestUrl.pathname.includes('.')) {
        event.respondWith(
          fetch(event.request)
            .then(response => {
              // Cache the latest version of the page
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
              return response;
            })
            .catch(() => {
              // If network fails, try to return the cached version
              return caches.match(event.request)
                .then(cachedResponse => {
                  if (cachedResponse) {
                    return cachedResponse;
                  }
                  // If not in cache, fallback to index.html for SPA routing
                  return caches.match('./index.html');
                });
            })
        );
      } else {
        // For API requests or other dynamic content - network first with timeout
        event.respondWith(
          Promise.race([
            // Network request with timeout
            new Promise((resolve, reject) => {
              setTimeout(() => reject(new Error('Network timeout')), 3000);
              fetch(event.request).then(resolve, reject);
            }),
            // Fallback to cache after timeout
            new Promise(resolve => {
              setTimeout(() => {
                caches.match(event.request).then(cachedResponse => {
                  if (cachedResponse) resolve(cachedResponse);
                });
              }, 3000);
            })
          ])
          .catch(() => {
            // If both network and cache fail, try the generic fallback
            return caches.match('./index.html');
          })
        );
      }
    }
  } else {
    // For cross-origin requests - attempt network, don't cache
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // For cross-origin images, try placeholder
          if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
            return caches.match('/placeholder.svg');
          }
          // Otherwise just fail
          return new Response('Network error occurred', {
            status: 408,
            headers: { 'Content-Type': 'text/plain' }
          });
        })
    );
  }
});

// Activate event - clean up old caches efficiently
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

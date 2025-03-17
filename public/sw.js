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
      // Use more efficient batch delete operation
      await Promise.all(
        keys.slice(0, keys.length - maxItems).map(key => cache.delete(key))
      );
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
  // Skip caching for certain requests
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
      // Use stale-while-revalidate for better performance
      event.respondWith(
        caches.match(event.request)
          .then(cachedResponse => {
            // Return cached response immediately
            if (cachedResponse) {
              // Start a background fetch to update the cache
              const fetchPromise = fetch(event.request)
                .then(networkResponse => {
                  if (networkResponse && networkResponse.status === 200) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                      cache.put(event.request, responseToCache);
                    });
                  }
                  return networkResponse;
                })
                .catch(() => {/* Silently fail background fetch */});
                
              // Don't wait for the fetch to complete
              fetchPromise; // This executes but doesn't block
              return cachedResponse;
            }
            
            // If not in cache, fetch from network
            return fetch(event.request)
              .then(fetchResponse => {
                if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                  return fetchResponse;
                }
                
                // Cache the fetched response
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
      // For HTML pages - network first with fast timeout
      if (requestUrl.pathname.endsWith('/') || requestUrl.pathname.endsWith('.html') || !requestUrl.pathname.includes('.')) {
        event.respondWith(
          Promise.race([
            // Network request with shorter timeout
            new Promise((resolve, reject) => {
              setTimeout(() => reject(new Error('Network timeout')), 2000); // Reduced from 3000
              fetch(event.request).then(resolve, reject);
            }),
            // Fallback to cache after timeout
            new Promise(resolve => {
              setTimeout(() => {
                caches.match(event.request).then(cachedResponse => {
                  if (cachedResponse) resolve(cachedResponse);
                });
              }, 2000); // Reduced from 3000
            })
          ])
          .catch(() => caches.match('./index.html'))
        );
      } else {
        // For API requests - network first with timeout
        event.respondWith(
          Promise.race([
            // Network request with timeout
            new Promise((resolve, reject) => {
              setTimeout(() => reject(new Error('Network timeout')), 2000);
              fetch(event.request).then(resolve, reject);
            }),
            // Fallback to cache after timeout
            new Promise(resolve => {
              setTimeout(() => {
                caches.match(event.request).then(cachedResponse => {
                  if (cachedResponse) resolve(cachedResponse);
                });
              }, 2000);
            })
          ])
          .catch(() => caches.match('./index.html'))
        );
      }
    }
  } else {
    // For cross-origin requests - attempt network with faster timeout
    event.respondWith(
      Promise.race([
        new Promise((resolve, reject) => {
          setTimeout(() => reject(new Error('Network timeout')), 3000);
          fetch(event.request).then(resolve, reject);
        }),
        new Promise(resolve => {
          setTimeout(() => {
            // After timeout, go with a basic network error
            resolve(new Response('Network error occurred', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            }));
          }, 3000);
        })
      ])
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
      // Manage cache size after activation
      limitCacheSize(CACHE_NAME, 75); // Limit to 75 items
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

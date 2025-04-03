
// Import our modular service worker files
importScripts('./sw/config.js');
importScripts('./sw/cacheManager.js');
importScripts('./sw/strategies.js');

// Use the imported modules
const { limitCacheSize, cleanupCaches } = self.cacheManager;
const { staleWhileRevalidate, networkFirstWithTimeout, crossOriginWithTimeout } = self.strategies;

// Install event - cache initial resources
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(self.CONFIG.CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(self.CONFIG.STATIC_ASSETS)
          .then(() => {
            // Notify the main thread about successful caching
            self.clients.matchAll().then(clients => {
              clients.forEach(client => {
                client.postMessage({
                  type: 'CACHED_RESOURCES',
                  count: self.CONFIG.STATIC_ASSETS.length
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
  
  try {
    // Parse the URL
    const requestUrl = new URL(event.request.url);
    
    // Handle different request types efficiently
    if (requestUrl.origin === location.origin) {
      // Cache static assets aggressively
      const isStaticAsset = self.CONFIG.STATIC_ASSETS.some(asset => requestUrl.pathname.endsWith(asset)) || 
                         requestUrl.pathname.match(/\.(js|css|png|jpg|jpeg|svg|ico|woff|woff2|ttf|eot)$/);
      
      if (isStaticAsset) {
        // Use stale-while-revalidate for better performance
        event.respondWith(staleWhileRevalidate(event.request));
      } else {
        // For HTML pages - network first with fast timeout
        if (requestUrl.pathname.endsWith('/') || requestUrl.pathname.endsWith('.html') || !requestUrl.pathname.includes('.')) {
          event.respondWith(networkFirstWithTimeout(event.request));
        } else {
          // For API requests - network first with timeout
          event.respondWith(networkFirstWithTimeout(event.request));
        }
      }
    } else {
      // For cross-origin requests - attempt network with faster timeout
      event.respondWith(crossOriginWithTimeout(event.request));
    }
  } catch (error) {
    console.error('Service Worker fetch error:', error);
    // Let the browser handle the request normally if there's an error
  }
});

// Activate event - clean up old caches 
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    cleanupCaches().then(() => {
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

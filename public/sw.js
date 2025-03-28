
// Service Worker file

// Import utility modules
importScripts('./sw/config.js');
importScripts('./sw/cacheManager.js');
importScripts('./sw/strategies.js');

// Cache name with version for better cache management
const CACHE_NAME = 'energia-materna-cache-v1';

// List of assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/domain-test.txt',
  // Add CSS and JS entries that will be created by the build
  // These paths will be populated during runtime
];

// Additional runtime caching rules
const RUNTIME_CACHE_RULES = [
  // Cache images with a cache-first strategy
  {
    urlPattern: /\.(?:png|jpg|jpeg|gif|webp|svg|ico)$/,
    handler: 'CacheFirst',
    options: {
      cacheName: 'images-cache',
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      },
    },
  },
  // Cache fonts with a cache-first strategy
  {
    urlPattern: /\.(?:woff|woff2|ttf|eot)$/,
    handler: 'CacheFirst',
    options: {
      cacheName: 'fonts-cache',
      expiration: {
        maxEntries: 20,
        maxAgeSeconds: 60 * 24 * 60 * 60, // 60 days
      },
    },
  },
  // Cache API responses with a network-first strategy
  {
    urlPattern: /^https:\/\/api\./,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'api-cache',
      networkTimeoutSeconds: 10,
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 minutes
      },
    },
  },
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Error caching static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // Delete old version caches
              return cacheName.startsWith('energia-materna-cache-') && cacheName !== CACHE_NAME;
            })
            .map((cacheName) => {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('Service Worker: Claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch event - respond with cached resources or fetch from network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip browser-sync and chrome-extension requests
  const url = new URL(event.request.url);
  if (
    url.hostname === 'localhost' ||
    url.hostname.includes('browser-sync') ||
    event.request.url.includes('chrome-extension')
  ) {
    return;
  }

  // For SPA navigation requests, use network-first then fallback to index.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match('/index.html');
        })
    );
    return;
  }

  // Apply specific caching strategies based on URL patterns
  for (const rule of RUNTIME_CACHE_RULES) {
    if (new RegExp(rule.urlPattern).test(event.request.url)) {
      let strategy;
      switch (rule.handler) {
        case 'CacheFirst':
          strategy = strategies.cacheFirst;
          break;
        case 'NetworkFirst':
          strategy = strategies.networkFirst;
          break;
        case 'StaleWhileRevalidate':
          strategy = strategies.staleWhileRevalidate;
          break;
        default:
          strategy = strategies.networkFirst;
      }
      
      event.respondWith(strategy(event.request, rule.options));
      return;
    }
  }

  // Default strategy is network first for all other requests
  event.respondWith(strategies.networkFirst(event.request));
});

// Listen for message events (e.g., from the main thread)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Periodic sync event (if supported)
if ('periodicsync' in self.registration) {
  self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'content-update') {
      event.waitUntil(updateContent());
    }
  });
}

// Function to update content
async function updateContent() {
  try {
    // Add logic to update content in the cache
    const cache = await caches.open(CACHE_NAME);
    await cache.add('/index.html'); // Re-fetch the main HTML
    
    // Notify all clients about the update
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'CONTENT_UPDATED',
        timestamp: new Date().toISOString()
      });
    });
    
    return true;
  } catch (error) {
    console.error('Error updating content:', error);
    return false;
  }
}

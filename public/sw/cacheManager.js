
// Cache manager functions for service worker

// Imported from config.js through the service worker
const CONFIG = self.CONFIG;

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

// Clean up old caches
const cleanupCaches = async () => {
  const cacheWhitelist = [CONFIG.CACHE_NAME];
  
  const cacheNames = await caches.keys();
  const deletionPromises = cacheNames.map(cacheName => {
    if (cacheWhitelist.indexOf(cacheName) === -1) {
      console.log('Service Worker: Deleting old cache:', cacheName);
      return caches.delete(cacheName);
    }
  });
  
  await Promise.all(deletionPromises);
  console.log('Service Worker: Activated');
  
  // Manage cache size after activation
  await limitCacheSize(CONFIG.CACHE_NAME, CONFIG.MAX_CACHE_ITEMS);
};

// Export for use in main service worker
self.cacheManager = {
  limitCacheSize,
  cleanupCaches
};

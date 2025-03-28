
/* Cache Manager for Service Worker */
// Content-Type: application/javascript

// Cache manager to handle common caching operations
const cacheManager = {
  // Add items to cache
  async addToCache(cacheName, request, response) {
    const cache = await caches.open(cacheName);
    cache.put(request, response);
    return true;
  },
  
  // Get response from cache
  async getFromCache(request, cacheName) {
    const cache = await caches.open(cacheName);
    return cache.match(request);
  },
  
  // Delete items from cache
  async removeFromCache(cacheName, request) {
    const cache = await caches.open(cacheName);
    return cache.delete(request);
  },
  
  // Clean old caches
  async cleanOldCaches(currentCacheName, prefix) {
    const cacheNames = await caches.keys();
    const oldCaches = cacheNames.filter(name => 
      name.startsWith(prefix) && name !== currentCacheName
    );
    
    return Promise.all(
      oldCaches.map(cacheName => caches.delete(cacheName))
    );
  },
  
  // Precache assets on install
  async precache(assets, cacheName) {
    const cache = await caches.open(cacheName);
    return cache.addAll(assets);
  }
};

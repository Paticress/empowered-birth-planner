
/* Caching Strategies for Service Worker */

// Collection of common caching strategies
const strategies = {
  // Network first: Try network, fall back to cache
  async networkFirst(request, options = {}) {
    const cacheName = options.cacheName || 'default-cache';
    const timeout = options.networkTimeoutSeconds || 3;
    
    try {
      // Try network first with timeout
      const networkPromise = Promise.race([
        fetch(request.clone()),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Network timeout')), timeout * 1000)
        )
      ]);
      
      const response = await networkPromise;
      
      // If successful, clone and cache response
      if (response.ok) {
        const responseToCache = response.clone();
        caches.open(cacheName).then(cache => 
          cache.put(request, responseToCache)
        );
      }
      
      return response;
    } catch (error) {
      // On network failure, try cache
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // If no cache, try a simpler fetch as last resort
      return fetch(request);
    }
  },
  
  // Cache first: Try cache, fall back to network
  async cacheFirst(request, options = {}) {
    const cacheName = options.cacheName || 'default-cache';
    
    // Try the cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // On cache miss, use the network
    try {
      const networkResponse = await fetch(request.clone());
      if (networkResponse.ok) {
        // Cache the network response for future
        const cache = await caches.open(cacheName);
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      // Complete failure
      throw error;
    }
  },
  
  // Stale-while-revalidate: Return cached version immediately, then update
  async staleWhileRevalidate(request, options = {}) {
    const cacheName = options.cacheName || 'default-cache';
    
    // Try to get from cache
    const cachedResponse = await caches.match(request);
    
    // Fetch from network to update cache
    const fetchPromise = fetch(request.clone()).then(async response => {
      if (response.ok) {
        const cache = await caches.open(cacheName);
        await cache.put(request, response.clone());
      }
      return response;
    }).catch(error => {
      console.error('Failed to fetch and update cache:', error);
    });
    
    // Return the cached response immediately or wait for the network
    return cachedResponse || fetchPromise;
  }
};

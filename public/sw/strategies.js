import CONFIG from './config.js';

// Stale-while-revalidate strategy for static assets
export const staleWhileRevalidate = async (request) => {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Start a background fetch to update the cache
    fetch(request)
      .then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CONFIG.CACHE_NAME).then(cache => {
            cache.put(request, responseToCache);
          });
        }
      })
      .catch(() => {/* Silently fail background fetch */});
      
    return cachedResponse;
  }
  
  // If not in cache, fetch from network
  const fetchResponse = await fetch(request);
  if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
    return fetchResponse;
  }
  
  // Cache the fetched response
  const responseToCache = fetchResponse.clone();
  caches.open(CONFIG.CACHE_NAME)
    .then(cache => {
      cache.put(request, responseToCache);
    });
    
  return fetchResponse;
};

// Network-first with timeout strategy for HTML/dynamic content
export const networkFirstWithTimeout = async (request) => {
  return Promise.race([
    // Network request with shorter timeout
    new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error('Network timeout')), CONFIG.NETWORK_TIMEOUT);
      fetch(request).then(resolve, reject);
    }),
    // Fallback to cache after timeout
    new Promise(resolve => {
      setTimeout(() => {
        caches.match(request).then(cachedResponse => {
          if (cachedResponse) resolve(cachedResponse);
        });
      }, CONFIG.NETWORK_TIMEOUT);
    })
  ])
  .catch(() => caches.match('./index.html'));
};

// Cross-origin request handling with timeout
export const crossOriginWithTimeout = async (request) => {
  return Promise.race([
    new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error('Network timeout')), CONFIG.CROSS_ORIGIN_TIMEOUT);
      fetch(request).then(resolve, reject);
    }),
    new Promise(resolve => {
      setTimeout(() => {
        // After timeout, go with a basic network error
        resolve(new Response('Network error occurred', {
          status: 408,
          headers: { 'Content-Type': 'text/plain' }
        }));
      }, CONFIG.CROSS_ORIGIN_TIMEOUT);
    })
  ])
  .catch(() => {
    // For cross-origin images, try placeholder
    if (request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
      return caches.match('/placeholder.svg');
    }
    // Otherwise just fail
    return new Response('Network error occurred', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' }
    });
  });
};

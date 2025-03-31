// Simple CORS proxy script that can be included in the page
// This script intercepts fetch requests to problematic domains and routes them through a CORS proxy
(function() {
  console.log("CORS Proxy helper loaded");
  
  // Original fetch function
  const originalFetch = window.fetch;
  
  // List of problematic domains that need proxying
  const problematicDomains = [
    'unpkg.com',
    'cdn.jsdelivr.net'
  ];
  
  // Proxy URL - you can replace this with your own CORS proxy
  const corsProxyUrl = 'https://corsproxy.io/?';
  
  // Override fetch
  window.fetch = function(resource, init) {
    // Check if the resource is a string URL
    if (typeof resource === 'string') {
      // Check if this URL is from a problematic domain
      const needsProxy = problematicDomains.some(domain => resource.includes(domain));
      
      if (needsProxy) {
        console.log("Proxying request to:", resource);
        // Return the proxied request
        return originalFetch(corsProxyUrl + encodeURIComponent(resource), init);
      }
    }
    
    // Otherwise, use the original fetch
    return originalFetch(resource, init);
  };
  
  console.log("Fetch function has been patched to handle CORS issues");
})();

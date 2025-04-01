
// Override fetch and XMLHttpRequest for CORS handling
(function() {
  console.log("[Fetch Override] Setting up fetch and XHR overrides");
  
  // Reference to config
  const config = window.__proxyConfig || {
    problematicDomains: [],
    trustedDomains: [],
    corsProxies: ['https://corsproxy.io/?'],
    currentProxyIndex: 0
  };
  
  // Store the original fetch function
  const originalFetch = window.fetch;
  
  // Check if a URL is from a trusted domain that doesn't need proxying
  const isTrustedDomain = (url) => {
    if (typeof url !== 'string') return false;
    return config.trustedDomains.some(domain => url.includes(domain));
  };
  
  // Function to try fetching with different proxies
  const fetchWithProxy = async (url, init, proxyIndex = 0) => {
    if (proxyIndex >= config.corsProxies.length) {
      console.error("[Fetch Override] All proxies failed for URL:", url);
      
      // Check if resource exists before fallback
      try {
        // Try a HEAD request first to check if the resource exists
        const checkResponse = await originalFetch(url, { 
          method: 'HEAD',
          mode: 'cors',
          credentials: 'omit',
          cache: 'no-store'
        });
        
        if (!checkResponse.ok && checkResponse.status === 404) {
          console.warn("[Fetch Override] Resource not found (404) at:", url);
          return new Response(
            JSON.stringify({ error: 'Resource not found', url }),
            { status: 404, headers: { 'Content-Type': 'application/json' } }
          );
        }
      } catch (headError) {
        console.warn("[Fetch Override] HEAD check failed:", headError);
      }
      
      // Last resort: try without proxy but with modified headers
      try {
        const modifiedInit = { ...init };
        if (!modifiedInit.headers) modifiedInit.headers = {};
        modifiedInit.headers['X-Requested-With'] = 'XMLHttpRequest';
        modifiedInit.mode = 'cors';
        modifiedInit.credentials = 'omit';
        
        console.log("[Fetch Override] Trying direct request with modified headers");
        return originalFetch(url, modifiedInit);
      } catch (error) {
        console.error("[Fetch Override] Modified direct request also failed:", error);
        throw error;
      }
    }
    
    const proxyUrl = config.corsProxies[proxyIndex] + encodeURIComponent(url);
    console.log(`[Fetch Override] Trying proxy ${proxyIndex + 1}/${config.corsProxies.length}: ${config.corsProxies[proxyIndex]}`);
    
    try {
      const response = await originalFetch(proxyUrl, init);
      if (response.ok) {
        config.currentProxyIndex = proxyIndex; // Remember which proxy worked
        return response;
      }
      // Check for 404 specifically
      if (response.status === 404) {
        console.warn("[Fetch Override] Resource not found (404) at:", url);
        // Return a proper 404 response rather than continuing to try other proxies
        return new Response(
          JSON.stringify({ error: 'Resource not found', url }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`Proxy returned status ${response.status}`);
    } catch (error) {
      console.warn(`[Fetch Override] Proxy ${proxyIndex + 1} failed:`, error);
      return fetchWithProxy(url, init, proxyIndex + 1);
    }
  };
  
  // Override fetch
  window.fetch = function(resource, init) {
    // Skip if resource is not a string URL
    if (typeof resource !== 'string') {
      return originalFetch(resource, init);
    }
    
    // Skip for trusted domains
    if (isTrustedDomain(resource)) {
      return originalFetch(resource, init);
    }
    
    // Check if this URL is from a problematic domain
    const needsProxy = config.problematicDomains.some(domain => resource.includes(domain));
    
    if (needsProxy) {
      console.log("[Fetch Override] Proxying request:", resource);
      return fetchWithProxy(resource, init, config.currentProxyIndex);
    }
    
    // Otherwise, use the original fetch
    return originalFetch(resource, init);
  };
  
  // Also patch XMLHttpRequest for scripts that use it instead of fetch
  const originalXHROpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...rest) {
    if (typeof url === 'string') {
      // Skip for trusted domains
      if (isTrustedDomain(url)) {
        return originalXHROpen.call(this, method, url, ...rest);
      }
      
      const needsProxy = config.problematicDomains.some(domain => url.includes(domain));
      
      if (needsProxy) {
        console.log("[Fetch Override] Proxying XHR request:", url);
        const proxyUrl = config.corsProxies[config.currentProxyIndex] + encodeURIComponent(url);
        return originalXHROpen.call(this, method, proxyUrl, ...rest);
      }
    }
    return originalXHROpen.call(this, method, url, ...rest);
  };

  console.log("[Fetch Override] Fetch and XHR have been patched to handle CORS issues");
})();


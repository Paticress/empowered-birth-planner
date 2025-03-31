
// Enhanced CORS proxy script that intercepts problematic requests
(function() {
  console.log("[CORS Proxy] Enhanced proxy helper loaded");
  
  // Store the original fetch function
  const originalFetch = window.fetch;
  
  // List of problematic domains that need proxying
  const problematicDomains = [
    'unpkg.com',
    'cdn.jsdelivr.net',
    'esm.sh',
    'cdnjs.cloudflare.com',
    'react-router-dom'
  ];
  
  // List of CORS proxy URLs to try in sequence
  const corsProxies = [
    'https://corsproxy.io/?',
    'https://cors-anywhere.herokuapp.com/',
    'https://cors.bridged.cc/'
  ];
  
  // Keep track of which proxy is currently working
  let currentProxyIndex = 0;
  
  // Function to try fetching with different proxies
  const fetchWithProxy = async (url, init, proxyIndex = 0) => {
    if (proxyIndex >= corsProxies.length) {
      console.error("[CORS Proxy] All proxies failed for URL:", url);
      
      // Last resort: try without proxy but with modified headers
      try {
        const modifiedInit = { ...init };
        if (!modifiedInit.headers) modifiedInit.headers = {};
        modifiedInit.headers['X-Requested-With'] = 'XMLHttpRequest';
        modifiedInit.mode = 'cors';
        modifiedInit.credentials = 'omit';
        
        console.log("[CORS Proxy] Trying direct request with modified headers");
        return originalFetch(url, modifiedInit);
      } catch (error) {
        console.error("[CORS Proxy] Modified direct request also failed:", error);
        throw error;
      }
    }
    
    const proxyUrl = corsProxies[proxyIndex] + encodeURIComponent(url);
    console.log(`[CORS Proxy] Trying proxy ${proxyIndex + 1}/${corsProxies.length}: ${corsProxies[proxyIndex]}`);
    
    try {
      const response = await originalFetch(proxyUrl, init);
      if (response.ok) {
        currentProxyIndex = proxyIndex; // Remember which proxy worked
        return response;
      }
      throw new Error(`Proxy returned status ${response.status}`);
    } catch (error) {
      console.warn(`[CORS Proxy] Proxy ${proxyIndex + 1} failed:`, error);
      return fetchWithProxy(url, init, proxyIndex + 1);
    }
  };
  
  // Override fetch
  window.fetch = function(resource, init) {
    // Skip if resource is not a string URL
    if (typeof resource !== 'string') {
      return originalFetch(resource, init);
    }
    
    // Check if this URL is from a problematic domain
    const needsProxy = problematicDomains.some(domain => resource.includes(domain));
    
    if (needsProxy) {
      console.log("[CORS Proxy] Proxying request:", resource);
      return fetchWithProxy(resource, init, currentProxyIndex);
    }
    
    // Otherwise, use the original fetch
    return originalFetch(resource, init);
  };
  
  // Also patch XMLHttpRequest for scripts that use it instead of fetch
  const originalXHROpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...rest) {
    if (typeof url === 'string') {
      const needsProxy = problematicDomains.some(domain => url.includes(domain));
      
      if (needsProxy) {
        console.log("[CORS Proxy] Proxying XHR request:", url);
        const proxyUrl = corsProxies[currentProxyIndex] + encodeURIComponent(url);
        return originalXHROpen.call(this, method, proxyUrl, ...rest);
      }
    }
    return originalXHROpen.call(this, method, url, ...rest);
  };
  
  // Create direct script loading helper
  window.__loadScriptWithCORS = function(src, callback, attributes = {}) {
    console.log("[CORS Proxy] Loading script with CORS support:", src);
    const needsProxy = problematicDomains.some(domain => src.includes(domain));
    
    const script = document.createElement('script');
    if (needsProxy) {
      // For script tags, we need to fetch the content and create an inline script
      console.log("[CORS Proxy] Fetching script content for:", src);
      fetch(src) // This will use our proxied fetch
        .then(response => response.text())
        .then(content => {
          script.textContent = content;
          // Apply attributes
          Object.keys(attributes).forEach(key => {
            script.setAttribute(key, attributes[key]);
          });
          script.onload = callback;
          document.head.appendChild(script);
        })
        .catch(error => {
          console.error("[CORS Proxy] Failed to load script:", src, error);
          // Try using a script tag directly with the proxy URL as a fallback
          const fallbackScript = document.createElement('script');
          fallbackScript.src = corsProxies[currentProxyIndex] + encodeURIComponent(src);
          Object.keys(attributes).forEach(key => {
            fallbackScript.setAttribute(key, attributes[key]);
          });
          fallbackScript.onload = callback;
          fallbackScript.onerror = error => {
            console.error("[CORS Proxy] Fallback script load failed:", error);
            // Try loading from local fallback
            if (src.includes('react-router-dom')) {
              console.log("[CORS Proxy] Trying local fallback for React Router");
              const localScript = document.createElement('script');
              localScript.src = '/assets/react-cdn-fallback.js';
              localScript.onload = callback;
              document.head.appendChild(localScript);
            }
          };
          document.head.appendChild(fallbackScript);
        });
    } else {
      // For non-problematic domains, load normally
      script.src = src;
      Object.keys(attributes).forEach(key => {
        script.setAttribute(key, attributes[key]);
      });
      script.onload = callback;
      document.head.appendChild(script);
    }
    
    return script;
  };
  
  // Directly inject React Router DOM if needed
  if (typeof window.ReactRouterDOM === 'undefined') {
    console.log("[CORS Proxy] ReactRouterDOM not found, attempting to inject it");
    
    // Create a simple version that will prevent errors until the real one loads
    window.ReactRouterDOM = {
      HashRouter: function(props) { return props.children || null; },
      Routes: function(props) { return props.children || null; },
      Route: function() { return null; },
      Navigate: function() { return null; },
      Link: function(props) { return props.children || null; },
      useNavigate: function() { return function() {}; },
      useParams: function() { return {}; },
      useLocation: function() { return { pathname: '/' }; }
    };
    
    // Try to load the real one
    setTimeout(() => {
      const script = document.createElement('script');
      script.src = '/assets/react-cdn-fallback.js';
      script.onload = () => console.log("[CORS Proxy] Loaded React Router fallback");
      document.head.appendChild(script);
    }, 100);
  }
  
  console.log("[CORS Proxy] Fetch and XHR have been patched to handle CORS issues");
})();

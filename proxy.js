
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
    'cdn.gpteng.co',
    'react-router-dom'
  ];
  
  // Trusted domains that should not be proxied
  const trustedDomains = [
    'energiamaterna.com.br',
    'planodeparto.energiamaterna.com.br',
    'localhost'
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
  
  // Check if a URL is from a trusted domain that doesn't need proxying
  const isTrustedDomain = (url) => {
    if (typeof url !== 'string') return false;
    return trustedDomains.some(domain => url.includes(domain));
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
      // Skip for trusted domains
      if (isTrustedDomain(url)) {
        return originalXHROpen.call(this, method, url, ...rest);
      }
      
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
    
    // Skip for trusted domains
    if (isTrustedDomain(src)) {
      const script = document.createElement('script');
      script.src = src;
      script.type = 'text/javascript';
      Object.keys(attributes).forEach(key => {
        script.setAttribute(key, attributes[key]);
      });
      script.onload = callback;
      document.head.appendChild(script);
      return script;
    }
    
    const needsProxy = problematicDomains.some(domain => src.includes(domain));
    
    const script = document.createElement('script');
    
    // For problematic scripts, let's try to use an inline script approach
    if (needsProxy) {
      try {
        // First try direct loading
        script.src = src;
        script.type = 'text/javascript';
        
        // Special case for GPT Engineer script
        if (src.includes('cdn.gpteng.co')) {
          script.setAttribute('crossorigin', 'anonymous');
          // Remove type="module" which can cause CSP issues
          if (attributes.type === 'module') {
            delete attributes.type;
          }
        }
        
        Object.keys(attributes).forEach(key => {
          script.setAttribute(key, attributes[key]);
        });
        script.onload = callback;
        script.onerror = function(error) {
          console.warn("[CORS Proxy] Direct script loading failed, trying fetch approach:", error);
          
          // If direct loading fails, try the fetch approach
          fetch(src)
            .then(response => response.text())
            .then(content => {
              // Create an inline script
              const inlineScript = document.createElement('script');
              inlineScript.textContent = content;
              inlineScript.type = 'text/javascript';
              Object.keys(attributes).forEach(key => {
                if (key !== 'src' && key !== 'type') { // Don't copy src and type
                  inlineScript.setAttribute(key, attributes[key]);
                }
              });
              inlineScript.onload = callback;
              document.head.appendChild(inlineScript);
            })
            .catch(error => {
              console.error("[CORS Proxy] Failed to load script content:", error);
              // Try with local fallback
              loadLocalFallback();
            });
        };
        document.head.appendChild(script);
      } catch (error) {
        console.error("[CORS Proxy] Error during script loading:", error);
        loadLocalFallback();
      }
    } else {
      // For non-problematic domains, load normally
      script.src = src;
      script.type = 'text/javascript';
      Object.keys(attributes).forEach(key => {
        script.setAttribute(key, attributes[key]);
      });
      script.onload = callback;
      document.head.appendChild(script);
    }
    
    // Helper function to load local fallbacks
    function loadLocalFallback() {
      console.log("[CORS Proxy] Trying local fallback for:", src);
      if (src.includes('react-router-dom') || src.includes('unpkg.com') || src.includes('cdn.jsdelivr.net')) {
        const fallbackScript = document.createElement('script');
        fallbackScript.src = '/assets/react-cdn-fallback.js';
        fallbackScript.onload = callback;
        document.head.appendChild(fallbackScript);
      } else if (src.includes('cdn.gpteng.co')) {
        console.log("[CORS Proxy] Using local fallback for GPT Engineer");
        // We don't have a direct fallback, but we can at least provide basic functionality
        window.gptengineer = window.gptengineer || {
          createSelect: function() {
            console.log("GPT Engineer Select functionality unavailable due to CSP restrictions");
            return null;
          }
        };
        if (callback) callback();
      }
    }
    
    return script;
  };
  
  // Inject basic GPT Engineer API if not available
  if (typeof window.gptengineer === 'undefined') {
    console.log("[CORS Proxy] Creating basic gptengineer API");
    window.gptengineer = {
      createSelect: function() {
        console.log("Basic GPT Engineer Select API called - real implementation will load later");
        return null;
      }
    };
  }
  
  // Direct injection of minimal ReactRouterDOM to prevent errors
  if (typeof window.ReactRouterDOM === 'undefined') {
    console.log("[CORS Proxy] ReactRouterDOM not found, creating minimal placeholder");
    
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
      script.onerror = () => console.error("[CORS Proxy] Failed to load React Router fallback");
      document.head.appendChild(script);
    }, 100);
  }
  
  console.log("[CORS Proxy] Fetch and XHR have been patched to handle CORS issues");
})();

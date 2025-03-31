
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
    'gpteng.co',
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
      script.type = attributes.type || 'text/javascript';
      Object.keys(attributes).forEach(key => {
        if (key !== 'type') { // We've already set type
          script.setAttribute(key, attributes[key]);
        }
      });
      script.onload = function() {
        console.log("[CORS Proxy] Script loaded successfully:", src);
        if (callback) callback();
      };
      script.onerror = function(error) {
        console.error("[CORS Proxy] Script loading failed:", src);
        if (callback) callback(error);
      };
      document.head.appendChild(script);
      return script;
    }
    
    const needsProxy = problematicDomains.some(domain => src.includes(domain));
    
    // For problematic scripts, we'll try different approaches
    if (needsProxy) {
      console.log("[CORS Proxy] Loading problematic script:", src);
      
      // First try direct loading
      const script = document.createElement('script');
      script.src = src;
      script.type = attributes.type || 'text/javascript';
      
      // Special case for GPT Engineer script
      if (src.includes('gpteng.co')) {
        console.log("[CORS Proxy] Special handling for GPT Engineer script");
        script.setAttribute('crossorigin', 'anonymous');
        // Remove type="module" which can cause CSP issues
        if (attributes.type === 'module') {
          script.type = 'text/javascript';
        }
      }
      
      // Apply attributes
      Object.keys(attributes).forEach(key => {
        if (key !== 'type') { // We've already set type
          script.setAttribute(key, attributes[key]);
        }
      });
      
      script.onload = function() {
        console.log("[CORS Proxy] Script loaded successfully:", src);
        if (callback) callback();
      };
      
      script.onerror = function(error) {
        console.warn("[CORS Proxy] Direct script loading failed, trying fetch approach:", error);
        
        // If direct loading fails, try the fetch approach
        originalFetch(src)
          .then(response => {
            if (!response.ok) {
              throw new Error(`Failed to fetch script: ${response.status}`);
            }
            return response.text();
          })
          .then(content => {
            // Create an inline script with the content
            const inlineScript = document.createElement('script');
            inlineScript.textContent = content;
            inlineScript.type = attributes.type || 'text/javascript';
            
            // Apply attributes except src and type
            Object.keys(attributes).forEach(key => {
              if (key !== 'src' && key !== 'type') {
                inlineScript.setAttribute(key, attributes[key]);
              }
            });
            
            inlineScript.onload = function() {
              console.log("[CORS Proxy] Inline script loaded successfully");
              if (callback) callback();
            };
            
            inlineScript.onerror = function(inlineError) {
              console.error("[CORS Proxy] Inline script failed:", inlineError);
              loadLocalFallback();
            };
            
            document.head.appendChild(inlineScript);
          })
          .catch(fetchError => {
            console.error("[CORS Proxy] Failed to fetch script content:", fetchError);
            loadLocalFallback();
          });
      };
      
      document.head.appendChild(script);
      return script;
    } else {
      // For non-problematic domains, load normally
      const script = document.createElement('script');
      script.src = src;
      script.type = attributes.type || 'text/javascript';
      
      Object.keys(attributes).forEach(key => {
        if (key !== 'type') { // We've already set type
          script.setAttribute(key, attributes[key]);
        }
      });
      
      script.onload = function() {
        console.log("[CORS Proxy] Script loaded successfully:", src);
        if (callback) callback();
      };
      
      script.onerror = function(error) {
        console.error("[CORS Proxy] Script loading failed:", src);
        if (callback) callback(error);
      };
      
      document.head.appendChild(script);
      return script;
    }
    
    // Helper function to load local fallbacks
    function loadLocalFallback() {
      console.log("[CORS Proxy] Trying local fallback for:", src);
      
      if (src.includes('react') || src.includes('unpkg.com/react') || src.includes('cdn.jsdelivr.net/npm/react')) {
        const fallbackScript = document.createElement('script');
        fallbackScript.src = '/assets/react-cdn-fallback.js';
        fallbackScript.onload = function() {
          console.log("[CORS Proxy] React fallback loaded successfully");
          if (callback) callback();
        };
        fallbackScript.onerror = function(fallbackError) {
          console.error("[CORS Proxy] React fallback failed:", fallbackError);
          if (callback) callback(fallbackError);
        };
        document.head.appendChild(fallbackScript);
      } 
      else if (src.includes('gpteng.co')) {
        console.log("[CORS Proxy] Using local fallback for GPT Engineer");
        // Create a minimal implementation
        window.gptengineer = window.gptengineer || {
          createSelect: function() {
            console.log("GPT Engineer Select functionality unavailable");
            return null;
          }
        };
        if (callback) callback();
      }
      else {
        // Generic fallback approach
        const fileName = src.split('/').pop();
        const fallbackScript = document.createElement('script');
        fallbackScript.src = `/assets/${fileName}`;
        fallbackScript.onload = function() {
          console.log("[CORS Proxy] Local fallback loaded successfully:", fileName);
          if (callback) callback();
        };
        fallbackScript.onerror = function(fallbackError) {
          console.error("[CORS Proxy] Local fallback failed:", fallbackError);
          if (callback) callback(fallbackError);
        };
        document.head.appendChild(fallbackScript);
      }
    }
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

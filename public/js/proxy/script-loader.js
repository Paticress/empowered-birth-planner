
// Enhanced script loading with CORS support
(function() {
  console.log("[Script Loader] Initializing script loader with CORS support");
  
  // Reference to config
  const config = window.__proxyConfig || {
    problematicDomains: [],
    trustedDomains: [],
    corsProxies: ['https://corsproxy.io/?'],
    currentProxyIndex: 0
  };
  
  // Check if a URL is from a trusted domain
  const isTrustedDomain = (url) => {
    if (typeof url !== 'string') return false;
    return config.trustedDomains.some(domain => url.includes(domain));
  };
  
  // Create script loading helper
  window.__loadScriptWithCORS = function(src, callback, attributes = {}) {
    console.log("[Script Loader] Loading script with CORS support:", src);
    
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
        console.log("[Script Loader] Script loaded successfully:", src);
        if (callback) callback();
      };
      script.onerror = function(error) {
        console.error("[Script Loader] Script loading failed:", src);
        if (callback) callback(error);
      };
      document.head.appendChild(script);
      return script;
    }
    
    const needsProxy = config.problematicDomains.some(domain => src.includes(domain));
    
    // For problematic scripts, we'll try different approaches
    if (needsProxy) {
      console.log("[Script Loader] Loading problematic script:", src);
      
      // First try direct loading
      const script = document.createElement('script');
      script.src = src;
      script.type = attributes.type || 'text/javascript';
      
      // Special case for GPT Engineer script
      if (src.includes('gpteng.co')) {
        console.log("[Script Loader] Special handling for GPT Engineer script");
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
        console.log("[Script Loader] Script loaded successfully:", src);
        if (callback) callback();
      };
      
      script.onerror = function(error) {
        console.warn("[Script Loader] Direct script loading failed, trying fetch approach:", error);
        
        // If direct loading fails, try the fetch approach
        window.fetch(src)
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
              console.log("[Script Loader] Inline script loaded successfully");
              if (callback) callback();
            };
            
            inlineScript.onerror = function(inlineError) {
              console.error("[Script Loader] Inline script failed:", inlineError);
              loadLocalFallback();
            };
            
            document.head.appendChild(inlineScript);
          })
          .catch(fetchError => {
            console.error("[Script Loader] Failed to fetch script content:", fetchError);
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
        console.log("[Script Loader] Script loaded successfully:", src);
        if (callback) callback();
      };
      
      script.onerror = function(error) {
        console.error("[Script Loader] Script loading failed:", src);
        if (callback) callback(error);
      };
      
      document.head.appendChild(script);
      return script;
    }
    
    // Helper function to load local fallbacks
    function loadLocalFallback() {
      console.log("[Script Loader] Trying local fallback for:", src);
      
      if (src.includes('react') || src.includes('unpkg.com/react') || src.includes('cdn.jsdelivr.net/npm/react')) {
        const fallbackScript = document.createElement('script');
        fallbackScript.src = '/assets/react-cdn-fallback.js';
        fallbackScript.onload = function() {
          console.log("[Script Loader] React fallback loaded successfully");
          if (callback) callback();
        };
        fallbackScript.onerror = function(fallbackError) {
          console.error("[Script Loader] React fallback failed:", fallbackError);
          if (callback) callback(fallbackError);
        };
        document.head.appendChild(fallbackScript);
      } 
      else if (src.includes('gpteng.co')) {
        console.log("[Script Loader] Using local fallback for GPT Engineer");
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
          console.log("[Script Loader] Local fallback loaded successfully:", fileName);
          if (callback) callback();
        };
        fallbackScript.onerror = function(fallbackError) {
          console.error("[Script Loader] Local fallback failed:", fallbackError);
          if (callback) callback(fallbackError);
        };
        document.head.appendChild(fallbackScript);
      }
    }
  };
  
  console.log("[Script Loader] Script loader with CORS support initialized");
})();

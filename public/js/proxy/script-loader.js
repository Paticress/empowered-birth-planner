
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

  // Helper function to check if a resource exists before trying to load it
  const checkResourceExists = async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.warn(`[Script Loader] Resource check failed for ${url}:`, error);
      return false;
    }
  };
  
  // Create script loading helper
  window.__loadScriptWithCORS = function(src, callback, attributes = {}) {
    console.log("[Script Loader] Loading script with CORS support:", src);
    
    // For empty or null src, log error and call callback with error
    if (!src) {
      console.error("[Script Loader] Empty or null script source provided");
      if (callback) callback(new Error("Empty script source"));
      return null;
    }
    
    // Special case for GPT Engineer script
    if (src.includes('gpteng.co') || src.includes('gptengineer.js')) {
      console.log("[Script Loader] Special handling for GPT Engineer script");
      const script = document.createElement('script');
      script.src = src;
      script.type = 'text/javascript'; // Force text/javascript instead of module
      script.crossOrigin = 'anonymous';
      
      script.onload = function() {
        console.log("[Script Loader] GPT Engineer script loaded successfully");
        if (callback) callback();
      };
      
      script.onerror = function(error) {
        console.error("[Script Loader] GPT Engineer script failed to load:", error);
        // Create a minimal implementation as fallback
        window.gptengineer = window.gptengineer || {
          createSelect: function() {
            console.log("GPT Engineer Select functionality unavailable");
            return null;
          }
        };
        if (callback) callback();
      };
      
      document.head.appendChild(script);
      return script;
    }
    
    // Skip for trusted domains
    if (isTrustedDomain(src)) {
      // Check if resource exists first for trusted domains
      checkResourceExists(src).then(exists => {
        if (!exists) {
          console.warn(`[Script Loader] Resource not found at ${src}, trying fallback`);
          loadLocalFallback();
          return;
        }
        
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
          loadLocalFallback();
        };
        document.head.appendChild(script);
      });
      return null;
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
      // For non-problematic domains, check resource exists first
      checkResourceExists(src).then(exists => {
        if (!exists) {
          console.warn(`[Script Loader] Resource not found at ${src}, trying fallback`);
          loadLocalFallback();
          return;
        }
        
        // Load normally
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
          loadLocalFallback();
        };
        
        document.head.appendChild(script);
      });
      return null;
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
        // Generic fallback approach - check if file exists first in assets folder
        const fileName = src.split('/').pop();
        const fallbackPath = `/assets/${fileName}`;
        
        checkResourceExists(fallbackPath).then(exists => {
          if (exists) {
            const fallbackScript = document.createElement('script');
            fallbackScript.src = fallbackPath;
            fallbackScript.onload = function() {
              console.log("[Script Loader] Local fallback loaded successfully:", fileName);
              if (callback) callback();
            };
            fallbackScript.onerror = function(fallbackError) {
              console.error("[Script Loader] Local fallback failed:", fallbackError);
              if (callback) callback(fallbackError);
            };
            document.head.appendChild(fallbackScript);
          } else {
            console.error(`[Script Loader] No fallback available for ${src}`);
            if (callback) callback(new Error(`No fallback available for ${src}`));
          }
        });
      }
    }
  };
  
  console.log("[Script Loader] Script loader with CORS support initialized");
})();

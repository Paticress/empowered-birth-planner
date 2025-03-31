
// Core script loading functionality
(function() {
  console.log("Core script loader initialized");
  
  // Flag to track load state and prevent double loading
  window.__SCRIPT_LOAD_STATE = window.__SCRIPT_LOAD_STATE || {
    react: false,
    reactDom: false,
    reactRouter: false,
    gptEngineer: false,
    app: false,
    errorCount: 0
  };
  
  // Utility function to load a script with enhanced error handling
  function loadScriptWithRetry(src, callback, attributes, retries = 2) {
    console.log("Loading script:", src);
    
    if (!window.__loadScriptWithCORS) {
      // Fallback to direct loading with error handling
      const script = document.createElement('script');
      script.src = src;
      script.crossOrigin = "anonymous";
      
      // Apply additional attributes if provided
      if (attributes) {
        for (const key in attributes) {
          script.setAttribute(key, attributes[key]);
        }
      }
      
      script.onload = function() {
        console.log("Script loaded successfully:", src);
        callback();
      };
      
      script.onerror = function(error) {
        console.error("Failed to load script:", src, error);
        
        if (retries > 0) {
          console.log(`Retrying... (${retries} attempts left)`);
          
          // Try alternative source
          const altSrc = src.includes('unpkg.com') 
            ? src.replace('unpkg.com', 'cdn.jsdelivr.net/npm')
            : src;
            
          loadScriptWithRetry(altSrc, callback, attributes, retries - 1);
        } else {
          console.error("All load attempts failed for:", src);
          window.__SCRIPT_LOAD_STATE.errorCount++;
          callback(); // Continue to next script despite failure
        }
      };
      
      document.head.appendChild(script);
    } else {
      // Use enhanced CORS loader if available
      window.__loadScriptWithCORS(
        src,
        function() {
          console.log("Script loaded via CORS proxy:", src);
          callback();
        },
        attributes
      );
    }
  }
  
  // Check if a script is already loaded
  function isScriptLoaded(globalVar) {
    return typeof window[globalVar] !== 'undefined';
  }
  
  // Expose utilities to window for other modules to use
  window.__scriptLoader = {
    loadScript: loadScriptWithRetry,
    isLoaded: isScriptLoaded,
    state: window.__SCRIPT_LOAD_STATE
  };
})();

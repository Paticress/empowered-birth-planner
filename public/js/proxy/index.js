
// Main proxy module that orchestrates all proxy functionality
(function() {
  console.log("[CORS Proxy] Enhanced proxy helper initializing");
  
  // Load modules in the correct order
  function loadModules() {
    const modules = [
      "/public/js/proxy/config.js",
      "/public/js/proxy/fetch-override.js", 
      "/public/js/proxy/script-loader.js",
      "/public/js/proxy/fallbacks.js"
    ];
    
    let moduleIndex = 0;
    
    function loadNextModule() {
      if (moduleIndex >= modules.length) {
        console.log("[CORS Proxy] All proxy modules loaded successfully");
        return;
      }
      
      const script = document.createElement('script');
      script.src = modules[moduleIndex];
      script.onload = function() {
        moduleIndex++;
        loadNextModule();
      };
      script.onerror = function() {
        console.error("[CORS Proxy] Failed to load module:", modules[moduleIndex]);
        
        // If we can't load the modules, load a minimal inline version
        if (moduleIndex === 0) { // If we can't even load the first module
          console.error("[CORS Proxy] Critical module loading failure, using inline fallback");
          setupMinimalFallback();
        } else {
          moduleIndex++; // Skip the failed module and try the next one
          loadNextModule();
        }
      };
      document.head.appendChild(script);
    }
    
    loadNextModule();
  }
  
  // Minimal fallback implementation if modules fail to load
  function setupMinimalFallback() {
    console.log("[CORS Proxy] Setting up minimal fallback");
    
    // Very basic proxy functionality
    window.__loadScriptWithCORS = function(src, callback) {
      const script = document.createElement('script');
      script.src = src;
      script.crossOrigin = "anonymous";
      script.onload = function() { if (callback) callback(); };
      script.onerror = function(error) { if (callback) callback(error); };
      document.head.appendChild(script);
      return script;
    };
    
    // Minimal GPT Engineer implementation
    window.gptengineer = window.gptengineer || {
      createSelect: function() { return null; }
    };
    
    // Basic ReactRouterDOM polyfill
    window.ReactRouterDOM = window.ReactRouterDOM || {
      HashRouter: function(props) { return props.children || null; },
      Routes: function(props) { return props.children || null; },
      Route: function() { return null; }
    };
  }
  
  // Start loading modules
  loadModules();
})();

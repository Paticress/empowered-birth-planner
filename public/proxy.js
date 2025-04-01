
// Enhanced CORS proxy script that intercepts problematic requests
// This file now just delegates to the modular implementation
(function() {
  console.log("[CORS Proxy] Loading modular CORS proxy system");
  
  // Load the main proxy module
  const script = document.createElement('script');
  script.src = "/public/js/proxy/index.js";
  script.onerror = function() {
    console.error("[CORS Proxy] Failed to load modular proxy system, using inline fallback");
    
    // Very minimal fallback implementation
    window.__loadScriptWithCORS = function(src, callback) {
      const script = document.createElement('script');
      script.src = src;
      script.crossOrigin = "anonymous";
      script.onload = function() { if (callback) callback(); };
      script.onerror = function(error) { if (callback) callback(error); };
      document.head.appendChild(script);
    };
    
    window.gptengineer = window.gptengineer || {
      createSelect: function() { return null; }
    };
  };
  
  document.head.appendChild(script);
})();

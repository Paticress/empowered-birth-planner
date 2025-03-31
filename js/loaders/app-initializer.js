
// App initialization module
(function() {
  console.log("App initializer loaded");
  
  // Function to initialize the app after dependencies are loaded
  function initializeApp() {
    if (!window.__SCRIPT_LOAD_STATE.app) {
      console.log("All dependencies loaded, initializing app");
      window.__SCRIPT_LOAD_STATE.app = true;
      
      // Check status of all libraries
      if (window.__checkReactLibs) {
        const status = window.__checkReactLibs();
        console.log("React libraries status:", status);
      }
      
      // Load the main app
      const mainScript = document.createElement('script');
      mainScript.type = "module";
      mainScript.src = "/src/main.js";
      mainScript.onerror = function(error) {
        console.error("Failed to load main app module:", error);
        
        // Try compatibility mode
        const compatScript = document.createElement('script');
        compatScript.src = "/src/compat-entry.js";
        document.body.appendChild(compatScript);
      };
      document.body.appendChild(mainScript);
    }
  }
  
  // Set up error handling for any initialization errors
  function setupErrorHandling() {
    window.addEventListener('error', function(event) {
      console.error('Global error caught:', event.message);
      window.__SCRIPT_LOAD_STATE.errorCount++;
      
      if (window.__SCRIPT_LOAD_STATE.errorCount > 5) {
        console.warn("Multiple errors detected, trying compatibility mode");
        if (!window.__COMPAT_ENTRY_LOADED) {
          const compatScript = document.createElement('script');
          compatScript.src = '/src/compat-entry.js';
          document.body.appendChild(compatScript);
        }
      }
    });
  }
  
  // Expose the app initializer functions
  window.__appInitializer = {
    initializeApp: initializeApp,
    setupErrorHandling: setupErrorHandling
  };
})();

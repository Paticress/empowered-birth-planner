
// Non-module entry point for maximum browser compatibility
(function() {
  console.log('Main.js - Using non-module entry point');
  
  // Flag to prevent double initialization
  if (window.__MAIN_JS_EXECUTED) {
    console.log("Main.js - Application already initialized by non-module entry point");
    return;
  }
  
  window.__MAIN_JS_EXECUTED = true;
  console.log("Main.js - Initializing application using standard script");
  
  // Load script utilities first
  function loadUtilities(callback) {
    // Load script utilities in sequence
    const utilities = [
      '/src/js/scriptLoading.js',
      '/src/js/errorHandling.js',
      '/src/js/reactLoading.js',
      '/src/js/appLoader.js'
    ];
    
    let loadedCount = 0;
    
    function loadNextUtility() {
      if (loadedCount >= utilities.length) {
        callback();
        return;
      }
      
      const script = document.createElement('script');
      script.src = utilities[loadedCount];
      script.onload = function() {
        loadedCount++;
        loadNextUtility();
      };
      script.onerror = function(error) {
        console.error("Failed to load utility:", utilities[loadedCount], error);
        loadedCount++;
        loadNextUtility();
      };
      document.body.appendChild(script);
    }
    
    loadNextUtility();
  }
  
  // Initialize app after utilities are loaded
  loadUtilities(function() {
    // Setup error handling first
    if (window.__errorHandler && window.__errorHandler.setupGlobalErrorHandler) {
      window.__errorHandler.setupGlobalErrorHandler();
    }
    
    // Load React dependencies
    if (window.__reactLoader && window.__reactLoader.loadReactDependencies) {
      window.__reactLoader.loadReactDependencies(function() {
        // Try to load App.tsx directly first as a module
        const appModule = document.createElement('script');
        appModule.type = 'module';
        appModule.src = '/src/App.tsx';
        appModule.onerror = function() {
          console.log("Main.js - Module import of App.tsx failed, trying App.js bridge");
          // Fall back to App.js bridge for non-module environments
          const appScript = document.createElement('script');
          appScript.src = '/src/App.js';
          document.body.appendChild(appScript);
        };
        document.body.appendChild(appModule);
      });
    } else {
      console.error("React loader utilities not available");
      
      // Try to load App.js directly as fallback
      const appScript = document.createElement('script');
      appScript.src = '/src/App.js';
      document.body.appendChild(appScript);
    }
  });
})();

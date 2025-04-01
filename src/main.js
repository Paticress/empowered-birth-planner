
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
        // Render a simple app while loading the full bundle
        if (window.__appLoader && window.__appLoader.createSimpleApp) {
          const success = window.__appLoader.createSimpleApp();
          
          if (success) {
            // Load the full app bundle
            if (window.__appLoader.loadFullAppBundle) {
              window.__appLoader.loadFullAppBundle().catch(function(err) {
                console.error("Failed to load full app bundle:", err);
                
                // Attempt to load compatibility mode
                if (window.__errorHandler && window.__errorHandler.loadCompatibilityMode) {
                  window.__errorHandler.loadCompatibilityMode();
                }
              });
            }
          } else {
            console.error("Failed to create simple app");
            
            // Attempt to load compatibility mode
            if (window.__errorHandler && window.__errorHandler.loadCompatibilityMode) {
              window.__errorHandler.loadCompatibilityMode();
            }
          }
        } else {
          console.error("App loader utilities not available");
        }
      });
    } else {
      console.error("React loader utilities not available");
    }
  });
})();

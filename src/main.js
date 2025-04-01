
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
  
  // Create a simple loading indicator in the root element
  const rootElement = document.getElementById('root');
  if (rootElement && !rootElement.hasChildNodes()) {
    rootElement.innerHTML = '<div style="text-align: center; padding: 40px;"><h1>Guia de Plano de Parto</h1><p>Carregando...</p><div style="width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #3498db; border-radius: 50%; margin: 20px auto; animation: spin 1s linear infinite;"></div></div><style>@keyframes spin {0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }}</style>';
  }
  
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
        // Try to continue even if one utility fails
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
        // Try to load App.js as a bridge
        const appScript = document.createElement('script');
        appScript.src = '/src/App.js';
        
        appScript.onerror = function() {
          console.error("Main.js - Failed to load App.js bridge, trying direct App.tsx");
          
          // Try to load App.tsx directly as a module
          const appModule = document.createElement('script');
          appModule.type = 'module';
          appModule.src = '/src/App.tsx';
          
          appModule.onerror = function() {
            console.error("Main.js - Module import of App.tsx failed, trying fallback app");
            
            // Try to use the fallback app if available
            if (window.__fallbackApp && window.__fallbackApp.createBasicContent) {
              window.__fallbackApp.createBasicContent(document.getElementById('root'));
            } else {
              // Show error message
              const rootEl = document.getElementById('root');
              if (rootEl) {
                rootEl.innerHTML = '<div style="text-align: center; padding: 40px;"><h1>Guia de Plano de Parto</h1><p>Ocorreu um erro ao carregar a aplicação. Por favor, tente novamente mais tarde.</p></div>';
              }
            }
          };
          
          document.body.appendChild(appModule);
        };
        
        document.body.appendChild(appScript);
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

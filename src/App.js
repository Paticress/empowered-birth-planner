
// App.js - Non-module bridge file for maximum compatibility
(function() {
  try {
    console.log("App.js - Attempting to hydrate the full application");
    
    // Only proceed if we haven't already initialized the full app
    if (window.__FULL_APP_LOADED) {
      console.log("App.js - Full application already loaded");
      return;
    }
    
    // Flag to prevent multiple initializations
    window.__FULL_APP_LOADED = true;
    
    // Check if React is available before proceeding
    if (!window.React || !window.ReactDOM) {
      console.log("App.js - React not available yet, loading dependencies");
      
      // Import the React loader to ensure dependencies
      import('./utils/reactLoader.js')
        .then(reactLoader => {
          reactLoader.loadReactDependencies(() => {
            // Continue with app initialization after React is loaded
            initializeApp();
          });
        })
        .catch(error => {
          console.error("App.js - Error importing React loader:", error);
          showFallbackContent();
        });
    } else {
      console.log("App.js - React already available, proceeding with initialization");
      initializeApp();
    }
    
    // Main initialization function
    function initializeApp() {
      // Import the real App component from the proper module
      import('./App.tsx')
        .then(module => {
          console.log("App.js - Successfully imported App.tsx module");
          
          // Correctly expose the App component to the window
          window.App = module.default;
          
          // Now initialize the app renderer
          import('./utils/appRenderer.js')
            .then(renderer => {
              renderer.renderAppComponent();
            })
            .catch(error => {
              console.error("App.js - Error importing app renderer:", error);
              showFallbackContent();
            });
        })
        .catch(error => {
          console.error("App.js - Error importing App.tsx:", error);
          showFallbackContent();
        });
    }
    
    // Fallback function for critical errors
    function showFallbackContent() {
      console.error("App.js - Critical error, showing fallback content");
      
      import('./utils/fallbackApp.js')
        .then(module => {
          const rootElement = document.getElementById('root');
          if (rootElement) {
            module.createBasicAppContent(rootElement);
          }
        })
        .catch(finalError => {
          console.error("App.js - Failed to load even fallback content:", finalError);
          const rootElement = document.getElementById('root');
          if (rootElement) {
            rootElement.innerHTML = '<div style="text-align: center; padding: 40px;"><h1>Guia de Plano de Parto</h1><p>Ocorreu um erro ao carregar a aplicação. Por favor, tente novamente mais tarde.</p></div>';
          }
        });
    }
  } catch (outerError) {
    console.error("App.js - Critical error:", outerError);
    
    // Show simple error message as last resort
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = '<div style="text-align: center; padding: 40px;"><h1>Guia de Plano de Parto</h1><p>Ocorreu um erro ao carregar a aplicação. Por favor, tente novamente mais tarde.</p></div>';
    }
  }
})();

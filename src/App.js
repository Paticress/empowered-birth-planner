
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
      
      // Try to dynamically import the React loader
      try {
        import('./utils/reactLoader.js')
          .then(reactLoader => {
            reactLoader.loadReactDependencies(() => {
              // Continue with app initialization after React is loaded
              initializeApp();
            });
          })
          .catch(error => {
            console.error("App.js - Error importing React loader:", error);
            
            // Fallback to window-level reactLoader if available
            if (window.__reactLoader && window.__reactLoader.loadReactDependencies) {
              window.__reactLoader.loadReactDependencies(() => {
                initializeApp();
              });
            } else {
              showFallbackContent();
            }
          });
      } catch (importError) {
        console.error("App.js - Dynamic import not supported:", importError);
        
        // Try using global reactLoader
        if (window.__reactLoader && window.__reactLoader.loadReactDependencies) {
          window.__reactLoader.loadReactDependencies(() => {
            initializeApp();
          });
        } else {
          showFallbackContent();
        }
      }
    } else {
      console.log("App.js - React already available, proceeding with initialization");
      initializeApp();
    }
    
    // Main initialization function
    function initializeApp() {
      // Try to directly create the real App component first (not using dynamic import)
      if (window.App) {
        console.log("App.js - App already available in window, rendering");
        renderApp();
        return;
      }
      
      // Try loading the compiled App.js first instead of App.tsx (which may have MIME issues)
      const script = document.createElement('script');
      script.src = './src/compiled/App.js';
      script.onload = function() {
        console.log("App.js - Loaded compiled App.js successfully");
        renderApp();
      };
      script.onerror = function() {
        console.log("App.js - Failed to load compiled App.js, trying App.tsx as module");
        
        // Try importing App.tsx as a module
        try {
          import('./App.tsx')
            .then(module => {
              console.log("App.js - Successfully imported App.tsx module");
              window.App = module.default;
              renderApp();
            })
            .catch(error => {
              console.error("App.js - Error importing App.tsx:", error);
              
              // Try a direct script load of App.tsx as fallback
              const tsxScript = document.createElement('script');
              tsxScript.type = 'module';
              tsxScript.src = './App.tsx';
              tsxScript.onload = function() {
                console.log("App.js - Loaded App.tsx via script tag");
                renderApp();
              };
              tsxScript.onerror = function() {
                console.error("App.js - Failed to load App.tsx via script tag");
                showFallbackContent();
              };
              document.body.appendChild(tsxScript);
            });
        } catch (importError) {
          console.error("App.js - Dynamic import not supported:", importError);
          showFallbackContent();
        }
      };
      document.body.appendChild(script);
    }
    
    // Function to render the real App component
    function renderApp() {
      try {
        if (!window.App) {
          console.error("App.js - App component not available after loading");
          showFallbackContent();
          return;
        }
        
        import('./utils/appRenderer.js')
          .then(renderer => {
            renderer.renderAppComponent();
          })
          .catch(error => {
            console.error("App.js - Error importing app renderer:", error);
            
            // Try fallback renderer if available
            if (window.__appRenderer && window.__appRenderer.renderAppComponent) {
              window.__appRenderer.renderAppComponent();
            } else {
              showFallbackContent();
            }
          });
      } catch (error) {
        console.error("App.js - Error rendering App:", error);
        showFallbackContent();
      }
    }
    
    // Fallback function for critical errors
    function showFallbackContent() {
      console.error("App.js - Critical error, showing fallback content");
      
      try {
        import('./utils/fallbackApp.js')
          .then(module => {
            const rootElement = document.getElementById('root');
            if (rootElement) {
              module.createBasicAppContent(rootElement);
            }
          })
          .catch(finalError => {
            console.error("App.js - Failed to load even fallback content:", finalError);
            
            // Try global fallbackApp if available
            if (window.__fallbackApp && window.__fallbackApp.createBasicContent) {
              const rootElement = document.getElementById('root');
              if (rootElement) {
                window.__fallbackApp.createBasicContent(rootElement);
              }
            } else {
              // Ultimate fallback
              const rootElement = document.getElementById('root');
              if (rootElement) {
                rootElement.innerHTML = '<div style="text-align: center; padding: 40px;"><h1>Guia de Plano de Parto</h1><p>Ocorreu um erro ao carregar a aplicação. Por favor, tente novamente mais tarde.</p></div>';
              }
            }
          });
      } catch (outerError) {
        console.error("App.js - Error loading fallback:", outerError);
        
        // Ultimate fallback
        const rootElement = document.getElementById('root');
        if (rootElement) {
          rootElement.innerHTML = '<div style="text-align: center; padding: 40px;"><h1>Guia de Plano de Parto</h1><p>Ocorreu um erro ao carregar a aplicação. Por favor, tente novamente mais tarde.</p></div>';
        }
      }
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

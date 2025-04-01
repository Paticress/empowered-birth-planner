
// Compatibility entry point for browsers that don't support ES modules
console.log("Compat-entry.js - Loading compatibility mode");

(function() {
  // Check if we've already loaded this file to prevent double execution
  if (window.__COMPAT_ENTRY_LOADED) {
    console.log("Compat-entry.js - Already loaded, skipping initialization");
    return;
  }
  
  window.__COMPAT_ENTRY_LOADED = true;
  
  // Set up error handling for any initialization errors
  window.addEventListener('error', function(event) {
    console.error('Compat - Global error caught:', event.message);
  });
  
  // Dynamically import our compat modules
  import('./compat/scriptLoader.js')
    .then(scriptLoader => {
      const { loadScript, isScriptLoaded } = scriptLoader;
      
      import('./compat/uiComponents.js')
        .then(uiComponents => {
          const { createLoadingUI } = uiComponents;
          
          // Create a simple loading UI first
          createLoadingUI();
          
          // Define a simpler version of the App
          window.App = window.App || function() {
            return React.createElement('div', null, "Carregando...");
          };
          
          import('./compat/reactLoader.js')
            .then(reactLoader => {
              const { ensureReactLoaded, loadReactRouter } = reactLoader;
              
              ensureReactLoaded(() => {
                loadReactRouter(() => {
                  import('./compat/appLoader.js')
                    .then(appLoader => {
                      const { initApp } = appLoader;
                      initApp();
                    })
                    .catch(error => {
                      console.error("Failed to load app loader module:", error);
                      import('./compat/simpleRouter.js')
                        .then(simpleRouter => {
                          simpleRouter.initSimpleRouter();
                        })
                        .catch(routerError => {
                          console.error("Failed to load simple router module:", routerError);
                        });
                    });
                });
              });
            })
            .catch(error => {
              console.error("Failed to load React loader module:", error);
              
              // Fallback to direct script loading
              window.__loadScriptWithCORS = window.__loadScriptWithCORS || function(src, callback) {
                const script = document.createElement('script');
                script.src = src;
                script.onload = callback;
                document.body.appendChild(script);
              };
              
              window.__loadScriptWithCORS(
                'https://unpkg.com/react@18/umd/react.production.min.js',
                function() {
                  window.__loadScriptWithCORS(
                    'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
                    function() {
                      window.__loadScriptWithCORS(
                        'https://unpkg.com/react-router-dom@6/umd/react-router-dom.production.min.js',
                        function() {
                          // Try loading the app directly
                          const script = document.createElement('script');
                          script.src = '/src/App.js';
                          document.body.appendChild(script);
                        }
                      );
                    }
                  );
                }
              );
            });
        })
        .catch(error => {
          console.error("Failed to load UI components module:", error);
          
          // Very basic fallback UI
          const rootElement = document.getElementById('root');
          if (rootElement) {
            rootElement.innerHTML = `
              <div style="text-align: center; padding: 20px;">
                <h2>Guia de Plano de Parto</h2>
                <p>Carregando em modo de compatibilidade básica...</p>
              </div>
            `;
          }
        });
    })
    .catch(error => {
      console.error("Failed to load script loader module:", error);
    });
})();

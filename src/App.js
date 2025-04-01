
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
      
      // Try to load React dependencies first
      if (window.__reactLoader && window.__reactLoader.loadReactDependencies) {
        window.__reactLoader.loadReactDependencies(() => {
          // Continue with app initialization after React is loaded
          initializeApp();
        });
        return;
      }
    } else {
      console.log("App.js - React already available, proceeding with initialization");
      initializeApp();
    }
    
    // Main initialization function
    function initializeApp() {
      // If App is already in window, render it directly
      if (window.App) {
        console.log("App.js - App already available in window, rendering");
        renderApp();
        return;
      }
      
      // First try loading a pre-compiled version if available
      console.log("App.js - Trying to load pre-compiled version");
      const compiledScript = document.createElement('script');
      compiledScript.src = './src/compiled/App.js';
      compiledScript.type = 'text/javascript'; // Force non-module
      
      compiledScript.onload = function() {
        console.log("App.js - Loaded compiled App.js successfully");
        renderApp();
      };
      
      compiledScript.onerror = function() {
        console.log("App.js - Failed to load compiled App.js, trying App.tsx as module");
        
        // First try to import as a module (proper way)
        try {
          // This won't work if modules aren't supported
          import('./src/App.tsx')
            .then(module => {
              console.log("App.js - Successfully imported App.tsx as a module");
              window.App = module.default;
              renderApp();
            })
            .catch(error => {
              console.log("App.js - Error importing App.tsx:", error);
              
              // Try loading as a regular script tag
              console.log("App.js - Trying to load App.tsx as a regular script");
              const tsxScript = document.createElement('script');
              tsxScript.src = './src/App.tsx';
              tsxScript.type = 'text/javascript'; // Force non-module for compatibility
              
              tsxScript.onload = function() {
                console.log("App.js - Loaded App.tsx successfully as regular script");
                renderApp();
              };
              
              tsxScript.onerror = function() {
                console.log("App.js - Failed to load App.tsx via script tag");
                
                // Retry with a different path as a last resort
                const altScript = document.createElement('script');
                altScript.src = '/App.tsx';
                altScript.type = 'text/javascript';
                
                altScript.onload = function() {
                  console.log("App.js - Loaded App.tsx from root path");
                  renderApp();
                };
                
                altScript.onerror = function() {
                  console.log("App.js - All attempts to load App.tsx failed");
                  
                  // Create simple App component manually as a fallback
                  console.log("App.js - Creating manual App component");
                  window.App = function() {
                    return window.React.createElement(window.ReactRouterDOM.HashRouter, null,
                      window.React.createElement(window.ReactRouterDOM.Routes, null,
                        window.React.createElement(window.ReactRouterDOM.Route, { 
                          path: '/', 
                          element: window.React.createElement(window.ReactRouterDOM.Navigate, { to: '/guia-online', replace: true })
                        }),
                        window.React.createElement(window.ReactRouterDOM.Route, { 
                          path: '/guia-online', 
                          element: window.React.createElement('div', { className: "container mx-auto px-4 py-8" },
                            window.React.createElement('h1', { className: "text-2xl font-bold mb-4" }, 'Guia de Plano de Parto'),
                            window.React.createElement('p', null, 'Bem-vinda ao Guia de Plano de Parto!')
                          )
                        }),
                        window.React.createElement(window.ReactRouterDOM.Route, {
                          path: '*',
                          element: window.React.createElement('div', { className: "container mx-auto px-4 py-8" },
                            window.React.createElement('h1', { className: "text-2xl font-bold mb-4" }, 'Página não encontrada'),
                            window.React.createElement('a', { href: '#/guia-online' }, 'Voltar para o Guia')
                          )
                        })
                      )
                    );
                  };
                  renderApp();
                };
                
                document.body.appendChild(altScript);
              };
              
              document.body.appendChild(tsxScript);
            });
        } catch (importError) {
          console.log("App.js - Module import not supported, trying direct script approach for App.tsx");
          
          // Try as a direct script tag since import() failed
          const directScript = document.createElement('script');
          directScript.src = './src/App.tsx';
          directScript.onload = renderApp;
          directScript.onerror = showFallbackContent;
          document.body.appendChild(directScript);
        }
      };
      
      document.body.appendChild(compiledScript);
    }
    
    // Function to render the App component
    function renderApp() {
      try {
        if (!window.App) {
          console.error("App.js - App component not available after loading");
          showFallbackContent();
          return;
        }
        
        // Try to use the app renderer if available
        if (window.__appRenderer && window.__appRenderer.renderAppComponent) {
          window.__appRenderer.renderAppComponent();
        } else {
          // Direct rendering as fallback
          const rootElement = document.getElementById('root');
          if (!rootElement) {
            console.error("App.js - Root element not found");
            return;
          }
          
          try {
            if (window.ReactDOM.createRoot) {
              window.ReactDOM.createRoot(rootElement).render(window.React.createElement(window.App));
            } else {
              window.ReactDOM.render(window.React.createElement(window.App), rootElement);
            }
            console.log("App.js - App rendered successfully with direct rendering");
          } catch (renderError) {
            console.error("App.js - Error rendering with ReactDOM:", renderError);
            showFallbackContent();
          }
        }
      } catch (error) {
        console.error("App.js - Error rendering App:", error);
        showFallbackContent();
      }
    }
    
    // Fallback function for critical errors
    function showFallbackContent() {
      console.error("App.js - Critical error, showing fallback content");
      
      // Try to use the fallback app if available
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

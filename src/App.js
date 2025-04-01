
// App.js - Non-module bridge file
(function() {
  try {
    console.log("App.js - Attempting to hydrate the full application");
    
    // Only proceed if we haven't already initialized the full app
    if (window.__FULL_APP_LOADED) {
      console.log("App.js - Full application already loaded");
      return;
    }
    
    window.__FULL_APP_LOADED = true;
    
    // Track render attempts to prevent infinite loops
    window.__RENDER_ATTEMPTS = window.__RENDER_ATTEMPTS || 0;
    if (window.__RENDER_ATTEMPTS > 3) {
      console.error("App.js - Too many render attempts, may indicate a critical issue");
      return;
    }
    window.__RENDER_ATTEMPTS++;
    
    // Ensure we export our App component to the window
    window.App = window.App || function() {
      console.log("App.js - Using placeholder App component until real one loads");
      return React.createElement('div', null, "Carregando aplicação...");
    };
    
    // Add error handling for React Router issues
    if (!window.ReactRouterDOM) {
      console.error("App.js - ReactRouterDOM not available, trying to load it");
      var routerScript = document.createElement('script');
      routerScript.src = 'https://unpkg.com/react-router-dom@6/umd/react-router-dom.production.min.js';
      routerScript.crossOrigin = 'anonymous';
      
      routerScript.onload = function() {
        console.log("App.js - ReactRouterDOM loaded successfully, proceeding");
        loadAppContent();
      };
      
      routerScript.onerror = function(error) {
        console.error("App.js - Failed to load ReactRouterDOM:", error);
        // Try alternative CDN
        var altScript = document.createElement('script');
        altScript.src = 'https://cdn.jsdelivr.net/npm/react-router-dom@6/umd/react-router-dom.production.min.js';
        altScript.crossOrigin = 'anonymous';
        altScript.onload = function() {
          console.log("App.js - ReactRouterDOM loaded from alternative CDN, proceeding");
          loadAppContent();
        };
        altScript.onerror = function() {
          console.error("App.js - Failed to load ReactRouterDOM from alternative CDN");
          fallbackToCompatMode();
        };
        document.body.appendChild(altScript);
      };
      
      document.body.appendChild(routerScript);
    } else {
      loadAppContent();
    }
    
    function loadAppContent() {
      // Check if React is available
      if (!window.React) {
        console.error("App.js - React not available");
        loadReactDependencies(function() {
          loadAppContent();
        });
        return;
      }
      
      // Check if ReactDOM is available
      if (!window.ReactDOM) {
        console.error("App.js - ReactDOM not available");
        loadReactDependencies(function() {
          loadAppContent();
        });
        return;
      }
      
      // Explicitly import App.tsx to get the real App component
      console.log("App.js - Attempting to import App.tsx directly");
      try {
        var appModule = document.createElement('script');
        appModule.src = './dist/assets/index.js'; // Try bundled version first
        appModule.type = 'text/javascript'; // Use text/javascript for maximum compatibility
        appModule.onload = function() {
          console.log("App.js - Successfully loaded bundled App component");
          setTimeout(renderAppComponent, 300);
        };
        appModule.onerror = function() {
          console.log("App.js - Bundled App not found, trying main.js");
          var mainScript = document.createElement('script');
          mainScript.src = './src/main.js';
          mainScript.type = 'text/javascript';
          mainScript.onload = function() {
            console.log("App.js - Successfully loaded main.js");
            setTimeout(renderAppComponent, 300);
          };
          mainScript.onerror = function() {
            console.error("App.js - Failed to load main.js, falling back to basic content");
            renderBasicContent();
          };
          document.body.appendChild(mainScript);
        };
        document.body.appendChild(appModule);
      } catch (err) {
        console.error("App.js - Error importing App:", err);
        renderBasicContent();
      }
    }
    
    function loadReactDependencies(callback) {
      console.log("App.js - Loading React dependencies");
      
      // Load React
      var reactScript = document.createElement('script');
      reactScript.src = 'https://unpkg.com/react@18/umd/react.production.min.js';
      reactScript.crossOrigin = 'anonymous';
      
      reactScript.onload = function() {
        console.log("App.js - React loaded successfully");
        
        // Load ReactDOM
        var reactDOMScript = document.createElement('script');
        reactDOMScript.src = 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js';
        reactDOMScript.crossOrigin = 'anonymous';
        
        reactDOMScript.onload = function() {
          console.log("App.js - ReactDOM loaded successfully");
          
          // Call the callback
          callback();
        };
        
        reactDOMScript.onerror = function(error) {
          console.error("App.js - Failed to load ReactDOM:", error);
          fallbackToCompatMode();
        };
        
        document.body.appendChild(reactDOMScript);
      };
      
      reactScript.onerror = function(error) {
        console.error("App.js - Failed to load React:", error);
        fallbackToCompatMode();
      };
      
      document.body.appendChild(reactScript);
    }
    
    function renderAppComponent() {
      try {
        console.log("App.js - Rendering full App component");
        var rootElement = document.getElementById('root');
        
        if (rootElement) {
          // Check if App is properly loaded
          if (typeof window.App !== 'function') {
            console.error("App.js - App component not properly loaded");
            renderBasicContent();
            return;
          }
          
          // Use React 18's createRoot API if available
          if (window.ReactDOM && window.ReactDOM.createRoot) {
            console.log("App.js - Using React 18 createRoot API");
            try {
              var root = window.ReactDOM.createRoot(rootElement);
              root.render(window.React.createElement(window.App));
              console.log("App.js - App component successfully rendered with createRoot");
            } catch (err) {
              console.error("App.js - Error with createRoot API:", err);
              // Try fallback to older render method
              if (window.ReactDOM.render) {
                console.log("App.js - Falling back to legacy render API");
                window.ReactDOM.render(window.React.createElement(window.App), rootElement);
                console.log("App.js - App component successfully rendered with legacy API");
              } else {
                throw err; // Re-throw if no fallback
              }
            }
          } else {
            // Fallback for older React versions
            console.log("App.js - Using legacy React render API");
            window.ReactDOM.render(window.React.createElement(window.App), rootElement);
            console.log("App.js - App component successfully rendered with legacy API");
          }
        } else {
          console.error("App.js - Root element not found in DOM");
        }
      } catch (err) {
        console.error("App.js - Error rendering App component:", err);
        renderBasicContent();
      }
    }
    
    function renderBasicContent() {
      console.log("App.js - Rendering basic content as fallback");
      var rootElement = document.getElementById('root');
      if (!rootElement) return;
      
      createBasicAppContent(rootElement);
    }
    
    function createBasicAppContent(rootElement) {
      // Create a simple router-based app
      var SimpleApp = function() {
        return window.React.createElement(window.ReactRouterDOM.HashRouter, null,
          window.React.createElement(window.ReactRouterDOM.Routes, null,
            window.React.createElement(window.ReactRouterDOM.Route, { 
              path: '/', 
              element: window.React.createElement(window.ReactRouterDOM.Navigate, { to: '/guia-online', replace: true })
            }),
            window.React.createElement(window.ReactRouterDOM.Route, { 
              path: '/guia-online', 
              element: window.React.createElement('div', { style: { textAlign: 'center', padding: '40px' } },
                window.React.createElement('h1', null, 'Guia de Plano de Parto'),
                window.React.createElement('p', null, 'Bem-vinda ao Guia de Plano de Parto!'),
                window.React.createElement('p', null, 'Estamos carregando o conteúdo. Por favor, aguarde ou tente recarregar a página.')
              )
            }),
            window.React.createElement(window.ReactRouterDOM.Route, {
              path: '/criar-plano', 
              element: window.React.createElement('div', { style: { textAlign: 'center', padding: '40px' } },
                window.React.createElement('h1', null, 'Construtor de Plano de Parto'),
                window.React.createElement('p', null, 'Estamos preparando seu construtor de plano de parto.'),
                window.React.createElement('p', null, 'Por favor, aguarde um momento...')
              )
            }),
            window.React.createElement(window.ReactRouterDOM.Route, {
              path: '*',
              element: window.React.createElement('div', { style: { textAlign: 'center', padding: '40px' } },
                window.React.createElement('h1', null, 'Página não encontrada'),
                window.React.createElement('p', null, 'A página que você está procurando não existe.'),
                window.React.createElement('a', { href: '#/guia-online' }, 'Voltar para o Guia')
              )
            })
          )
        );
      };
      
      try {
        if (window.ReactDOM.createRoot) {
          window.ReactDOM.createRoot(rootElement).render(window.React.createElement(SimpleApp));
        } else {
          window.ReactDOM.render(window.React.createElement(SimpleApp), rootElement);
        }
        console.log("App.js - Basic routing app rendered successfully");
      } catch (error) {
        console.error("App.js - Error rendering basic content:", error);
        rootElement.innerHTML = '<div style="text-align: center; padding: 40px;"><h1>Guia de Plano de Parto</h1><p>Estamos com dificuldades para carregar o conteúdo. Por favor, tente recarregar a página.</p></div>';
      }
    }
    
    function fallbackToCompatMode() {
      console.log("App.js - Falling back to compatibility mode");
      var script = document.createElement('script');
      script.src = '/src/compat-entry.js';
      script.type = 'text/javascript';
      document.body.appendChild(script);
    }
  } catch (outerError) {
    console.error("App.js - Critical error:", outerError);
    
    // Try to render basic UI when everything else fails
    var rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = '<div style="text-align: center; padding: 40px;"><h1>Guia de Plano de Parto</h1><p>Ocorreu um erro ao carregar a aplicação. Por favor, tente novamente mais tarde.</p></div>';
    }
  }
})();

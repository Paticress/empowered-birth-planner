
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
      // Check if App component is already available
      if (typeof window.App === 'function') {
        console.log("App.js - App component already available, rendering it");
        renderAppComponent();
        return;
      }
      
      console.log("App.js - Loading App.tsx content");
      
      // Try to import the App component properly
      var appScript = document.createElement('script');
      appScript.src = './src/main.js';
      
      appScript.onload = function() {
        console.log("App.js - Successfully loaded main.js");
        
        // Force render after a short delay to ensure everything is loaded
        setTimeout(function() {
          renderAppComponent();
        }, 100);
      };
      
      appScript.onerror = function(error) {
        console.error("App.js - Failed to load main.js:", error);
        fallbackToCompatMode();
      };
      
      document.body.appendChild(appScript);
    }
    
    function renderAppComponent() {
      try {
        console.log("App.js - Rendering full App component");
        var rootElement = document.getElementById('root');
        
        if (rootElement) {
          // Clear any fallback content first
          rootElement.innerHTML = '';
          
          // Create basic app content if needed
          if (!window.App || typeof window.App !== 'function') {
            console.warn("App.js - App component not properly loaded, using basic content");
            createBasicAppContent(rootElement);
            return;
          }
          
          // Use React 18's createRoot API if available
          if (window.ReactDOM && window.ReactDOM.createRoot) {
            var root = window.ReactDOM.createRoot(rootElement);
            root.render(window.React.createElement(window.App));
          } else {
            // Fallback for older React versions
            window.ReactDOM.render(window.React.createElement(window.App), rootElement);
          }
          
          console.log("App.js - App component successfully rendered");
        } else {
          console.error("App.js - Root element not found in DOM");
        }
      } catch (err) {
        console.error("App.js - Error rendering App component:", err);
        fallbackToCompatMode();
      }
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
      } catch (error) {
        console.error("App.js - Error rendering basic content:", error);
        rootElement.innerHTML = '<div style="text-align: center; padding: 40px;"><h1>Guia de Plano de Parto</h1><p>Estamos com dificuldades para carregar o conteúdo. Por favor, tente recarregar a página.</p></div>';
      }
    }
    
    function fallbackToCompatMode() {
      console.log("App.js - Falling back to compatibility mode");
      var script = document.createElement('script');
      script.src = '/src/compat-entry.js';
      document.body.appendChild(script);
    }
  } catch (outerError) {
    console.error("App.js - Critical error:", outerError);
  }
})();

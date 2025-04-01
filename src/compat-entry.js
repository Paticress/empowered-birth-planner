
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
  
  // Create and load the compatibility scripts
  function loadScript(src, callback) {
    var script = document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    script.crossOrigin = "anonymous";
    script.onload = callback || function() {};
    script.onerror = function(error) {
      console.error("Failed to load compat script:", src, error);
      
      // Try alternative source if it's a CDN
      if (src.includes('unpkg.com')) {
        var altSrc = src.replace('unpkg.com', 'cdn.jsdelivr.net/npm');
        console.log("Trying alternative CDN:", altSrc);
        loadScript(altSrc, callback);
      } else {
        // If not a CDN, show error but still call callback to continue
        if (callback) callback();
      }
    };
    document.body.appendChild(script);
  }
  
  // Load a simple React app with loading UI
  function createSimpleApp() {
    const rootElement = document.getElementById('root');
    if (!rootElement) return;
    
    if (window.React && window.ReactDOM) {
      const LoadingApp = function() {
        return React.createElement('div', { style: { textAlign: 'center', padding: '20px' } },
          React.createElement('h1', null, "Guia de Plano de Parto"),
          React.createElement('p', null, "Carregando conteúdo..."),
          React.createElement('div', { style: { 
            width: '40px', 
            height: '40px', 
            margin: '20px auto',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 2s linear infinite'
          } })
        );
      };
      
      // Add a style for the spinner
      const style = document.createElement('style');
      style.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
      document.head.appendChild(style);
      
      // Render the basic app
      try {
        if (ReactDOM.createRoot) {
          ReactDOM.createRoot(rootElement).render(React.createElement(LoadingApp));
        } else {
          ReactDOM.render(React.createElement(LoadingApp), rootElement);
        }
      } catch (error) {
        console.error("Failed to render simple app:", error);
        rootElement.innerHTML = '<div style="text-align: center; padding: 20px;"><h2>Carregando...</h2></div>';
      }
    } else {
      rootElement.innerHTML = '<div style="text-align: center; padding: 20px;"><h2>Carregando...</h2></div>';
    }
  }
  
  // Create a simple loading UI
  createSimpleApp();
  
  // Define a simpler version of the App
  window.App = window.App || function() {
    return React.createElement('div', null, "Carregando...");
  };
  
  // Ensure React is loaded before proceeding
  function ensureReactLoaded(callback) {
    if (window.React && window.ReactDOM) {
      callback();
      return;
    }
    
    console.log("Compat - Loading React dependencies");
    
    // Load React first
    loadScript('https://unpkg.com/react@18/umd/react.production.min.js', function() {
      // Then load ReactDOM
      loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js', function() {
        callback();
      });
    });
  }
  
  // Helper function to directly initialize the app from our App.tsx component
  function initApp() {
    try {
      // Try to load our real App component
      const script = document.createElement('script');
      script.type = "text/javascript";
      script.src = "/src/App.tsx.js"; // Using the compiled version if available
      script.onerror = function() {
        console.error("Could not load App.tsx.js, trying App.js");
        
        const appScript = document.createElement('script');
        appScript.type = "text/javascript";
        appScript.src = "/src/App.js";
        appScript.onerror = function() {
          console.error("Could not load App.js, falling back to router only");
          initSimpleRouter();
        };
        document.body.appendChild(appScript);
      };
      script.onload = function() {
        console.log("Successfully loaded App component in compatibility mode");
        
        // Render the App component if it's available
        if (typeof window.App === 'function') {
          const rootElement = document.getElementById('root');
          if (rootElement) {
            try {
              if (ReactDOM.createRoot) {
                ReactDOM.createRoot(rootElement).render(React.createElement(window.App));
              } else {
                ReactDOM.render(React.createElement(window.App), rootElement);
              }
            } catch (err) {
              console.error("Failed to render App component:", err);
              initSimpleRouter();
            }
          }
        } else {
          console.error("App component not available");
          initSimpleRouter();
        }
      };
      document.body.appendChild(script);
    } catch (error) {
      console.error("Error initializing App:", error);
      initSimpleRouter();
    }
  }
  
  // Load React Router DOM and initialize app
  ensureReactLoaded(function() {
    // Ensure React Router is loaded
    if (!window.ReactRouterDOM) {
      loadScript('https://unpkg.com/react-router-dom@6/umd/react-router-dom.production.min.js', function() {
        console.log("ReactRouterDOM loaded in compat mode");
        initApp();
      });
    } else {
      initApp();
    }
  });
  
  function initSimpleRouter() {
    ensureReactLoaded(function() {
      // Load React Router if needed
      if (!window.ReactRouterDOM) {
        loadScript('https://unpkg.com/react-router-dom@6/umd/react-router-dom.production.min.js', function() {
          createSimpleRouter();
        });
      } else {
        createSimpleRouter();
      }
    });
  }
  
  function createSimpleRouter() {
    // Try to get the correct object
    const RouterObj = window.ReactRouterDOM || {};
    const HashRouter = RouterObj.HashRouter;
    const Routes = RouterObj.Routes;
    const Route = RouterObj.Route;
    const Navigate = RouterObj.Navigate;
    
    // If any of the objects is missing, build a simple fallback
    if (!HashRouter || !Routes || !Route) {
      console.error("Router components not available, showing simple page");
      const rootElement = document.getElementById('root');
      if (rootElement) {
        rootElement.innerHTML = `
          <div style="text-align: center; padding: 40px;">
            <h1>Guia de Plano de Parto</h1>
            <p>Bem-vinda ao Guia de Plano de Parto!</p>
            <p>Estamos carregando o conteúdo em modo de compatibilidade.</p>
            <p>Por favor, aguarde ou tente recarregar a página.</p>
          </div>
        `;
      }
      return;
    }
    
    // Create a simple router
    const RouterApp = function() {
      return React.createElement(HashRouter, null,
        React.createElement(Routes, null,
          React.createElement(Route, { 
            path: '/', 
            element: React.createElement(Navigate, { to: '/guia-online', replace: true })
          }),
          React.createElement(Route, { 
            path: '/guia-online', 
            element: React.createElement('div', {
              style: { textAlign: 'center', padding: '40px' }
            }, 
              React.createElement('h1', null, 'Guia de Plano de Parto'),
              React.createElement('p', null, 'Bem-vinda ao Guia de Plano de Parto!'),
              React.createElement('p', null, 'Estamos carregando o conteúdo em modo de compatibilidade.'),
              React.createElement('p', null, 'Por favor, aguarde ou tente recarregar a página.')
            )
          }),
          React.createElement(Route, { 
            path: '*', 
            element: React.createElement('div', {
              style: { textAlign: 'center', padding: '40px' }
            },
              React.createElement('h1', null, 'Página não encontrada'),
              React.createElement('p', null, 'A página que você está procurando não existe.'),
              React.createElement('a', { href: '#/guia-online' }, 'Voltar para o Guia')
            )
          })
        )
      );
    };
    
    const rootElement = document.getElementById('root');
    if (rootElement) {
      try {
        if (ReactDOM.createRoot) {
          ReactDOM.createRoot(rootElement).render(React.createElement(RouterApp));
        } else {
          ReactDOM.render(React.createElement(RouterApp), rootElement);
        }
      } catch (error) {
        console.error("Failed to render router app:", error);
        rootElement.innerHTML = `
          <div style="text-align: center; padding: 40px;">
            <h1>Guia de Plano de Parto</h1>
            <p>Ocorreu um erro ao carregar a aplicação.</p>
            <p>Por favor, tente recarregar a página.</p>
          </div>
        `;
      }
    }
  }
})();

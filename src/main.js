
// Non-module entry point for maximum browser compatibility
(function() {
  console.log('Using main.js entry point (non-module version)');

  // Flag to prevent double initialization
  window.__MAIN_EXECUTED = window.__MAIN_EXECUTED || false;

  // Skip if already executed
  if (window.__MAIN_EXECUTED) {
    console.log("Main.js - Application already initialized");
    return;
  }
  
  window.__MAIN_EXECUTED = true;
  console.log("Main.js - Initializing application using standard script");
  
  // Make sure React and ReactDOM are available globally
  if (!window.React || !window.ReactDOM) {
    console.error("Main.js - React or ReactDOM not available globally");
    
    // Load React and ReactDOM from CDN
    loadScript('https://unpkg.com/react@18/umd/react.production.min.js', function() {
      loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js', function() {
        loadReactDependencies();
      });
    });
  } else {
    loadReactDependencies();
  }
  
  // Load React dependencies (Router, etc.)
  function loadReactDependencies() {
    if (window.ReactRouterDOM) {
      renderApp();
    } else {
      loadScript('https://unpkg.com/react-router-dom@6/umd/react-router-dom.production.min.js', function() {
        renderApp();
      });
    }
  }
  
  // Utility to load scripts
  function loadScript(src, callback) {
    var script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    script.onerror = function(error) {
      console.error('Failed to load script:', src, error);
      // Show error message to user
      var rootElement = document.getElementById('root');
      if (rootElement) {
        rootElement.innerHTML = '<div style="text-align: center; padding: 20px;"><h1>Erro ao carregar</h1><p>Não foi possível carregar recursos necessários.</p><p><a href="/">Tentar novamente</a></p></div>';
      }
    };
    document.body.appendChild(script);
  }
  
  function renderApp() {
    console.log("Main.js - All dependencies loaded, rendering app");
    var rootElement = document.getElementById('root');
    
    if (!rootElement) {
      console.error("Main.js - Root element not found in DOM!");
      // Create a root element as a fallback
      var newRoot = document.createElement('div');
      newRoot.id = 'root';
      document.body.appendChild(newRoot);
      rootElement = newRoot;
      console.log("Main.js - Created root element as fallback");
    }
    
    try {
      // Simple App component
      function App() {
        // Get HashRouter, Routes and Route from React Router DOM
        var HashRouter = ReactRouterDOM.HashRouter;
        var Routes = ReactRouterDOM.Routes;
        var Route = ReactRouterDOM.Route;
        var Navigate = ReactRouterDOM.Navigate;
        
        return React.createElement(HashRouter, null,
          React.createElement(Routes, null,
            React.createElement(Route, { path: "/", element: React.createElement(Navigate, { to: "/guia-online", replace: true }) }),
            React.createElement(Route, { path: "/guia-online", element: 
              React.createElement('div', { className: "text-center py-8 px-4" },
                React.createElement('h1', { className: "text-2xl font-bold mb-4" }, "Guia de Plano de Parto"),
                React.createElement('p', { className: "mb-4" }, "Carregando conteúdo..."),
                React.createElement('div', { className: "w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto" })
              )
            }),
            React.createElement(Route, { path: "*", element: 
              React.createElement('div', { style: { padding: '2rem', textAlign: 'center' } },
                React.createElement('h1', null, 'Página não encontrada'),
                React.createElement('p', null, 'A página que você está procurando não existe.'),
                React.createElement('p', null, 
                  React.createElement('a', { href: '/', style: { color: '#0066ff', textDecoration: 'none' } }, 'Voltar para a página inicial')
                )
              )
            })
          )
        );
      }
      
      // Use React 18's createRoot API if available, fallback to older render method
      if (ReactDOM.createRoot) {
        var root = ReactDOM.createRoot(rootElement);
        root.render(React.createElement(App));
      } else {
        // Fallback for older browsers
        ReactDOM.render(React.createElement(App), rootElement);
      }
      
      console.log("Main.js - Initial app rendered successfully");
      
      // Now try to load the full app bundle
      setTimeout(function() {
        loadFullAppBundle();
      }, 500);
    } catch (err) {
      console.error("Main.js - Error rendering application:", err);
      if (rootElement) {
        rootElement.innerHTML = '<div style="text-align: center; padding: 20px;"><h1>Erro ao carregar</h1><p>Tente recarregar a página.</p><p><a href="/">Recarregar</a></p></div>';
      }
    }
  }
  
  // Load the full application bundle
  function loadFullAppBundle() {
    try {
      // First try to load as module
      var moduleScript = document.createElement('script');
      moduleScript.src = '/src/main.jsx';
      moduleScript.type = 'module';
      moduleScript.onerror = function() {
        console.log("Main.js - Failed to load as module, trying non-module version");
        // Fallback to non-module version
        var script = document.createElement('script');
        script.src = '/assets/index.js';
        script.type = 'text/javascript';
        script.onerror = function() {
          console.error("Main.js - Failed to load full app bundle");
        };
        document.body.appendChild(script);
      };
      document.body.appendChild(moduleScript);
    } catch (error) {
      console.error("Main.js - Error loading full app bundle:", error);
    }
  }
})();

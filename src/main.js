
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
    
    // Try to load them dynamically
    var reactScript = document.createElement('script');
    reactScript.src = 'https://unpkg.com/react@18/umd/react.production.min.js';
    reactScript.onload = function() {
      var reactDOMScript = document.createElement('script');
      reactDOMScript.src = 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js';
      reactDOMScript.onload = renderApp;
      document.body.appendChild(reactDOMScript);
    };
    document.body.appendChild(reactScript);
  } else {
    // React is available, render the app
    renderApp();
  }
  
  function renderApp() {
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
      // Load React Router and other dependencies
      loadReactRouter(function() {
        // Main App component rendered with React 18 createRoot
        var root = ReactDOM.createRoot(rootElement);
        
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
              React.createElement(Route, { path: "*", element: 
                React.createElement('div', { style: { padding: '2rem', textAlign: 'center' } },
                  React.createElement('h1', null, 'Carregando conteúdo...'),
                  React.createElement('p', null, 'Por favor aguarde enquanto carregamos o conteúdo.'),
                  React.createElement('p', null, 
                    React.createElement('a', { href: '/' }, 'Recarregar página')
                  )
                )
              })
            )
          );
        }
        
        // Render the App
        root.render(React.createElement(App));
        console.log("Main.js - Initial app rendered successfully");
        
        // Now load the full app bundle
        var mainScript = document.createElement('script');
        mainScript.src = '/assets/index.js';
        mainScript.type = 'text/javascript';
        mainScript.onload = function() {
          console.log("Main.js - Full application bundle loaded");
        };
        mainScript.onerror = function(err) {
          console.error("Main.js - Error loading full app bundle:", err);
        };
        document.body.appendChild(mainScript);
      });
    } catch (err) {
      console.error("Main.js - Error rendering application:", err);
      if (rootElement) {
        rootElement.innerHTML = '<div style="text-align: center; padding: 20px;"><h1>Erro ao carregar</h1><p>Tente recarregar a página.</p><p><a href="/">Recarregar</a></p></div>';
      }
    }
  }
  
  // Helper to load React Router
  function loadReactRouter(callback) {
    if (window.ReactRouterDOM) {
      callback();
      return;
    }
    
    var routerScript = document.createElement('script');
    routerScript.src = 'https://unpkg.com/react-router-dom@6/umd/react-router-dom.production.min.js';
    routerScript.onload = callback;
    routerScript.onerror = function() {
      console.error("Failed to load React Router");
      var rootElement = document.getElementById('root');
      if (rootElement) {
        rootElement.innerHTML = '<div style="text-align: center; padding: 20px;"><h1>Erro ao carregar</h1><p>Não foi possível carregar as dependências necessárias.</p><p><a href="/">Tentar novamente</a></p></div>';
      }
    };
    document.body.appendChild(routerScript);
  }
})();


// Compatibility entry point for browsers that don't support ES modules
console.log("Compat-entry.js - Loading compatibility mode");

(function() {
  // Check if we've already loaded this file to prevent double execution
  if (window.__COMPAT_ENTRY_LOADED) {
    console.log("Compat-entry.js - Already loaded, skipping initialization");
    return;
  }
  
  window.__COMPAT_ENTRY_LOADED = true;
  
  // Helper function to load scripts sequentially
  function loadScript(src, callback) {
    console.log("Compat-entry.js - Loading script:", src);
    const script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    script.onerror = function(error) {
      console.error("Compat-entry.js - Failed to load script:", src, error);
    };
    document.body.appendChild(script);
  }
  
  // Show error message
  function showError(message) {
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="text-align: center; padding: 20px;">
          <h1>Erro ao carregar</h1>
          <p>${message}</p>
          <p><a href="/" onclick="window.location.reload(); return false;">Tentar novamente</a></p>
        </div>
      `;
    }
  }
  
  // First, ensure React and ReactDOM are available
  if (!window.React || !window.ReactDOM) {
    loadScript('https://unpkg.com/react@18/umd/react.production.min.js', function() {
      loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js', function() {
        loadReactRouter();
      });
    });
  } else {
    loadReactRouter();
  }
  
  // Load React Router
  function loadReactRouter() {
    if (!window.ReactRouterDOM) {
      loadScript('https://unpkg.com/react-router-dom@6/umd/react-router-dom.production.min.js', function() {
        loadAppContent();
      });
    } else {
      loadAppContent();
    }
  }
  
  // Load the application content
  function loadAppContent() {
    try {
      // Create a basic app with React Router
      const rootElement = document.getElementById('root');
      if (!rootElement) {
        console.error("Root element not found");
        return;
      }
      
      // Create a simple fallback app
      const SimpleApp = function() {
        return React.createElement(ReactRouterDOM.HashRouter, null,
          React.createElement(ReactRouterDOM.Routes, null,
            React.createElement(ReactRouterDOM.Route, { 
              path: "/", 
              element: React.createElement(ReactRouterDOM.Navigate, { to: "/guia-online", replace: true }) 
            }),
            React.createElement(ReactRouterDOM.Route, { 
              path: "/guia-online", 
              element: React.createElement('div', { className: "text-center p-8" },
                React.createElement('h1', { className: "text-2xl font-bold mb-4" }, "Guia de Plano de Parto"),
                React.createElement('p', null, "Carregando conteúdo..."),
                React.createElement('div', { className: "w-12 h-12 border-t-4 border-blue-500 rounded-full animate-spin mx-auto mt-4" })
              )
            }),
            React.createElement(ReactRouterDOM.Route, { 
              path: "*", 
              element: React.createElement('div', { className: "text-center p-8" },
                React.createElement('h1', { className: "text-2xl font-bold mb-4" }, "Página não encontrada"),
                React.createElement('a', { href: "/", className: "text-blue-500" }, "Ir para página inicial")
              )
            })
          )
        );
      };
      
      // Render the simple app
      if (ReactDOM.createRoot) {
        ReactDOM.createRoot(rootElement).render(React.createElement(SimpleApp));
      } else {
        ReactDOM.render(React.createElement(SimpleApp), rootElement);
      }
      
      console.log("Compat-entry.js - Basic application rendered");
      
      // Try to load the full app script
      loadScript('/src/App.js', function() {
        console.log("Compat-entry.js - App.js loaded successfully");
      });
    } catch (error) {
      console.error("Compat-entry.js - Critical error:", error);
      showError("Ocorreu um erro crítico ao carregar a aplicação. Por favor, tente novamente mais tarde.");
    }
  }
})();


// This is intentionally a non-module file for maximum compatibility
// It will be properly processed by Vite during build
(function() {
  console.log("Main.tsx - Application bootstrapping started");
  
  // Flag to track if main.tsx script has already executed
  if (typeof window !== 'undefined') {
    window.__MAIN_EXECUTED = window.__MAIN_EXECUTED || false;
    
    if (window.__MAIN_EXECUTED) {
      console.log("Main.tsx - Already executed, skipping initialization");
      return;
    }
    
    window.__MAIN_EXECUTED = true;
  }

  // Improved error handling function
  function handleGlobalError(message, source, lineno, colno, error) {
    console.error('Global error caught:', { message, source, lineno, colno, error });
    
    // Check if we're getting module-related errors
    if (typeof message === 'string' && 
        (message.includes('import.meta') || 
         message.includes('module') || 
         message.includes('MIME'))) {
      
      console.warn('Module/MIME error detected, falling back to compatibility mode');
      
      // Create a message in the root element
      const rootEl = document.getElementById('root');
      if (rootEl) {
        rootEl.innerHTML = `
          <div style="text-align: center; padding: 20px;">
            <h2>Carregando em modo alternativo...</h2>
            <p>Aguarde um momento enquanto carregamos a aplicação.</p>
          </div>
        `;
      }
      
      // Load the compatibility script
      const script = document.createElement('script');
      script.src = '/src/compat-entry.js';
      script.type = 'text/javascript';
      document.body.appendChild(script);
      
      // Prevent further execution of this script
      return true;
    }
    
    return false;
  }

  // Set up global error handler
  if (typeof window !== 'undefined') {
    window.onerror = window.onerror || handleGlobalError;
  }

  // Create a simple app structure without module imports
  if (typeof window !== 'undefined' && typeof React !== 'undefined' && typeof ReactDOM !== 'undefined') {
    console.log("Main.tsx - Rendering simple application to DOM");
    
    // Create a simple app structure
    const SimpleApp = function() {
      return React.createElement('div', { className: "text-center py-8" },
        React.createElement('h1', { className: "text-2xl font-bold" }, "Guia de Plano de Parto"),
        React.createElement('p', { className: "mt-4" }, "Carregando conteúdo..."),
        React.createElement('div', { className: "w-12 h-12 border-t-4 border-blue-500 rounded-full animate-spin mx-auto mt-4" })
      );
    };
    
    // Extract HashRouter and other components if available
    const { HashRouter, Routes, Route, Navigate } = window.ReactRouterDOM || {
      HashRouter: function(props) { return props.children; },
      Routes: function(props) { return props.children; },
      Route: function() { return null; },
      Navigate: function() { return null; }
    };
    
    // Create a router-based app
    const RouterApp = function() {
      return React.createElement(HashRouter, null,
        React.createElement(Routes, null,
          React.createElement(Route, { 
            path: '/', 
            element: React.createElement(Navigate, { to: '/guia-online', replace: true }) 
          }),
          React.createElement(Route, { 
            path: '/guia-online', 
            element: React.createElement(SimpleApp)
          }),
          React.createElement(Route, { 
            path: '*', 
            element: React.createElement(SimpleApp)
          })
        )
      );
    };
    
    // Render the app
    const rootElement = document.getElementById('root');
    if (rootElement) {
      try {
        if (ReactDOM.createRoot) {
          ReactDOM.createRoot(rootElement).render(React.createElement(RouterApp));
        } else {
          ReactDOM.render(React.createElement(RouterApp), rootElement);
        }
        console.log("Main.tsx - Simple app rendered successfully");
      } catch (error) {
        console.error("Main.tsx - Error rendering application:", error);
        rootElement.innerHTML = '<div style="text-align: center; padding: 20px;"><h2>Erro ao carregar aplicação</h2><p>Tente recarregar a página</p></div>';
      }
    } else {
      console.error("Main.tsx - Root element not found in DOM!");
    }
  } else {
    console.log("Main.tsx - React or ReactDOM not available, deferring rendering");
  }
})();

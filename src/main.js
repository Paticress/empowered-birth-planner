
// Non-module entry point for maximum browser compatibility
(function() {
  console.log('Main.js - Using non-module entry point');
  
  // Import modules (will be bundled by build tools or handled by compat-entry for older browsers)
  const scriptLoader = typeof module !== 'undefined' ? require('./utils/script-loader.js') : null;
  const reactDeps = typeof module !== 'undefined' ? require('./utils/react-dependencies.js') : null;
  const errorHandler = typeof module !== 'undefined' ? require('./utils/error-handler.js') : null;
  const appRenderer = typeof module !== 'undefined' ? require('./utils/app-renderer.js') : null;

  // Flag to prevent double initialization
  if (window.__MAIN_JS_EXECUTED) {
    console.log("Main.js - Application already initialized by non-module entry point");
    return;
  }
  
  window.__MAIN_JS_EXECUTED = true;
  console.log("Main.js - Initializing application using standard script");
  
  // Setup error handling
  if (errorHandler) {
    errorHandler.setupGlobalErrorHandler();
  } else {
    // Fallback implementation when modules can't be loaded
    window.onerror = function(message, source, lineno, colno, error) {
      console.error('Global error caught:', { message, source, lineno, colno, error });
      
      if (typeof message === 'string' && 
          (message.includes('import.meta') || message.includes('module') || message.includes('MIME'))) {
        console.warn('Module/MIME error detected, falling back to compatibility mode');
        loadCompatibilityMode();
        return true;
      }
      
      return false;
    };
  }
  
  // Utility to load scripts with fallbacks (fallback implementation)
  function loadScript(src, callback, attributes) {
    if (scriptLoader) {
      return scriptLoader.loadScript(src, callback, attributes);
    }
    
    console.log("Main.js - Loading script:", src);
    var script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    
    // Apply additional attributes if provided
    if (attributes) {
      for (var key in attributes) {
        script.setAttribute(key, attributes[key]);
      }
    }
    
    script.onerror = function(error) {
      console.error('Failed to load script:', src, error);
      
      // Try fallback CDN if this is a CDN script
      if (src.includes('unpkg.com')) {
        var fallbackSrc = src.replace('unpkg.com', 'cdn.jsdelivr.net/npm');
        console.log("Main.js - Trying fallback CDN:", fallbackSrc);
        loadScript(fallbackSrc, callback, attributes);
      } else {
        showError('Erro ao carregar recursos necessários: ' + src);
      }
    };
    document.body.appendChild(script);
    
    return script;
  }
  
  // Error display function (fallback implementation)
  function showError(message) {
    if (errorHandler) {
      return errorHandler.showError(message);
    }
    
    console.error("Application error:", message);
    var rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = '<div style="text-align: center; padding: 20px;"><h1>Erro ao carregar</h1><p>' + 
        message + '</p><p><a href="/" style="color: #0066ff; text-decoration: none;" onclick="window.location.reload(); return false;">Tentar novamente</a></p></div>';
    }
  }

  // Function to check if a script is already loaded
  function isScriptLoaded(globalVar) {
    if (scriptLoader) {
      return scriptLoader.isScriptLoaded(globalVar);
    }
    return typeof window[globalVar] !== 'undefined';
  }

  // Make sure React and ReactDOM are available globally
  function loadReactDependencies() {
    if (reactDeps) {
      reactDeps.loadAllReactDependencies(function() {
        renderApp();
      });
      return;
    }
    
    if (!isScriptLoaded('React') || !isScriptLoaded('ReactDOM')) {
      console.warn("Main.js - React or ReactDOM not available globally, loading from CDN");
      
      // Load React first if needed
      if (!isScriptLoaded('React')) {
        loadScript('https://unpkg.com/react@18/umd/react.production.min.js', function() {
          // Then load ReactDOM if needed
          if (!isScriptLoaded('ReactDOM')) {
            loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js', function() {
              loadReactRouter();
            }, { crossorigin: "anonymous" });
          } else {
            loadReactRouter();
          }
        }, { crossorigin: "anonymous" });
      } else if (!isScriptLoaded('ReactDOM')) {
        // React is loaded but ReactDOM isn't
        loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js', function() {
          loadReactRouter();
        }, { crossorigin: "anonymous" });
      }
    } else {
      loadReactRouter();
    }
  }
  
  // Load React Router
  function loadReactRouter() {
    if (isScriptLoaded('ReactRouterDOM')) {
      renderApp();
    } else {
      console.log("Main.js - Loading React Router from CDN");
      loadScript('https://unpkg.com/react-router-dom@6/umd/react-router-dom.production.min.js', function() {
        renderApp();
      }, { crossorigin: "anonymous" });
    }
  }
  
  // Render the application
  function renderApp() {
    console.log("Main.js - All dependencies loaded, rendering app");
    
    if (appRenderer && appRenderer.renderSimpleApp) {
      const success = appRenderer.renderSimpleApp();
      if (success) {
        appRenderer.loadFullAppBundle().catch(err => {
          console.error("Failed to load full app bundle:", err);
        });
      } else {
        loadCompatibilityMode();
      }
      return;
    }
    
    var rootElement = document.getElementById('root');
    
    if (!rootElement) {
      console.error("Main.js - Root element not found in DOM!");
      rootElement = document.createElement('div');
      rootElement.id = 'root';
      document.body.appendChild(rootElement);
      console.log("Main.js - Created root element as fallback");
    }
    
    try {
      // Create a very basic loading state UI while we load the full app
      var LoadingApp = function() {
        return React.createElement('div', { className: "text-center py-8 px-4" },
          React.createElement('h1', { className: "text-2xl font-bold mb-4" }, "Guia de Plano de Parto"),
          React.createElement('p', { className: "mb-4" }, "Carregando conteúdo..."),
          React.createElement('div', { className: "w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto" })
        );
      };
      
      // Use HashRouter for maximum compatibility
      var HashRouter = ReactRouterDOM.HashRouter;
      var Routes = ReactRouterDOM.Routes;
      var Route = ReactRouterDOM.Route;
      var Navigate = ReactRouterDOM.Navigate;
      
      var SimpleApp = function() {
        return React.createElement(HashRouter, null,
          React.createElement(Routes, null,
            React.createElement(Route, { path: "/", element: React.createElement(Navigate, { to: "/guia-online", replace: true }) }),
            React.createElement(Route, { path: "/guia-online", element: React.createElement(LoadingApp) }),
            React.createElement(Route, { path: "/embedded-guia", element: React.createElement(LoadingApp) }),
            React.createElement(Route, { path: "/criar-plano", element: React.createElement(LoadingApp) }),
            React.createElement(Route, { path: "/embedded-plano", element: React.createElement(LoadingApp) }),
            React.createElement(Route, { path: "*", element: 
              React.createElement('div', { style: { padding: '2rem', textAlign: 'center' } },
                React.createElement('h1', null, 'Página não encontrada'),
                React.createElement('p', null, 'A página que você está procurando não existe.'),
                React.createElement('a', { href: '/', style: { color: '#0066ff', textDecoration: 'none' } }, 'Voltar para a página inicial')
              )
            })
          )
        );
      };
      
      // Use React 18's createRoot API if available, fallback to older render method
      if (ReactDOM.createRoot) {
        ReactDOM.createRoot(rootElement).render(React.createElement(SimpleApp));
      } else {
        ReactDOM.render(React.createElement(SimpleApp), rootElement);
      }
      
      console.log("Main.js - Simple app rendered successfully");
      
      // Now try to load the full app bundle
      loadFullAppBundle();
    } catch (err) {
      console.error("Main.js - Error rendering application:", err);
      showError('Erro ao inicializar a aplicação. Tente recarregar a página. Detalhes: ' + err.message);
      loadCompatibilityMode();
    }
  }
  
  // Load the full application bundle
  function loadFullAppBundle() {
    try {
      // Import the main React application
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '/src/App.js';
      script.onerror = function(error) {
        console.error("Failed to load full app bundle:", error);
        // The simple app is already rendered, so no need to show an error
      };
      document.body.appendChild(script);
    } catch (error) {
      console.error("Main.js - Error loading full app bundle:", error);
      loadCompatibilityMode();
    }
  }
  
  // Fall back to compatibility mode if needed
  function loadCompatibilityMode() {
    console.log("Main.js - Loading compatibility mode");
    var compatScript = document.createElement('script');
    compatScript.src = '/src/compat-entry.js';
    compatScript.type = 'text/javascript';
    document.body.appendChild(compatScript);
  }
  
  // Start the loading sequence
  loadReactDependencies();
})();

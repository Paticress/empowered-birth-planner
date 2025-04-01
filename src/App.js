
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
      
      // Try loading the App.tsx as a normal script first (not as module)
      const script = document.createElement('script');
      script.src = './src/App.tsx';
      script.type = 'text/javascript'; // Force non-module for broader compatibility
      
      script.onload = function() {
        console.log("App.js - Loaded App.tsx successfully as regular script");
        renderApp();
      };
      
      script.onerror = function() {
        console.log("App.js - Failed to load App.tsx as script, trying direct import");
        
        // Create a simple minimal implementation as a last resort
        window.App = window.App || function SimpleApp() {
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
                  window.React.createElement('p', null, 'Bem-vinda ao Guia de Plano de Parto!')
                )
              }),
              window.React.createElement(window.ReactRouterDOM.Route, {
                path: '/criar-plano', 
                element: window.React.createElement('div', { style: { textAlign: 'center', padding: '40px' } },
                  window.React.createElement('h1', null, 'Construtor de Plano de Parto'),
                  window.React.createElement('p', null, 'Estamos preparando seu construtor de plano de parto.')
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
        
        renderApp();
      };
      
      document.body.appendChild(script);
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

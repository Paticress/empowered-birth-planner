
// Fallback entry point for browsers that don't support ES modules
console.log('Using fallback main.js entry point (non-module version)');

// Flag to prevent double initialization
window.__MAIN_EXECUTED = window.__MAIN_EXECUTED || false;

// Skip if already executed
if (window.__MAIN_EXECUTED) {
  console.log("Main.js - Application already initialized");
} else {
  window.__MAIN_EXECUTED = true;
  console.log("Main.js - Initializing application using fallback script");
  
  // Make sure React and ReactDOM are available globally
  if (!window.React || !window.ReactDOM) {
    console.error("Main.js - React or ReactDOM not available globally");
    
    // Try to load them dynamically
    var reactScript = document.createElement('script');
    reactScript.src = 'https://unpkg.com/react@18/umd/react.production.min.js';
    reactScript.onload = function() {
      var reactDOMScript = document.createElement('script');
      reactDOMScript.src = 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js';
      reactDOMScript.onload = renderFallbackApp;
      document.body.appendChild(reactDOMScript);
    };
    document.body.appendChild(reactScript);
  } else {
    // React is available, render the app
    renderFallbackApp();
  }
  
  function renderFallbackApp() {
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
      // Simple fallback app using global React
      var React = window.React;
      var ReactDOM = window.ReactDOM;
      
      // Simple component just to show loading
      var App = function() {
        return React.createElement('div', {
            style: {
              fontFamily: 'system-ui, -apple-system, sans-serif',
              maxWidth: '600px',
              margin: '0 auto',
              padding: '2rem',
              textAlign: 'center'
            }
          },
          React.createElement('h1', null, 'Carregando Guia de Plano de Parto'),
          React.createElement('p', null, 'Por favor, aguarde enquanto carregamos o conteúdo.'),
          React.createElement('p', null, 
            React.createElement('a', { href: '/' }, 'Recarregar página')
          )
        );
      };
      
      // Render using ReactDOM
      var root = ReactDOM.createRoot(rootElement);
      root.render(React.createElement(App, null));
      
      console.log("Main.js - Fallback app rendered successfully");
      
      // Try to redirect to a more compatible version after a short delay
      setTimeout(function() {
        window.location.href = '/?legacy=true';
      }, 5000);
      
    } catch (err) {
      console.error("Main.js - Error rendering application:", err);
      if (rootElement) {
        rootElement.innerHTML = '<div style="text-align: center; padding: 20px;"><h1>Erro ao carregar</h1><p>Tente recarregar a página.</p><p><a href="/">Recarregar</a></p></div>';
      }
    }
  }
}

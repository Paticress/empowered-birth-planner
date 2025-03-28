
// Fallback entry point for browsers that don't support ES modules
console.log('Using fallback main.js entry point (non-module version)');

// Flag to prevent double initialization
window.__MAIN_EXECUTED = window.__MAIN_EXECUTED || false;

// Skip if already executed
if (window.__MAIN_EXECUTED) {
  console.log("Main.js - Application already initialized by main.tsx");
} else {
  window.__MAIN_EXECUTED = true;
  console.log("Main.js - Initializing application using fallback script");
  
  // Load React and ReactDOM globally for non-module usage
  var renderApp = function() {
    console.log("Main.js - Rendering application with global React");
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
      // Import App dynamically to avoid ES module syntax
      var script = document.createElement('script');
      script.innerHTML = `
        (function() {
          try {
            var React = window.React;
            var ReactDOM = window.ReactDOM;
            
            var App = function() {
              return React.createElement('div', null, 
                React.createElement('h1', null, 'Carregando aplicação...'),
                React.createElement('p', null, 'Por favor, aguarde enquanto carregamos o conteúdo.')
              );
            };
            
            var root = ReactDOM.createRoot(document.getElementById('root'));
            root.render(React.createElement(App, null));
            
            // Redirect to the non-hash version after a short delay
            setTimeout(function() {
              window.location.href = '/';
            }, 3000);
          } catch (err) {
            console.error("Error in inline React app:", err);
            document.getElementById('root').innerHTML = '<div style="text-align: center; padding: 20px;"><h1>Erro ao carregar</h1><p>Tente recarregar a página.</p></div>';
          }
        })();
      `;
      document.body.appendChild(script);
      
    } catch (err) {
      console.error("Main.js - Error rendering application:", err);
      if (rootElement) {
        rootElement.innerHTML = '<div style="text-align: center; padding: 20px;"><h1>Erro ao carregar</h1><p>Tente recarregar a página.</p></div>';
      }
    }
  };
  
  // Execute rendering
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderApp);
  } else {
    renderApp();
  }
}


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
    script.onload = callback || function() {};
    script.onerror = function(error) {
      console.error("Failed to load compat script:", src, error);
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
  
  // Load the non-module version of the app
  loadScript('/src/App.js');
})();

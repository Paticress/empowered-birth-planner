
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
        loadMainScript();
      });
    } else {
      loadMainScript();
    }
  }
  
  // Load the main script
  function loadMainScript() {
    try {
      // Load a non-module version of the main app
      loadScript('/src/main.js', function() {
        console.log("Compat-entry.js - Successfully loaded main.js");
      });
    } catch (error) {
      console.error("Compat-entry.js - Critical error:", error);
      showError("Ocorreu um erro crítico ao carregar a aplicação. Por favor, tente novamente mais tarde.");
    }
  }
})();

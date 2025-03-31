
// Compatibility entry point
// This file is deliberately not a module to ensure maximum compatibility
(function() {
  console.log('Loading compatibility entry point');
  
  // Helper function to create a basic loading UI
  function showLoadingUI() {
    var rootEl = document.getElementById('root');
    if (rootEl) {
      rootEl.innerHTML = `
        <div style="font-family: system-ui, -apple-system, sans-serif; text-align: center; padding: 2rem;">
          <h1>Guia de Plano de Parto</h1>
          <p>Carregando a aplicação...</p>
          <div style="margin: 2rem auto; width: 50%; height: 6px; background: #eee; border-radius: 3px; overflow: hidden;">
            <div style="width: 50%; height: 100%; background: #0066ff; animation: progress 2s infinite linear;"></div>
          </div>
          <style>
            @keyframes progress {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          </style>
        </div>
      `;
    }
  }
  
  // Show loading UI immediately
  showLoadingUI();
  
  // Try to load React and ReactDOM
  function loadDependencies() {
    // Load React
    var reactScript = document.createElement('script');
    reactScript.src = 'https://unpkg.com/react@18/umd/react.production.min.js';
    reactScript.onload = function() {
      // Load ReactDOM
      var reactDOMScript = document.createElement('script');
      reactDOMScript.src = 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js';
      reactDOMScript.onload = function() {
        // Load React Router
        var routerScript = document.createElement('script');
        routerScript.src = 'https://unpkg.com/react-router-dom@6/umd/react-router-dom.production.min.js';
        routerScript.onload = function() {
          // Now load the main script
          loadMainScript();
        };
        routerScript.onerror = function() {
          console.error('Failed to load React Router');
          // Fall back to main.js
          loadMainScript();
        };
        document.body.appendChild(routerScript);
      };
      reactDOMScript.onerror = function() {
        console.error('Failed to load ReactDOM');
        loadMainScript();
      };
      document.body.appendChild(reactDOMScript);
    };
    reactScript.onerror = function() {
      console.error('Failed to load React');
      loadMainScript();
    };
    document.body.appendChild(reactScript);
  }
  
  // Try to load dependencies if needed
  if (window.React && window.ReactDOM && window.ReactRouterDOM) {
    console.log('Dependencies already loaded, proceeding to main script');
    loadMainScript();
  } else {
    console.log('Loading dependencies...');
    loadDependencies();
  }
  
  // Load the main application code
  function loadMainScript() {
    var script = document.createElement('script');
    script.src = '/src/main.js';
    script.type = 'text/javascript';
    script.onerror = function() {
      console.error('Failed to load main script');
      var rootEl = document.getElementById('root');
      if (rootEl) {
        rootEl.innerHTML = `
          <div style="font-family: system-ui, -apple-system, sans-serif; text-align: center; padding: 2rem;">
            <h1>Erro ao Carregar</h1>
            <p>Não foi possível carregar a aplicação.</p>
            <p><a href="/" style="color: #0066ff; text-decoration: none;">Tentar Novamente</a></p>
          </div>
        `;
      }
    };
    document.body.appendChild(script);
  }
})();

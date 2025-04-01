
// Non-module entry point for maximum browser compatibility
(function() {
  console.log('Main.js - Using non-module entry point');
  
  // Flag to prevent double initialization
  if (window.__MAIN_JS_EXECUTED) {
    console.log("Main.js - Application already initialized by non-module entry point");
    return;
  }
  
  window.__MAIN_JS_EXECUTED = true;
  console.log("Main.js - Initializing application using standard script");
  
  // Create a simple loading indicator in the root element
  const rootElement = document.getElementById('root');
  if (rootElement && !rootElement.hasChildNodes()) {
    rootElement.innerHTML = '<div style="text-align: center; padding: 40px;"><h1>Guia de Plano de Parto</h1><p>Carregando...</p><div style="width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #3498db; border-radius: 50%; margin: 20px auto; animation: spin 1s linear infinite;"></div></div><style>@keyframes spin {0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }}</style>';
  }
  
  function loadScripts(scripts, onComplete) {
    let loadedCount = 0;
    
    function loadNextScript() {
      if (loadedCount >= scripts.length) {
        onComplete();
        return;
      }
      
      const script = document.createElement('script');
      script.src = scripts[loadedCount];
      script.onload = function() {
        loadedCount++;
        loadNextScript();
      };
      script.onerror = function() {
        console.error("Failed to load script:", scripts[loadedCount]);
        loadedCount++;
        loadNextScript();
      };
      document.body.appendChild(script);
    }
    
    loadNextScript();
  }
  
  // Check if React is already loaded
  const reactLoaded = typeof window.React !== 'undefined';
  const reactDOMLoaded = typeof window.ReactDOM !== 'undefined';
  const reactRouterLoaded = typeof window.ReactRouterDOM !== 'undefined';
  
  function initApp() {
    // Try to load App directly
    const appScript = document.createElement('script');
    appScript.src = '/src/App.js';
    appScript.onload = function() {
      console.log("Main.js - App.js loaded successfully");
    };
    appScript.onerror = function() {
      console.error("Main.js - Failed to load App.js, showing fallback");
      
      // Try to use fallback app if available
      if (window.__fallbackApp && window.__fallbackApp.createBasicContent) {
        window.__fallbackApp.createBasicContent(document.getElementById('root'));
      } else {
        // Show error message
        const rootEl = document.getElementById('root');
        if (rootEl) {
          rootEl.innerHTML = '<div style="text-align: center; padding: 40px;"><h1>Guia de Plano de Parto</h1><p>Ocorreu um erro ao carregar a aplicação. Por favor, tente novamente mais tarde.</p></div>';
        }
      }
    };
    document.body.appendChild(appScript);
  }
  
  // Load dependencies in sequence if needed
  if (!reactLoaded || !reactDOMLoaded || !reactRouterLoaded) {
    const dependencies = [];
    
    if (!reactLoaded) {
      dependencies.push('https://unpkg.com/react@18/umd/react.production.min.js');
    }
    
    if (!reactDOMLoaded) {
      dependencies.push('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js');
    }
    
    if (!reactRouterLoaded) {
      dependencies.push('https://unpkg.com/react-router-dom@6/umd/react-router-dom.production.min.js');
    }
    
    loadScripts(dependencies, function() {
      loadScripts(['/src/utils/fallbackApp.js'], function() {
        initApp();
      });
    });
  } else {
    loadScripts(['/src/utils/fallbackApp.js'], function() {
      initApp();
    });
  }
})();

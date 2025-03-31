
// App.js - Non-module bridge file
(function() {
  try {
    console.log("App.js - Attempting to hydrate the full application");
    
    // Only proceed if we haven't already initialized the full app
    if (window.__FULL_APP_LOADED) {
      console.log("App.js - Full application already loaded");
      return;
    }
    
    window.__FULL_APP_LOADED = true;
    
    // Use dynamic import if supported
    if (typeof import === 'function') {
      console.log("App.js - Using dynamic import");
      
      try {
        import('./App.tsx')
          .then(module => {
            console.log("App.js - Successfully imported App.tsx");
            const App = module.default;
            
            // Replace the simple app with the full app
            const rootElement = document.getElementById('root');
            if (rootElement && React && ReactDOM) {
              console.log("App.js - Rendering full application");
              ReactDOM.createRoot(rootElement).render(React.createElement(App));
            }
          })
          .catch(error => {
            console.error("App.js - Failed to import App.tsx:", error);
          });
      } catch (importError) {
        console.error("App.js - Error with dynamic import:", importError);
      }
    } else {
      console.log("App.js - Dynamic import not supported, loading script directly");
      
      // Fall back to script tag
      const script = document.createElement('script');
      script.type = 'module';
      script.src = '/src/main.jsx';
      script.onerror = function(error) {
        console.error("App.js - Failed to load main.jsx:", error);
      };
      document.body.appendChild(script);
    }
  } catch (outerError) {
    console.error("App.js - Critical error:", outerError);
  }
})();


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
    
    // Add error handling for React Router issues
    if (!window.ReactRouterDOM) {
      console.error("App.js - ReactRouterDOM not available, trying to load it");
      var routerScript = document.createElement('script');
      routerScript.src = 'https://unpkg.com/react-router-dom@6/umd/react-router-dom.production.min.js';
      routerScript.crossOrigin = 'anonymous';
      
      routerScript.onload = function() {
        console.log("App.js - ReactRouterDOM loaded successfully, proceeding");
        loadAppContent();
      };
      
      routerScript.onerror = function(error) {
        console.error("App.js - Failed to load ReactRouterDOM:", error);
      };
      
      document.body.appendChild(routerScript);
    } else {
      loadAppContent();
    }
    
    function loadAppContent() {
      // The dynamic import needs to be modified to avoid build issues
      console.log("App.js - Loading application content");
      
      // Load the App.tsx using a regular script approach instead of dynamic import
      var appScript = document.createElement('script');
      appScript.type = 'module';
      appScript.src = './src/main.jsx';
      
      appScript.onload = function() {
        console.log("App.js - Successfully loaded main.jsx");
        
        // Replace the simple app with the full app
        const rootElement = document.getElementById('root');
        if (rootElement && window.React && window.ReactDOM && window.App) {
          console.log("App.js - Rendering full application");
          try {
            window.ReactDOM.createRoot(rootElement).render(window.React.createElement(window.App));
            console.log("App.js - Full application rendered successfully");
          } catch (renderError) {
            console.error("App.js - Error rendering full application:", renderError);
            fallbackToAppJs();
          }
        } else {
          console.error("App.js - React, ReactDOM, App, or root element not available for full app render");
          fallbackToAppJs();
        }
      };
      
      appScript.onerror = function(error) {
        console.error("App.js - Failed to load main.jsx:", error);
        fallbackToAppJs();
      };
      
      document.body.appendChild(appScript);
    }
    
    function fallbackToAppJs() {
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


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
        // Try alternative CDN
        var altScript = document.createElement('script');
        altScript.src = 'https://cdn.jsdelivr.net/npm/react-router-dom@6/umd/react-router-dom.production.min.js';
        altScript.crossOrigin = 'anonymous';
        altScript.onload = function() {
          console.log("App.js - ReactRouterDOM loaded from alternative CDN, proceeding");
          loadAppContent();
        };
        altScript.onerror = function() {
          console.error("App.js - Failed to load ReactRouterDOM from alternative CDN");
        };
        document.body.appendChild(altScript);
      };
      
      document.body.appendChild(routerScript);
    } else {
      loadAppContent();
    }
    
    function loadAppContent() {
      // First try to load App.tsx as a script
      console.log("App.js - Loading App.tsx content");
      
      // Use a script that doesn't have module imports
      var appScript = document.createElement('script');
      appScript.type = 'text/javascript'; // Not using module to avoid import issues
      appScript.src = './src/main.js'; // Use the JS version which has better compatibility
      
      appScript.onload = function() {
        console.log("App.js - Successfully loaded main.js");
      };
      
      appScript.onerror = function(error) {
        console.error("App.js - Failed to load main.js:", error);
        fallbackToCompatMode();
      };
      
      document.body.appendChild(appScript);
    }
    
    function fallbackToCompatMode() {
      console.log("App.js - Falling back to compatibility mode");
      var script = document.createElement('script');
      script.type = 'text/javascript'; // Not using module to avoid import issues
      script.src = '/src/compat-entry.js';
      document.body.appendChild(script);
    }
  } catch (outerError) {
    console.error("App.js - Critical error:", outerError);
  }
})();

// We need to make sure this doesn't conflict with any existing App definition
if (typeof window !== 'undefined' && typeof window.App === 'undefined') {
  // Create a placeholder App component for module imports
  window.App = function() {
    // This is a placeholder component that will be replaced by the real App.tsx
    return null;
  };
}

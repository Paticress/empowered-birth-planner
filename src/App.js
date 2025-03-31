
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
      // Load the main.jsx using type="module"
      console.log("App.js - Loading application content");
      var appScript = document.createElement('script');
      appScript.type = 'module';
      appScript.src = './src/main.jsx';
      
      appScript.onload = function() {
        console.log("App.js - Successfully loaded main.jsx");
      };
      
      appScript.onerror = function(error) {
        console.error("App.js - Failed to load main.jsx:", error);
        fallbackToCompatMode();
      };
      
      document.body.appendChild(appScript);
    }
    
    function fallbackToCompatMode() {
      console.log("App.js - Falling back to compatibility mode");
      var script = document.createElement('script');
      script.src = '/src/compat-entry.js';
      document.body.appendChild(script);
    }
  } catch (outerError) {
    console.error("App.js - Critical error:", outerError);
  }
})();

// Create a placeholder App component for module imports
const App = () => {
  // This is a placeholder component that will be replaced by the real App.tsx
  return null;
};

// Export the App component for ESM imports
export default App;

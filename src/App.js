
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
      // First try to load App.tsx as a module
      try {
        console.log("App.js - Attempting to import App.tsx as module");
        
        // Use dynamic import if supported
        if (typeof import === 'function') {
          import('./App.tsx')
            .then(module => {
              console.log("App.js - Successfully imported App.tsx as module");
              window.App = module.default;
              initializeApp();
            })
            .catch(error => {
              console.error("App.js - Failed to import App.tsx as module:", error);
              loadMainJsx();
            });
        } else {
          // If dynamic import not supported, try loading main.jsx directly
          loadMainJsx();
        }
      } catch (error) {
        console.error("App.js - Error with module import:", error);
        loadMainJsx();
      }
    }
    
    function loadMainJsx() {
      // Load the main.jsx using type="module"
      console.log("App.js - Loading main.jsx via script tag");
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
    
    function initializeApp() {
      console.log("App.js - Initializing application with loaded App component");
      try {
        const rootElement = document.getElementById('root');
        if (rootElement && window.App && window.React && window.ReactDOM) {
          console.log("App.js - All dependencies available, rendering App");
          
          if (window.ReactDOM.createRoot) {
            window.ReactDOM.createRoot(rootElement).render(
              window.React.createElement(window.App)
            );
          } else {
            window.ReactDOM.render(
              window.React.createElement(window.App),
              rootElement
            );
          }
          
          console.log("App.js - Successfully rendered App component");
        } else {
          console.error("App.js - Missing dependencies for initialization");
          if (!rootElement) console.error("- No root element found");
          if (!window.App) console.error("- App component not loaded");
          if (!window.React) console.error("- React not available");
          if (!window.ReactDOM) console.error("- ReactDOM not available");
          
          fallbackToCompatMode();
        }
      } catch (error) {
        console.error("App.js - Error initializing application:", error);
        fallbackToCompatMode();
      }
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


// React dependency loader with fallbacks
console.log('ReactLoader - Initializing React dependency loader');

/**
 * Load React dependencies with fallback handling
 * @param {Function} callback - Function to call when all dependencies are loaded
 */
function loadReactDependencies(callback) {
  console.log("ReactLoader - Loading React dependencies");
  
  const requiredDependencies = {
    React: typeof window.React !== 'undefined',
    ReactDOM: typeof window.ReactDOM !== 'undefined',
    ReactRouterDOM: typeof window.ReactRouterDOM !== 'undefined'
  };
  
  // Check if all dependencies are already loaded
  const allDependenciesLoaded = Object.values(requiredDependencies).every(Boolean);
  if (allDependenciesLoaded) {
    console.log("ReactLoader - All dependencies already loaded");
    callback();
    return;
  }
  
  // Load React
  if (!requiredDependencies.React) {
    var reactScript = document.createElement('script');
    reactScript.src = 'https://unpkg.com/react@18/umd/react.production.min.js';
    reactScript.crossOrigin = 'anonymous';
    
    reactScript.onload = function() {
      console.log("ReactLoader - React loaded successfully");
      
      // Load ReactDOM
      if (!requiredDependencies.ReactDOM) {
        var reactDOMScript = document.createElement('script');
        reactDOMScript.src = 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js';
        reactDOMScript.crossOrigin = 'anonymous';
        
        reactDOMScript.onload = function() {
          console.log("ReactLoader - ReactDOM loaded successfully");
          
          // Load React Router
          if (!requiredDependencies.ReactRouterDOM) {
            var routerScript = document.createElement('script');
            routerScript.src = 'https://unpkg.com/react-router-dom@6/umd/react-router-dom.production.min.js';
            routerScript.crossOrigin = 'anonymous';
            
            routerScript.onload = function() {
              console.log("ReactLoader - React Router loaded successfully");
              callback();
            };
            
            routerScript.onerror = function() {
              console.error("ReactLoader - Failed to load React Router");
              // Try to load from alternate CDN
              var altScript = document.createElement('script');
              altScript.src = 'https://cdn.jsdelivr.net/npm/react-router-dom@6/umd/react-router-dom.production.min.js';
              altScript.crossOrigin = 'anonymous';
              
              altScript.onload = function() {
                console.log("ReactLoader - React Router loaded from alternative CDN");
                callback();
              };
              
              altScript.onerror = function() {
                console.error("ReactLoader - Failed to load React Router from alternative source");
                callback(); // Continue anyway
              };
              
              document.body.appendChild(altScript);
            };
            
            document.body.appendChild(routerScript);
          } else {
            callback();
          }
        };
        
        reactDOMScript.onerror = function() {
          console.error("ReactLoader - Failed to load ReactDOM");
          // Try to load from alternate CDN
          var altScript = document.createElement('script');
          altScript.src = 'https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.production.min.js';
          altScript.crossOrigin = 'anonymous';
          
          altScript.onload = function() {
            console.log("ReactLoader - ReactDOM loaded from alternative CDN");
            callback();
          };
          
          altScript.onerror = function() {
            console.error("ReactLoader - Failed to load ReactDOM from alternative source");
            callback(); // Continue anyway
          };
          
          document.body.appendChild(altScript);
        };
        
        document.body.appendChild(reactDOMScript);
      } else {
        callback();
      }
    };
    
    reactScript.onerror = function() {
      console.error("ReactLoader - Failed to load React");
      // Try to load from alternate CDN
      var altScript = document.createElement('script');
      altScript.src = 'https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js';
      altScript.crossOrigin = 'anonymous';
      
      altScript.onload = function() {
        console.log("ReactLoader - React loaded from alternative CDN");
        callback();
      };
      
      altScript.onerror = function() {
        console.error("ReactLoader - Failed to load React from alternative source");
        callback(); // Continue anyway
      };
      
      document.body.appendChild(altScript);
    };
    
    document.body.appendChild(reactScript);
  } else {
    callback();
  }
}

export { loadReactDependencies };

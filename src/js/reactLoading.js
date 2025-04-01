
// React and related dependencies loading
console.log('React loading utilities initialized');

/**
 * Load React and ReactDOM with fallbacks
 * @param {Function} callback - Callback to run when React is loaded
 */
function loadReactDependencies(callback) {
  console.log("Loading React dependencies");
  
  // Check if React is already loaded
  if (isScriptLoaded('React') && isScriptLoaded('ReactDOM')) {
    console.log("React and ReactDOM already available");
    loadReactRouter(callback);
    return;
  }
  
  // Load React first
  if (!isScriptLoaded('React')) {
    loadScript('https://unpkg.com/react@18/umd/react.production.min.js', function() {
      console.log("React loaded successfully");
      
      // Then load ReactDOM
      if (!isScriptLoaded('ReactDOM')) {
        loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js', function() {
          console.log("ReactDOM loaded successfully");
          loadReactRouter(callback);
        }, { crossorigin: "anonymous" });
      } else {
        loadReactRouter(callback);
      }
    }, { crossorigin: "anonymous" });
  } else if (!isScriptLoaded('ReactDOM')) {
    // React is loaded but ReactDOM isn't
    loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js', function() {
      console.log("ReactDOM loaded successfully");
      loadReactRouter(callback);
    }, { crossorigin: "anonymous" });
  } else {
    loadReactRouter(callback);
  }
}

/**
 * Load React Router with fallbacks
 * @param {Function} callback - Callback to run when Router is loaded
 */
function loadReactRouter(callback) {
  if (isScriptLoaded('ReactRouterDOM')) {
    console.log("ReactRouterDOM already available");
    callback();
    return;
  }
  
  console.log("Loading React Router from CDN");
  loadScript('https://unpkg.com/react-router-dom@6/umd/react-router-dom.production.min.js', function() {
    console.log("ReactRouterDOM loaded successfully");
    callback();
  }, { crossorigin: "anonymous" });
}

// Helper utilities
function isScriptLoaded(globalVar) {
  if (window.__scriptLoader && window.__scriptLoader.isScriptLoaded) {
    return window.__scriptLoader.isScriptLoaded(globalVar);
  }
  return typeof window[globalVar] !== 'undefined';
}

function loadScript(src, callback, attributes) {
  if (window.__scriptLoader && window.__scriptLoader.loadScript) {
    return window.__scriptLoader.loadScript(src, callback, attributes);
  }
  
  console.log("Fallback script loading:", src);
  const script = document.createElement('script');
  script.src = src;
  
  // Apply attributes
  if (attributes) {
    for (const key in attributes) {
      script.setAttribute(key, attributes[key]);
    }
  }
  
  script.onload = callback;
  script.onerror = function(error) {
    console.error("Failed to load script:", src);
    callback(error);
  };
  
  document.body.appendChild(script);
  return script;
}

// Expose the API
window.__reactLoader = {
  loadReactDependencies,
  loadReactRouter
};

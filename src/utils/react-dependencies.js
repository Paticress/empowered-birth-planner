
// React dependencies loader
import { loadScript, isScriptLoaded, loadLocalFallback } from './script-loader.js';

console.log('React dependencies loader initialized');

// Load React if needed
function loadReact(callback) {
  console.log("Checking React availability");
  if (!isScriptLoaded('React')) {
    console.log("React not found, loading from CDN");
    loadScript('https://unpkg.com/react@18/umd/react.production.min.js', function(error) {
      if (error) {
        console.error("Failed to load React from CDN, trying local fallback");
        loadLocalFallback('react.production.min.js', callback);
      } else {
        console.log("React loaded successfully");
        callback();
      }
    }, { 
      crossorigin: "anonymous" 
    });
  } else {
    console.log("React already loaded");
    callback();
  }
}

// Load ReactDOM if needed
function loadReactDOM(callback) {
  console.log("Checking ReactDOM availability");
  if (!isScriptLoaded('ReactDOM')) {
    console.log("ReactDOM not found, loading from CDN");
    loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js', function(error) {
      if (error) {
        console.error("Failed to load ReactDOM from CDN, trying local fallback");
        loadLocalFallback('react-dom.production.min.js', callback);
      } else {
        console.log("ReactDOM loaded successfully");
        callback();
      }
    }, { 
      crossorigin: "anonymous" 
    });
  } else {
    console.log("ReactDOM already loaded");
    callback();
  }
}

// Load React Router if needed
function loadReactRouter(callback) {
  console.log("Checking ReactRouterDOM availability");
  if (!isScriptLoaded('ReactRouterDOM')) {
    console.log("ReactRouterDOM not found, loading from CDN");
    loadScript('https://unpkg.com/react-router-dom@6/umd/react-router-dom.production.min.js', function(error) {
      if (error) {
        console.error("Failed to load ReactRouterDOM from CDN, trying local fallback");
        loadLocalFallback('react-router-dom.production.min.js', callback);
      } else {
        console.log("ReactRouterDOM loaded successfully");
        callback();
      }
    }, { 
      crossorigin: "anonymous" 
    });
  } else {
    console.log("ReactRouterDOM already loaded");
    callback();
  }
}

// Load all React dependencies with better error handling
function loadAllReactDependencies(callback) {
  console.log("Loading all React dependencies");
  
  // Create a minimal fallback implementation in case of total failure
  const createEmergencyFallbacks = () => {
    console.log("Creating emergency fallbacks for React libraries");
    if (!window.React) {
      window.React = {
        createElement: function() { return {}; },
        Fragment: 'fragment',
        useState: function(initial) { return [initial, function() {}]; },
        useEffect: function() {},
        createContext: function() { return {}; }
      };
    }
    
    if (!window.ReactDOM) {
      window.ReactDOM = {
        render: function() {},
        createRoot: function() { return { render: function() {} }; }
      };
    }
    
    if (!window.ReactRouterDOM) {
      window.ReactRouterDOM = {
        HashRouter: function() { return {}; },
        Routes: function() { return {}; },
        Route: function() { return {}; },
        Navigate: function() { return {}; },
        Link: function() { return {}; },
        useNavigate: function() { return function() {}; }
      };
    }
  };
  
  // Try to load them in sequence with proper fallbacks
  loadReact(function(reactError) {
    if (reactError) {
      console.error("Critical failure loading React:", reactError);
      createEmergencyFallbacks();
    }
    
    loadReactDOM(function(reactDomError) {
      if (reactDomError) {
        console.error("Critical failure loading ReactDOM:", reactDomError);
        createEmergencyFallbacks();
      }
      
      loadReactRouter(function(routerError) {
        if (routerError) {
          console.error("Critical failure loading ReactRouterDOM:", routerError);
          createEmergencyFallbacks();
        }
        
        // Always call the callback, even if some loads failed
        callback();
      });
    });
  });
}

export { loadReact, loadReactDOM, loadReactRouter, loadAllReactDependencies };

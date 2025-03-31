
// React and ReactDOM loading module for compatibility mode
import { loadScript, isScriptLoaded } from './loaders.js';

console.log("Compat/react-loader.js - React loader initialized");

// Load React and its dependencies
function loadReactDependencies(callback) {
  // First, ensure React is available
  if (!isScriptLoaded('React')) {
    loadScript('https://unpkg.com/react@18/umd/react.production.min.js', function() {
      if (!isScriptLoaded('ReactDOM')) {
        loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js', function() {
          loadReactRouter(callback);
        });
      } else {
        loadReactRouter(callback);
      }
    });
  } else if (!isScriptLoaded('ReactDOM')) {
    loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js', function() {
      loadReactRouter(callback);
    });
  } else {
    loadReactRouter(callback);
  }
}

// Load React Router
function loadReactRouter(callback) {
  if (!isScriptLoaded('ReactRouterDOM')) {
    loadScript('https://unpkg.com/react-router-dom@6/umd/react-router-dom.production.min.js', function() {
      callback();
    });
  } else {
    callback();
  }
}

export { loadReactDependencies };

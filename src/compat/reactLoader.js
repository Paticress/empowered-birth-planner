
// React loading functionality for compatibility mode
import { loadScript, isScriptLoaded } from './scriptLoader.js';

console.log("Compat/reactLoader.js - React loader initialized");

/**
 * Ensure React and related dependencies are loaded
 * @param {Function} callback - Callback function after React is loaded
 */
function ensureReactLoaded(callback) {
  if (isScriptLoaded('React') && isScriptLoaded('ReactDOM')) {
    callback();
    return;
  }
  
  console.log("Compat - Loading React dependencies");
  
  // Load React first
  loadScript('https://unpkg.com/react@18/umd/react.production.min.js', function() {
    // Then load ReactDOM
    loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js', function() {
      callback();
    });
  });
}

/**
 * Load React Router DOM
 * @param {Function} callback - Callback function after Router is loaded
 */
function loadReactRouter(callback) {
  if (isScriptLoaded('ReactRouterDOM')) {
    callback();
    return;
  }
  
  loadScript('https://unpkg.com/react-router-dom@6/umd/react-router-dom.production.min.js', callback);
}

export { ensureReactLoaded, loadReactRouter };

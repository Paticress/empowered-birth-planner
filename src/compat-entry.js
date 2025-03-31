
// Compatibility entry point for browsers that don't support ES modules
import { loadReactDependencies } from './compat/react-loader.js';
import { loadAppContent } from './compat/app-content.js';

console.log("Compat-entry.js - Loading compatibility mode");

(function() {
  // Check if we've already loaded this file to prevent double execution
  if (window.__COMPAT_ENTRY_LOADED) {
    console.log("Compat-entry.js - Already loaded, skipping initialization");
    return;
  }
  
  window.__COMPAT_ENTRY_LOADED = true;
  
  // Set up error handling for any initialization errors
  window.addEventListener('error', function(event) {
    console.error('Compat - Global error caught:', event.message);
    // We don't need extensive error handling here as it's now in separate modules
  });
  
  // Start the loading sequence - first React, then app content
  loadReactDependencies(function() {
    loadAppContent();
  });
})();

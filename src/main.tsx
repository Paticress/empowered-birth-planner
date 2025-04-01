
import React from 'react';
import { bootstrapApplication } from './bootstrapApp';

// This is intentionally a non-module file for maximum compatibility
// It will be properly processed by Vite during build
(function() {
  console.log("Main.tsx - Application bootstrapping started");
  
  // Flag to track if main.tsx script has already executed
  if (typeof window !== 'undefined') {
    if (window.__MAIN_EXECUTED) {
      console.log("Main.tsx - Already executed, skipping initialization");
      return;
    }
    
    window.__MAIN_EXECUTED = true;
  }
  
  // Start the application bootstrap process
  bootstrapApplication();
})();

// This section will be used by the build system but ignored in the browser
if (typeof module !== 'undefined') {
  try {
    // For the build system
    module.exports = {
      React: null,
      ReactDOM: null, 
      App: null,
      registerServiceWorker: null
    };
  } catch (e) {
    console.log("Main.tsx - Module exports skipped in browser environment");
  }
}

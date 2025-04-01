
// Application loading functionality for compatibility mode
import { loadScript } from './scriptLoader.js';
import { initSimpleRouter } from './simpleRouter.js';

console.log("Compat/appLoader.js - App loader initialized");

/**
 * Initialize the app from App.js or main.js
 */
function initApp() {
  try {
    // Try to load our real App component through App.js bridge
    const script = document.createElement('script');
    script.type = "text/javascript";
    script.src = "/src/App.js";
    script.onerror = function() {
      console.error("Could not load App.js, trying alternative approach");
      
      // Try to load through main.js
      const mainScript = document.createElement('script');
      mainScript.type = "text/javascript";
      mainScript.src = "/src/main.js";
      mainScript.onerror = function() {
        console.error("Could not load main.js, falling back to router only");
        initSimpleRouter();
      };
      document.body.appendChild(mainScript);
    };
    document.body.appendChild(script);
  } catch (error) {
    console.error("Error initializing App:", error);
    initSimpleRouter();
  }
}

/**
 * Try to load the app with retry
 */
function loadAppWithRetry() {
  let retries = 0;
  
  function attemptLoad() {
    const script = document.createElement('script');
    script.src = '/src/App.js';
    script.onload = function() {
      console.log("Compat - App.js loaded successfully");
    };
    script.onerror = function() {
      retries++;
      if (retries < 3) {
        console.log(`Compat - Retry ${retries} loading App.js`);
        setTimeout(attemptLoad, 1000); // Wait 1 second before retry
      } else {
        console.error("Compat - Failed to load App.js after multiple attempts");
        initSimpleRouter();
      }
    };
    document.body.appendChild(script);
  }
  
  attemptLoad();
}

export { initApp, loadAppWithRetry };

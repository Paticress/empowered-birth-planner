
// Application loading module for compatibility mode
console.log("Compat/app-loader.js - App loader initialized");

// Try to load the full app script with retries
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
      }
    };
    document.body.appendChild(script);
  }
  
  attemptLoad();
}

export { loadAppWithRetry };

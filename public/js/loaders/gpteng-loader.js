
// GPT Engineer script loading module
(function() {
  console.log("GPT Engineer loader initialized");
  
  // Function to ensure GPT Engineer script is loaded
  function ensureGPTEngineer(callback) {
    if (window.__SCRIPT_LOAD_STATE && window.__SCRIPT_LOAD_STATE.gptEngineer) {
      callback();
      return;
    }

    // Check if script exists and is functional
    if (typeof window.gptengineer !== 'undefined' && typeof window.gptengineer.createSelect === 'function') {
      console.log("GPT Engineer already loaded and functional");
      if (window.__SCRIPT_LOAD_STATE) window.__SCRIPT_LOAD_STATE.gptEngineer = true;
      callback();
      return;
    }
    
    console.log("GPT Engineer not properly loaded, ensuring fallback is available");
    
    // Make sure we have at least a basic implementation
    if (!window.gptengineer) {
      window.gptengineer = {
        initialized: true,
        version: 'fallback-1.0',
        createSelect: function() {
          console.log("Basic GPT Engineer Select API called - using fallback implementation");
          return null;
        },
        isAvailable: function() {
          return false;
        },
        onError: function(e) {
          console.error("Basic GPT Engineer error handler:", e);
        }
      };
    }
    
    // Set load state so other modules know the fallback is ready
    if (window.__SCRIPT_LOAD_STATE) window.__SCRIPT_LOAD_STATE.gptEngineer = true;
    
    // Let's not try to load from CDN again since we already tried in index.html
    // Just proceed with the callback using our fallback implementation
    callback();
  }
  
  // Expose the GPT Engineer loader
  window.__gptEngLoader = {
    ensureGPTEngineer: ensureGPTEngineer
  };
})();

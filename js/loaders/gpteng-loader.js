
// GPT Engineer script loading module
(function() {
  console.log("GPT Engineer loader initialized");
  
  // Function to ensure GPT Engineer script is loaded
  function ensureGPTEngineer(callback) {
    if (window.__SCRIPT_LOAD_STATE && window.__SCRIPT_LOAD_STATE.gptEngineer) {
      callback();
      return;
    }

    // Check if script exists
    if (typeof window.gptengineer !== 'undefined' && typeof window.gptengineer.createSelect === 'function') {
      console.log("GPT Engineer already loaded and functional");
      if (window.__SCRIPT_LOAD_STATE) window.__SCRIPT_LOAD_STATE.gptEngineer = true;
      callback();
      return;
    }
    
    console.log("GPT Engineer not properly loaded, ensuring fallback is available");
    
    // Create basic fallback implementation
    if (!window.gptengineer) {
      window.gptengineer = {
        createSelect: function() {
          console.log("Basic GPT Engineer Select API called - real implementation or fallback will load later");
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
    
    // Try to load a non-module version explicitly
    try {
      const script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/npm/@gptengineer/core@latest/dist/gptengineer.min.js";
      script.type = "text/javascript";
      script.crossOrigin = "anonymous";
      script.onload = function() {
        console.log("GPT Engineer loaded from alternative CDN");
        if (window.__SCRIPT_LOAD_STATE) window.__SCRIPT_LOAD_STATE.gptEngineer = true;
        callback();
      };
      script.onerror = function() {
        console.warn("Alternative GPT Engineer CDN also failed, using fallback implementation");
        // Let the callback proceed with the fallback implementation
        if (window.__SCRIPT_LOAD_STATE) window.__SCRIPT_LOAD_STATE.gptEngineer = true;
        callback();
      };
      document.body.appendChild(script);
    } catch (error) {
      console.error("Error loading GPT Engineer:", error);
      if (window.__SCRIPT_LOAD_STATE) window.__SCRIPT_LOAD_STATE.gptEngineer = true;
      callback();
    }
  }
  
  // Expose the GPT Engineer loader
  window.__gptEngLoader = {
    ensureGPTEngineer: ensureGPTEngineer
  };
})();

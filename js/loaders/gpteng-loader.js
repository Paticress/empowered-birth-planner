
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
    if (typeof window.gptengineer !== 'undefined') {
      console.log("GPT Engineer already loaded");
      if (window.__SCRIPT_LOAD_STATE) window.__SCRIPT_LOAD_STATE.gptEngineer = true;
      callback();
      return;
    }

    // Add fallback script
    const fallbackScript = document.createElement('script');
    fallbackScript.src = "/public/assets/gpteng-fallback.js";
    fallbackScript.type = "text/javascript"; // Make sure it's not a module
    fallbackScript.onload = function() {
      console.log("GPT Engineer fallback loaded");
      if (window.__SCRIPT_LOAD_STATE) window.__SCRIPT_LOAD_STATE.gptEngineer = true;
      callback();
    };
    fallbackScript.onerror = function(error) {
      console.error("Failed to load GPT Engineer fallback:", error);
      
      // Create minimal fallback inline if script fails to load
      window.gptengineer = window.gptengineer || {
        createSelect: function() {
          console.log("GPT Engineer Select functionality is unavailable");
          return null;
        }
      };
      
      if (window.__SCRIPT_LOAD_STATE) window.__SCRIPT_LOAD_STATE.gptEngineer = true;
      callback();
    };
    document.head.appendChild(fallbackScript);
  }
  
  // Expose the GPT Engineer loader
  window.__gptEngLoader = {
    ensureGPTEngineer: ensureGPTEngineer
  };
})();

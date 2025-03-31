
// GPT Engineer script loading module
(function() {
  console.log("GPT Engineer loader initialized");
  
  // Function to ensure GPT Engineer script is loaded
  function ensureGPTEngineer(callback) {
    if (window.__SCRIPT_LOAD_STATE.gptEngineer) {
      callback();
      return;
    }

    // Check if script exists
    if (typeof window.__gptEngineer !== 'undefined') {
      console.log("GPT Engineer already loaded");
      window.__SCRIPT_LOAD_STATE.gptEngineer = true;
      callback();
      return;
    }

    // Add fallback script
    window.__scriptLoader.loadScript(
      "/assets/gpteng-fallback.js",
      function() {
        console.log("GPT Engineer fallback loaded");
        window.__SCRIPT_LOAD_STATE.gptEngineer = true;
        callback();
      },
      { async: true }
    );
  }
  
  // Expose the GPT Engineer loader
  window.__gptEngLoader = {
    ensureGPTEngineer: ensureGPTEngineer
  };
})();

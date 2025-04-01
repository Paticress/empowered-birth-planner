
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
    
    // Make sure our fallback is loaded
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
    
    // Let the callback proceed, but the fallback script will enhance the implementation soon
    if (window.__SCRIPT_LOAD_STATE) window.__SCRIPT_LOAD_STATE.gptEngineer = true;
    callback();
  }
  
  // Expose the GPT Engineer loader
  window.__gptEngLoader = {
    ensureGPTEngineer: ensureGPTEngineer
  };
})();

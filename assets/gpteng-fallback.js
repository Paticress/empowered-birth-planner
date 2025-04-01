
// Enhanced GPT Engineer fallback script
(function() {
  console.log("GPT Engineer fallback script initializing");
  
  // Wait a moment to check if the main script loaded properly
  setTimeout(function() {
    // If gptengineer object is not properly initialized, create our fallback
    if (!window.gptengineer || typeof window.gptengineer.createSelect !== 'function') {
      console.log("GPT Engineer main script failed to load properly, using fallback");
      
      // Create a comprehensive fallback implementation
      window.gptengineer = {
        initialized: true,
        version: 'fallback-1.0',
        
        init: function() {
          console.log("GPT Engineer fallback init called");
          return true;
        },
        
        createSelect: function(element, options) {
          console.log("GPT Engineer fallback createSelect called", element, options);
          // Return null to indicate the function was called but no real functionality is available
          return null;
        },
        
        isAvailable: function() {
          return false;
        },
        
        // Additional functions that might be needed
        onError: function(e) {
          console.error("GPT Engineer fallback error handler:", e);
        }
      };
      
      // Let the application know that the fallback is ready
      if (window.__scriptLoader && window.__scriptLoader.state) {
        window.__scriptLoader.state.gptEngineer = true;
      }
      
      // Dispatch an event in case anyone is listening for it
      try {
        window.dispatchEvent(new CustomEvent('gpteng-ready', { detail: { fallback: true } }));
      } catch (e) {
        console.error("Failed to dispatch gpteng-ready event:", e);
      }
    } else {
      console.log("GPT Engineer main script loaded properly, fallback not needed");
    }
  }, 1000); // Wait 1 second to check if the main script loaded
})();

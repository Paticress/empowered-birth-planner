
// Enhanced GPT Engineer fallback script
(function() {
  console.log("GPT Engineer fallback script initializing");
  
  // Create fallback right away, will be replaced if real one loads
  window.gptengineer = window.gptengineer || {
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
  
  // Wait a moment to check if the main script loaded properly
  setTimeout(function() {
    // If gptengineer object is properly initialized but without createSelect, it may be partially loaded
    if (!window.gptengineer || typeof window.gptengineer.createSelect !== 'function') {
      console.log("GPT Engineer main script failed to load properly, using fallback");
      
      // Make sure our fallback is fully assigned
      window.gptengineer = {
        initialized: true,
        version: 'fallback-1.1',
        
        init: function() {
          console.log("GPT Engineer fallback init called");
          return true;
        },
        
        createSelect: function(element, options) {
          console.log("GPT Engineer fallback createSelect called", element, options);
          return null;
        },
        
        isAvailable: function() {
          return false;
        },
        
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

      // Try to load main app code since we're ready
      if (window.__appLoader) {
        window.__appLoader();
      }
    } else {
      console.log("GPT Engineer main script loaded properly, fallback not needed");
    }
  }, 1000); // Wait 1 second to check if the main script loaded
})();

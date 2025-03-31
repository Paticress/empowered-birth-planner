
// Fallback script for GPT Engineer functionality
(function() {
  console.log("GPT Engineer fallback script loaded");
  
  // Check if GPT Engineer script has loaded
  if (typeof window.__gptEngineer === 'undefined') {
    console.log("GPT Engineer script not detected, attempting to load it");
    
    // Create a minimal implementation to prevent errors
    window.__gptEngineer = {
      initialized: false,
      version: 'fallback',
      init: function() {
        console.log("GPT Engineer fallback init called");
        this.initialized = true;
        return true;
      }
    };
    
    // Try to load the real script
    const script = document.createElement('script');
    script.src = 'https://cdn.gpteng.co/gptengineer.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onload = function() {
      console.log("GPT Engineer script loaded successfully");
    };
    script.onerror = function(error) {
      console.error("Failed to load GPT Engineer script:", error);
    };
    document.head.appendChild(script);
  }
})();

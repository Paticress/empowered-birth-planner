
// Script loading utility functions for compatibility mode
console.log("Compat/loaders.js - Loading utilities initialized");

// Helper function to load scripts sequentially with fallbacks
function loadScript(src, callback) {
  console.log("Compat - Loading script:", src);
  const script = document.createElement('script');
  script.src = src;
  script.crossOrigin = "anonymous"; // Add crossorigin for better error reporting
  script.onload = callback;
  script.onerror = function(error) {
    console.error("Compat - Failed to load script:", src, error);
    tryAlternativeSource(src, callback);
  };
  document.body.appendChild(script);
}

// Try alternative CDN if primary fails
function tryAlternativeSource(src, callback) {
  // First try jsdelivr as alternative
  if (src.includes('unpkg.com')) {
    const altSrc = src.replace('unpkg.com', 'cdn.jsdelivr.net/npm');
    console.log("Compat - Trying alternative source:", altSrc);
    const script = document.createElement('script');
    script.src = altSrc;
    script.crossOrigin = "anonymous";
    script.onload = callback;
    script.onerror = function() {
      console.error("Compat - Alternative CDN also failed");
      
      // As last resort, try loading from local /assets directory if available
      if (src.includes('react@18') || src.includes('react-dom@18') || src.includes('react-router-dom@6')) {
        const filename = src.split('/').pop();
        const localSrc = `/assets/${filename}`;
        console.log("Compat - Trying local source:", localSrc);
        const localScript = document.createElement('script');
        localScript.src = localSrc;
        localScript.onload = callback;
        localScript.onerror = function() {
          console.error("Compat - All sources failed for:", src);
        };
        document.body.appendChild(localScript);
      }
    };
    document.body.appendChild(script);
  }
}

// Function to check if a script is already loaded
function isScriptLoaded(globalVar) {
  return typeof window[globalVar] !== 'undefined';
}

export { loadScript, tryAlternativeSource, isScriptLoaded };


// Script loading utility for compatibility mode
console.log("Compat/scriptLoader.js - Script loader initialized");

/**
 * Load a script with error handling and fallbacks
 * @param {string} src - Script source URL
 * @param {Function} callback - Callback function when script loads
 * @param {Object} attributes - Additional script attributes
 */
function loadScript(src, callback, attributes = {}) {
  console.log("Compat - Loading script:", src);
  
  var script = document.createElement('script');
  script.src = src;
  script.crossOrigin = "anonymous"; // Add crossorigin for better error reporting
  
  // Apply additional attributes if provided
  if (attributes) {
    for (const key in attributes) {
      script.setAttribute(key, attributes[key]);
    }
  }
  
  script.onload = function() {
    console.log("Compat - Script loaded successfully:", src);
    if (callback) callback();
  };
  
  script.onerror = function(error) {
    console.error("Compat - Failed to load script:", src, error);
    
    // Try alternative source if it's a CDN
    if (src.includes('unpkg.com')) {
      const altSrc = src.replace('unpkg.com', 'cdn.jsdelivr.net/npm');
      console.log("Compat - Trying alternative source:", altSrc);
      loadScript(altSrc, callback, attributes);
    } else if (callback) {
      callback(error); // Pass the error to the callback
    }
  };
  
  document.body.appendChild(script);
  return script;
}

/**
 * Check if a script is already loaded
 * @param {string} globalVar - Name of the global variable to check
 * @returns {boolean} - Whether the script is loaded
 */
function isScriptLoaded(globalVar) {
  return typeof window[globalVar] !== 'undefined';
}

export { loadScript, isScriptLoaded };

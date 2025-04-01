
// Script loading utilities
console.log('Script loading utilities initialized');

/**
 * Load a script with error handling and CDN fallbacks
 * @param {string} src - Script source URL
 * @param {Function} callback - Callback function when script loads
 * @param {Object} attributes - Additional script attributes
 * @returns {HTMLScriptElement} - The created script element
 */
function loadScript(src, callback, attributes = {}) {
  console.log("Loading script:", src);
  
  // Check if we should use the CORS proxy helper
  if (window.__loadScriptWithCORS && 
      (src.includes('unpkg.com') || 
       src.includes('cdn.jsdelivr.net') || 
       src.includes('cdn.gpteng.co'))) {
    return window.__loadScriptWithCORS(src, callback, attributes);
  }
  
  const script = document.createElement('script');
  script.src = src;
  
  // Apply additional attributes if provided
  if (attributes) {
    for (const key in attributes) {
      script.setAttribute(key, attributes[key]);
    }
  }
  
  script.onload = function() {
    console.log("Script loaded successfully:", src);
    if (callback) callback();
  };
  
  script.onerror = function(error) {
    console.error('Failed to load script:', src, error);
    
    // Try fallback CDN if this is a CDN script
    if (src.includes('unpkg.com')) {
      const fallbackSrc = src.replace('unpkg.com', 'cdn.jsdelivr.net/npm');
      console.log("Trying fallback CDN:", fallbackSrc);
      loadScript(fallbackSrc, callback, attributes);
    } else if (callback) {
      callback(error); // Pass the error to the callback
    }
  };
  
  document.body.appendChild(script);
  return script;
}

/**
 * Check if a script is already loaded by testing for a global variable
 * @param {string} globalVar - Name of the global variable to check
 * @returns {boolean} - Whether the script is loaded
 */
function isScriptLoaded(globalVar) {
  return typeof window[globalVar] !== 'undefined';
}

// Expose utilities to window
window.__scriptLoader = {
  loadScript,
  isScriptLoaded
};

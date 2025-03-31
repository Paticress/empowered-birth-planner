
// Script loading utilities
console.log('Script loader utilities initialized');

// Load scripts with error handling and fallbacks
function loadScript(src, callback, attributes = {}) {
  console.log("Utils/script-loader - Loading script:", src);
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
    } else {
      if (callback) callback(error); // Pass the error to the callback
    }
  };
  
  document.body.appendChild(script);
  return script;
}

// Check if a script is already loaded
function isScriptLoaded(globalVar) {
  return typeof window[globalVar] !== 'undefined';
}

export { loadScript, isScriptLoaded };


// Script loading utilities
console.log('Script loader utilities initialized');

// Load scripts with error handling and fallbacks
function loadScript(src, callback, attributes = {}) {
  console.log("Utils/script-loader - Loading script:", src);
  
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
    } else if (src.includes('cdn.jsdelivr.net')) {
      const fallbackSrc = src.replace('cdn.jsdelivr.net/npm', 'unpkg.com');
      console.log("Trying fallback CDN:", fallbackSrc);
      loadScript(fallbackSrc, callback, attributes);
    } else if (src.includes('cdn.gpteng.co')) {
      console.log("GPT Engineer script failed to load, trying local fallback");
      
      // Handle GPT Engineer script fallback
      if (src.includes('gptengineer.js')) {
        // Create a basic implementation as fallback
        window.gptengineer = window.gptengineer || {
          createSelect: function() {
            console.log("GPT Engineer select functionality is unavailable");
            return null;
          }
        };
        
        if (callback) callback();
      } else {
        if (callback) callback(error); // Pass the error to the callback
      }
    } else {
      if (callback) callback(error); // Pass the error to the callback
    }
  };
  
  // Add script to document
  if (attributes.type === 'module' && !supportsModules()) {
    console.log("Browser doesn't support ES modules, converting to regular script");
    script.type = 'text/javascript';
  }
  
  document.body.appendChild(script);
  return script;
}

// Check if a script is already loaded
function isScriptLoaded(globalVar) {
  return typeof window[globalVar] !== 'undefined';
}

// Check if browser supports ES modules
function supportsModules() {
  try {
    new Function('import("")');
    return true;
  } catch (err) {
    return false;
  }
}

// Load a local fallback for a script that failed to load from CDN
function loadLocalFallback(scriptName, callback) {
  const script = document.createElement('script');
  script.src = `/assets/${scriptName}`;
  script.onload = callback;
  script.onerror = function() {
    console.error(`Failed to load local fallback for ${scriptName}`);
    callback(new Error(`Failed to load ${scriptName} from all sources`));
  };
  document.body.appendChild(script);
}

export { loadScript, isScriptLoaded, supportsModules, loadLocalFallback };

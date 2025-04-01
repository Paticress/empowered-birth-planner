
// Browser compatibility script to enhance loading capabilities
console.log("Browser compatibility utilities loaded");

(function() {
  // Feature detection for ES modules
  var supportsModules = false;
  try {
    new Function('import("")');
    supportsModules = true;
  } catch (err) {
    console.log("ES modules not supported in this browser");
  }
  
  // Set a flag for module support on window
  window.__SUPPORTS_MODULES = supportsModules;
  
  // Add enhanced script loading utility
  window.__loadScriptWithCORS = function(src, callback, attributes) {
    console.log("Loading script with CORS support:", src);
    
    var script = document.createElement('script');
    script.src = src;
    script.crossOrigin = "anonymous";
    
    // Apply additional attributes if provided
    if (attributes) {
      for (var key in attributes) {
        script.setAttribute(key, attributes[key]);
      }
    }
    
    script.onload = function() {
      console.log("Script loaded successfully:", src);
      if (typeof callback === 'function') callback();
    };
    
    script.onerror = function(error) {
      console.error("Failed to load script:", src, error);
      
      // Try an alternative CDN
      var altSrc = src;
      if (src.includes('unpkg.com')) {
        altSrc = src.replace('unpkg.com', 'cdn.jsdelivr.net/npm');
      } else if (src.includes('cdn.jsdelivr.net')) {
        altSrc = src.replace('cdn.jsdelivr.net/npm', 'unpkg.com');
      }
      
      if (altSrc !== src) {
        console.log("Trying alternative source:", altSrc);
        var altScript = document.createElement('script');
        altScript.src = altSrc;
        altScript.crossOrigin = "anonymous";
        
        // Copy attributes
        if (attributes) {
          for (var key in attributes) {
            altScript.setAttribute(key, attributes[key]);
          }
        }
        
        altScript.onload = function() {
          console.log("Alternative script loaded successfully:", altSrc);
          if (typeof callback === 'function') callback();
        };
        
        altScript.onerror = function() {
          console.error("Failed to load alternative script:", altSrc);
          if (typeof callback === 'function') callback(new Error("Failed to load script"));
        };
        
        document.body.appendChild(altScript);
      } else {
        if (typeof callback === 'function') callback(error);
      }
    };
    
    document.body.appendChild(script);
    return script;
  };
  
  // Detect browser capabilities
  var browserInfo = {
    userAgent: navigator.userAgent,
    vendor: navigator.vendor,
    language: navigator.language,
    cookieEnabled: navigator.cookieEnabled,
    supportsModules: supportsModules,
    supportsPromises: typeof Promise !== 'undefined',
    supportsWebWorkers: typeof Worker !== 'undefined',
    supportsLocalStorage: (function() {
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
      } catch (e) {
        return false;
      }
    })(),
    supportsFetch: typeof fetch !== 'undefined'
  };
  
  // Log browser capabilities
  console.log("Browser capabilities:", browserInfo);
  
  // Export browser info
  window.__browserInfo = browserInfo;
  
  // Add a simple module polyfill for older browsers
  if (!supportsModules) {
    console.log("Adding module polyfill");
    
    // Simple module loading polyfill
    window.importModule = function(url) {
      return new Promise(function(resolve, reject) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onload = function() {
          console.log("Module loaded via polyfill:", url);
          resolve();
        };
        script.onerror = function() {
          console.error("Failed to load module via polyfill:", url);
          reject(new Error("Failed to load module: " + url));
        };
        document.body.appendChild(script);
      });
    };
  }
  
  // Ensure React and ReactDOM are loaded
  function ensureReactLoaded(callback) {
    if (window.React && window.ReactDOM) {
      console.log("React and ReactDOM already available");
      callback();
      return;
    }
    
    // Load React
    window.__loadScriptWithCORS(
      'https://unpkg.com/react@18/umd/react.production.min.js',
      function() {
        console.log("React loaded");
        
        // Load ReactDOM
        window.__loadScriptWithCORS(
          'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
          function() {
            console.log("ReactDOM loaded");
            callback();
          }
        );
      }
    );
  }
  
  // Add the React loader utility
  window.__ensureReactLoaded = ensureReactLoaded;
  
  // Try to auto-load dependencies in the background
  setTimeout(function() {
    ensureReactLoaded(function() {
      console.log("React dependencies pre-loaded");
    });
  }, 1000);
})();

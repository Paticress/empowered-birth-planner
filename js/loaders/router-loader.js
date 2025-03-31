
// React Router DOM loading module
(function() {
  console.log("React Router loader initialized");
  
  // Function to load React Router
  function loadReactRouter(callback) {
    if (window.__SCRIPT_LOAD_STATE.reactRouter) {
      callback();
      return;
    }
    
    // Check if ReactRouterDOM is already defined
    if (typeof ReactRouterDOM !== 'undefined') {
      console.log("ReactRouterDOM already loaded");
      window.__SCRIPT_LOAD_STATE.reactRouter = true;
      callback();
      return;
    }
    
    console.log("Attempting to load ReactRouterDOM with enhanced protection");
    
    // Try different approaches in sequence
    if (window.__loadScriptWithCORS) {
      window.__loadScriptWithCORS(
        "https://unpkg.com/react-router-dom@6/umd/react-router-dom.production.min.js",
        function() {
          console.log("ReactRouterDOM loaded via CORS proxy");
          window.__SCRIPT_LOAD_STATE.reactRouter = true;
          callback();
        },
        { crossorigin: "anonymous" }
      );
    } else {
      // Try fetch approach first
      fetch("https://unpkg.com/react-router-dom@6/umd/react-router-dom.production.min.js", {
        mode: 'cors',
        credentials: 'omit'
      })
      .then(response => response.text())
      .then(content => {
        // Create an inline script with the content
        const inlineScript = document.createElement('script');
        inlineScript.textContent = content;
        inlineScript.onload = function() {
          console.log("ReactRouterDOM loaded via fetch/inline");
          window.__SCRIPT_LOAD_STATE.reactRouter = true;
          callback();
        };
        document.head.appendChild(inlineScript);
      })
      .catch(error => {
        console.error("Fetch failed for ReactRouterDOM:", error);
        
        // Fall back to direct script tag
        window.__scriptLoader.loadScript(
          "https://unpkg.com/react-router-dom@6/umd/react-router-dom.production.min.js",
          function() {
            console.log("ReactRouterDOM loaded via fallback");
            window.__SCRIPT_LOAD_STATE.reactRouter = true;
            callback();
          },
          { crossorigin: "anonymous" }
        );
      });
    }
  }
  
  // Expose the React Router loader
  window.__routerLoader = {
    loadReactRouter: loadReactRouter
  };
})();

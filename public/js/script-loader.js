
// Script loader with enhanced error handling and fallbacks
(function() {
  console.log("Starting enhanced script loading process");
  
  // Flag to track load state and prevent double loading
  window.__SCRIPT_LOAD_STATE = window.__SCRIPT_LOAD_STATE || {
    react: false,
    reactDom: false,
    reactRouter: false,
    gptEngineer: false,
    app: false,
    errorCount: 0
  };
  
  // Function to load React
  function loadReact(callback) {
    if (window.__SCRIPT_LOAD_STATE.react) {
      callback();
      return;
    }
    
    // Check if React is already defined
    if (typeof React !== 'undefined') {
      console.log("React already loaded");
      window.__SCRIPT_LOAD_STATE.react = true;
      callback();
      return;
    }
    
    // Use our enhanced CORS loader if available, otherwise fallback to direct loading
    if (window.__loadScriptWithCORS) {
      window.__loadScriptWithCORS(
        "https://unpkg.com/react@18/umd/react.production.min.js",
        function() {
          console.log("React loaded via CORS proxy");
          window.__SCRIPT_LOAD_STATE.react = true;
          callback();
        },
        { crossorigin: "anonymous" }
      );
    } else {
      // Fallback to direct loading with error handling
      const reactScript = document.createElement('script');
      reactScript.src = "https://unpkg.com/react@18/umd/react.production.min.js";
      reactScript.crossOrigin = "anonymous";
      reactScript.onload = function() {
        console.log("React loaded directly");
        window.__SCRIPT_LOAD_STATE.react = true;
        callback();
      };
      reactScript.onerror = function(error) {
        console.error("Failed to load React:", error);
        window.__SCRIPT_LOAD_STATE.errorCount++;
        
        // Try alternative source
        const altScript = document.createElement('script');
        altScript.src = "https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js";
        altScript.crossOrigin = "anonymous";
        altScript.onload = function() {
          console.log("React loaded from alternative CDN");
          window.__SCRIPT_LOAD_STATE.react = true;
          callback();
        };
        altScript.onerror = function() {
          console.error("All React load attempts failed");
          // Assume the local fallback is good enough and continue
          window.__SCRIPT_LOAD_STATE.react = true;
          callback();
        };
        document.head.appendChild(altScript);
      };
      document.head.appendChild(reactScript);
    }
  }
  
  // Function to load ReactDOM
  function loadReactDOM(callback) {
    if (window.__SCRIPT_LOAD_STATE.reactDom) {
      callback();
      return;
    }
    
    // Check if ReactDOM is already defined
    if (typeof ReactDOM !== 'undefined') {
      console.log("ReactDOM already loaded");
      window.__SCRIPT_LOAD_STATE.reactDom = true;
      callback();
      return;
    }
    
    // Use our enhanced CORS loader if available
    if (window.__loadScriptWithCORS) {
      window.__loadScriptWithCORS(
        "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js",
        function() {
          console.log("ReactDOM loaded via CORS proxy");
          window.__SCRIPT_LOAD_STATE.reactDom = true;
          callback();
        },
        { crossorigin: "anonymous" }
      );
    } else {
      // Fallback to direct loading
      const reactDOMScript = document.createElement('script');
      reactDOMScript.src = "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js";
      reactDOMScript.crossOrigin = "anonymous";
      reactDOMScript.onload = function() {
        console.log("ReactDOM loaded directly");
        window.__SCRIPT_LOAD_STATE.reactDom = true;
        callback();
      };
      reactDOMScript.onerror = function(error) {
        console.error("Failed to load ReactDOM:", error);
        window.__SCRIPT_LOAD_STATE.errorCount++;
        
        // Try alternative source
        const altScript = document.createElement('script');
        altScript.src = "https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.production.min.js";
        altScript.crossOrigin = "anonymous";
        altScript.onload = function() {
          console.log("ReactDOM loaded from alternative CDN");
          window.__SCRIPT_LOAD_STATE.reactDom = true;
          callback();
        };
        altScript.onerror = function() {
          console.error("All ReactDOM load attempts failed");
          // Assume the local fallback is good enough and continue
          window.__SCRIPT_LOAD_STATE.reactDom = true;
          callback();
        };
        document.head.appendChild(altScript);
      };
      document.head.appendChild(reactDOMScript);
    }
  }
  
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
    
    // Try to load React Router with enhanced CORS support
    console.log("Attempting to load ReactRouterDOM with enhanced protection");
    
    // Create a special version of the script tag with explicit allow-origin
    const routerScript = document.createElement('script');
    routerScript.crossOrigin = "anonymous";
    
    // Try different approaches in sequence
    const loadRouter = () => {
      // First try with the CORS proxy helper
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
        // Direct approach with fallbacks
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
          routerScript.src = "https://unpkg.com/react-router-dom@6/umd/react-router-dom.production.min.js";
          routerScript.onload = function() {
            console.log("ReactRouterDOM loaded directly");
            window.__SCRIPT_LOAD_STATE.reactRouter = true;
            callback();
          };
          routerScript.onerror = function(e) {
            console.error("Direct script load failed for ReactRouterDOM:", e);
            
            // Try alternative CDN
            const altScript = document.createElement('script');
            altScript.src = "https://cdn.jsdelivr.net/npm/react-router-dom@6/umd/react-router-dom.production.min.js";
            altScript.crossOrigin = "anonymous";
            altScript.onload = function() {
              console.log("ReactRouterDOM loaded from alternative CDN");
              window.__SCRIPT_LOAD_STATE.reactRouter = true;
              callback();
            };
            altScript.onerror = function() {
              console.error("All ReactRouterDOM load attempts failed, using local fallback");
              // Local fallback should already be loaded, just continue
              window.__SCRIPT_LOAD_STATE.reactRouter = true;
              callback();
            };
            document.head.appendChild(altScript);
          };
          document.head.appendChild(routerScript);
        });
      }
    };
    
    loadRouter();
  }

  // Function to ensure GPT Engineer script is loaded
  function ensureGPTEngineer(callback) {
    if (window.__SCRIPT_LOAD_STATE.gptEngineer) {
      callback();
      return;
    }

    // Check if script exists
    if (typeof window.__gptEngineer !== 'undefined') {
      console.log("GPT Engineer already loaded");
      window.__SCRIPT_LOAD_STATE.gptEngineer = true;
      callback();
      return;
    }

    // Add fallback script
    const fallbackScript = document.createElement('script');
    fallbackScript.src = "/assets/gpteng-fallback.js";
    fallbackScript.onload = function() {
      console.log("GPT Engineer fallback loaded");
      window.__SCRIPT_LOAD_STATE.gptEngineer = true;
      callback();
    };
    document.head.appendChild(fallbackScript);
  }
  
  // Function to initialize the app after dependencies are loaded
  function loadFullAppBundle() {
    if (!window.__SCRIPT_LOAD_STATE.app) {
      console.log("All dependencies loaded, initializing app");
      window.__SCRIPT_LOAD_STATE.app = true;
      
      // Check status of all libraries
      if (window.__checkReactLibs) {
        const status = window.__checkReactLibs();
        console.log("React libraries status:", status);
      }
      
      // Load the main app
      const mainScript = document.createElement('script');
      mainScript.type = "module";
      mainScript.src = "/src/main.js";
      mainScript.onerror = function(error) {
        console.error("Failed to load main app module:", error);
        
        // Try compatibility mode
        const compatScript = document.createElement('script');
        compatScript.src = "/src/compat-entry.js";
        document.body.appendChild(compatScript);
      };
      document.body.appendChild(mainScript);
    }
  }
  
  // Load React, then ReactDOM, then React Router, then ensure GPT Engineer, then the app
  function loadDependencies() {
    loadReact(function() {
      loadReactDOM(function() {
        loadReactRouter(function() {
          ensureGPTEngineer(function() {
            loadFullAppBundle();
          });
        });
      });
    });
  }
  
  // Start the loading process
  loadDependencies();
  
  // Set up error handling for any initialization errors
  window.addEventListener('error', function(event) {
    console.error('Global error caught:', event.message);
    window.__SCRIPT_LOAD_STATE.errorCount++;
    
    if (window.__SCRIPT_LOAD_STATE.errorCount > 5) {
      console.warn("Multiple errors detected, trying compatibility mode");
      if (!window.__COMPAT_ENTRY_LOADED) {
        const compatScript = document.createElement('script');
        compatScript.src = '/src/compat-entry.js';
        document.body.appendChild(compatScript);
      }
    }
  });
})();

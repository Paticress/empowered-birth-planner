
// Script loader with enhanced error handling and fallbacks
(function() {
  console.log("Starting enhanced script loading process");
  
  // Load core script loader first
  function loadDependencyModules() {
    const coreScript = document.createElement('script');
    coreScript.src = "/js/loaders/core-loader.js";
    coreScript.onload = function() {
      loadModules();
    };
    coreScript.onerror = function() {
      console.error("Failed to load core loader, fallback to direct loading");
      fallbackLoading();
    };
    document.head.appendChild(coreScript);
  }
  
  // Load all the modules in sequence
  function loadModules() {
    const modules = [
      "/js/loaders/react-loader.js",
      "/js/loaders/router-loader.js",
      "/js/loaders/gpteng-loader.js",
      "/js/loaders/app-initializer.js"
    ];
    
    let moduleIndex = 0;
    
    function loadNextModule() {
      if (moduleIndex >= modules.length) {
        startLoadSequence();
        return;
      }
      
      const moduleScript = document.createElement('script');
      moduleScript.src = modules[moduleIndex];
      moduleScript.onload = function() {
        moduleIndex++;
        loadNextModule();
      };
      moduleScript.onerror = function() {
        console.error("Failed to load module:", modules[moduleIndex]);
        moduleIndex++;
        loadNextModule();
      };
      document.head.appendChild(moduleScript);
    }
    
    loadNextModule();
  }
  
  // Orchestrate loading sequence
  function startLoadSequence() {
    if (window.__reactLoader && window.__routerLoader && window.__gptEngLoader && window.__appInitializer) {
      window.__appInitializer.setupErrorHandling();
      
      window.__reactLoader.loadReact(function() {
        window.__reactLoader.loadReactDOM(function() {
          window.__routerLoader.loadReactRouter(function() {
            window.__gptEngLoader.ensureGPTEngineer(function() {
              window.__appInitializer.initializeApp();
            });
          });
        });
      });
    } else {
      console.error("Some modules failed to load, falling back to direct loading");
      fallbackLoading();
    }
  }
  
  // Fallback to directly loading all scripts if modules fail
  function fallbackLoading() {
    console.log("Using fallback loading process");
    
    // Simplified inline versions of the critical loaders
    const loadReact = function(callback) {
      const reactScript = document.createElement('script');
      reactScript.src = "https://unpkg.com/react@18/umd/react.production.min.js";
      reactScript.crossOrigin = "anonymous";
      reactScript.onload = function() {
        callback();
      };
      reactScript.onerror = function() {
        const altScript = document.createElement('script');
        altScript.src = "https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js";
        altScript.crossOrigin = "anonymous";
        altScript.onload = callback;
        altScript.onerror = callback; // Continue anyway
        document.head.appendChild(altScript);
      };
      document.head.appendChild(reactScript);
    };
    
    const loadReactDOM = function(callback) {
      const reactDOMScript = document.createElement('script');
      reactDOMScript.src = "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js";
      reactDOMScript.crossOrigin = "anonymous";
      reactDOMScript.onload = callback;
      reactDOMScript.onerror = function() {
        const altScript = document.createElement('script');
        altScript.src = "https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.production.min.js";
        altScript.crossOrigin = "anonymous";
        altScript.onload = callback;
        altScript.onerror = callback; // Continue anyway
        document.head.appendChild(altScript);
      };
      document.head.appendChild(reactDOMScript);
    };
    
    const loadReactRouter = function(callback) {
      const routerScript = document.createElement('script');
      routerScript.src = "https://unpkg.com/react-router-dom@6/umd/react-router-dom.production.min.js";
      routerScript.crossOrigin = "anonymous";
      routerScript.onload = callback;
      routerScript.onerror = function() {
        const altScript = document.createElement('script');
        altScript.src = "https://cdn.jsdelivr.net/npm/react-router-dom@6/umd/react-router-dom.production.min.js";
        altScript.crossOrigin = "anonymous";
        altScript.onload = callback;
        altScript.onerror = callback; // Continue anyway
        document.head.appendChild(altScript);
      };
      document.head.appendChild(routerScript);
    };
    
    const loadApp = function() {
      const mainScript = document.createElement('script');
      mainScript.type = "module";
      mainScript.src = "/src/main.js";
      mainScript.onerror = function() {
        const compatScript = document.createElement('script');
        compatScript.src = "/src/compat-entry.js";
        document.body.appendChild(compatScript);
      };
      document.body.appendChild(mainScript);
    };
    
    // Run the fallback loading sequence
    loadReact(function() {
      loadReactDOM(function() {
        loadReactRouter(function() {
          loadApp();
        });
      });
    });
  }
  
  // Start the loading process
  loadDependencyModules();
})();

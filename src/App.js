
// App.js - Non-module bridge file for maximum compatibility
(function() {
  try {
    console.log("App.js - Attempting to hydrate the full application");
    
    // Only proceed if we haven't already initialized the full app
    if (window.__FULL_APP_LOADED) {
      console.log("App.js - Full application already loaded");
      return;
    }
    
    window.__FULL_APP_LOADED = true;
    
    // Import dependencies
    import('./utils/reactLoader.js')
      .then(reactLoader => {
        // Check React dependencies
        reactLoader.loadReactDependencies(() => {
          // Import script loader
          import('./utils/scriptLoader.js')
            .then(scriptLoader => {
              scriptLoader.initApp();
            })
            .catch(error => {
              console.error("App.js - Error importing script loader:", error);
              fallbackToBasicContent();
            });
        });
      })
      .catch(error => {
        console.error("App.js - Error importing React loader:", error);
        fallbackToBasicContent();
      });
    
    // Fallback function when everything else fails
    function fallbackToBasicContent() {
      console.error("App.js - Critical error, falling back to basic content");
      var rootElement = document.getElementById('root');
      if (rootElement) {
        rootElement.innerHTML = '<div style="text-align: center; padding: 40px;"><h1>Guia de Plano de Parto</h1><p>Ocorreu um erro ao carregar a aplicação. Por favor, tente novamente mais tarde.</p></div>';
      }
    }
  } catch (outerError) {
    console.error("App.js - Critical error:", outerError);
    
    // Try to render basic UI when everything else fails
    var rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = '<div style="text-align: center; padding: 40px;"><h1>Guia de Plano de Parto</h1><p>Ocorreu um erro ao carregar a aplicação. Por favor, tente novamente mais tarde.</p></div>';
    }
  }
})();

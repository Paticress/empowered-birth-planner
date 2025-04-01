
// Script loading utilities
console.log('ScriptLoader - Initializing script loader');

/**
 * Load a script with error handling
 * @param {string} src - The script source URL
 * @param {Function} callback - Callback function
 */
function loadScript(src, callback) {
  console.log("ScriptLoader - Loading script:", src);
  
  var script = document.createElement('script');
  script.src = src;
  script.type = 'text/javascript';
  
  script.onload = function() {
    console.log("ScriptLoader - Successfully loaded:", src);
    if (callback) callback();
  };
  
  script.onerror = function(error) {
    console.error("ScriptLoader - Failed to load:", src, error);
    if (callback) callback(error);
  };
  
  document.body.appendChild(script);
}

/**
 * Initialize the application
 */
function initApp() {
  try {
    // Try to load the App component from source
    loadScript('./src/main.js', function() {
      console.log("ScriptLoader - Successfully loaded main.js");
      setTimeout(() => {
        // Import the app renderer
        import('./appRenderer.js').then(module => {
          module.renderAppComponent();
        }).catch(error => {
          console.error("ScriptLoader - Error importing app renderer:", error);
          import('./fallbackApp.js').then(module => {
            const rootElement = document.getElementById('root');
            if (rootElement) {
              module.createBasicAppContent(rootElement);
            }
          });
        });
      }, 300);
    });
  } catch (err) {
    console.error("ScriptLoader - Error loading App:", err);
    // Simple fallback if modules aren't working
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = '<div style="text-align: center; padding: 40px;"><h1>Guia de Plano de Parto</h1><p>Ocorreu um erro ao carregar a aplicação. Por favor, tente novamente mais tarde.</p></div>';
    }
  }
}

export { loadScript, initApp };

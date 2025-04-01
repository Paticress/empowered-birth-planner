
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
    
    // Try alternative CDN if available
    if (src.includes('unpkg.com')) {
      console.log("ScriptLoader - Trying alternative CDN for:", src);
      const altSrc = src.replace('unpkg.com', 'cdn.jsdelivr.net/npm');
      loadScript(altSrc, callback);
      return;
    }
    
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
    loadScript('./src/App.js', function() {
      console.log("ScriptLoader - Successfully loaded App.js");
      setTimeout(() => {
        if (window.__appRenderer && window.__appRenderer.renderAppComponent) {
          window.__appRenderer.renderAppComponent();
        } else {
          // Try direct rendering as fallback
          try {
            const rootElement = document.getElementById('root');
            if (rootElement && window.App && window.React && window.ReactDOM) {
              if (window.ReactDOM.createRoot) {
                window.ReactDOM.createRoot(rootElement).render(window.React.createElement(window.App));
              } else {
                window.ReactDOM.render(window.React.createElement(window.App), rootElement);
              }
              console.log("ScriptLoader - App rendered successfully with direct rendering");
            } else {
              throw new Error("Required components not available");
            }
          } catch (renderError) {
            console.error("ScriptLoader - Error rendering app:", renderError);
            useFallback();
          }
        }
      }, 300);
    });
  } catch (err) {
    console.error("ScriptLoader - Error loading App:", err);
    useFallback();
  }
  
  function useFallback() {
    // Try fallback renderer
    if (window.__fallbackApp && window.__fallbackApp.createBasicContent) {
      const rootElement = document.getElementById('root');
      if (rootElement) {
        window.__fallbackApp.createBasicContent(rootElement);
      }
    } else {
      // Simple fallback if nothing else works
      const rootElement = document.getElementById('root');
      if (rootElement) {
        rootElement.innerHTML = '<div style="text-align: center; padding: 40px;"><h1>Guia de Plano de Parto</h1><p>Ocorreu um erro ao carregar a aplicação. Por favor, tente novamente mais tarde.</p></div>';
      }
    }
  }
}

export { loadScript, initApp };

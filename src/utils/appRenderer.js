
// App rendering utilities
console.log('AppRenderer - Initializing app renderer');

/**
 * Renders the App component
 */
function renderAppComponent() {
  try {
    console.log("AppRenderer - Rendering full App component");
    var rootElement = document.getElementById('root');
    
    if (rootElement) {
      // Check if App is properly loaded
      if (typeof window.App !== 'function' && typeof window.App !== 'object') {
        console.error("AppRenderer - App component not properly loaded, using basic content");
        renderBasicContent();
        return;
      }
      
      // Use React 18's createRoot API if available
      if (window.ReactDOM && window.ReactDOM.createRoot) {
        console.log("AppRenderer - Using React 18 createRoot API");
        try {
          var root = window.ReactDOM.createRoot(rootElement);
          root.render(window.React.createElement(window.App));
          console.log("AppRenderer - App component successfully rendered with createRoot");
        } catch (err) {
          console.error("AppRenderer - Error with createRoot API:", err);
          // Try fallback to older render method
          if (window.ReactDOM.render) {
            console.log("AppRenderer - Falling back to legacy render API");
            window.ReactDOM.render(window.React.createElement(window.App), rootElement);
            console.log("AppRenderer - App component successfully rendered with legacy API");
          } else {
            throw err; // Re-throw if no fallback
          }
        }
      } else {
        // Fallback for older React versions
        console.log("AppRenderer - Using legacy React render API");
        window.ReactDOM.render(window.React.createElement(window.App), rootElement);
        console.log("AppRenderer - App component successfully rendered with legacy API");
      }
    } else {
      console.error("AppRenderer - Root element not found in DOM");
    }
  } catch (err) {
    console.error("AppRenderer - Error rendering App component:", err);
    renderBasicContent();
  }
}

/**
 * Render basic content as fallback
 */
function renderBasicContent() {
  console.log("AppRenderer - Rendering basic content as fallback");
  var rootElement = document.getElementById('root');
  if (!rootElement) return;
  
  // Try to use the fallback app if available
  if (window.__fallbackApp && window.__fallbackApp.createBasicContent) {
    window.__fallbackApp.createBasicContent(rootElement);
  } else {
    // Create a simple loader message
    rootElement.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <h1>Guia de Plano de Parto</h1>
        <p>Carregando conteúdo...</p>
        <div style="width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #3498db; border-radius: 50%; margin: 20px auto; animation: spin 1s linear infinite;"></div>
        <style>@keyframes spin {0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }}</style>
      </div>
    `;
  }
}

// Expose to window for non-module environments
if (typeof window !== 'undefined') {
  window.__appRenderer = {
    renderAppComponent,
    renderBasicContent
  };
}

// Try exporting for module environments, but wrapped in try/catch to avoid errors in non-module contexts
try {
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
      renderAppComponent,
      renderBasicContent
    };
  } else if (typeof exports !== 'undefined') {
    exports.renderAppComponent = renderAppComponent;
    exports.renderBasicContent = renderBasicContent;
  }
} catch (e) {
  console.warn("AppRenderer - Exports not supported in this context");
}


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
      if (typeof window.App !== 'function') {
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
  
  createBasicAppContent(rootElement);
}

export { renderAppComponent, renderBasicContent };

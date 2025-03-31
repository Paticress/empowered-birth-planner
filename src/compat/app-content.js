
// Application content loading and rendering for compatibility mode
import { showError, createSimpleApp } from './ui.js';
import { loadAppWithRetry } from './app-loader.js';

console.log("Compat/app-content.js - App content handler initialized");

// Load the application content
function loadAppContent() {
  try {
    // Create a basic app with React Router
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      console.error("Compat - Root element not found");
      return;
    }
    
    // Create a simple fallback app
    const SimpleApp = createSimpleApp;
    
    // Render the simple app
    if (ReactDOM.createRoot) {
      ReactDOM.createRoot(rootElement).render(React.createElement(SimpleApp));
    } else {
      ReactDOM.render(React.createElement(SimpleApp), rootElement);
    }
    
    console.log("Compat - Basic application rendered");
    
    // Try to load the full app script with retries
    loadAppWithRetry();
  } catch (error) {
    console.error("Compat - Critical error:", error);
    showError("Ocorreu um erro crítico ao carregar a aplicação. Por favor, tente novamente mais tarde.");
  }
}

export { loadAppContent };

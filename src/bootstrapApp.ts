
// Application bootstrap initialization
import { handleGlobalError } from './utils/errorHandling';
import { renderApp } from './utils/appRendering';

console.log("Application bootstrapping module loaded");

// Flag to track if bootstrap has already executed
let bootstrapExecuted = false;

/**
 * Bootstrap the application with error handling
 */
export function bootstrapApplication(): void {
  if (bootstrapExecuted) {
    console.log("Bootstrap already executed, skipping initialization");
    return;
  }
  
  bootstrapExecuted = true;
  console.log("Application bootstrapping started");
  
  // Set up global error handler
  if (typeof window !== 'undefined') {
    window.onerror = window.onerror || handleGlobalError;
  }

  // Import App dynamically to prevent module errors
  import('./App').then(module => {
    // Store App component in window for compatibility
    window.App = module.default;
    console.log("App module imported successfully");
    
    // Render the main App
    renderApp(module.default);
  }).catch(error => {
    console.error("Error importing App:", error);
    
    // Let the error handling system handle the fallback
    handleGlobalError(`Failed to import App: ${error.message}`, undefined, undefined, undefined, error);
  });
}

declare global {
  interface Window {
    __MAIN_EXECUTED?: boolean;
    ReactRouterDOM?: any;
    __FULL_APP_LOADED?: boolean;
    App?: React.ComponentType<any>;
    __appLoader?: () => void;
    React?: any;
    ReactDOM?: any;
  }
}

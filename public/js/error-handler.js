
// Global error handling utilities
(function() {
  console.log("[Error Handler] Initializing enhanced error handling");
  
  // Setup global error handler
  window.onerror = function(message, source, lineno, colno, error) {
    console.error("[Error Handler] Global error caught:", { message, source, lineno, colno, error });
    
    // Track errors for debugging
    window.__APP_ERRORS = window.__APP_ERRORS || [];
    window.__APP_ERRORS.push({
      message: message,
      source: source,
      lineno: lineno,
      colno: colno,
      stack: error && error.stack,
      time: new Date().toISOString()
    });
    
    // Check if it's a module error (for fallback handling)
    if (typeof message === 'string' && 
        (message.includes('import.meta') || message.includes('module') || message.includes('MIME'))) {
      console.warn("[Error Handler] Module/MIME error detected, may require compatibility mode");
      
      // For GPT Engineer specifically, create a fallback
      if (source && source.includes('gptengineer.js')) {
        console.log("[Error Handler] Providing fallback for GPT Engineer");
        window.gptengineer = window.gptengineer || {
          createSelect: function() { return null; },
          isAvailable: function() { return false; }
        };
      }
      
      return true; // Prevent the error from showing in console
    }
    
    return false; // Let other error handlers run
  };
  
  // Add unhandledrejection handler for promises
  window.addEventListener('unhandledrejection', function(event) {
    console.error('[Error Handler] Unhandled promise rejection:', event.reason);
    
    // Track errors for debugging
    window.__APP_ERRORS = window.__APP_ERRORS || [];
    window.__APP_ERRORS.push({
      type: 'unhandledrejection',
      message: event.reason ? (event.reason.message || String(event.reason)) : 'Unknown promise rejection',
      stack: event.reason && event.reason.stack,
      time: new Date().toISOString()
    });
  });
  
  // Function to show error message in the UI
  function showErrorMessage(message) {
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="text-align: center; padding: 20px;">
          <h1>Erro ao carregar</h1>
          <p>${message}</p>
          <p><a href="/" style="color: #0066ff; text-decoration: none;" onclick="window.location.reload(); return false;">Tentar novamente</a></p>
        </div>
      `;
    }
  }
  
  // Expose the error handler functionality
  window.__errorHandler = {
    showError: showErrorMessage,
    getErrors: function() { return window.__APP_ERRORS || []; }
  };
  
  console.log("[Error Handler] Enhanced error handling initialized");
})();

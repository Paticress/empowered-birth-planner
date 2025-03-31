
// Error handling utilities
console.log('Error handler initialized');

// Show error message in the root element
function showError(message) {
  console.error("Application error:", message);
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

// Setup global error handler
function setupGlobalErrorHandler() {
  window.onerror = function(message, source, lineno, colno, error) {
    console.error('Global error caught:', { message, source, lineno, colno, error });
    
    // Check if it's a module error (for fallback handling)
    if (typeof message === 'string' && 
        (message.includes('import.meta') || message.includes('module') || message.includes('MIME'))) {
      console.warn('Module/MIME error detected, falling back to compatibility mode');
      return true; // Prevents the error from being reported to the console
    }
    
    return false; // Let other error handlers run
  };
}

export { showError, setupGlobalErrorHandler };


// Error handling utilities for application initialization
console.log("Loading error handling utilities");

/**
 * Global error handler for catching module-related errors
 */
export function handleGlobalError(
  message: string | Event, 
  source?: string, 
  lineno?: number, 
  colno?: number, 
  error?: Error
): boolean {
  console.error('Global error caught:', { message, source, lineno, colno, error });
  
  // Check if we're getting module-related errors
  if (typeof message === 'string' && 
      (message.includes('import.meta') || 
       message.includes('module') || 
       message.includes('MIME'))) {
    
    console.warn('Module/MIME error detected, falling back to compatibility mode');
    
    // Create a message in the root element
    const rootEl = document.getElementById('root');
    if (rootEl) {
      rootEl.innerHTML = `
        <div style="text-align: center; padding: 20px;">
          <h2>Carregando em modo alternativo...</h2>
          <p>Aguarde um momento enquanto carregamos a aplicação.</p>
        </div>
      `;
    }
    
    // Load the compatibility script
    const script = document.createElement('script');
    script.src = '/src/compat-entry.js';
    script.type = 'text/javascript';
    document.body.appendChild(script);
    
    // Prevent further execution of this script
    return true;
  }
  
  return false;
}

/**
 * Show a simple loading UI while the app initializes
 */
export function renderSimpleLoadingApp(): React.FC {
  return () => {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold">Guia de Plano de Parto</h1>
        <p className="mt-4">Carregando conteúdo...</p>
        <div className="w-12 h-12 border-t-4 border-blue-500 rounded-full animate-spin mx-auto mt-4" />
      </div>
    );
  };
}

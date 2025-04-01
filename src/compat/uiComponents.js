
// UI components for compatibility mode
console.log("Compat/uiComponents.js - UI components initialized");

/**
 * Create a simple loading UI
 */
function createLoadingUI() {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;
  
  if (window.React && window.ReactDOM) {
    const LoadingApp = function() {
      return React.createElement('div', { style: { textAlign: 'center', padding: '20px' } },
        React.createElement('h1', null, "Guia de Plano de Parto"),
        React.createElement('p', null, "Carregando conteúdo..."),
        React.createElement('div', { style: { 
          width: '40px', 
          height: '40px', 
          margin: '20px auto',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 2s linear infinite'
        } })
      );
    };
    
    // Add a style for the spinner
    const style = document.createElement('style');
    style.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
    document.head.appendChild(style);
    
    // Render the basic app
    try {
      if (window.ReactDOM.createRoot) {
        window.ReactDOM.createRoot(rootElement).render(React.createElement(LoadingApp));
      } else {
        window.ReactDOM.render(React.createElement(LoadingApp), rootElement);
      }
    } catch (error) {
      console.error("Failed to render simple app:", error);
      rootElement.innerHTML = '<div style="text-align: center; padding: 20px;"><h2>Carregando...</h2><div class="spinner"></div></div>';
    }
  } else {
    rootElement.innerHTML = '<div style="text-align: center; padding: 20px;"><h2>Carregando...</h2><div class="spinner"></div></div>';
  }
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <h1>Erro ao carregar</h1>
        <p>${message}</p>
        <p><a href="/" onclick="window.location.reload(); return false;">Tentar novamente</a></p>
      </div>
    `;
  }
}

export { createLoadingUI, showError };

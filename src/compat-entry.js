
// Compatibility entry point
// This file is deliberately not a module to ensure maximum compatibility
(function() {
  console.log('Loading compatibility entry point');
  
  // Helper function to create a basic loading UI
  function showLoadingUI() {
    var rootEl = document.getElementById('root');
    if (rootEl) {
      rootEl.innerHTML = `
        <div style="font-family: system-ui, -apple-system, sans-serif; text-align: center; padding: 2rem;">
          <h1>Guia de Plano de Parto</h1>
          <p>Carregando a aplicação...</p>
          <div style="margin: 2rem auto; width: 50%; height: 6px; background: #eee; border-radius: 3px; overflow: hidden;">
            <div style="width: 50%; height: 100%; background: #0066ff; animation: progress 2s infinite linear;"></div>
          </div>
          <style>
            @keyframes progress {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          </style>
        </div>
      `;
    }
  }
  
  // Show loading UI immediately
  showLoadingUI();
  
  // Load the main application code
  function loadMainScript() {
    var script = document.createElement('script');
    script.src = '/src/main.js';
    script.type = 'text/javascript';
    script.onerror = function() {
      console.error('Failed to load main script');
      var rootEl = document.getElementById('root');
      if (rootEl) {
        rootEl.innerHTML = `
          <div style="font-family: system-ui, -apple-system, sans-serif; text-align: center; padding: 2rem;">
            <h1>Erro ao Carregar</h1>
            <p>Não foi possível carregar a aplicação.</p>
            <p><a href="/" style="color: #0066ff; text-decoration: none;">Tentar Novamente</a></p>
          </div>
        `;
      }
    };
    document.body.appendChild(script);
  }
  
  // Load application after a small delay to ensure DOM is ready
  setTimeout(loadMainScript, 100);
})();

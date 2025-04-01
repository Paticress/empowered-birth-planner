
// Application loader module
console.log('Application loader initialized');

/**
 * Creates and renders a simple loading app
 */
function createSimpleApp() {
  console.log("Creating simple loading app");
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error("Root element not found");
    return false;
  }
  
  try {
    if (!window.React || !window.ReactDOM || !window.ReactRouterDOM) {
      console.error("Required libraries not loaded");
      return false;
    }
    
    // Create a simple loading UI with React Router
    const HashRouter = window.ReactRouterDOM.HashRouter;
    const Routes = window.ReactRouterDOM.Routes;
    const Route = window.ReactRouterDOM.Route;
    const Navigate = window.ReactRouterDOM.Navigate;
    
    const LoadingUI = function() {
      return window.React.createElement('div', { className: "text-center py-8 px-4" },
        window.React.createElement('h1', { className: "text-2xl font-bold mb-4" }, "Guia de Plano de Parto"),
        window.React.createElement('p', { className: "mb-4" }, "Carregando conteúdo..."),
        window.React.createElement('div', { className: "w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto" })
      );
    };
    
    const SimpleApp = function() {
      return window.React.createElement(HashRouter, null,
        window.React.createElement(Routes, null,
          window.React.createElement(Route, { path: "/", element: window.React.createElement(Navigate, { to: "/guia-online", replace: true }) }),
          window.React.createElement(Route, { path: "/guia-online", element: window.React.createElement(LoadingUI) }),
          window.React.createElement(Route, { path: "/embedded-guia", element: window.React.createElement(LoadingUI) }),
          window.React.createElement(Route, { path: "/criar-plano", element: window.React.createElement(LoadingUI) }),
          window.React.createElement(Route, { path: "/embedded-plano", element: window.React.createElement(LoadingUI) }),
          window.React.createElement(Route, { path: "*", element: 
            window.React.createElement('div', { style: { padding: '2rem', textAlign: 'center' } },
              window.React.createElement('h1', null, 'Página não encontrada'),
              window.React.createElement('p', null, 'A página que você está procurando não existe.'),
              window.React.createElement('a', { href: '/', style: { color: '#0066ff', textDecoration: 'none' } }, 'Voltar para a página inicial')
            )
          })
        )
      );
    };
    
    // Render the app
    if (window.ReactDOM.createRoot) {
      window.ReactDOM.createRoot(rootElement).render(window.React.createElement(SimpleApp));
    } else {
      window.ReactDOM.render(window.React.createElement(SimpleApp), rootElement);
    }
    
    console.log("Simple app rendered successfully");
    return true;
  } catch (error) {
    console.error("Error rendering simple app:", error);
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="text-align: center; padding: 20px;">
          <h2>Carregando...</h2>
          <div style="width: 40px; height: 40px; margin: 20px auto; border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        </div>
      `;
      
      // Add a style for the spinner
      const style = document.createElement('style');
      style.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
      document.head.appendChild(style);
    }
    return false;
  }
}

/**
 * Load the full application bundle
 */
function loadFullAppBundle() {
  console.log("Loading full application bundle");
  return new Promise((resolve, reject) => {
    try {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '/src/App.js';
      script.onload = function() {
        console.log("Full app bundle loaded successfully");
        resolve(true);
      };
      script.onerror = function(error) {
        console.error("Failed to load full app bundle:", error);
        reject(error);
      };
      document.body.appendChild(script);
    } catch (error) {
      console.error("Error loading full app bundle:", error);
      reject(error);
    }
  });
}

// Expose the app loader API
window.__appLoader = {
  createSimpleApp,
  loadFullAppBundle
};


// App rendering utilities
import { loadScript } from './script-loader.js';
import { showError } from './error-handler.js';

console.log('App renderer initialized');

// Create a simple loading app with React Router
function createSimpleLoadingApp() {
  console.log("Creating simple loading app");
  
  if (!window.React || !window.ReactRouterDOM) {
    console.error("React or ReactRouterDOM not available");
    return null;
  }
  
  const { HashRouter, Routes, Route, Navigate } = window.ReactRouterDOM;
  
  const LoadingContent = function() {
    return window.React.createElement('div', { className: "text-center py-8 px-4" },
      window.React.createElement('h1', { className: "text-2xl font-bold mb-4" }, "Guia de Plano de Parto"),
      window.React.createElement('p', { className: "mb-4" }, "Carregando conteúdo..."),
      window.React.createElement('div', { className: "w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto" })
    );
  };
  
  return function SimpleApp() {
    return window.React.createElement(HashRouter, null,
      window.React.createElement(Routes, null,
        window.React.createElement(Route, { path: "/", element: window.React.createElement(Navigate, { to: "/guia-online", replace: true }) }),
        window.React.createElement(Route, { path: "/guia-online", element: window.React.createElement(LoadingContent) }),
        window.React.createElement(Route, { path: "/embedded-guia", element: window.React.createElement(LoadingContent) }),
        window.React.createElement(Route, { path: "/criar-plano", element: window.React.createElement(LoadingContent) }),
        window.React.createElement(Route, { path: "/embedded-plano", element: window.React.createElement(LoadingContent) }),
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
}

// Render simple app while loading full app
function renderSimpleApp() {
  console.log("Rendering simple app");
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error("Root element not found");
    return false;
  }
  
  try {
    const SimpleApp = createSimpleLoadingApp();
    
    if (!SimpleApp) {
      console.error("Failed to create simple app");
      return false;
    }
    
    // Use React 18's createRoot API if available, fallback to older render method
    if (window.ReactDOM.createRoot) {
      window.ReactDOM.createRoot(rootElement).render(window.React.createElement(SimpleApp));
    } else {
      window.ReactDOM.render(window.React.createElement(SimpleApp), rootElement);
    }
    
    console.log("Simple app rendered successfully");
    return true;
  } catch (err) {
    console.error("Error rendering simple application:", err);
    showError('Erro ao inicializar a aplicação. Tente recarregar a página. Detalhes: ' + err.message);
    return false;
  }
}

// Load the full app bundle
function loadFullAppBundle() {
  console.log("Loading full app bundle");
  
  return new Promise((resolve, reject) => {
    loadScript('/src/App.js', function() {
      console.log("Full app bundle loaded");
      resolve();
    }, { type: 'text/javascript' });
  });
}

export { createSimpleLoadingApp, renderSimpleApp, loadFullAppBundle };

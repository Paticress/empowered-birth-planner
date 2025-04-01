
// Simple router implementation for compatibility mode
import { loadScript, isScriptLoaded } from './scriptLoader.js';

console.log("Compat/simpleRouter.js - Simple router initialized");

/**
 * Create a simple router app
 */
function createSimpleRouter() {
  console.log("Compat - Creating simple router app");
  
  // Try to get the correct object
  const RouterObj = window.ReactRouterDOM || {};
  const HashRouter = RouterObj.HashRouter;
  const Routes = RouterObj.Routes;
  const Route = RouterObj.Route;
  const Navigate = RouterObj.Navigate;
  
  // If any of the objects is missing, build a simple fallback
  if (!HashRouter || !Routes || !Route) {
    console.error("Router components not available, showing simple page");
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="text-align: center; padding: 40px;">
          <h1>Guia de Plano de Parto</h1>
          <p>Bem-vinda ao Guia de Plano de Parto!</p>
          <p>Estamos carregando o conteúdo em modo de compatibilidade.</p>
          <p>Por favor, aguarde ou tente recarregar a página.</p>
        </div>
      `;
    }
    return;
  }
  
  // Create a simple router
  const RouterApp = function() {
    return React.createElement(HashRouter, null,
      React.createElement(Routes, null,
        React.createElement(Route, { 
          path: '/', 
          element: React.createElement(Navigate, { to: '/guia-online', replace: true })
        }),
        React.createElement(Route, { 
          path: '/guia-online', 
          element: React.createElement('div', {
            style: { textAlign: 'center', padding: '40px' }
          }, 
            React.createElement('h1', null, 'Guia de Plano de Parto'),
            React.createElement('p', null, 'Bem-vinda ao Guia de Plano de Parto!'),
            React.createElement('p', null, 'Estamos carregando o conteúdo em modo de compatibilidade.'),
            React.createElement('p', null, 'Por favor, aguarde ou tente recarregar a página.')
          )
        }),
        React.createElement(Route, { 
          path: '/criar-plano', 
          element: React.createElement('div', {
            style: { textAlign: 'center', padding: '40px' }
          }, 
            React.createElement('h1', null, 'Construtor de Plano de Parto'),
            React.createElement('p', null, 'Estamos preparando seu construtor de plano de parto.'),
            React.createElement('p', null, 'Por favor, aguarde um momento...')
          )
        }),
        React.createElement(Route, { 
          path: '*', 
          element: React.createElement('div', {
            style: { textAlign: 'center', padding: '40px' }
          },
            React.createElement('h1', null, 'Página não encontrada'),
            React.createElement('p', null, 'A página que você está procurando não existe.'),
            React.createElement('a', { href: '#/guia-online' }, 'Voltar para o Guia')
          )
        })
      )
    );
  };
  
  const rootElement = document.getElementById('root');
  if (rootElement) {
    try {
      if (window.ReactDOM.createRoot) {
        window.ReactDOM.createRoot(rootElement).render(React.createElement(RouterApp));
      } else {
        window.ReactDOM.render(React.createElement(RouterApp), rootElement);
      }
      console.log("Compat - Simple router app rendered successfully");
    } catch (error) {
      console.error("Failed to render router app:", error);
      rootElement.innerHTML = `
        <div style="text-align: center; padding: 40px;">
          <h1>Guia de Plano de Parto</h1>
          <p>Ocorreu um erro ao carregar a aplicação.</p>
          <p>Por favor, tente recarregar a página.</p>
        </div>
      `;
    }
  }
}

/**
 * Initialize simple router
 */
function initSimpleRouter() {
  console.log("Compat - Initializing simple router");
  
  // Ensure ReactRouter is loaded
  if (!isScriptLoaded('ReactRouterDOM')) {
    loadScript('https://unpkg.com/react-router-dom@6/umd/react-router-dom.production.min.js', function() {
      createSimpleRouter();
    });
  } else {
    createSimpleRouter();
  }
}

export { initSimpleRouter, createSimpleRouter };

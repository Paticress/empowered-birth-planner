
// Basic app fallback
console.log('FallbackApp - Initializing fallback app utilities');

/**
 * Create a simple router-based app as fallback
 * @param {HTMLElement} rootElement - The root DOM element
 */
function createBasicAppContent(rootElement) {
  // Create a simple router-based app
  var SimpleApp = function() {
    return window.React.createElement(window.ReactRouterDOM.HashRouter, null,
      window.React.createElement(window.ReactRouterDOM.Routes, null,
        window.React.createElement(window.ReactRouterDOM.Route, { 
          path: '/', 
          element: window.React.createElement(window.ReactRouterDOM.Navigate, { to: '/guia-online', replace: true })
        }),
        window.React.createElement(window.ReactRouterDOM.Route, { 
          path: '/guia-online', 
          element: window.React.createElement('div', { style: { textAlign: 'center', padding: '40px' } },
            window.React.createElement('h1', null, 'Guia de Plano de Parto'),
            window.React.createElement('p', null, 'Bem-vinda ao Guia de Plano de Parto!'),
            window.React.createElement('p', null, 'Estamos carregando o conteúdo. Por favor, aguarde ou tente recarregar a página.')
          )
        }),
        window.React.createElement(window.ReactRouterDOM.Route, {
          path: '/criar-plano', 
          element: window.React.createElement('div', { style: { textAlign: 'center', padding: '40px' } },
            window.React.createElement('h1', null, 'Construtor de Plano de Parto'),
            window.React.createElement('p', null, 'Estamos preparando seu construtor de plano de parto.'),
            window.React.createElement('p', null, 'Por favor, aguarde um momento...')
          )
        }),
        window.React.createElement(window.ReactRouterDOM.Route, {
          path: '*',
          element: window.React.createElement('div', { style: { textAlign: 'center', padding: '40px' } },
            window.React.createElement('h1', null, 'Página não encontrada'),
            window.React.createElement('p', null, 'A página que você está procurando não existe.'),
            window.React.createElement('a', { href: '#/guia-online' }, 'Voltar para o Guia')
          )
        })
      )
    );
  };
  
  try {
    if (window.ReactDOM.createRoot) {
      window.ReactDOM.createRoot(rootElement).render(window.React.createElement(SimpleApp));
    } else {
      window.ReactDOM.render(window.React.createElement(SimpleApp), rootElement);
    }
    console.log("FallbackApp - Basic routing app rendered successfully");
  } catch (error) {
    console.error("FallbackApp - Error rendering basic content:", error);
    rootElement.innerHTML = '<div style="text-align: center; padding: 40px;"><h1>Guia de Plano de Parto</h1><p>Estamos com dificuldades para carregar o conteúdo. Por favor, tente recarregar a página.</p></div>';
  }
}

// Expose to window for non-module contexts
if (typeof window !== 'undefined') {
  window.__fallbackApp = {
    createBasicContent: createBasicAppContent
  };
}

export { createBasicAppContent };

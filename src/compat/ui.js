
// UI utility functions for compatibility mode
console.log("Compat/ui.js - UI utilities initialized");

// Show error message
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

// Create a simple fallback app component
function createSimpleApp() {
  return React.createElement(ReactRouterDOM.HashRouter, null,
    React.createElement(ReactRouterDOM.Routes, null,
      React.createElement(ReactRouterDOM.Route, { 
        path: "/", 
        element: React.createElement(ReactRouterDOM.Navigate, { to: "/guia-online", replace: true }) 
      }),
      React.createElement(ReactRouterDOM.Route, { 
        path: "/guia-online", 
        element: React.createElement('div', { className: "text-center p-8" },
          React.createElement('h1', { className: "text-2xl font-bold mb-4" }, "Guia de Plano de Parto"),
          React.createElement('p', null, "Carregando conteúdo..."),
          React.createElement('div', { className: "w-12 h-12 border-t-4 border-blue-500 rounded-full animate-spin mx-auto mt-4" })
        )
      }),
      React.createElement(ReactRouterDOM.Route, { 
        path: "/embedded-guia", 
        element: React.createElement('div', { className: "text-center p-8" },
          React.createElement('h1', { className: "text-2xl font-bold mb-4" }, "Guia de Plano de Parto (Versão Incorporada)"),
          React.createElement('p', null, "Carregando versão incorporada..."),
          React.createElement('div', { className: "w-12 h-12 border-t-4 border-blue-500 rounded-full animate-spin mx-auto mt-4" })
        )
      }),
      React.createElement(ReactRouterDOM.Route, { 
        path: "/criar-plano", 
        element: React.createElement('div', { className: "text-center p-8" },
          React.createElement('h1', { className: "text-2xl font-bold mb-4" }, "Construtor de Plano de Parto"),
          React.createElement('p', null, "Carregando construtor..."),
          React.createElement('div', { className: "w-12 h-12 border-t-4 border-blue-500 rounded-full animate-spin mx-auto mt-4" })
        )
      }),
      React.createElement(ReactRouterDOM.Route, { 
        path: "/embedded-plano", 
        element: React.createElement('div', { className: "text-center p-8" },
          React.createElement('h1', { className: "text-2xl font-bold mb-4" }, "Construtor de Plano de Parto (Versão Incorporada)"),
          React.createElement('p', null, "Carregando versão incorporada..."),
          React.createElement('div', { className: "w-12 h-12 border-t-4 border-blue-500 rounded-full animate-spin mx-auto mt-4" })
        )
      }),
      React.createElement(ReactRouterDOM.Route, { 
        path: "*", 
        element: React.createElement('div', { className: "text-center p-8" },
          React.createElement('h1', { className: "text-2xl font-bold mb-4" }, "Página não encontrada"),
          React.createElement('a', { href: "/", className: "text-blue-500" }, "Ir para página inicial")
        )
      })
    )
  );
}

export { showError, createSimpleApp };

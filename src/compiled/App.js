
// Compiled version of App.js for browsers that don't support ES modules
console.log("Compiled App.js - Loading pre-compiled app");

// Define the App component as a global variable
window.App = function() {
  return React.createElement(ReactRouterDOM.HashRouter, null,
    React.createElement(ReactRouterDOM.Routes, null,
      React.createElement(ReactRouterDOM.Route, { 
        path: '/', 
        element: React.createElement(ReactRouterDOM.Navigate, { to: '/guia-online', replace: true })
      }),
      React.createElement(ReactRouterDOM.Route, { 
        path: '/guia-online', 
        element: React.createElement('div', { className: "min-h-screen bg-white" },
          React.createElement('main', { className: "max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6" },
            React.createElement('div', { className: "mb-6" },
              React.createElement('h1', { className: "text-3xl font-bold text-maternal-900" }, "Guia do Parto Respeitoso"),
              React.createElement('p', { className: "text-lg text-maternal-700 mt-2" }, "Seu guia completo para um plano de parto eficaz")
            ),
            React.createElement('p', null, "O conteúdo completo está sendo carregado. Por favor, aguarde ou recarregue a página.")
          )
        )
      }),
      React.createElement(ReactRouterDOM.Route, {
        path: '/criar-plano', 
        element: React.createElement('div', { className: "min-h-screen bg-white" },
          React.createElement('main', { className: "max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6" },
            React.createElement('h1', { className: "text-3xl font-bold mb-4" }, "Construtor de Plano de Parto"),
            React.createElement('p', null, "Estamos carregando o construtor de plano de parto. Por favor, aguarde.")
          )
        )
      }),
      React.createElement(ReactRouterDOM.Route, {
        path: '*',
        element: React.createElement('div', { className: "min-h-screen bg-white" },
          React.createElement('main', { className: "max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6" },
            React.createElement('h1', { className: "text-3xl font-bold mb-4" }, "Página não encontrada"),
            React.createElement('p', { className: "mb-4" }, "A página que você está procurando não existe."),
            React.createElement('a', { 
              href: '#/guia-online',
              className: "text-blue-600 hover:underline"
            }, "Voltar para o Guia")
          )
        )
      })
    )
  );
};

console.log("Compiled App.js - App component created successfully");

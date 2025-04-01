
// Compiled version of App.js for browsers that don't support ES modules
console.log("Compiled App.js - Loading pre-compiled app");

// Define a simple BirthPlanBuilder component that actually renders content
function SimpleBirthPlanBuilder() {
  return React.createElement('div', { className: "min-h-screen bg-white p-6" },
    React.createElement('h1', { className: "text-3xl font-bold mb-4" }, "Construtor de Plano de Parto"),
    React.createElement('p', { className: "mb-6" }, "Seu assistente para criar um plano de parto personalizado"),
    
    React.createElement('div', { className: "bg-blue-50 p-4 rounded-md mb-6" },
      React.createElement('h2', { className: "text-xl font-semibold mb-2" }, "Bem-vinda ao Construtor de Plano de Parto"),
      React.createElement('p', null, "Esta ferramenta ajudará você a criar um plano de parto que reflete suas preferências e necessidades.")
    ),
    
    React.createElement('div', { className: "flex flex-col space-y-4" },
      React.createElement('div', { className: "bg-white p-4 border rounded-md" },
        React.createElement('h3', { className: "font-semibold mb-2" }, "Informações Pessoais"),
        React.createElement('form', { className: "mt-3" },
          React.createElement('div', { className: "mb-3" },
            React.createElement('label', { className: "block text-sm font-medium mb-1" }, "Seu nome:"),
            React.createElement('input', { 
              type: "text", 
              className: "w-full px-3 py-2 border rounded-md",
              placeholder: "Digite seu nome completo" 
            })
          ),
          React.createElement('div', { className: "mb-3" },
            React.createElement('label', { className: "block text-sm font-medium mb-1" }, "Data prevista para o parto:"),
            React.createElement('input', { 
              type: "date", 
              className: "w-full px-3 py-2 border rounded-md" 
            })
          ),
          React.createElement('div', { className: "mb-3" },
            React.createElement('label', { className: "block text-sm font-medium mb-1" }, "Local do parto:"),
            React.createElement('input', { 
              type: "text", 
              className: "w-full px-3 py-2 border rounded-md",
              placeholder: "Hospital, casa de parto, etc." 
            })
          )
        )
      ),
      
      React.createElement('div', { className: "bg-white p-4 border rounded-md" },
        React.createElement('h3', { className: "font-semibold mb-2" }, "Preferências do Parto"),
        React.createElement('p', null, "Ambiente do parto, movimentação durante o trabalho de parto, alívio da dor e outros aspectos importantes.")
      ),
      
      React.createElement('div', { className: "mt-6 flex justify-center" },
        React.createElement('button', {
          className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700",
          onClick: function() { alert('Esta é uma versão simplificada do plano de parto. Recarregue a página para tentar novamente com a versão completa.'); }
        }, "Continuar")
      ),
      
      React.createElement('div', { className: "mt-6" }, 
        React.createElement('p', { className: "text-sm text-gray-600 text-center" }, 
          "Se o conteúdo não estiver carregando completamente, tente recarregar a página. ",
          React.createElement('button', {
            className: "text-blue-600 underline",
            onClick: function() { window.location.reload(); }
          }, "Recarregar")
        )
      )
    )
  );
}

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
            React.createElement(SimpleBirthPlanBuilder)
          )
        )
      }),
      React.createElement(ReactRouterDOM.Route, {
        path: '/embedded-guia', 
        element: React.createElement('div', { className: "min-h-screen bg-white p-4" },
          React.createElement('h1', { className: "text-2xl font-bold mb-4" }, "Guia do Parto Respeitoso (Versão Incorporada)"),
          React.createElement('p', null, "Carregando conteúdo incorporado...")
        )
      }),
      React.createElement(ReactRouterDOM.Route, {
        path: '/embedded-plano', 
        element: React.createElement('div', { className: "min-h-screen bg-white p-4" },
          React.createElement('h1', { className: "text-2xl font-bold mb-4" }, "Construtor de Plano de Parto (Versão Incorporada)"),
          React.createElement('p', null, "Carregando construtor incorporado...")
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
